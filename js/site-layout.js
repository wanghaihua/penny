/**
 * 站点共享布局：统一渲染页头、页脚和悬浮入口，降低多页面重复维护成本
 */
(function (window, document) {
    'use strict';

    const SUPPORTED_LANGS = ['en', 'zh', 'es'];
    const NAV_ITEMS = [
        { href: 'index.html', key: 'home', page: 'home', fallback: 'Home' },
        { href: 'about.html', key: 'about', page: 'about', fallback: 'About Us' },
        { href: 'service.html', key: 'services', page: 'services', fallback: 'Services' },
        { href: 'project.html', key: 'portfolio', page: 'products', fallback: 'Products' },
        { href: 'contact.html', key: 'contact', page: 'contact', fallback: 'Contact' }
    ];
    const layoutTranslationCache = {};

    function flattenTranslationSections(data) {
        const flat = {};
        for (const section in data) {
            if (!Object.prototype.hasOwnProperty.call(data, section)) {
                continue;
            }
            for (const key in data[section]) {
                if (Object.prototype.hasOwnProperty.call(data[section], key)) {
                    flat[key] = data[section][key];
                }
            }
        }
        return flat;
    }

    function normalizeLanguageCode(langCode) {
        if (!langCode || typeof langCode !== 'string') {
            return null;
        }

        const normalized = langCode.toLowerCase();
        if (normalized.startsWith('zh')) {
            return 'zh';
        }
        if (normalized.startsWith('es')) {
            return 'es';
        }
        if (normalized.startsWith('en')) {
            return 'en';
        }

        return null;
    }

    function detectBrowserLanguage() {
        const candidates = [];

        if (Array.isArray(navigator.languages)) {
            candidates.push(...navigator.languages);
        }
        if (navigator.language) {
            candidates.push(navigator.language);
        }
        if (navigator.userLanguage) {
            candidates.push(navigator.userLanguage);
        }

        for (const candidate of candidates) {
            const normalized = normalizeLanguageCode(candidate);
            if (normalized && SUPPORTED_LANGS.includes(normalized)) {
                return normalized;
            }
        }

        return 'en';
    }

    function resolveInitialLanguage() {
        try {
            const savedLang = localStorage.getItem('site-lang');
            if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
                return savedLang;
            }
        } catch (error) {
            // 忽略本地存储不可用的场景，继续回退到浏览器语言。
        }

        return detectBrowserLanguage();
    }

    function getLayoutTranslations(lang) {
        const normalizedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
        if (layoutTranslationCache[normalizedLang]) {
            return layoutTranslationCache[normalizedLang];
        }

        const embedded = window.__EMBEDDED_TRANSLATIONS__ || {};
        const sections = embedded[normalizedLang] || embedded.en || {};
        layoutTranslationCache[normalizedLang] = flattenTranslationSections(sections);
        return layoutTranslationCache[normalizedLang];
    }

    function textOf(translations, key, fallback) {
        return translations && translations[key] ? translations[key] : fallback;
    }

    function getCurrentPage() {
        return document.body ? document.body.getAttribute('data-page') || '' : '';
    }

    function buildNavItems(currentPage, translations) {
        return NAV_ITEMS.map(function (item) {
            const isActive = item.page === currentPage ? ' active' : '';
            const label = textOf(translations, item.key, item.fallback);
            return (
                `<li class="nav-item${isActive}">` +
                `<a class="nav-link" href="${item.href}" data-i18n="${item.key}">${label}</a>` +
                '</li>'
            );
        }).join('');
    }

    function buildHeader(currentPage, lang) {
        const translations = getLayoutTranslations(lang);
        const callUsText = textOf(translations, 'call_us', 'Call Us');
        const quoteText = textOf(translations, 'get_quote', 'Get a Quote');

        return `
<header class="navigation">
    <div class="header-top">
        <div class="container">
            <div class="row justify-content-between align-items-center header-top-row">
                <div class="col-lg-3 col-md-12">
                    <div class="header-top-socials" aria-label="Social media links">
                        <a href="https://www.instagram.com/liaozhiping1018" class="header-top-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i class="fab fa-instagram" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.youtube.com/@Pennyliao-z5h" class="header-top-social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <i class="fab fa-youtube" aria-hidden="true"></i>
                        </a>
                        <a href="https://wa.me/85254452984" class="header-top-social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <i class="fab fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
                <div class="col-lg-9 col-md-12">
                    <div class="header-top-info">
                        <a href="tel:+8618678139489" class="header-top-link header-top-link--phone" aria-label="${callUsText}: +86 18678139489" title="${callUsText}: +86 18678139489">
                            <i class="fas fa-phone-alt" aria-hidden="true"></i>
                            <span>+86 18678139489</span>
                        </a>
                        <a href="mailto:penny.liao@yametissue.com" class="header-top-link header-top-link--mail" aria-label="Email: penny.liao@yametissue.com">
                            <i class="fas fa-envelope" aria-hidden="true"></i>
                            <span>penny.liao@yametissue.com</span>
                        </a>
                        <div class="header-top-lang" role="group" aria-label="Language selector">
                            <button type="button" class="lang-option" data-lang="zh" aria-label="简体中文">中</button>
                            <button type="button" class="lang-option" data-lang="en" aria-label="English">EN</button>
                            <button type="button" class="lang-option" data-lang="es" aria-label="Español">ES</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="navbar">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <nav class="navbar navbar-expand-lg px-0 py-3">
                        <a class="navbar-brand" href="index.html">
                            Ya<span>me.</span>
                        </a>
                        <button class="navbar-toggler collapsed" type="button" data-toggle="collapse"
                            data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span class="fa fa-bars"></span>
                        </button>
                        <div class="collapse navbar-collapse text-center" id="navbarsExample09">
                            <ul class="navbar-nav ml-auto">
                                ${buildNavItems(currentPage, translations)}
                            </ul>
                            <div class="my-2 my-md-0 ml-lg-4 text-center">
                                <a href="contact.html" class="btn btn-solid-border btn-round-full" data-i18n="get_quote">${quoteText}</a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</header>`;
    }

    function buildFooter(lang) {
        const translations = getLayoutTranslations(lang);
        const currentYear = new Date().getFullYear();

        return `
<footer class="footer section">
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_company">${textOf(translations, 'footer_company', 'Company')}</h4>
                    <ul class="list-unstyled footer-menu lh-35">
                        <li><a href="about.html" data-i18n="footer_about">${textOf(translations, 'footer_about', 'About')}</a></li>
                        <li><a href="service.html" data-i18n="footer_services">${textOf(translations, 'footer_services', 'Services')}</a></li>
                        <li><a href="contact.html" data-i18n="footer_contact">${textOf(translations, 'footer_contact', 'Contact')}</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_products">${textOf(translations, 'footer_products', 'Core Products')}</h4>
                    <ul class="list-unstyled footer-menu lh-35">
                        <li><a href="project.html" data-i18n="product_1_name">${textOf(translations, 'product_1_name', 'Bath Tissue')}</a></li>
                        <li><a href="project.html" data-i18n="product_2_name">${textOf(translations, 'product_2_name', 'Dispenser Napkin')}</a></li>
                        <li><a href="project.html" data-i18n="product_3_name">${textOf(translations, 'product_3_name', 'Facial Tissue')}</a></li>
                        <li><a href="project.html" data-i18n="product_4_name">${textOf(translations, 'product_4_name', 'Food Service Wiper')}</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget footer-quote-widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_quote_support">${textOf(translations, 'footer_quote_support', 'Quotation Support')}</h4>
                    <p class="footer-brand-copy" data-i18n="footer_quote_support_desc">${textOf(translations, 'footer_quote_support_desc', 'Share target market, specifications and monthly volume to receive a practical quotation plan.')}</p>
                    <div class="footer-cta-links">
                        <a href="project.html" class="btn btn-main btn-small btn-round-full mb-2" data-i18n="hero_btn_secondary">${textOf(translations, 'hero_btn_secondary', 'View Products')}</a>
                        <a href="contact.html" class="btn btn-small btn-outline-light btn-round-full mb-2 ml-lg-2" data-i18n="contact_us">${textOf(translations, 'contact_us', 'Contact Us')}</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="widget">
                    <div class="logo mb-4">
                        <h3>Ya<span>me.</span></h3>
                    </div>
                    <p class="footer-brand-copy" data-i18n="footer_brand_desc">${textOf(translations, 'footer_brand_desc', 'Tissue sourcing, OEM packaging and export coordination for global buyers.')}</p>
                    <ul class="list-unstyled footer-contact-list">
                        <li><i class="ti-location-pin text-color mr-2"></i><span data-i18n="footer_address">${textOf(translations, 'footer_address', 'B-1306, Fortune Plaza, Zhengyang Road, Zhoucun Dist, Zibo, Shandong, China')}</span></li>
                        <li><i class="ti-email text-color mr-2"></i><a href="mailto:penny.liao@yametissue.com">penny.liao@yametissue.com</a></li>
                        <li><i class="ti-mobile text-color mr-2"></i><a href="tel:+8618678139489">+86 18678139489</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-btm pt-4">
            <div class="row">
                <div class="col-lg-6">
                    <div class="copyright">
                        Copyright &copy; ${currentYear}, <a href="https://yamepaper.com/">Yamepaper</a>
                    </div>
                </div>
                <div class="col-lg-6 text-left text-lg-right">
                    <ul class="list-inline footer-socials">
                        <li class="list-inline-item"><a href="https://wa.me/85254452984"><i class="fab fa-whatsapp mr-2"></i>WhatsApp</a></li>
                        <li class="list-inline-item"><a href="https://www.youtube.com/@Pennyliao-z5h"><i class="fab fa-youtube mr-2"></i>YouTube</a></li>
                        <li class="list-inline-item"><a href="https://www.instagram.com/liaozhiping1018"><i class="fab fa-instagram mr-2"></i>Instagram</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>
<div id="scroll-to-top" class="scroll-to-top">
    <span class="icon fa fa-angle-up"></span>
</div>
<a href="https://wa.me/85254452984" class="whatsapp-chat" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
</a>`;
    }

    function renderHeaderMount(lang) {
        const currentPage = getCurrentPage();
        const headerMount = document.querySelector('[data-site-header]');
        const targetLang = SUPPORTED_LANGS.includes(lang) ? lang : resolveInitialLanguage();

        if (headerMount) {
            if (headerMount.getAttribute('data-layout-rendered') === 'true' && headerMount.children.length > 0) {
                return false;
            }
            document.documentElement.lang = targetLang;
            headerMount.innerHTML = buildHeader(currentPage, targetLang);
            headerMount.setAttribute('data-layout-rendered', 'true');
            return true;
        }

        return false;
    }

    function renderFooterMount(lang) {
        const footerMount = document.querySelector('[data-site-footer]');
        const targetLang = SUPPORTED_LANGS.includes(lang) ? lang : resolveInitialLanguage();

        if (footerMount) {
            if (footerMount.getAttribute('data-layout-rendered') === 'true' && footerMount.children.length > 0) {
                return false;
            }
            document.documentElement.lang = targetLang;
            footerMount.innerHTML = buildFooter(targetLang);
            footerMount.setAttribute('data-layout-rendered', 'true');
            return true;
        }

        return false;
    }

    function renderSharedLayout(lang) {
        const targetLang = SUPPORTED_LANGS.includes(lang) ? lang : resolveInitialLanguage();

        document.documentElement.lang = targetLang;
        renderHeaderMount(targetLang);
        renderFooterMount(targetLang);
    }

    window.SiteLayout = {
        buildHeader: buildHeader,
        buildFooter: buildFooter,
        renderHeaderMount: renderHeaderMount,
        renderFooterMount: renderFooterMount,
        renderSharedLayout: renderSharedLayout,
        resolveInitialLanguage: resolveInitialLanguage
    };

    if (document.readyState !== 'loading') {
        renderSharedLayout();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            renderSharedLayout();
        }, { once: true });
    }
})(window, document);
