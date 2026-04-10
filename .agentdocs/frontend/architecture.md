# 前端架构

## 项目定位
- 本项目是面向纸品外贸客户的企业展示站，目标是完成品牌展示、产品介绍和询盘转化。
- 部署形态为纯静态站点，仓库根目录直接存放页面文件，结合 `CNAME` 可判断当前面向自定义域名部署。

## 页面结构
- `index.html`：首页，承担品牌定位、核心优势、产品能力、合作流程与 CTA 转化。
- `about.html`：公司介绍页，包含公司简介、团队展示、客户评价等内容。
- `service.html`：服务页，承载 OEM、包装审核、质检与出口协同能力说明。
- `project.html`：产品页，包含产品分类、规格表与询盘入口。
- `contact.html`：联系页，包含联系信息、询盘表单与地图。
- `pricing.html`：遗留链接跳转页，使用 `noindex` 且立即跳转到联系页，不作为正式业务页面维护。
- `test-translation.html`：翻译功能测试页，仅用于本地验证。
- `translation-editor.html`：独立翻译编辑工具，不属于正式官网页面。

## 资源组织
- `css/style.css`：站点主样式，基于 Themefisher 模板改造。
- `css/theme-refresh.css`：当前品牌主题增强样式，负责正式业务页面的主题色、卡片体系、页头页脚和主要商业展示区块。
- `css/brand-enhancements.css`：品牌质感增强样式，负责绿色装饰元素、品牌 logo 细节、标签体系与轻量动画视觉层。
- `css/lang-switcher.css`：语言切换器与悬浮 WhatsApp 按钮等补充样式。
- `js/script.js`：模板通用交互脚本，负责轮播、弹窗、计数器、返回顶部等。
- `js/brand-motion.js`：品牌动效脚本，负责正式页面重点模块的滚动显现动画。
- `js/site-layout.js`：共享布局脚本，负责注入正式页面统一页头、页脚、回到顶部和 WhatsApp 悬浮入口。
- `js/lang-switch.js`：当前启用的多语言切换脚本。
- `js/lang-switch-new.js`：多语言脚本候选版本，与当前版本高度接近，属历史过渡文件。
- `js/lang-switch-old-backup.js`：旧版多语言脚本备份，已不应继续使用。
- `js/embedded-translations.js`：嵌入式翻译兜底数据，用于直接双击 HTML 的 `file://` 场景。
- `js/contact-inquiry.js`：联系表单逻辑，拦截提交并拼装 `mailto:`。
- `translations/*.json`：多语言主数据源，当前包含 `en`、`zh`、`es` 三种语言。

## 多语言机制
- 页面文本主要通过 `data-i18n` 属性绑定翻译键。
- `js/lang-switch.js` 在 HTTP 场景下拉取 `translations/*.json`，在 `file://` 场景下回退到 `js/embedded-translations.js`。
- 翻译数据按 section 分组存储，但运行时会拍平成单层键值对象使用。
- 语言切换时会同步更新 `document.documentElement.lang`，因此正式页面默认应保持 `<html lang="en">` 并交给脚本接管。
- 修改翻译时必须同时检查 JSON 与嵌入式兜底数据是否一致，避免本地预览与线上表现不一致。

## 外部依赖
- 样式与布局依赖 Bootstrap、Themify、Font Awesome、Magnific Popup、Slick。
- 页面交互依赖 jQuery 生态插件。
- 联系页地图依赖 Google Maps 脚本与 `plugins/google-map/map.js`。

## 维护约束
- 修改正式业务页面时，优先围绕 `index.html`、`about.html`、`service.html`、`project.html`、`contact.html` 展开。
- `pricing.html` 不承载正式业务内容；如未来恢复该页面，需先明确是否需要重新进入导航、翻译体系与 SEO 范围。
- 修改导航、页脚、联系方式或语言切换器时，应优先更新 `js/site-layout.js`，再检查所有正式页面是否仍正确挂载共享布局。
- 正式页面当前在 `<head>` 中预加载 `js/embedded-translations.js` 和 `js/site-layout.js`，并在 `data-site-header` / `data-site-footer` 挂载点后立刻调用渲染方法，以便页眉页脚在解析阶段同步出现；新增正式页面时应保持这一模式。
- 共享布局自动渲染必须避免覆盖已完成首屏注入的挂载点，否则会把语言切换等已绑定交互一起替换掉；如确需重绘，应同步考虑事件绑定策略。
- 主题与配色调整应优先修改 `css/theme-refresh.css`；仅在涉及基础变量或模板原生规则时再回到 `css/style.css`，并同步遵循 `frontend/ui-design.md`。
- 当前品牌视觉方向为“专业、可持续、商业化”：整体保持明亮、纯色、无渐变，主色为森林绿/鼠尾草绿，大面积底色为纸张米白，强调色仅小面积用于重点信息与转化按钮。
- 品牌质感增强层统一放在 `css/brand-enhancements.css` 和 `js/brand-motion.js` 中；后续如继续添加装饰元素、品牌标签或滚动动效，应优先在这两个文件内演进。
- 多卡片区块优先复用 `equal-card-grid` 网格工具类，并根据列数使用 `grid-3`、`grid-4` 等修饰类，避免继续依赖模板原有的 `mb-*` 间距堆叠。
- 使用 `equal-card-grid` 时必须同时声明列数修饰类；缺少 `grid-*` 修饰会导致只剩等高、不剩列布局。
- `about.html` 的客户评价区使用 `js/script.js` 中的 `.testimonial-wrap` Slick 单卡轮播；后续如调整样式，应保持“一次一张”的展示节奏。
- 首页 `Who We Are` 区块当前使用真实双栏图片 + 内容卡结构，而不是绝对定位背景图叠加；后续优先保持这种更稳定的响应式布局。
- 品牌标识当前保持原有 `Ya<span>me.</span>` 文字字标，不额外引入独立图形 logo；如未来需要品牌图形化，需先单独确认后再改共享布局。
- 语言切换器当前使用 `js/site-layout.js` 注入的三语言常驻分段按钮，不再使用下拉菜单；对应交互只保留激活态、持久化和自动识别，不应重新引入展开/收起逻辑。
- 多语言当前采用“嵌入式翻译优先、远程 JSON 后台刷新”的策略：首屏先使用 `js/embedded-translations.js` 立即出字，随后 `js/lang-switch.js` 再请求 `translations/*.json` 刷新数据。
- 共享头部顶部条当前采用“轻量社交图标 + 电话/邮箱文本链接 + 窄胶囊语言分段按钮”的组合；`md` 及以下分辨率优先允许堆叠为两行，避免继续追求单行硬塞导致错位。
- 修改翻译键时，需要同步更新所有语言 JSON，并验证 `js/embedded-translations.js` 是否仍然一致。
- 联系页当前没有后端接口，任何“表单提交成功”类需求都应先明确是否引入后端或第三方表单服务。

## 本地验证
- `node --check js/script.js`
- `node --check js/lang-switch.js`
- `node --check js/contact-inquiry.js`
- `node -e "['en','zh','es'].forEach(l=>JSON.parse(require('fs').readFileSync('translations/'+l+'.json','utf8')));console.log('json ok')"`
- 使用基于 `en` 的多语言键一致性检查脚本确认 `zh`、`es` 不缺键。
- 手工回归至少覆盖首页首屏与语言切换、产品页规格表与询盘入口、联系页 `mailto:` 提交与移动端布局。
