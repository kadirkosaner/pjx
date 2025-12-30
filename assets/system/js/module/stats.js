// stats.js
window.StatsInit = function (API) {
    window.StatsSystem = {
        API: API,

        // Open stats modal
        open: function () {
            const vars = this.API.State.variables;

            this.API.Modal.create({
                id: 'stats-modal',
                title: 'Stats',
                width: '900px',
                tabs: [
                    {
                        id: 'overview',
                        label: 'Overview',
                        content: `
                            <div class="tab-content-inner">
                                <h3>General Stats</h3>
                                <div style="display: grid; gap: 10px; padding: 10px;">
                                    <div>Money: ${vars.money || 0}</div>
                                    <div>Energy: ${vars.energy || 0}</div>
                                    <div>Health: ${vars.health || 0}</div>
                                    <div>Mood: ${vars.mood || 0}</div>
                                    <div>Arousal: ${vars.arousal || 0}</div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: 'skills',
                        label: 'Skills',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Skills & Abilities</h3>
                                <p>Your skills and abilities will be displayed here.</p>
                            </div>
                        `
                    },
                    {
                        id: 'achievements',
                        label: 'Achievements',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Achievements</h3>
                                <p>Your unlocked achievements will be shown here.</p>
                            </div>
                        `
                    }
                ]
            });
        }
    };
};
