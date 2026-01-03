let RightbarAPI = null;

// Initialize
window.RightbarInit = function (API) {
    RightbarAPI = API;
};

// Rebuild on every passage render
$(document).on(':passagerender', function () {
    if (!RightbarAPI) return;

    const vars = RightbarAPI.State.variables;

    // Check if current passage is Start (startscreen) - skip rightbar creation
    if (RightbarAPI.State.passage === 'Start') {
        $('.right-bar, .map-overlay').remove();
        return;
    }

    // Check State variable for UI control (flexible per-passage control)
    if (vars.hideRightbar === true) {
        $('.right-bar, .map-overlay').remove();
        return;
    }

    // Remove only rightbar/map-overlay, NOT modal-overlay
    $('.right-bar, .map-overlay').remove();

    const gameName = vars.gameName || "PJX Game";
    const gameVersion = vars.gameVersion || "0.0.1";
    const imageProfile = vars.imageProfile;
    const imageMap = vars.imageMap;
    const notificationPhoneCount = vars.notificationPhoneCount || 0;

    // Stats configuration and HTML generation (inline)
    const statsHTML = (vars.gameStats || [
        { label: 'Money', value: vars.money || 0 },
        { label: 'Energy', value: vars.energy || 0 },
        { label: 'Health', value: vars.health || 0 },
        { label: 'Mood', value: vars.mood || 0 },
        { label: 'Arousal', value: vars.arousal || 0 }
    ]).map(stat => `
        <div class="stat-float">
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');

    // Phone preview content
    const phonePreviewContent = notificationPhoneCount > 0 ? `
        <div class="message-item">
            <div class="message-info">
                <div class="message-name">New Notifications</div>
            </div>
            <div class="message-count">${notificationPhoneCount}</div>
        </div>
    ` : `
        <div class="phone-empty">
            <div class="phone-empty-text">No new notifications</div>
        </div>
    `;

    // Modular UI Control - Check what components to hide (preserve layout)
    const hideGameInfo = vars.hideRightbarGameInfo === true;
    const hideProfile = vars.hideRightbarProfile === true;
    const hideStats = vars.hideRightbarStats === true;
    const hidePhone = vars.hideRightbarPhone === true;
    const hideMap = vars.hideRightbarMap === true;

    // Build complete HTML with visibility control (layout preserved)
    const html = `
        <div class="right-bar">
            <div class="rightbar-section rightbar-top" style="${hideGameInfo ? 'visibility: hidden;' : ''}">
                <div class="game-info">
                    <p class="game-title">${gameName}</p>
                    <p class="game-version">${gameVersion}</p>
                </div>
            </div>
            
            <div class="rightbar-section rightbar-middle">
                <img src="${imageProfile}" class="profile-image" style="${hideProfile || !imageProfile ? 'visibility: hidden;' : ''}">
                
                <div class="stats-section" style="${hideStats ? 'visibility: hidden;' : ''}">
                    ${statsHTML}
                </div>
            </div>
            
            <div class="rightbar-section rightbar-bottom">
                <div class="phone-section" id="phone-section" style="${hidePhone ? 'visibility: hidden;' : ''}">
                    <div class="preview-container" id="phone-trigger">
                        <div class="preview-content phone-mockup">
                            <div class="phone-notch">
                                <div class="notch-camera"></div>
                                <div class="notch-speaker"></div>
                                <div class="notch-sensor"></div>
                            </div>
                            <div class="phone-screen">
                                <div class="phone-header">Notifications</div>
                                <div class="phone-preview">
                                    ${phonePreviewContent}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="map-section" style="${hideMap ? 'visibility: hidden;' : ''}">
                    <div class="preview-container" id="map-trigger">
                        <div class="preview-content">
                            ${imageMap ? `<img src="${imageMap}" class="map-image" alt="Map">` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="overlay overlay-dark map-overlay" id="map-overlay">
            <div class="modal map-full">
                <div class="modal-header">
                    <span class="modal-title">Map</span>
                    <button class="close-btn" id="map-close">
                        <span class="icon icon-close icon-18"></span>
                    </button>
                </div>
                <div class="modal-content map-full-content">
                    ${imageMap ? `<img src="${imageMap}" class="map-image-full" alt="Map">` : ''}
                </div>
            </div>
        </div>
    `;

    // Insert to page
    RightbarAPI.$('body').append(html);

    // Check notification trigger
    if (vars.notificationPush === 1) {
        if (window.notifyPhone) {
            notifyPhone('New Notification');
        }
        vars.notificationPush = 0;
    }

    // Phone trigger events
    $('#phone-trigger').on('click', function () {
        if (window.openPhoneOverlay) {
            openPhoneOverlay();
        }
    });

    // Map trigger events
    $('#map-trigger').on('click', function () {
        $('#map-overlay').addClass('active');
    });

    $('#map-close').on('click', function () {
        $('#map-overlay').removeClass('active');
    });

    $('#map-overlay').on('click', function (e) {
        if (e.target === this) {
            $(this).removeClass('active');
        }
    });
});