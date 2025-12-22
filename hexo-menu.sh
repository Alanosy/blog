#!/bin/bash
# hexo-helper.sh - Hexo 命令助手

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# 配置
HEXO_DIR="/Users/alan/Documents/Blog"  # ⚠️ 修改为你的Hexo目录
DEFAULT_PORT="4000"

# 进入Hexo目录
cd "$HEXO_DIR" 2>/dev/null || {
    echo -e "${RED}错误：Hexo目录不存在: $HEXO_DIR${NC}"
    echo "请修改脚本中的 HEXO_DIR 变量"
    exit 1
}

# 显示横幅
show_banner() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║            ${WHITE}🐙 Hexo 博客管理助手 ${CYAN}                  ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# 显示菜单
show_menu() {
    echo -e "${YELLOW}请选择要执行的操作：${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${WHITE}📝 文章相关${NC}"
    echo -e "  ${CYAN}1${NC}. 创建新文章"
    echo -e "  ${CYAN}2${NC}. 创建新草稿"
    echo -e "  ${CYAN}3${NC}. 发布草稿"
    echo -e "  ${CYAN}4${NC}. 列出所有文章"
    echo -e "  ${CYAN}5${NC}. 列出所有草稿"
    
    echo -e "${WHITE}🚀 开发与预览${NC}"
    echo -e "  ${CYAN}6${NC}. 清理并启动本地服务器"
    echo -e "  ${CYAN}7${NC}. 仅启动本地服务器"
    echo -e "  ${CYAN}8${NC}. 在后台启动服务器"
    echo -e "  ${CYAN}9${NC}. 停止本地服务器"
    
    echo -e "${WHITE}⚙️  生成与部署${NC}"
    echo -e "  ${CYAN}10${NC}. 生成静态文件"
    echo -e "  ${CYAN}11${NC}. 清理并生成"
    echo -e "  ${CYAN}12${NC}. 部署到GitHub Pages"
    echo -e "  ${CYAN}13${NC}. 一键清理、生成、部署"
    echo -e "  ${CYAN}14${NC}. 生成并部署（不清理）"
    
    echo -e "${WHITE}📊 统计与维护${NC}"
    echo -e "  ${CYAN}15${NC}. 统计文章数量"
    echo -e "  ${CYAN}16${NC}. 更新Hexo和插件"
    echo -e "  ${CYAN}17${NC}. 清理缓存和临时文件"
    echo -e "  ${CYAN}18${NC}. 检查Hexo版本"
    
    echo -e "${WHITE}🔧 高级功能${NC}"
    echo -e "  ${CYAN}19${NC}. 创建新页面"
    echo -e "  ${CYAN}20${NC}. 生成站点地图"
    echo -e "  ${CYAN}21${NC}. 压缩静态资源"
    echo -e "  ${CYAN}22${NC}. 备份Hexo源文件"
    echo -e "  ${CYAN}23${NC}. 从备份恢复"
    
    echo -e "${WHITE}🔄 Git操作${NC}"
    echo -e "  ${CYAN}24${NC}. 提交并推送更改"
    echo -e "  ${CYAN}25${NC}. 拉取最新更改"
    echo -e "  ${CYAN}26${NC}. 查看Git状态"
    echo -e "  ${CYAN}27${NC}. 查看提交历史"
    
    echo -e "${WHITE}🎯 快速命令${NC}"
    echo -e "  ${CYAN}28${NC}. 写新文章并预览"
    echo -e "  ${CYAN}29${NC}. 快速修复并部署"
    echo -e "  ${CYAN}30${NC}. 每日工作流"
    
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "  ${PURPLE}0${NC}. 退出"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
}

# 执行命令的函数
execute_command() {
    case $1 in
        1)  # 创建新文章
            echo -e "${YELLOW}请输入文章标题：${NC}"
            read -r title
            if [ -n "$title" ]; then
                echo -e "${GREEN}正在创建文章: $title${NC}"
                hexo new post "$title"
            else
                echo -e "${RED}文章标题不能为空${NC}"
            fi
            ;;
            
        2)  # 创建新草稿
            echo -e "${YELLOW}请输入草稿标题：${NC}"
            read -r title
            if [ -n "$title" ]; then
                echo -e "${GREEN}正在创建草稿: $title${NC}"
                hexo new draft "$title"
            else
                echo -e "${RED}草稿标题不能为空${NC}"
            fi
            ;;
            
        3)  # 发布草稿
            echo -e "${YELLOW}请输入要发布的草稿文件名：${NC}"
            echo -e "${CYAN}可用的草稿：${NC}"
            ls source/_drafts/ 2>/dev/null | nl
            read -r draft_num
            draft_file=$(ls source/_drafts/ 2>/dev/null | sed -n "${draft_num}p")
            if [ -n "$draft_file" ]; then
                echo -e "${GREEN}正在发布草稿: $draft_file${NC}"
                hexo publish draft "${draft_file%.*}"
            else
                echo -e "${RED}无效的选择${NC}"
            fi
            ;;
            
        4)  # 列出所有文章
            echo -e "${GREEN}📄 文章列表：${NC}"
            echo -e "${CYAN}════════════════════════════════════════════════${NC}"
            find source/_posts -name "*.md" -type f | sort | nl
            echo -e "${CYAN}════════════════════════════════════════════════${NC}"
            ;;
            
        5)  # 列出所有草稿
            echo -e "${GREEN}📝 草稿列表：${NC}"
            echo -e "${CYAN}════════════════════════════════════════════════${NC}"
            find source/_drafts -name "*.md" -type f 2>/dev/null | sort | nl
            echo -e "${CYAN}════════════════════════════════════════════════${NC}"
            ;;
            
        6)  # 清理并启动本地服务器
            echo -e "${GREEN}🧹 清理缓存...${NC}"
            hexo clean
            echo -e "${GREEN}🚀 启动本地服务器 (端口: $DEFAULT_PORT)...${NC}"
            echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
            hexo server -p $DEFAULT_PORT
            ;;
            
        7)  # 仅启动本地服务器
            echo -e "${GREEN}🚀 启动本地服务器 (端口: $DEFAULT_PORT)...${NC}"
            echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
            hexo server -p $DEFAULT_PORT
            ;;
            
        8)  # 在后台启动服务器
            echo -e "${GREEN}🚀 在后台启动服务器...${NC}"
            hexo server -p $DEFAULT_PORT > /dev/null 2>&1 &
            SERVER_PID=$!
            echo -e "${GREEN}✅ 服务器已启动 (PID: $SERVER_PID)${NC}"
            echo -e "${YELLOW}访问地址: http://localhost:$DEFAULT_PORT${NC}"
            ;;
            
        9)  # 停止本地服务器
            echo -e "${GREEN}🛑 正在停止本地服务器...${NC}"
            pkill -f "hexo server"
            echo -e "${GREEN}✅ 服务器已停止${NC}"
            ;;
            
        10) # 生成静态文件
            echo -e "${GREEN}📦 生成静态文件...${NC}"
            hexo generate
            ;;
            
        11) # 清理并生成
            echo -e "${GREEN}🧹 清理缓存...${NC}"
            hexo clean
            echo -e "${GREEN}📦 生成静态文件...${NC}"
            hexo generate
            ;;
            
        12) # 部署到GitHub Pages
            echo -e "${GREEN}🚀 部署到GitHub Pages...${NC}"
            hexo deploy
            ;;
            
        13) # 一键清理、生成、部署
            echo -e "${GREEN}⚡ 执行一键部署...${NC}"
            echo -e "${CYAN}步骤 1/3: 清理缓存${NC}"
            hexo clean
            echo -e "${CYAN}步骤 2/3: 生成静态文件${NC}"
            hexo generate
            echo -e "${CYAN}步骤 3/3: 部署${NC}"
            hexo deploy
            echo -e "${GREEN}✅ 部署完成！${NC}"
            ;;
            
        14) # 生成并部署（不清理）
            echo -e "${GREEN}⚡ 生成并部署...${NC}"
            hexo generate && hexo deploy
            ;;
            
        15) # 统计文章数量
            posts_count=$(find source/_posts -name "*.md" -type f 2>/dev/null | wc -l)
            drafts_count=$(find source/_drafts -name "*.md" -type f 2>/dev/null | wc -l)
            echo -e "${GREEN}📊 文章统计：${NC}"
            echo -e "${CYAN}════════════════════════════════════${NC}"
            echo -e "已发布文章: ${WHITE}$posts_count${NC} 篇"
            echo -e "草稿文章:   ${WHITE}$drafts_count${NC} 篇"
            echo -e "总计:        ${WHITE}$((posts_count + drafts_count))${NC} 篇"
            echo -e "${CYAN}════════════════════════════════════${NC}"
            ;;
            
        16) # 更新Hexo和插件
            echo -e "${GREEN}🔄 更新Hexo和插件...${NC}"
            echo -e "${CYAN}更新npm包...${NC}"
            npm update
            echo -e "${CYAN}更新Hexo CLI...${NC}"
            npm install -g hexo-cli@latest
            echo -e "${GREEN}✅ 更新完成${NC}"
            ;;
            
        17) # 清理缓存和临时文件
            echo -e "${GREEN}🧹 清理缓存和临时文件...${NC}"
            hexo clean
            rm -rf .cache 2>/dev/null
            rm -rf node_modules/.cache 2>/dev/null
            echo -e "${GREEN}✅ 清理完成${NC}"
            ;;
            
        18) # 检查Hexo版本
            echo -e "${GREEN}ℹ️  Hexo信息：${NC}"
            hexo version
            ;;
            
        19) # 创建新页面
            echo -e "${YELLOW}请输入页面名称：${NC}"
            read -r page_name
            if [ -n "$page_name" ]; then
                echo -e "${GREEN}正在创建页面: $page_name${NC}"
                hexo new page "$page_name"
            else
                echo -e "${RED}页面名称不能为空${NC}"
            fi
            ;;
            
        20) # 生成站点地图
            echo -e "${GREEN}🗺️  生成站点地图...${NC}"
            if [ -f "package.json" ] && grep -q "hexo-generator-sitemap" package.json; then
                hexo generate
                echo -e "${GREEN}✅ 站点地图已生成: public/sitemap.xml${NC}"
            else
                echo -e "${YELLOW}⚠️  需要先安装 hexo-generator-sitemap${NC}"
                echo -e "运行: npm install hexo-generator-sitemap --save"
            fi
            ;;
            
        21) # 压缩静态资源
            echo -e "${GREEN}🗜️  压缩静态资源...${NC}"
            if [ -f "package.json" ] && grep -q "hexo-all-minifier" package.json; then
                hexo generate
                echo -e "${GREEN}✅ 资源压缩完成${NC}"
            else
                echo -e "${YELLOW}⚠️  需要先安装 hexo-all-minifier${NC}"
                echo -e "运行: npm install hexo-all-minifier --save"
            fi
            ;;
            
        22) # 备份Hexo源文件
            echo -e "${GREEN}💾 备份Hexo源文件...${NC}"
            backup_dir="../hexo-backup-$(date +%Y%m%d-%H%M%S)"
            mkdir -p "$backup_dir"
            cp -r source/ _config.yml package.json "$backup_dir"/
            echo -e "${GREEN}✅ 备份完成: $(realpath "$backup_dir")${NC}"
            ;;
            
        23) # 从备份恢复
            echo -e "${YELLOW}请选择备份目录：${NC}"
            backups=($(find .. -maxdepth 1 -type d -name "hexo-backup-*" | sort -r))
            if [ ${#backups[@]} -eq 0 ]; then
                echo -e "${RED}未找到备份文件${NC}"
                return
            fi
            
            select backup in "${backups[@]}"; do
                if [ -n "$backup" ]; then
                    echo -e "${GREEN}正在从备份恢复: $backup${NC}"
                    cp -r "$backup"/source/ source/
                    cp "$backup"/_config.yml .
                    cp "$backup"/package.json .
                    echo -e "${GREEN}✅ 恢复完成${NC}"
                    break
                fi
            done
            ;;
            
        24) # 提交并推送更改
            echo -e "${GREEN}📤 提交并推送更改...${NC}"
            git add .
            git commit -m "更新博客内容 $(date +'%Y-%m-%d %H:%M:%S')"
            
            # 重试机制
            max_retry=5
            retry_count=0
            
            while [ $retry_count -lt $max_retry ]; do
                if git push; then
                    echo -e "${GREEN}✅ 推送成功${NC}"
                    break
                else
                    retry_count=$((retry_count + 1))
                    echo -e "${YELLOW}推送失败，第 $retry_count 次重试...${NC}"
                    sleep 3
                fi
            done
            
            if [ $retry_count -eq $max_retry ]; then
                echo -e "${RED}❌ 推送失败，请手动检查${NC}"
            fi
            ;;
            
        25) # 拉取最新更改
            echo -e "${GREEN}📥 拉取最新更改...${NC}"
            git pull
            ;;
            
        26) # 查看Git状态
            echo -e "${GREEN}📋 Git状态：${NC}"
            git status
            ;;
            
        27) # 查看提交历史
            echo -e "${GREEN}📜 最近提交历史：${NC}"
            git log --oneline -10
            ;;
            
        28) # 写新文章并预览
            echo -e "${YELLOW}请输入文章标题：${NC}"
            read -r title
            if [ -n "$title" ]; then
                echo -e "${GREEN}创建文章并启动预览...${NC}"
                hexo new post "$title"
                echo -e "${YELLOW}文章已创建，是否现在编辑？(y/n)${NC}"
                read -r edit_choice
                if [[ $edit_choice =~ ^[Yy]$ ]]; then
                    vim "source/_posts/$title.md"
                fi
                
                echo -e "${GREEN}启动本地服务器...${NC}"
                hexo server -p $DEFAULT_PORT &
                SERVER_PID=$!
                echo -e "${GREEN}✅ 服务器已启动 (PID: $SERVER_PID)${NC}"
                echo -e "${YELLOW}访问地址: http://localhost:$DEFAULT_PORT${NC}"
                echo -e "${YELLOW}按任意键停止服务器...${NC}"
                read -n 1 -s
                kill $SERVER_PID 2>/dev/null
            fi
            ;;
            
        29) # 快速修复并部署
            echo -e "${GREEN}⚡ 快速修复并部署...${NC}"
            hexo clean
            npm run build 2>/dev/null || hexo generate
            git add .
            git commit -m "快速修复"
            hexo deploy
            echo -e "${GREEN}✅ 完成${NC}"
            ;;
            
        30) # 每日工作流
            echo -e "${GREEN}🔄 执行每日工作流...${NC}"
            echo -e "${CYAN}1. 拉取最新更改${NC}"
            git pull
            echo -e "${CYAN}2. 清理缓存${NC}"
            hexo clean
            echo -e "${CYAN}3. 生成静态文件${NC}"
            hexo generate
            echo -e "${CYAN}4. 本地预览${NC}"
            hexo server -p $DEFAULT_PORT &
            SERVER_PID=$!
            echo -e "${GREEN}✅ 服务器已启动，按任意键继续...${NC}"
            read -n 1 -s
            kill $SERVER_PID 2>/dev/null
            echo -e "${CYAN}5. 部署${NC}"
            hexo deploy
            echo -e "${GREEN}✅ 每日工作流完成${NC}"
            ;;
            
        0)  # 退出
            echo -e "${GREEN}👋 再见！${NC}"
            exit 0
            ;;
            
        *)
            echo -e "${RED}❌ 无效的选择${NC}"
            ;;
    esac
}

# 主循环
while true; do
    show_banner
    show_menu
    
    echo -e "${YELLOW}请输入选项编号 (0-30): ${NC}"
    read -r choice
    
    # 检查输入是否为数字
    if [[ ! "$choice" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}请输入数字${NC}"
        sleep 2
        continue
    fi
    
    # 检查数字范围
    if [ "$choice" -lt 0 ] || [ "$choice" -gt 30 ]; then
        echo -e "${RED}请输入 0-30 之间的数字${NC}"
        sleep 2
        continue
    fi
    
    if [ "$choice" -eq 0 ]; then
        echo -e "${GREEN}👋 再见！${NC}"
        exit 0
    fi
    
    execute_command "$choice"
    
    echo -e "${CYAN}════════════════════════════════════${NC}"
    echo -e "${YELLOW}按任意键返回主菜单...${NC}"
    read -n 1 -s
done
