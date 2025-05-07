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

# JUC并发编程

## 一把锁、2个并、3个程

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

## CompletableFuture的引出

#### Future为什么出现

Future(FutureTask实现类)接口定义了一步任务执行的一些方法，获取执行结果，取消任务，判断任务是否被取消，判断任务执行是否完毕

Future是java5提供的接口，提供了一步并行计算的功能

主线程执行一个很耗时的计算任务，我们就可以把这个任务放到一步线程中，主线程继续执行其他任务，在通过Future获取计算结果

Runnable接口没有返回值

Callable接口有返回值

Future接口和FutureTask实现类

需要实现：多线程/有返回/异步

FutureTask+线程池的缺点：

1. get()阻塞： 容易导致阻塞，一般建议放在程序后面，一旦调用必须获得结果才执行下一步	

   加入不想等待太长时间，希望过时不侯，自动离开，get可以加入超时时间，过时抛异常，，我们就可以捕获异常做相应的处理

2. isDone()轮训：轮训会损耗无谓的cpu资源

get容易导致阻塞，我们可以判断future的状态，什么时候完成了什么时候调用，就不会容易导致阻塞，实际工作不建议直接用get，非常容易阻塞

futureTask.isDone()判断任务是否完成

对于简单的业务场景使用Future完全OK

回调通知：主动通知

创建异步任务：Future+线程池配合

多个任务前后依赖可以组合处理：

​		后一个异步任务，依赖于前一个异步任务的值

​		两个或多个异步任务计算合并成一个异步计算

对计算速度选最快



阻塞的方式和异步编程的设计理念相违背，而轮训的方式会耗费无谓的CPU资源。因此

## CompletableFuture

引入了CompletableFuture

CompletableFuture提供了一种观察者模式类似的机制，可以让任务执行完成后通知监听的一方

CompletableFuture实现了Future和CompletionStage

CompletionStage 代表异步计算过程中的某一个阶段，一个阶段完成以后可能会触发另一个阶段

### 核心的四个静态方法

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



### CompleableFuture常用方法

1. 获得结果和触发计算

   1. 获得结果

      ``` java
      // 后去结果需要抛异常
      public T get()
      ```

      ``` java
      public T get(long timeout,TimeUnit unit)
      ```

      ``` java
      // 获取结果不用抛异常
      public T join()
      ```

      ``` java
      // 如果计算完则获得结果，否则返回valueIfAbsent
      public T getNow(T valueIfAbsent) 
      ```

   2. 主动触发计算

      ``` java
      // 是否打断并立即获得括号中的值
      // 计算完成时，返回false，后面用join获取值就是计算后的值
      // 计算未完成时，返回true，后面获取值时就是括号中设置的值
      public boolean complete(T value) 
      ```

2. 对计算结果

   1. thenApply
      1. 计算结果存在依赖关系，这两个线程串行化
      2. 由于存在依赖管理（当前步骤错，不走下一步），当前步骤有异常的话就叫停
   2. handle
      1. 计算结果存在依赖关系，这两个线程串行化
      2. 有异常也可以往下一步走，根据带的异常参数可以进行下一步的处理

3. 对计算结果进行消费

   1. thenAccept:接收任务的处理结果，并消费处理，**无返回结果** 

   2. 代码之前的顺序执行问题

      1. thenRun
         * thenRun(Runable runable) 任务A执行完执行B，并且B不需要A的结果
      2. thenAccept
         * thenAccept(Consumer action) 任务A执行完执行B，B需要A的结果，但是任务B**无返回值**
      3. thenApply
         * thenApply(Function fn) 任务A执行完执行B，B需要A的结果，同时任务B是**有返回值的**

   3. CompleableFuture和线程池说明

      * 没有传入自定义线程池，都用默认线程池ForkJoinPool
      * 传入了一个自定义线程池
        * 如果是thenRun 就使用前一个的线程池
        * 如果是thenRunAsync，就不会使用前一个的线程池，会使用默认的ForkJoinPool
      * 有可能处理太快，系统优化切换原则，直接使用main线程处理

   4. 对计算速度进行选用

      1. 谁快用谁

      2. applyToEither

         ``` java
         // 那个先计算出结果，就返回那个的compleableFuture对象
         cpC = cpA.applyToEither(cpB,f->{return f+ "is winer"})
         ```

   5. 对计算结果进行合并

      1. 连个CompletionStage任务都完成后，最终能把两个任务的结果一起交给thenCombine来处理

      2. 先完成的先等着，等待其他分支任务

      3. thenCombine

         ``` java
         cp<T> result = cpA.thenCombine(cpB,(x,y)->{return x+y});
         ```

         

## 多线程锁之线程锁知识概念

锁的类别：

1. 乐观锁和悲观锁
2. 公平锁和非公平锁
3. 可重入锁
4. 死锁及排查
5. 自旋锁
6. 轻量锁，偏向锁，邮戳锁

### 乐观锁和悲观锁

#### 悲观锁

认为自己在使用数据的时候一定有别的线程来修改数据，因此在获取数据的时候会先加锁，确保数据不会被别的线程修改

适合写操作多的场景，先加锁可以保证写操作时数据正确

显式的锁定之后再操作同步资源

synchronized关键字和Lock的实现类都是悲观锁

#### 乐观锁

认为自己在使用数据的时候不会有别的线程修改数据或资源，所以不会添加锁

在java中时通过使用无锁编程来实现的，知识在更新数据的时候去判断，之前有没有别的线程更新了这个数据

如果这个数据没有被更新，当前线程将自己修改的数据成功写入

如果这个数据已经被其他线程更新，则更具不同的实现方式执行不同的操作，比如放弃修改，重试抢锁等等。

判断规则：

1. 版本号机制Version
2. 最常采用的是CAS算法（Compare-and-swap,比较并替换），Java原子类中的递增操作就通过CAS自旋实现的

适合赌操作多的场景，不加锁的特点能够使其他读操作的性能大幅提升

乐观锁则直接去操作同步资源，是一种无锁算法，得之我幸不得我命，在努力就是

-------

### 8锁案例

1. 标准访问有ab两个线程，请问先打印邮件还是短信
2. sendEmail方法中加入暂停3秒，请问先打印邮件还是短信
3. 添加一个普通的hello方法，请问先打印邮件还是hello
4. 有两部手机，请问先打印邮件还是短信
5. 有两个静态同步方法，有1部手机，请问先打印邮件还是短信
6. 有两个静态同步方法，有2部手机，请问先打印邮件还是短信
7. 有一个静态同步方法，有一个普通同步方法，有1部手机，请问先打印邮件还是短信
8. 有一个静态同步方法，有一个普通同步方法，有2部手机，请问先打印邮件还是短信



详细说明：

* 第一种情况：

因为syncronized是悲观锁，所以同一时刻只能有一个线程可以进入该资源类，所有先打印邮件，再打印短信

一个资源类里面，假如有100个syncronized方法，只要其中一个被访问了，我锁的不是那一个方法，锁的是syncronized方法所在的整个资源类

* 第二种情况：

同第一种情况，先打印邮件，后打印短信

**总结第一和第二种情况：**

一个对象里面如果有多个syncronized方法，某一个时刻内，值要一个线程前调用其中的一个syncronized方法了

其他线程都只能等待，换句话说，某一个时刻内，只能有唯一的一个线程前访问这写syncronized方法

锁的是当前对象this，被锁后，其他的线程都不能进入到当前对象的其他syncronized方法

**总结第三种和第四种情况：**

加个普通方法后发现和同步锁无关

缓存两个对象后，不是同一把锁，情况立刻变化

**总结第五种和第六种情况：**

 三种synchronized锁的内容有一些差别：

对于普通同步方法，锁的是当前实例对象，通常指this，具体的异步手机，所有的普通同步方法用的都是同一把锁->实例对象本身，

对于静态同步方法，锁的是当前类的Class对象，如iphone.class唯一的一个模板

对于同步方法块，锁的是synchronized括号内的对象

**总结第七种和第八种情况：**

当一个线程试图访问同步代码时它首先必须得到锁，正常退出或抛出异常时必须释放锁

所有的普通同步方法用的都是同一把锁--实例对象本身，这就是new出来的具体实例对象本身，本类this

也就是说如果一个实例对象的普通同步方法获取锁后，该实例对象的其他普通同步方法必须等待获取锁的方法释放锁后才能获取锁

所有的静态同步方法用的也是同一把锁---类对象本身，就是我们说过的唯一模板Class

具体实例对象this和唯一模板Class这两把锁锁两个不同的对象，所以静态同步方法与普通同步方法之间时不会有竞态条件的，但是一旦一个静态同步方法获取锁后，其他的静态同步方法都必须等待该方法释放锁后才能获得锁

