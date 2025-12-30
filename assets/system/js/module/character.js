// character.js
window.CharacterInit = function (API) {
    window.CharacterSystem = {
        API: API,

        // Open character modal
        open: function () {
            const vars = this.API.State.variables;

            this.API.Modal.create({
                id: 'character-modal',
                title: 'Character',
                width: '900px',
                tabs: [
                    {
                        id: 'profile',
                        label: 'Profile',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Profile</h3>
                                <p>Your character profile information will appear here.</p>
                            </div>
                        `
                    },
                    {
                        id: 'appearance',
                        label: 'Appearance',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Appearance</h3>
                                <p>Your character appearance details will be shown here.</p>
                            </div>
                        `
                    },
                    {
                        id: 'inventory',
                        label: 'Inventory',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Inventory</h3>
                                <p>Your inventory items will be listed here.</p>
                            </div>
                        `
                    }
                ]
            });
        }
    };
};
