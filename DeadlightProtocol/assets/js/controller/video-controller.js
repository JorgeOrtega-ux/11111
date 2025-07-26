import { allTranslations } from './main-controller.js';

// Exporta la función de cierre del overlay de video para que drag-controller pueda usarla
export function closeVideoOverlay() {
    const moduleOverlay = document.querySelector('.module-overlay');
    if (!moduleOverlay || !moduleOverlay.classList.contains('active')) return;

    const menuPanel = moduleOverlay.querySelector('.menu-overlay');

    const finishClosing = () => {
        moduleOverlay.classList.add('disabled');
        moduleOverlay.classList.remove('active', 'closing');
        if (menuPanel) {
            menuPanel.classList.remove('animating-in');
            menuPanel.removeAttribute('style');
        }
    };

    if (window.innerWidth <= 465 && menuPanel) {
        moduleOverlay.classList.add('closing');
        menuPanel.addEventListener('animationend', finishClosing, { once: true });
    } else {
        finishClosing();
    }
}

// Exporta la función de cierre del menú de calidades para que sea accesible globalmente
export const closeStudioModule = () => {
    const studioModule = document.querySelector('.module-studio');
    if (!studioModule || studioModule.classList.contains('disabled')) return;
    const menuStudio = studioModule.querySelector('.menu-studio');

    const finishClosing = () => {
        studioModule.classList.add('disabled');
        studioModule.classList.remove('active', 'closing');
        if (menuStudio) {
            menuStudio.classList.remove('animating-in');
            // Clave: Elimina los estilos en línea para resetear el estado del menú
            menuStudio.removeAttribute('style');
        }
        document.removeEventListener('click', handleOutsideStudioClick);
    };

    if (window.innerWidth <= 465 && menuStudio) {
        studioModule.classList.add('closing');
        menuStudio.addEventListener('animationend', finishClosing, { once: true });
    } else {
        finishClosing();
    }
};

// Se declara aquí para que closeStudioModule pueda acceder a ella
let handleOutsideStudioClick;

export function initVideoController() {
    const toolCards = document.querySelectorAll('.tool-card');
    const moduleOverlay = document.querySelector('.module-overlay');
    const videoUrlInput = document.getElementById('video-url-input');
    const searchVideoButton = document.getElementById('search-video-button');
    
    // Contenedores de mensajes
    const messageContainer = document.getElementById('message-container');
    const initialMessage = document.getElementById('initial-message');
    const processingMessage = document.getElementById('video-processing-message');
    const errorMessage = document.getElementById('video-error-message');
    // --- LÍNEA CORREGIDA ---
    const errorMessageText = errorMessage.querySelector('.message-text');

    const qualitySelector = document.querySelector('[data-action="toggleStudio"]');
    const studioModule = document.querySelector('.module-studio');
    const menuOverlay = moduleOverlay?.querySelector('.menu-overlay');
    const menuStudio = studioModule?.querySelector('.menu-studio');

    if (!moduleOverlay || !qualitySelector || !studioModule) return;
    
    const qualitySelectorText = qualitySelector.querySelector('.quality-selector-text');
    const qualityOptions = studioModule.querySelectorAll('#quality-options-list .menu-link');
    let activePlatformKey = null;

    const isUrlValid = (url) => {
        const supportedDomains = [
            'youtube\\.com',
            'youtu\\.be',
            'facebook\\.com',
            'fb\\.watch',
            'instagram\\.com',
            'tiktok\\.com',
            'vimeo\\.com',
            'x\\.com',
            'twitter\\.com'
        ].join('|');
        const urlPattern = new RegExp(`^(https?:\/\/)?(www\\.)?(${supportedDomains})(\/.*)*$`, 'i');
        return urlPattern.test(url);
    };

    // --- LÓGICA DE VALIDACIÓN DE URL (INPUT)---
    videoUrlInput.addEventListener('input', () => {
        const isValid = isUrlValid(videoUrlInput.value.trim());
        searchVideoButton.classList.toggle('disabled-interactive', !isValid);
        
        if (isValid && errorMessage.classList.contains('active')) {
            errorMessage.classList.replace('active', 'disabled');
            initialMessage.classList.replace('disabled', 'active');
        }
    });
    
    // --- LÓGICA DEL CLIC EN EL BOTÓN "BUSCAR CONTENIDO" ---
    searchVideoButton.addEventListener('click', () => {
        if (searchVideoButton.classList.contains('disabled-interactive')) return;

        const url = videoUrlInput.value.trim();
        if (isUrlValid(url)) {
            searchVideoButton.classList.add('loading');
            initialMessage.classList.replace('active', 'disabled');
            errorMessage.classList.replace('active', 'disabled');
            processingMessage.classList.replace('disabled', 'active');

            console.log("URL válida, procesando:", url);
            setTimeout(() => {
                 searchVideoButton.classList.remove('loading');
                 processingMessage.classList.replace('active', 'disabled');
                 initialMessage.classList.replace('disabled', 'active');
            }, 3000);

        } else {
            initialMessage.classList.replace('active', 'disabled');
            processingMessage.classList.replace('active', 'disabled');
            // --- LÍNEA CORREGIDA ---
            errorMessageText.textContent = 'La URL es incorrecta o la plataforma no es soportada.';
            errorMessage.classList.replace('disabled', 'active');
        }
    });

    // --- MANEJADORES DE CIERRE ---
    
    const handleOutsideClick = (event) => {
        if (studioModule && studioModule.classList.contains('active')) {
            return;
        }

        if (menuOverlay && !menuOverlay.contains(event.target) && !event.target.closest('.tool-card')) {
            closeVideoOverlay();
        }
    };
    
    handleOutsideStudioClick = (event) => {
        if (menuStudio && !menuStudio.contains(event.target) && !event.target.closest('[data-action="toggleStudio"]')) {
            closeStudioModule();
        }
    };

    const handleEscKey = (event) => {
        if (event.key === 'Escape') {
            if (studioModule && studioModule.classList.contains('active')) {
                closeStudioModule();
            } else {
                closeVideoOverlay();
            }
        }
    };

    // --- FUNCIONES DE APERTURA / CIERRE ---
    const openOverlay = (platformKey) => {
        window.dispatchEvent(new CustomEvent('module-opening', { detail: { moduleToKeepOpen: 'video' } }));
        
        videoUrlInput.value = '';
        searchVideoButton.classList.add('disabled-interactive');
        searchVideoButton.classList.remove('loading');
        initialMessage.classList.replace('disabled', 'active');
        processingMessage.classList.replace('active', 'disabled');
        errorMessage.classList.replace('active', 'disabled');

        activePlatformKey = platformKey;
        updateActivePlatform(platformKey);

        const wasAlreadyActive = moduleOverlay.classList.contains('active');
        moduleOverlay.classList.add('active');
        moduleOverlay.classList.remove('disabled');

        if (window.innerWidth <= 465 && menuOverlay) {
            menuOverlay.classList.add('animating-in');
        }

        if (!wasAlreadyActive) {
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
                document.addEventListener('keydown', handleEscKey);
            }, 0);
        }
    };

    // --- LÓGICA DE CLICS EN TARJETAS ---
    toolCards.forEach(card => {
        card.addEventListener('click', (event) => {
            event.stopPropagation();
            const titleElement = card.querySelector('title');
            if (!titleElement) return;

            const platform = titleElement.textContent.trim();
            let clickedPlatformKey = 'youtube';
            if (platform.includes('Shorts')) clickedPlatformKey = 'youtube-shorts';
            else if (platform.includes('Music')) clickedPlatformKey = 'youtube-music';
            else if (platform.includes('Facebook')) clickedPlatformKey = 'facebook';
            else if (platform.includes('Instagram')) clickedPlatformKey = 'instagram';
            else if (platform.includes('TikTok')) clickedPlatformKey = 'tiktok';
            else if (platform.includes('Vimeo')) clickedPlatformKey = 'vimeo';
            else if (platform.includes('X')) clickedPlatformKey = 'x';

            if (moduleOverlay.classList.contains('active') && activePlatformKey === clickedPlatformKey) {
                closeVideoOverlay();
            } else {
                openOverlay(clickedPlatformKey);
            }
        });
    });

    qualitySelector.addEventListener('click', (event) => {
        event.stopPropagation();
        const isStudioDisabled = studioModule.classList.contains('disabled');
        
        studioModule.classList.toggle('disabled');
        studioModule.classList.toggle('active');

        if (isStudioDisabled) {
            if(window.innerWidth <= 465 && menuStudio) menuStudio.classList.add('animating-in');
            setTimeout(() => document.addEventListener('click', handleOutsideStudioClick), 0);
        } else {
            document.removeEventListener('click', handleOutsideStudioClick);
        }
    });

    qualityOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            const selectedQuality = option.querySelector('.menu-link-text').textContent;
            
            if (qualitySelectorText) {
                qualitySelectorText.textContent = selectedQuality;
            }
            
            closeStudioModule();
        });
    });

    window.addEventListener('module-opening', (event) => {
        if (event.detail.moduleToKeepOpen !== 'video') {
            closeVideoOverlay();
        }
    });

    const updateActivePlatform = (platformKey) => {
        let placeholderKey = 'youtube_placeholder';
        switch (platformKey) {
            case 'youtube': placeholderKey = 'youtube_placeholder'; break;
            case 'youtube-shorts': placeholderKey = 'shorts_placeholder'; break;
            case 'youtube-music': placeholderKey = 'music_placeholder'; break;
            case 'facebook': placeholderKey = 'facebook_placeholder'; break;
            case 'instagram': placeholderKey = 'instagram_placeholder'; break;
            case 'tiktok': placeholderKey = 'tiktok_placeholder'; break;
            case 'vimeo': placeholderKey = 'vimeo_placeholder'; break;
            case 'x': placeholderKey = 'x_placeholder'; break;
        }
        if (videoUrlInput) {
            videoUrlInput.setAttribute('data-translate', placeholderKey);
            const currentLang = localStorage.getItem('user-language') || 'en-US';
            const translations = allTranslations[currentLang];
            if (translations?.menu?.[placeholderKey]) {
                videoUrlInput.placeholder = translations.menu[placeholderKey];
            }
        }
    };
}