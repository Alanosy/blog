---
title: Nacos笔记
tags: [微服务]
categories: [微服务]
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-12-22 22:28:50
updated: 2025-12-22 22:28:50
topic:
banner:
references:
---

# Nacos

一个注册中心+配置中心的组合，Nacos支持AP和CP模型

登录地址

```
http://localhost:8848/nacos
```

默认账户 nacos 默认密码 nacos

## Nacos服务提供者注册

### Pom怎么找

``` 
https://spring.io
```

Projects->springClound->springCloudAlibaba->Learn->Reference Doc中去查找

``` xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2.0.0.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 基于Nacos的服务提供者

1. 建Module
2. Pom

* 父工程

``` xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2.0.0.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

* 子POM

``` xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

1. Yml

```properties
server.port=8081 // 服务端口号
spring.application.name=nacos-producer // 服务名称
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848 // 注入到什么地方
management.endpoints.web.exposure.include=* // 监控的端点全部打开
```

1. 主启动

``` java 
@SpringBootApplication
@EnableDiscoveryClient // nacos要添加该注解
public class NacosProviderDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosProducerDemoApplication.class, args);
    }

}
```

1. 业务类
2. 测试

注入后可以登录nacos访问服务列表查看

### Nacos之服务提供者注册和负载

为什么nacos支持负载均衡

是因为nacos-discovery继承了ribbon,天生自带负载均衡

* 注意

如果用RestTemplate去调我们的微服务的时候，如果使用到ribbon要加**@LoadBalanced**注解

``` java
@Bean
@LoadBalanced
public RestTemplate getRestTemplate(){
  return new RestTemplate();
}
```

### Nacos服务注册中心对比提升

![截屏2025-12-23 下午10.18.42](http://bucket.alan.org.cn/blog/截屏2025-12-23 下午10.18.42.png)

* 何时选何种模式
  * 如果不需要存储服务级别的信息且服务实例是通过nacos-client注册，并能够保持心跳上报，那么就可以选择AP模式。当前主流的服务如 Spring cloud 和 Dubbo 服务，都适用于AP模式，AP模式为了服务的可能性而减弱了一致性，因此AP模式下只支持注册临时实例。
  * 如果需要在服务级别编辑或者存储配置信息，那么CP 是必须，K8S服务和DNS服务则适用于CP模式,CP模式下则支持注册持久化实例，此时则是以 Raft 协议为集群运行模式，该模式下注册实例之前必须先注册服务，如果服务不存在，则会返回错误。

* AP和CP模式的切换命令

  ``` bash
  curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP'
  ```

### Nacos之服务配置中心

#### Nacos作为配置中心的基础配置

1. POM

* 父工程

``` xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2.0.0.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

* 子工程

``` xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2. 配置文件

Nacos同springcloud-config一样，在项目初始化时，要保证先从配置中心进行配置拉取拉取配置之后，才能保证项目的正常启动。springboot中配置文件的加载是存在优先级顺序的，bootstrap优先级高于application

全局的重点点放在bootstrap，自己的放在application

Bootstrap.yml

``` yml
# nacos配置
server:
  port: 3377
spring:
  application:
    name: nacos-config-client
	cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
			config:
				server-addr: localhost:8848 #Nacos作为配置中心地址
				file-extension: yaml #指定yaml格式的配置
# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

Application.yml

``` yml
spring:
  profiles:
    active: dev # 表示开发环境
```

3. 主启动类

``` java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @auther zzyy
 * @create 2020-02-10 16:51
 */
@EnableDiscoveryClient
@SpringBootApplication
public class NacosConfigClientMain3377
{
public static void main(String[] args) {
            SpringApplication.run(NacosConfigClientMain3377.class, args);
    }
}
```

4. 业务类：**@RefreshScope**动态刷新注解（热更新）

``` java
package com.atguigu.springcloud.alibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @auther zzyy
 * @create 2020-02-10 16:55
 */
@RestController
@RefreshScope //在控制器类加入@RefreshScope注解使当前类下的配置支持Nacos的动态刷新功能。
public class ConfigClientController
{
@Value("${config.info}")
private String configInfo;

@GetMapping("/config/info")
public String getConfigInfo() {
return configInfo;
    }
}
```

官网地址

``` 
https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html
```

dataid的格式为

```
# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

![img](http://bucket.alan.org.cn/blog/F03F3150-616D-4B55-A5D4-1761B178D249.png)

![img](http://bucket.alan.org.cn/blog/3F2CF3AF-4307-41EE-8514-225A2F3B7162.png)

![img](http://bucket.alan.org.cn/blog/141E85C1-486B-4E6D-B8C1-CCD3F42B023A.png)

### Nacos之命名空间、分组和DataID三者之间的关系

![img](http://bucket.alan.org.cn/blog/CF4DD26E-06C0-4A8F-8342-2AE8D999403C.png)

 默认情况：

Namespace=public，Group=DEFAULT_GROUP, 默认Cluster是DEFAULT

Nacos默认的命名空间是public，Namespace主要用来实现隔离。

比方三个环境：开发、测试、生产环境，就可以创建三个Namespace，不同的Namespace之间是隔离的。

Group默认是DEFAULT_GROUP，Group可以把不同的微服务划分到同一个分组里面去

Service就是微服务；一个Service可以包含多个Cluster（集群），Nacos默认Cluster是DEFAULT，Cluster是对指定微服务的一个虚拟划分。

比方说为了容灾，将Service微服务分别部署在了不同机房，

这时就可以给不通机房的Service微服务起一个集群名称，还可以尽量让同一个机房的微服务互相调用，以提升性能。

最后是Instance，就是微服务的实例。

### Nacos之DataID配置

指定spring.profile.active和配置文件的DataID来使不同环境下读取不同的配置

默认空间+默认分组+新建dev和test两个DataID

![img](http://bucket.alan.org.cn/blog/93B00EC4-8E81-474E-90DE-3B24688A01A3.png)

### Nacos之Group分组方案

* 在配置congfig下面添加group参数，添加**分组名称**
* 分组名称是创建配置的时候手动填写的

![img](http://bucket.alan.org.cn/blog/F231D363-C051-4D03-BC76-0E0EB6AA4201.png)

``` yml
# nacos配置
server:
  port: 3377
spring:
  application:
    name: nacos-config-client
	cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
			config:
				server-addr: localhost:8848 #Nacos作为配置中心地址
				file-extension: yaml #指定yaml格式的配置
				group: groupName # 指定分组名称
# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

### Nacos之NameSpace命名空间

![img](http://bucket.alan.org.cn/blog/717CCEB8-A11C-402F-B831-F95079387384.png)

* 在配置congfig下面添加namespace参数，添加**命名空间的id**
* 命名空间在左侧菜单栏点击命名空间创建

``` yml
# nacos配置
server:
  port: 3377
spring:
  application:
    name: nacos-config-client
	cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
			config:
				server-addr: localhost:8848 #Nacos作为配置中心地址
				file-extension: yaml #指定yaml格式的配置
				group: groupName # 指定分组名称
				namespace: nameSpaceID # 指定命名空间id
```

## Nacos集群

Coming soon...

## Nacos持久化

Coming soon...

