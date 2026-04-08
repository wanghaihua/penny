/**
 * 站点共享布局：统一渲染页头、页脚和悬浮入口，降低多页面重复维护成本
 */
(function () {
    'use strict';

    const NAV_ITEMS = [
        { href: 'index.html', key: 'home', page: 'home' },
        { href: 'about.html', key: 'about', page: 'about' },
        { href: 'service.html', key: 'services', page: 'services' },
        { href: 'project.html', key: 'portfolio', page: 'products' },
        { href: 'contact.html', key: 'contact', page: 'contact' }
    ];

    function getCurrentPage() {
        return document.body ? document.body.getAttribute('data-page') || '' : '';
    }

    function buildNavItems(currentPage) {
        return NAV_ITEMS.map(function (item) {
            const isActive = item.page === currentPage ? ' active' : '';
            return (
                `<li class="nav-item${isActive}">` +
                `<a class="nav-link" href="${item.href}" data-i18n="${item.key}"></a>` +
                '</li>'
            );
        }).join('');
    }

    function buildHeader(currentPage) {
        return `
<header class="navigation">
    <div class="header-top">
        <div class="container">
            <div class="row justify-content-between align-items-center">
                <div class="col-lg-2 col-md-4">
                    <div class="header-top-socials text-center text-lg-left text-md-left">
                        <a href="https://www.instagram.com/liaozhiping1018" aria-label="instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.youtube.com/@Pennyliao-z5h" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                        <a href="https://wa.me/85254452984" aria-label="whatsapp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
                <div class="col-lg-10 col-md-8 text-center text-lg-right text-md-right">
                    <div class="header-top-info mb-2 mb-md-0">
                        <a href="tel:+8618678139489">Call Us : <span>+86 18678139489</span></a>
                        <a href="mailto:penny.liao@yametissue.com"><i class="fas fa-envelope mr-2"></i><span>penny.liao@yametissue.com</span></a>
                        <div class="dropdown d-inline-flex header-top-lang">
                            <button type="button" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Language selector">
                                <i class="ti-world" aria-hidden="true"></i>
                                <span class="lang-current">
                                    <span class="lang-current-code" id="current-lang">EN</span>
                                    <span class="lang-current-name" id="current-lang-name">English</span>
                                </span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" role="menu">
                                <a class="dropdown-item" href="#" data-lang="zh" role="menuitem">
                                    <span class="lang-option-main">中文</span>
                                    <span class="lang-option-meta">简体中文</span>
                                </a>
                                <a class="dropdown-item" href="#" data-lang="en" role="menuitem">
                                    <span class="lang-option-main">EN</span>
                                    <span class="lang-option-meta">English</span>
                                </a>
                                <a class="dropdown-item" href="#" data-lang="es" role="menuitem">
                                    <span class="lang-option-main">ES</span>
                                    <span class="lang-option-meta">Español</span>
                                </a>
                            </div>
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
                    <nav class="navbar navbar-expand-lg px-0 py-4">
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
                                ${buildNavItems(currentPage)}
                            </ul>
                            <div class="my-2 my-md-0 ml-lg-4 text-center">
                                <a href="contact.html" class="btn btn-solid-border btn-round-full" data-i18n="get_quote">Get a Quote</a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</header>`;
    }

    function buildFooter() {
        const currentYear = new Date().getFullYear();
        return `
<footer class="footer section">
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_company">Company</h4>
                    <ul class="list-unstyled footer-menu lh-35">
                        <li><a href="about.html" data-i18n="footer_about">About</a></li>
                        <li><a href="service.html" data-i18n="footer_services">Services</a></li>
                        <li><a href="contact.html" data-i18n="footer_contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_products">Core Products</h4>
                    <ul class="list-unstyled footer-menu lh-35">
                        <li><a href="project.html" data-i18n="product_1_name">Bath Tissue</a></li>
                        <li><a href="project.html" data-i18n="product_2_name">Dispenser Napkin</a></li>
                        <li><a href="project.html" data-i18n="product_3_name">Facial Tissue</a></li>
                        <li><a href="project.html" data-i18n="product_4_name">Food Service Wiper</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
                <div class="widget footer-quote-widget">
                    <h4 class="text-capitalize mb-4" data-i18n="footer_quote_support">Quotation Support</h4>
                    <p class="footer-brand-copy" data-i18n="footer_quote_support_desc">Share target market, specifications and monthly volume to receive a practical quotation plan.</p>
                    <div class="footer-cta-links">
                        <a href="project.html" class="btn btn-main btn-small btn-round-full mb-2" data-i18n="hero_btn_secondary">View Products</a>
                        <a href="contact.html" class="btn btn-small btn-outline-light btn-round-full mb-2 ml-lg-2" data-i18n="contact_us">Contact Us</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="widget">
                    <div class="logo mb-4">
                        <h3>Ya<span>me.</span></h3>
                    </div>
                    <p class="footer-brand-copy" data-i18n="footer_brand_desc">Tissue sourcing, OEM packaging and export coordination for global buyers.</p>
                    <ul class="list-unstyled footer-contact-list">
                        <li><i class="ti-location-pin text-color mr-2"></i><span data-i18n="footer_address">B-1306, Fortune Plaza, Zhengyang Road, Zhoucun Dist, Zibo, Shandong, China</span></li>
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

    function renderSharedLayout() {
        const currentPage = getCurrentPage();
        const headerMount = document.querySelector('[data-site-header]');
        const footerMount = document.querySelector('[data-site-footer]');

        if (headerMount) {
            headerMount.innerHTML = buildHeader(currentPage);
        }

        if (footerMount) {
            footerMount.innerHTML = buildFooter();
        }
    }

    document.addEventListener('DOMContentLoaded', renderSharedLayout);
})();
