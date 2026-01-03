// SaveLoadAPI will be stored on window to prevent duplicate declarations  
window.SaveLoadAPI = window.SaveLoadAPI || null;

// Initialize
window.SaveloadInit = function (API) {
    window.SaveLoadAPI = API;
    console.log('[SaveLoad] Module initialized - custom save/load ready');

    // Auto-save on passage navigation (except Start passage)
    $(document).on(':passageend', function () {
        const currentPassage = API.State.passage;

        // Don't auto-save on Start (startscreen) or initial passages
        if (currentPassage && currentPassage !== 'Start') {
            try {
                // Generate auto-save title: autosave_DD:MM:YYYY_HH:MM
                const now = new Date();
                const day = now.getDate().toString().padStart(2, '0');
                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                const year = now.getFullYear();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const autoSaveTitle = `autosave_${day}:${month}:${year}_${hours}:${minutes}`;
                
                // Save with metadata containing title
                API.Save.slots.save(0, null, { saveTitle: autoSaveTitle });
                console.log('[SaveLoad] Auto-saved to slot 0 with title:', autoSaveTitle);
            } catch (error) {
                console.error('[SaveLoad] Auto-save failed:', error);
            }
        }
    });
};

// Open custom save/load modal
window.openCustomSaveLoad = function () {
    const API = window.SaveLoadAPI;
    if (!API) return;

    // Remove existing overlay if any
    $('#saveload-overlay').remove();

    // Create modal HTML
    const html = `
        <div id="saveload-overlay" class="overlay overlay-dark">
            <div class="modal saveload-modal">
                <div class="modal-header">
                    <span class="modal-title">Save / Load Game</span>
                    <button class="close-btn" id="saveload-close">
                        <span class="icon icon-close icon-18"></span>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="saveload-grid" id="saveload-grid">
                        <!-- Slots will be rendered here -->
                    </div>
                    <div class="disk-actions">
                        <button id="save-to-disk" class="disk-btn">
                            <span class="icon icon-save icon-16"></span>
                            <span>Save to Disk</span>
                        </button>
                        <button id="load-from-disk" class="disk-btn">
                            <span class="icon icon-upload icon-16"></span>
                            <span>Load from Disk</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    API.$('body').append(html);

    // Render save slots
    renderSaveSlots();

    // Show overlay
    $('#saveload-overlay').addClass('active');

    // Close button event
    $('#saveload-close').on('click', closeCustomSaveLoad);

    // Disk save/load buttons
    $('#save-to-disk').on('click', saveToDisk);
    $('#load-from-disk').on('click', loadFromDisk);

    // Click outside to close
    $('#saveload-overlay').on('click', function (e) {
        if (e.target === this) {
            closeCustomSaveLoad();
        }
    });
};

// Close modal
window.closeCustomSaveLoad = function () {
    $('#saveload-overlay').removeClass('active');
    setTimeout(() => {
        $('#saveload-overlay').remove();
    }, 300);
};

// Render all save slots
function renderSaveSlots() {
    const API = window.SaveLoadAPI;
    if (!API) return;

    const $grid = $('#saveload-grid');
    $grid.empty();

    // Render 8 slots (0-7)
    for (let i = 0; i < 8; i++) {
        const slotHtml = renderSlot(i);
        $grid.append(slotHtml);
    }

    // Attach event listeners
    attachSlotEvents();
}

// Render single slot
function renderSlot(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return '';

    const hasSave = API.Save.slots.has(slotId);
    const isAutoSave = slotId === 0;

    if (hasSave) {
        // Get save data
        const saveData = API.Save.slots.get(slotId);
        
        // Try to get title from metadata, then title, then passage title
        const saveTitle = saveData.metadata?.saveTitle || saveData.title || 'Unknown';
        const saveDate = new Date(saveData.date);
        const dateStr = formatDate(saveDate);

        return `
            <div class="save-slot" data-slot="${slotId}">
                <div class="save-preview">
                    ${isAutoSave ? '<div class="auto-save-badge">AUTO SAVE</div>' : ''}
                    ${!isAutoSave ? `<button class="save-delete-btn" data-slot="${slotId}" title="Delete save">
                        <span>DELETE</span>
                    </button>` : ''}
                    <div class="save-slot-number">Slot ${slotId}</div>
                </div>
                <div class="save-metadata">
                    <div class="save-title">${saveTitle}</div>
                    <div class="save-date">${dateStr}</div>
                </div>
                <div class="save-actions">
                    <button class="save-btn save-btn-load" data-slot="${slotId}">
                        <span class="icon icon-play icon-16"></span>
                        <span>Load</span>
                    </button>
                    <button class="save-btn save-btn-export" data-slot="${slotId}">
                        <span class="icon icon-save icon-16"></span>
                        <span>Export</span>
                    </button>
                </div>
            </div>
        `;
    } else {
        // Empty slot
        return `
            <div class="save-slot save-slot-empty" data-slot="${slotId}">
                <div class="save-preview-empty">
                    <span class="icon icon-save icon-48"></span>
                    <div class="save-slot-number">Slot ${slotId}</div>
                    ${isAutoSave ? '<div class="empty-label">Auto Save Slot</div>' : '<div class="empty-label">Empty Slot</div>'}
                </div>
                <div class="save-actions">
                    <button class="save-btn save-btn-save" data-slot="${slotId}">
                        <span class="icon icon-save icon-16"></span>
                        <span>Save Here</span>
                    </button>
                </div>
            </div>
        `;
    }
}

// Attach event listeners to slot buttons
function attachSlotEvents() {
    // Load buttons
    $('.save-btn-load').on('click', function () {
        const slotId = parseInt($(this).data('slot'));
        loadFromSlot(slotId);
    });

    // Save buttons
    $('.save-btn-save').on('click', function () {
        const slotId = parseInt($(this).data('slot'));
        saveToSlot(slotId);
    });

    // Export buttons
    $('.save-btn-export').on('click', function () {
        const slotId = parseInt($(this).data('slot'));
        exportSlot(slotId);
    });

    // Delete buttons (X button in corner)
    $('.save-delete-btn').on('click', function () {
        const slotId = parseInt($(this).data('slot'));
        deleteSlot(slotId);
    });
}

// Save to slot
function saveToSlot(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Saving to slot:', slotId);

    // Show modal to ask for save title
    if (!window.ModalTabSystem) {
        alert('Modal system not available');
        return;
    }

    // Create input modal
    const inputHTML = `
        <div class="save-title-input-container">
            <label for="save-title-input">Enter a name for this save:</label>
            <input type="text" id="save-title-input" class="save-title-input" 
                   value="Save ${slotId}" maxlength="50" />
        </div>
    `;

    const modalHTML = `
        <div class="overlay overlay-dark modal-overlay active" id="save-title-overlay">
            <div class="modal" style="width: 400px; max-width: 90vw;">
                <div class="modal-header">
                    <span class="modal-title">Save Game</span>
                    <button class="close-btn" id="save-title-close">
                        <span class="icon icon-close icon-18"></span>
                    </button>
                </div>
                <div class="modal-content">
                    ${inputHTML}
                    <div class="modal-actions">
                        <button class="btn btn-secondary" id="save-title-cancel">Cancel</button>
                        <button class="btn btn-primary" id="save-title-confirm">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    API.$('body').append(modalHTML);

    // Focus input
    setTimeout(() => $('#save-title-input').focus().select(), 100);

    const performSave = function() {
        const saveTitle = $('#save-title-input').val().trim() || `Save ${slotId}`;
        
        try {
            // Pass title as metadata object
            API.Save.slots.save(slotId, null, { saveTitle: saveTitle });
            console.log('[SaveLoad] Saved to slot', slotId, 'with title:', saveTitle);

            // Close modal
            $('#save-title-overlay').remove();

            // Re-render slots to show new save
            renderSaveSlots();
        } catch (error) {
            console.error('[SaveLoad] Save failed:', error);
            alert('Save failed: ' + error.message);
        }
    };

    const closeModal = function() {
        $('#save-title-overlay').remove();
    };

    $('#save-title-confirm').on('click', performSave);
    $('#save-title-cancel').on('click', closeModal);
    $('#save-title-close').on('click', closeModal);
    
    // Enter key to save
    $('#save-title-input').on('keypress', function(e) {
        if (e.which === 13) performSave();
    });

    // Click outside to close
    $('#save-title-overlay').on('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// Load from slot
function loadFromSlot(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Loading from slot:', slotId);

    try {
        API.Save.slots.load(slotId);
        console.log('[SaveLoad] Load successful');

        // Close modal
        closeCustomSaveLoad();

        // Close StartScreen if active (needed when loading from startscreen)
        if (window.handleStartScreen) {
            window.handleStartScreen(false);
            console.log('[SaveLoad] StartScreen closed');
        }

        // Force render passage to fix black screen
        if (API.Engine && API.Engine.show) {
            API.Engine.show();
            console.log('[SaveLoad] Engine.show() called');
        }
    } catch (error) {
        console.error('[SaveLoad] Load failed:', error);
        alert('Load failed: ' + error.message);
    }
}

// Delete slot
function deleteSlot(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return;

    // Show custom confirmation modal
    showDeleteConfirmation(slotId);
}

// Format date for display
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Show delete confirmation modal
function showDeleteConfirmation(slotId) {
    const API = window.SaveLoadAPI;
    if (!API || !window.ModalTabSystem) return;

    window.ModalTabSystem.confirm(
        'Delete Save',
        `Are you sure you want to delete save slot ${slotId}? This action cannot be undone.`,
        () => performDelete(slotId), // onConfirm
        null, // onCancel
        'danger' // type
    );
}

// Perform actual delete
function performDelete(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Deleting slot:', slotId);

    try {
        API.Save.slots.delete(slotId);
        console.log('[SaveLoad] Delete successful');

        // Re-render slots
        renderSaveSlots();
    } catch (error) {
        console.error('[SaveLoad] Delete failed:', error);
        alert('Delete failed: ' + error.message);
    }
}

// Export individual slot to disk
function exportSlot(slotId) {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Exporting slot:', slotId);

    try {
        // Load slot data
        const saveData = API.Save.slots.get(slotId);
        if (!saveData) {
            alert('Slot is empty');
            return;
        }

        // Get save title for filename
        const saveTitle = saveData.metadata?.saveTitle || saveData.title || `save_slot_${slotId}`;
        const sanitizedTitle = saveTitle.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();

        // Serialize save data
        const serialized = API.Save.serialize(saveData);

        // Create download
        const blob = new Blob([serialized], { type: 'text/plain;charset=UTF-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizedTitle}.save`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('[SaveLoad] Export successful');
    } catch (error) {
        console.error('[SaveLoad] Export failed:', error);
        alert('Failed to export save: ' + error.message);
    }
}

// Save to disk (download as file)
function saveToDisk() {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Saving to disk');

    try {
        // Generate filename with timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `game_save_${timestamp}.save`;
        
        API.Save.export(filename);
        console.log('[SaveLoad] Export successful');
    } catch (error) {
        console.error('[SaveLoad] Export failed:', error);
        alert('Failed to save to disk: ' + error.message);
    }
}

// Load from disk (upload file)
function loadFromDisk() {
    const API = window.SaveLoadAPI;
    if (!API) return;

    console.log('[SaveLoad] Loading from disk');

    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.save';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                API.Save.import(event.target.result);
                console.log('[SaveLoad] Import successful');
                
                // Close modal and reload
                closeCustomSaveLoad();
                
                // Close StartScreen if active
                if (window.handleStartScreen) {
                    window.handleStartScreen(false);
                }
                
                // Force render
                if (API.Engine && API.Engine.show) {
                    API.Engine.show();
                }
            } catch (error) {
                console.error('[SaveLoad] Import failed:', error);
                alert('Failed to load from disk: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}
