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

一个注册中心+配置中心的组合，Nacos是AP模型

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



Coming soon...

