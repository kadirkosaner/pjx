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
                            <div class="tab-content-inner profile-container">
                                    <div class="profile-card">
                                    <div class="profile-header">
                                        <div class="profile-avatar-wrapper">
                                            <img src="${vars.characters.player.avatar}" class="profile-avatar" alt="Player Avatar">
                                        </div>
                                        <div class="profile-identity">
                                            <h2 class="profile-name">
                                                ${vars.characters.player.name} ${vars.characters.player.lastname || ""}
                                            </h2>
                                            <div class="profile-subtitle">
                                                ${2025 - vars.characters.player.birthYear} Years Old
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="profile-body">
                                        <div class="profile-section">
                                            <h3><span class="icon icon-bio"></span> Bio</h3>
                                            <div class="profile-text">
                                                ${vars.characters.player.info}
                                            </div>
                                        </div>
                                        
                                        <div class="profile-section">
                                            <h3><span class="icon icon-personal"></span> Personal History & Traits</h3>
                                            <div class="traits-list" id="player-traits-container">
                                                ${vars.characters.player.traits && vars.characters.player.traits.length > 0 
                                                    ? vars.characters.player.traits.map(trait => `
                                                        <div class="trait-card">
                                                            <div class="trait-header">
                                                                <span class="trait-icon-large">
                                                                    <span class="icon ${trait.icon || 'icon-star'}"></span>
                                                                </span>
                                                                <h4 class="trait-name">${trait.name}</h4>
                                                            </div>
                                                            <p class="trait-description">${trait.description || 'No description available.'}</p>
                                                            ${trait.effects ? `
                                                                <div class="trait-effects">
                                                                    <span class="trait-effects-label">Effects:</span>
                                                                    ${Object.entries(trait.effects).map(([key, value]) => 
                                                                        `<span class="trait-effect">${value > 0 ? '+' : ''}${value} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>`
                                                                    ).join('')}
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                    `).join('') 
                                                    : '<div class="traits-empty"><span class="icon icon-info"></span> Traits will appear here after character creation</div>'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
