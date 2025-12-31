window.AccordionInit = function (API) {
    const $ = API.$;

    window.AccordionSystem = {
        API: API,
        
        init: function() {
            console.log('[AccordionSystem] Initializing...');
            this.attachEvents();
        },

        attachEvents: function() {
            // Remove any existing bindings to avoid duplicates
            $(document).off('click.accordion');

            // Bind global event delegate
            $(document).on('click.accordion', '.setup-accordion-header', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Stop bubbling to prevent parent handlers
                
                const $header = $(this);
                const $item = $header.closest('.setup-accordion-item');
                
                // Toggle active state
                $item.toggleClass('active');
                
                // Optional: Scroll to opened item if needed
                // if ($item.hasClass('active')) {
                //     $('html, body').animate({
                //         scrollTop: $item.offset().top - 100
                //     }, 300);
                // }
            });
            console.log('[AccordionSystem] Events attached');
        }
    };

    // Initialize immediately
    window.AccordionSystem.init();
};
