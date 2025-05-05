---
title: Linux笔记
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-05 16:57:50
updated: 2025-05-05 16:57:50
topic:
banner:
references:
---

# Linux笔记



## 权限管理

### 修改文件权限：chmod

chmod 修改文件权限有两种使用格式：字母法与数字法。

字母法：chmod u/g/o/a +/-/= rwx 文件

| [ u/g/o/a ] | 含义                                                      |
| ----------- | --------------------------------------------------------- |
| u           | user 表示该文件的所有者                                   |
| g           | group 表示与该文件的所有者属于同一组( group )者，即用户组 |
| o           | other 表示其他以外的人                                    |
| a           | all 表示这三者皆是                                        |

| [ ±= ] | 含义     |
| ------ | -------- |
| +      | 增加权限 |
| -      | 撤销权限 |
| =      | 设定权限 |

| rwx  | 含义                                                         |
| ---- | ------------------------------------------------------------ |
| r    | read 表示可读取，对于一个目录，如果没有r权限，那么就意味着不能通过ls查看这个目录的内容。 |
| w    | write 表示可写入，对于一个目录，如果没有w权限，那么就意味着不能在目录下创建新的文件。 |
| x    | excute 表示可执行，对于一个目录，如果没有x权限，那么就意味着不能通过cd进入这个目录。 |

数字法：“rwx” 这些权限也可以用数字来代替	

| 字母 | 说明                         |
| ---- | ---------------------------- |
| r    | 读取权限，数字代号为 “4”     |
| w    | 写入权限，数字代号为 “2”     |
| x    | 执行权限，数字代号为 “1”     |
| -    | 不具任何权限，数字代号为 “0” |

如执行：chmod u=rwx,g=rx,o=r filename 就等同于：chmod u=7,g=5,o=4 filename

chmod 751 file：

文件所有者：读、写、执行权限
同组用户：读、执行的权限
其它用户：执行的权限
chmod 777 file：所有用户拥有读、写、执行权限

注意：如果想递归所有目录加上相同权限，需要加上参数“ -R ”。 如：chmod 777 test/ -R 递归 test 目录下所有文件加 777 权限

修改文件所有者：chown

``` b ash
python@ubuntu:~/test$ ll h.txt 
-rw------- 1 python python 4 11月 22 22:35 h.txt
python@ubuntu:~/test$ chown mike h.txt 
chown: 正在更改'h.txt' 的所有者: 不允许的操作
python@ubuntu:~/test$ sudo chown mike h.txt 
python@ubuntu:~/test$ ll h.txt              
-rw------- 1 mike python 4 11月 22 22:35 h.txt
```

修改文件所属组：chgrp

```bash
python@ubuntu:~/test$ ll h.txt              
-rw------- 1 mike python 4 11月 22 22:35 h.txt
python@ubuntu:~/test$ sudo chgrp mike h.txt 
python@ubuntu:~/test$ ll h.txt              
-rw------- 1 mike mike 4 11月 22 22:35 h.txt

```

## 文件管理

#### 输出重定向：>

可将本应显示在终端上的内容保存到指定文件中。

如：ls > test.txt ( test.txt 如果不存在，则创建，存在则覆盖其内容 )

注意： >输出重定向会覆盖原来的内容，>>输出重定向则会追加到文件的尾部。

#### 管道：|

管道：一个命令的输出可以通过管道做为另一个命令的输入。

“ | ”的左右分为两端，从左端写入到右端。
``` bash
python@ubuntu:/bin$ ll -h |more   
总用量 13M
drwxr-xr-x  2 root root  4.0K 8月   4  2016 ./
drwxr-xr-x 26 root root  4.0K 7月  30  2016 ../
-rwxr-xr-x  1 root root 1014K 6月  24  2016 bash*
-rwxr-xr-x  1 root root   31K 5月  20  2015 bunzip2*
-rwxr-xr-x  1 root root  1.9M 8月  19  2015 busybox*
-rwxr-xr-x  1 root root   31K 5月  20  2015 bzcat*
lrwxrwxrwx  1 root root     6 5月  16  2016 bzcmp -> bzdiff*
-rwxr-xr-x  1 root root  2.1K 5月  20  2015 bzdiff*
lrwxrwxrwx  1 root root     6 5月  16  2016 bzegrep -> bzgrep*
--更多--

```

#### 文本搜索：grep

Linux系统中grep命令是一种强大的文本搜索工具，grep允许对文本文件进行模式查找。如果找到匹配模式， grep打印包含模式的所有行。

grep一般格式为：

```
grep [-选项] '搜索内容串' 文件名
```

在grep命令中输入字符串参数时，最好引号或双引号括起来。例如：grep 'a' 1.txt。

在当前目录中，查找前缀有test字样的文件中包含 test 字符串的文件，并打印出该字符串的行。此时，可以使用如下命令：

```
$ grep test test* #查找前缀有test的文件包含test字符串的文件  
testfile1:This a Linux testfile! #列出testfile1 文件中包含test字符的行  
testfile_2:This is a linux testfile! #列出testfile_2 文件中包含test字符的行  
testfile_2:Linux test #列出testfile_2 文件中包含test字符的行 
```

以递归的方式查找符合条件的文件。例如，查找指定目录/etc/acpi 及其子目录（如果存在子目录的话）下所有文件中包含字符串"update"的文件，并打印出该字符串所在行的内容，使用的命令为：

```
$ grep -r update /etc/acpi #以递归的方式查找“etc/acpi”  
#下包含“update”的文件  
/etc/acpi/ac.d/85-anacron.sh:# (Things like the slocate updatedb cause a lot of IO.)  
Rather than  
/etc/acpi/resume.d/85-anacron.sh:# (Things like the slocate updatedb cause a lot of  
IO.) Rather than  
/etc/acpi/events/thinkpad-cmos:action=/usr/sbin/thinkpad-keys--update 
```

反向查找。前面各个例子是查找并打印出符合条件的行，通过"-v"参数可以打印出不符合条件行的内容。

查找文件名中包含 test 的文件中不包含test 的行，此时，使用的命令为：

```
$ grep -v test* #查找文件名中包含test 的文件中不包含test 的行  
testfile1:helLinux!  
testfile1:Linis a free Unix-type operating system.  
testfile1:Lin  
testfile_1:HELLO LINUX!  
testfile_1:LINUX IS A FREE UNIX-TYPE OPTERATING SYSTEM.  
testfile_1:THIS IS A LINUX TESTFILE!  
testfile_2:HELLO LINUX!  
testfile_2:Linux is a free unix-type opterating system.  
```



归档管理：tar

此命令可以把一系列文件归档到一个大文件中，也可以把档案文件解开以恢复数据。

tar使用格式 tar [参数] 打包文件名 文件

tar命令参数很特殊，其参数前面可以使用“-”，也可以不使用。

常用参数：

| 参数 | 含义                                                      |
| ---- | --------------------------------------------------------- |
| -c   | 生成档案文件，创建打包文件                                |
| -v   | 列出归档解档的详细过程，显示进度                          |
| -f   | 指定档案文件名称，f后面一定是.tar文件，所以必须放选项最后 |
| -t   | 列出档案中包含的文件                                      |
| -x   | 解开档案文件                                              |

注意：除了f需要放在参数的最后，其它参数的顺序任意。

``` 
python@ubuntu:~/test$ tar -cvf test.tar 1.txt 2.txt 3.txt 
1.txt
2.txt
3.txt
python@ubuntu:~/test$ ll
总用量 32
drwxrwxr-x  2 python python  4096 11月 21 14:02 ./
drwxr-xr-x 31 python python  4096 11月 21 13:34 ../
-rw-rw-r--  1 python python    51 1月  20  2017 1.txt
-rw-rw-r--  1 python python    55 1月  20  2017 2.txt
-rw-rw-r--  1 python python    51 1月  20  2017 3.txt
-rw-rw-r--  1 python python 10240 11月 21 14:02 test.tar
python@ubuntu:~/test$ rm -rf *.txt
python@ubuntu:~/test$ ll
总用量 20
drwxrwxr-x  2 python python  4096 11月 21 14:03 ./
drwxr-xr-x 31 python python  4096 11月 21 13:34 ../
-rw-rw-r--  1 python python 10240 11月 21 14:02 test.tar
python@ubuntu:~/test$ tar -xvf test.tar 
1.txt
2.txt
3.txt
python@ubuntu:~/test$ ls *.txt
1.txt  2.txt  3.txt

```

#### 文件压缩解压：zip、unzip

通过zip压缩文件的目标文件不需要指定扩展名，默认扩展名为zip。

压缩文件：zip [-r] 目标文件(没有扩展名) 源文件

解压文件：unzip -d 解压后目录文件 压缩文件

``` 
python@ubuntu:~/test$ ls
1.txt  2.txt  3.txt  test.tar
python@ubuntu:~/test$ zip myzip *.txt
  adding: 1.txt (stored 0%)
  adding: 2.txt (stored 0%)
  adding: 3.txt (stored 0%)
python@ubuntu:~/test$ ls
1.txt  2.txt  3.txt  myzip.zip  test.tar
python@ubuntu:~/test$ rm -f *.txt *.tar
python@ubuntu:~/test$ ls
myzip.zip
python@ubuntu:~/test$ unzip myzip.zip 
Archive:  myzip.zip
 extracting: 1.txt                   
 extracting: 2.txt                   
 extracting: 3.txt                   
python@ubuntu:~/test$ ls
1.txt  2.txt  3.txt  myzip.zip
python@ubuntu:~/test$ unzip -d dir myzip.zip 
Archive:  myzip.zip
 extracting: dir/1.txt               
 extracting: dir/2.txt               
 extracting: dir/3.txt               
python@ubuntu:~/test$ ls
1.txt  2.txt  3.txt  dir  myzip.zip

```

## Shell编程

### 入门

#### 运行Shell脚本

编写shell脚本：

``` shell
vi test.sh

#!/bin/bash
echo "Hello World !"

```

**#!** 是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行，即使用哪一种 Shell。

echo 命令用于向窗口输出文本。

运行 Shell 脚本有两种方法：

**1、作为可执行程序**

``` shell
chmod +x ./test.sh  #使脚本具有执行权限
./test.sh  #执行脚本
```

默认情况下，一定要写成 **./test.sh**，而不是 **test.sh**，运行其它二进制的程序也一样。

除非将当前目录.加入到PATH环境变量中，配置方法：

```shell
sudo vi /etc/profile
加入一行
export PATH=$PATH:.
保存之后，执行
source /etc/profile

```

**2、作为解释器参数**

直接运行解释器，其参数就是 shell 脚本的文件名：

``` bash
/bin/sh test.sh
```

这种方式运行的脚本，不需要在第一行指定解释器信息，写了也没用。

#### 编写一个快捷创建shell脚本的命令

``` shell
#!/bin/bash
if test -z $1;then
  newfile="./script_`date +%m%d_%s`"
else
  newfile=$1
fi
echo $newfile
if  ! grep "^#!" $newfile &>/dev/null; then
cat >> $newfile << EOF
#!/bin/bash
# Author:
# Date & Time: `date +"%F %T"`
#Description:
EOF
fi
vim +5 $newfile
chmod +x $newfile
```

将以上内容编写好之后保存为shell文件，然后执行

```
chmod u+x shell
sudo mv shell /usr/bin/

```

#### echo命令

Shell 的 echo 指令与 PHP 的 echo 指令类似，都是用于字符串的输出。命令格式：

```
echo string
```

### Shell变量

#### 定义变量

``` 
your_name="taobao.com"
```

变量名的命名须遵循如下规则：

- 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头。
- 中间不能有空格，可以使用下划线（_）。
- 不能使用标点符号。
- 不能使用bash里的关键字（可用help命令查看保留关键字）。

#### 使用变量

在变量名前面加美元符号即可，如：

```
your_name="qinjx"
echo $your_name
echo ${your_name}
```

加花括号可以帮助解释器识别变量的边界，比如：

```
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done
```

#### 只读变量

使用 readonly 命令可以将变量定义为只读变量，只读变量的值不能被改变。

下面的例子尝试更改只读变量，结果报错：

```
python@ubuntu:~/shell$ myUrl="http://www.google.com"
python@ubuntu:~/shell$ readonly myUrl
python@ubuntu:~/shell$ myUrl="http://www.baidu.com"
-bash: myUrl: 只读变量
```

#### 删除变量

使用 unset 命令可以删除变量，但不能删除只读变量：

```
#!/bin/sh
myUrl="http://www.baidu.com"
unset myUrl
echo $myUrl

```

变量类型

运行shell时，会同时存在三种变量：

1) 局部变量 局部变量在脚本或命令中定义，仅在当前shell实例中有效，其他shell启动的程序不能访问局部变量。
2) 环境变量 所有的程序，包括shell启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候shell脚本也可以定义环境变量。
3) shell变量 shell变量是由shell程序设置的特殊变量。shell变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了shell的正常运行



### Shell 函数

shell中函数的定义格式如下：

```
[ function ] funname [()]
{
    action;
    [return int;]
}

```

说明：

- 1、可以带function fun() 定义，也可以直接fun() 定义,不带任何参数。
- 2、参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值。 return后跟数值n(0-255)

示例：

``` shell
#!/bin/bash

funWithReturn(){
    echo "这个函数会对输入的两个数字进行相加运算..."
    echo "输入第一个数字: "
    read aNum
    echo "输入第二个数字: "
    read anotherNum
    echo "两个数字分别为 $aNum 和 $anotherNum !"
    return $(($aNum+$anotherNum))
}
funWithReturn
echo "输入的两个数字之和为 $? !"

```

输出，类似下面：

```
这个函数会对输入的两个数字进行相加运算...
输入第一个数字: 
1
输入第二个数字: 
2
两个数字分别为 1 和 2 !
输入的两个数字之和为 3 !

```

函数返回值在调用该函数后通过 $? 来获得。

注意：所有函数在使用前必须定义。这意味着必须将函数放在脚本开始部分，直至shell解释器首次发现它时，才可以使用。调用函数仅使用其函数名即可。

在Shell中，调用函数时可以向其传递参数。在函数体内部，通过 $n 的形式来获取参数的值，例如，$1表示第一个参数，$2表示第二个参数…

带参数的函数示例：
```
#!/bin/bash

funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "第十个参数为 $10 !"
    echo "第十个参数为 ${10} !"
    echo "第十一个参数为 ${11} !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73

```

输出结果：

```
第一个参数为 1 !
第二个参数为 2 !
第十个参数为 10 !
第十个参数为 34 !
第十一个参数为 73 !
参数总数有 11 个!
作为一个字符串输出所有参数 1 2 3 4 5 6 7 8 9 34 73 !

```

当n>=10时，需要使用`${n}`来获取参数。

另外，还有几个特殊字符用来处理参数：	

参数处理	说明
$#	传递到脚本的参数个数
$*	以一个单字符串显示所有向脚本传递的参数
$$	脚本运行的当前进程ID号
$!	后台运行的最后一个进程的ID号
$@	与$*相同，但是使用时加引号，并在引号中返回每个参数。
$-	显示Shell使用的当前选项，与set命令功能相同。
$?	显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。

| 参数处理 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| $#       | 传递到脚本的参数个数                                         |
| $$       | 脚本运行的当前进程ID号                                       |
| $!       | 后台运行的最后一个进程的ID号                                 |
| $@       | 与$*相同，但是使用时加引号，并在引号中返回每个参数。         |
| $-       | 显示Shell使用的当前选项，与set命令功能相同。                 |
| $?       | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。 |

### Shell 流程控制

#### if else判断语句

if 语句语法格式：

``` shell
if condition
then
    command1 
    command2
    ...
    commandN 
fi

```

写成一行（适用于终端命令提示符）：

```
if [ $(ps -ef | grep -c "ssh") -gt 1 ]; then echo "true"; fi

```

if else 语法格式：

```shell
if condition
then
    command1 
    command2
    ...
    commandN
else
    command
fi

```

if else-if else 语法格式：

``` shell
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi

```

以下实例判断两个变量是否相等：

``` shell
a=10
b=20
if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi
```

#### for循环

for循环一般格式为：

``` shell
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```

写成一行：

```
for var in item1 item2 ... itemN; do command1; command2… done;
```



#### while循环

while循环格式为：

``` shell
while condition
do
    command
done
```



## firewalld 防火墙常用命令

### 服务管理命令
```bash
# 启动firewalld
sudo systemctl start firewalld

# 停止firewalld
sudo systemctl stop firewalld

# 启用开机自启
sudo systemctl enable firewalld

# 禁用开机自启
sudo systemctl disable firewalld

# 查看状态
sudo systemctl status firewalld
```

### 基本信息查看
```bash
# 查看防火墙状态
sudo firewall-cmd --state

# 查看默认区域
sudo firewall-cmd --get-default-zone

# 查看所有可用区域
sudo firewall-cmd --get-zones

# 查看当前活动区域
sudo firewall-cmd --get-active-zones

# 查看所有规则(永久+临时)
sudo firewall-cmd --list-all
```

### 区域管理
```bash
# 设置默认区域
sudo firewall-cmd --set-default-zone=public

# 查看指定区域配置
sudo firewall-cmd --zone=public --list-all

# 更改接口所属区域
sudo firewall-cmd --zone=work --change-interface=eth0
```

### 端口管理
```bash
# 开放端口(临时)
sudo firewall-cmd --add-port=80/tcp

# 开放端口(永久)
sudo firewall-cmd --add-port=80/tcp --permanent

# 移除端口
sudo firewall-cmd --remove-port=80/tcp

# 查看已开放端口
sudo firewall-cmd --list-ports
```

### 服务管理
```bash
# 允许服务(如http)
sudo firewall-cmd --add-service=http

# 永久允许服务
sudo firewall-cmd --add-service=http --permanent

# 移除服务
sudo firewall-cmd --remove-service=http

# 查看允许的服务
sudo firewall-cmd --list-services
```

### 高级规则
```bash
# 添加富规则(允许来自192.168.1.0/24的SSH访问)
sudo firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept'

# 转发端口(将80端口转发到8080)
sudo firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080
```

### 永久规则应用
```bash
# 重载防火墙(应用永久规则)
sudo firewall-cmd --reload

# 检查配置是否有效
sudo firewall-cmd --check-config
```

### 应急模式
```bash
# 进入应急模式(拒绝所有流量)
sudo firewall-cmd --panic-on

# 退出应急模式
sudo firewall-cmd --panic-off

# 查看应急模式状态
sudo firewall-cmd --query-panic
```
