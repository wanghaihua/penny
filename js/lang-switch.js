// Translation system with embedded fallback for file:// browsing
let translations = {};
const SUPPORTED_LANGS = ['en', 'zh', 'es'];
const LANG_LABELS = {
    en: { short: 'EN', name: 'English' },
    zh: { short: '中文', name: '简体中文' },
    es: { short: 'ES', name: 'Español' }
};

function flattenTranslationSections(data) {
    const flat = {};
    for (const section in data) {
        for (const key in data[section]) {
            flat[key] = data[section][key];
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
    const savedLang = localStorage.getItem('site-lang');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }

    const browserLang = detectBrowserLanguage();
    if (translations[browserLang]) {
        return browserLang;
    }

    return 'en';
}

function setupLanguageMenu() {
    const langItems = document.querySelectorAll('.header-top-lang .dropdown-item');
    langItems.forEach(item => {
        const inlineOnclick = item.getAttribute('onclick');
        if (inlineOnclick) {
            item.removeAttribute('onclick');
        }

        let langCode = item.getAttribute('data-lang');
        if (!langCode && inlineOnclick) {
            const match = inlineOnclick.match(/switchLang\('([a-z]+)'\)/);
            if (match) {
                langCode = match[1];
                item.setAttribute('data-lang', langCode);
            }
        }

        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetLang = this.getAttribute('data-lang');
            if (!targetLang) {
                return;
            }
            switchLang(targetLang);

            const wrapper = this.closest('.header-top-lang');
            if (!wrapper) {
                return;
            }
            const dropdown = wrapper.querySelector('.dropdown-menu');
            const toggle = wrapper.querySelector('.dropdown-toggle');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function setActiveLanguageItem(lang) {
    document.querySelectorAll('.header-top-lang .dropdown-item').forEach(item => {
        const isActive = item.getAttribute('data-lang') === lang;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
        item.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
}

function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) {
        console.error(`Translations for language "${lang}" not loaded`);
        return;
    }

    // Translate Menu Items & Header
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === 'index.html') {
            link.innerText = t.home;
        } else if (href === 'about.html' && !link.classList.contains('dropdown-toggle')) {
            link.innerText = t.about;
        } else if (link.id === 'dropdown03') {
            link.innerHTML = t.about + ' <i class="fas fa-chevron-down small"></i>';
        } else if (href === 'service.html') {
            link.innerText = t.services;
        } else if (href === 'project.html') {
            link.innerText = t.portfolio;
        } else if (href === 'contact.html') {
            link.innerText = t.contact;
        }
    });

    const quoteBtn = document.querySelector('.btn-solid-border');
    if (quoteBtn && t.get_quote) {
        quoteBtn.innerText = t.get_quote;
    }

    const callUs = document.querySelector('.header-top-info a[href^="tel"]');
    if (callUs && t.call_us) {
        const numberNode = callUs.querySelector('span');
        const number = numberNode ? numberNode.innerText : '';
        callUs.innerHTML = t.call_us + ' : <span>' + number + '</span>';
    }

    // Translate content by data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!Object.prototype.hasOwnProperty.call(t, key)) {
            return;
        }

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t[key];
            return;
        }

        const icon = el.querySelector('i');
        if (icon && el.children.length === 1) {
            el.innerHTML = t[key] + icon.outerHTML;
        } else {
            el.innerHTML = t[key];
        }
    });
}

function switchLang(lang) {
    const normalizedLang = translations[lang] ? lang : 'en';
    localStorage.setItem('site-lang', normalizedLang);
    document.documentElement.lang = normalizedLang;

    const currentLang = LANG_LABELS[normalizedLang] || {
        short: normalizedLang.toUpperCase(),
        name: normalizedLang.toUpperCase()
    };
    const langLabel = document.getElementById('current-lang');
    const langName = document.getElementById('current-lang-name');
    if (langLabel) {
        langLabel.innerText = currentLang.short;
    }
    if (langName) {
        langName.innerText = currentLang.name;
    }

    setActiveLanguageItem(normalizedLang);
    applyTranslations(normalizedLang);
}

function loadFromEmbeddedTranslations() {
    const embedded = window.__EMBEDDED_TRANSLATIONS__ || {};
    SUPPORTED_LANGS.forEach(lang => {
        if (embedded[lang]) {
            translations[lang] = flattenTranslationSections(embedded[lang]);
        }
    });
    return SUPPORTED_LANGS.every(lang => translations[lang]);
}

async function loadTranslations() {
    // If user opens file directly, fetch may fail due browser security policy.
    if (window.location.protocol === 'file:') {
        const loaded = loadFromEmbeddedTranslations();
        if (!loaded) {
            console.error('Embedded translations are missing.');
            return;
        }
        switchLang(resolveInitialLanguage());
        return;
    }

    try {
        const responses = await Promise.all(
            SUPPORTED_LANGS.map(lang => fetch(`translations/${lang}.json`, { cache: 'no-store' }))
        );

        for (let index = 0; index < SUPPORTED_LANGS.length; index += 1) {
            const response = responses[index];
            const lang = SUPPORTED_LANGS[index];
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            const data = await response.json();
            translations[lang] = flattenTranslationSections(data);
        }

        switchLang(resolveInitialLanguage());
    } catch (error) {
        console.warn('Failed to fetch translation JSON, fallback to embedded data.', error);
        const loaded = loadFromEmbeddedTranslations();
        if (!loaded) {
            console.error('Both remote and embedded translations failed.');
            return;
        }
        switchLang(resolveInitialLanguage());
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setupLanguageMenu();
    loadTranslations();

    const langToggle = document.querySelector('.header-top-lang .dropdown-toggle');
    const langDropdown = document.querySelector('.header-top-lang .dropdown-menu');

    if (langToggle && langDropdown) {
        function closeLanguageMenu() {
            langDropdown.classList.remove('show');
            langToggle.setAttribute('aria-expanded', 'false');
        }

        langToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = langDropdown.classList.contains('show');

            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== langDropdown) {
                    menu.classList.remove('show');
                    const menuWrapper = menu.closest('.header-top-lang');
                    const menuToggle = menuWrapper ? menuWrapper.querySelector('.dropdown-toggle') : null;
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            langDropdown.classList.toggle('show', !isOpen);
            langToggle.setAttribute('aria-expanded', String(!isOpen));
        });

        document.addEventListener('click', function (e) {
            if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                closeLanguageMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeLanguageMenu();
            }
        });
    }
});
