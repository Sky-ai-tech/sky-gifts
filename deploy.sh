#!/bin/bash
# 一键部署到 sky-gifts.com
# 复制下面整个，在 Mac 终端里粘贴回车即可

# 提醒用户先检查镜像名称
echo "🚀 Deploying to sky-gifts.com..."
echo ""
echo "请确认你的 GitHub token（以 ghp_ 开头）"
echo "然后打开 https://github.com/sky-ai-tech/sky-gifts 确认仓库存在"
echo ""
echo "复制下面的命令并在终端执行："
echo "========================================"
cat << 'SCRIPT'
cd /Users/wenqifei/.openclaw/workspace/qifei-gifts
git add -A
git commit -m "Update: carousel + remove Custom Dev + footer fix" 2>/dev/null || true

# 先移除旧的 remote
git remote remove origin 2>/dev/null

# 重新添加 remote（需要输入 token）
echo "请输入你的 GitHub token (ghp_...): "
read -s GH_TOKEN
git remote add origin https://sky-ai-tech:$GH_TOKEN@github.com/sky-ai-tech/sky-gifts.git
GIT_TERMINAL_PROMPT=0 git push -u origin main --force 2>&1

echo ""
if [ $? -eq 0 ]; then
    echo "✅ 成功发布到 https://sky-gifts.com"
    echo "等待 1-2 分钟刷新即可看到更新"
else
    echo "❌ 推送失败，请检查 token 是否正确"
fi
SCRIPT
echo "========================================"