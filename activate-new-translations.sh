#!/bin/bash

# 翻译系统切换脚本
# Translation System Activation Script

echo "🌍 启用新的 JSON 翻译系统..."
echo "🌍 Activating new JSON-based translation system..."
echo ""

# 备份旧文件
echo "📦 备份旧文件 Backing up old files..."
if [ -f "js/lang-switch.js" ]; then
    cp js/lang-switch.js js/lang-switch-old-backup.js
    echo "✓ 已备份: js/lang-switch-old-backup.js"
fi

# 替换为新文件
echo ""
echo "🔄 替换翻译系统 Replacing translation system..."
if [ -f "js/lang-switch-new.js" ]; then
    cp js/lang-switch-new.js js/lang-switch.js
    echo "✓ 已启用新的翻译系统!"
    echo "✓ New translation system activated!"
else
    echo "❌ 错误: 找不到 js/lang-switch-new.js"
    echo "❌ Error: js/lang-switch-new.js not found"
    exit 1
fi

# 验证 JSON 文件
echo ""
echo "🔍 验证翻译文件 Validating translation files..."
for lang in en zh es; do
    if [ -f "translations/$lang.json" ]; then
        echo "✓ translations/$lang.json 存在"
    else
        echo "❌ 警告: translations/$lang.json 不存在"
    fi
done

echo ""
echo "✅ 完成! Done!"
echo ""
echo "📝 下一步 Next steps:"
echo "1. 在浏览器中打开网站测试 Open website in browser to test"
echo "2. 打开 translation-editor.html 编辑翻译 Open translation-editor.html to edit translations"
echo "3. 阅读 TRANSLATION_GUIDE.md 了解更多 Read TRANSLATION_GUIDE.md for more info"
echo ""
echo "💡 提示: 如需恢复旧系统,运行: cp js/lang-switch-old-backup.js js/lang-switch.js"
echo "💡 Tip: To restore old system, run: cp js/lang-switch-old-backup.js js/lang-switch.js"
