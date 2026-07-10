---
abbrlink: ''
categories:
- - 运维
date: '2026-07-10T17:12:23.221450+08:00'
excerpt: Docker 安装 **### **官方文档  安装：https://docs.docker.com/engine/install/debian/ 发布页：https://github.com/moby/moby/releases  配置 apt 仓库  # 安装依赖  sudo apt update  sudo apt install -y ca-certificates curl  ​  # ...
tags:
- Docker
title: Docker
updated: '2026-07-10T17:12:37.287+08:00'
---
# Docker

## 安装

**### **官方文档

* **安装：**[https://docs.docker.com/engine/install/debian/](https://docs.docker.com/engine/install/debian/)
* **发布页：**[https://github.com/moby/moby/releases](https://github.com/moby/moby/releases)

### 配置 apt 仓库

```
 # 安装依赖
 sudo apt update
 sudo apt install -y ca-certificates curl
 
 # 创建 keyring 目录
 sudo install -m 0755 -d /etc/apt/keyrings
 
 # 添加 GPG 密钥
 sudo curl -fsSL https://download.docker.com/linux/debian/gpg \
   -o /etc/apt/keyrings/docker.asc
 sudo chmod a+r /etc/apt/keyrings/docker.asc
 
 # 添加 apt 源
 sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
 Types: deb
 URIs: https://download.docker.com/linux/debian
 Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
 Components: stable
 Architectures: $(dpkg --print-architecture)
 Signed-By: /etc/apt/keyrings/docker.asc
 EOF
 
 sudo apt update
```

### 安装

```
 # 最新版
 sudo apt install -y docker-ce docker-ce-cli containerd.io \
   docker-buildx-plugin docker-compose-plugin
 
 # 指定版本（先列出可用版本）
 sudo apt list --all-versions docker-ce
 VERSION_STRING=5:29.5.3-1~debian.12~bookworm
 sudo apt install -y \
   docker-ce=$VERSION_STRING \
   docker-ce-cli=$VERSION_STRING \
   containerd.io docker-buildx-plugin docker-compose-plugin
```

### 启动与验证

```
 sudo systemctl enable docker
 sudo systemctl restart docker
 sudo systemctl status docker
 
 docker version
 sudo docker run hello-world
```

### 非 root 用户免 sudo

```
 sudo usermod -aG docker $USER
 # 重新登录后生效
```

### daemon.json 配置

```
 sudo install -d /etc/docker
 
 sudo tee /etc/docker/daemon.json >/dev/null <<'EOF'
 {
   "log-driver": "json-file",
   "log-opts": {
     "max-size": "50m",
     "max-file": "3"
   },
   "live-restore": true,
   "ipv6": false,
   "dns": ["1.1.1.1", "8.8.8.8"],
   "exec-opts": ["native.cgroupdriver=systemd"],
   "features": {
     "buildkit": true
   },
   "bip": "172.16.0.1/24",
   "default-address-pools": [
     {
       "base": "172.26.0.0/16",
       "size": 24
     }
   ]
 }
 EOF
 
 sudo systemctl restart docker
 docker info | sed -n '1,80p'
```

## 容器与镜像基础操作

### 镜像操作

```
 # 拉取镜像（默认 tag 为 latest）
 docker pull <镜像名>
 docker pull <镜像名>:<版本>
 
 # 查看本地镜像
 docker images
 
 # 删除本地镜像（需先删除关联容器）
 docker rmi <镜像名>
 
 # 查看镜像构建历史
 docker history <镜像名>:<版本>
 
 # 搜索 Docker Hub
 docker search <关键词>
 
 # 给镜像打 tag
 docker tag <源镜像>:<源tag> <目标镜像>:<目标tag>
```

### 容器生命周期

```
 # 创建并启动（常用）
 docker run <镜像名>
 
 # 常用参数组合
 docker run -d \                        # 后台运行
   --name <容器名> \                    # 指定名称
   -p <宿主端口>:<容器端口> \           # 端口映射
   -v <宿主路径>:<容器路径> \           # 挂载目录
   -e KEY=VALUE \                       # 环境变量
   --network <网络名> \                 # 指定网络
   --restart unless-stopped \           # 重启策略
   <镜像名>
 
 # 仅创建不启动
 docker create <镜像名>
 
 # 交互式启动（进入 shell）
 docker run -it <镜像名> /bin/bash
 
 # 启动已停止的容器
 docker start <容器名/ID>
 
 # 停止容器（优雅，发送 SIGTERM，默认等待 10s 后强制 SIGKILL）
 docker stop <容器名/ID>
 
 # 指定等待超时时间
 docker stop -t 30 <容器名/ID>
 
 # 强制停止（直接 SIGKILL）
 docker kill <容器名/ID>
 
 # 重启
 docker restart <容器名/ID>
 
 # 停止后自动删除（临时任务常用）
 docker run --rm <镜像名>
```

### 容器查看与管理

```
 # 查看运行中的容器
 docker ps
 
 # 查看所有容器（包含已停止）
 docker ps -a
 
 # 查看容器/镜像详细信息
 docker inspect <容器名/镜像名>
 
 # 进入正在运行的容器
 docker exec -it <容器名/ID> /bin/bash
 
 # 在容器内执行单条命令（不进入交互）
 docker exec <容器名/ID> cat /etc/os-release
 
 # 查看容器日志
 docker logs <容器名/ID>
 docker logs -f <容器名/ID>          # 持续跟踪
 docker logs --tail 100 <容器名/ID>  # 最后 100 行
 
 # 查看容器内进程
 docker top <容器名/ID>
 
 # 查看端口映射
 docker port <容器名/ID>
 
 # 从宿主机复制文件到容器
 docker cp <本地路径> <容器名>:<容器路径>
 
 # 从容器复制文件到宿主机
 docker cp <容器名>:<容器路径> <本地路径>
 
 # 删除已停止的容器
 docker rm <容器名/ID>
 
 # 强制删除运行中的容器
 docker rm -f <容器名/ID>
```

### 镜像导入导出

```
# 导出镜像为 tar 包（保留完整分层信息，推荐离线传输）
docker save -o <文件名>.tar <镜像名>:<tag>

# 从 tar 包导入镜像
docker load -i <文件名>.tar

# 将容器导出为 tar（包含运行时改动，丢失分层信息）
docker export -o <文件名>.tar <容器名/ID>

# 从 tar 导入为镜像
docker import <文件名>.tar <镜像名>:<tag>
```

### 推送镜像到 Docker Hub

```
# 登录
docker login -u <用户名>

# 打 tag（格式：用户名/仓库名:版本）
docker tag <本地镜像> <用户名>/<仓库名>:<版本>

# 推送
docker push <用户名>/<仓库名>:<版本>

# 退出登录
docker logout
```

## Dockerfile

### 完整指令参考

```
# 基础镜像（必须是第一条指令）
FROM <基础镜像>:<tag>
# 从零开始构建（无 OS 层，常用于静态二进制）
FROM scratch

# 维护者信息（已废弃，改用 LABEL）
LABEL maintainer="name <email>"
LABEL version="1.0" description="示例镜像"

# 设置工作目录（不存在会自动创建）
WORKDIR /app

# 构建参数（仅构建阶段可用，docker build --build-arg 传入）
ARG BUILD_VERSION=1.0

# 环境变量（构建时和运行时均可用）
ENV APP_ENV=production
ENV DB_HOST=localhost \
    DB_PORT=5432

# 复制本地文件到镜像（推荐，语义明确）
COPY <源路径> <目标路径>
COPY . /app
COPY --chown=1000:1000 . /app  # 指定文件所有者

# 添加文件（支持 URL 下载和 tar 自动解压，不推荐常规使用）
ADD https://example.com/file.tar.gz /tmp/
ADD app.tar.gz /app/           # 自动解压

# 构建时执行命令（每条 RUN 生成一层镜像，建议合并减少层数）
RUN apt update && \
    apt install -y --no-install-recommends \
      curl wget && \
    rm -rf /var/lib/apt/lists/*

# 声明容器监听的端口（仅文档用途，不自动映射）
EXPOSE 8080
EXPOSE 8080/tcp
EXPOSE 5353/udp

# 容器启动时执行的默认命令（exec 格式，不经过 shell，推荐）
CMD ["nginx", "-g", "daemon off;"]
# shell 格式（在 /bin/sh -c 中执行）
# CMD nginx -g "daemon off;"

# 容器入口点
# 与 CMD 的区别：docker run 追加的参数会作为 ENTRYPOINT 的参数，不会覆盖它
# CMD 会被 docker run 后的命令完全覆盖
ENTRYPOINT ["python"]
CMD ["app.py"]   # 作为 ENTRYPOINT 的默认参数，可被 docker run 覆盖

# 挂载点声明（提示该路径应使用 volume 持久化）
VOLUME ["/data"]

# 指定容器运行用户（安全加固，避免以 root 运行）
USER 1000:1000

# 健康检查（见第十一章详解）
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
HEALTHCHECK NONE  # 禁用健康检查
```

### 实用 Dockerfile 示例

```
# 多阶段构建：Go 应用（最终镜像极小）
FROM golang:1.22-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app .

FROM debian:12-slim
WORKDIR /app
COPY --from=builder /build/app .
EXPOSE 8080
CMD ["./app"]
```

```
# Python 应用
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0"]
```

### .dockerignore

```
# 忽略不需要打包的文件，减少构建上下文体积
.git
.gitignore
__pycache__
*.pyc
node_modules
*.log
.env
```

### 构建命令

```
# 基本构建
docker build -t <镜像名>:<tag> <构建目录>
docker build -t myapp:1.0 .

# 指定 Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# 传入构建参数
docker build --build-arg BUILD_VERSION=2.0 -t myapp .

# 不使用缓存
docker build --no-cache -t myapp .
```

## 数据卷与持久化存储

**Docker 容器的文件系统是临时的，容器删除后数据丢失，通过数据卷实现持久化**

### 存储类型对比


| **类型**       | **命令形式**                   | **数据位置**                                  | **适用场景**                     |
| -------------- | ------------------------------ | --------------------------------------------- | -------------------------------- |
| **volume**     | `-v <卷名>:<容器路径>`         | **Docker 管理（**`/var/lib/docker/volumes/`） | **生产数据持久化（推荐）**       |
| **bind mount** | `-v <宿主绝对路径>:<容器路径>` | **宿主机指定目录**                            | **挂载配置文件、开发时挂载源码** |
| **tmpfs**      | `--tmpfs <容器路径>`           | **内存（重启丢失）**                          | **敏感数据临时存储**             |

### Volume 操作

```
# 创建 volume
docker volume create <卷名>

# 查看所有 volume
docker volume ls

# 查看 volume 详情（含挂载路径）
docker volume inspect <卷名>

# 删除 volume
docker volume rm <卷名>

# 删除所有未使用的 volume（危险！）
docker volume prune
```

### 挂载示例

```
# 使用命名 volume（推荐用于数据库等需持久化的场景）
docker run -d \
  --name postgres \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# 使用 bind mount（挂载宿主机目录，:ro 表示只读）
docker run -d \
  --name nginx \
  -v /opt/nginx/html:/usr/share/nginx/html:ro \
  -p 80:80 \
  nginx

# tmpfs（内存挂载，不落盘）
docker run -d \
  --tmpfs /tmp:size=100m \
  myapp
```

### 数据备份与恢复

```
# 备份 volume 数据到当前目录
docker run --rm \
  -v pgdata:/data \
  -v $(pwd):/backup \
  debian:12 \
  tar czf /backup/pgdata_backup.tar.gz -C /data .

# 恢复 volume 数据
docker run --rm \
  -v pgdata:/data \
  -v $(pwd):/backup \
  debian:12 \
  tar xzf /backup/pgdata_backup.tar.gz -C /data
```

## 容器网络管理

### 网络类型

```
# 查看所有网络
docker network ls
```


| **网络类型**      | **说明**                                 | **适用场景**              |
| ----------------- | ---------------------------------------- | ------------------------- |
| **bridge**        | **默认网络，容器间通过 IP 通信**         | **默认隔离**              |
| **host**          | **共享宿主机网络栈**                     | **高性能、减少 NAT 开销** |
| **none**          | **仅 loopback，完全隔离**                | **无网络需求的任务**      |
| **自定义 bridge** | **容器间可用****容器名**作为域名互相访问 | **生产推荐**              |

> **自定义 bridge 与默认 bridge 的核心区别：加入同一自定义网络的容器可以直接用****容器名**互相访问（内置 DNS 解析），默认 bridge 只能用 IP

### 网络操作

```
# 创建自定义桥接网络
docker network create <网络名>
docker network create --driver bridge \
  --subnet 192.168.100.0/24 \
  --gateway 192.168.100.1 \
  mynet

# 查看网络详情（含加入的容器列表）
docker network inspect <网络名>

# 删除网络
docker network rm <网络名>

# 删除所有未使用网络
docker network prune
```

### 端口映射

```
# 映射指定端口
docker run -p <宿主端口>:<容器端口> <镜像>

# 仅监听本地回环（不对外暴露）
docker run -p 127.0.0.1:8080:80 <镜像>

# 随机映射宿主机端口
docker run -P <镜像>

# 查看容器端口映射
docker port <容器名/ID>
```

### 将容器加入/离开网络

```
# 将已有容器接入网络
docker network connect <网络名> <容器名/ID>

# 断开容器与网络的连接
docker network disconnect <网络名> <容器名/ID>

# 启动时指定网络
docker run --network <网络名> <镜像>

# 启动时指定网络别名（其他容器可通过别名访问）
docker run --network mynet --network-alias db <镜像>
```

### 容器间通信示例

```
# 创建网络
docker network create appnet

# 启动数据库（不暴露端口到宿主机）
docker run -d --name postgres --network appnet \
  -e POSTGRES_PASSWORD=secret postgres:16

# 启动应用，直接用容器名 postgres 访问数据库
docker run -d --name app --network appnet \
  -e DB_HOST=postgres \
  -p 8080:8080 \
  myapp
```

## Docker Compose

### 官方文档

* [https://docs.docker.com/compose/](https://docs.docker.com/compose/)

### compose.yaml 结构

```
# compose.yaml（推荐命名，也支持 docker-compose.yml）

services:
  WebApp:
    image: nginx:alpine
    # 或从 Dockerfile 构建：
    # build:
    #   context: .
    #   dockerfile: Dockerfile
    container_name: WebApp
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    environment:
      - TZ=Asia/Shanghai
    env_file:
      - .env
    networks:
      - AppNet
    depends_on:
      Database:
        condition: service_healthy  # 等待健康检查通过（见第十一章）
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  Database:
    image: postgres:16
    container_name: Database
    restart: unless-stopped
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:
      - AppNet
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

networks:
  AppNet:
    driver: bridge
    name: AppNet

volumes:
  pgdata:
    name: pgdata
```

### Compose 常用命令

```
# 启动所有服务（后台运行）
docker compose up -d

# 启动指定服务
docker compose up -d WebApp

# 停止并删除容器（保留 volume 和 image）
docker compose down

# 停止并删除容器 + volume（危险！）
docker compose down -v

# 停止并删除容器 + 镜像
docker compose down --rmi all

# 重新构建镜像并启动
docker compose up -d --build

# 查看服务状态
docker compose ps

# 查看服务日志
docker compose logs
docker compose logs -f WebApp      # 跟踪指定服务

# 进入容器
docker compose exec WebApp /bin/sh

# 重启某个服务
docker compose restart WebApp

# 拉取最新镜像
docker compose pull

# 验证配置文件语法
docker compose config
```

### .env 文件示例

```
# .env（加入 .gitignore，不要提交到 git）
DB_NAME=myapp
DB_USER=appuser
DB_PASSWORD=supersecret
REDIS_PASSWORD=anothersecret
```

### 多环境配置

```
# 使用 override 文件叠加开发配置
docker compose -f compose.yaml -f compose.dev.yaml up -d

# 指定 .env 文件（用于多环境切换）
docker compose --env-file .env.prod up -d
```

## 资源限制

**防止单个容器耗尽宿主机资源**

```
# 内存限制（超出会被 OOM Kill）
docker run --memory 512m <镜像>
docker run --memory 512m --memory-swap 1g <镜像>  # swap 上限，-1 表示不限

# CPU 限制
docker run --cpus 1.5 <镜像>         # 最多使用 1.5 核
docker run --cpu-shares 512 <镜像>   # 相对权重（默认 1024，竞争时生效）

# 查看容器资源实时使用
docker stats
docker stats <容器名>
docker stats --no-stream              # 只输出一次，不持续刷新
```

### Compose 中设置资源限制

```
services:
  App:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 128M
```

## 日志与监控

### 日志管理

```
# 查看容器日志
docker logs <容器名>

# 持续跟踪（类似 tail -f）
docker logs -f <容器名>

# 显示最后 N 行
docker logs --tail 200 <容器名>

# 显示时间戳
docker logs -t <容器名>

# 组合使用
docker logs -f --tail 100 -t <容器名>

# 查看指定时间之后的日志
docker logs --since 2024-01-01T00:00:00 <容器名>
docker logs --since 1h <容器名>   # 最近 1 小时
```

**daemon.json 中已配置日志轮转（**`max-size: 50m`，`max-file: 3`），日志文件实际位于：

```
/var/lib/docker/containers/<容器ID>/<容器ID>-json.log
```

### 资源监控

```
# 实时监控所有容器资源
docker stats

# 监控指定容器
docker stats <容器名1> <容器名2>

# 输出一次（适合脚本/定时采集）
docker stats --no-stream --format \
  "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

### 容器状态信息

```
# 查看容器详细信息（JSON）
docker inspect <容器名>

# 提取特定字段
docker inspect --format '{{.State.Status}}' <容器名>
docker inspect --format '{{.NetworkSettings.IPAddress}}' <容器名>
docker inspect --format \
  '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <容器名>

# 查看容器内进程
docker top <容器名>

# 查看容器文件系统相对于镜像的变更
docker diff <容器名>
```

## 清理与维护

### 日常清理

```
# 删除所有停止的容器
docker container prune

# 删除 dangling 镜像（无 tag、无容器引用）
docker image prune

# 删除所有未被容器使用的镜像
docker image prune -a

# 删除所有未使用的网络
docker network prune

# 删除所有未使用的 volume（危险！确认无需保留再执行）
docker volume prune

# 一键清理容器、网络、镜像、构建缓存（不含 volume）
docker system prune

# 包含 volume 的完整清理（极度危险！）
docker system prune --volumes
```

### 查看磁盘占用

```
docker system df
docker system df -v   # 详细列出每个资源的占用
```

### 升级容器

```
# 单容器
docker pull <镜像名>:<tag>
docker stop <容器名>
docker rm <容器名>
docker run -d ...（原来的参数）

# Compose 项目（推荐）
docker compose pull
docker compose up -d
```

## 重启策略详解

**通过 **`--restart` 参数或 Compose 的 `restart` 字段控制容器异常退出后的行为

### 策略对比


| **策略**         | **说明**                                  | **适用场景**                       |
| ---------------- | ----------------------------------------- | ---------------------------------- |
| `no`             | **不自动重启（默认）**                    | **一次性任务、调试**               |
| `always`         | **总是重启，包括 Docker 服务重启后**      | **需要随 Docker 启动的服务**       |
| `on-failure[:N]` | **仅在退出码非 0 时重启，可限制次数**     | **允许正常退出、防止无限循环重启** |
| `unless-stopped` | **总是重启，但手动**`docker stop`后不恢复 | **生产服务推荐**                   |

### 关键区别

**`always` vs `unless-stopped`**：

* `always`：即使你手动 `docker stop` 了容器，下次 Docker 服务重启（如服务器重启）后，容器依然会被拉起
* `unless-stopped`：手动 `docker stop` 后，Docker 服务重启也**不会**自动拉起，尊重你的手动操作

**生产环境推荐 **`unless-stopped`，需要维护时 `docker stop` 后不会被意外恢复

**`on-failure`**：

```
# 最多重启 3 次，第 3 次失败后停止尝试
docker run --restart on-failure:3 <镜像>
```

**适合启动脚本、数据库迁移等任务：成功退出（exit 0）不重启，失败时最多重试 N 次**

### 设置与修改

```
# 运行时指定
docker run --restart unless-stopped <镜像>

# 修改已有容器的重启策略（无需重建）
docker update --restart unless-stopped <容器名/ID>

# 查看当前重启策略
docker inspect --format '{{.HostConfig.RestartPolicy.Name}}' <容器名>
```

## 健康检查与启动依赖

### 为什么需要健康检查

`depends_on` 默认只等待容器**启动**，不等待服务**就绪** **数据库容器启动后还需要几秒初始化，此时应用容器若已尝试连接会失败** **通过健康检查 + **`condition: service_healthy` 解决此问题

### Dockerfile 中定义健康检查

```
# 参数说明：
# --interval    每隔多久检查一次（默认 30s）
# --timeout     单次检查超时时间（默认 30s）
# --start-period 容器启动后的宽限期，期间失败不计入 retries（默认 0s）
# --retries     连续失败多少次才判定为 unhealthy（默认 3）

# HTTP 服务
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# TCP 端口检查
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD nc -z localhost 5432 || exit 1

# 禁用健康检查（覆盖基础镜像中的定义）
HEALTHCHECK NONE
```

### Compose 中定义健康检查

```
services:
  Database:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s   # 给 PostgreSQL 足够的初始化时间

  Redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  App:
    image: myapp
    depends_on:
      Database:
        condition: service_healthy   # 等待 Database healthy 后再启动
      Redis:
        condition: service_healthy
```

### depends\_on 条件类型


| **条件**                         | **说明**                                                |
| -------------------------------- | ------------------------------------------------------- |
| `service_started`                | **默认，仅等待容器启动（不等待就绪）**                  |
| `service_healthy`                | **等待健康检查通过后才启动当前服务**                    |
| `service_completed_successfully` | **等待依赖服务正常退出（exit 0），适合 migration 任务** |

### 查看健康状态

```
# 查看容器健康状态（STATUS 列会显示 healthy / unhealthy / starting）
docker ps

# 查看详细健康检查日志
docker inspect --format '{{json .State.Health}}' <容器名> | python3 -m json.tool
```

## 容器时区设置

**容器默认使用 UTC，如果宿主机是 Asia/Shanghai 而容器是 UTC，日志时间会相差 8 小时**

### 方法一：环境变量（推荐，适用于大多数镜像）

```
docker run -e TZ=Asia/Shanghai <镜像>
```

**Compose：**

```
services:
  App:
    environment:
      - TZ=Asia/Shanghai
```

### 方法二：挂载宿主机时区文件

```
docker run \
  -v /etc/localtime:/etc/localtime:ro \
  -v /etc/timezone:/etc/timezone:ro \
  <镜像>
```

**Compose：**

```
services:
  App:
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
```

### 方法三：Dockerfile 中固化时区

```
FROM debian:12-slim
RUN apt update && \
    apt install -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Shanghai
```

### 验证

```
docker exec <容器名> date
# 应输出类似：Wed Jun 11 10:00:00 CST 2025
```

## 私有镜像仓库

**团队内部使用，避免镜像上传到公网，同时加快拉取速度**

### 官方文档

* **Registry：**[https://hub.docker.com/\_/registry](https://hub.docker.com/_/registry)
* **Harbor（企业级）：**[https://goharbor.io/](https://goharbor.io/)

### 方案一：官方 Registry（轻量，个人 / 小团队）

```
# 部署
mkdir -p /opt/Registry
cat > /opt/Registry/compose.yaml <<'EOF'
services:
  Registry:
    image: registry:2
    container_name: Registry
    restart: unless-stopped
    ports:
      - "5000:5000"
    volumes:
      - ./data:/var/lib/registry
    environment:
      - REGISTRY_STORAGE_DELETE_ENABLED=true
EOF

cd /opt/Registry
docker compose up -d
```

```
# 推送镜像到私有仓库
docker tag myapp:1.0 <仓库IP>:5000/myapp:1.0
docker push <仓库IP>:5000/myapp:1.0

# 从私有仓库拉取
docker pull <仓库IP>:5000/myapp:1.0
```

**如果仓库没有 HTTPS，需要在客户端的 daemon.json 中添加：**

```
{
  "insecure-registries": ["<仓库IP>:5000"]
}
```

### 方案二：Harbor（企业级，含权限管理、漏洞扫描）

**Harbor 功能完整但部署较重，参考官方安装文档：**[https://goharbor.io/docs/latest/install-config/](https://goharbor.io/docs/latest/install-config/)

### 登录私有仓库

```
docker login <仓库地址>:<端口> -u <用户名>
```

## 多平台构建 buildx

**用于在 x86 机器上构建 ARM 镜像，或同时发布支持多架构的镜像**

### 官方文档

* [https://docs.docker.com/buildx/working-with-buildx/](https://docs.docker.com/buildx/working-with-buildx/)

### 准备工作

```
# 查看当前 builder
docker buildx ls

# 创建并使用支持多平台的 builder（首次使用需要创建）
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap

# 安装 QEMU 模拟器（用于跨架构模拟）
docker run --privileged --rm tonistiigi/binfmt --install all
```

### 构建并推送

```
# 构建多平台镜像并直接推送到仓库
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t <用户名>/<镜像名>:<tag> \
  --push \
  .

# 仅构建到本地（单平台，不支持多平台同时 load）
docker buildx build \
  --platform linux/amd64 \
  -t myapp:1.0 \
  --load \
  .
```

### 查看镜像支持的平台

```
docker buildx imagetools inspect <镜像名>:<tag>
```

## Docker Context 远程管理

**不需要 SSH 进入远程服务器，直接在本地用 docker 命令管理远端 Docker**

### 原理

**Docker CLI 通过 Context 切换连接目标，默认连接本机的 **`/var/run/docker.sock`，切换 context 后所有命令都在远端执行

### 创建远程 Context

```
# 通过 SSH 连接远程 Docker（推荐，无需暴露 Docker API 端口）
docker context create <context名> \
  --docker "host=ssh://root@<远程IP>:<端口>"

# 示例
docker context create aliyun-gz \
  --docker "host=ssh://root@10.144.144.1:48237"
```

### 管理 Context

```
# 查看所有 context
docker context ls

# 切换 context（切换后所有命令在该远端执行）
docker context use <context名>

# 切回本地
docker context use default

# 删除 context
docker context rm <context名>
```

### 单次使用远程 Context（不切换默认）

```
docker --context aliyun-gz ps
docker --context aliyun-gz compose up -d
```

### 注意事项

* **使用 SSH context 需要本地能 SSH 免密登录远端（密钥认证）**
* `docker compose` 命令同样支持 context，但构建时上下文仍在本地，大项目传输慢

## Secrets 管理

### .env 文件的局限

`.env` 文件中的值会以明文环境变量注入容器，通过 `docker inspect` 可以直接看到所有环境变量值，存在泄漏风险** **Secrets 将敏感数据以文件形式挂载到容器内 `/run/secrets/<secret名>`，不出现在环境变量中

### Compose secrets 用法

```
services:
  Database:
    image: postgres:16
    container_name: Database
    restart: unless-stopped
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: appuser
      # 不再直接写密码，改用 secrets
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    networks:
      - AppNet

  App:
    image: myapp
    secrets:
      - db_password
      - api_key
    # 在代码中读取 /run/secrets/db_password 文件内容作为密码

secrets:
  db_password:
    file: ./secrets/db_password.txt   # 文件中只写密码内容，无换行
  api_key:
    file: ./secrets/api_key.txt

networks:
  AppNet:
    name: AppNet
```

### 创建 secret 文件

```
mkdir -p ./secrets
# 写入密码（printf 避免末尾换行）
printf 'supersecretpassword' > ./secrets/db_password.txt
printf 'sk-xxxxxxxxxxxx' > ./secrets/api_key.txt
chmod 600 ./secrets/*.txt
```

**将 **`secrets/` 目录加入 `.gitignore`：

```
secrets/
.env
```

### 在容器内读取 secret

**应用代码读取文件而非环境变量：**

```
# Python 示例
with open('/run/secrets/db_password') as f:
    db_password = f.read().strip()
```

```
// Go 示例
import "os"
data, _ := os.ReadFile("/run/secrets/db_password")
dbPassword := string(data)
```

### 验证 secret 未暴露在环境变量中

```
 # 不会看到密码明文
 docker inspect --format '{{json .Config.Env}}' <容器名>
 
 # secret 以 tmpfs 挂载，仅容器内可读
 docker exec <容器名> cat /run/secrets/db_password
```
