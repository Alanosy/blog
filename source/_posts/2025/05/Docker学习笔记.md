---
title: Docker学习笔记
tags: [中间件]
categories: [中间件]
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-04 18:08:31
updated: 2025-05-04 18:08:31
topic:
banner:
references:
---

# Docker 学习笔记

## 第一章：镜像管理

| 命令            | 描述                   | 常用参数                   |
| --------------- | ---------------------- | -------------------------- |
| `docker search` | 搜索Docker Hub上的镜像 | `--limit` 限制搜索结果数量 |
| `docker pull`   | 下载镜像到本地         | `-a` 下载所有标签版本      |
| `docker images` | 列出本地镜像           | `-q` 只显示镜像ID          |
| `docker rmi`    | 删除本地镜像           | `-f` 强制删除              |

**补充细节**：
- 删除镜像前需确保没有容器在使用该镜像
- 使用`docker image prune`可清理悬空镜像
- 镜像命名规范：`[仓库地址]/[命名空间]/[镜像名]:[标签]`

## 第二章：容器操作

| 命令             | 描述                 |
| ---------------- | -------------------- |
| `docker run`     | 创建并启动容器       |
| `docker ps`      | 查看容器列表         |
| `docker stop`    | 停止运行中的容器     |
| `docker start`   | 启动已停止的容器     |
| `docker restart` | 重启容器             |
| `docker stats`   | 查看容器资源使用情况 |
| `docker logs`    | 查看容器日志         |
| `docker exec`    | 进入运行中的容器     |
| `docker rm`      | 删除容器             |

### `docker run` 详细参数

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

常用参数：
- `-d`：后台运行（守护模式）
- `--name`：指定容器名称
- `-p`：端口映射（格式：`主机端口:容器端口`）
- `-e`：设置环境变量
- `--restart`：重启策略（`always|on-failure|unless-stopped`）
- `--network`：指定网络
- `-v`：数据卷/目录挂载

### 其他命令细节

**进入容器**：
```bash
docker exec -it 容器名 /bin/bash
# 或使用sh
docker exec -it 容器名 /bin/sh
```

**查看容器**：
- `docker ps -a`：查看所有容器（包括已停止的）
- `docker ps -aq`：只显示容器ID

**批量操作**：
```bash
# 停止所有容器
docker stop $(docker ps -aq)

# 删除所有容器
docker rm -f $(docker ps -aq)
```

## 第三章：镜像保存与加载

| 命令            | 描述                |
| --------------- | ------------------- |
| `docker commit` | 将容器保存为新镜像  |
| `docker save`   | 将镜像保存为tar文件 |
| `docker load`   | 从tar文件加载镜像   |

**`docker commit`示例**：
```bash
docker commit -m "描述信息" 容器名 新镜像名:标签
```

**镜像导出导入**：
```bash
# 导出镜像
docker save -o image.tar 镜像名:标签

# 导入镜像
docker load -i image.tar
```

## 第四章：镜像分享

| 命令           | 描述                |
| -------------- | ------------------- |
| `docker login` | 登录Docker Registry |
| `docker tag`   | 给镜像打标签        |
| `docker push`  | 推送镜像到Registry  |

**操作流程**：
1. 登录仓库：`docker login registry.example.com`
2. 重命名镜像：`docker tag 原镜像 新镜像名:标签`
3. 推送镜像：`docker push 新镜像名:标签`

## 第五章：数据存储

### 挂载方式
1. **目录挂载**：`-v /host/path:/container/path`
2. **卷挂载**：`-v volume_name:/container/path`

### 卷管理
```bash
# 查看所有卷
docker volume ls

# 创建卷
docker volume create my_volume

# 查看卷详情
docker volume inspect my_volume
```

**注意**：
- 卷默认存储在`/var/lib/docker/volumes/`
- 卷的生命周期独立于容器

## 第六章：网络管理

### 常用命令
```bash
# 创建网络
docker network create my_network

# 查看网络
docker network ls

# 查看网络详情
docker network inspect my_network

# 删除网络
docker network rm my_network
```

### 容器连接网络
```bash
docker run --network=my_network ...
```

**特点**：
- 自定义网络支持DNS解析（容器名即主机名）
- 默认bridge网络不支持容器名解析

## 第七章：Docker Compose

### 基本命令
```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 启停特定服务
docker compose start/stop service_name

# 扩容服务
docker compose scale service=num
```

### YAML文件结构
```yaml
name: 应用名称
services:
  服务名:
    container_name: 容器名
    image: 镜像:标签
    ports:
      - "主机端口:容器端口"
    environment:
      - KEY=VALUE
    volumes:
      - 卷名:容器路径
      - 主机路径:容器路径
    networks:
      - 网络名
    restart: always

networks:
  网络名:

volumes:
  卷名:
```

**注意**：

- 资源名称会添加`应用名_`前缀
- `down`命令可选参数：
  - `--rmi all`：删除相关镜像
  - `-v`：删除关联卷

## 第八章：Dockerfile

### 常用指令

| 指令         | 说明          | 示例                          |
| ------------ | ------------- | ----------------------------- |
| `FROM`       | 基础镜像      | `FROM ubuntu:20.04`           |
| `RUN`        | 执行命令      | `RUN apt-get update`          |
| `CMD`        | 容器启动命令  | `CMD ["python", "app.py"]`    |
| `EXPOSE`     | 声明暴露端口  | `EXPOSE 8080`                 |
| `ENV`        | 设置环境变量  | `ENV APP_HOME=/app`           |
| `COPY`       | 复制文件      | `COPY . /app`                 |
| `ADD`        | 复制+解压文件 | `ADD app.tar.gz /app`         |
| `WORKDIR`    | 设置工作目录  | `WORKDIR /app`                |
| `ENTRYPOINT` | 容器入口点    | `ENTRYPOINT ["java", "-jar"]` |
| `VOLUME`     | 创建挂载点    | `VOLUME /data`                |
| `USER`       | 指定运行用户  | `USER appuser`                |
| `ARG`        | 构建参数      | `ARG APP_VERSION=1.0`         |

**案例**:

``` 
FROM openjdk:17

LABEL author=alan

COPY app.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app.jar"]
```

### 构建镜像

```bash
docker build -t 镜像名:标签 -f Dockerfile路径 上下文路径
# 示例
docker build -t myapp:1.0 -f ./Dockerfile .
```

