import { initMainController } from '../controller/main-controller.js';
import { initDragController } from '../controller/drag-controller.js';
import { initResourcesCarousel } from '../controller/carrusel-controller.js';
import { initVideoController } from '../controller/video-controller.js';

document.addEventListener('DOMContentLoaded', () => {
    initMainController();
    initDragController();
    initResourcesCarousel();
    initVideoController();
});