#!/bin/bash

# 确保脚本以 root 身份运行
if [ "$EUID" -ne 0 ]; then
  echo "请使用 root 权限运行此脚本 (例如: sudo bash install_db.sh)"
  exit 1
fi

echo "=========================================="
echo "      自动化部署 Postgres/Redis/Qdrant    "
echo "      (使用官方源与指定版本安装方式)      "
echo "=========================================="

# 1. 获取 VPS B 的 IP
read -p "请输入 VPS B (应用服务器) 的公网 IP: " VPS_B_IP

if [ -z "$VPS_B_IP" ]; then
    echo "错误: VPS B 的 IP 不能为空！"
    exit 1
fi

# 获取本机公网 IP 用于生成配置文件
VPS_A_IP=$(curl -s ifconfig.me)

# 2. 随机生成强密码
PG_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
REDIS_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
echo "-> 密码生成完毕。"

# 安装前置依赖
apt update
apt install -y curl wget lsb-release gpg ufw

# 3. 配置防火墙 UFW (关键安全步骤)
echo "-> 正在配置防火墙..."
ufw --force enable
ufw allow ssh
ufw allow from "$VPS_B_IP" to any port 5432
ufw allow from "$VPS_B_IP" to any port 6379
ufw allow from "$VPS_B_IP" to any port 6333
ufw allow from "$VPS_B_IP" to any port 6334

# ==========================================
# 4. 安装与配置 PostgreSQL (通过官方源)
# ==========================================
if ! command -v psql >/dev/null 2>&1; then
    echo "-> 正在安装 PostgreSQL 18..."
    mkdir -p /etc/apt/keyrings
    wget --quiet -O /etc/apt/keyrings/postgresql.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
    echo "deb [signed-by=/etc/apt/keyrings/postgresql.asc] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list

    apt update
    apt install -y postgresql-18 postgresql-client-18 postgresql-contrib-18
else
    echo "-> PostgreSQL 已安装，跳过安装步骤..."
fi

# 获取安装的 PG 版本号 (兼容已有不同版本的情况)
PG_VERSION=$(ls /etc/postgresql/ | head -n 1)

# 创建数据库和用户 (加了存在检测的容错处理)
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'master_router'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE master_router;"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = 'tianai_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER tianai_db WITH ENCRYPTED PASSWORD '${PG_PASSWORD}';"
# 如果存在，则更新一遍新生成的密码
sudo -u postgres psql -c "ALTER USER tianai_db WITH ENCRYPTED PASSWORD '${PG_PASSWORD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE master_router TO tianai_db;"
# PG 15 及以上版本默认移除了 public schema 的创建权限，需要显式授权或更改所有者
sudo -u postgres psql -c "ALTER DATABASE master_router OWNER TO tianai_db;"
sudo -u postgres psql -d master_router -c "GRANT ALL ON SCHEMA public TO tianai_db;"

# 修改 PG 允许远程访问
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/${PG_VERSION}/main/postgresql.conf
# 避免重复添加规则
grep -q "${VPS_B_IP}" /etc/postgresql/${PG_VERSION}/main/pg_hba.conf || {
    echo "host    master_router   tianai_db       ${VPS_B_IP}/32           scram-sha-256" >> /etc/postgresql/${PG_VERSION}/main/pg_hba.conf
    echo "host    master_router   tianai_db       ${VPS_B_IP}/32           md5" >> /etc/postgresql/${PG_VERSION}/main/pg_hba.conf
}

systemctl restart postgresql
systemctl enable postgresql

# ==========================================
# 5. 安装与配置 Valkey
# ==========================================
if ! command -v valkey-server >/dev/null 2>&1; then
    echo "-> 正在安装 Valkey..."
    apt update
    apt install -y valkey
else
    echo "-> Valkey 已安装，跳过安装步骤..."
fi

# 修改 Valkey 配置允许远程连接、设置密码与缓存策略
sed -i 's/^bind 127.0.0.1 -::1/bind 0.0.0.0/g' /etc/valkey/valkey.conf
sed -i 's/^bind 127.0.0.1/bind 0.0.0.0/g' /etc/valkey/valkey.conf
# 如果之前有设置密码，替换它；如果被注释了，取消注释并设置
sed -i -E "s/^#? *requirepass .*/requirepass ${REDIS_PASSWORD}/g" /etc/valkey/valkey.conf
sed -i -E 's/^#? *appendonly .*/appendonly yes/g' /etc/valkey/valkey.conf
grep -q "maxmemory 512mb" /etc/valkey/valkey.conf || echo "maxmemory 512mb" >> /etc/valkey/valkey.conf
grep -q "maxmemory-policy allkeys-lru" /etc/valkey/valkey.conf || echo "maxmemory-policy allkeys-lru" >> /etc/valkey/valkey.conf

systemctl enable valkey-server
systemctl restart valkey-server

# ==========================================
# 6. 安装与配置 Qdrant (使用 deb 包)
# ==========================================
if ! command -v qdrant >/dev/null 2>&1 && ! [ -f "/usr/bin/qdrant" ]; then
    echo "-> 正在安装 Qdrant v1.17.1..."
    cd /tmp
    wget https://github.com/qdrant/qdrant/releases/download/v1.17.1/qdrant_1.17.1-1_amd64.deb
    dpkg -i qdrant_1.17.1-1_amd64.deb || apt-get install -f -y
else
    echo "-> Qdrant 已安装，跳过安装步骤..."
fi

useradd -r -s /bin/false qdrant 2>/dev/null || true
mkdir -p /var/lib/qdrant /var/log/qdrant /etc/qdrant
chown -R qdrant:qdrant /var/lib/qdrant /var/log/qdrant

# 生成配置文件（特别注意：加入了 host: "0.0.0.0" 才能被 VPS B 访问）
cat << 'EOF' > /etc/qdrant/config.yaml
log_level: INFO
storage:
  storage_path: /var/lib/qdrant/storage
  snapshots_path: /var/lib/qdrant/snapshots
service:
  host: "0.0.0.0"
  http_port: 6333
  grpc_port: 6334
cluster:
  enabled: false
EOF
chown -R qdrant:qdrant /etc/qdrant

# 生成 systemd 服务文件
cat << 'EOF' > /etc/systemd/system/qdrant.service
[Unit]
Description=Qdrant Vector Database
After=network.target

[Service]
Type=simple
User=qdrant
Group=qdrant
ExecStart=/usr/bin/qdrant --config-path /etc/qdrant/config.yaml
WorkingDirectory=/var/lib/qdrant
Restart=on-failure
RestartSec=5s
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable qdrant
systemctl restart qdrant

# ==========================================
# 7. 生成环境配置文件供 VPS B 使用
# ==========================================
ENV_OUTPUT="/root/vps_b_env.txt"

cat <<EOF > $ENV_OUTPUT
# ==========================================
# 请将以下内容复制到 VPS B 的项目的 .env 文件中
# ==========================================

# PostgreSQL 配置
POSTGRES_HOST=${VPS_A_IP}
POSTGRES_PORT=5432
POSTGRES_DB=master_router
POSTGRES_USER=tianai_db
POSTGRES_PASSWORD=${PG_PASSWORD}

# Redis 配置
REDIS_HOST=${VPS_A_IP}
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# Qdrant 配置
QDRANT_HOST=${VPS_A_IP}
QDRANT_PORT=6333
EOF

echo "=========================================="
echo " 部署完成！"
echo " 数据库已被防火墙保护，仅允许 ${VPS_B_IP} 访问。"
echo " 已在 /root 目录生成配置文件: ${ENV_OUTPUT}"
echo " 你可以使用 'cat ${ENV_OUTPUT}' 命令查看需要复制的内容。"
echo "=========================================="
