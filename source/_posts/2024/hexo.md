---
title: Hexo博客的搭建与部署
date: 2023/1/26 12:03:00
tags: [技术分享]
categories: [设计开发, 技术分享]
---
## 一、Hexo简介
Hexo快速、简洁且高效的博客框架，属于静态网站，因为是开源的，所以官网有许多精致的主题供大家选择，这款博客框架可以部署到github和gitee上，非常适合我们计算机从业者记录生活与笔记。下面我们开始搭建把
首先我先概述下我们接下来的流程：
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; **1、安装hexo**
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; 安装git
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; 安装nodejs
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; 安装hexo
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; **2、搭建博客**
&ensp;&ensp; &ensp;&ensp;&ensp;&ensp; **3、部署博客**

提示：在部署博客时我们推荐使用另一个托管平台名叫Vercel，后面我会专门写一章关于此平台的简介

## 二、安装Git

Git是目前比较流行分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理  
**ubantu命令:**

```
apt-get install git -y
```
**Windows下载地址:**

```
https://git-scm.com
```
**Mac在安装Xcode时会自动安装git，或使用breaw命令进行安装**

```
brew install git
```

## 三、安装nodejs

Hexo是基于nodejss所开发的，所以我们需要安装一下nodeJs和里面的npm工具
**ubantu命令:**
```
apt-get install nodejs npm -y
```
**windows和mac可以进入官网直接下载安装包**
如果速度较慢建议采用迅雷下载
```
https://nodejs.org/en/
```
安装完后，输入命令

```
node -v
```
```
npm -v
```
检查是否安装成功

如果接下来的安装hexo速度较慢，建议更换npm源为国内的淘宝源

```
npm config set registry https://registry.npm.taobao.org  
```
## 四、安装hexo



此时我们不区分系统，都是在终端输入命令安装hexo

```
npm install -g hexo-cli
```
输入命令

```
hexo -v
```
查看版本信息


初始化hexo

```
hexo init filename
```
```
cd filename
```
```
npm install
```
filename为博客文件夹的名字，可以进行更改
cd 是切换用户命令，这里我们通过终端进入到博客的文件夹中
hexo init 是初始化我们的博客目录，简单来说，就是从网上拉去我们所需要的文件
npm install #说明：安装依赖包
hexo generate #说明：构建，会在hexo1中创建public文件夹
执行完以上命令后，会多出以下文件和文件夹
例如


新建完成后，指定文件夹目录下有：

_config.yml：站点的配置文件
themes：主题文件夹
source：博客文章存放的文件夹
scaffolds：文章的模板
package.json：安装包的名称
.gitignore：限定在 push 时哪些文件可以忽略
.git：主题和站点都有，标志这是一个 git 项目
node_modules：是安装包的目录，在执行 npm install 的时候会重新生成
public：是 hexo g 生成的静态网页
.deploy_git：同上，hexo g 也会生成
db.json：文件
## 五、本地运行
这里我们的博客就搭建起来了，接下来我们来运行博客

输入命令

```
hexo g
```
这是将原文件生成静态网页

输入命令

```
hexo s
```
这里是运行我们的博客



然后我们在浏览器输入

```
http://localhost:4000
```

就可以看到我们的内容了

如果需要停止
我们需要在终端按ctrl+c键盘

## 六、部署
接下来是我们的部署博客
## 1、vercel部署
首先我们需要进入vercel注册一个账户

```
https://vercel.com/
```
这里我们采用github登陆
所以我们还需要去github注册一个账户
```
https://github.com
```
然后我们需要在GitHub创建一个个人仓库
注册登录github官网，点击右上角加号，点击New repository，新建仓库
这里不要勾选初始化README.md
点击create repository
然后github会提示通过git上传文件夹内容到github仓库
接下来我们需要将hexo的博客目录里的内容，通过git上传到github仓库
然后我们在vercel中点击右边的Add New...
然后点击project去拉去我们的github中的仓库
然后vercel就会自动部署我们的hexo博客了，在外面部署后，vercel会提示我们的访问链接
如果需要通过自己的域名访问，可以在设置中的第二选项里设置

## 2、Hexo+Github

首先我们需要在GitHub创建一个个人仓库

注册登录github官网，点击右上角加号，点击New repository，新建仓库


创建一个和用户名相同的仓库,即http://xxxx.github.io，其中xxx是github的用户名


点击create repository

Git初始化设置

接下来我们要在终端中输入命令

```
git config --global user.name "yourname"   
git config --global user.email "youremail"  
(yourname是github用户名，youremail是注册github的邮箱)  
```
检查是否正确，输入命令
```
git config user.name
git config user.email
```


生成SSH添加到GitHub

输入命令，创建SSH,一路回车

```
ssh-keygen -t rsa -C "youremail"
```

查看SSH KEY，输入命令

```
cat ~/.ssh/id_rsa.pub
```
windows用户请在用户文件夹中寻找，该文件默认隐藏，需打开隐藏文件与文件夹

然后复制id_rsa.pub里面的全部内容


在github的setting中，找到SSH keys的设置选项，点击New SSH key，粘贴id_rsa.pub里面的全部内容


输入命令

```
ssh -T git@github.com
```
查看是否连接成功


打开站点配置文件 _config.yml，修改添加以下内容

```
deploy:
  type: git
  repo: git@github.com:yourgithubname/yourgithubname.github.io.git  
  branch: master
```
安装deploy-git ，也就是部署的命令,这样才能用命令部署到github

```
npm install hexo-deployer-git --save
```
输入命令
```
hexo clean 清除缓存

hexo g = hexo generate 生成静态文件

hexo deploy 部署网站  

hexo clean &&　hexo g -d 　这是上面三句的缩写
```
然后在github的设置中配置GitHub pages就可以通过一下网址访问到我们的网站了

```
http://yourname.github.io
```



关联Git仓库

```
git clone https://github.com/你的用户名/你的用户名.github.io.git  
```
执行之后会在当前目录生成'你的用户名.github.io'的文件夹，这是关联github仓库的文件夹，需要上传的文件都会移动到这里



## 3、Hexo+Gitee

Gitee创建个人仓库

打开码云官网，注册登陆，创建项目，点击右上角加号，新建仓库
开启 Gitee Pages
点击启动
启动后，点击蓝色链接打开网址
初始化Git设置
输入命令
```
git config --global user.name "这里输入你的Gitee注册名"// 按回车  
git config --global user.email "这里输你的Gitee邮箱"  
```
生成SSH密钥文件
```
ssh-keygen -t rsa -C "你的Gitee注册邮箱"  
// 可不输入，三个回车
```
复制粘贴到码云
配置 _config.yml
点击复制克隆/下载里面的https的内容
修改添加_config.yml以下内容
```
url: Gitee Pages 服务，网站地址： https://空间名.gitee.io/仓库名(粘贴)  
root: /仓库名/
wp-block-code
deploy:
  type: git
  repo: https://gitee.com/空间名/仓库名(粘贴)  
  branch: master
```
基础配置可以参考官方文档的配置说明

```
hexo clean &&　hexo g -d 　缩写 清缓存

hexo g = hexo generate 生成静态文件

hexo generate -deploy 生成静态文件后立即部署网站自动上传到gitee  
打开Gitee Pages 服务 ，每次上传或改动，都要点击“更新”打开网址访问  
```
