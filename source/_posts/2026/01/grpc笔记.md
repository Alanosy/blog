---
title: grpc笔记
tags: [微服务]
categories: [微服务]
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2026-01-08 23:05:53
updated: 2026-01-08 23:05:53
topic:
banner:
references:
---

## 如何编写proto

``` protobuf
syntax = "proto3";

option java_multiple_files = true;
// 生成位置
option java_package = "com.lizq.jrpc.api";
option java_outer_classname = "UserService";

package user;

service User {
    rpc SayHello (UserRequest) returns (UserResponse) {}
}

message UserRequest {
    string name = 1;
    int32 age = 2;
    string addr = 3;
}

message UserResponse {
    string name = 1;
    int32 age = 2;
    string addr = 3;
    OtherMsg otherMsg = 4;
    map<string, string> otherMap = 5;

    // 嵌套对象
    message OtherMsg {
        string ext1 = 1;
        string ext2 = 2;
    }
}

```

## 如何编写proto

* **syntax = "proto3";**：指定使用的protobuf版本；
* **option java_multiple_files = true;**：如果为 false，则只会.java为此文件生成一个.proto文件，以及所有 Java 类/枚举/等。为顶级消息、服务和枚举生成的将嵌套在外部类中。如果为 true，.java将为每个 Java 类/枚举/等生成单独的文件。为顶级消息、服务和枚举生成，并且为此.proto文件生成的包装 Java 类将不包含任何嵌套类/枚举/等。 如果不生成 Java 代码，则此选项无效。
* **package user;**：定义本服务的包名，避免不同服务相同消息类型产生冲突；
* **option java_package = "com.lizq.jrpc.api";**：生成java文件包名；
* **option java_outer_classname = "UserService";**：生成java文件类名称。如果文件中没有明确 java_outer_classname指定，.proto则将通过将.proto文件名转换为驼峰式来构造类名（因此 foo_bar.proto变为FooBar.java）
* **message UserResponse**：定义服务的接口名称；
* **rpc SayHello (UserRequest) returns (UserResponse) {}**：远程调用方法名，参数及响应类型；
* **message XXXXX{}：**定义数据类型；



## 数据类型及对应关系

| .proto类型 | Notes                                                        | C++ Type | Java/Kotlin | Python                           |
| ---------- | ------------------------------------------------------------ | -------- | ----------- | -------------------------------- |
| double     |                                                              | double   | double      | float                            |
| float      |                                                              | float    | float       | float                            |
| int32      | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint32。 | int32    | int         | int                              |
| int64      | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint64。 | int64    | long        | int/long                         |
| uint32     | 使用可变长度编码。                                           | uint32   | int         | int/long                         |
| uint64     | 使用可变长度编码。                                           | uint64   | long        | int/long                         |
| sint32     | 使用可变长度编码。带符号的 int 值。这些比常规 int32 更有效地编码负数。 | int32    | int         | int                              |
| sint64     | 使用可变长度编码。带符号的 int 值。这些比常规 int64 更有效地编码负数。 | int64    | long        | int/long                         |
| fixed32    | 总是四个字节。如果值通常大于 228，则比 uint32 更有效         | uint32   | int         | int/long                         |
| fixed64    | 总是八个字节。如果值通常大于 256，则比 uint64 更有效。       | uint64   | long        | int/long                         |
| sfixed32   | 总是四个字节。                                               | int32    | int         | int                              |
| sfixed64   | 总是八个字节。                                               | int64    | long        | int/long                         |
| bool       |                                                              | bool     | boolean     | bool                             |
| string     | 字符串必须始终包含 UTF-8 编码或 7 位 ASCII 文本，并且不能超过 232。 | string   | String      | str/unicode                      |
| bytes      | 可能包含不超过 2 32的任意字节序列。                          | string   | ByteString  | str (Python 2)、bytes (Python 3) |


## 枚举
``` 
enum Sex {
  NONE = 0;
  MAN = 1;
  WOMAN = 2;
}

message UserRequest {
  string name = 1;
  int32 age = 2;
  string addr = 3;
  Sex sex = 4;
}
**注意：**第一个枚举的值必须为0，因为0 是默认值，0 必须是第一个，保持和proto2 兼容
```

## 数组
使用 repeated 关键字来定义数组。

```
message UserRequest {
  string name = 1;
  int32 age = 2;
  string addr = 3;
  Sex sex = 4;
  // 定义一个数组
  repeated string cellphones = 5;
}
```


## map类型
在开发的过程中经常需要使用关联字段，很自然的想到使用map，protobuf也提供了map的类型。

```
message UserResponse {
  string name = 1;
  map<string, string> otherMap = 2;
}
```


注意： map 字段前面不能是repeated

## 嵌套对象
``` java
message UserResponse {
  string name = 1;
  int32 age = 2;
  string addr = 3;
  OtherMsg otherMsg = 4;
  map<string, string> otherMap = 5;

  // 嵌套对象
  message OtherMsg {
    string ext1 = 1;
    string ext2 = 2;
  }
}
```

## SpringBoot使用grpc

### Service端

#### POM

注意：

1. grpc-spring-boot-[starter](https://so.csdn.net/so/search?q=starter&spm=1001.2101.3001.7020)

2. os-maven-plugin

3. protobuf-maven-plugin

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.6</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.leadtrans</groupId>
    <artifactId>report</artifactId>
    <version>1.6.0</version>
    <name>report</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
        <spring-cloud.version>2020.0.4</spring-cloud.version>
        <!--    GRPC    -->
        <grpc-spring-boot-starter.version>2.3.2</grpc-spring-boot-starter.version>
        <os-maven-plugin.version>1.6.0</os-maven-plugin.version>
        <protobuf-maven-plugin.version>0.5.1</protobuf-maven-plugin.version>
    </properties>
    <dependencies>
 
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
 
        <!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.78</version>
        </dependency>
 
        <!--    GRPC    -->
        <dependency>
            <groupId>org.lognet</groupId>
            <artifactId>grpc-spring-boot-starter</artifactId>
            <version>${grpc-spring-boot-starter.version}</version>
        </dependency>
 
    </dependencies>
 
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <extensions>
            <!-- os-maven-plugin -->
            <extension>
                <groupId>kr.motd.maven</groupId>
                <artifactId>os-maven-plugin</artifactId>
                <version>${os-maven-plugin.version}</version>
            </extension>
        </extensions>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
            <!-- protobuf-maven-plugin -->
            <plugin>
                <groupId>org.xolstice.maven.plugins</groupId>
                <artifactId>protobuf-maven-plugin</artifactId>
                <version>${protobuf-maven-plugin.version}</version>
                <configuration>
                    <protocArtifact>com.google.protobuf:protoc:3.5.1-1:exe:${os.detected.classifier}</protocArtifact>
                    <pluginId>grpc-java</pluginId>
                    <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.11.0:exe:${os.detected.classifier}</pluginArtifact>
                    <outputDirectory>${project.build.sourceDirectory}</outputDirectory>
                    <clearOutputDirectory>false</clearOutputDirectory>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>compile-custom</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 创建Proto

> PS：Proto文件夹，必须和JAVA同级！

> PS:请使用 option java_package="xxxx"，
>
> 而不是 package xxxx
>
> package xxxx 会导致你引用其他包时，会报错

``` protobuf
syntax = "proto3";
 
option java_multiple_files = true;
option java_package="com.example.test.helloworld";
 
//请求
message Request {
  double num1 = 1;
  double num2 = 2;
  OperateType opType = 3;
}
 
//操作类型
enum OperateType {
  Addition = 0;
  Division = 1;
  Multiplication = 2;
  Subtraction = 3;
}
message Response {
  double result = 1;
}
 
//定义服务
service Operate {
  rpc Calculate (Request) returns (Response);
}
```

#### 执行命令，生成文件

```
mvn clean install 
或者点击
protobuf:compile 和 protobuf:compile-custom
```

#### 实现接口

**为了简单演示，这里就直接设置Response.Result=2**

**OperateImpl**

``` java
@GRpcService
public class OperateImpl extends OperateGrpc.OperateImplBase {
    @Override
    public void calculate(Request request,
                          StreamObserver<Response> responseObserver) {
        Response response=Response.newBuilder().setResult(2).build();
        System.out.println(response);
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
```

### Client端

#### POM（同Service端）

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.6</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>test1</artifactId>
    <version>1.0</version>
    <name>test1</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
        <spring-cloud.version>2021.0.0</spring-cloud.version>
        <grpc-spring-boot-starter.version>2.3.2</grpc-spring-boot-starter.version>
        <os-maven-plugin.version>1.6.0</os-maven-plugin.version>
        <protobuf-maven-plugin.version>0.5.1</protobuf-maven-plugin.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
 
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- grpc -->
        <dependency>
            <groupId>org.lognet</groupId>
            <artifactId>grpc-spring-boot-starter</artifactId>
            <version>${grpc-spring-boot-starter.version}</version>
        </dependency>
    </dependencies>
 
    <build>
        <extensions>
            <!-- os-maven-plugin -->
            <extension>
                <groupId>kr.motd.maven</groupId>
                <artifactId>os-maven-plugin</artifactId>
                <version>${os-maven-plugin.version}</version>
            </extension>
        </extensions>
        <plugins>
            <!-- spring-boot-maven-plugin -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <!-- protobuf-maven-plugin -->
            <plugin>
                <groupId>org.xolstice.maven.plugins</groupId>
                <artifactId>protobuf-maven-plugin</artifactId>
                <version>${protobuf-maven-plugin.version}</version>
                <configuration>
                    <protocArtifact>com.google.protobuf:protoc:3.5.1-1:exe:${os.detected.classifier}</protocArtifact>
                    <pluginId>grpc-java</pluginId>
                    <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.11.0:exe:${os.detected.classifier}</pluginArtifact>
                    <outputDirectory>${project.build.sourceDirectory}</outputDirectory>
                    <clearOutputDirectory>false</clearOutputDirectory>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>compile-custom</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
 
</project>
```

#### 拷贝Proto

和java同级目录

#### 执行命令

```
mvn clean install 
或者点击
protobuf:compile 和 protobuf:compile-custom
```

**4，调用方法**

``` 
CalculateService
```

其中 main方法，是测试方法。

GRPC启动的默认端口是6565，在main中设置了。

``` java
public class CalculateService {
    private final ManagedChannel channel;
    private final OperateGrpc.OperateBlockingStub blockingStub;
 
    private CalculateService(ManagedChannel channel) {
        this.channel = channel;
        blockingStub = OperateGrpc.newBlockingStub(channel);
    }
 
    public CalculateService(String host, int port) {
        this(ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build());
    }
 
    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }
 
    public float operate(float num1, float num2, OperateType operateType) {
        Request request = Request.newBuilder().setNum1(num1).setNum2(num2).setOpType(operateType).build();
        Response response = blockingStub.calculate(request);
        return (float) response.getResult();
    }
 
    public static void main(String[] args) {
        try {
            CalculateService service = new CalculateService("localhost", 6565);
            System.out.println(service.operate(100, 0, OperateType.Division));
            service.shutdown();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
 
}
```

