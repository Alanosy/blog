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

