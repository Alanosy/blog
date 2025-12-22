#!/bin/bash
# quick-commit.sh

# 设置要提交的目录（改成你的Hexo目录路径）
TARGET_DIR="/Users/alan/Documents/Blog" # ⚠️ 重要：请修改这个路径！

# 检查目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "错误：目录不存在: $TARGET_DIR"
    echo "请编辑脚本中的 TARGET_DIR 变量，设置为你的Hexo博客目录路径"
    exit 1
fi

# 进入目标目录
cd "$TARGET_DIR" || exit 1

echo "正在提交博客文章到 GitHub..."

# 添加所有更改
git add .

# 提交更改，消息固定为"提交博客文章"
git commit -m "提交博客文章"

# 推送到GitHub的master分支
git push origin master

echo "✅ 已完成！"
