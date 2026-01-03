// JS Module Configuration - Categorized Structure
window.SystemModules = {
    // Macros - SugarCube macro extensions
    macros: [
        'tooltip'
    ],

    // Core - Base systems loaded in order
    core: [
        'debug',
        'modal',
        'character',
        'stats',
        'settings',
        'journal',
        'relations',
        'notification',
        'phone',
        'topbar',
        'rightbar',
        'mainmenu',
        'startscreen',
        'saveload',
        'location',
        'map',
        'wardrobe',
        'accordion'
    ]
};

// CSS Module Configuration - Load order matters!
window.SystemCSS = {
    // Core - MUST load first (variables before everything)
    core: [
        'core/variables',
        'core/base',
        'core/layout'
    ],

    // Components - UI building blocks
    components: [
        'components/common',
        'components/navigation',
        'components/sidebar',
        'components/ui'
    ],

    // Features - Game systems
    features: [
        'features/map',
        'features/character',
        'features/wardrobe',
        'features/profile',
        'features/relations',
        'features/saveload'
    ],

    // Pages - Full page layouts
    pages: [
        'pages/gamestart',
        'pages/settings'
    ],

    // Responsive - Media queries (load last)
    responsive: [
        'responsive/media-queries'
    ],

    // Legacy - Existing CSS files (keep compatibility)
    legacy: [
        'dialog',
        'debug',
        'icons'
    ]
};