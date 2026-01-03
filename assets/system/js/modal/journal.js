// journal.js
window.JournalInit = function (API) {
    window.JournalSystem = {
        API: API,

        // Open journal modal
        open: function () {
            const vars = this.API.State.variables;

            this.API.Modal.create({
                id: 'journal-modal',
                title: 'Journal',
                width: '900px',
                tabs: [
                    {
                        id: 'entries',
                        label: 'Entries',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Journal Entries</h3>
                                <div class="journal-list">
                                    <p>No journal entries yet.</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: 'quests',
                        label: 'Quests',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Active Quests</h3>
                                <p>No active quests.</p>
                            </div>
                        `
                    },
                    {
                        id: 'notes',
                        label: 'Notes',
                        content: `
                            <div class="tab-content-inner">
                                <h3>Personal Notes</h3>
                                <p>No notes written.</p>
                            </div>
                        `
                    }
                ]
            });
        }
    };
};
