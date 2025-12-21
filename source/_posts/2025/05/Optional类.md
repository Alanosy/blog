---
title: Optional类
tags: [JAVA]
categories: [JAVA]
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-05 09:47:53
updated: 2025-05-05 09:47:53
topic:
banner:
references:
---

# Java `Optional` 类详解与常用用法

`Optional` 是 Java 8 引入的一个容器类，用于更优雅地处理可能为 `null` 的值。它可以明确表示"值可能不存在"的情况，避免 `NullPointerException`。

## 1. 创建 Optional 对象

### 创建包含值的 Optional
```java
Optional<String> optional = Optional.of("value"); // 值不能为null，否则抛NullPointerException
```

### 创建可能为空的 Optional
```java
Optional<String> optional = Optional.ofNullable(getStringThatMightBeNull());
```

### 创建空 Optional
```java
Optional<String> emptyOptional = Optional.empty();
```

## 2. 检查值是否存在

### 检查是否有值
```java
if (optional.isPresent()) {
    // 值存在时的处理
}
```

### Java 11 简洁写法
```java
optional.ifPresent(value -> System.out.println("Found value: " + value));
```

## 3. 获取值

### 不安全获取（可能抛异常）
```java
String value = optional.get(); // 如果值为空会抛NoSuchElementException
```

### 安全获取 - 提供默认值
```java
String value = optional.orElse("default");
String value = optional.orElseGet(() -> getDefaultValue()); // 延迟计算默认值
```

### 安全获取 - 抛自定义异常
```java
String value = optional.orElseThrow(() -> new CustomException("Value not found"));
```

## 4. 链式操作

### 值转换 (map)
```java
Optional<String> upperCase = optional.map(String::toUpperCase);
```

### 扁平化转换 (flatMap)
```java
Optional<Double> result = optional.flatMap(this::parseToDouble);
```

### 过滤 (filter)
```java
Optional<String> filtered = optional.filter(s -> s.length() > 3);
```

## 5. 组合使用示例

```java
Optional.ofNullable(user)
    .map(User::getAddress)
    .map(Address::getStreet)
    .ifPresent(street -> System.out.println("Street: " + street));
```

## 6. 实际应用场景

### 替代 null 检查
```java
// 传统方式
if (user != null && user.getAddress() != null) {
    // 处理address
}

// Optional方式
Optional.ofNullable(user)
    .map(User::getAddress)
    .ifPresent(address -> { /* 处理address */ });
```

### 从集合中查找元素
```java
List<User> users = ...;
Optional<User> user = users.stream()
    .filter(u -> u.getId().equals(id))
    .findFirst();

user.ifPresentOrElse(
    u -> System.out.println("Found: " + u),
    () -> System.out.println("User not found")
);
```

## 7. 注意事项

1. **不要滥用 Optional**：
   - 不要作为方法参数（会使API复杂化）
   - 不要用于类字段（设计问题）
   - 集合应返回空集合而非 `Optional<List>`

2. **性能考虑**：
   - 创建 Optional 对象有轻微开销
   - 在性能关键代码中谨慎使用

3. **不要这样用**：
   ```java
   if (optional.isPresent()) {
       return optional.get();
   } else {
       return null;
   }
   ```
   应该用 `optional.orElse(null)`

`Optional` 的正确使用可以使代码更清晰、更安全，减少 `NullPointerException` 的风险。
