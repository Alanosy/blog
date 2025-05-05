---
title: Nginx笔记
tags: []
categories: []
excerpt: ''
poster:
  topic: null
  headline: null
  caption: null
  color: null
date: 2025-05-05 16:20:42
updated: 2025-05-05 16:20:42
topic:
banner:
references:
---

# Nginx 笔记整理

## 一、Nginx 简介

Nginx (发音为"engine X") 是一个高性能的HTTP和反向代理服务器，也是一个IMAP/POP3/SMTP代理服务器。主要特点包括：
- 高并发处理能力（单机可支持数万并发连接）
- 低内存消耗
- 高可靠性
- 热部署（无需停止服务即可升级）

## 二、安装与基本命令

### 安装（以Ubuntu为例）
```bash
sudo apt update
sudo apt install nginx
```

### 常用命令
```bash
# 启动
sudo systemctl start nginx

# 停止
sudo systemctl stop nginx

# 重启
sudo systemctl restart nginx

# 重新加载配置（不中断服务）
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx

# 设置开机启动
sudo systemctl enable nginx
```

## 三、配置文件结构

Nginx配置文件通常位于`/etc/nginx/`目录下：
- `nginx.conf`：主配置文件
- `sites-available/`：可用站点配置
- `sites-enabled/`：已启用站点配置（通常是指向sites-available的符号链接）
- `conf.d/`：额外的配置文件目录

### 配置文件基本结构
```nginx
# 全局块：配置影响nginx全局的指令
user www-data;
worker_processes auto;
pid /run/nginx.pid;

# events块：配置影响nginx服务器或与用户的网络连接
events {
    worker_connections 768;
}

# http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能
http {
    # http全局块
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # server块：配置虚拟主机的相关参数
    server {
        # server全局块
        listen 80;
        server_name example.com;
        
        # location块：配置请求的路由，以及各种页面的处理情况
        location / {
            root /var/www/html;
            index index.html index.htm;
        }
    }
}
```

## 四、常用配置示例

### 1. 静态网站服务
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 2. 反向代理配置
```nginx
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. 负载均衡配置
```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    listen 80;
    server_name app.example.com;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### 3.1 负载均衡算法详解

#### 1. 轮询（Round Robin）

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 2. 加权轮询（Weighted Round Robin）

```nginx
upstream backend {
    server backend1.example.com weight=5;
    server backend2.example.com weight=3;
    server backup.example.com weight=1 backup;
}
```

#### 3. 最少连接（Least Connections）

```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 4. IP哈希（IP Hash）

```nginx
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 5. 通用哈希（Generic Hash）

```nginx
upstream backend {
    hash $request_uri consistent;
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 6. 随机算法（Random）

```nginx
upstream backend {
    random;
    server backend1.example.com;
    server backend2.example.com;
}
```

#### 7. 响应时间优先（需要安装第三方模块）

```nginx
upstream backend {
    fair;
    server backend1.example.com;
    server backend2.example.com;
}
```

### 

### 4. HTTPS配置

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /var/www/example.com;
    index index.html;
}
```

## 五、性能优化配置

### 1. 工作进程与连接数
```nginx
worker_processes auto; # 通常设置为CPU核心数
events {
    worker_connections 1024; # 每个worker进程的最大连接数
    multi_accept on; # 同时接受多个新连接
}
```

### 2. 缓冲与超时设置
```nginx
client_body_buffer_size 10K;
client_header_buffer_size 1k;
client_max_body_size 8m;
large_client_header_buffers 4 4k;

keepalive_timeout 65;
client_header_timeout 10;
client_body_timeout 10;
send_timeout 10;
```

### 3. Gzip压缩
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_vary on;
```

## 六、日志配置

### 访问日志
```nginx
http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
}
```

### 错误日志
```nginx
error_log /var/log/nginx/error.log warn; # warn级别及以上会记录
```

## 七、安全配置

### 1. 隐藏Nginx版本号
```nginx
server_tokens off;
```

### 2. 防止点击劫持
```nginx
add_header X-Frame-Options "SAMEORIGIN";
```

### 3. XSS保护
```nginx
add_header X-XSS-Protection "1; mode=block";
```

### 4. 内容安全策略
```nginx
add_header Content-Security-Policy "default-src 'self'";
```

## 八、常见问题排查

1. **检查配置语法**
   ```bash
   sudo nginx -t
   ```

2. **查看错误日志**
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **查看访问日志**
   ```bash
   tail -f /var/log/nginx/access.log
   ```

4. **检查端口监听**
   ```bash
   sudo netstat -tulnp | grep nginx
   ```

5. **检查进程状态**
   ```bash
   ps aux | grep nginx
   ```

## 九、常用模块

1. **ngx_http_rewrite_module**：URL重写
2. **ngx_http_proxy_module**：反向代理
3. **ngx_http_fastcgi_module**：FastCGI支持
4. **ngx_http_ssl_module**：HTTPS支持
5. **ngx_http_gzip_module**：Gzip压缩
6. **ngx_http_headers_module**：HTTP头控制
7. **ngx_http_auth_basic_module**：基本认证

