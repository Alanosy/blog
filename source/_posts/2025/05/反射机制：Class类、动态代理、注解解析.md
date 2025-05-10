---
title: 反射机制：Class类、动态代理、注解解析
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 01:16:05
updated: 2025-05-11 01:16:05
topic:
banner:
references:
---

# Java 反射机制深度笔记

## 一、反射基础：Class 类

### 1. Class 对象的获取方式

| 获取方式        | 代码示例                                     | 适用场景       |
| --------------- | -------------------------------------------- | -------------- |
| 类名.class      | `Class<User> clazz = User.class;`            | 编译时已知类名 |
| 对象.getClass() | `user.getClass();`                           | 已有对象实例   |
| Class.forName() | `Class.forName("com.example.User");`         | 动态加载类     |
| 类加载器        | `ClassLoader.loadClass("com.example.User");` | 自定义类加载   |

### 2. Class 类核心方法

```java
// 获取构造方法
Constructor<?>[] getConstructors();  // 公共构造
Constructor<T> getConstructor(Class<?>... parameterTypes);

// 获取字段
Field getField(String name);         // 公共字段（包括继承）
Field getDeclaredField(String name); // 本类所有字段

// 获取方法
Method getMethod(String name, Class<?>... parameterTypes);
Method getDeclaredMethod(String name, Class<?>... parameterTypes);

// 创建实例
T newInstance();                     // 过时方法（Java 9+）
Constructor.newInstance(Object... initargs); // 推荐方式
```

### 3. 类型检查方法

```java
isInterface()      // 是否接口
isArray()          // 是否数组
isEnum()           // 是否枚举
isPrimitive()      // 是否基本类型
isAnnotationPresent(Class<? extends Annotation> annotationClass) // 是否有注解
```

## 二、反射操作实践

### 1. 字段操作示例

```java
public class ReflectFieldDemo {
    public static void main(String[] args) throws Exception {
        User user = new User("张三", 25);
        Class<?> clazz = user.getClass();
        
        // 获取私有字段并修改值
        Field ageField = clazz.getDeclaredField("age");
        ageField.setAccessible(true); // 突破private限制
        ageField.setInt(user, 30);
        
        System.out.println(user); // 输出修改后的对象
    }
}
```

### 2. 方法调用示例

```java
public class ReflectMethodDemo {
    public static void main(String[] args) throws Exception {
        Class<User> clazz = User.class;
        User user = clazz.getConstructor(String.class, int.class)
                       .newInstance("李四", 28);
        
        // 调用私有方法
        Method method = clazz.getDeclaredMethod("privateMethod", String.class);
        method.setAccessible(true);
        Object result = method.invoke(user, "参数");
        
        System.out.println("方法返回值: " + result);
    }
}
```

### 3. 构造方法实例化对比

| 方式          | 代码示例                                                     | 特点                     |
| ------------- | ------------------------------------------------------------ | ------------------------ |
| newInstance() | `User user = User.class.newInstance();`                      | 只能调用无参构造，已废弃 |
| Constructor   | `Constructor<User> c = User.class.getConstructor(String.class, int.class);<br>User user = c.newInstance("王五", 30);` | 推荐方式，支持有参构造   |

## 三、动态代理机制

### 1. JDK 动态代理

**特点**：
- 基于接口实现
- `java.lang.reflect.Proxy` 生成代理类
- 需要实现 `InvocationHandler`

```java
public class JdkProxyDemo {
    public static void main(String[] args) {
        UserService realService = new UserServiceImpl();
        
        // 生成代理对象
        UserService proxy = (UserService) Proxy.newProxyInstance(
            realService.getClass().getClassLoader(),
            realService.getClass().getInterfaces(),
            (proxy1, method, args1) -> {
                System.out.println("前置处理");
                Object result = method.invoke(realService, args1);
                System.out.println("后置处理");
                return result;
            });
        
        proxy.addUser("test"); // 调用代理方法
    }
}
```

### 2. CGLIB 动态代理

**特点**：
- 基于类继承
- 不需要接口
- Spring AOP 默认使用

```java
public class CglibProxyDemo {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(UserServiceImpl.class);
        enhancer.setCallback((MethodInterceptor) (obj, method, args1, proxy) -> {
            System.out.println("CGLIB前置处理");
            Object result = proxy.invokeSuper(obj, args1);
            System.out.println("CGLIB后置处理");
            return result;
        });
        
        UserService proxy = (UserService) enhancer.create();
        proxy.addUser("test");
    }
}
```

### 3. 两种代理对比

| 特性     | JDK 动态代理   | CGLIB 代理           |
| -------- | -------------- | -------------------- |
| 代理方式 | 接口实现       | 类继承               |
| 依赖     | 无需额外库     | 需要cglib库          |
| 性能     | 调用快，创建慢 | 创建快，调用稍慢     |
| 限制     | 必须实现接口   | 不能代理final类/方法 |
| 适用场景 | 接口明确的场景 | 无接口或需要高性能   |

## 四、注解解析技术

### 1. 运行时注解处理

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyAnnotation {
    String value() default "";
    int priority() default 0;
}

// 注解处理器
public class AnnotationProcessor {
    public static void processAnnotations(Object obj) {
        Class<?> clazz = obj.getClass();
        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(MyAnnotation.class)) {
                MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
                System.out.println("发现注解方法: " + method.getName());
                System.out.println("注解值: " + annotation.value());
                System.out.println("优先级: " + annotation.priority());
            }
        }
    }
}
```

### 2. Spring 风格注解解析

```java
// 自定义注解
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Autowired {
}

// 简易DI容器
public class DIContainer {
    public static <T> T getInstance(Class<T> clazz) throws Exception {
        T instance = clazz.getDeclaredConstructor().newInstance();
        
        // 处理字段注入
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Autowired.class)) {
                Object fieldInstance = getInstance(field.getType());
                field.setAccessible(true);
                field.set(instance, fieldInstance);
            }
        }
        return instance;
    }
}
```

### 3. 编译时注解处理（APT）

1. 定义注解处理器：
```java
@SupportedAnnotationTypes("com.example.MyAnnotation")
@SupportedSourceVersion(SourceVersion.RELEASE_11)
public class MyAnnotationProcessor extends AbstractProcessor {
    
    @Override
    public boolean process(Set<? extends TypeElement> annotations, 
                         RoundEnvironment roundEnv) {
        for (Element element : roundEnv.getElementsWithAnnotation(MyAnnotation.class)) {
            // 处理被注解的元素
            if (element.getKind() == ElementKind.METHOD) {
                ExecutableElement method = (ExecutableElement) element;
                String methodName = method.getSimpleName().toString();
                processingEnv.getMessager().printMessage(
                    Diagnostic.Kind.NOTE, "发现注解方法: " + methodName);
            }
        }
        return true;
    }
}
```

2. 注册处理器（META-INF/services/javax.annotation.processing.Processor）

## 五、反射性能优化

### 1. 缓存反射对象

```java
public class ReflectionCache {
    private static final Map<Class<?>, Method> methodCache = new ConcurrentHashMap<>();
    
    public static Object invokeMethod(Object obj, String methodName, Object... args) 
            throws Exception {
        Class<?> clazz = obj.getClass();
        Method method = methodCache.computeIfAbsent(clazz, 
            c -> Arrays.stream(c.getDeclaredMethods())
                     .filter(m -> m.getName().equals(methodName))
                     .findFirst()
                     .orElseThrow());
        
        method.setAccessible(true);
        return method.invoke(obj, args);
    }
}
```

### 2. MethodHandle（Java 7+）

```java
public class MethodHandleDemo {
    public static void main(String[] args) throws Throwable {
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodType type = MethodType.methodType(void.class, String.class);
        MethodHandle handle = lookup.findVirtual(User.class, "setName", type);
        
        User user = new User();
        handle.invokeExact(user, "张三");
        System.out.println(user.getName());
    }
}
```

### 3. 性能对比（纳秒级操作）

| 操作方式 | 首次调用     | 缓存后调用  | MethodHandle |
| -------- | ------------ | ----------- | ------------ |
| 直接调用 | 2-5 ns       | -           | -            |
| 反射调用 | 1000-2000 ns | 500-1000 ns | 50-100 ns    |

## 六、安全注意事项

1. **权限控制**：
   ```java
   // 启用安全检查时（默认）
   SecurityManager sm = System.getSecurityManager();
   if (sm != null) {
       sm.checkPermission(new ReflectPermission("suppressAccessChecks"));
   }
   ```

2. **防御措施**：
   - 限制反射可访问的包路径
   - 对敏感方法添加额外权限检查
   - 使用`setAccessible()`后及时恢复原状态

3. **最佳实践**：
   ```java
   Field field = clazz.getDeclaredField("secret");
   boolean accessible = field.isAccessible();
   try {
       field.setAccessible(true);
       // 操作字段...
   } finally {
       field.setAccessible(accessible); // 恢复原状态
   }
   ```

## 七、典型应用场景

1. **框架开发**：
   - Spring IOC 容器
   - JPA/Hibernate ORM 映射
   - JUnit 测试框架

2. **动态功能**：
   - 插件系统
   - RPC 调用
   - 序列化/反序列化

3. **工具类**：
   - BeanUtils 属性拷贝
   - 通用DAO实现
   - 动态SQL生成

通过合理使用反射机制，可以实现高度灵活的系统架构，但需要注意性能开销和安全风险。
