/* ================== External Loader =================== */
$(document).one(':storyready', async function () {
    // Helper functions
    function loadCSS(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${url}"]`)) {
                return resolve();
            }
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
            document.head.appendChild(link);
        });
    }

    function loadJS(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
                return resolve();
            }
            const script = document.createElement("script");
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
            document.head.appendChild(script);
        });
    }

    // Convert module name to Init function name
    // 'tooltip' -> 'TooltipInit'
    function getInitFunctionName(moduleName) {
        return moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 'Init';
    }

    // API object
    const API = {
        State: State,
        Engine: Engine,
        Window: Window,
        Dialog: Dialog,
        Save: Save,
        UI: UI,
        Setting: Setting,
        Config: Config,
        $: $
    };

    try {
        // Load CSS
        await loadCSS("assets/system/css/base.css");
        await loadCSS("assets/system/css/dialog.css");
        await loadCSS("assets/system/css/debug.css");
        await loadCSS("assets/system/css/icons.css");

        // Load config first
        await loadJS("assets/system/js/config.js");

        // Collect all module names for auto-init
        const allModules = [];

        // Load macros
        for (const macro of window.SystemModules.macros) {
            await loadJS(`assets/system/js/macros/${macro}.js`);
            allModules.push(macro);
        }

        // Load core modules
        for (const module of window.SystemModules.core) {
            await loadJS(`assets/system/js/module/${module}.js`);
            allModules.push(module);
        }

        // Auto-initialize all modules
        allModules.forEach(moduleName => {
            const initFn = getInitFunctionName(moduleName);
            if (window[initFn]) {
                console.log(`[Loader] Initializing: ${initFn}`);
                window[initFn](API);
            }
        });

        // Trigger initial render
        // Trigger initial render
        $(document).trigger(':passagerender');

        // Destroy UIBar
        UIBar.destroy();
    } catch (error) {
        console.error("[Loader] Error:", error);
    }
});

/* ================== Custom Link Macro =================== */
Macro.add('btn', {
    handler: function () {
        if (this.args.length < 2) {
            return this.error('btn macro requires at least 2 arguments: text and passage');
        }

        const text = this.args[0];
        const passage = this.args[1];
        const style = this.args[2] ? this.args[2].toLowerCase() : 'default';

        const link = $('<a>')
            .addClass('link-internal')
            .addClass('btn-style')
            .addClass('btn-' + style)
            .attr('data-passage', passage)
            .attr('tabindex', '0')
            .text(text)
            .appendTo(this.output);

        link.ariaClick({
            namespace: '.macros',
            one: true
        }, function () {
            Engine.play(passage);
        });
    }
});

/* ================== Dynamic Button Styles =================== */
// Generate button styles from CSS variables
$(document).one(':storyready', function() {
    const generateButtonStyles = () => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        let cssRules = '';

        // Get all CSS custom properties from root
        const allProps = [];
        for (let i = 0; i < styles.length; i++) {
            const prop = styles[i];
            if (prop.startsWith('--color-')) {
                allProps.push(prop);
            }
        }

        // Filter: only pure color variables (exclude bg, border, text)
        const colorVars = allProps.filter(prop => 
            !prop.includes('-bg-') && 
            !prop.includes('-border-') && 
            !prop.includes('-text-')
        );

        colorVars.forEach(varName => {
            const colorName = varName.replace('--color-', '');
            const colorValue = `var(${varName})`;

            cssRules += `
            .passage a.btn-${colorName},
            .btn-${colorName} {
                background: transparent !important;
                border-color: ${colorValue} !important;
                color: ${colorValue} !important;
            }

            .passage a.btn-${colorName}:hover,
            .btn-${colorName}:hover {
                background: ${colorValue} !important;
                border-color: ${colorValue} !important;
                color: #fff !important;
                transform: translateY(-1px);
            }
            `;
        });

        // Inject dynamic styles
        const existingStyle = document.getElementById('dynamic-button-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const styleTag = document.createElement('style');
        styleTag.id = 'dynamic-button-styles';
        styleTag.textContent = cssRules;
        document.head.appendChild(styleTag);

        console.log('[ButtonStyles] Generated button classes:', colorVars.map(v => '.btn-' + v.replace('--color-', '')));
    };

    // Wait for CSS to fully load
    setTimeout(generateButtonStyles, 100);
});

/* ================== WARDROBE MACRO =================== */
Macro.add('wardrobe', {
    handler: function() {
        if (window.wardrobeModule?.macroHandler) {
            window.wardrobeModule.macroHandler(this.output);
        } else {
            return this.error('Wardrobe module not loaded');
        }
    }
});

/* ================== DIALOG MACROS =================== */
Macro.add('dialog', {
    tags: null,
    handler() {
        if (this.args.length === 0) {
            return this.error('dialog macro requires character ID');
        }

        const charId = this.args[0];
        const vars = State.variables;
        const character = vars.characters?.[charId];

        if (!character) {
            return this.error(`Character "${charId}" not found in $characters`);
        }

        const content = this.payload[0].contents.trim();
        const type = character.type || 'npc';
        const color = character.color || '#666';
        const charName = character.name || charId;

        const wrapper = $('<div>')
            .addClass('dialogue')
            .addClass(type)
            .appendTo(this.output);

        const avatar = $('<div>')
            .addClass('avatar')
            .css('border-color', color)
            .appendTo(wrapper);

        $('<img>')
            .attr('src', character.avatar)
            .attr('alt', charName)
            .appendTo(avatar);

        const card = $('<div>')
            .addClass('card')
            .css('border-color', color)
            .appendTo(wrapper);

        $('<div>')
            .addClass('name')
            .text(charName)
            .css('color', color)
            .appendTo(card);

        $('<div>')
            .addClass('text')
            .wiki(content)
            .appendTo(card);
    }
});

Macro.add('narrative', {
    tags: null,
    handler() {
        const location = this.args.length > 0 ? this.args[0] : null;
        const content = this.payload[0].contents.trim();

        const wrapper = $('<div>')
            .addClass('narrative')
            .appendTo(this.output);

        if (location) {
            $('<div>')
                .addClass('location')
                .text(location)
                .appendTo(wrapper);
        }

        $('<div>')
            .addClass('narrative-text')
            .wiki(content)
            .appendTo(wrapper);
    }
});

Macro.add('thought', {
    tags: null,
    handler() {
        const content = this.payload[0].contents.trim();

        const wrapper = $('<div>')
            .addClass('thought-block')
            .appendTo(this.output);

        const card = $('<div>')
            .addClass('thought-card')
            .appendTo(wrapper);

        $('<div>')
            .addClass('thought-label')
            .text('Inner Voice')
            .appendTo(card);

        $('<div>')
            .addClass('thought-text')
            .wiki(content)
            .appendTo(card);

        $('<div>')
            .addClass('thought-avatar-spacer')
            .appendTo(wrapper);
    }
});

Macro.add('vid', {
    handler() {
        if (this.args.length === 0) {
            return this.error('vid macro requires a source URL');
        }

        const src = this.args[0];

        // Settings based playback (use State.variables.videoSettings)
        const getSetting = (key, def) => {
            if (State.variables && State.variables.videoSettings && State.variables.videoSettings[key] !== undefined) {
                return State.variables.videoSettings[key];
            }
            return def;
        };

        const globalAutoplay = getSetting('autoplaySet', true);
        const globalLoop = getSetting('loopSet', true);

        // Optional scale/width (2nd argument)
        let width = this.args[1] || '100%';
        if (typeof width === 'number') {
            if (width <= 1) width = (width * 100) + '%';
            else width = width + 'px';
        }

        // Optional manual control override (3rd argument)
        const controls = this.args[2] === true;

        const container = $('<div>')
            .addClass('video-container')
            .css('max-width', width)
            .appendTo(this.output);

        const video = $('<video>')
            .attr('src', src)
            .prop('loop', globalLoop)
            .prop('controls', controls)
            .css({
                'width': '100%',
                'display': 'block',
                'cursor': 'pointer'
            })
            .appendTo(container);

        // Apply volume from settings
        const getVolume = () => {
            if (State.variables && State.variables.videoSettings) {
                const master = State.variables.videoSettings.masterVolume !== undefined ? State.variables.videoSettings.masterVolume : 100;
                const video = State.variables.videoSettings.videoVolume !== undefined ? State.variables.videoSettings.videoVolume : 100;
                return (master * video) / 10000; // Convert to 0.0-1.0 range
            }
            return 1.0;
        };
        video[0].volume = getVolume();

        // Add Play Overlay
        const overlay = $('<div>')
            .addClass('play-overlay')
            .append($('<div>').addClass('video-play-btn').append($('<span>').addClass('icon icon-play')))
            .appendTo(container);

        video.attr('playsinline', '');

        // Click to play/pause
        container.on('click', function () {
            if (video[0].paused) {
                video[0].play();
            } else {
                video[0].pause();
            }
        });

        // Overlay Visibility Logic
        video.on('play playing', function () {
            overlay.addClass('hidden');
        });

        video.on('pause ended', function () {
            if (!video[0].ended || globalLoop) {
                overlay.removeClass('hidden');
            }
        });

        // Handle Playback based on settings
        if (globalAutoplay) {
            const playPromise = video[0].play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("[Video] Autoplay blocked, showing play overlay.");
                    overlay.removeClass('hidden');
                });
            }
        } else {
            overlay.removeClass('hidden');
        }
    }
});

/* ================== CHARACTER INTERACTION MACRO =================== */
Macro.add('showActions', {
    handler: function () {
        if (this.args.length < 2) {
            return this.error('showActions requires characterId and location');
        }

        const charId = this.args[0];
        const location = this.args[1];
        const vars = State.variables;

        // Get character and actions
        const character = vars.characters?.[charId];
        const actions = vars.characterActions?.[charId]?.[location] || [];
        const prefs = vars.contentPreferences || {};
        const charStats = character?.stats || {};

        if (!character) {
            $(this.output).append('<p class="no-actions">Character not found.</p>');
            return;
        }

        if (actions.length === 0) {
            $(this.output).append('<p class="no-actions">No actions available here.</p>');
            return;
        }

        const container = $('<div>').addClass('actions-container');
        let visibleActions = 0;

        actions.forEach(action => {
            // Check content tags - if any tag is disabled, hide the action
            const tagBlocked = action.tags && action.tags.some(tag => prefs[tag] === false);
            if (tagBlocked) return;

            // Check stat requirements
            const reqs = action.requirements || {};
            let meetsReqs = true;
            let missingReqs = [];

            for (const [stat, value] of Object.entries(reqs)) {
                if ((charStats[stat] || 0) < value) {
                    meetsReqs = false;
                    missingReqs.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value}`);
                }
            }

            // Create button
            const btn = $('<a>').addClass('action-btn');

            if (meetsReqs) {
                btn.addClass('available')
                    .text(action.label)
                    .attr('data-passage', action.passage)
                    .ariaClick({ namespace: '.macros', one: true }, function () {
                        Engine.play(action.passage);
                    });
            } else {
                btn.addClass('locked')
                    .html(`<span class="icon icon-lock icon-12"></span> ${action.label}`)
                    .attr('title', `Requires: ${missingReqs.join(', ')}`);
            }

            container.append(btn);
            visibleActions++;
        });

        if (visibleActions === 0) {
            $(this.output).append('<p class="no-actions">No actions available.</p>');
        } else {
            $(this.output).append(container);
        }
    }
});

/* ================== UI Event Handlers =================== */
// Reset scroll position on passage change
$(document).on(':passageend', function () {
    const passages = document.getElementById('passages');
    if (passages) {
        passages.scrollTop = 0;
    }
});
/* ================== Location Handlers =================== */

// Helper function for Location Navigation
// Moved here from navigation.js to ensure immediate availability
window.processLocTag = function(tag, $container, passedSetup) {
    // Ensure we have access to setup
    const locSetup = passedSetup || window.setup || {};

    const args = tag.args;
    let locId = args[0];
    let displayName = args[0];
    let passageName = args[1];
    let imagePath = args[2];
    
    // Check if ID exists in database (setup.locations)
    if (locSetup.locations && locSetup.locations[locId]) {
        const dbLoc = locSetup.locations[locId];
        // Use DB values if not overridden
        displayName = args[1] || dbLoc.name; 
        passageName = dbLoc.passage || locId; // If passage not in DB, assume ID is passage
        imagePath = args[2] || dbLoc.image;
    } 
    else {
        // First arg is just display name if 2nd arg exists (Manual Mode)
        if(args.length >= 2) {
            displayName = args[0];
            passageName = args[1];
            imagePath = args[2];
        } else {
            // Fallback: Arg 0 is Passage Name
            passageName = args[0];
        }
    }

    // Default image if missing
    if (!imagePath) imagePath = "assets/system/images/placeholder_loc.png";

    // Create Card HTML
    const $card = $(`
        <div class="location-card">
            <img src="${imagePath}" class="card-bg">
            <div class="gradient-overlay"></div>
            <div class="location-name">${displayName}</div>
        </div>
    `);

    // Click Handler -> Go to Passage
    $card.on('click', function() {
        if(passageName) {
            Engine.play(passageName);
        } else {
            console.error("[Navigation] No passage defined for:", displayName);
        }
    });

    $container.append($card);
};


Macro.add('locationMenu', {
    tags: ['loc'],
    handler: function () {
        const payload = this.payload;
        
        // Create Accordion Container
        const $container = $('<div class="accordion-container"></div>');

        // Process child tags (<<loc>>)
        payload.forEach(tag => {
            if (tag.name === 'loc') {
                // Call global helper from navigation.js
                if(window.processLocTag) {
                    window.processLocTag(tag, $container, setup);
                } else {
                    console.error('[Navigation] processLocTag helper not found!');
                }
            }
        });

        $container.appendTo(this.output);
    }
});

