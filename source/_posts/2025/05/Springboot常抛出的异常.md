---
title: Springboot常抛出的异常
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 01:04:43
updated: 2025-05-11 01:04:43
topic:
banner:
references:
---

在 Spring Boot 开发中，程序员常需要**手动抛出（throw）**的异常主要分为 **业务异常** 和 **参数校验异常** 两大类。以下是详细的分类整理和代码示例：

---

### **一、参数校验异常**
#### 1. **`IllegalArgumentException`**
- **场景**：方法参数不符合预期规则时抛出  
- **示例**：
  ```java
  public void updateUser(User user) {
      if (user == null || user.getId() == null) {
          throw new IllegalArgumentException("用户ID不能为空");
      }
      // ...业务逻辑
  }
  ```

#### 2. **`IllegalStateException`**  
- **场景**：对象状态不符合业务规则时抛出  
- **示例**：
  ```java
  public void submitOrder(Order order) {
      if (!order.getStatus().equals(OrderStatus.DRAFT)) {
          throw new IllegalStateException("只有草稿状态的订单可提交");
      }
      // ...提交逻辑
  }
  ```

#### 3. **结合 `@Validated` 手动校验**  
- **场景**：复杂校验逻辑无法通过注解实现时  
- **示例**：
  ```java
  @Service
  @Validated
  public class UserService {
      public void createUser(@NotBlank String username, @Min(18) Integer age) {
          if (username.contains("admin")) {
              throw new IllegalArgumentException("用户名不能包含敏感词");
          }
          // ...其他逻辑
      }
  }
  ```

---

### **二、业务异常**
#### 1. **自定义业务异常（推荐）**  
- **定义异常类**：
  ```java
  public class BusinessException extends RuntimeException {
      private final int code; // 自定义错误码
      public BusinessException(int code, String message) {
          super(message);
          this.code = code;
      }
      // getter...
  }
  ```
- **使用场景**：  
  - 用户权限不足  
  - 数据重复提交  
  - 业务规则限制  
- **示例**：
  ```java
  public void deleteProduct(Long productId) {
      Product product = productRepository.findById(productId)
          .orElseThrow(() -> new BusinessException(404, "商品不存在"));
      if (product.getStock() > 0) {
          throw new BusinessException(400, "有库存的商品不允许删除");
      }
      // ...删除逻辑
  }
  ```

#### 2. **数据操作异常**  
- **场景**：数据不存在或操作冲突时  
- **示例**：
  ```java
  public User getUserById(Long id) {
      return userRepository.findById(id)
          .orElseThrow(() -> new RuntimeException("用户不存在"));
  }
  ```

---

### **三、权限/安全异常**
#### 1. **`AccessDeniedException`**  
- **场景**：权限校验失败时抛出  
- **示例**：
  ```java
  public void accessAdminPanel(User user) {
      if (!user.getRoles().contains("ADMIN")) {
          throw new AccessDeniedException("无权访问管理员面板");
      }
      // ...授权逻辑
  }
  ```

#### 2. **认证异常**  
- **场景**：登录失败或 Token 无效  
- **示例**：
  ```java
  public String login(String username, String password) {
      User user = userService.findByUsername(username);
      if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
          throw new AuthenticationCredentialsNotFoundException("用户名或密码错误");
      }
      // ...生成Token
  }
  ```

---

### **四、第三方服务异常**
#### 1. **手动包装第三方异常**  
- **场景**：调用外部 API 或服务失败时  
- **示例**：
  ```java
  public String callExternalApi() {
      try {
          return restTemplate.getForObject("https://api.example.com", String.class);
      } catch (RestClientException e) {
          throw new RuntimeException("外部服务调用失败", e); // 保留原始异常链
      }
  }
  ```

#### 2. **自定义降级异常**  
- **场景**：熔断/降级时返回友好提示  
- **示例**：
  ```java
  @FeignClient(name = "payment-service", fallback = PaymentFallback.class)
  public interface PaymentClient {
      @PostMapping("/pay")
      String pay(@RequestBody PaymentRequest request);
  }
  
  @Component
  public class PaymentFallback implements PaymentClient {
      @Override
      public String pay(PaymentRequest request) {
          throw new BusinessException(503, "支付服务暂不可用，请稍后重试");
      }
  }
  ```

---

### **五、最佳实践**
1. **异常分类处理**：
   ```java
   @RestControllerAdvice
   public class GlobalExceptionHandler {
       // 处理业务异常
       @ExceptionHandler(BusinessException.class)
       public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
           return ResponseEntity.status(400).body(new ErrorResponse(e.getCode(), e.getMessage()));
       }
   
       // 处理参数校验异常
       @ExceptionHandler(IllegalArgumentException.class)
       public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
           return ResponseEntity.status(400).body(new ErrorResponse(400, e.getMessage()));
       }
   }
   ```

2. **异常信息设计**：
   - 包含**错误码**（如 `4001` 表示参数错误）  
   - 提供**用户友好提示**（如 "请输入有效的手机号"）  
   - 记录**调试信息**（如原始异常堆栈，仅开发环境返回）

3. **避免的陷阱**：
   - 不要滥用 `Exception`，应抛出具体异常类型  
   - 不要忽略异常（如空的 `catch` 块）  
   - 避免暴露敏感信息（如数据库错误详情）

---

### **六、完整异常分类表**
| 异常类型           | 典型场景             | 推荐异常类                          |
| ------------------ | -------------------- | ----------------------------------- |
| **参数校验异常**   | 参数为空/格式错误    | `IllegalArgumentException`          |
| **业务规则异常**   | 订单状态不允许操作   | 自定义 `BusinessException`          |
| **数据不存在异常** | 查询ID对应的数据为空 | `NoSuchElementException`            |
| **权限异常**       | 用户角色无权访问     | `AccessDeniedException`             |
| **第三方服务异常** | 支付接口调用失败     | 自定义 `ThirdPartyServiceException` |
| **并发冲突异常**   | 乐观锁更新失败       | `OptimisticLockingFailureException` |

通过合理设计异常体系，可以显著提升代码的可维护性和错误处理效率。
