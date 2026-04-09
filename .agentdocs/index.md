## 前端文档
`frontend/architecture.md` - 站点页面结构、脚本分层、多语言机制、外部依赖与维护约束；修改任何前端页面、样式、脚本或翻译前必读
`frontend/ui-design.md` - 全站视觉基调、配色、卡片与语言切换设计约束；调整界面表现或主题时必读

## 当前任务文档
`workflow/260409-elevate-brand-visual-texture.md` - 为正式页面增加绿色品牌元素、标签与轻量动画，提升整体质感

## 全局重要记忆
- 本项目是纯静态站点，无构建流程、无包管理、无自动化测试框架，直接通过 HTML/CSS/JS 与 JSON 翻译文件运行。
- 主业务页面是 `index.html`、`about.html`、`service.html`、`project.html`、`contact.html`；`pricing.html` 仅作为遗留链接的跳转页，不承载正式业务内容。
- 多语言系统以 `translations/*.json` 为主数据源，`js/embedded-translations.js` 为 `file://` 场景下的兜底数据，两者需要保持键和值同步。
- 主业务页面的页头、页脚、回到顶部与 WhatsApp 入口已统一由 `js/site-layout.js` 注入，新增正式页面时应优先复用该共享布局。
- 全站主题增强样式已拆分到 `css/theme-refresh.css`，并由 `frontend/ui-design.md` 约束为明亮、纯色、无渐变的专业可持续风格；后续视觉升级优先在这两个文档范围内迭代。
- 多卡片信息区优先使用 `equal-card-grid` 与列数修饰类统一控制等高和间距；客户评价区当前使用单卡 Slick 轮播而非并排双卡。
- 首页 `Who We Are` 区块已经改为真实双栏图文布局，后续不要再回到背景图 + 偏移卡片的方式，以免不同分辨率下错位。
- 语言切换器已重构为三语言常驻分段按钮，位于共享头部，不再使用下拉菜单。
- 联系转化目前依赖 `mailto:` 与 WhatsApp 跳转，不存在后端表单提交能力。
