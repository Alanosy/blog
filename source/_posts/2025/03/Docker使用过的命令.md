---
title: Docker使用过的命令
tags: [中间件]
categories: [中间件]
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

## Kafka

``` bash 
docker run \
-d \
--name kafka \
-p 9092:9092 \
--link zookeeper:zookeeper \
--env KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
--env KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
--env KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
--env KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 wurstmeister/kafka

```

## Rabbitmq

1. 拉取镜像

``` bash
docker pull rabbitmq
```

2. 启动命令

``` bash
docker run -d -p 15672:15672 -p 5672:5672 \
        --restart=always \
        -e RABBITMQ_DEFAULT_USER=admin \
        -e RABBITMQ_DEFAULT_PASS=Aa112211 \
        --hostname myRabbit \
        --name rabbitmq \
        rabbitmq
```

3. 开启Web端

``` bash
#进入rabbitmq容器
docker exec -it 容器名/容器id /bin/bash
#开启web客户端
rabbitmq-plugins enable rabbitmq_management
```

