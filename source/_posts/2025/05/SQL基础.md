---
title: SQL基础
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-11 01:10:15
updated: 2025-05-11 01:10:15
topic:
banner:
references:
---

# SQL 基础与进阶笔记

## 一、SQL 基础分类

### 1. DDL (数据定义语言)

#### 建表语句
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18),
    department_id INT,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    CONSTRAINT fk_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

#### 索引操作
```sql
-- 创建索引
CREATE INDEX idx_name ON employees(name);
CREATE UNIQUE INDEX idx_unique_email ON employees(email);

-- 删除索引
DROP INDEX idx_name ON employees;
```

#### 修改表结构
```sql
-- 添加列
ALTER TABLE employees ADD COLUMN email VARCHAR(255);

-- 修改列
ALTER TABLE employees MODIFY COLUMN name VARCHAR(150);

-- 删除列
ALTER TABLE employees DROP COLUMN age;
```

### 2. DML (数据操作语言)

#### 增删改查
```sql
-- 插入数据
INSERT INTO employees (name, department_id, salary) 
VALUES ('张三', 1, 8500.00);

-- 批量插入
INSERT INTO employees (name, department_id, salary) 
VALUES 
    ('李四', 2, 7500.00),
    ('王五', 1, 9200.00);

-- 更新数据
UPDATE employees SET salary = salary * 1.1 
WHERE department_id = 1;

-- 删除数据
DELETE FROM employees 
WHERE salary < 5000;

-- 查询数据
SELECT id, name, salary FROM employees 
WHERE department_id = 1 
ORDER BY salary DESC;
```

### 3. 事务控制

#### ACID 特性
- **原子性(Atomicity)**: 事务是不可分割的工作单位
- **一致性(Consistency)**: 事务执行前后数据库保持一致状态
- **隔离性(Isolation)**: 事务执行不受其他事务干扰
- **持久性(Durability)**: 事务提交后改变是永久的

#### 隔离级别
```sql
-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 事务示例
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- 如果出错: ROLLBACK;
```

## 二、复杂查询

### 1. 联表查询 (JOIN)

```sql
-- 内连接
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- 左外连接
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- 右外连接
SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;

-- 全外连接 (MySQL不支持，可用UNION实现)
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
UNION
SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id
WHERE e.id IS NULL;
```

### 2. 子查询

```sql
-- WHERE子句中的子查询
SELECT name, salary 
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- FROM子句中的子查询
SELECT dept.id, dept.name, emp_count.count
FROM departments dept
JOIN (
    SELECT department_id, COUNT(*) as count
    FROM employees
    GROUP BY department_id
) emp_count ON dept.id = emp_count.department_id;

-- EXISTS子查询
SELECT d.department_name
FROM departments d
WHERE EXISTS (
    SELECT 1 FROM employees e
    WHERE e.department_id = d.id AND e.salary > 10000
);
```

### 3. 聚合函数

```sql
-- 基本聚合
SELECT 
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary,
    MAX(salary) AS max_salary,
    MIN(salary) AS min_salary,
    SUM(salary) AS total_salary
FROM employees;

-- 分组聚合
SELECT 
    department_id,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 8000;

-- WITH ROLLUP (小计)
SELECT 
    department_id,
    COUNT(*) AS employee_count
FROM employees
GROUP BY department_id WITH ROLLUP;
```

## 三、性能优化

### 1. 执行计划分析

```sql
-- 查看执行计划
EXPLAIN SELECT * FROM employees WHERE name = '张三';

-- 执行计划解读要点
/*
1. type列: 从最好到最差依次为:
   system > const > eq_ref > ref > range > index > ALL
2. possible_keys: 可能使用的索引
3. key: 实际使用的索引
4. rows: 预估扫描行数
5. Extra: 额外信息(如Using index, Using temporary, Using filesort)
*/
```

### 2. 索引设计原则

1. **适合建索引的列**:
   - WHERE子句中的条件列
   - JOIN关联的列
   - ORDER BY排序的列
   - GROUP BY分组的列

2. **索引设计最佳实践**:
   ```sql
   -- 联合索引最左前缀原则
   CREATE INDEX idx_name_dept ON employees(name, department_id);
   -- 能命中索引的情况:
   SELECT * FROM employees WHERE name = '张三';
   SELECT * FROM employees WHERE name = '张三' AND department_id = 1;
   -- 不能命中索引的情况:
   SELECT * FROM employees WHERE department_id = 1;
   
   -- 避免索引失效的情况:
   -- 1. 使用函数或运算
   SELECT * FROM employees WHERE YEAR(hire_date) = 2023; -- 索引失效
   -- 2. 使用不等于(!=或<>)
   SELECT * FROM employees WHERE name != '张三'; -- 索引失效
   -- 3. 使用LIKE以通配符开头
   SELECT * FROM employees WHERE name LIKE '%张%'; -- 索引失效
   ```

### 3. 慢SQL分析与优化

1. **开启慢查询日志**:
   ```sql
   -- MySQL配置
   slow_query_log = 1
   slow_query_log_file = /var/log/mysql/mysql-slow.log
   long_query_time = 2  -- 超过2秒的查询
   log_queries_not_using_indexes = 1  -- 记录未使用索引的查询
   ```

2. **优化策略**:
   - 重写复杂查询，拆分为多个简单查询
   - 避免SELECT *，只查询需要的列
   - 使用LIMIT限制返回行数
   - 对大表分页查询优化:
     ```sql
     -- 低效写法
     SELECT * FROM large_table LIMIT 1000000, 10;
     
     -- 高效写法(使用索引覆盖)
     SELECT * FROM large_table 
     WHERE id > (SELECT id FROM large_table ORDER BY id LIMIT 1000000, 1)
     LIMIT 10;
     ```

3. **表结构优化**:
   - 适当拆分大表(垂直/水平拆分)
   - 选择合适的数据类型(如用INT代替VARCHAR存储ID)
   - 对TEXT/BLOB大字段单独存表

## 四、实用技巧

### 1. 窗口函数(MySQL 8.0+)
```sql
-- 排名
SELECT 
    name, 
    salary,
    RANK() OVER (ORDER BY salary DESC) AS salary_rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_dense_rank,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
FROM employees;

-- 分组排名
SELECT 
    department_id,
    name,
    salary,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank
FROM employees;
```

### 2. 公用表表达式(CTE)
```sql
WITH dept_stats AS (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT 
    e.name,
    e.salary,
    d.avg_salary,
    CASE WHEN e.salary > d.avg_salary THEN '高于平均' ELSE '低于平均' END AS salary_status
FROM employees e
JOIN dept_stats d ON e.department_id = d.department_id;
```

### 3. 临时表
```sql
-- 创建临时表
CREATE TEMPORARY TABLE temp_high_salary_emps AS
SELECT * FROM employees WHERE salary > 10000;

-- 使用临时表
SELECT * FROM temp_high_salary_emps;
```
