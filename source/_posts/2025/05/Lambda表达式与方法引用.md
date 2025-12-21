---
title: Lambda表达式与方法引用
tags: [JAVA]
categories: [JAVA]
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 01:06:44
updated: 2025-05-11 01:06:44
topic:
banner:
references:
---

# Lambda表达式与方法引用 - Java 8+ 核心特性笔记

## 一、Lambda表达式

### 1. 基本概念
- **本质**：匿名函数，简化匿名内部类的语法
- **特点**：
  - 属于函数式接口（只有一个抽象方法的接口）
  - 类型自动推断
  - 可捕获外部变量（必须是final或等效final）

### 2. 语法结构
```java
(parameters) -> expression
或
(parameters) -> { statements; }
```

### 3. 使用场景

#### 示例1：替代匿名内部类
```java
// 旧写法
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
}).start();

// Lambda写法
new Thread(() -> System.out.println("Hello")).start();
```

#### 示例2：集合操作
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 遍历
names.forEach(name -> System.out.println(name));

// 过滤
List<String> result = names.stream()
                          .filter(name -> name.startsWith("A"))
                          .collect(Collectors.toList());
```

### 4. 变量捕获规则
- 可捕获外部final或等效final的局部变量
- 不能修改捕获的变量
- 可以修改对象内部的属性（如集合内容）

```java
int limit = 3; // 等效final
List<String> filtered = names.stream()
                           .filter(name -> name.length() > limit) // 捕获外部变量
                           .collect(Collectors.toList());
```

## 二、方法引用

### 1. 基本概念
- **本质**：Lambda表达式的语法糖
- **特点**：
  - 更简洁
  - 可读性更强
  - 需要方法签名匹配函数式接口

### 2. 四种引用类型

#### (1) 静态方法引用
```java
// 类名::静态方法
Function<String, Integer> parser = Integer::parseInt;
Integer num = parser.apply("123");
```

#### (2) 实例方法引用（特定对象）
```java
// 对象::实例方法
String prefix = "Mr. ";
Function<String, String> addPrefix = prefix::concat;
String result = addPrefix.apply("Smith"); // "Mr. Smith"
```

#### (3) 实例方法引用（任意对象）
```java
// 类名::实例方法
Function<String, String> upper = String::toUpperCase;
String result = upper.apply("hello"); // "HELLO"
```

#### (4) 构造方法引用
```java
// 类名::new
Supplier<List<String>> listSupplier = ArrayList::new;
List<String> newList = listSupplier.get();
```

### 3. 使用场景对比

| 场景         | Lambda表达式               | 方法引用              |
| ------------ | -------------------------- | --------------------- |
| 简单操作     | `x -> x.toUpperCase()`     | `String::toUpperCase` |
| 静态方法调用 | `s -> Integer.parseInt(s)` | `Integer::parseInt`   |
| 对象创建     | `() -> new ArrayList<>()`  | `ArrayList::new`      |
| 多参数操作   | `(a, b) -> a.compareTo(b)` | `String::compareTo`   |

## 三、函数式接口

### 1. 常用内置接口

| 接口                | 方法                | 示例                                              |
| ------------------- | ------------------- | ------------------------------------------------- |
| `Function<T,R>`     | `R apply(T t)`      | 字符串转整数：`Function<String, Integer>`         |
| `Predicate<T>`      | `boolean test(T t)` | 过滤条件：`Predicate<String>`                     |
| `Consumer<T>`       | `void accept(T t)`  | 打印输出：`Consumer<String>`                      |
| `Supplier<T>`       | `T get()`           | 对象工厂：`Supplier<LocalDate>`                   |
| `BiFunction<T,U,R>` | `R apply(T t, U u)` | 两数相加：`BiFunction<Integer, Integer, Integer>` |

### 2. 自定义函数式接口
```java
@FunctionalInterface
interface StringProcessor {
    String process(String input);
    
    // 可以有默认方法
    default StringProcessor andThen(StringProcessor after) {
        return input -> after.process(this.process(input));
    }
}

// 使用
StringProcessor upper = String::toUpperCase;
StringProcessor addStars = s -> "***" + s + "***";
String result = upper.andThen(addStars).process("hello"); // "***HELLO***"
```

## 四、Stream API结合使用

### 1. Lambda在Stream中的应用
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// 过滤+转换+收集
List<String> result = names.stream()
                        .filter(name -> name.length() > 4) // Predicate
                        .map(String::toUpperCase)          // Function
                        .collect(Collectors.toList());     // Collector
```

### 2. 方法引用优化
```java
// 原始Lambda
names.forEach(name -> System.out.println(name));

// 方法引用优化
names.forEach(System.out::println);
```

## 五、注意事项

1. **变量捕获**：
   - Lambda只能捕获final或等效final的局部变量
   - 可以修改实例变量和静态变量

2. **this关键字**：
   - Lambda中的this指向外部类，匿名内部类中的this指向自身

3. **性能考虑**：
   - Lambda不会带来额外性能开销（JVM会优化）
   - 简单操作用方法引用更高效

4. **调试困难**：
   - Lambda堆栈跟踪可能较难阅读
   - 复杂逻辑建议提取为独立方法

## 六、代码对比示例

### 传统写法 vs Lambda vs 方法引用

```java
// 1. 传统匿名类
Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareToIgnoreCase(b);
    }
});

// 2. Lambda表达式
Collections.sort(names, (a, b) -> a.compareToIgnoreCase(b));

// 3. 方法引用
Collections.sort(names, String::compareToIgnoreCase);
```

## 七、最佳实践

1. **简单操作**：优先使用方法引用
2. **复杂逻辑**：使用Lambda表达式
3. **可读性**：当Lambda超过3行，考虑提取为方法
4. **重用性**：常用Lambda可存储为静态final变量

```java
// 重用Lambda示例
public static final Predicate<String> NON_EMPTY = s -> s != null && !s.trim().isEmpty();

List<String> validNames = names.stream()
                            .filter(NON_EMPTY)
                            .collect(Collectors.toList());
```
