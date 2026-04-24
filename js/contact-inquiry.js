/**
 * 联系表单询盘跳转：拦截提交并生成 mailto 链接
 */
(function () {
    'use strict';

    function buildMailtoUrl(recipient, subject, body) {
        return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function getFieldValue(formData, key) {
        return String(formData.get(key) || '').trim();
    }

    function applyProductFromQuery(form) {
        const productSelect = form.querySelector('[data-inquiry-product]');
        if (!productSelect || typeof URLSearchParams !== 'function') {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const product = params.get('product');
        if (!product) {
            return;
        }

        const option = Array.from(productSelect.options).find(function (item) {
            return item.value.toLowerCase() === product.toLowerCase();
        });

        if (option) {
            productSelect.value = option.value;
        }
    }

    function handleInquirySubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const name = getFieldValue(formData, 'name');
        const email = getFieldValue(formData, 'email');
        const product = getFieldValue(formData, 'product');
        const market = getFieldValue(formData, 'market');
        const volume = getFieldValue(formData, 'volume');
        const packaging = getFieldValue(formData, 'packaging');
        const message = getFieldValue(formData, 'message');

        const inquiryEmail = form.getAttribute('data-inquiry-email') || 'penny.liao@yametissue.com';
        const subjectParts = ['Website Inquiry'];
        if (product) {
            subjectParts.push(product);
        }
        if (market) {
            subjectParts.push(market);
        }
        const subject = subjectParts.join(' - ');
        const bodyLines = [
            'Hello Yame Team,',
            '',
            'I would like to request a quotation with the details below:',
            `Name: ${name}`,
            `Email: ${email}`,
            `Product Type: ${product || 'Not specified'}`,
            `Target Market: ${market || 'Not specified'}`,
            `Monthly Volume: ${volume || 'Not specified'}`,
            `Packaging / OEM Requirements: ${packaging || 'Not specified'}`,
            '',
            'Additional Requirements:',
            message,
            '',
            'Best regards'
        ];

        window.location.href = buildMailtoUrl(inquiryEmail, subject, bodyLines.join('\n'));
    }

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contact-form');
        if (!form) {
            return;
        }

        applyProductFromQuery(form);
        form.addEventListener('submit', handleInquirySubmit);
    });
})();
