/**
 * 品牌动效：为重点模块添加轻量入场动画，提升质感且保持性能稳定。
 */
(function () {
    'use strict';

    const REVEAL_SELECTORS = [
        '.section-title',
        '.trust-item',
        '.intro-item',
        '.service-item',
        '.process-card',
        '.about-item',
        '.about-visual',
        '.about-info-item',
        '.testimonial-panel',
        '.portflio-item',
        '.spec-table-wrap',
        '.spec-inquiry-box',
        '.contact__form',
        '.contact-content',
        '.google-map #map',
        '.cta-item',
        '.cta-block-2',
        '.footer .widget'
    ];

    function uniqueElements() {
        const elements = [];
        const seen = new Set();

        REVEAL_SELECTORS.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                if (!seen.has(element)) {
                    seen.add(element);
                    elements.push(element);
                }
            });
        });

        return elements;
    }

    function initBrandMotion() {
        const body = document.body;
        if (!body) {
            return;
        }

        body.classList.add('js-motion-ready');

        const elements = uniqueElements();
        elements.forEach(function (element, index) {
            element.classList.add('reveal-on-scroll');
            element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
        });

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (element) {
                element.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -8% 0px'
        });

        elements.forEach(function (element) {
            observer.observe(element);
        });
    }

    document.addEventListener('DOMContentLoaded', initBrandMotion);
})();
