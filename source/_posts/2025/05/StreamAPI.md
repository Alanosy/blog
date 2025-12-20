---
title: StreamAPI
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-05 12:09:29
updated: 2025-05-05 12:09:29
topic:
banner:
references:
---

# Java 8 Stream API

## 一、Stream 概述

Stream 是 Java 8 中处理集合的关键抽象概念，它可以对集合进行非常复杂的查找、过滤和映射数据等操作。Stream API 提供了一种高效且易于使用的处理数据的方式。

### Stream 的特点：
1. **不是数据结构**：不存储数据，只是从数据源（集合、数组等）获取数据
2. **不修改源数据**：对Stream的操作会产生新Stream，不会修改原始数据源
3. **惰性执行**：中间操作是惰性的，只有终端操作才会触发实际计算
4. **可消费性**：Stream只能被消费一次，终端操作后就不能再次使用

## 二、Stream 操作分类

Stream 操作分为两类：
1. **中间操作(Intermediate Operations)**：返回一个新的Stream，可以链式调用
2. **终端操作(Terminal Operations)**：返回具体结果或产生副作用，执行后Stream就不能再使用

## 三、创建 Stream

### 1. 从集合创建
```java
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream = list.stream();          // 创建顺序流
Stream<String> parallelStream = list.parallelStream(); // 创建并行流
```

### 2. 从数组创建
```java
String[] array = {"a", "b", "c"};
Stream<String> stream = Arrays.stream(array);
```

### 3. 使用Stream.of()静态方法
```java
Stream<String> stream = Stream.of("a", "b", "c");
```

### 4. 使用Stream.generate()创建无限流
```java
Stream<Double> randomStream = Stream.generate(Math::random).limit(5);
```

### 5. 使用Stream.iterate()创建无限流
```java
Stream<Integer> iterateStream = Stream.iterate(0, n -> n + 2).limit(5);
// 0, 2, 4, 6, 8
```

### 6. 其他创建方式
```java
// 从文件创建
Stream<String> lines = Files.lines(Paths.get("data.txt"));

// 从字符串创建
IntStream charsStream = "abcde".chars();
```

## 四、中间操作详解

中间操作会返回一个新的Stream，可以链式调用多个中间操作。

### 1. filter(Predicate<T>) - 过滤
```java
List<String> list = Arrays.asList("apple", "banana", "orange", "grape");
list.stream()
    .filter(s -> s.length() > 5)  // 过滤长度大于5的字符串
    .forEach(System.out::println); // banana, orange
```

### 2. map(Function<T,R>) - 映射
```java
List<String> list = Arrays.asList("a", "b", "c");
list.stream()
    .map(String::toUpperCase)  // 转换为大写
    .forEach(System.out::println); // A, B, C

// 提取对象属性
List<Person> persons = ...;
persons.stream()
       .map(Person::getName)  // 提取name属性
       .forEach(System.out::println);
```

### 3. flatMap(Function<T,Stream<R>>) - 扁平化映射
```java
List<List<String>> listOfLists = Arrays.asList(
    Arrays.asList("a", "b"),
    Arrays.asList("c", "d")
);

List<String> flatList = listOfLists.stream()
    .flatMap(List::stream)  // 将多个流合并为一个流
    .collect(Collectors.toList()); // [a, b, c, d]
```

### 4. distinct() - 去重
```java
List<Integer> numbers = Arrays.asList(1, 2, 1, 3, 3, 2, 4);
numbers.stream()
       .distinct()  // 去重
       .forEach(System.out::println); // 1, 2, 3, 4
```

### 5. sorted() / sorted(Comparator<T>) - 排序
```java
List<String> words = Arrays.asList("banana", "apple", "pear", "orange");

// 自然排序
words.stream()
     .sorted()
     .forEach(System.out::println); // apple, banana, orange, pear

// 自定义排序
words.stream()
     .sorted((s1, s2) -> s1.length() - s2.length())
     .forEach(System.out::println); // pear, apple, banana, orange
```

### 6. peek(Consumer<T>) - 查看元素
```java
Stream.of("one", "two", "three")
    .filter(e -> e.length() > 3)
    .peek(e -> System.out.println("Filtered value: " + e))
    .map(String::toUpperCase)
    .peek(e -> System.out.println("Mapped value: " + e))
    .collect(Collectors.toList());
```

### 7. limit(long) - 限制数量
```java
Stream.iterate(1, n -> n + 1)
      .limit(5)
      .forEach(System.out::println); // 1, 2, 3, 4, 5
```

### 8. skip(long) - 跳过元素
```java
Stream.of(1, 2, 3, 4, 5)
      .skip(2)
      .forEach(System.out::println); // 3, 4, 5
```

## 五、终端操作详解

终端操作会触发实际计算，执行后Stream就不能再使用。

### 1. forEach(Consumer<T>) - 遍历
```java
List<String> list = Arrays.asList("a", "b", "c");
list.stream().forEach(System.out::println); // a, b, c
```

### 2. toArray() - 转换为数组
```java
String[] array = Stream.of("a", "b", "c").toArray(String[]::new);
```

### 3. collect(Collector<T,A,R>) - 收集为集合
```java
// 收集为List
List<String> list = Stream.of("a", "b", "c").collect(Collectors.toList());

// 收集为Set
Set<String> set = Stream.of("a", "b", "a").collect(Collectors.toSet());

// 收集为Map
Map<String, Integer> map = Stream.of("apple", "banana", "orange")
    .collect(Collectors.toMap(Function.identity(), String::length));

// 连接字符串
String joined = Stream.of("a", "b", "c").collect(Collectors.joining(", "));
// "a, b, c"
```

### 4. reduce(BinaryOperator<T>) - 归约
```java
// 求和
Optional<Integer> sum = Stream.of(1, 2, 3, 4).reduce(Integer::sum);
System.out.println(sum.get()); // 10

// 求最大值
Optional<Integer> max = Stream.of(1, 2, 3, 4).reduce(Integer::max);
System.out.println(max.get()); // 4

// 带初始值的reduce
Integer total = Stream.of(1, 2, 3, 4).reduce(10, Integer::sum);
System.out.println(total); // 20 (10+1+2+3+4)
```

### 5. min()/max() - 最小/最大值
```java
Optional<String> min = Stream.of("a", "bb", "ccc").min(Comparator.comparing(String::length));
System.out.println(min.get()); // "a"

Optional<String> max = Stream.of("a", "bb", "ccc").max(Comparator.comparing(String::length));
System.out.println(max.get()); // "ccc"
```

### 6. count() - 计数
```java
long count = Stream.of("a", "b", "c").count();
System.out.println(count); // 3
```

### 7. anyMatch()/allMatch()/noneMatch() - 匹配
```java
boolean anyStartsWithA = Stream.of("apple", "banana", "orange")
    .anyMatch(s -> s.startsWith("a")); // true

boolean allLongerThan3 = Stream.of("apple", "banana", "orange")
    .allMatch(s -> s.length() > 3); // true

boolean noneStartsWithZ = Stream.of("apple", "banana", "orange")
    .noneMatch(s -> s.startsWith("z")); // true
```

### 8. findFirst()/findAny() - 查找元素
```java
Optional<String> first = Stream.of("a", "b", "c").findFirst();
System.out.println(first.get()); // "a"

Optional<String> any = Stream.of("a", "b", "c").findAny();
System.out.println(any.get()); // 可能是"a", "b"或"c"（并行流中不确定）
```

## 六、数值流

Stream API 提供了专门的数值流来处理原始类型，避免装箱拆箱开销。

### 1. IntStream
```java
IntStream.range(1, 5).forEach(System.out::println); // 1, 2, 3, 4
IntStream.rangeClosed(1, 5).forEach(System.out::println); // 1, 2, 3, 4, 5

// 统计信息
IntSummaryStatistics stats = IntStream.of(1, 2, 3).summaryStatistics();
System.out.println(stats.getMax());     // 3
System.out.println(stats.getMin());     // 1
System.out.println(stats.getAverage()); // 2.0
```

### 2. LongStream
```java
LongStream.range(1, 5).forEach(System.out::println);
```

### 3. DoubleStream
```java
DoubleStream.of(1.1, 2.2, 3.3).forEach(System.out::println);
```

### 4. 对象流与数值流转换
```java
// 对象流转数值流
List<Integer> numbers = Arrays.asList(1, 2, 3);
IntStream intStream = numbers.stream().mapToInt(Integer::intValue);

// 数值流转对象流
Stream<Integer> boxedStream = intStream.boxed();
```

## 七、并行流

Stream API 可以很容易地实现并行操作。

### 1. 创建并行流
```java
// 从集合创建并行流
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> parallelStream = list.parallelStream();

// 将顺序流转为并行流
Stream<String> parallelStream2 = Stream.of("a", "b", "c").parallel();
```

### 2. 并行流注意事项
- 确保操作是无状态的
- 确保操作不会对共享变量进行修改
- 确保操作是关联的（不影响结果顺序）
- 数据量较大时使用并行流才有优势
- 某些操作（如limit、findFirst）在并行流中性能可能更差

### 3. 示例
```java
long count = IntStream.range(1, 1_000_000)
                     .parallel()  // 转为并行流
                     .filter(n -> n % 2 == 0)
                     .count();
System.out.println(count);
```

## 八、收集器(Collectors)详解

Collectors 类提供了许多静态工厂方法，用于创建常见的收集器。

### 1. 转换为集合
```java
List<String> list = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());
```

### 2. 转换为特定集合
```java
Collection<String> treeSet = stream.collect(Collectors.toCollection(TreeSet::new));
```

### 3. 连接字符串
```java
String joined = stream.collect(Collectors.joining()); // 直接连接
String joinedWithDelimiter = stream.collect(Collectors.joining(", ")); // 带分隔符
String joinedWithPrefixSuffix = stream.collect(Collectors.joining(", ", "[", "]")); // 带前后缀
```

### 4. 分组
```java
// 简单分组
Map<Integer, List<String>> groupByLength = 
    Stream.of("a", "bb", "cc", "d")
          .collect(Collectors.groupingBy(String::length));
// {1=["a", "d"], 2=["bb", "cc"]}

// 多级分组
Map<Integer, Map<String, List<String>>> multiGroup = 
    Stream.of("a", "bb", "cc", "d")
          .collect(Collectors.groupingBy(String::length, 
                   Collectors.groupingBy(s -> s.startsWith("c") ? "starts with c" : "others")));
```

### 5. 分区
```java
Map<Boolean, List<String>> partition = 
    Stream.of("a", "bb", "cc", "d")
          .collect(Collectors.partitioningBy(s -> s.length() > 1));
// {false=["a", "d"], true=["bb", "cc"]}
```

### 6. 统计
```java
// 求和
int totalLength = Stream.of("a", "bb", "ccc")
    .collect(Collectors.summingInt(String::length)); // 6

// 平均值
Double averageLength = Stream.of("a", "bb", "ccc")
    .collect(Collectors.averagingInt(String::length)); // 2.0

// 统计汇总
IntSummaryStatistics stats = Stream.of("a", "bb", "ccc")
    .collect(Collectors.summarizingInt(String::length));
// IntSummaryStatistics{count=3, sum=6, min=1, average=2.000000, max=3}
```

### 7. 自定义收集器
```java
Collector<String, StringBuilder, String> customCollector = 
    Collector.of(
        StringBuilder::new,           // supplier
        StringBuilder::append,        // accumulator
        (sb1, sb2) -> sb1.append(sb2), // combiner
        StringBuilder::toString       // finisher
    );

String result = Stream.of("a", "b", "c").collect(customCollector);
System.out.println(result); // "abc"
```

## 九、实战示例

### 示例1：处理对象集合
```java
class Person {
    private String name;
    private int age;
    private String city;
    // 构造方法、getter/setter省略
}

List<Person> people = Arrays.asList(
    new Person("Alice", 25, "New York"),
    new Person("Bob", 30, "London"),
    new Person("Charlie", 20, "New York"),
    new Person("David", 35, "London")
);

// 1. 筛选年龄大于25的人
List<Person> olderThan25 = people.stream()
    .filter(p -> p.getAge() > 25)
    .collect(Collectors.toList());

// 2. 按城市分组
Map<String, List<Person>> peopleByCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));

// 3. 计算每个城市的平均年龄
Map<String, Double> avgAgeByCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity, 
             Collectors.averagingInt(Person::getAge)));

// 4. 获取所有城市的名称（去重）
Set<String> cities = people.stream()
    .map(Person::getCity)
    .collect(Collectors.toSet());

// 5. 获取年龄最大的人
Optional<Person> oldest = people.stream()
    .max(Comparator.comparingInt(Person::getAge));
```

### 示例2：文件处理
```java
// 读取文件并统计单词出现次数
try (Stream<String> lines = Files.lines(Paths.get("data.txt"))) {
    Map<String, Long> wordCount = lines
        .flatMap(line -> Arrays.stream(line.split("\\s+")))
        .collect(Collectors.groupingBy(String::toLowerCase, Collectors.counting()));
    
    wordCount.forEach((word, count) -> System.out.println(word + ": " + count));
} catch (IOException e) {
    e.printStackTrace();
}
```

## 十、性能考虑与最佳实践

1. **避免在流中修改外部状态**：保持操作无状态
2. **优先使用方法引用**：使代码更简洁
3. **避免嵌套流**：考虑使用flatMap替代
4. **注意自动装箱**：对原始类型使用专门的流(IntStream等)
5. **谨慎使用并行流**：
   - 数据量大时考虑使用
   - 确保操作可以并行化
   - 避免共享可变状态
6. **重用流**：流一旦被消费就不能再次使用
7. **考虑短路操作**：findFirst、limit等可以提前终止流处理

Stream API 提供了一种声明式处理数据的方式，使代码更简洁、更易读，同时能够充分利用多核处理器的优势。掌握Stream API可以显著提高Java编程效率和代码质量。
