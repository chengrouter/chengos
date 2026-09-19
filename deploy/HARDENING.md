# 公网部署加固操作指南

面向把 ChengOS 暴露在公网上的部署。分两条路线：**A. Cloudflare Tunnel**（推荐）和
**B. 反向代理**（同机或异机）。两条路的前置步骤相同，从第 2 节开始分叉。

配套脚本在 `deploy/infra/cloudflare/`。

---

## 0. 先理解暴露面

ChengOS 在一台机器上会监听三个端口，它们的**性质完全不同**：

| 服务 | 默认端口 | 谁应该能连 | 说明 |
| --- | --- | --- | --- |
| `cheng-api` | 19225 | **只有本机** | 前端自己代理它。一旦对公网开放，前端上的扫描拦截、限流、安全响应头全部可以被绕过——直接打 API 就行，登录接口就在上面 |
| `ui-server` | 8080 | 反向代理 / cloudflared | 给人访问的界面 |
| `app-server` | 5055 | 反向代理 / cloudflared | 渠道网关 |

前面还有一层 **80/443**，由 cloudflared 或反向代理占用。这一层是唯一应该面向公网的。

> **端口号不是安全措施。** 把 8080 换成一个不常用端口能减少机会型扫描的噪音，但
> masscan 几小时能扫完整个 IPv4 的全部端口，Shodan/Censys 长期在索引。真正起作用的是
> 让端口**不在公网上**，而不是换个号码。做完本指南后，端口号将不再重要。

### 相关 `.env` 键

| 键 | 作用 | 默认 |
| --- | --- | --- |
| `BIND_ADDRESS` | API 监听哪块网卡 | `127.0.0.1` |
| `UI_BIND` / `APP_BIND` | 前端服务监听哪块网卡（仅原生模式） | `0.0.0.0` |
| `TRUSTED_PROXY_IPS` | 哪些代理可以上报访客真实 IP | 空 |
| `TRUST_CLOUDFLARE` | 读 `CF-Connecting-IP` 而非 `X-Forwarded-For` | `false` |
| `CORS_PERMISSIVE` | 是否允许任意源跨域 | `false` |
| `CSP_CONNECT_SRC_EXTRA` | CSP `connect-src` 额外来源 | 空 |

> **`.env` 是实例自有文件，升级永不覆盖。** 上面的默认值只对**新安装**生效。已有部署
> 需要你自己改 `deploy/.env`，并且 `UI_BIND` / `APP_BIND` / `TRUSTED_PROXY_IPS` 这几个键
> 在旧的 `.env` 里根本不存在，要手动添加。

---

## 1. 选哪条路

| | A. Cloudflare Tunnel | B1. 同机反向代理 | B2. 异机反向代理 |
| --- | --- | --- | --- |
| 公网入站端口 | **0 个** | 443 | 443（代理机） |
| 源站 IP 泄漏风险 | 无（源站无监听） | 有，靠防火墙 | 有，靠防火墙 |
| 证书 | Cloudflare 全包 | Cloudflare 或自签/ACME | 同左 |
| 代理→源站那一跳 | 环回，不出网卡 | 环回，不出网卡 | **跨网络，必须处理** |
| 额外机器 | 不需要 | 不需要 | 需要一台 VPS |
| 维护成本 | 最低 | 低 | 最高 |

**建议走 A。** 它把"如何保护暴露的端口"这个问题变成"根本没有暴露的端口"。如果你本来
打算为此专门买一台代理 VPS，A 还能直接省掉那台机器——Cloudflare 边缘就是代理。

选 B2 之前请读 §B0，那里有一个防火墙解决不了的问题。

---

## 2. 通用前置（两条路都要做）

### 2.1 收紧监听地址

编辑 `deploy/.env`：

```bash
# API 永远只对本机。所有本地消费方都走环回：
#   hybrid/start.sh   BACKEND_URL=http://127.0.0.1:${PORT}
#   chengos.sh        http://127.0.0.1:${port}/health
BIND_ADDRESS=127.0.0.1

# 前端监听哪里，取决于代理在哪：
#   路线 A / B1（代理在本机）→ 127.0.0.1
#   路线 B2（代理在另一台机器）→ 内网或隧道网卡地址，如 10.8.0.3
UI_BIND=127.0.0.1
APP_BIND=127.0.0.1

# 关掉全开 CORS
CORS_PERMISSIVE=false
CORS_ALLOWED_ORIGINS=
```

> **Docker 模式忽略以上设置。** `docker-compose.yml` 已经把容器端口只发布到宿主环回
> (`127.0.0.1:8080->80`)，并且把容器内的 `BIND_ADDRESS` pin 成 `0.0.0.0`——容器里绑环回
> 会让 ui/app 容器连不上 api 容器。

### 2.2 重启并确认

```bash
./chengos.sh restart
./chengos.sh status
```

确认监听地址真的变了：

```bash
ss -tlnp | grep -E '19225|8080|5055'
```

期望看到 `127.0.0.1:19225`、`127.0.0.1:8080`、`127.0.0.1:5055`，**不是** `0.0.0.0:*` 或 `*:*`。

原生模式下，前端服务启动时会打印实际生效的信任集：

```
UI Server listening on 127.0.0.1:8080
Trusted proxies: loopback + RFC1918
```

---

# 路线 A：Cloudflare Tunnel

cloudflared 从源站**主动外连**到 Cloudflare，请求沿这条连接回来。源站没有任何入站监听。

> **顺序很重要。** 按下面的顺序做，全程保持 80/443 开着，等隧道验证通过后**最后**才关。
> 顺序反了会在中间某步把自己锁在外面。

### A1. 安装 cloudflared

Debian/Ubuntu：

```bash
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared
```

确认路径与 systemd unit 一致（unit 里写的是 `/usr/local/bin/cloudflared`）：

```bash
command -v cloudflared
```

若装在 `/usr/bin/cloudflared`，稍后把 unit 里的 `ExecStart` 路径改掉，或做个软链。

### A2. 登录并创建隧道

这两步需要浏览器交互、并且会签发凭证，必须你亲自执行：

```bash
cloudflared tunnel login          # 打开浏览器，选择 example.com 这个 zone
cloudflared tunnel create chengos # 记下它打印的 UUID
```

### A3. 绑定域名

```bash
cloudflared tunnel route dns chengos chengos.example.com
cloudflared tunnel route dns chengos app.example.com   # 如果要发布渠道网关
```

这会**自动创建 proxied（橙云）CNAME 记录**，不需要你手工去面板加 DNS。

> ### ⚠️ 证书：免费 Universal SSL 只覆盖一层子域
>
> 覆盖 `example.com` 和 `*.example.com`：
>
> - `chengos.example.com` ✅
> - `app.example.com` ✅
> - `app.chengos.example.com` ❌ 需要付费的 Advanced Certificate Manager
>
> 失败现象有误导性：浏览器报 TLS 证书错误，看起来完全不像命名问题。
> `setup-tunnel.sh` 会检查并提示正确的替代名。

### A4. 生成配置

在**本仓库**里跑（它会从 `.env` 读端口）：

```bash
./deploy/infra/cloudflare/setup-tunnel.sh --ui chengos.example.com --app app.example.com
```

产物在 `deploy/infra/cloudflare/tunnel/generated/`：`config.yml` 和 `cloudflared.service`。

生成的 ingress **只发布 UI server，不发布 API**。UI server 自己代理 `/api` 和 `/ws`；
把 API 也挂进隧道会让它和加固过的前端并列而不是在它后面。

### A5. 安装配置

```bash
sudo mkdir -p /etc/cloudflared
sudo cp deploy/infra/cloudflare/tunnel/generated/config.yml /etc/cloudflared/
sudo sed -i "s/TUNNEL_UUID/<A2 得到的 UUID>/g" /etc/cloudflared/config.yml
sudo cp ~/.cloudflared/<UUID>.json /etc/cloudflared/
```

### A6. 服务账号与权限

`<UUID>.json` 是这条隧道的**持有即可用的凭证**——拿到它的人可以在你的域名上提供流量。

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin cloudflared
sudo chown -R root:cloudflared /etc/cloudflared
sudo chmod 750 /etc/cloudflared
sudo chmod 640 /etc/cloudflared/*.json /etc/cloudflared/config.yml
```

### A7. 启动

```bash
sudo cp deploy/infra/cloudflare/tunnel/generated/cloudflared.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflared
systemctl status cloudflared
journalctl -u cloudflared -f
```

日志里出现 `Registered tunnel connection` ×4 表示隧道建立成功。

### A8. 让 ChengOS 读取真实访客 IP

```bash
./chengos.sh cloudflare on
./chengos.sh restart
```

这会在 `.env` 写入 `TRUST_CLOUDFLARE=true`。cloudflared 从环回连过来（隐式可信）并转发
`CF-Connecting-IP`；不开这个开关也能从 `X-Forwarded-For` 还原，开了则直接取 Cloudflare
自己写的那个头。

### A9. 边缘规则

```bash
export CLOUDFLARE_API_TOKEN=<你的 token>
./deploy/infra/cloudflare/apply-zone-settings.sh --zone example.com --dry-run  # 先看
./deploy/infra/cloudflare/apply-zone-settings.sh --zone example.com            # 再做
```

Token 需要该 zone 的 `Zone:Read`、`Zone Settings:Edit`、`Zone WAF:Edit`，以及
`Bot Management:Edit`（Bot Fight Mode 用）。缺某个 scope 只会让对应那一步失败，其余照常。

它会配置：TLS/HSTS、Bot Fight Mode、Browser Integrity Check、3 条 WAF 规则、1 条限流规则。

> 其中一条 WAF 规则针对一种常见手法：扫描器伪装成 GPTBot / ClaudeBot / Applebot /
> Amazonbot 等知名爬虫的 User-Agent，但全部请求来自同一个与这些厂商无关的地址。规则用
> `(not cf.client.bot) and (http.user_agent contains ...)` 拦冒名者——`cf.client.bot`
> 只对 Cloudflare 反向 DNS 验证过的爬虫为真，所以真实爬虫不受影响。

### A10. 最后一步：关闭入站端口

**确认 `https://chengos.example.com` 经隧道可正常访问之后**再做：

```bash
sudo ufw deny 80/tcp
sudo ufw deny 443/tcp
sudo ufw status
```

到这一步，这台机器对公网**一个入站端口都不剩**。

> **不要跑 `origin-firewall.sh`。** 它是给"入站 80/443 + 放行 Cloudflare 网段"那种拓扑
> 用的，在 Tunnel 下形状是错的——压根没有入站连接需要放行。

### A 路线回滚

```bash
sudo ufw allow 80/tcp && sudo ufw allow 443/tcp   # 先恢复入口
sudo systemctl stop cloudflared
./chengos.sh cloudflare off && ./chengos.sh restart
```

然后在 Cloudflare 面板把 CNAME 改回指向源站 IP（或按路线 B 重建）。

---

# 路线 B：不用隧道（反向代理）

## B0. 先决定代理在哪 —— 这决定了一个防火墙管不了的问题

"暴露到公网"其实是**两个**问题，很容易混：

| | 端口可达性 | 明文传输 |
| --- | --- | --- |
| 问题 | 谁能连上 8080 / 19225 | 代理→源站那一跳的内容谁能看到 |
| 防火墙 | ✅ 能解决 | ❌ **解决不了** |
| 内网 / 加密通道 | ✅ | ✅ |

**代理在同一台机器（B1）**：走 `127.0.0.1`，流量根本不进网卡，内核内部转发完，
不存在可截获的包。不需要加密，不需要配 `TRUSTED_PROXY_IPS`。这是不用隧道时最干净的形态。

**代理在另一台机器（B2）**：即使防火墙只放行代理机那一个 IP，那一跳的 HTTP 流量
**仍然在公网上明文传输**。两边机房、ISP、骨干网的任何一跳都能看到 session token 和用户
数据。防火墙管"谁能敲门"，不管"说话有没有人偷听"。

所以 B2 必须走下面之一：

- **服务商私有网络**：同服务商、同区域才算。跨区域/跨服务商的所谓"内网"可能仍走公网。
  注意有些服务商的私有网络是**共享 VLAN**，同机房其他租户可能可达，这种情况仍需防火墙。
- **WireGuard / Tailscale**：跨机房可用，且流量加密。不确定内网是否可靠时直接用这个。

## B1. 同机反向代理

### B1.1 `.env`

```bash
BIND_ADDRESS=127.0.0.1
UI_BIND=127.0.0.1
APP_BIND=127.0.0.1
TRUSTED_PROXY_IPS=          # 不用填，环回隐式可信
TRUST_CLOUDFLARE=true       # 如果前面接了 Cloudflare
```

### B1.2 宿主 nginx

关键是**必须转发这三个头**，否则真实 IP、HSTS 判断都会失效：

```nginx
server {
    listen 443 ssl http2;
    server_name chengos.example.com;

    # 证书：Cloudflare Origin CA，或 certbot/acme.sh
    ssl_certificate     /etc/ssl/chengos/origin.pem;
    ssl_certificate_key /etc/ssl/chengos/origin.key;

    # 接了 Cloudflare 时，还原真实访客 IP。网段列表由
    # deploy/infra/cloudflare/sync-cf-ips.sh 生成后取 set_real_ip_from 那些行。
    # include /etc/nginx/cloudflare-realip.conf;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;   # 决定是否下发 HSTS

        # WebSocket
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 3600s;
    }
}
```

`$proxy_add_x_forwarded_for` 是**追加**不是覆盖。ChengOS 取 `X-Forwarded-For` 的**最后
一段**，所以攻击者伪造的前缀无效。

> **注意 8080 后面是什么。** Docker 模式下是容器里的 nginx（已带扫描拦截、限流、CSP）；
> 原生模式下是 `ui-server.js`（同样的加固，Node 实现）。两者都会自己处理这些。

### B1.3 Cloudflare 边缘 + 源站防火墙

```bash
export CLOUDFLARE_API_TOKEN=<token>
./deploy/infra/cloudflare/apply-zone-settings.sh --zone example.com --dry-run
./deploy/infra/cloudflare/apply-zone-settings.sh --zone example.com
```

在 Cloudflare 面板把 `chengos.example.com` 的记录设为 **Proxied（橙云）**。灰云记录绕过上面所有规则。

然后关闭源站，只对 Cloudflare 开放：

```bash
./deploy/infra/cloudflare/sync-cf-ips.sh          # 刷新网段
./deploy/infra/cloudflare/origin-firewall.sh      # 先看规则
./deploy/infra/cloudflare/origin-firewall.sh --apply
```

`--apply` 会要求你重新输入端口号确认，且**永不碰 SSH**。做之前务必先确认橙云已生效，
否则立刻断站。

Cloudflare 的网段会变，建议挂定时任务：

```bash
# 每月检查一次，过期则失败告警
0 4 1 * * cd /path/to/chengos && ./deploy/infra/cloudflare/sync-cf-ips.sh --check
```

## B2. 异机反向代理

先读 §B0。确认走内网或加密通道之后：

### B2.1 源站 `.env`

```bash
BIND_ADDRESS=127.0.0.1      # API 永远只对本机，不因为有代理而放开
UI_BIND=10.8.0.3            # 内网 / WireGuard 网卡地址
APP_BIND=10.8.0.3

# 代理机在 RFC1918（10.x / 172.16-31.x / 192.168.x）→ 不用填，隐式可信
# 代理机在 Tailscale/CGNAT（100.64.0.0/10）→ 必须填，它不是 RFC1918
# 代理机在公网 IP → 必须填
TRUSTED_PROXY_IPS=100.64.0.0/10
```

> **`UI_BIND` 填的是本机某块网卡的地址，不是代理机的地址。** 填另一台机器的 IP 会直接
> `EADDRNOTAVAIL` 起不来。绑定地址决定"服务出现在本机哪个接口上"，**不是访问控制**；
> 决定"谁能连"的是防火墙。

### B2.2 这一步不能漏

`TRUSTED_PROXY_IPS` 没配对的后果是**静默的**：代理机从公网 IP 连过来时不被信任，
ChengOS 会把**所有访客都归到代理机那一个地址**，于是整个互联网共用一个限流桶，登录爆破
会被当成同一个人。什么错都不报。

启动日志是唯一能看出来的地方：

```
Trusted proxies: loopback + RFC1918 + 100.64.0.0/10
```

没配且监听超出环回时会打印 `[SECURITY]` 告警。

### B2.3 代理机

nginx 配置同 §B1.2，只是 `proxy_pass` 指向源站的内网/隧道地址：

```nginx
proxy_pass http://10.8.0.3:8080;
```

### B2.4 源站防火墙

```bash
# 只放行代理机访问前端端口
sudo ufw allow proto tcp from 10.8.0.2 to any port 8080,5055
sudo ufw deny proto tcp from any to any port 8080,5055
```

走 WireGuard 时更简单：前端只绑隧道网卡，公网上压根看不到这些端口。

---

## 3. 验证清单（两条路共用）

### 3.0 一条命令跑完大部分检查

```bash
./chengos.sh doctor
```

只读，不改任何配置、不重启服务。它**实测运行中的系统**而不是回读配置文件——这个领域
的故障全是安静的：API 还在 `0.0.0.0` 上、限流键错了地址、bundle 太旧没有 CSP nonce，
没有一样会报错。

输出分四段：监听地址、信任与跨域、实测前端行为、边缘。退出码 `0` 表示无问题
（警告不影响退出码，可以直接拿去做部署门禁）。

```
监听地址 / Listening addresses
  ✓ cheng-api (19225) 只绑本机 / loopback only
  ✓ ui-server (8080) 只绑本机 / loopback only

实测前端行为 / Live frontend behaviour
  ✓ 扫描路径全部 404 (8 条)
  ✓ SPA 深链正常 (200)
  ✓ 安全响应头齐全
  ✓ CSP nonce 逐请求变化

小结 / Summary
  通过 7   警告 1   问题 0
```

**它查不到的一件事**：公网可达性。从本机探测自己永远是通的，所以那必须在另一台机器上
做，见 §3.2。doctor 会把这条命令打印出来提醒你。

下面几节是 doctor 覆盖的具体项，便于手工复核或排查。


### 3.1 监听地址

```bash
ss -tlnp | grep -E '19225|8080|5055'
```

API 必须是 `127.0.0.1:19225`。

### 3.2 从外部确认源站不可达

**在另一台机器上**跑（本机跑没意义）：

```bash
curl -sv --max-time 5 http://<源站公网IP>:19225/health   # 应超时/拒绝
curl -sv --max-time 5 http://<源站公网IP>:8080/          # 路线 A 应超时/拒绝
```

### 3.3 扫描路径应被拒绝

```bash
for p in /.env /backend/api/.env /config/credentials.json /.git/config \
         /wp-login.php /docker-compose.prod.yml /assets/index.js.map; do
  printf '%-32s ' "$p"
  curl -s -o /dev/null -w '%{http_code}\n' "https://chengos.example.com$p"
done
```

全部应为 **404**。若看到 **200** 且大小和首页一致，说明请求没走到加固过的那一层
（常见原因：宿主 nginx 直接 `root` 指向了静态目录，绕过了 ui-server / ui 容器）。

### 3.4 正常访问

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://chengos.example.com/                  # 200
curl -s -o /dev/null -w '%{http_code}\n' -H 'Accept: text/html' \
     https://chengos.example.com/editor/whatever                                        # 200（SPA 深链）
```

### 3.5 安全响应头

```bash
curl -sI -H 'Accept: text/html' https://chengos.example.com/ \
  | grep -iE 'content-security|strict-transport|x-content-type|x-frame'
```

应看到 CSP、HSTS、`nosniff`、`SAMEORIGIN`。

### 3.6 CSP nonce 是否逐请求变化

```bash
for i in 1 2; do
  curl -s https://chengos.example.com/ | grep -o 'nonce="[a-f0-9]\{32\}"' | head -1
done
```

两次应不同。若结果为空，说明前端 bundle 还是旧的（没有 `__CSP_NONCE__` 占位符），
此时 CSP 会自动降级到 `'unsafe-inline'` 并在服务日志里打印 `[SECURITY]` 告警——**应用
不会坏**，重建前端后自动收紧。

### 3.7 真实访客 IP 是否还原

```bash
./chengos.sh status
```

原生模式下看服务启动日志的 `Trusted proxies:` 那一行。也可以从访问日志确认记录的是
访客地址而不是代理地址。

---

## 4. 故障排查

| 症状 | 原因 |
| --- | --- |
| 浏览器 TLS 证书错误 | 域名超过一层子域（`app.chengos.example.com`），免费 Universal SSL 不覆盖 |
| `cloudflared` 起不来，`EADDRNOTAVAIL` | `UI_BIND` 填了别的机器的 IP |
| 隧道起来了但 502 | `config.yml` 里的端口和 `.env` 的 `UI_PORT` 不一致；或 `UI_BIND` 不是 `127.0.0.1` |
| `cloudflared` 拒绝启动，抱怨 ingress | `config.yml` 末尾缺 catch-all（`- service: http_status:404`） |
| 所有访客被限流成同一个人 | `TRUSTED_PROXY_IPS` 没配（代理在公网 IP 或 CGNAT 段） |
| 扫描路径仍返回 200 | 请求没走到 ui-server / ui 容器，被宿主 nginx 的 `root` 直接接走了 |
| 页面白屏，控制台报 CSP | 前端调用了 `connect-src` 未覆盖的外部域名，用 `CSP_CONNECT_SRC_EXTRA` 添加 |
| 桌面客户端 / 远程 CLI 连不上 | `BIND_ADDRESS=127.0.0.1` 后不能直连 19225，改走反向代理的 443（`/api` 已被转发） |
| `./chengos.sh status` 里 UI NOT RESPONDING | 括号里会打印实际探测的地址。若它和 `UI_BIND` 不一致，说明 `.env` 改了但服务没重启 |
| Docker 模式改了 `BIND_ADDRESS` 后 api 连不上 | 容器内必须 `0.0.0.0`。`docker-compose.yml` 已 pin，不要在 compose 里改掉 |

---

## 5. 升级注意

- **`.env` 永不被升级覆盖**。新版本引入的安全默认值只影响新安装，已有部署需要手工同步。
  升级后对比一下 `.env.example` 里新增的键。
- **Docker 模式**需要重新构建并发布 `chengos/chengos_ui`、`chengos/chengos_app` 镜像，
  nginx 加固才会生效。
- **原生模式**同步 `deploy/bin/` 时**不要漏掉新增的 `lib/` 目录**，漏了服务起不来。
- 前端重建后，CSP 会从 `'unsafe-inline'` 自动收紧到 nonce；服务日志里的 `[SECURITY]`
  告警消失即为完成。

---

## 附：脚本速查

| 脚本 | 用途 | 适用路线 |
| --- | --- | --- |
| `setup-tunnel.sh` | 生成 cloudflared 配置和 systemd unit | A |
| `apply-zone-settings.sh` | 推送 TLS/HSTS/WAF/限流到 Cloudflare zone | A、B |
| `sync-cf-ips.sh` | 刷新 Cloudflare 网段（`--check` 可挂 CI） | B |
| `origin-firewall.sh` | 源站只放行 Cloudflare 访问 80/443 | **仅 B** |
| `chengos.sh cloudflare on\|off\|status` | 切换 `TRUST_CLOUDFLARE` | A、B |
| `chengos.sh doctor` | 只读检查当前暴露面，可做部署门禁 | A、B |
