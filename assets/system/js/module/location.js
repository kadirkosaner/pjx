/* ================== Location Background System =================== */
// Automatically apply location background to body based on State.variables.location
// Location is cleared when navigating to a NEW passage, but preserved on reload

let LocationAPI = null;
let currentPassageName = null;

function LocationInit(API) {
    LocationAPI = API;
    console.log('[Location] Initializing location background system');

    function updateLocationBackground() {
        if (!LocationAPI) return;

        const location = LocationAPI.State.variables?.location || null;
        const locationImages = LocationAPI.State.variables?.locationImages || {};

        if (location) {
            document.body.setAttribute('data-location', location);

            // Set dynamic background image if exists in variables
            if (locationImages[location]) {
                const rawPath = locationImages[location];
                // CSS variables with url() resolve relative to the CSS file, not the document.
                // Our CSS is in assets/system/css/. To reach root reliably:
                // ../ (system) -> ../../ (assets) -> ../../../ (root)
                const imagePath = rawPath.startsWith('assets/') ? '../../../' + rawPath : rawPath;

                document.body.style.setProperty('--location-bg-image', `url('${imagePath}')`);
                console.log(`[Location] Background set to: ${location} (${imagePath})`);
            } else {
                document.body.style.setProperty('--location-bg-image', 'none');
                console.log(`[Location] No image found for: ${location}`);
            }
        } else {
            document.body.removeAttribute('data-location');
            document.body.style.setProperty('--location-bg-image', 'none');
            console.log('[Location] Background cleared - no location set');
        }
    }

    // Clear location when navigating to a new passage (but not on reload)
    $(document).on(':passagestart', function () {
        if (!LocationAPI) return;

        const newPassageName = LocationAPI.State.passage;

        // If we're navigating to a DIFFERENT passage, clear location
        if (currentPassageName !== null && currentPassageName !== newPassageName) {
            if (LocationAPI.State.variables) {
                LocationAPI.State.variables.location = null;
                console.log('[Location] Cleared for new passage:', newPassageName);
            }
        }

        // Update current passage name
        currentPassageName = newPassageName;
    });

    // Update background after passage renders (after <<set>> commands run)
    $(document).on(':passagerender', function () {
        updateLocationBackground();
    });

    // Double-check after passage is fully done
    $(document).on(':passageend', function () {
        updateLocationBackground();
    });

    console.log('[Location] Event handlers registered');
}
