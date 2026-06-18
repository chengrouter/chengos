# ChengOS Distributed Architecture Deployment

High performance Native App (VPS B) + Database Server (VPS A) Architecture.  
Both backend and databases run as native binaries to ensure absolute minimum runtime overhead—completely removing Docker from the equation.

## Architecture

* **VPS A (Database Server)**: Runs native PostgreSQL 18, Redis, and Qdrant.
* **VPS B (App Server)**: Runs the compiled native `cheng-api` binary.

## Prerequisites

| Requirement | Version |
|---|---|
| Linux x86-64 | any modern distro (Ubuntu/Debian recommended) |
| curl | any |
| openssl | any |

---

## Quick Start

### 1. Database Server Setup (VPS A)

On **VPS A**, run the automated database installation script:

```bash
bash install_db.sh
```

Follow the prompts and provide your **VPS B IP address** when requested.
The script will install the databases natively, configure UFW, generate secure passwords, and output the exact `.env` configuration you need to copy to VPS B.

### 2. App Server Setup (VPS B)

On **VPS B**, unpack the application release:

```bash
tar -xzf chengos-full-linux-amd64.tar.gz
cd chengos
```

### 3. Configure the App (VPS B)

After running `install_db.sh` on VPS A, it generated a file named `vps_b_env.txt`.
Copy that file to VPS B and place it in the same directory as this README:

```bash
# (Optionally) Example using scp from VPS B
scp root@<VPS_A_IP>:/root/vps_b_env.txt ./
```

Then generate your `.env` file. The script will automatically detect `vps_b_env.txt` and seamlessly configure all your external database hostings and passwords:

```bash
bash generate-env.sh --cors-origin https://your-frontend.example.com --db-pool 3
```

You can optionally review `.env` to verify the settings.

```bash
$EDITOR .env
```

### 4. Start the Application

```bash
bash start.sh
```

What it does:
1. Verifies all required dependencies (libssl, libpq)
2. Validates your `.env` configuration
3. Launches `bin/cheng-api` via `nohup`
4. Polls the `/health` endpoint until the app is fully online

On success:

```
[chengos]   ChengOS is running!
[chengos]   API: http://127.0.0.1:3000
[chengos]   Health: http://127.0.0.1:3000/health
[chengos]   Logs: tail -f logs/cheng-api.log
[chengos]   Stop: bash stop.sh
```

### 5. Check Status & Stop

Check process status:
```bash
bash status.sh
```

Stop the application:
```bash
bash stop.sh
```

---

## Upgrade

```bash
# 1. Stop the running app
bash stop.sh

# 2. Back up the binary in case rollback is needed
cp bin/cheng-api bin/cheng-api.prev

# 3. Drop the new binary into place
cp /path/to/new/cheng-api bin/cheng-api
chmod +x bin/cheng-api

# 4. Start
bash start.sh
```

Database migrations run automatically on startup (`RUN_MIGRATIONS=true` in `.env`).  
