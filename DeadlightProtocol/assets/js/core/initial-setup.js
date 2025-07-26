(function() {
    try {
        // Asegura que siempre haya un tema por defecto
        if (!localStorage.getItem('user-theme')) {
            localStorage.setItem('user-theme', 'system');
        }

        // Lógica de detección y asignación de idioma por defecto
        if (!localStorage.getItem('user-language')) {
            const availableLangs = ['en-US', 'es-MX', 'fr-FR'];
            const browserLang = navigator.language;

            // Busca el idioma del navegador en la lista de idiomas disponibles
            // Primero busca una coincidencia exacta (ej. 'es-MX'), luego una coincidencia parcial (ej. 'es')
            const detectedLang = availableLangs.find(lang => lang === browserLang) || 
                                 availableLangs.find(lang => browserLang.startsWith(lang.substring(0, 2)));
            
            // Asigna el idioma detectado o 'en-US' como fallback
            localStorage.setItem('user-language', detectedLang || 'en-US');
        }

        // Aplica el tema guardado
        const theme = localStorage.getItem('user-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const applyDarkTheme = theme === 'dark' || (theme === 'system' && systemPrefersDark);
        document.documentElement.classList.add(applyDarkTheme ? 'dark-theme' : 'light-theme');

    } catch (e) {
        // La detección falló, se aplicarán los valores por defecto en el controlador principal
    }
    
    // El resto de la lógica para aplicar traducciones iniciales permanece igual...
    try {
        const langDataString = localStorage.getItem('user-language-data');
        if (!langDataString) return;
        const langData = JSON.parse(langDataString);
        const currentLang = localStorage.getItem('user-language');
        if (langData && langData.code === currentLang) {
            const applyInitialTranslations = (translations) => {
                if (!translations || !translations.menu) return;
                const translateNode = (node) => {
                    if (node.nodeType === 1 && node.hasAttribute('data-translate')) {
                        const key = node.getAttribute('data-translate');
                        if (translations.menu[key]) {
                            node.textContent = translations.menu[key];
                        }
                    }
                };
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                translateNode(node);
                                if (node.querySelectorAll) {
                                    node.querySelectorAll('[data-translate]').forEach(translateNode);
                                }
                            });
                        }
                    }
                });
                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
                document.addEventListener('DOMContentLoaded', () => {
                    observer.disconnect();
                });
            };
            applyInitialTranslations(langData.translations);
        }
    } catch (e) {}
})();