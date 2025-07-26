const docHtml = document.documentElement;
const menuButton = document.querySelector('[data-action="toggleMenu"]');
const moduleOptions = document.querySelector('.module-options');
const menus = moduleOptions.querySelectorAll('.menu-options');
const menuLinks = document.querySelectorAll('[data-target-menu]');
const themeLinks = document.querySelectorAll('[data-theme]');
const langLinks = document.querySelectorAll('[data-lang]');
const aspectoTextSpan = document.querySelector('[data-menu-item="aspecto-text"]');
const lenguajeTextSpan = document.querySelector('[data-menu-item="lenguaje-text"]');
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const mainWrapper = document.querySelector('[data-section="mainWrapper"]');
const legalWrapper = document.querySelector('[data-section="legalWrapper"]');
const resourcesWrapper = document.querySelector('[data-section="resourcesWrapper"]');
const notFoundWrapper = document.querySelector('[data-section="404Wrapper"]');

let allTranslations = {};
let previewTimer = null;
let lastActiveLink = null;

function getBaseUrl() {
    return window.basePath || '/';
}

function initHeaderShadow() {
    const scrollContainer = document.querySelector('.general-content-bottom');
    const topContainer = document.querySelector('.general-content-top');

    if (!scrollContainer || !topContainer) {
        return;
    }

    scrollContainer.addEventListener('scroll', () => {
        topContainer.classList.toggle('shadow', scrollContainer.scrollTop > 0);
    });
}

function resetMenus() {
    menus.forEach(menu => {
        menu.classList.add('disabled');
        menu.classList.remove('active');
    });
    const mainMenu = document.querySelector('[data-menu="main"]');
    if (mainMenu) {
        mainMenu.classList.add('active');
        mainMenu.classList.remove('disabled');
    }
}

const cancelPreview = () => {
    if (!previewTimer) return;
    clearTimeout(previewTimer);
    previewTimer = null;
    
    const previewLink = document.querySelector('.preview-active');
    if (previewLink) {
        previewLink.classList.remove('preview-active');
        const spinner = previewLink.querySelector('.spinner-container');
        if (spinner) spinner.remove();
        
        langLinks.forEach(link => link.classList.remove('disabled-interactive'));
        themeLinks.forEach(link => link.classList.remove('disabled-interactive'));
    }

    if (lastActiveLink) {
        lastActiveLink.classList.add('active');
        lastActiveLink = null;
    }
};

const handleEscKey = (event) => {
    if (event.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('module-opening', { detail: { moduleToKeepOpen: null } }));
    }
};

const handleOutsideSettingsClick = (event) => {
    if (moduleOptions.classList.contains('active')) {
        if (event.target === moduleOptions || (!moduleOptions.contains(event.target) && !event.target.closest('[data-action="toggleMenu"]'))) {
            closeAndReset();
        }
    }
};

function closeAndReset() {
    if (!moduleOptions.classList.contains('active')) return;
    cancelPreview();
    const activeMenu = moduleOptions.querySelector('.menu-options.active');
    
    if (!activeMenu && window.innerWidth > 465) {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active');
        return;
    }

    const finishClosing = () => {
        moduleOptions.classList.add('disabled');
        moduleOptions.classList.remove('active', 'closing');
        document.removeEventListener('click', handleOutsideSettingsClick);
        document.removeEventListener('keydown', handleEscKey);
        menus.forEach(menu => {
            menu.classList.remove('active', 'animating-in');
            menu.classList.add('disabled');
            menu.removeAttribute('style');
        });
    };
    
    const panelToAnimate = activeMenu || moduleOptions.querySelector('.menu-options');
    if (window.innerWidth <= 465 && panelToAnimate) {
        moduleOptions.classList.add('closing');
        panelToAnimate.addEventListener('animationend', finishClosing, { once: true });
    } else {
        finishClosing();
    }
}

const preloadAllTranslations = async () => {
    const langCodes = Array.from(langLinks).map(link => link.dataset.lang);
    const baseUrl = getBaseUrl();
    const fetchPromises = langCodes.map(langCode =>
        fetch(`${baseUrl}assets/translations/general/${langCode}.json`)
            .then(response => response.json())
            .catch(error => console.error(error))
    );
    const results = await Promise.all(fetchPromises);
    results.forEach((data, index) => {
        if (data) allTranslations[langCodes[index]] = data;
    });
};

const applyTranslations = (langCode) => {
    const translations = allTranslations[langCode];
    if (!translations || !translations.menu) return;

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations.menu[key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations.menu[key];
            } else {
                element.textContent = translations.menu[key];
            }
        }
    });

    updateAppearanceText(localStorage.getItem('user-theme') || 'system', langCode);
    updateLanguageText(langCode);
};

const updateAppearanceText = (theme, langCode) => {
    const translations = allTranslations[langCode]?.menu || {};
    const themeKeyMap = { 'system': 'sync_with_system', 'dark': 'dark_theme', 'light': 'light_theme' };
    const baseText = translations.appearance_label || 'Appearance: ';
    const themeName = translations[themeKeyMap[theme]] || translations.not_available || 'N/A';
    if(aspectoTextSpan) aspectoTextSpan.textContent = baseText + themeName;
};

const updateLanguageText = (langCode) => {
    const translations = allTranslations[langCode]?.menu || {};
    const langKeyMap = { 'en-US': 'english_us', 'es-MX': 'spanish_mx', 'fr-FR': 'french_fr' };
    const baseText = translations.language_label || 'Language: ';
    const langName = translations[langKeyMap[langCode]] || translations.not_available || 'N/A';
    if(lenguajeTextSpan) lenguajeTextSpan.textContent = baseText + langName;
};

const handleChangeWithPreview = (linkList, clickedLink, applyChangeCallback) => {
    if (clickedLink.classList.contains('active')) return;
    
    cancelPreview();
    lastActiveLink = Array.from(linkList).find(link => link.classList.contains('active'));

    linkList.forEach(link => {
        link.classList.add('disabled-interactive');
        link.classList.remove('active');
    });
    
    clickedLink.classList.add('preview-active');
    const spinnerIcon = document.createElement('div');
    spinnerIcon.className = 'menu-link-icon spinner-container';
    spinnerIcon.innerHTML = '<div class="loader-spinner"></div>';
    clickedLink.appendChild(spinnerIcon);

    previewTimer = setTimeout(() => {
        applyChangeCallback();
        clickedLink.classList.remove('preview-active');
        if(spinnerIcon.parentNode) spinnerIcon.remove();
        linkList.forEach(link => link.classList.remove('disabled-interactive'));
        previewTimer = null;
        lastActiveLink = null;
    }, 1500);
};

const applyThemeChange = (theme) => {
    docHtml.classList.remove('dark-theme', 'light-theme');
    const isDark = theme === 'dark' || (theme === 'system' && systemThemeQuery.matches);
    docHtml.classList.add(isDark ? 'dark-theme' : 'light-theme');
    localStorage.setItem('user-theme', theme);

    themeLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.theme === theme);
    });

    const currentLang = localStorage.getItem('user-language') || 'en-US';
    updateAppearanceText(theme, currentLang);
};

const applyLanguageChange = (langCode) => {
    const translations = allTranslations[langCode];
    if (!translations) return;

    docHtml.lang = langCode;
    localStorage.setItem('user-language', langCode);

    const langDataToStore = { code: langCode, translations: translations };
    localStorage.setItem('user-language-data', JSON.stringify(langDataToStore));

    langLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.lang === langCode);
    });

    applyTranslations(langCode);
};

function showSection(sectionName) {
    [mainWrapper, legalWrapper, resourcesWrapper, notFoundWrapper].forEach(wrapper => {
        if (wrapper) {
            wrapper.classList.add('disabled');
            wrapper.classList.remove('active');
        }
    });

    const allSections = document.querySelectorAll('.section-content[data-section]');
    allSections.forEach(section => {
        section.classList.add('disabled');
        section.classList.remove('active');
    });

    const displayElement = (element) => {
        if (element) {
            element.classList.add('active');
            element.classList.remove('disabled');
        }
    };
    const pageUrlMap = window.pageUrlMap || {};

    if (pageUrlMap.hasOwnProperty(sectionName)) {
        if (['privacy-policy', 'terms-and-conditions', 'cookie-policy', 'send-feedback'].includes(sectionName)) {
            displayElement(legalWrapper);
            displayElement(legalWrapper.querySelector(`[data-section="${sectionName}"]`));
        } else if (['faq', 'guides', 'blog'].includes(sectionName)) {
            displayElement(resourcesWrapper);
            displayElement(resourcesWrapper.querySelector(`[data-section="${sectionName}"]`));
        } else if (sectionName === '404') {
            displayElement(notFoundWrapper);
            displayElement(notFoundWrapper.querySelector('[data-section="404"]'));
        } else {
            displayElement(mainWrapper);
        }
    } else {
        displayElement(notFoundWrapper);
        displayElement(notFoundWrapper.querySelector('[data-section="404"]'));
    }
}

function navigate(sectionName) {
    showSection(sectionName);
    
    const baseUrl = getBaseUrl();
    const pageUrlMap = window.pageUrlMap || {};
    const urlSuffix = pageUrlMap[sectionName] || '';
    const newUrl = baseUrl + urlSuffix;
    
    history.pushState({section: sectionName}, '', newUrl);
    
    const pageTitle = (sectionName === 'main' || sectionName === '404') ? 'DeadlightProtocol' : 
        `DeadlightProtocol - ${sectionName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    document.title = pageTitle;
}

function getCurrentSectionFromUrl() {
    const basePath = getBaseUrl();
    const pageUrlMap = window.pageUrlMap || {};
    let localPath = window.location.pathname;

    if (localPath.startsWith(basePath)) {
        localPath = localPath.substring(basePath.length);
    }

    const requestedPage = localPath.split('/')[0] || '';

    if (requestedPage === '') return 'main';

    for (const [section, url] of Object.entries(pageUrlMap)) {
        if (url === requestedPage) return section;
    }
    
    return '404';
}


async function initMainController() {
    initHeaderShadow();
    
    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (moduleOptions.classList.contains('active')) {
            closeAndReset();
        } else {
            window.dispatchEvent(new CustomEvent('module-opening', { detail: { moduleToKeepOpen: 'settings' } }));
            moduleOptions.classList.remove('disabled');
            moduleOptions.classList.add('active');
            resetMenus();
            
            const mainMenu = moduleOptions.querySelector('[data-menu="main"]');
            if (window.innerWidth <= 465 && mainMenu) {
                mainMenu.classList.add('animating-in');
            }

            setTimeout(() => {
                document.addEventListener('click', handleOutsideSettingsClick);
                document.addEventListener('keydown', handleEscKey);
            }, 0);
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.stopPropagation();
            const targetMenuName = link.getAttribute('data-target-menu');
            menus.forEach(menu => menu.classList.replace('active', 'disabled'));
            const targetMenu = document.querySelector(`[data-menu="${targetMenuName}"]`);
            if (targetMenu) targetMenu.classList.replace('disabled', 'active');
        });
    });

    window.addEventListener('module-opening', (event) => {
        const { moduleToKeepOpen } = event.detail;
        if (moduleToKeepOpen !== 'settings') closeAndReset();
    });

    themeLinks.forEach(link => {
        link.addEventListener('click', () => handleChangeWithPreview(themeLinks, link, () => applyThemeChange(link.dataset.theme)));
    });

    langLinks.forEach(link => {
        link.addEventListener('click', () => handleChangeWithPreview(langLinks, link, () => applyLanguageChange(link.dataset.lang)));
    });

    document.body.addEventListener('click', (event) => {
        const targetElement = event.target.closest('[data-target-section]');
        if (targetElement) {
            if (targetElement.tagName === 'A') event.preventDefault();
            const sectionName = targetElement.getAttribute('data-target-section');
            navigate(sectionName);
            if (targetElement.closest('.module-options')) closeAndReset();
        }
    });
    
    window.addEventListener('popstate', (event) => {
        const section = (event.state && event.state.section) ? event.state.section : getCurrentSectionFromUrl();
        showSection(section);
    });

    await preloadAllTranslations();
    applyThemeChange(localStorage.getItem('user-theme') || 'system');
    const availableLangs = Array.from(langLinks).map(link => link.dataset.lang);
    const initialLang = localStorage.getItem('user-language') || availableLangs.find(lang => navigator.language.startsWith(lang.substring(0, 2))) || 'en-US';
    applyLanguageChange(initialLang);

    const initialSection = window.initialPage || 'main';
    showSection(initialSection);
    history.replaceState({section: initialSection}, '', window.location.href);
}

export { closeAndReset, initMainController, allTranslations };