---
title: Netty笔记
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-12-23 23:09:59
updated: 2025-12-23 23:09:59
topic:
banner:
references:
---

# Netty笔记

## Netty是什么

netty是一个异步的、基于事件驱动的网络应用框架，用以快速开发高性能、高可靠性的网络IO程序

主要针对在TCP协议下，面向Clients端端高并发应用，或者Peer to Peer场景下的大量数据持续传输的应用。

本质是一个NIO框架，适用于服务器通讯相关的多种应用场景

TCP/IP<-JDK原生<-NIO<-Netty

## Netty应用场景

* RPC框架
* 游戏行业
* 大数据领域

## IO模型

IO模型就是用什么样的通道进行数据的发送和接收，很大程度上决定了程序通信性能

Java支持3种网络编程模型 /IO模型:BIO、NIO、AIO

* BIO 同步并阻塞（传统阻塞型）

  一个连接一个线程，容易造成不必要的线程开销

  ![截屏2025-12-24 下午9.53.50](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-7a75fe8167007b15fbd6300d7ec68000-6086a1.png)

* NIO 同步非阻塞

  一个线程处理多个请求（连接），客户端发送的请求都会注册到多路复用器上，多路复用器轮询到连接有I/O的请求就进行处理

![截屏2025-12-24 下午9.54.07](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-3e05326e77fda6f1bd764b20bf237ed1-f68911.png)

* AIO 异步非阻塞，AIO引入了异步通道的概念，采用了Proactor模型，简化了程序编写，有效的请求才启动线程，它的特点是先由操作系统完成后才通知服务端程序启动线程去处理，一般适用于连接数较多且连接时间较长的应用。

#### BIO、NIO、AIO适用场景

* BIO 方式适用于**连接数目比较小且固定**的架构，这种方式对服务器资源要求比较高,并发局限于应用中，JDK1.4以前的唯一选择，但程序简单易理解。
* NIO 方式适用于**连接数目多且连接比较短**(轻操作)的架构，比如聊天服务器，弹幕系统，服务器间通讯等。编程比较复杂，JDK1.4开始支持:
* AIO 方式使用于**连接数目多且连接比较长**(重操作)的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。

## BIO介绍

* Java BIO 就是传统的javaIO 编程，其相关的类和接口在 java.io
* BI0(blocking I/O): **同步阻塞**，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销，可以通过**线程池机制改善**。
* BIO方式适用于连接数目比较小且固定的架构，这种方式对服务器资源要求比较高3)并发局限于应用中，JDK1.4以前的唯一选择，程序简单易理解

## BIO实例及分析

Coming soon...

## BIO内容梳理小结

Coming soon...

## NIO介绍

* Java NIO 全称 java non-blocking lO，是指 JDK提供的新API。从 JDK1.4 开始，Java 提供了一系列改进的输入/输出的新特性，被统称为 NIO(即 New lO)，是**同步非阻塞**的
* NIO 相关类都被放在 java.nio 包及子包下，并且对原 java.io包中的很多类进行改写。
* NIO 有三大核心部分:**Channel(通道)，Buffer(缓冲区),Selector(选择器)**
* NIO是 面向**缓冲区，或者面向块**编程的。数据读取到一个它稍后处理的缓冲区，需要时可在缓冲区中前后移动，这就增加了处理过程中的灵活性，使用它可以提供非阻塞式的高伸缩性网络
* Java NIO的非阻塞模式，使一个线程从某通道发送请求或者读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取，而**不是保持线程阻塞**，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。非阻塞写也是如此，一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。
* 通俗理解:NIO是可以做到用一个线程来处理多个操作的。假设有10000个请求过来根据实际情况，可以分配50或者100个线程来处理。不像之前的阻塞10那样，非得分配10000个。
* HTTP2.0使用了多路复用的技术，做到同一个连接并发处理多个请求，而且并发请求的数量比HTTP1.1大了好几个数量级。

## NIO的Buffer基本使用

基本方法

* allocate() 设置大小，含义为可以方多少个
* capacity() 容量有多大
* **flip() 读写切换**
* hasRemaining()有过有剩余就返回true
* get() 没get一次索引就会往后移动一次

**NIO和BIO的比较**

* BIO以流的方式处理数据,而 NIO以块的方式处理数据,块 I/O的效率比流 I/O高很多
* BIO是阻塞的，NIO 则是非阻塞的
* BIO基于字节流和字符流进行操作，而 NIO基于 Channel(通道)和 Buffer(缓冲区)进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。Selector(选择器)用于监听多个通道的事件(比如:连接请求，数据到达等)，因此使用**单个线程就可以监听多个客户端通道**

## NIO三大核心组件的关系

关系说明

* 每个channel都会对应一个Bufer
* Selector对应一个线程，一个线程对应多个channel(连接)
* 程序切换到那个channel是由事件决定的，Event就是一个重要的概念
* Selector会根据不同的事件，在各个通道上切换
* Buffer就是一个内存块，底层是有一个数组
* 数据的读取写入是通过Buffer，BIO中要么是输入流，要么是输出流，不能是双向的，但是NIO的Buffer是可以读也可以写，需要flip方法读写切换
* channel是双向的，可以返回底层操作系统的情况

## Buffer的机制及子类

缓冲区(Buffer):缓冲区本质上是一个可以读写数据的内存块，可以理解成是一个**容器对象(含数组)**，该对象提供了**一组方法**，可以更轻松地使用内存块，，缓冲区对象内置了一些机制，能够跟踪和记录缓冲区的状态变化情况。Channel 提供从文件、网络读取数据的渠道，但是读取或写入的数据都必须经由Buffer

### **NIO中Buffer下面的子类**

* ByteBuffer，存储字节数据到缓冲区
* ShortBuffer，存储字符串数据到缓冲区
* CharBuffer，存储字符数据到缓冲区
* IntBuffer，存储整数数据到缓冲区
* LongBuffer，存储长整型数据到缓冲区
* DoubleBuffer，存储小数到缓冲区
* FloatBuffer，存储小数到缓冲区

### Buffer类型定义了缓冲区都具有的四个属性

| 属性     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| Capacity | 容量，即可以容纳的最大数据量;在缓冲区创建时被设定并且不能改变 |
| Limit    | 表示缓冲区的当前终点，不能对缓冲区超过极限的位置进行读写操作。且极限是可以修改的 |
| Position | 位置，下一个要被读或写的元素的索引，每次读写缓冲区数据时都会改变改值，为下次读写作准备 |
| Mark     | 标记                                                         |



``` java
public final Buffer flip(){
  limit = position;
  position = 0;
  mark = -1;
  return this;
}
```

### Buffer的相关方法
//JDK1.4时引入的api

**public final int capacity()//返回此缓冲区的容量**

**public finalint position()//返回此缓冲区的位置**

**public final Buffer position (int newPositio)//设置此缓冲区的位置**

**public final int limit()//返回此缓冲区的限制**

**public final Buffer limit (int newLimit)//设置此缓冲区的限制**

public final Buffer mark()//在此缓冲区的位置设置标记,

public final Buffer reset()//将此缓冲区的位置重置为以前标记的位置

**public final Buffer clear()//清除此缓冲区,即将各个标记恢复到初始状态，但是数据并没有真正擦除**

**public final Buffer flip()//反转此缓冲区**
public final Bufferrewind()//重绕此缓冲X
public finalint remaining()//返回当前位置与限制之间的元素数

**public final boolean hasRemaining()//告知在当前位置和限制之间是否有元素**

**public abstract boolean isReadOnly();//告知此缓冲区是否为只读缓冲区**
//JDK1.6时引入的api
**public abstract boolean hasArray();//告知此缓冲区是否具有可访问的底层实现数组**

**public abstract Object array();//返回此缓冲区的底层实现数组**

public abstractint arrayOffset0);//返回此缓冲区的底层实现数组中第一个缓冲区元素的偏移量public abstract boolean isDirect();//告知此缓冲区是否为直接缓冲区

### ByteBuffer

//缓冲区创建相关api

**public static ByteBuffer allocateDirect(int capacity)//创建直接缓神X**

**public static ByteBuffer allocate(int capacity)//设置缓冲区的初始容量**

public static ByteBuffer wrap(bytell array)//把一个数组放到缓冲区中使用//构造初始化位置offset和上界length的缓冲区

public static ByteBuffer wrap(bytel] array,int offset, int length)//缓存区存取相关API
**public abstract byte get();//从当前位置position上get，get之后，position会自动+1**

**public abstract byte get (int index);//从绝对位置get**

**public abstract ByteBuffer put (byte b);//从当前位置上添加，put之后，position会自动+1**

**public abstract ByteBuffer put (int index, byte b);//从绝对位置-put**

## Channel的基本介绍

### NIO的通道类似于流，但有些区别如下:

* 通道可以同时进行读写，而流只能读或者只能写

* 通道可以实现异步读写数据

* 通道可以从缓冲读数据，也可以写数据到缓冲:

### Channel的介绍

1. BIO中的 stream 是单向的，例如 FilelnputStream 对象只能进行读取数据的操作，而 NIO 中的通道(Channel)是双向的，可以读操作，也可以写操作。

2. Channel在NIO中是一个接口**public interface Channel extends Closeable{}**

3. 常用的 Channel 类有:**FileChannel、DatagramChannel、ServerSocketChannel 和SocketChannel.**

4. FileChannel 用于文件的数据读写,DatagramChannel 用于 UDP 的数据读写,ServerSocketChannel和SocketChannel用于TCP的数据读写。



### Filechannel类
FileChannel主要用来对本地文件进行I/O 操作，常见的方法有

* public int read(ByteBuffer dst)，从通道读取数据并放到缓冲区中
* public int write(ByteBuffer src)，把缓冲区的数据写到通道中
* public long transferFrom(ReadableByteChannel src,long position, long count)，从目标通道中复制数据到当前通道
* public long transferTo(long position, long count, WritableByteChannel target)，把数据从当前通道复制给目标通道

## Channel应用案例1

本地文件写

``` java
String str = "test";
FileOutputStream fis = new FileOutputStream("./test.txt");
FileChannel fc = fis.getChannel();
ByteBuffer buf = ByteBuffer.allocate(1024);
buf.put(str.getBytes());
buf.flip();
fc.write(buf);
fis.close;
```

## Channel应用案例2

本地文件读

``` java
File file = new File("./test.txt")
FileInputStream fis = new FileInputStream(file);
FileChannel fc = fis.getChannel();
ByteBuffer buf = ByteBuffer.allocate((int)file.lenght);
fc.read(buf);
System.out.println(new String(buf.array()))
fis.close;
```

## Channel应用案例3

``` java
FileInputStream fis1 = new FileInputStream("./test.txt");
FileChannel fc1 = fis1.getChannel();
FileOutputStream fis2 = new FileOutputStream("./test.txt");
FileChannel fc2 = fis2.getChannel();
ByteBuffer buf = ByteBuffer.allocate(512);
while(true){
  buf.clear(); // 复位很重要 会导致limt和position相同导致死循环
  int read = fc2.read(buf);
  if(read == -1){
    break;
  }
  buf.flip();
  fc2.write(buf);
}
fis1.close;
fis2.close;

```

## Channel拷贝文件

transferFrom

``` java
FileInputStream fis1 = new FileInputStream("./test.txt");
FileChannel fc1 = fis1.getChannel();
FileOutputStream fis2 = new FileOutputStream("./test.txt");
FileChannel fc2 = fis2.getChannel();
fc2.transferFrom(fc1,0,fc1.size());
fis1.close;
fis2.close;
```

## Buffer的注意细节

* ByteBuffer 支持类型化的put 和 get,put 放入的是什么数据类型，get就应该使用相应的数据类型来取出，否则可能有 BufferUnderflowException 异常。

* 可以将一个普通Buffer 转成只读Buffer;buffer.asReadOnlyBuffer(),如果继续写会抛出ReadOnlyBufferException

* NIO 还提供了 MappedByteBuffer，可以让文件直接在内存(**堆外的内存**)中进行修改，而如何同步到文件由NIO 来完成，操作系统不需要拷贝一次

  ``` java
  RandomAccessFile rfile = new RandomAccessFile("./test.txt",rw);
  FileChannel cl = rfile.getChannel();
  // 参数1: FileChannel.MapMode.READ_WRITE 使用读写模式
  // 参数2: 0是可以映射的起始位置
  // 参数3: 5是可以映射到内存的大小（*不是索引位置），即将test.txt的多少个字节映射到内存
  // 可以直接修改的范围为0-5不包含5,如果超过会抛出IndexOutOfBoundsException
  // 实际类型DirectByteBUffer
  MappedByteBuffer mapBuf = cl.map(FileChannel.MapMode.READ_WRITE,0,5);
  mapBuf.put(0,(byte)'H');
  mapBuf.put(3,(byte)'9');
  rfile.close();
  ```

  

* 前面我们讲的读写操作，都是通过一个Buffer 完成的，NIO 还支持 通过多个Buffer(即 Buffer 数组)完成读写操作，即 Scattering(分散) 和 Gatering（聚合）

  * Scattering : 将数据写入到buffer时，可以采用buffer数组，依次写入（分散）
  * Gatering:从buffer读取数据时，可以采用buffer数组依次读入

  ```  java
  // ServerSocketChannel和SocketChannel网络
  ServerSocketChannel ssc = ServerSocketChannel.open();
  InetSocketAddress address = new InetSocketAddress(7000);
  // 绑定端口到socket并启动
  ssc.socket().bind(address);
  // 创建buffer数组
  ByteBuffer[] byteBufs = new ByteBuffer[2];
  byteBufs[0] = ByteBuffer.allocate(5);
  byteBufs[1] = ByteBuffer.allocate(3);
  // 等待客户端连接(telnet)
  SocketChannel sc = ssc.accept();
  // 循环读取
  int messageLength = 8; // 假定从客户端接收8个字节
  while(true){
    int byteRead = 0;
    while(byteRead<messageLength){
      long l = sc.read(byteBufs);
      byteRead =+ l; // 累计读取到的字节数 ;
      // 使用流打印，可靠当前的这个buffer的position和limit
      Arrays.asList(byteBufs).stream().map(buf->"position="+buf.position()+",limit="+buf.limit()).forEach(System.out::println);
    }
    // 将所有的buffer进行flip
    Arrays.asList(byteBufs).forEach(buf->buf.flip());
    // 将数据读出显示到客户端
    long byteWrite = 0;
    while(byteWrite<messageLength){
      long l = sc.write(byteBufs);
      byteWrite+=l;
    }
    // 将所有的buffer进行clear
    Arrays.asList(byteBufs).forEach(buf->buf.clear());
    System.out.println("byteRead:="+byteRead+" byteWrite:="+byteWrite+",messageLength"+messageLength)
  }
  ```

## Selector选择器

### Selector基本介绍



* Java 的 NIO，用非阻塞的 IO方式。可以用一个线程，处理多个的客户端连接，就会使用到**Selector(选择器)**
* **Selector 能够检测多个注册的通道上是否有事件发生(注意:多个Channel以事件的方式可以注册到同一个Selector)**，如果有事件发生，便获取事件然后针对每个事件进行相应的处理。这样就可以只用一个单线程去管理多个通道，也就是管理多个连接和请求。
* 只有在连接真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都创建一个线程，不用去维护多个线程
* 避免了多线程之间的上下文切换导致的开销



**特别说明**

* Netty 的IO线程 NioEventLoop 聚合了 Selector(选择器,也叫多路复用器)，可以同时并发处理成百上千个客户端连接。
* 当线程从某客户端 Socket 通道进行读写数据时，若没有数据可用时，该线程可以进行其他任务。
* 线程通常将非阻塞IO的空闲时间用于在其他通道上执行IO操作，所以单独的线程可以管理多个输入和输出通道。
* 由于读写操作都是非阻塞的，这就可以充分提升IO线程的运行效率，避免由于频繁I/O阻塞导致的线程挂起。
* 一个I/O 线程可以并发处理 N个客户端连接和读写操作，这从根本上解决了传统同步阻塞 I/O一连接一线程模型，架构的性能、弹性伸缩能力和可靠性都得到了极大的提升。

### SelectorAPi介绍

Selector 类是一个抽象类,常用方法和说明如下:
public abstract class Selector implements Closeable 

* public static selector open(); // 得到一个选择器对象

* public int select(long timeout); // 监控所有注册的通道，当其中有10 操作可以进行时，将对应的 SelectionKey 加入到内部集合中并返回，参数用来设置超时时间

* public set<selectionKey> selectedKeys(); // 从内部集合中得到所有的 SelectionKey



**注意事项**

1. NIO中的ServerSocketChannel功能类似ServerSocket,SocketChannel功能类似的Socket
2. selector相关方法说明
   * selector:select() // 阻塞
   * selector:select(1000) // 阻塞1000毫秒，在1000毫秒后返回
   * selector:wakeup() // 阻塞 唤醒selector
   * selector:selectNow() // 不阻塞，立马返回

### SelectionKey在NIO体系

![截屏2025-12-26 下午8.55.14](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-1affbd251b6b92bbbc942ecddfcd791c-38970d.png)

1. 当客户端连接时，会通过ServerSocketChannel得到SocketChannel
2. 将socketChannel注册到Selector，register(Selector sel,int ops),一个Selector可以注解多个SocketChannel
3. 注册后返回一个SelectorKey,会和该Selector关联（集合）
4. Selector进行监听select方法，返回有事件发生的通道个数
5. 进一步的到各个的SelectorKey(有事件发生的)
6. 在通过SelectionKey反向获取SocketChannel，方法channel()
7. 可以通过得到的channel,完成业务处理



**事  件 **

* OP_READ：有读取事件发生
* OP_WRITE：有写事件发生
* OP_CONNECT：连接成立了
* OP_ACCEPT：有一个客户端来连接我们



## NIO快速入门1(服务端)

``` java
package com.lwl.NIO;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.util.Iterator;
import java.util.Set;

public class NIOServer {
    public static void main(String[] args) throws Exception{
        //创建一个服务端channel
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        //创建一个selector
        Selector selector = Selector.open();
        //绑定一个端口，在服务端监听
        serverSocketChannel.socket().bind(new InetSocketAddress(6666));
        //设置为非阻塞
        serverSocketChannel.configureBlocking(false);
        //serverSocketChannel注册到selector,并设置关心事件
        serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

//        System.out.println("注册SelectionKey的数量" + selector.keys().size());

        //循环等待客户链接
        while (true){//一次循环解决一个事件集合里的全部事件，下次循环会再继续监听
            if (selector.select(1000) == 0){//无事发生,继续循环等待
//                selector.selectedKeys().size() // 有事件发生的事件的数量
                System.out.println("服务器等待了一秒，无事发生，当前以注册的selectionKey数量为：" + selector.keys().size());
                continue;
            }
            //返回》0，有事发生,获取客户端发生关注事件的集合
            //通过selectionKeys可以反向获取Channel
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            //遍历selectionKeys，获取当前事件集
            Iterator<SelectionKey> Keyiterator = selectionKeys.iterator();
            while (Keyiterator.hasNext()){
                //获取当前事件
                SelectionKey selectionKey = Keyiterator.next();
                //查看key发生的事件并作相应的处理
                if(selectionKey.isAcceptable()) {//有新客户端链接
                    //为这个客户端生成一个channel
                    SocketChannel socketchannel = serverSocketChannel.accept();
                    socketchannel.configureBlocking(false);
                    System.out.println("客户端连接成功，" + socketchannel.hashCode());
                    //将当前channel注册到selector,并关心这个事件有没有发生读事件OP_READ，同时给channel关联一个buffer
                    socketchannel.register(selector, SelectionKey.OP_READ,ByteBuffer.allocate(1024));
                }
                if(selectionKey.isReadable()){
                    //发生了读事件,通过key反向得到channel和绑定的buffer
                    SocketChannel socketchannel = (SocketChannel)selectionKey.channel();
                    //获取与该channel关联的buffer，在和连接时就已经绑定了，40行处
                    ByteBuffer buffer = (ByteBuffer) selectionKey.attachment();
                    socketchannel.read(buffer);//从客户端读到的数据
                    System.out.println("from 客户端 : " + new String(buffer.array()));
                    buffer.clear();
                }
            }
            //及时将当前的SelectionKey,防止操作
            Keyiterator.remove();
        }
    }
}

```



## NIO快速入门2(客户端)

```java
package com.lwl.NIO;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.Channel;
import java.nio.channels.SocketChannel;
import java.util.Scanner;

public class NIOClient {
    public static void main(String[] args) throws IOException {
        //得到一个网络通道
        SocketChannel socketChannel = SocketChannel.open();
        //非阻塞
        socketChannel.configureBlocking(false);
        //提供服务器的ip和端口
        InetSocketAddress inetSocketAddress = new InetSocketAddress("127.0.0.1", 6666);
        //链接服务器
        if(!socketChannel.connect(inetSocketAddress)){
            while (!socketChannel.finishConnect()){
                System.out.println("链接需要时间，客户端不会阻塞");
            }
        }
//        String str = "hello world!";
        Scanner scanner = new Scanner(System.in);
        String str;
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        while (scanner.hasNext()){
            str = scanner.next();
            System.out.println(str);
            buffer.put(str.getBytes());
            buffer.flip();
            socketChannel.write(buffer);
            buffer.clear();
        }
        //生成一个和数组一样大的buffer
//        ByteBuffer byteBuffer = ByteBuffer.wrap(str.getBytes());
//        //发送数据，将buffer写入channel
//        socketChannel.write(byteBuffer);

        //代码会停在这
        System.in.read();
    }
}

```

## SelectionKey API

* SelectionKey，表示 Selector 和网络通道的注册关系,共四种:
* int OP ACCEPT:有新的网络连接可以 accept，值为 16
* int OP CONNECT:代表连接已经建立，值为8
* int OP READ:代表读操作，值为1
* int OP WRITE:代表写操作，值为 4

源码中:

* public static final int OP READ = 1 <<0;
* public static final int OP WRITE = 1 <<2;
* public static final int OP CONNECT =1 << 3;
* public static final int OP ACCEPT= 1 << 4;

SelectionKey的相关方法

public abstract class SelectionKey{

* public abstract Selector selector();//得到与之关联的Selector 对象
* public abstract SelectableChannel channel();//得到与之关联的通道
* public final object attachment();//得到与之关联的共享数
  据
* public abstract SelectionKey interestOps(int ops);//设置或改变监听事件
* public final boolean isAcceptable();//是否可以accept
* public final boolean isReadable();//是否可以读
* public final boolean isWritable();//是否可以写



1. ServerSocketChannel 在**服务器端监听新的客户端socket 连接**
2. 相关方法如下
   * public abstract class **ServerSocketChannel** extends AbstractSelectableChanne!imp lements NetworkChannel{
   * public static ServerSocketChannel open()，得到一个ServerSocketChannel通道
   * public final ServerSocketChannel bind(SocketAddress local)，设置服务器端端县
   * public final SelectableChannel configureBlocking(boolean block)，设置阻塞或非阻塞模式，取值 false表示采用非阻塞模式
   * public SocketChannel accept()，接受一个连接，返回代表这个连接的通道对冢
   * public final SelectionKeyregister(Selector sel,intops)，注册一个选择器并设置监听事件

1. SocketChannel，网络IO通道，**具体负责进行读写操作**。NIO把缓冲区的数据写入通
   道，或者把通道里的数据读到缓冲区。
2. 相关方法如下
   * public abstract class **SocketChannel** extends AbstractSelectableChannelimplements ByteChannel, ScatteringByteChannel, GatheringByteChannel,NetworkChannelf
   * public static SocketChannel open();//得到-个 SocketChannel 通道
   * public final SelectableChannel configureBlocking(boolean block);//设置阻塞或非阻塞模式，取值 false表示采用非阻塞模式
   * public boolean connect(SocketAddress remote);//连接服务器
   * public boolean finishconnect();//如果上面的方法连接失败，接下来就要通过该方法完成连接操作
   * public int write(ByteBuffersrc);//往通道里写数据
   * public int read(ByteBuffer dst);//从通道里读数据
   * public final SelectionKey register(Selector sel, int ops, Object att);//注册一个选择器并设置监听事件，最后一个参数可以设置共享数据
   * public final void close();//关闭通道

## Netty概述

* NIO 的类库和 API 繁杂，使用麻烦:需要熟练掌握 Selector、ServerSocketChannel.SocketChannel、ByteBuffer 等:
* 需要具备其他的额外技能:要熟悉 Java 多线程编程，因为 NIO 编程涉及到 Reactor模式，你必须对多线程和网络编程非常熟悉，才能编写出高质量的 NIO 程序。
* 开发工作量和难度都非常大:例如客户端面临断连重连、网络闪断、半包读写、失3)败缓存、网络拥塞和异常流的处理等等。
* JDK NIO 的 Bug:例如臭名昭著的 Epoll Bug，它会导致 Selector 空轮询，最终导致 CPU 100%。直到 JDK 1.7 版本该问题仍旧存在，没有被根本解决。

![截屏2026-01-01 下午8.36.18](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-c3a3cdcce8affa16a09321bdb7c613f3-63264d.png)

* Netty是由 JBOSS 提供的一个 Java开源框架。
* Netty 提供异步的、基于事件驱动的网络应用程序框架，用以快速开发高性能、高可靠性的网络10程序

* Netty 可以帮助你快速、简单的开发出一个网络应用，相当于简化和流程化了 NI0 的2)开发过程行业等获得了广泛的应用，知名的 Elasticsearch、Dubbo 框架内部都采用了 Netty.

### Netty的优点

Netty 对 JDK 自带的 NIO 的 API进行了封装，解决了上述问题。

* 设计优雅:适用于各种传输类型的统- API阻塞和非阻塞 Socket;基于灵活且可扩展的事件模型，可以清晰地分离关注点;高度可定制的线程模型-单线程，一个或多个线程池.
* 使用方便:详细记录的 Javadoc，用户指南和示例;没有其他依赖项，JDK5(Netty3.x)或6(Netty 4.x)就足够了。

* 高性能、吞吐量更高:延迟更低;减少资源消耗;最小化不必要的内存复制3)

* 安全:完整的 SSL/TLS 和 StartTls 支持:4)

* 社区活跃、不断更新:社区活跃，版本迭代周期短，发现的Bug可以被及时修复5)2同时，更多的新功能会被加入

现在常用netty4.x版本

## 线程模型概述-架构设计

* 不同的线程模式，对程序的性能有很大影响，为了搞清Netty 线程模式，我们来系统的讲解下 各个线程模式，最后看看Netty 线程模型有什么优越性.

* 目前存在的线程模型有
  * **传统阻塞IO服务模型**
  * **Reactor 模式**（反应器模式）
* **根据Reactor 的数量和处理资源池线程的数量不同，有3种典型的实现**
  * 单 Reactor 单线程:
  * 单 Reactor 多线程;
  * 主从 Reactor 多线程
* Netty 线程模式(Netty 主要基于**主从 Reactor 多线程模型**做了一定的改进，其中主从Reactor多线程模型有多个 Reactor)

### 传统阻塞I/O服务模型

**工作原理图**

黄色的框表示对象，蓝色的框表示线程

白色的框表示方法（API）

**模型特点**

1. 采用阻塞IO模型来获取输入的数据
2. 每个连接都需要独立的线程完成数据的输入，业务处理，数据返回

**问题分析**

1. 当并发数很大，就会创建大量的线程，占用很大系数资源
2. 连接创建后，如果当前线程暂时没有数据可读，该线程会阻塞在read操作，造成线程资源量费

总结：传统阻塞I/O服务模型，无法适应大并发的场景

![截屏2026-01-01 下午9.12.22](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-2ffccec2c3fea6e06076dbd56b302699-fd3ae6.png)

### Reactor模型

针对传统阻塞I/0 服务模型的2个缺点，解决方案:

1. 基于 I/O 复用模型:多个连接共用一个阻塞对象，应用程序只需要在一个阻塞对象等待，无需阻塞等待所有连接。当某个连接有新的数据可以处理时，操作系统通知应用程序，线程从阻塞状态返回，开始进行业务处理
2. 基于线程池复用线程资源:不必再为每个连接创建线程，将连接完成后的业务处理任务分配给线程进行处理，一个线程可以处理多个连接的业务。

![截屏2026-01-01 下午9.22.05](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-0a5af009a31ebb6ccf4ed165577b6f68-b83fef.png)

解决了传统IO模型的以下问题

1. 当并发数很大，就会创建大量的线程，占用很大系数资源
2. 连接创建后，如果当前线程暂时没有数据可读，该线程会阻塞在read操作，造成线程资源量费

Reactor又叫1. 反应器模型 2.分发者模型 3.统治者模型 

![截屏2026-01-01 下午9.24.31](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-8fd47448f177400bcb15c54098941e99-e4094f.png)

I/O复用结合线程池，就是Reactor模型基本设计思想

说明：

1. Reactor模型，指通过一个或多个输入请求，同时传递给服务处理器的模式（基于事件驱动）
2. 服务器程序处理传入的多个请求，并将它们同步分派到相应的处理线程，因此Reactor模式也叫Dispatcher模式
3. Reactor模式使用IO复用监听事件后，分发给某个线程（进程），这点就是网络服务高并发处理关键

### Reactor模式中核心组成:

1. Reactor:Reactor在一个单独的线程中运行，负责监听和分发事件，分发给适当的处理程序来对 IO事件做出反应。 它就像公司的电话接线员，它接听来自客户的电话并将线路转移到适当的联系人;
2. Handlers:处理程序执行 I/0 事件要完成的实际事件，类似于客户想要与之交谈的公司中的实际官员。Reactor 通过调度适当的处理程序来响应 I/O 事件，处理程序执行非阻塞操作。

### Reactor模式分类：

根据Reactor的梳理和处理资源线程池的数量不同，有3种典型的实现

1. 单 Reactor 单线程:
2. 单 Reactor 多线程;
3. 主从 Reactor 多线程

## 单 Reactor 单线程

![截屏2026-01-02 下午2.05.18](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-ed24028c092d112f289085dc369b0429-ecc985.png)

1. Select 是前面 I/O 复用模型介绍的标准网络编程 API，可以实现应用程序通过一个阻塞对象监听多路连接请求
2. Reactor 对象通过 Select 监控客户端请求事件，收到事件后通过 Dispatch 进行分发
3. 如果是建立连接请求事件，则由 Acceptor 通过 Accept 处理连接请求，然后创建一个Handler对象处理连接完成后的后续业务处理
4. 如果不是建立连接事件，则 Reactor 会分发调用连接对应的 Handler 来响应
5. Handler 会完成 Read→业务处理→>Send 的完整业务流程



**结合实例**:服务器端用一个线程通过多路复用搞定所有的 10操作(包括连接，读、写等)，编码简单，清晰明了，但是如果客户端连接数量较多，将无法支撑，前面的 NIO案例就属于这种模型。



### 缺点和优点

**优点**:模型简单，没有多线程、进程通信、竞争的问题，全部都在一个线程中完成

**缺点**:性能问题，只有一个线程，无法完全发挥多核 CPU的性能。Handler 在处理某个连接上的业务时，整个进程无法处理其他连接事件，很容易导致性能瓶颈

**缺点**:可靠性问题，线程意外终止，或者进入死循环，会导致整个系统通信模块不3)可用，不能接收和处理外部消息，造成节点故障
**使用场景**:客户端的数量有限，业务处理非常快速，比如Redis在业务处理的时间复4)杂度 0(1) 的情况



## 单Reactor多线程

![截屏2026-01-02 下午2.43.46](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-cb446f2fd2dafc5898f6143ee58ef148-da7c27.png)

方案说明

1. Reactor对象通过select监控客户端请求事件，收到事件后，通过dispatch进行分发
2. 如果建立连接的请求，则由Acceptor通过accept处理连接请求，然后创建一个handle对象处理完成连接后的各种事件
3. 如果不是连接请求，则由reactor分发调用连接对应的handle来处理
4. handle只负责响应事件，不做具体的业务处理，通过read读取数据后，会分发后面的worker线程池的某个线程处理业务
5. worker线程池会分配独立线程完成真正的业务，并将结果返回给handle
6. handle收到响应后，通过send将结果返回给client

### 优缺点

**优点**： 可以充分的利用多核cpu的处理能力

**缺点**：多线程数据共享和访问比较复杂,Reactor处理所有的事件的监听和响应，在单线程运行，在高并发场景容易出现性能瓶颈。

## 主从Reactor多线程

![截屏2026-01-02 下午3.05.47](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-af1d53688da29b7370d67690eaa2e9b8-aa93b4.png)

**工作原理示意：**

针对单Reactor多线程模型中，Reactor在单线程中运行，高并发场景下容易成为性能瓶颈，可以让Reactor在多线程中运行

**方案说明：**

1. Reactor主线程MainReactor对象通过select监听连接事件，收到请求后，通过Acceptor处理连接事件
2. 当Acceptor处理连接事件后，MainReactor将连接分配给SubReactor
3. subreacotr将连接加入到连接队列进行监听，并将创建handler进行处理各种事件处理
4. 当新事件发生时，subreactor就会调用对应的handle处理
5. handler通过read读取数据，分发给后面的worker线程处理
6. worker线程池分配独立的worker线程进行业务处理，并返回结果
7. handler收到响应的结果后，再通过send将结果返回给client
8. Reactor主线程可以对应多个Reactor子线程，即MainReactor可以关联多个SubReactor

## Netty 模型

![截屏2026-01-16 下午11.33.45](http://bucket.alan.org.cn/blog/2026/01/17/12-50-46-d9f3fdc9d79a361ade03596fcbd009b5-469675.png)

1. Netty抽象出两组线程池BossGroup专门接收客户端连接，WorkerGroup专门负责网络的读写
2. BossGroup和WorkerGroup类型都是NioEventLoopGroup
3. NioEventLoopGroup相当于一个事件循环组，这个组含有多个事件循环，每一个事件循环是NioEventLoop
4. NioEventLoop表示一个不断循环执行处理任务多线程，每个NioEventLoop都有一个Selector，用于监听绑定在其上的socket的网络通讯
5. NioEventLoopGroup可以有多个线程，即可以含有多个NioEventLoop 
6. 每个BossEventLoop执行的步骤有3步
   1. 轮询accept事件
   2. 处理accept事件，与client建立连接，生成NioSocketChannel，并将其注册到某个workerNioEventLoop上的selector
   3. 处理任务队列的任务，即runAllTasks
7. 每个WorkerNioEventLoop循环执行步骤
   1. 轮询read或write事件
   2. 处理I/O事件，即read，write事件，在对应NioSocketChannel处理
   3. 处理任务队列的任务，即runAllTasks
8. 每个WorkerNioEventLoop处理业务时，会使用Pipeline 管道,Pipeline 中包含了channel，即通过pipline可以获取到对应的通道，管道中维护了很多的处理器

## Netty入门案例

### 服务端

NettyServer

``` java
package cn.org.alan.netty.simple;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/16 下午11:50
 */
public class NettyServer {
    public static void main(String[] args) throws InterruptedException {
        // 创建BossGroup 和 workerGroup
        // 说明
        // 1. 创建两个线程组BossGroup 和 workerGroup
        // 2. bossGroup只是处理连接请求，真正的客户端业务处理会交给workerGroup完成
        // 3. 两个都是无限循环
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 创建服务器端的启动对象，配置参数
            ServerBootstrap bootstrap = new ServerBootstrap();

            // 使用链式编程来进行设置
            bootstrap.group(bossGroup,workerGroup) // 设置两个线程组
                    .channel(NioServerSocketChannel.class) // 使用NioSocketChannel作为服务器通道的实现
                    .option(ChannelOption.SO_BACKLOG,128) // 设置线程队列得到连接的个数
                    .childOption(ChannelOption.SO_KEEPALIVE,true) // 设置保持连接活动连接状态
                    .childHandler(new ChannelInitializer<SocketChannel>() {// 创建一个通道初始化对象（匿名对象）
                        // 给pipline设置处理器
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast(new NettyServerHandler()); // 向管道的最后追加一个处理器
                        }
                    }); // 给我们的workerGroup的EventLoop对应的管道设置处理器
            // 指定相关端口,并且同步处理 生成了一个ChannelFuture对象
            ChannelFuture sync = bootstrap.bind(6668).sync();

            // 对关闭通道进行[监听]
            sync.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

```

NettyServerHandle

``` java
package cn.org.alan.netty.simple;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;

/**
 * 说明：
 *  我们自定义一个Handler需要继续netty规定好的某个HandlerAdapter(规范)
 *  这时我们定自定义一个Handler,才能成为一个handler
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 上午12:04
 */
public class NettyServerHandler extends ChannelInboundHandlerAdapter {
    // 读取实际数据（这里可以读取客户端发送的消息）

    /**
     * ChannelHandlerContext ctx：上下文对象，含有，管道pipline,通道channel,地址
     * Object msg：是客户端发送的数据 默认Object
     * @param ctx
     * @param msg
     * @throws Exception
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        System.out.println("server ctx = "+ ctx);
        // 将msg转成一个ByteBuf
        // ByteBuf是netty提供的，不是NIO的ByteBuffer
        ByteBuf buf = (ByteBuf) msg;
        System.out.println("客户端发送的消息是："+ buf.toString(CharsetUtil.UTF_8));
        System.out.println("客户端地址："+ ctx.channel().remoteAddress());
        // super.channelRead(ctx, msg);
    }
    // 数据读取完毕
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        // writeAndFlush是write+flush
        // 将数据写入到缓存，并刷新
        // 一般将，我们对发送到数据进行编码
        ctx.writeAndFlush(Unpooled.copiedBuffer("hello",CharsetUtil.UTF_8));
        // super.channelReadComplete(ctx);
    }
    // 处理异常，一般需要关闭通道
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        ctx.close();
        // super.exceptionCaught(ctx, cause);
    }
}

```

NettyClient

``` java
package cn.org.alan.netty.simple;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 上午12:16
 */
public class NettyClient {
    public static void main(String[] args) throws InterruptedException {
        // 客户端需要一个事件循环组
        NioEventLoopGroup eventExecutors = new NioEventLoopGroup();
        // 创建客户端启动对象
        // 客户端使用的不是serverBootstrap而是Bootstrap
        try {
            Bootstrap bootstrap = new Bootstrap();
            // 设置相关参数
            bootstrap.group(eventExecutors) // 设置线程组
                    .channel(NioSocketChannel.class)// 设置客户端通道实现类
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast(new NettyClientHandler()); // 加入自己的处理器
                        }
                    });
            System.out.println("客户端启动成功");
            // 启动客户端去连接服务端
            // 关于ChannelFuture要分析，涉及netty端异步模型
            ChannelFuture channelFuture = bootstrap.connect("127.0.0.1", 6668).sync();
            // 给关闭通道进行监听
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            eventExecutors.shutdownGracefully();
        }
    }
}

```

NettyClientHandler

``` java
package cn.org.alan.netty.simple;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 上午12:22
 */
public class NettyClientHandler extends ChannelInboundHandlerAdapter {
    // 当通道就绪就会触发方法
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        System.out.println("client "+ ctx);
        ctx.writeAndFlush(Unpooled.copiedBuffer("hello,server", CharsetUtil.UTF_8));
        // super.channelActive(ctx);
    }
    /**
     * 当通道有读取时间时，会触发
     * @param ctx
     * @param msg
     * @throws Exception
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 将msg转成一个ByteBuf
        // ByteBuf是netty提供的，不是NIO的ByteBuffer
        ByteBuf buf = (ByteBuf) msg;
        System.out.println("服务器回复的消息："+ buf.toString(CharsetUtil.UTF_8));
        System.out.println("服务器地址："+ ctx.channel().remoteAddress());
        // super.channelRead(ctx, msg);
    }
    // 处理异常，一般需要关闭通道
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
        // super.exceptionCaught(ctx, cause);
    }
}

```

## TaskQueue

任务队列中的Task的3种典型场景

1. 自定义普通任务：该任务是提交到taskQueue中

   ``` java
   // 解决方案1 用户查询自定义普通任务
           ctx.channel().eventLoop().execute(new Runnable() {
               @Override
               public void run() {
                   try {
                       Thread.sleep(10*1000);
                       ctx.writeAndFlush(Unpooled.copiedBuffer("testtest",CharsetUtil.UTF_8));
                   } catch (InterruptedException e) {
                       System.out.println("发送异常");
                   }
               }
           });
   ```

   如果上吗代码复制一份改为20秒，但因为是同一个线程，所以会累加为30秒返回

2. 自定义定时任务 : 该任务是提交到scheduleTaskQueue中

   ``` java
     // 方法2 ：用户自定义定时任务->该任务是提交到scheduleTaskQueue中
           ctx.channel().eventLoop().schedule(new Runnable() {
               @Override
               public void run() {
                           try {
                               Thread.sleep(20*1000);
                               ctx.writeAndFlush(Unpooled.copiedBuffer("testtest",CharsetUtil.UTF_8));
                           } catch (InterruptedException e) {
                               System.out.println("发送异常");
                           }
               }
           },5, TimeUnit.SECONDS);
   
   ```

   

3. 非当前Reactor线程调用Channel的各种方法

例如推送系统，会根据用户标识，找到对应channel，然后调用write类方法向用户推送消息。其中write会提交到任务队列后被异步消费

方案说明：

1. Netty抽象出两组线程池BossGroup专门接收客户端连接，WorkerGroup专门负责网络的读写
2. NioEventLoop表示一个不断循环执行处理任务的线程，每个NioEventLoop都有一个selector,用于监听绑定在其上的socket网络通道
3. NioEventLoop内部采用串行化设计，从消息的读取->解码->处理->编码->发送，始终由IO线程NioEventLoop负责

* NioEventLoopGroup下包含了多个NioEventLoop
* 每个NioEventLoop中包含一个Selector,一个taskQueue
* 每个NioEventLoop的Selector上可以注册监听多个NioChannel
* 每个NioChannel只会绑定在唯一的NioEventLoop上
* 每个NioChannel都绑定有一个自己的ChannelPipeline



## Netty心跳检测机制

案例：

1. 服务器超过3秒没有读，就提示读空闲
2. 服务器超过5秒没有写操作，就提示写空闲
3. 当服务器超过7秒没有读或写操作时，就提示读写空闲

NettyServer

``` java
package cn.org.alan.netty.heartbeat;

import cn.org.alan.netty.simple.NettyServerHandler;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.timeout.IdleStateHandler;

import java.util.concurrent.TimeUnit;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 下午4:10
 */
public class MyServer {
    public static void main(String[] args) {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup,workerGroup)
                    .channel(NioServerSocketChannel.class) 
                    .handler(new LoggingHandler(LogLevel.INFO))
                    .option(ChannelOption.SO_BACKLOG,128) 
                    .childOption(ChannelOption.SO_KEEPALIVE,true)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {

                            ChannelPipeline pipeline = ch.pipeline();
                            // IdleStateHandler 时Netty提供的处理空闲状态的处理器
                            // long readerIdleTime 表示多长时间没有读，就会发送一个心跳检测是否连接
                            // long writerIdleTime 表示多长时间没有写，就会发送一个心跳检测是否连接
                            // long allIdleTime 表示多长时间即没有读页没有写，就会发送一个心跳检测是否连接
                            // TimeUnit unit 时间单位
                            // 当IdleStateHandler触发后，就会传递给管道下一个handler去处理，通过调用触发下一个handler的userEventTiggered
                            // 在该方法中去处理IdleStateHandler(读空闲，写空闲，读写空闲)
                            pipeline.addLast(new IdleStateHandler(3,5,7, TimeUnit.SECONDS));
                            // 加入一个对空闲检测进一步处理的handler（自定义)
                            pipeline.addLast(new MyserverHandler());
                        }
                    }); 

            ChannelFuture sync = bootstrap.bind(7000).sync();
            sync.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
```

NettyHandler

``` java
package cn.org.alan.netty.heartbeat;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleStateEvent;
import io.netty.handler.timeout.IdleStateHandler;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 下午4:21
 */
public class MyserverHandler extends ChannelInboundHandlerAdapter {
    /**
     *
     * @param ctx 上下文
     * @param evt 事件
     * @throws Exception
     */
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if(evt instanceof IdleStateEvent){
            // 将evt向下转型 IdleStateHandler
            IdleStateEvent event = (IdleStateEvent) evt;
            String  eventType = null;
            switch (event.state()){
                case READER_IDLE :
                    eventType = "读空闲";
                    break;
                case WRITER_IDLE:
                    eventType = "写空闲";
                    break;
                case ALL_IDLE:
                    eventType = "读写空闲";
                    break;
            }
            System.out.println(ctx.channel().remoteAddress() + "--超时事件发生--"+eventType);
        }
        super.userEventTriggered(ctx, evt);
    }
}
```

## WebSocket长连接

NettyServer

``` java
package cn.org.alan.netty.websocket;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.handler.timeout.IdleStateHandler;

import java.util.concurrent.TimeUnit;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 下午4:10
 */
public class MyServer {
    public static void main(String[] args) {
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .handler(new LoggingHandler(LogLevel.INFO))
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {

                            ChannelPipeline pipeline = ch.pipeline();
                            // 因为基于http协议，使用http的编码和解码器
                            pipeline.addLast(new HttpServerCodec());
                            // 是以块方式写，添加CHunkedWriteHandler处理器
                            pipeline.addLast(new ChunkedWriteHandler());
                            // 因为http数据在传输过程中时分段的，HttpObjectAggregator 就是可以将多个段聚合
                            // 这就是为什么，当浏览器发送大量数据时，就会发出多长http请求
                            pipeline.addLast(new HttpObjectAggregator(8192));
                            // 对应websocket它的数据时以帧(frame)形式传递
                            // 可以看到WebSocketFrame下面有6个子类
                            // 浏览器请求时，ws://localhost:7000/xxx 表示请求到url
                            pipeline.addLast(new WebSocketServerProtocolHandler("/hello"));
                            pipeline.addLast(new MyserverHandler());
                        }
                    });

            ChannelFuture sync = bootstrap.bind(7000).sync();
            sync.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

```

NettyHandler

``` java
package cn.org.alan.netty.websocket;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.timeout.IdleStateEvent;

import java.time.LocalDate;

/**
 * 说明：
 *
 * @Author Alan
 * @Version 1.0
 * @Date 2026/1/17 下午4:21
 */
public class MyserverHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        System.out.println("服务端收到消息:"+msg.text() );
        // 回复浏览器
        ctx.channel().writeAndFlush(new TextWebSocketFrame("服务器事件+"+ LocalDate.now()));
    }
    // 当web客户端连接后，触发方法
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        System.out.println("handlerAdded被调用"+ctx.channel().id().asLongText());
        System.out.println("handlerAdded被调用"+ctx.channel().id().asShortText());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        System.out.println("handlerRemoved被调用"+ctx.channel().id().asShortText());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("异常发生");
        ctx.close();
    }
}

```

