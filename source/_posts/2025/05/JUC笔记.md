---
title: JUC笔记
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-05 16:57:58
updated: 2025-05-05 16:57:58
topic:
banner:
references:
---

### JUC并发编程



#### 一把锁、2个并、3个程

* 一把锁

  s

* 2个并

  * 并发：两个任务，统一处理器交替执行
  * 并行：两个任务同时处理

* 3个程

  * 进程：一个应用程序就是一个进程
  * 线程：一个进程下有多个线程
  * 管程：Monitor（监视器），也就是常说的锁，JVM中同步是基于进入和退出监视器对象来实现的，每个对象实例都会有一个Monitor对象



#### 用户现场与守护线程

一般情况下不做特别说明，默认都是用户线程



* 用户线程：是系统的工作线程，完成这个程序需要完成的业务操作
* 守护线程：特殊的线程，为其他线程服务的，默默的执行系统行的服务，服务线程，用户线程结束，虚拟机会自动退出守护线程

判断是用户线程还是守护线程

``` java
public final boolean isDaemon(){
  return daemon;
}
```

true：守护线程

false：用户线程

### CompletableFuture

#### Future为什么出现

Future(FutureTask实现类)接口定义了一步任务执行的一些方法，获取执行结果，取消任务，判断任务是否被取消，判断任务执行是否完毕

Future是java5提供的接口，提供了一步并行计算的功能

主线程执行一个很耗时的计算任务，我们就可以把这个任务放到一步线程中，主线程继续执行其他任务，在通过Future获取计算结果

Runnable接口没有返回值

Callable接口有返回值

Future接口和FutureTask实现类



多线程/有返回/一步

FutureTask(Callable<V> callable)

09看完

CompletableFuture之四大静态方法

