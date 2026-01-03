// stats.js
window.StatsInit = function (API) {
    window.StatsSystem = {
        API: API,

        // Helper: Create stat bar
        createStatBar: function(value, max = 100, color = '#ec4899') {
            const percentage = Math.min(100, (value / max) * 100);
            return `
                <div class="stat-bar-container">
                    <div class="stat-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
                    <span class="stat-bar-text">${Math.round(value)}/${max}</span>
                </div>
            `;
        },

        // Open stats modal
        open: function () {
            const vars = this.API.State.variables;
            const settings = vars.gameSettings || {};
            
            // Calculate fitness
            const fitness = Math.round((vars.upperBody + vars.core + vars.lowerBody + vars.cardio) / 4);
            
            // Calculate looks (simplified for now)
            const looks = Math.round((vars.beauty + vars.clothingScore + fitness + vars.body.appeal) / 4);

            this.API.Modal.create({
                id: 'stats-modal',
                title: 'Stats',
                width: '900px',
                tabs: [
                    {
                        id: 'overview',
                        label: 'Overview',
                        content: `
                            <div class="tab-content-inner stats-overview">
                                <h3><span class="icon icon-chart"></span> Core Stats</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <label>Energy</label>
                                        ${this.createStatBar(vars.energy, vars.energyMax)}
                                    </div>
                                    <div class="stat-item">
                                        <label>Mood</label>
                                        ${this.createStatBar(vars.mood, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Health</label>
                                        ${this.createStatBar(vars.health, 100, '#3b82f6')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Hygiene</label>
                                        ${this.createStatBar(vars.hygiene, 100, '#8b5cf6')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Looks</label>
                                        ${this.createStatBar(looks, 100, '#f59e0b')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Money</label>
                                        <div class="stat-value-large">$${vars.money || 0}</div>
                                    </div>
                                </div>

                                ${settings.trackHunger || settings.trackThirst || settings.trackBladder ? `
                                    <h3><span class="icon icon-heart"></span> Basic Needs</h3>
                                    <div class="stats-grid">
                                        ${settings.trackHunger ? `
                                            <div class="stat-item">
                                                <label>Hunger</label>
                                                ${this.createStatBar(vars.hunger, 100, '#ef4444')}
                                            </div>
                                        ` : ''}
                                        ${settings.trackThirst ? `
                                            <div class="stat-item">
                                                <label>Thirst</label>
                                                ${this.createStatBar(vars.thirst, 100, '#06b6d4')}
                                            </div>
                                        ` : ''}
                                        ${settings.trackBladder ? `
                                            <div class="stat-item">
                                                <label>Bladder</label>
                                                ${this.createStatBar(vars.bladder, 100, '#f59e0b')}
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        `
                    },
                    {
                        id: 'physical',
                        label: 'Physical',
                        content: `
                            <div class="tab-content-inner stats-physical">
                                <h3><span class="icon icon-run"></span> Fitness</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <label>Upper Body</label>
                                        ${this.createStatBar(vars.upperBody, 100, '#ec4899')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Core</label>
                                        ${this.createStatBar(vars.core, 100, '#ec4899')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Lower Body</label>
                                        ${this.createStatBar(vars.lowerBody, 100, '#ec4899')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Cardio</label>
                                        ${this.createStatBar(vars.cardio, 100, '#ec4899')}
                                    </div>
                                </div>

                                <h3><span class="icon icon-personal"></span> Body Measurements</h3>
                                <div class="body-measurements">
                                    <div class="measurement-row">
                                        <span>Height:</span> <strong>${vars.body.height} cm</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Weight:</span> <strong>${vars.body.weight.toFixed(1)} kg</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Bust:</span> <strong>${vars.body.bust} cm</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Waist:</span> <strong>${vars.body.waist} cm</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Hips:</span> <strong>${vars.body.hips} cm</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Body Fat:</span> <strong>${vars.body.bodyFat.toFixed(1)}%</strong>
                                    </div>
                                    <div class="measurement-row">
                                        <span>Muscle Mass:</span> <strong>${vars.body.muscleMass.toFixed(1)}%</strong>
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: 'mental',
                        label: 'Mental & Social',
                        content: `
                            <div class="tab-content-inner stats-mental">
                                <h3><span class="icon icon-bio"></span> Mental Stats</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <label>Intelligence</label>
                                        ${this.createStatBar(vars.intelligence, 100, '#8b5cf6')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Focus</label>
                                        ${this.createStatBar(vars.focus, 100, '#8b5cf6')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Creativity</label>
                                        ${this.createStatBar(vars.creativity, 100, '#8b5cf6')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Willpower</label>
                                        ${this.createStatBar(vars.willpower, 100, '#8b5cf6')}
                                    </div>
                                </div>

                                <h3><span class="icon icon-users"></span> Social Stats</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <label>Charisma</label>
                                        ${this.createStatBar(vars.charisma, 100, '#ec4899')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Confidence</label>
                                        ${this.createStatBar(vars.confidence, 100, '#ec4899')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Reputation</label>
                                        ${this.createStatBar(vars.reputation, 100, '#ec4899')}
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: 'skills',
                        label: 'Skills',
                        content: `
                            <div class="tab-content-inner stats-skills">
                                <h3><span class="icon icon-star"></span> Skills & Abilities</h3>
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <label>Social Skills</label>
                                        ${this.createStatBar(vars.skills.social, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Tech Skills</label>
                                        ${this.createStatBar(vars.skills.tech, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Athletic</label>
                                        ${this.createStatBar(vars.skills.athletic, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Creativity</label>
                                        ${this.createStatBar(vars.skills.creativity, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Cooking</label>
                                        ${this.createStatBar(vars.skills.cooking, 100, '#10b981')}
                                    </div>
                                    <div class="stat-item">
                                        <label>Leadership</label>
                                        ${this.createStatBar(vars.skills.leadership, 100, '#10b981')}
                                    </div>
                                </div>
                            </div>
                        `
                    }
                ]
            });
        }
    };
};
