// Translation system that loads from JSON files
let translations = {};

// Function to load translations from JSON files
async function loadTranslations() {
    try {
        const languages = ['en', 'zh', 'es'];

        for (const lang of languages) {
            const response = await fetch(`translations/${lang}.json`);
            const data = await response.json();

            // Flatten the nested JSON structure
            translations[lang] = {};
            for (const section in data) {
                for (const key in data[section]) {
                    translations[lang][key] = data[section][key];
                }
            }
        }

        console.log('Translations loaded successfully');

        // Initialize with saved language or default to English
        const savedLang = localStorage.getItem('site-lang') || 'en';
        switchLang(savedLang);

    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function switchLang(lang) {
    console.log("Switching language to: " + lang);

    // Update Toggle Text
    const langLabel = document.getElementById('current-lang');
    if (langLabel) {
        langLabel.innerText = lang.toUpperCase();
    }

    // Save preference
    localStorage.setItem('site-lang', lang);

    const t = translations[lang];

    if (!t) {
        console.error(`Translations for language "${lang}" not loaded`);
        return;
    }

    // Translate Menu Items & Header
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === 'index.html') link.innerText = t.home;
        else if (href === 'about.html' && !link.classList.contains('dropdown-toggle')) link.innerText = t.about;
        else if (link.id === 'dropdown03') link.innerHTML = t.about + ' <i class="fas fa-chevron-down small"></i>';
        else if (href === 'service.html') link.innerText = t.services;
        else if (href === 'project.html') link.innerText = t.portfolio;
        else if (href === 'contact.html') link.innerText = t.contact;
    });

    const quoteBtn = document.querySelector('.btn-solid-border');
    if (quoteBtn) quoteBtn.innerText = t.get_quote;

    const callUs = document.querySelector('.header-top-info a[href^="tel"]');
    if (callUs) {
        const number = callUs.querySelector('span').innerText;
        callUs.innerHTML = t.call_us + ' : <span>' + number + '</span>';
    }

    // Translate Content using data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            // Check if it's an input or textarea element (for placeholder translation)
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                // Check if the element has children that need preservation (like the icon in the button)
                const icon = el.querySelector('i');
                if (icon) {
                    // Special case for button with icon: Text + Icon
                    el.innerHTML = t[key] + icon.outerHTML;
                } else {
                    el.innerHTML = t[key];
                }
            }
        }
    });

    // Translate dropdown menu items
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        const href = item.getAttribute('href');
        const text = item.textContent.trim();

        if (href === 'about.html' && text.includes('company')) {
            item.textContent = t.our_company;
        } else if (href === 'pricing.html') {
            item.textContent = t.pricing;
        }
    });
}

// Load translations when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    loadTranslations();

    // Fix for mobile dropdown - ensure language switcher works on touch devices
    const langToggle = document.querySelector('.header-top-lang .dropdown-toggle');
    const langDropdown = document.querySelector('.header-top-lang .dropdown-menu');

    if (langToggle && langDropdown) {
        // Add touch event support for mobile devices
        langToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle the dropdown
            const isOpen = langDropdown.classList.contains('show');

            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== langDropdown) {
                    menu.classList.remove('show');
                }
            });

            // Toggle this dropdown
            if (isOpen) {
                langDropdown.classList.remove('show');
            } else {
                langDropdown.classList.add('show');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        // Close dropdown after selecting a language
        const langItems = langDropdown.querySelectorAll('.dropdown-item');
        langItems.forEach(item => {
            item.addEventListener('click', function () {
                setTimeout(() => {
                    langDropdown.classList.remove('show');
                }, 100);
            });
        });
    }
});
