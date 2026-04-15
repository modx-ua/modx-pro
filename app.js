let translations = {};
let currentLang = localStorage.getItem('lang') || detectBrowserLanguage();

// Load translations from JSON
fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
        setLanguage(currentLang);
    })
    .catch(error => console.error('Error loading translations:', error));

// Detect browser language
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    const supportedLangs = ['en', 'ru', 'uk'];
    
    if (supportedLangs.includes(langCode)) {
        return langCode;
    }
    
    if (langCode === 'ua') {
        return 'uk';
    }
    
    return 'en';
}

const langNames = {
    en: 'EN',
    ru: 'RU',
    uk: 'UK'
};

function setLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    // Update current language display
    document.querySelector('.lang-text').textContent = langNames[lang];
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update meta tags
    document.title = translations[lang].meta_title;
    document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].meta_desc);
    
    // Update all translatable elements
    const htmlKeys = ['about_1', 'about_2', 'about_3', 'about_5', 'about_6'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = translations[lang][key];
        if (value === undefined) return;
        if (htmlKeys.includes(key)) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });
    
    // Close dropdown after selection
    document.querySelector('.lang-switcher').classList.remove('open');
}

function toggleLangDropdown() {
    document.querySelector('.lang-switcher').classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher && !langSwitcher.contains(e.target)) {
        langSwitcher.classList.remove('open');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
});

// Theme Switcher
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});
