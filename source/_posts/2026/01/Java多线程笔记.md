---
title: Java多线程笔记
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2026-01-18 17:40:32
updated: 2026-01-18 17:40:32
topic:
banner:
references:
---

## 线程池

核心原理：提交任务时，池子会创建心的线程对象，任务执行完毕，线程归还给池子，下回提交任务，不需要创建线程，直接复用

代码实现步骤：

1. 创建线程池
2. 提交任务
3. 所有任务执行完毕关闭线程池 （一般不会关闭）

Executors：线程池的工具类通过调用方法返回不同类型的线程池对象

| 方法名                                                       | 说明                     |
| ------------------------------------------------------------ | ------------------------ |
| public static ExecutorService newCachedThreadPool()          | 创建一个没有上线的线程池 |
| public static ExecutorService newFixedThreadPool(int nThreads) | 创建一有上线的线程池     |

``` java
public class ExecutorDemo {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService pool = Executors.newCachedThreadPool();
        pool.submit(new Runnable() {
            @Override
            public void run() {
                System.out.println("aaa");
            }
        });
        Thread.sleep(1000);
        pool.submit(new Runnable() {
            @Override
            public void run() {
                System.out.println("aaa");
            }
        });
        pool.shutdown();
    }
}
```

