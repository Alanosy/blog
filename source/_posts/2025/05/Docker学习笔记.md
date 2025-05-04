---
title: Docker学习笔记
tags: []
categories: []
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

### Docker学习笔记

#### 第一章：镜像

| 命令          | 命令含义 |
| ------------- | -------- |
| docker search | 搜索镜像 |
| docker pull   | 下载镜像 |
| docker images | 镜像列表 |
| docker rmi    | 删除镜像 |

#### 第二章：容器

| 容器           | 命令含义 |
| -------------- | -------- |
| docker run     | 运行     |
| docker ps      | 查看     |
| docker stop    | 停止     |
| docker start   | 启动     |
| docker restart | 重启     |
| docker stats   | 状态     |
| docker logs    | 日志     |
| docker exec    | 进入     |
| docker rm      | 删除     |

##### docker run 运行参数：

docker run  参数放中间 镜像名

1. -d 后台运行

2. --name 给容器取名

3. -p 外部端口:内部端口  端口映射
4. -e 指定环境变量
5. --restart always 开机自启
6. --network 网络名 加入自定义网络
7. -v 目录挂载

##### docker exec进入：

``` bash 
docker exec -it 容器名 /bin/bash
```

##### docker ps查看：

默认是查看运行中的容器

-a  查看所有容器，包括停止和启动的容器

-aq 打印所有容器id。docker rm -f $(docker ps -aq) 批量删除所有容器

##### docker rm删除参数：

-f  强制删除



#### 第三章：保存容器

| 命令          | 命令含义 |
| ------------- | -------- |
| docker commit | 提交     |
| docker save   | 保存     |
| docker load   | 加载     |

##### docker commit 提交

-a 指定作者

-c 有那行改变列表

-m 提交信息

-p 暂停容器运行

``` bash
docker commit -m "提交信息" 容器名 镜像名:版本号
```

##### docker save 

-o 指定输出的文件名

``` bash
docker save -o 输出的文件名.tar 镜像名:版本号
```

##### docker load:

-i 指定压缩包路径

#### 第四章：分享

* docker login 登录
* docker tag 命名
* docker push 推送

##### docker tag:

``` bash
docker tag 原来的镜像:版本号 新的目标镜像:版本号
```

##### docker push

``` bash
docker push 镜像名:版本号
```

#### 第五章：存储

##### 目录挂载：-v 本地路径:容器路径

##### 卷映射 -v 卷名:容器路径      

只需要取卷名，不已./路径开始，docker会自动创建存储位置，去把容器内部的内容信息和外部保持一致 

卷映射 统一把文件放在了 /var/lib/docker/volumes/卷名

docker volume 对卷的操作

ls查看卷列表

 create 卷名 自己创建卷

inspect 卷名 查看卷详情 可以查看卷位置

#### 第六章：网络

docker 会为每个容器分配唯一ip，使用容器ip+容器

docker0默认不支持主机域名

##### 创建自定义网络

容器名就是稳定域名

docker network 

1. create 创建网络

2. rm 删除网络

3. ls查看网络列表

4. inspect查看网络详情

创建自定义网络

``` bash
docker network create 网络名
```

docker run 加入网络时用 --network 网络名

#### 第七章：Docker Compose

首先要创建一个yaml文件

| 命令                          | 命令含义      |
| ----------------------------- | ------------- |
| docker compose up -d          | 上线 后台运行 |
| docker compose down           | 下线          |
| docker compose start x1 x2 x3 | 启动          |
| docker compose stop x1 x3     | 停止          |
| docker compose scale x2=3     | 扩容          |

##### docker compose 语法

顶级元素：

| 元素名   | 元素含义 |
| -------- | -------- |
| name     | 名字     |
| services | 服务     |
| networks | 网络     |
| volumes  | 卷       |
| configs  | 配置     |
| secrets  | 密钥     |

案例：

``` yaml
name: 应用部署的名字
services: 我们要部署的服务
	container_name: 容器名
	image: 要使用的镜像:版本号
	ports: 要暴露的端口
		- "物理机端口:容器内部端口"
		- "物理机端口:容器内部端口"
	environment: 环境变量
		- 键=名
		- 键=名
	volumes: 目录挂载，注意如果是挂载的「卷」要在下面的volumes中声明
		- 卷名:路径
		- 路径:路径
	restart: always 开启自启
	networks:
		- 网络名
networks: 网络
	网络名: 只需要写个"网络名:"就行
volumes: 卷
	卷名: 只需要写个"卷名:"就行，下面也可以配置详细信息
```

启动

``` bash
docker compose -f yaml文件名 up -d
```

启动后的网络和卷名会加上"应用名_"的前缀，容器名如果没有指定也会加这个前缀

下线

``` bash
docker -f yaml文件名 compose down
```

可以在down后面指定参数

--rmi all 移除dockerpose中包含的本地所有镜像

-v 移除本地卷

#### 第八章：DockerFile

| 常见指令   | 作用               |
| ---------- | ------------------ |
| FROM       | 指定镜像基础环境   |
| RUN        | 运行自定义命令     |
| CMD        | 容器启动命令或参数 |
| LABEL      | 自定义标签         |
| EXPOSE     | 指定暴露端口       |
| ENV        | 环境变量           |
| ADD        | 添加文件到镜像     |
| COPY       | 复制文件到镜像     |
| ENTRYPOINT | 容器固定启动命令   |
| VOLUME     | 数据卷             |
| USER       | 指定用户和用户组   |
| WORKDIR    | 指定默认工作目录   |
| ARG        | 指定构建参数       |

案例

``` 
FROM openjdk:17
LABEL author=alan
COPY app.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]
```

构建命令

``` bash
docker build -f 指定文件名 -t 镜像名:版本号 .
```

