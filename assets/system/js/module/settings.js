// settings.js
window.SettingsInit = function (API) {
    window.SettingsSystem = {
        API: API,

        // Open settings modal
        open: function () {
            const vars = this.API.State.variables;
            // Use State.variables for reliable settings
            const settings = vars.videoSettings || { autoplaySet: true, loopSet: true, masterVolume: 100, videoVolume: 100 };

            this.API.Modal.create({
                id: 'settings-modal',
                title: 'Settings',
                width: '800px',
                tabs: [
                    {
                        id: 'general',
                        label: 'General',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Content Preferences</h3>
                                <div class="settings-list" style="display: grid; gap: 20px; padding: 10px;">
                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Incest Content</div>
                                            <div style="font-size: 0.8rem; color: #777;">Family romantic/sexual interactions</div>
                                        </div>
                                        <button class="setting-toggle-btn ${vars.contentPreferences?.incest !== false ? 'active' : ''}" 
                                                data-setting="incest"
                                                data-category="content">
                                            ${vars.contentPreferences?.incest !== false ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Romantic Content</div>
                                            <div style="font-size: 0.8rem; color: #777;">Flirting, romance scenes</div>
                                        </div>
                                        <button class="setting-toggle-btn ${vars.contentPreferences?.romantic !== false ? 'active' : ''}" 
                                                data-setting="romantic"
                                                data-category="content">
                                            ${vars.contentPreferences?.romantic !== false ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Sexual Content</div>
                                            <div style="font-size: 0.8rem; color: #777;">Explicit sexual scenes</div>
                                        </div>
                                        <button class="setting-toggle-btn ${vars.contentPreferences?.sexual !== false ? 'active' : ''}" 
                                                data-setting="sexual"
                                                data-category="content">
                                            ${vars.contentPreferences?.sexual !== false ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Gore & Violence</div>
                                            <div style="font-size: 0.8rem; color: #777;">Blood, graphic violence, combat</div>
                                        </div>
                                        <button class="setting-toggle-btn ${vars.contentPreferences?.gore !== false ? 'active' : ''}" 
                                                data-setting="gore"
                                                data-category="content">
                                            ${vars.contentPreferences?.gore !== false ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Scat Content</div>
                                            <div style="font-size: 0.8rem; color: #777;">Bathroom related content</div>
                                        </div>
                                        <button class="setting-toggle-btn ${vars.contentPreferences?.scat === true ? 'active' : ''}" 
                                                data-setting="scat"
                                                data-category="content">
                                            ${vars.contentPreferences?.scat === true ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: 'display',
                        label: 'Display',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Video Settings</h3>
                                <div class="settings-list" style="display: grid; gap: 20px; padding: 10px;">
                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Video Autoplay</div>
                                            <div style="font-size: 0.8rem; color: #777;">Automatically play videos in passages</div>
                                        </div>
                                        <button class="setting-toggle-btn ${settings.autoplaySet ? 'active' : ''}" 
                                                data-setting="autoplaySet">
                                            ${settings.autoplaySet ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    <div class="settings-control" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div>
                                            <div style="font-weight: 500; margin-bottom: 4px;">Video Loop</div>
                                            <div style="font-size: 0.8rem; color: #777;">Automatically repeat videos when they end</div>
                                        </div>
                                        <button class="setting-toggle-btn ${settings.loopSet ? 'active' : ''}" 
                                                data-setting="loopSet">
                                            ${settings.loopSet ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>

                                <h3 style="margin-top: 2rem;">Volume Settings</h3>
                                <div class="settings-list" style="display: grid; gap: 20px; padding: 10px;">
                                    <div class="settings-control" style="display: flex; flex-direction: column; gap: 10px; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight: 500; margin-bottom: 4px;">Master Volume</div>
                                                <div style="font-size: 0.8rem; color: #777;">Global volume for all sounds</div>
                                            </div>
                                            <span class="volume-value" data-volume="masterVolume" style="font-size: 1rem; font-weight: 600; color: #ec4899; min-width: 50px; text-align: right;">${settings.masterVolume !== undefined ? settings.masterVolume : 100}%</span>
                                        </div>
                                        <div class="custom-slider-container" data-slider="masterVolume">
                                            <div class="custom-slider-track">
                                                <div class="custom-slider-fill" style="width: ${settings.masterVolume !== undefined ? settings.masterVolume : 100}%;"></div>
                                                <div class="custom-slider-thumb" style="left: ${settings.masterVolume !== undefined ? settings.masterVolume : 100}%;">
                                                    <div class="custom-slider-tooltip">${settings.masterVolume !== undefined ? settings.masterVolume : 100}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="settings-control" style="display: flex; flex-direction: column; gap: 10px; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight: 500; margin-bottom: 4px;">Video Volume</div>
                                                <div style="font-size: 0.8rem; color: #777;">Volume for video playback only</div>
                                            </div>
                                            <span class="volume-value" data-volume="videoVolume" style="font-size: 1rem; font-weight: 600; color: #ec4899; min-width: 50px; text-align: right;">${settings.videoVolume !== undefined ? settings.videoVolume : 100}%</span>
                                        </div>
                                        <div class="custom-slider-container" data-slider="videoVolume">
                                            <div class="custom-slider-track">
                                                <div class="custom-slider-fill" style="width: ${settings.videoVolume !== undefined ? settings.videoVolume : 100}%;"></div>
                                                <div class="custom-slider-thumb" style="left: ${settings.videoVolume !== undefined ? settings.videoVolume : 100}%;">
                                                    <div class="custom-slider-tooltip">${settings.videoVolume !== undefined ? settings.videoVolume : 100}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    }
                ]
            });

            // Set up event listeners with delay to ensure DOM is ready
            setTimeout(() => {
                this.initEvents();
            }, 100);
        },

        initEvents: function () {
            const self = this;
            console.log('[Settings] Initializing toggle events');

            // Unbind first to prevent multiple listeners
            $(document).off('click.settings-toggle', '.setting-toggle-btn');
            $(document).on('click.settings-toggle', '.setting-toggle-btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const key = $(this).data('setting');
                console.log('[Settings] Toggle clicked:', key);
                self.toggleSetting(key);
            });

            // Custom slider interactions
            this.initCustomSliders();

            console.log('[Settings] Event listeners attached. Found buttons:', $('.setting-toggle-btn').length);
            console.log('[Settings] Event listeners attached. Found custom sliders:', $('.custom-slider-container').length);
        },

        initCustomSliders: function () {
            const self = this;

            $('.custom-slider-container').each(function () {
                const container = $(this);
                const sliderKey = container.data('slider');
                const track = container.find('.custom-slider-track');
                const fill = container.find('.custom-slider-fill');
                const thumb = container.find('.custom-slider-thumb');
                const tooltip = container.find('.custom-slider-tooltip');

                let isDragging = false;

                // Update slider position
                const updateSlider = (clientX) => {
                    const trackRect = track[0].getBoundingClientRect();
                    const trackWidth = trackRect.width;
                    let position = clientX - trackRect.left;

                    // Clamp between 0 and trackWidth
                    position = Math.max(0, Math.min(position, trackWidth));

                    // Calculate percentage
                    const percentage = Math.round((position / trackWidth) * 100);

                    // Update visuals
                    fill.css('width', percentage + '%');
                    thumb.css('left', percentage + '%');
                    tooltip.text(percentage + '%');

                    // Update setting
                    self.updateVolume(sliderKey, percentage);
                };

                // Track click - jump to position
                track.on('mousedown', function (e) {
                    if (e.target === thumb[0] || thumb.has(e.target).length) return;
                    updateSlider(e.clientX);
                    isDragging = true;
                    thumb.addClass('dragging');
                });

                // Thumb drag start
                thumb.on('mousedown', function (e) {
                    e.preventDefault();
                    isDragging = true;
                    thumb.addClass('dragging');
                });

                // Document mouse move - drag
                $(document).on('mousemove.slider-' + sliderKey, function (e) {
                    if (!isDragging) return;
                    updateSlider(e.clientX);
                });

                // Document mouse up - stop dragging
                $(document).on('mouseup.slider-' + sliderKey, function () {
                    if (isDragging) {
                        isDragging = false;
                        thumb.removeClass('dragging');
                    }
                });
            });
        },

        // Toggle a specific setting
        toggleSetting: function (key) {
            console.log('[Settings] toggleSetting called for:', key);

            const vars = this.API.State.variables;
            
            // Determine which settings object to use
            const btn = $(`.setting-toggle-btn[data-setting="${key}"]`);
            const category = btn.data('category');
            
            if (category === 'content') {
                // Content Preferences
                if (!vars.contentPreferences) {
                    vars.contentPreferences = { incest: true, romantic: true, sexual: true, gore: true, violence: true, scat: false };
                }
                
                const settings = vars.contentPreferences;
                console.log('[Settings] Current value:', settings[key]);
                
                // Toggle the value
                settings[key] = !settings[key];
                console.log('[Settings] New value:', settings[key]);
                
                // Re-render button state
                if (btn.length) {
                    const isActive = settings[key];
                    btn.toggleClass('active', isActive);
                    btn.text(isActive ? 'ON' : 'OFF');
                    console.log('[Settings] Button updated to:', isActive ? 'ON' : 'OFF');
                }
                
                console.log(`[Settings] ${key} final value: ${settings[key]}`);
            } else {
                // Video Settings (default)
                if (!vars.videoSettings) {
                    vars.videoSettings = { autoplaySet: true, loopSet: true, masterVolume: 100, videoVolume: 100 };
                }
                
                const settings = vars.videoSettings;
                console.log('[Settings] Current value:', settings[key]);
                
                // Toggle the value
                settings[key] = !settings[key];
                console.log('[Settings] New value:', settings[key]);
                
                // Re-render button state
                if (btn.length) {
                    const isActive = settings[key];
                    btn.toggleClass('active', isActive);
                    btn.text(isActive ? 'ON' : 'OFF');
                    console.log('[Settings] Button updated to:', isActive ? 'ON' : 'OFF');
                }
                
                console.log(`[Settings] ${key} final value: ${settings[key]}`);
            }
        },

        // Update volume setting
        updateVolume: function (key, value) {
            console.log('[Settings] updateVolume called for:', key, 'value:', value);

            // Use State.variables for reliable settings
            const vars = this.API.State.variables;
            if (!vars.videoSettings) {
                vars.videoSettings = { autoplaySet: true, loopSet: true, masterVolume: 100, videoVolume: 100 };
            }

            const settings = vars.videoSettings;
            settings[key] = value;

            // Update displayed percentage
            $(`.volume-value[data-volume="${key}"]`).text(value + '%');

            console.log(`[Settings] ${key} updated to: ${value}%`);
        }
    };
};
