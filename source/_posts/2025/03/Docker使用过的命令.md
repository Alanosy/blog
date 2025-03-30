---
title: Docker使用过的命令
tags: []
categories: []
permalink: posts/1.html
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-03-30 20:20:23
updated: 2025-03-30 20:20:23
topic:
banner:
references:
---

## Docker使用过的命令记录

## Zookeeper

1. 拉取镜像

``` bash
docker pull zookeeper
```

2. 创建挂载容器中的数据目录

``` bash
mkdir zookeeper && cd zookeeper
mkdir data
```

3. 启动命令

``` bash
docker run \
-d \
--name zookeeper \
--privileged=true \
-p 2181:2181 \
-v $PWD/data:/data \
-v $PWD/conf:/conf \
-v $PWD/logs:/datalog \
zookeeper

```

注：-d 后台运行 -p 端口映射 -e 设置时区 --name设置容器名 --restart always自启动 -v将本地目录挂载到容器

4. 配置文件

/zookeeper/conf下

``` cfg
dataDir=/data  # 保存zookeeper中的数据
clientPort=2181 # 客户端连接端口，通常不做修改
dataLogDir=/datalog
tickTime=2000  # 通信心跳时间
initLimit=5    # LF(leader - follower)初始通信时限
syncLimit=2    # LF 同步通信时限
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
maxClientCnxns=60
standaloneEnabled=true
admin.enableServer=true
server.1=localhost:2888:3888;2181
```

## Consul

1. 拉取镜像

``` bash
docker pull consul:1.6.1
```

2. 启动命令

``` bash
docker run \
-d \
-p 8500:8500 \
--name=consul \
consul:1.6.1 \
consul agent -dev \
-ui -node=n1 -bootstrap-expect=1 -client=0.0.0.0
```


