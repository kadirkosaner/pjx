// JS Module Configuration - Categorized Structure
window.SystemModules = {
    // Utils - Base systems and helpers (load first)
    utils: [
        'modal',        // Base modal system (ModalTabSystem)
        'tooltip',      // Tooltip helper
        'notification', // Toast notification helpers
        'accordion'     // Event binding helper
    ],

    // UI - Passage render driven components
    ui: [
        'topbar',       // Top navigation bar
        'rightbar',     // Right sidebar
        'phone',        // Phone overlay
        'map',          // Map overlay (injects into rightbar)
        'startscreen',  // Start screen handler
        'mainmenu',     // Main menu sliding panel
        'debug'         // Debug floating panel
    ],

    // Modal - Modal.create() based dialogs
    modal: [
        'saveload',     // Save/Load modal
        'settings',     // Settings modal (tabs)
        'stats',        // Stats modal (tabs)
        'relations',    // Relations modal
        'character',    // Character modal (tabs)
        'journal'       // Journal modal (tabs)
    ],

    // System - Core game logic
    system: [
        'wardrobe',     // Wardrobe macro handler
        'location'      // Location background handler
    ]
};

// CSS Module Configuration - Load order matters!
window.SystemCSS = {
    // Core - MUST load first (variables before everything)
    core: [
        'variables',
        'reset',
        'layout'
    ],

    // Components - UI building blocks
    components: [
        'buttons',
        'modals',
        'navigation',
        'sidebar',
        'tabs',
        'forms',
        'tooltips'
    ],

    // Features - Game systems
    features: [
        'wardrobe',
        'map',
        'relations',
        'profile',
        'character',
        'saveload'
    ],

    // Pages - Full page layouts
    pages: [
        'welcome',
        'startscreen',
        'settings'
    ],

    // Utilities - Load last (animations, responsive)
    utilities: [
        'animations',
        'responsive'
    ],

    // Existing - Legacy CSS files
    existing: [
        'dialog',
        'debug',
        'icons'
    ]
};