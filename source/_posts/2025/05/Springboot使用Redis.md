---
title: Springboot使用Redis
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 00:54:34
updated: 2025-05-11 00:54:34
topic:
banner:
references:
---

# Springboot使用Redis

以下是 Spring Boot 操作 Redis 的完整方法笔记，涵盖基础操作、高级特性、事务、管道、分布式锁等场景，并提供代码示例和最佳实践。

---

### **一、环境配置**
#### 1. 添加依赖
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId> <!-- 连接池支持 -->
</dependency>
```

#### 2. 配置文件
```yaml
# application.yml
spring:
  redis:
    host: 127.0.0.1
    port: 6379
    password: yourpassword
    lettuce:
      pool:
        max-active: 8
        max-wait: -1ms
        max-idle: 8
        min-idle: 0
```

---

### **二、基础操作**
#### 1. 注入 `RedisTemplate` 或 `StringRedisTemplate`
```java
@Autowired
private RedisTemplate<String, Object> redisTemplate; // 可存储任意对象

@Autowired
private StringRedisTemplate stringRedisTemplate; // 仅操作字符串
```

#### 2. 常用数据操作
| 操作类型   | 方法示例                                                     | 说明                       |
| ---------- | ------------------------------------------------------------ | -------------------------- |
| **String** | `redisTemplate.opsForValue().set("key", "value")`            | 设置值                     |
|            | `String value = stringRedisTemplate.opsForValue().get("key")` | 获取值                     |
| **Hash**   | `redisTemplate.opsForHash().put("user", "name", "Alice")`    | 设置Hash字段               |
|            | `Map<Object, Object> user = redisTemplate.opsForHash().entries("user")` | 获取整个Hash               |
| **List**   | `redisTemplate.opsForList().rightPush("list", "item1")`      | 右插入列表                 |
|            | `List<Object> items = redisTemplate.opsForList().range("list", 0, -1)` | 获取列表范围               |
| **Set**    | `redisTemplate.opsForSet().add("set", "a", "b", "c")`        | 添加集合元素               |
|            | `Set<Object> set = redisTemplate.opsForSet().members("set")` | 获取所有集合元素           |
| **ZSet**   | `redisTemplate.opsForZSet().add("zset", "member", 90.0)`     | 添加有序集合元素（带分数） |
|            | `Set<Object> top3 = redisTemplate.opsForZSet().range("zset", 0, 2)` | 获取排名前3的元素          |

---

### **三、高级特性**
#### 1. 序列化配置（解决Java对象存储）
```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        // 使用JSON序列化
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        template.setKeySerializer(RedisSerializer.string());
        template.setHashKeySerializer(RedisSerializer.string());
        return template;
    }
}
```

#### 2. 发布/订阅
```java
// 发布消息
stringRedisTemplate.convertAndSend("channel", "Hello Redis!");

// 订阅消息（需配置监听器）
@Component
public class RedisMessageListener implements MessageListener {
    @Override
    public void onMessage(Message message, byte[] pattern) {
        System.out.println("收到消息: " + new String(message.getBody()));
    }
}

// 配置订阅
@Bean
public RedisMessageListenerContainer container(RedisConnectionFactory factory, 
                                            RedisMessageListener listener) {
    RedisMessageListenerContainer container = new RedisMessageListenerContainer();
    container.setConnectionFactory(factory);
    container.addMessageListener(listener, new ChannelTopic("channel"));
    return container;
}
```

---

### **四、事务与管道**
#### 1. 事务操作
```java
// 启用事务支持
redisTemplate.setEnableTransactionSupport(true);

// 执行事务
List<Object> results = redisTemplate.execute(new SessionCallback<>() {
    @Override
    public List<Object> execute(RedisOperations operations) {
        operations.multi();
        operations.opsForValue().set("k1", "v1");
        operations.opsForValue().set("k2", "v2");
        return operations.exec(); // 返回执行结果列表
    }
});
```

#### 2. 管道批处理
```java
List<Object> results = redisTemplate.executePipelined(new SessionCallback<>() {
    @Override
    public Object execute(RedisOperations operations) {
        for (int i = 0; i < 1000; i++) {
            operations.opsForValue().set("pipe_" + i, "value_" + i);
        }
        return null; // 返回值会被忽略
    }
});
```

---

### **五、分布式锁**
#### 1. 基于 `SETNX` 的实现
```java
public boolean tryLock(String key, String value, long expireTime) {
    Boolean result = stringRedisTemplate.opsForValue()
        .setIfAbsent(key, value, expireTime, TimeUnit.SECONDS);
    return Boolean.TRUE.equals(result);
}

public void unlock(String key, String value) {
    // 确保锁是自己的才释放（防误删）
    if (value.equals(stringRedisTemplate.opsForValue().get(key))) {
        stringRedisTemplate.delete(key);
    }
}
```

#### 2. 使用 Redisson（推荐）
```java
// 添加依赖
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.17.0</version>
</dependency>

// 使用示例
@Autowired
private RedissonClient redisson;

public void doWithLock() {
    RLock lock = redisson.getLock("myLock");
    try {
        lock.lock(10, TimeUnit.SECONDS); // 获取锁，10秒后自动释放
        // 业务代码...
    } finally {
        lock.unlock();
    }
}
```

---

### **六、缓存注解（Spring Cache）**
#### 1. 启用缓存
```java
@SpringBootApplication
@EnableCaching
public class Application { ... }
```

#### 2. 常用注解
| 注解          | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| `@Cacheable`  | 方法结果缓存（如`@Cacheable(value="users", key="#userId")`） |
| `@CachePut`   | 更新缓存（如`@CachePut(value="users", key="#user.id")`）     |
| `@CacheEvict` | 删除缓存（如`@CacheEvict(value="users", key="#userId")`）    |
| `@Caching`    | 组合多个缓存操作                                             |

#### 3. 自定义Redis缓存配置
```java
@Bean
public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
    RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
        .serializeValuesWith(RedisSerializationContext.SerializationPair
            .fromSerializer(new GenericJackson2JsonRedisSerializer()))
        .entryTtl(Duration.ofMinutes(30)); // 默认过期时间
    return RedisCacheManager.builder(factory)
        .cacheDefaults(config)
        .build();
}
```

---

### **七、性能优化与陷阱**
1. **连接池配置**：根据QPS调整`max-active`（建议≥50并发）
2. **序列化选择**：
   - 字符串操作：`StringRedisSerializer`
   - 对象存储：`GenericJackson2JsonRedisSerializer`
3. **避免大Key**：单个Value不超过1MB（推荐≤10KB）
4. **管道 vs 事务**：
   - 管道：批量操作无原子性要求
   - 事务：需要原子性保证

---

### **八、完整工具类示例**
```java
@Component
public class RedisUtils {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 设置缓存（带过期时间）
    public void set(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    // 获取缓存（自动反序列化）
    public <T> T get(String key, Class<T> clazz) {
        Object value = redisTemplate.opsForValue().get(key);
        return clazz.cast(value);
    }

    // 删除Key
    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    // 批量删除（通配符）
    public Long deleteByPattern(String pattern) {
        Set<String> keys = redisTemplate.keys(pattern + "*");
        return keys != null ? redisTemplate.delete(keys) : 0L;
    }
}
```

---

通过以上方法，你可以覆盖Spring Boot操作Redis的绝大多数场景。根据业务需求选择合适的操作方式，并注意性能与安全性的平衡。
