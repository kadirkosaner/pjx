let TooltipAPI = null;
let $globalTooltip = null;

// Initialize
window.TooltipInit = function(API) {
    TooltipAPI = API;
    
    createGlobalTooltip();
    
    // Auto-initialize on passage render
    TooltipAPI.$(document).on(':passagerender', function() {
        setTimeout(function() {
            window.initTooltips();
        }, 100);
    });
};

// Global tooltip popup oluştur (tek seferlik)
function createGlobalTooltip() {
    if (!TooltipAPI) return;
    
    $globalTooltip = TooltipAPI.$('<span class="tooltip-popup"></span>');
    TooltipAPI.$('body').append($globalTooltip);
}

// Global tooltip initialization function
window.initTooltips = function() {
    if (!TooltipAPI || !$globalTooltip) return;
    
    TooltipAPI.$('[data-tooltip]').each(function() {
        const $el = TooltipAPI.$(this);
        
        // Skip if already initialized
        if ($el.data('tooltip-ready')) {
            return;
        }
        
        $el.data('tooltip-ready', true);
        
        $el.on('mouseenter.tooltip', function() {
            const tooltipText = $el.attr('data-tooltip');
            const rect = this.getBoundingClientRect();
            
            $globalTooltip.text(tooltipText);
            
            $globalTooltip.css({
                'top': (rect.bottom + 8) + 'px',
                'left': (rect.left + rect.width / 2) + 'px'
            });
            
            $globalTooltip.addClass('active');
        });
        
        $el.on('mouseleave.tooltip', function() {
            $globalTooltip.removeClass('active');
        });
    });
};