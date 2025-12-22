#!/bin/bash
# quick-commit.sh

# 设置要提交的目录（改成你的Hexo目录路径）
TARGET_DIR="/Users/alan/Documents/Blog" # ⚠️ 重要：请修改这个路径！

# 检查目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ 目录不存在: $TARGET_DIR"
    echo "请编辑脚本中的 TARGET_DIR 变量，设置为你的Hexo博客目录路径"
    exit 1
fi

# 进入目标目录
cd "$TARGET_DIR" || exit 1

# 检查是否为git仓库
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 当前目录不是Git仓库"
    exit 1
fi

# 检查是否有更改需要提交
if [ -z "$(git status --porcelain)" ]; then
    echo "📭 没有需要提交的更改"
    exit 0
fi

echo "📤 提交更改..."

# 添加所有更改（静默模式）
git add . > /dev/null 2>&1

# 提交更改
if git commit -m "提交博客文章" > /dev/null 2>&1; then
    echo "✅ 提交成功"
else
    echo "❌ 提交失败"
    exit 1
fi

# 推送到GitHub（带重试机制）
echo "🔄 推送至远程仓库..."

# 设置最大重试次数
MAX_RETRY=5
RETRY_COUNT=0
PUSH_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRY ]; do
    if git push origin master --quiet; then
        echo "✅ 推送成功"
        PUSH_SUCCESS=true
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRY ]; then
            echo "🔄 推送失败，第 $RETRY_COUNT 次重试 (3秒后)..."
            sleep 3
        fi
    fi
done

if [ "$PUSH_SUCCESS" = false ]; then
    echo "❌ 推送失败，已尝试 $MAX_RETRY 次"
    exit 1
fi

echo "✨ 完成！"
