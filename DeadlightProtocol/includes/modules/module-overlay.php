<div class="module-overlay disabled">
    <div class="menu-overlay">
        <div class="pill-container">
            <div class="drag-handle"></div>
        </div>
        <div class="menu-overlay-top">
            <div class="menu-overlay-input">
                <input type="text" id="video-url-input" data-translate="youtube_placeholder" placeholder="Pega la URL del video de YouTube aquí...">
            </div>
        </div>
        <div class="menu-overlay-center">
            <div id="message-container" class="active">
                <div id="initial-message" class="message-wrapper active">
                    <span class="material-symbols-rounded message-icon">link</span>
                    <p class="message-text">Pega un enlace para comenzar</p>
                </div>
                <div id="video-processing-message" class="message-wrapper disabled">
                    <div class="loader-spinner"></div>
                    <p class="message-text">Procesando, por favor espera...</p>
                </div>
                <div id="video-error-message" class="message-wrapper error disabled">
                    <span class="material-symbols-rounded message-icon">error</span>
                    <p class="message-text"></p>
                </div>
            </div>
            <div class="menu-overlay-layout disabled" id="video-card-layout">
                <div class="video-thumbnail">
                    <img src="" alt="Video Thumbnail" id="video-thumbnail-img">
                </div>
                <div class="video-info">
                    <h3 class="video-title" id="video-title-text"></h3>
                    <p class="video-description" id="video-description-text"></p>
                </div>
                <div class="quality-selector-content">
                    <div class="quality-selector" data-action="toggleStudio">
                        <div class="quality-selector-icon">
                            <span class="material-symbols-rounded">hd</span>
                        </div>
                        <div class="quality-selector-text" data-quality-id="">1080p</div>
                        <div class="quality-selector-icon">
                            <span class="material-symbols-rounded">arrow_drop_down</span>
                        </div>
                    </div>
                    <div class="module-studio disabled">
                        <div class="menu-studio">
                            <div class="pill-container">
                                <div class="drag-handle"></div>
                            </div>
                            <div class="menu-list" id="quality-options-list">
                            </div>
                        </div>
                    </div>
                </div>
                <button class="download-button" id="download-video-button" disabled>Descargar</button>
            </div>
        </div>
        <div class="menu-overlay-bottom">
            <button id="search-video-button" class="disabled-interactive">Buscar contenido</button>
        </div>
    </div>
</div>