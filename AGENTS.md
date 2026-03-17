## 本项目本地验证要求

本仓库为纯静态站点（HTML/CSS/JS + JSON 翻译文件），当前无自动化测试框架。

每次提交前至少执行以下检查：

1. JavaScript 语法检查
```bash
node --check js/script.js
node --check js/lang-switch.js
node --check js/contact-inquiry.js
```

2. 翻译 JSON 语法检查
```bash
node -e "['en','zh','es'].forEach(l=>JSON.parse(require('fs').readFileSync('translations/'+l+'.json','utf8')));console.log('json ok')"
```

3. 多语言键一致性检查（en 作为基准）
```bash
node - <<'NODE'
const fs=require('fs');
const langs=['en','zh','es'];
const keys={};
for(const l of langs){
  const data=JSON.parse(fs.readFileSync(`translations/${l}.json`,'utf8'));
  keys[l]=new Set(Object.values(data).flatMap(group=>Object.keys(group)));
}
for(const l of ['zh','es']){
  const missing=[...keys.en].filter(k=>!keys[l].has(k));
  if(missing.length){throw new Error(`${l} missing: ${missing.join(', ')}`);}
}
console.log('i18n keys ok');
NODE
```

4. 手工页面回归检查（至少）
- `index.html`：首屏、语言切换、CTA 链接、移动端布局
- `project.html`：产品卡片、规格表、询盘按钮
- `contact.html`：mailto 询盘提交是否正常唤起邮件客户端
