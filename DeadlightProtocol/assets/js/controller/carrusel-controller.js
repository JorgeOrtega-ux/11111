export function initResourcesCarousel() {
    const container = document.querySelector('.resources-carousel-container');
    if (!container) return;

    const slides = container.querySelectorAll('[data-slide-content]');
    const dots = container.querySelectorAll('[data-slide-nav]');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoRotateInterval;

    function showSlide(newIndex) {
        // Itera sobre cada slide para actualizar sus clases
        slides.forEach((slide, idx) => {
            // Comprueba si el slide actual es el que se debe mostrar
            const isActive = idx === newIndex;
            
            // Añade o quita 'active' y 'disabled' según corresponda
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('disabled', !isActive);
        });

        // Actualiza los puntos de navegación
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === newIndex);
        });

        currentIndex = newIndex;
    }

    function nextSlide() {
        const newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
    }

    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextSlide, 8000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const newIndex = parseInt(e.target.dataset.slideNav);
            if (currentIndex !== newIndex) {
                showSlide(newIndex);
                startAutoRotate();
            }
        });
    });

    // Asegura que el estado inicial sea correcto y comienza la rotación
    showSlide(currentIndex);
    startAutoRotate();
}