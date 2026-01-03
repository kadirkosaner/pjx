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
    // Base - Variables, reset, body styles (MUST load first)
    base: [
        'variables',    // CSS custom properties (:root)
        'reset'         // Body, links, scrollbars
    ],

    // Layout - Page structure, topbar, rightbar, passages
    layout: [
        'structure',    // #passages, .page-wrapper, body states
        'topbar',       // Top navigation bar
        'rightbar',     // Right sidebar + stats
        'mainmenu'      // Main menu sliding panel
    ],

    // UI - Reusable components
    ui: [
        'buttons',      // All button variants
        'modals',       // Modal/overlay system
        'tabs',         // Tab navigation
        'forms',        // Inputs, selects, sliders
        'navigation',   // Navigation cards (hover accordion)
        'settings'      // Settings modal controls
    ],

    // Screens - Full page layouts
    screens: [
        'welcome',      // Seductive landing + age modal
        'startscreen',  // Start screen with logo
        'gamesetup'     // Game setup accordion
    ],

    // Systems - Game feature modules
    systems: [
        'phone',        // Phone mockup + full overlay
        'map',          // Map section + full modal
        'wardrobe',     // Wardrobe system
        'relations',    // Relations modal
        'profile',      // Profile system
        'character',    // Character interaction
        'saveload'      // Save/load modal
    ],

    // Utils - Helpers (load last)
    utils: [
        'notifications', // Toast notifications
        'tooltips',      // Tooltip popups
        'animations',    // @keyframes
        'utilities'      // Utility classes (flex, spacing, text, etc.)
    ]
};