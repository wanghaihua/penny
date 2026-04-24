## 前端文档
`frontend/architecture.md` - 站点页面结构、脚本分层、多语言机制、外部依赖与维护约束；修改任何前端页面、样式、脚本或翻译前必读
`frontend/ui-design.md` - 全站视觉基调、配色、卡片与语言切换设计约束；调整界面表现或主题时必读

## 当前任务文档
- （暂无）

## 任务归档
`workflow/done/260408-govern-static-site-governance.md` - 补齐静态站点治理约束、文档索引与本地验证要求
`workflow/done/260408-refine-business-theme-and-card-layout.md` - 微调商务主题视觉与卡片布局统一性
`workflow/done/260408-refine-theme-i18n-and-layout.md` - 优化主题细节、多语言内容与页面布局
`workflow/done/260408-refresh-visual-theme.md` - 首轮刷新站点视觉主题与品牌基调
`workflow/done/260409-elevate-brand-visual-texture.md` - 增强品牌质感层、标签体系与轻量动画表达
`workflow/done/260409-optimize-header-responsiveness.md` - 修正共享头部在平板与移动端的响应式表现
`workflow/done/260409-optimize-home-layout-and-responsive.md` - 优化首页布局结构与响应式体验
`workflow/done/260409-redesign-language-switcher.md` - 重构语言切换器为三语言常驻分段按钮
`workflow/done/260410-optimize-first-paint-layout.md` - 提升共享布局与多语言文案的首屏可见速度
`workflow/done/260410-audit-performance-and-brand-experience.md` - 全站性能、加载链路、视觉质感与动效方向诊断
`workflow/done/260410-implement-performance-and-brand-refresh.md` - 落地全站资源精简、原生交互替换与品牌视觉升级
`workflow/done/260424-modernize-content-expression.md` - 内容表达现代化改造：首页、关于页、服务页、产品页与联系询盘体验升级

## 全局重要记忆
- 本项目是纯静态站点，无构建流程、无包管理、无自动化测试框架，直接通过 HTML/CSS/JS 与 JSON 翻译文件运行。
- 主业务页面是 `index.html`、`about.html`、`service.html`、`project.html`、`contact.html`；`pricing.html` 仅作为遗留链接的跳转页，不承载正式业务内容。
- 多语言系统以 `translations/*.json` 为主数据源，`js/embedded-translations.js` 为 `file://` 场景下的兜底数据，两者需要保持键和值同步。
- 主业务页面的页头、页脚、回到顶部与 WhatsApp 入口已统一由 `js/site-layout.js` 注入，新增正式页面时应优先复用该共享布局。
- 全站主题增强样式已拆分到 `css/theme-refresh.css`，并由 `frontend/ui-design.md` 约束为明亮、纯色、无渐变的专业可持续风格；后续视觉升级优先在这两个文档范围内迭代。
- 正式业务页面当前只保留 Bootstrap 栅格 + Themify 图标 + 原生 JS 交互，不再依赖 Font Awesome、jQuery、Slick、Magnific Popup、Counterup 与 Google Maps JS SDK。
- 多卡片信息区优先使用 `equal-card-grid` 与列数修饰类统一控制等高和间距；客户评价区当前使用单卡原生轮播而非并排双卡。
- 去插件化交互与品牌化结构样式当前统一收口在 `js/script.js` 与 `css/site-experience.css`；后续新增共享交互和目录卡、灯箱、轮播类样式优先在这两个文件内演进。
- 首页 `Who We Are` 区块已经改为真实双栏图文布局，后续不要再回到背景图 + 偏移卡片的方式，以免不同分辨率下错位。
- 语言切换器已重构为三语言常驻分段按钮，位于共享头部，不再使用下拉菜单。
- 联系转化目前依赖 `mailto:` 与 WhatsApp 跳转，不存在后端表单提交能力。
