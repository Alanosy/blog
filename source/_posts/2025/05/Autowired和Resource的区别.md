---
title: Autowired和Resource的区别
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 00:59:53
updated: 2025-05-11 00:59:53
topic:
references:
---

# @Autowired与@Resource

`@Autowired` 和 `@Resource` 是 Java 中常用的两种依赖注入注解，但它们的来源、行为和使用场景有所不同。以下是它们的核心区别：

---

### **1. 来源不同**
- **`@Autowired`**  
  - 属于 Spring 框架（`org.springframework.beans.factory.annotation`）。  
  - 是 Spring 特有的注解，强耦合于 Spring 容器。

- **`@Resource`**  
  - 属于 Java 标准（`javax.annotation.Resource`），遵循 JSR-250 规范。  
  - 是 Java 的通用注解，不依赖 Spring，但 Spring 也支持它。

---

### **2. 默认注入方式**
- **`@Autowired`**  
  - **默认按类型（byType）注入**。  
  - 如果存在多个相同类型的 Bean，会报 `NoUniqueBeanDefinitionException`，此时需要通过以下方式解决：  
    - 结合 `@Qualifier("beanName")` 指定 Bean 名称。  
    - 使用 `@Primary` 标记优先注入的 Bean。

- **`@Resource`**  
  - **默认按名称（byName）注入**（如果没有显式指定名称，则使用字段名或方法名作为 Bean 名称）。  
  - 如果按名称找不到 Bean，**会回退到按类型（byType）注入**。  
  - 支持通过 `name` 属性直接指定 Bean 名称（如 `@Resource(name = "myBean")`），无需额外注解。

---

### **3. 适用范围**
- **`@Autowired`**  
  - 可以用在字段、构造方法、Setter 方法、普通方法上。  
  - 支持 Spring 的 `@Primary` 和 `@Qualifier` 细化注入。

- **`@Resource`**  
  - 只能用在字段、Setter 方法上（**不能用于构造方法**）。  
  - 无直接等效于 `@Primary` 的机制，依赖 `name` 属性明确指定 Bean。

---

### **4. 依赖是否必须**
- **`@Autowired`**  
  - 默认要求依赖必须存在（`required = true`），否则抛 `NoSuchBeanDefinitionException`。  
  - 可设置为 `@Autowired(required = false)`，允许注入失败（此时依赖为 `null`）。

- **`@Resource`**  
  - 默认行为类似 `required = true`，但无显式的 `required` 属性配置。

---

### **5. 使用场景建议**
- **优先用 `@Autowired`**：  
  - 项目完全基于 Spring，且需要更灵活的注入控制（如结合 `@Qualifier` 或 `@Primary`）。  
  - 需要在构造方法中注入依赖（`@Resource` 不支持）。

- **优先用 `@Resource`**：  
  - 需要代码脱离 Spring 耦合（如兼容其他 DI 容器）。  
  - 需要按名称注入且不希望引入额外注解（如 `@Qualifier`）。

---

### **代码示例对比**
```java
// 使用 @Autowired（按类型 + 可选 @Qualifier）
@Autowired
@Qualifier("userServiceA")
private UserService userService;

// 使用 @Resource（按名称，无需额外注解）
@Resource(name = "userServiceA")
private UserService userService;
```

---

### **总结对比表**
| 特性                 | `@Autowired` (Spring)     | `@Resource` (JSR-250)         |
| -------------------- | ------------------------- | ----------------------------- |
| **来源**             | Spring 特有               | Java 标准                     |
| **默认注入方式**     | 按类型（byType）          | 按名称（byName） → 回退按类型 |
| **支持构造方法注入** | 是                        | 否                            |
| **指定 Bean 名称**   | 需配合 `@Qualifier`       | 通过 `name` 属性              |
| **是否必须依赖**     | 可配置 `required = false` | 默认必须                      |
| **与 Spring 解耦**   | 否                        | 是                            |

根据项目需求和团队规范选择合适的注解。
