// Translation system with embedded fallback for file:// browsing
let translations = {};
const SUPPORTED_LANGS = ['en', 'zh', 'es'];

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
    const langItems = document.querySelectorAll('.header-top-lang .lang-option');
    langItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetLang = this.getAttribute('data-lang');
            if (!targetLang) {
                return;
            }
            switchLang(targetLang);
        });
    });
}

function setActiveLanguageItem(lang) {
    document.querySelectorAll('.header-top-lang .lang-option').forEach(item => {
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
    const navLabelByHref = {
        'index.html': t.home,
        'about.html': t.about,
        'service.html': t.services,
        'project.html': t.portfolio,
        'contact.html': t.contact
    };
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (navLabelByHref[href]) {
            link.innerText = navLabelByHref[href];
        }
    });

    const quoteBtn = document.querySelector('.btn-solid-border');
    if (quoteBtn && t.get_quote) {
        quoteBtn.innerText = t.get_quote;
    }

    const callUs = document.querySelector('.header-top-info a[href^="tel"]');
    if (callUs) {
        const numberNode = callUs.querySelector('span');
        const number = numberNode ? numberNode.innerText.trim() : '+86 18678139489';
        const callUsLabel = t.call_us ? `${t.call_us}: ${number}` : number;

        callUs.setAttribute('aria-label', callUsLabel);
        callUs.setAttribute('title', callUsLabel);
        callUs.innerHTML = '<i class="fas fa-phone-alt" aria-hidden="true"></i><span>' + number + '</span>';
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
});
