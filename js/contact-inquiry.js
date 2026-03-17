/**
 * 联系表单询盘跳转：拦截提交并生成 mailto 链接
 */
(function () {
    'use strict';

    function buildMailtoUrl(recipient, subject, body) {
        return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function handleInquirySubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        const inquiryEmail = form.getAttribute('data-inquiry-email') || 'penny.liao@yametissue.com';
        const subject = `Website Inquiry - ${name || 'Visitor'}`;
        const bodyLines = [
            'Hello Yame Team,',
            '',
            'I would like to request a quote/inquiry with the details below:',
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            'Message:',
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

        form.addEventListener('submit', handleInquirySubmit);
    });
})();
