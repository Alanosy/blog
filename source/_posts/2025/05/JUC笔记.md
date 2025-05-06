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







FutureTask+线程池的缺点：

1. get()阻塞： 容易导致阻塞，一般建议放在程序后面，一旦调用必须获得结果才执行下一步	

   加入不想等待太长时间，希望过时不侯，自动离开，get可以加入超时时间，过时抛异常，，我们就可以捕获异常做相应的处理

2. isDone()轮训：轮训会损耗无谓的cpu资源

get容易导致阻塞，我们可以判断future的状态，什么时候完成了什么时候调用，就不会容易导致阻塞，实际工作不建议直接用get，非常容易阻塞

futureTask.isDone()判断任务是否完成



想完成一些复杂的任务

对于简单的业务场景使用Future完全OK

回调通知：主动通知

创建异步任务：Future+线程池配合

多个任务前后依赖可以组合处理：

​		后一个异步任务，依赖于前一个异步任务的值

​		两个或多个异步任务计算合并成一个异步计算

对计算速度选最快



阻塞的方式和异步编程的设计理念相违背，而轮训的方式会耗费无谓的CPU资源。因此

### CompletableFuture

引入了CompletableFuture

CompletableFuture提供了一种观察者模式类似的机制，可以让任务执行完成后通知监听的一方

CompletableFuture实现了Future和CompletionStage

CompletionStage 代表异步计算过程中的某一个阶段，一个阶段完成以后可能会触发另一个阶段

#### 核心的四个静态方法

* runAsync无 返回值
  * public static CompletableFuture<Void> runAsync(Runable runable)
  * public static CompletableFuture<Void> runAsync(Runable runable,Executor executor)
* supplyAsync 有 返回值
  * public static<U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
  * public static<U> CompletableFuture<U> supplyAsync(Supplier<U> supplier,Executor executor)

Executor executor说明：如果没有指定默认使用ForkJoinPool.commonPool()作为它的线程池

案例：

``` java
public class CompleableFutureBuildDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(3);
        // CompletableFuture<Void> voidCompletableFuture = CompletableFuture.runAsync(() -> {
        //     System.out.println(Thread.currentThread().getName());
        //     try {
        //         TimeUnit.SECONDS.sleep(1);
        //     } catch (InterruptedException e) {
        //         e.printStackTrace();
        //     }
        // },executorService);
        // System.out.println(voidCompletableFuture.get());

        CompletableFuture<String> objectCompletableFuture = CompletableFuture.supplyAsync(()->{
                System.out.println(Thread.currentThread().getName());
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "hello";
        });
        System.out.println(objectCompletableFuture.get());
        executorService.shutdown();
    }
}

```

通用功能和平常注意事项

```
whenComplete((v,e)->{}) 处理上一个任务的返回值
exceptionally(e->{}) 处理上个任务的异常
```

主线程不要立即结束，否则compleableFuture默认使用的线程池会立即关闭，通常使用自定义线程池避免这个问题

CompleableFuture的优点：

1. 异步任务结束时，会自动回调某个对象的方法
2. 主线程设置好回调后，不再关心异步任务的执行，异步任务之间可以顺序执行
3. 异步任务出错时，会自动回调某个对象的方法



函数式接口：

* Runable   无参数，无返回值
* Function(功能型函数式接口)  有一个输入参数，有一个返回参数
* Consume(消费型函数式接口) 有一个输入参数，没有返回值
  * BiConsumer 有两个输入参数，没有返回值
* Supplier(供给型函数式接口)没有输入参数，有一个返回值

| 函数式接口名称 | 方法名称 | 参数 | 返回值 |
| -------------- | -------- | ---- | ------ |
| Runable        | run      | 0    | 0      |
| Function       | apply    | 1    | 1      |
| Consume        | accept   | 1    | 0      |
| BiConsumer     | accept   | 2    | 0      |
| supplier       | get      | 0    | 1      |

链式调用

``` java
@Accessors(chain=true) // 开启链式调用
```

join和get的区别就是抛不抛异常的问题

