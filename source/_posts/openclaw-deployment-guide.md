---
title: Windows 环境下部署 OpenClaw 完整指南
date: 2026-03-13 19:53:00
tags:
  - OpenClaw
  - 部署教程
  - AI 助手
  - Windows
categories: 技术教程
description: 本教程详细介绍在 Windows 环境下安装和配置 OpenClaw 的全过程，包括环境准备、安装、配置以及故障排查。
---

# Windows 环境下部署 OpenClaw 完整指南

OpenClaw 是一个强大的 AI 助手框架，本文档将详细指导你如何在 Windows 系统上完成安装和配置。

## 📋 目录

- [准备工作](#准备工作)
- [环境安装](#环境安装)
- [OpenClaw 安装](#openclaw-安装)
- [基础配置](#基础配置)
- [高级配置](#高级配置)
- [故障排查](#故障排查)

---

## 准备工作

### 1. 下载必要软件

#### Node.js 下载地址
[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)

建议选择 LTS 版本（长期支持版），更适合生产环境使用。

#### Git 下载地址
[https://registry.npmmirror.com/binary.html?path=git-for-windows](https://registry.npmmirror.com/binary.html?path=git-for-windows)

国内用户推荐使用 NPM Mirror 提供的镜像源，下载速度更快。

### 2. 设置 PowerShell 执行策略

Windows 默认会阻止脚本执行，需要先修改执行策略：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

**说明**: `RemoteSigned` 允许本地执行的脚本，对于远程下载的脚本需要签名。这是平衡安全性和可用性的最佳选择。

---

## 环境安装

### 1. 安装 Node.js

运行下载好的 Node.js 安装包，一路点击 "Next" 即可完成安装。

安装完成后，验证安装是否成功：

```powershell
node --version
npm --version
```

应该能输出类似：
```
v20.x.x
10.x.x
```

### 2. 配置国内镜像源

为了加速 npm 包的安装，建议切换到国内镜像源：

```powershell
npm config set registry https://registry.npmmirror.com/
```

验证配置：
```powershell
npm config get registry
```

应该输出：
```
https://registry.npmmirror.com/
```

### 3. 安装 Git

运行 Git 安装包，使用默认配置即可。安装完成后验证：

```powershell
git --version
```

---

## OpenClaw 安装

### 标准安装方式

```powershell
npm install -g openclaw@2026.3.2
```

### 跳过编译安装（推荐）

如果遇到编译错误，可以使用以下命令跳过编译步骤：

```powershell
npm install -g openclaw@2026.3.2 --ignore-scripts --no-optional --force
```

**参数说明**:
- `--ignore-scripts`: 跳过安装脚本
- `--no-optional`: 不安装可选依赖
- `--force`: 强制安装

### 验证安装

```powershell
openclaw --version
```

---

## 基础配置

### 1. 生成 SSH 密钥对

首先需要生成 SSH 密钥，用于与服务器通信：

```powershell
ssh-keygen -t rsa -b 4096 -C "你的邮箱@example.com"
```

**注意**: 将 `"你的邮箱@example.com"` 替换为你自己的邮箱地址。

按提示保存密钥（直接回车使用默认位置），并设置 passphrase（可选）。

生成的密钥文件位于：
- 私钥：`~/.ssh/id_rsa`
- 公钥：`~/.ssh/id_rsa.pub`

### 2. 初始化 OpenClaw

运行以下命令进行初始配置：

```powershell
openclaw onboard --install-daemon
```

### 3. 查看访问地址和 Token

安装完成后，获取访问 Dashboard 的地址和 Token：

```powershell
openclaw dashboard --no-open
```

这个命令会输出包含 Token 的访问地址，请妥善保管。

---

## 高级配置

### 1. 启动服务

#### 重启服务
```powershell
openclaw gateway restart
```

#### 以调试模式启动
```powershell
openclaw gateway --port 18789 --verbose
```

**参数说明**:
- `--port`: 指定服务端口（默认为 18789）
- `--verbose`: 启用详细日志输出

### 2. 配置文件位置

编辑 OpenClaw 配置文件：

```powershell
openclaw config
```

或者手动编辑配置文件（通常位于 `~/.openclaw/config.json`）。

### 3. 配置工具权限

在配置文件中添加以下权限设置， granting 所有工具的完全访问权限：

```json
{
  "tools": {
    "profile": "full",
    "allow": [
      "group:all"
    ]
  }
}
```

### 4. 配置 Feishu (飞书) 集成

如果需要集成 Feishu 作为消息通道，需要在 OpenClaw 配置中添加以下权限：

**必需权限**:
- `im:message` - 发送和接收消息
- `im:chat` - 管理聊天会话

在 Feishu 开发者平台申请应用时，确保勾选这些权限。

---

## 系统维护

### 检查与修复

如果遇到问题，可以使用诊断工具：

```powershell
openclaw doctor --fix
```

这个命令会自动检测常见问题并提供修复建议。

### 查看状态

```powershell
openclaw status
```

---

## 故障排查

### 问题 1: 全局安装目录问题

如果遇到安装错误或权限问题，可以尝试切换全局安装目录：

```powershell
# 创建新的全局模块目录
mkdir C:\node-modules

# 设置全局模块路径
npm config set prefix C:\node-modules

# 设置全局缓存路径
npm config set cache C:\node-cache

# 添加到环境变量
$env:Path += ";C:\node-modules\node_modules\bin"
```

**注意**: 修改后需要重新打开 PowerShell 窗口使环境变量生效。

### 问题 2: 编译错误

如果在安装过程中遇到编译相关的错误（如缺少 C++ 编译器等），需要：

1. **安装 Visual Studio**: 
   - 下载 Visual Studio Community（免费）
   - 安装时勾选 "C++桌面开发" 工作负载

2. **安装 Windows Build Tools**:
   ```powershell
   npm install -g windows-build-tools
   ```

### 问题 3: 端口被占用

如果 18789 端口被占用，可以更换其他端口：

```powershell
openclaw gateway --port 18790 --verbose
```

### 问题 4: 服务无法启动

尝试以下步骤：

1. 检查防火墙设置，确保相应端口已开放
2. 查看日志文件获取详细错误信息
3. 使用 `openclaw doctor --fix` 自动修复
4. 重启服务：`openclaw gateway restart`

---

## 常见问题 FAQ

### Q: 为什么安装这么慢？
A: 建议配置国内镜像源，或使用 `--ignore-scripts` 选项跳过编译。

### Q: Dashboard 打不开？
A: 检查服务是否在运行，确认端口正确，查看防火墙设置。

### Q: 如何卸载 OpenClaw？
A: 运行 `npm uninstall -g openclaw` 即可卸载。

### Q: 如何升级 OpenClaw？
A: 运行 `npm install -g openclaw@latest` 升级到最新版本。

---

## 总结

恭喜！你已经完成了 OpenClaw 的安装和基础配置。接下来可以：

1. 访问 Dashboard 开始使用
2. 配置更多的集成和插件
3. 探索 OpenClaw 的高级功能

如有问题，请使用 `openclaw doctor --help` 获取更多帮助。

---

**最后更新**: 2026-03-13  
**适用版本**: OpenClaw 2026.3.2  
**操作系统**: Windows 10/11
