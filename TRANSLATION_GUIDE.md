# 翻译管理系统使用指南

## 📁 文件结构

```
penny/
├── translations/          # 翻译文件目录
│   ├── en.json           # 英文翻译
│   ├── zh.json           # 中文翻译
│   └── es.json           # 西班牙语翻译
└── js/
    ├── lang-switch.js    # 旧版翻译系统(已弃用)
    └── lang-switch-new.js # 新版翻译系统(从JSON加载)
```

## 🎯 新系统的优势

### ✅ 之前的问题
- 翻译内容硬编码在 JavaScript 文件中
- 修改翻译需要编辑大量代码
- 容易出错,难以维护
- 非技术人员无法轻松编辑

### ✨ 现在的优势
- **集中管理**: 所有翻译在 JSON 文件中
- **结构清晰**: 按功能模块组织(导航、关于、服务等)
- **易于编辑**: 可以用任何文本编辑器或在线工具编辑
- **版本控制**: 便于追踪翻译变更
- **协作友好**: 翻译人员可以独立工作

## 📝 如何修改翻译

### 方法 1: 直接编辑 JSON 文件

1. 打开对应语言的 JSON 文件:
   - `translations/en.json` - 英文
   - `translations/zh.json` - 中文
   - `translations/es.json` - 西班牙语

2. 找到要修改的部分,例如:

```json
{
  "hero": {
    "hero_title": "我们的工作是<br>我们能力的<br>展示。",
    "hero_subtitle": "为新未来做准备"
  }
}
```

3. 修改文本内容

4. 保存文件

5. 刷新网页查看效果

### 方法 2: 使用在线 JSON 编辑器

推荐工具:
- **JSON Editor Online**: https://jsoneditoronline.org/
- **JSON Formatter**: https://jsonformatter.org/

步骤:
1. 复制 JSON 文件内容
2. 粘贴到在线编辑器
3. 编辑内容
4. 复制回文件并保存

### 方法 3: 使用 VS Code

1. 安装 VS Code
2. 安装 "JSON Tools" 扩展
3. 打开 JSON 文件
4. 享受语法高亮和自动补全

## 🔧 如何添加新的翻译内容

### 步骤 1: 在 HTML 中添加 data-i18n 属性

```html
<!-- 添加新的可翻译元素 -->
<h2 data-i18n="new_section_title">New Section Title</h2>
<p data-i18n="new_section_desc">Description here</p>
```

### 步骤 2: 在所有 JSON 文件中添加翻译

**en.json:**
```json
{
  "about": {
    "new_section_title": "New Section Title",
    "new_section_desc": "Description here"
  }
}
```

**zh.json:**
```json
{
  "about": {
    "new_section_title": "新区域标题",
    "new_section_desc": "这里是描述"
  }
}
```

**es.json:**
```json
{
  "about": {
    "new_section_title": "Título de Nueva Sección",
    "new_section_desc": "Descripción aquí"
  }
}
```

## 📋 JSON 文件结构说明

每个 JSON 文件按功能模块组织:

```json
{
  "navigation": {      // 导航菜单
    "home": "首页",
    "about": "关于我们"
  },
  "hero": {           // 首页横幅
    "hero_title": "标题",
    "hero_subtitle": "副标题"
  },
  "services": {       // 服务页面
    "service1_title": "服务1",
    "service1_desc": "描述1"
  },
  "footer": {         // 页脚
    "footer_company": "公司"
  }
}
```

## 🚀 启用新的翻译系统

### 方法 1: 替换文件(推荐)

```bash
# 备份旧文件
mv js/lang-switch.js js/lang-switch-old.js

# 使用新文件
mv js/lang-switch-new.js js/lang-switch.js
```

### 方法 2: 手动更新 HTML

在所有 HTML 文件中,将:
```html
<script src="js/lang-switch.js"></script>
```

改为:
```html
<script src="js/lang-switch-new.js"></script>
```

## ⚠️ 注意事项

1. **JSON 格式**: 确保 JSON 格式正确,可以使用在线验证工具
2. **特殊字符**: HTML 标签(如 `<br>`)可以直接使用
3. **引号**: 文本中的引号需要转义: `\"`
4. **同步更新**: 修改一个语言时,记得更新其他语言
5. **测试**: 修改后在浏览器中测试所有语言

## 🛠️ 常见问题

### Q: 修改后没有生效?
A: 清除浏览器缓存或强制刷新 (Ctrl+F5 / Cmd+Shift+R)

### Q: JSON 文件报错?
A: 使用 https://jsonlint.com/ 验证 JSON 格式

### Q: 如何批量翻译?
A: 可以使用 Google Sheets + 脚本,或者翻译管理工具如 Lokalise

### Q: 可以添加更多语言吗?
A: 可以!创建新的 JSON 文件(如 `fr.json`)并在 `lang-switch-new.js` 中添加语言代码

## 📊 翻译完整性检查

使用以下命令检查所有语言是否有相同的键:

```bash
# 比较键的数量
cat translations/en.json | grep -o '\"[^\"]*\":' | wc -l
cat translations/zh.json | grep -o '\"[^\"]*\":' | wc -l
cat translations/es.json | grep -o '\"[^\"]*\":' | wc -l
```

## 💡 最佳实践

1. **命名规范**: 使用描述性的键名,如 `hero_title` 而不是 `h1`
2. **分组组织**: 按页面或功能分组
3. **版本控制**: 使用 Git 追踪翻译变更
4. **文档记录**: 为复杂翻译添加注释
5. **定期审查**: 定期检查翻译质量和一致性

## 🎨 翻译编辑器(可选)

我已经为您准备了一个简单的网页翻译编辑器,可以:
- 可视化编辑所有翻译
- 并排比较三种语言
- 导出为 JSON 文件
- 检查缺失的翻译

要使用编辑器,打开 `translation-editor.html` 即可。

---

**需要帮助?** 如有任何问题,请随时询问!
