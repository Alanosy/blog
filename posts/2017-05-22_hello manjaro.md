---
title: C语言_4_day
date: 2017-05-22 15:01:35
categories:
- 笔记
tags:
- Linux
- Manjaro
cover: 
pageview: 1558
---

## 字符串理
字符串处理头文件
```
#include <string.h>
```
## 字符串处理函数
1.获取字符串的长度：strlen
2.拷贝字符串：strcpy和strncpy
3.连接字符串：strcat和strncat
4.比较字符串：strcmp和strncmp
## 二维数组
```
数据类型 数组名[x][y]={};
```
## 指针
定义指针变量
```
类型名 *指针变量名
```
取地址运算符&
使用取值运算符*

注意：要避免访问为初始化的指针。
## 今日小收获
今天做了到题，自己写出来后看到了与比人的差距
题目是
```
题目内容：你的程序要读入一系列正整数数据，输入-1表示输入结束，-1本身不是输入的数据。程序输出读到的数据中的奇数和偶数的个数。

输入格式:一系列正整数，整数的范围是（0,100000）。如果输入-1则表示输入结束。

输出格式：两个整数，第一个整数表示读入数据中的奇数的个数，第二个整数表示读入数据中的偶数的个数。两个整数之间以空格分隔。

输入样例：9 3 4 2 5 7 －1 

输出样例：4 2
```
这个是我写的
```
#include<stdio.h>
int main()
{
    int num[1000000];
    int x=0,y=0,i=0,j=0,k=0;
    printf("请输入一列正整数：\n");
    while(i>-1)
    {
        scanf("%d",&num[i]);
        if(*(num+i)==-1)
        {
            break;
        }
        i++;
    }
    while(j>-1)
    {
        if(*(num+j)==0)
        
            break;
        
        else
            if(*(num+j)%2==0)
                x+=1;
            else
                y+=1;
            j++;
    }

    printf("%d  %d\n",x,y);
    return 0;
}
```
这是标准答案
```
#include <stdio.h>
 
int main()
{
    int a,number1,number2;
    number1 = 0;
    number2 = 0;
    scanf("%d", &a);
    while(a!=-1){
        if(a%2==0){
            number2++;
        }
        else{
            number1++;
        }
    scanf("%d", &a);
    }
    printf("%d %d",number1,number2);
    return 0;
}

```
标准答案的逻辑思维是输入一个数就判断一个数的奇偶性并存储，我的则是先存储数值，然后在判断
有个弊端是我利用了数组，且设定了范围100000，如果超过可能机会出bug而且写的比标准答案复杂可能会影响运行速度。虽然能用，还是感觉到巨大的差距，还需提高代码能力。