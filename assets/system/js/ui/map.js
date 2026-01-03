// map.js - Interactive Map System (Overlay Mode)
let MapAPI = null;

window.MapInit = function (API) {
    MapAPI = API;

    window.MapSystem = {
        API: API,
        currentView: 'main',
        currentRegion: null,
        currentLocation: null,

        // Initialize listener
        init: function () {
            const self = this;

            // Listen for passage rendering to reinject map content
            $(document).on(':passagerender', function () {
                // Wait for Rightbar to create the overlay
                setTimeout(() => {
                    self.inject();
                }, 50);
            });

            // Allow manual triggering
            this.attachEvents();
        },

        // Inject map content into the existing overlay
        inject: function () {
            const container = $('.map-full-content');
            if (container.length === 0) return;

            // Only inject if not already injected (check for map-container)
            if (container.find('.map-container, .map-region-container').length > 0) return;

            console.log('[MapSystem] Injecting interactive map...');

            // Start with main view
            this.showMain();
        },

        // Build main city map view
        buildMainView: function (vars) {
            const regions = vars.mapRegions || [];
            const imageMap = vars.imageMap || '';

            let regionButtons = regions
                .filter(r => r.discovered !== false)
                .map(r => `
                    <button class="map-region-btn" 
                            data-region="${r.id}"
                            style="left: ${r.x}%; top: ${r.y}%;">
                        ${r.name}
                    </button>
                `).join('');

            return `
                <div class="map-container">
                    ${imageMap ? `<img src="${imageMap}" class="map-bg-image" alt="City Map">` : ''}
                    ${regionButtons}
                </div>
            `;
        },

        // Build region map view
        buildRegionView: function (regionId) {
            const vars = this.API.State.variables;
            const regions = vars.mapRegions || [];
            const locations = vars.mapLocations || {};
            const characters = vars.characters || {};

            const region = regions.find(r => r.id === regionId);
            if (!region) return '';

            // Get locations for this region - MANUAL DISCOVERY ONLY
            const regionLocations = Object.entries(locations)
                .filter(([id, loc]) => {
                    if (loc.region !== regionId) return false;

                    // Convert snake_case to PascalCase: smith_house → SmithHouse
                    const discoveryVar = 'discovered' + id.split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join('');

                    console.log('[MapSystem] Checking:', discoveryVar, '=', vars[discoveryVar]);
                    return vars[discoveryVar] === 1 || vars[discoveryVar] === true;
                })
                .map(([id, loc]) => `
                    <button class="map-location-marker" 
                         data-location="${id}"
                         style="left: ${loc.x}%; top: ${loc.y}%;">
                        ${loc.name}
                    </button>
                `).join('');

            return `
                <div class="map-region-view-wrapper">
                    ${region.image ? `<img src="${region.image}" class="map-region-image-full" alt="${region.name}">` : ''}
                    <div class="map-region-header">
                        <button class="map-back-btn" data-action="back-to-main">
                            <span class="icon icon-chevron-left icon-16"></span> Back to Map
                        </button>
                        <div class="map-region-info">
                            <div class="map-region-name">${region.name}</div>
                            <div class="map-region-desc">${region.desc || ''}</div>
                        </div>
                        <button class="map-taxi-btn" data-region="${region.id}" data-cost="${vars.taxiBaseFare || 10}">
                            <span>Call Taxi</span>
                            <span class="taxi-price">$${vars.taxiBaseFare || 10}</span>
                        </button>
                    </div>
                    <div class="map-region-container" style="--region-color: ${region.color || '#3b82f6'}">
                        ${regionLocations || '<div class="map-empty">No locations discovered in this region.</div>'}
                    </div>
                </div>
            `;
        },

        // Build location detail view
        buildLocationView: function (locationId) {
            const vars = this.API.State.variables;
            const locations = vars.mapLocations || {};
            const characters = vars.characters || {};
            const regions = vars.mapRegions || [];

            const location = locations[locationId];
            if (!location) return '';

            const region = regions.find(r => r.id === location.region);
            const regionName = region ? region.name : '';

            let contentSection = '';

            // Residence type - show ONLY known residents
            if (location.type === 'residence' && location.residents) {
                const residentCards = location.residents
                    .filter(charId => {
                        const char = characters[charId];
                        return char && char.known === true;
                    })
                    .map(charId => {
                        const char = characters[charId];
                        return `
                            <div class="map-resident-card" data-character="${charId}">
                                <div class="resident-avatar">
                                    ${char.avatar ? `<img src="${char.avatar}" alt="${char.name}">` : '👤'}
                                </div>
                                <div class="resident-info">
                                    <div class="resident-name">${char.name}</div>
                                </div>
                            </div>
                        `;
                    }).join('');

                contentSection = residentCards ? `
                    <div class="map-section-title">Residents</div>
                    <div class="map-residents-list">
                        ${residentCards}
                    </div>
                ` : '';
            }

            // Store type - show stores
            if (location.type === 'store' && location.stores) {
                const storeCards = location.stores.map(store => `
                    <div class="map-store-card">
                        <div class="store-icon">${store.icon || '🏪'}</div>
                        <div class="store-info">
                            <div class="store-name">${store.name}</div>
                            <div class="store-desc">${store.desc || ''}</div>
                        </div>
                        <div class="store-status ${store.open !== false ? 'open' : 'closed'}">
                            ${store.open !== false ? 'Open' : 'Closed'}
                        </div>
                    </div>
                `).join('');

                contentSection = `
                    <div class="map-section-title">Stores</div>
                    <div class="map-stores-list">
                        ${storeCards}
                    </div>
                `;
            }

            // Verify image path
            if (location.image) {
                const cssUrl = `url('${location.image}')`;
                console.log(`[MapSystem] Location image path: ${location.image}`);
                console.log(`[MapSystem] CSS URL value: ${cssUrl}`);

                // Test if image exists by preloading
                const testImg = new Image();
                testImg.onload = () => console.log('[MapSystem] Image loaded successfully!');
                testImg.onerror = () => console.error('[MapSystem] Image FAILED to load:', location.image);
                testImg.src = location.image;
            }

            // Set background image for content area
            const bgImageHtml = location.image ? `
                <div class="map-location-bg" style="background-image: url('${location.image}');"></div>
                <div class="map-location-gradient"></div>
            ` : '';

            const contentHtml = `
                <div class="map-location-header">
                    <button class="map-back-btn" data-action="back-to-region">
                        <span class="icon icon-chevron-left icon-16"></span> Back
                    </button>
                    <div class="map-location-info">
                        <div class="map-location-name">${location.name}</div>
                        <div class="map-location-type">${location.type === 'residence' ? 'Residence' : 'Business'} • ${regionName}</div>
                    </div>
                    <button class="map-taxi-btn" data-location="${locationId}" data-cost="${location.taxiCost || 10}">
                        <span>Call Taxi</span>
                        <span class="taxi-price">$${location.taxiCost || 10}</span>
                    </button>
                </div>
                
                <div class="map-location-content">
                    ${bgImageHtml}
                    <div class="map-content-scroll">
                        ${contentSection}
                    </div>
                </div>
            `;

            return contentHtml;
        },

        // Function to update the container content (Overlay Mode)
        updateContent: function (html) {
            this.API.$('.map-full-content').html(html);
        },

        // Show region
        showRegion: function (regionId) {
            this.currentRegion = regionId;
            const content = this.buildRegionView(regionId);
            this.updateContent(content);
            this.currentView = 'region';
        },

        // Show location
        showLocation: function (locationId) {
            this.currentLocation = locationId;
            const content = this.buildLocationView(locationId);
            this.updateContent(content);
            this.currentView = 'location';
        },

        // Show main map
        showMain: function () {
            const vars = this.API.State.variables;
            const content = this.buildMainView(vars);
            this.updateContent(content);
            this.currentView = 'main';
            this.currentRegion = null;
            this.currentLocation = null;
        },

        // Attach events
        attachEvents: function () {
            const self = this;
            const $doc = this.API.$(document);

            // Region button click
            $doc.off('click.map-region').on('click.map-region', '.map-region-btn', function () {
                const regionId = self.API.$(this).data('region');
                self.showRegion(regionId);
            });

            // Location marker click
            $doc.off('click.map-location').on('click.map-location', '.map-location-marker', function () {
                const locationId = self.API.$(this).data('location');
                self.showLocation(locationId);
            });

            // Back buttons
            $doc.off('click.map-back').on('click.map-back', '.map-back-btn', function () {
                const action = self.API.$(this).data('action');
                if (action === 'back-to-main') {
                    self.showMain();
                } else if (action === 'back-to-region') {
                    if (self.currentRegion) {
                        self.showRegion(self.currentRegion);
                    } else {
                        self.showMain();
                    }
                }
            });

            // Taxi button - Handle both location and region
            $doc.off('click.map-taxi').on('click.map-taxi', '.map-taxi-btn', function () {
                const $btn = self.API.$(this);
                const locationId = $btn.data('location');
                const regionId = $btn.data('region');
                const cost = parseInt($btn.data('cost')) || 10;

                let targetPassage = null;

                if (locationId) {
                    // Location taxi
                    const location = self.API.State.variables.mapLocations[locationId];
                    if (location && location.passage) {
                        targetPassage = location.passage;
                    }
                } else if (regionId) {
                    // Region taxi
                    const region = self.API.State.variables.mapRegions.find(r => r.id === regionId);
                    if (region && region.passage) {
                        targetPassage = region.passage;
                    }
                }

                if (targetPassage) {
                    self.callTaxi(targetPassage, cost);
                } else {
                    console.warn('[MapSystem] No passage found for taxi destination');
                }
            });


        },

        // Call taxi
        callTaxi: function (passage, cost) {
            const vars = this.API.State.variables;
            const money = vars.money || 0;

            if (money < cost) {
                if (window.notify) {
                    notify('Not enough money!', 'error');
                } else {
                    alert('Not enough money! Taxi fare: $' + cost);
                }
                return;
            }

            // Store destination and cost for fastTravelTaxi passage
            vars.tempTaxiDestination = passage;
            vars.tempTaxiCost = cost;

            // Close overlay
            $('#map-overlay').removeClass('active');

            // Navigate to fastTravelTaxi passage (ara ekran)
            setTimeout(() => {
                this.API.Engine.play('fastTravelTaxi');
            }, 500);
        }
    };

    // Auto-init
    window.MapSystem.init();
};
