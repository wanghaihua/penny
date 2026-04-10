// Translation system with embedded fallback for file:// browsing
let translations = {};
const SUPPORTED_LANGS = ['en', 'zh', 'es'];
let languageMenuBound = false;

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
    if (languageMenuBound) {
        return;
    }

    document.addEventListener('click', function (e) {
        const langButton = e.target.closest('.header-top-lang .lang-option');
        if (!langButton) {
            return;
        }

        e.preventDefault();
        const targetLang = langButton.getAttribute('data-lang');
        if (!targetLang) {
            return;
        }

        switchLang(targetLang);
    });

    languageMenuBound = true;
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
    const embeddedLoaded = loadFromEmbeddedTranslations();

    if (embeddedLoaded) {
        switchLang(resolveInitialLanguage());
    }

    // If user opens file directly, embedded translations are the primary source.
    if (window.location.protocol === 'file:') {
        if (!embeddedLoaded) {
            console.error('Embedded translations are missing.');
        }
        return;
    }

    try {
        const responses = await Promise.all(
            SUPPORTED_LANGS.map(lang => fetch(`translations/${lang}.json`))
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
        if (!embeddedLoaded) {
            console.error('Both remote and embedded translations failed.');
            return;
        }
        console.warn('Failed to refresh translation JSON, keep using embedded data.', error);
    }
}

function initializeLanguageSystem() {
    setupLanguageMenu();
    loadTranslations();
}

if (document.body) {
    initializeLanguageSystem();
} else {
    document.addEventListener('DOMContentLoaded', initializeLanguageSystem, { once: true });
}
