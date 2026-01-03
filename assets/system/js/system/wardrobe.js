/**
 * Wardrobe System Module
 * Renders the wardrobe UI and handles clothing management
 */

let WardrobeAPI = null;
let currentCategory = 'tops';
let selectedItem = null;
let wardrobeContainer = null;

// Category to slot mapping
const categoryToSlot = {
    tops: 'top',
    bottoms: 'bottom',
    dresses: 'dress',
    shoes: 'shoes',
    socks: 'socks',
    earrings: 'earrings',
    necklaces: 'necklace',
    bracelets: 'bracelet',
    bras: 'bra',
    panties: 'panty'
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSetup() {
    if (typeof window !== 'undefined' && window.setup) return window.setup;
    if (typeof SugarCube !== 'undefined' && SugarCube.setup) return SugarCube.setup;
    if (typeof setup !== 'undefined') return setup;
    return {};
}

function getState() {
    if (typeof window !== 'undefined' && window.State) return window.State;
    if (typeof SugarCube !== 'undefined' && SugarCube.State) return SugarCube.State;
    if (typeof State !== 'undefined') return State;
    return { variables: {} };
}

function initializePlayerWardrobe() {
    // Better state detection
    const S = getState();
    if (!S || !S.variables || !S.variables.wardrobe) {
        console.warn('[Wardrobe] initializePlayerWardrobe: State or $wardrobe not ready');
        return;
    }
    const wardrobe = S.variables.wardrobe;
    
    // Check if categories exist
    const setupObj = getSetup();
    const clothingData = setupObj.clothingData || {};
    const owned = [];
    
    // Debug log
    const catKeys = Object.keys(clothingData);
    console.log('[Wardrobe] initializePlayerWardrobe called. ClothingData categories:', catKeys);
    
    if (catKeys.length === 0) {
        console.warn('[Wardrobe] initializePlayerWardrobe: No clothing data found in setup.clothingData!');
        return;
    }
    
    catKeys.forEach(category => {
        const items = clothingData[category] || [];
        console.log(`[Wardrobe] - Category "${category}": ${items.length} items`);
        items.forEach(item => {
            if (item.startOwned && !owned.includes(item.id)) {
                owned.push(item.id);
            }
        });
    });
    
    wardrobe.owned = owned;
    console.log('[Wardrobe] Population complete. Total owned items:', owned.length);
    return owned.length;
}

// Export immediately for use in Init passages
getSetup().initializePlayerWardrobe = initializePlayerWardrobe;

function ownsClothing(itemId) {
    if (!WardrobeAPI) return false;
    return WardrobeAPI.State.variables.wardrobe?.owned?.includes(itemId) || false;
}

function getClothingById(itemId) {
    const clothingData = getSetup().clothingData || {};
    for (const category of Object.keys(clothingData)) {
        const items = clothingData[category] || [];
        const item = items.find(i => i.id === itemId);
        if (item) return item;
    }
    return null;
}

function getEquippedItem(slot) {
    if (!WardrobeAPI) return null;
    const itemId = WardrobeAPI.State.variables.wardrobe?.equipped?.[slot];
    if (!itemId) return null;
    return getClothingById(itemId);
}

function calculateTotalLooks() {
    if (!WardrobeAPI) return 0;
    const equipped = WardrobeAPI.State.variables.wardrobe?.equipped || {};
    let total = 0;
    Object.values(equipped).forEach(itemId => {
        const item = getClothingById(itemId);
        if (item) total += item.looks || 0;
    });
    return total;
}

function getOverallStyle() {
    if (!WardrobeAPI) return { text: 'Normal', color: '#22c55e' };
    const equipped = WardrobeAPI.State.variables.wardrobe?.equipped || {};
    let revealingCount = 0;
    Object.values(equipped).forEach(itemId => {
        const item = getClothingById(itemId);
        if (item?.tags?.includes('revealing') || item?.tags?.includes('sexy')) {
            revealingCount++;
        }
    });
    if (revealingCount >= 3) return { text: 'Provocative', color: '#ef4444' };
    if (revealingCount >= 1) return { text: 'Revealing', color: '#f59e0b' };
    return { text: 'Normal', color: '#22c55e' };
}

// ============================================
// INTERNAL FUNCTIONS
// ============================================

function getCategoryItems(categoryId) {
    return getSetup().clothingData?.[categoryId] || [];
}

function getItemById(itemId) {
    return getClothingById(itemId);
}

function ownsItem(itemId) {
    return ownsClothing(itemId);
}

function equipItem(itemId) {
    if (!WardrobeAPI) return;
    const item = getItemById(itemId);
    if (!item || !ownsItem(itemId)) return;

    const slot = categoryToSlot[currentCategory] || null;
    if (!slot) return;

    const wardrobe = WardrobeAPI.State.variables.wardrobe;

    if (slot === 'dress') {
        delete wardrobe.equipped.top;
        delete wardrobe.equipped.bottom;
    }
    if (slot === 'top' || slot === 'bottom') {
        delete wardrobe.equipped.dress;
    }

    wardrobe.equipped[slot] = itemId;
    selectedItem = item;
    showToast(`Equipped: ${item.name}`);
    renderAll();
}

function unequipSlot(slot) {
    if (!WardrobeAPI) return;
    const wardrobe = WardrobeAPI.State.variables.wardrobe;
    const itemId = wardrobe.equipped[slot];
    const item = getItemById(itemId);
    delete wardrobe.equipped[slot];
    if (item) showToast(`Removed: ${item.name}`);
    renderAll();
}

function showToast(message) {
    const toast = wardrobeContainer?.querySelector('.wardrobe-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

const defaultCategories = [
    { group: "Outerwear", items: [
        { id: "tops", name: "Tops", slot: "top" },
        { id: "bottoms", name: "Bottoms", slot: "bottom" },
        { id: "dresses", name: "Dresses", slot: "dress" },
        { id: "shoes", name: "Shoes", slot: "shoes" },
        { id: "socks", name: "Socks", slot: "socks" }
    ]},
    { group: "Accessories", items: [
        { id: "earrings", name: "Earrings", slot: "earrings" },
        { id: "necklaces", name: "Necklaces", slot: "necklace" },
        { id: "bracelets", name: "Bracelets", slot: "bracelet" }
    ]},
    { group: "Underwear", items: [
        { id: "bras", name: "Bras", slot: "bra" },
        { id: "panties", name: "Panties", slot: "panty" }
    ]}
];

function renderCategories() {
    const container = wardrobeContainer?.querySelector('.categories');
    if (!container) return;

    let categories = getSetup().wardrobeCategories;
    
    // Fallback if setup is not yet populated
    if (!categories || categories.length === 0) {
        console.warn('[Wardrobe] Categories missing in setup, using defaults');
        categories = defaultCategories;
    }

    console.log('[Wardrobe] renderCategories: categories count:', categories.length);
    let html = '';

    categories.forEach((group, gi) => {
        html += `<div class="category-group-title">${group.group}</div>`;
        group.items.forEach(cat => {
            const count = getCategoryItems(cat.id).filter(i => ownsItem(i.id)).length;
            const active = cat.id === currentCategory ? 'active' : '';
            html += `
                <div class="category-item ${active}" data-category="${cat.id}">
                    <span class="category-name">${cat.name}</span>
                    <span class="category-count">${count}</span>
                </div>
            `;
        });
        if (gi < categories.length - 1) {
            html += '<div class="category-divider"></div>';
        }
    });

    container.innerHTML = html;

    container.querySelectorAll('.category-item').forEach(el => {
        el.addEventListener('click', () => {
            currentCategory = el.dataset.category;
            selectedItem = null;
            renderAll();
        });
    });
}

function renderClothingGrid() {
    if (!WardrobeAPI) return;
    const container = wardrobeContainer?.querySelector('.clothing-grid');
    const titleEl = wardrobeContainer?.querySelector('.panel-title');
    if (!container) return;

    const items = getCategoryItems(currentCategory).filter(i => ownsItem(i.id));
    const setupObj = getSetup();
    console.log(`[Wardrobe] renderClothingGrid: currentCategory=${currentCategory}, items found=${items.length}`);
    console.log(`[Wardrobe] renderClothingGrid: clothingData categories:`, Object.keys(setupObj.clothingData || {}).join(', '));
    
    const slot = categoryToSlot[currentCategory] || null;
    const equippedId = WardrobeAPI.State.variables.wardrobe?.equipped?.[slot];

    const categories = getSetup().wardrobeCategories || [];
    const catInfo = categories.flatMap(g => g.items).find(c => c.id === currentCategory);
    if (titleEl) titleEl.textContent = catInfo?.name || '';

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-message">No items found in this category.</div>';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="clothing-item ${equippedId === item.id ? 'equipped' : ''}" data-id="${item.id}">
            <img class="clothing-img" src="${item.image}" alt="${item.name}">
            <span class="clothing-looks">+${item.looks}</span>
            <div class="clothing-quality ${item.quality.toLowerCase()}"></div>
        </div>
    `).join('');

    container.querySelectorAll('.clothing-item').forEach(el => {
        el.addEventListener('click', () => {
            const itemId = el.dataset.id;
            if (equippedId === itemId) {
                unequipSlot(slot);
                selectedItem = null;
            } else {
                equipItem(itemId);
            }
        });
    });
}

function renderSelectedInfo() {
    const container = wardrobeContainer?.querySelector('.selected-info');
    if (!container) return;

    if (!selectedItem) {
        container.classList.remove('visible');
        return;
    }

    container.classList.add('visible');
    container.querySelector('.selected-img').src = selectedItem.image;
    container.querySelector('.selected-name').textContent = selectedItem.name;
    container.querySelector('#selected-style').textContent = 
        selectedItem.tags?.includes('revealing') || selectedItem.tags?.includes('sexy') ? 'Revealing' : 'Normal';
    container.querySelector('#selected-style').className = 
        'style-tag ' + (selectedItem.tags?.includes('revealing') || selectedItem.tags?.includes('sexy') ? 'revealing' : 'normal');
    container.querySelector('.selected-brand').textContent = selectedItem.brand;
    container.querySelector('.selected-desc').textContent = selectedItem.desc;
    container.querySelector('#selected-quality').textContent = selectedItem.quality;
    container.querySelector('#selected-looks').textContent = '+' + selectedItem.looks;
}

function renderWearingSlots() {
    console.log('[Wardrobe] renderWearingSlots called. WardrobeAPI:', WardrobeAPI);
    if (!WardrobeAPI) {
        console.warn('[Wardrobe] WardrobeAPI is null/undefined in renderWearingSlots');
        return;
    }
    const container = wardrobeContainer?.querySelector('.wearing-slots');
    if (!container) return;

    const slotLabels = getSetup().slotLabels || {};
    // Check state availability
    if (!WardrobeAPI.State) {
        console.error('[Wardrobe] WardrobeAPI.State is undefined!', WardrobeAPI);
        return;
    }
    const equipped = WardrobeAPI.State.variables.wardrobe?.equipped || {};

    function renderSlot(slot) {
        const itemId = equipped[slot];
        const item = itemId ? getItemById(itemId) : null;
        return `
            <div class="wearing-slot ${!item ? 'empty' : ''}" data-slot="${slot}">
                <div class="wearing-slot-img">${item ? `<img src="${item.image}">` : ''}</div>
                <div class="wearing-slot-info">
                    <div class="wearing-slot-category">${slotLabels[slot] || slot}</div>
                    <div class="wearing-slot-name">${item ? item.name : 'Empty'}</div>
                </div>
                ${item ? `<button class="wearing-slot-remove" data-slot="${slot}">✕</button>` : ''}
            </div>
        `;
    }

    let html = '<div class="slots-section-title">Outerwear</div>';
    html += ['top', 'bottom', 'dress', 'shoes', 'socks'].map(renderSlot).join('');
    html += '<div class="slots-section-title">Accessories</div>';
    html += ['earrings', 'necklace', 'bracelet'].map(renderSlot).join('');
    html += '<div class="slots-section-title">Underwear</div>';
    html += ['bra', 'panty'].map(renderSlot).join('');

    container.innerHTML = html;

    container.querySelectorAll('.wearing-slot:not(.empty)').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.classList.contains('wearing-slot-remove')) return;
            const slot = el.dataset.slot;
            const catId = Object.keys(categoryToSlot).find(k => categoryToSlot[k] === slot);
            if (catId) {
                currentCategory = catId;
                renderAll();
            }
        });
    });

    container.querySelectorAll('.wearing-slot-remove').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            unequipSlot(el.dataset.slot);
        });
    });
}

function renderStats() {
    const totalLooksEl = wardrobeContainer?.querySelector('#total-looks');
    const styleTextEl = wardrobeContainer?.querySelector('#style-text');

    if (totalLooksEl) {
        totalLooksEl.textContent = '+' + calculateTotalLooks();
    }

    if (styleTextEl) {
        const style = getOverallStyle();
        styleTextEl.textContent = style.text;
        styleTextEl.className = 'stat-value ' + style.text.toLowerCase();
    }
}

function renderOutfits() {
    if (!WardrobeAPI) return;
    const container = wardrobeContainer?.querySelector('.outfits-grid');
    if (!container) return;

    const outfits = WardrobeAPI.State.variables.wardrobe?.outfits || [];

    container.innerHTML = outfits.map((outfit, i) => {
        if (!outfit) {
            return `<div class="outfit-slot empty" data-index="${i}"><span class="outfit-add">+</span></div>`;
        }
        return `
            <div class="outfit-slot" data-index="${i}">
                <button class="outfit-delete" data-index="${i}">✕</button>
                <input type="text" class="outfit-name-input" value="${outfit.name}" size="1" data-index="${i}">
                <div class="outfit-actions">
                    <button class="outfit-btn" data-action="save" data-index="${i}">Save</button>
                    <button class="outfit-btn primary" data-action="wear" data-index="${i}">Wear</button>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.outfit-slot.empty').forEach(el => {
        el.addEventListener('click', () => createOutfit(parseInt(el.dataset.index)));
    });

    container.querySelectorAll('.outfit-delete').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteOutfit(parseInt(el.dataset.index));
        });
    });

    container.querySelectorAll('.outfit-name-input').forEach(el => {
        el.addEventListener('change', () => {
            const idx = parseInt(el.dataset.index);
            const wardrobe = WardrobeAPI.State.variables.wardrobe;
            if (wardrobe.outfits[idx]) {
                wardrobe.outfits[idx].name = el.value;
            }
        });
    });

    container.querySelectorAll('.outfit-btn').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.index);
            if (el.dataset.action === 'save') saveOutfit(idx);
            if (el.dataset.action === 'wear') wearOutfit(idx);
        });
    });
}

function createOutfit(index) {
    if (!WardrobeAPI) return;
    
    if (window.ModalTabSystem && window.ModalTabSystem.prompt) {
        window.ModalTabSystem.prompt(
            'Create Outfit',
            'Enter a name for this outfit:',
            'My Outfit',
            function(name) {
                const wardrobe = WardrobeAPI.State.variables.wardrobe;
                wardrobe.outfits[index] = {
                    name: name,
                    equipped: { ...wardrobe.equipped }
                };
                showToast(`Created: ${name}`);
                renderOutfits();
            }
        );
    } else {
        // Fallback to browser prompt
        const name = prompt('Enter outfit name:');
        if (name) {
            const wardrobe = WardrobeAPI.State.variables.wardrobe;
            wardrobe.outfits[index] = {
                name: name,
                equipped: { ...wardrobe.equipped }
            };
            showToast(`Created: ${name}`);
            renderOutfits();
        }
    }
}

function saveOutfit(index) {
    if (!WardrobeAPI) return;
    const wardrobe = WardrobeAPI.State.variables.wardrobe;
    const outfit = wardrobe.outfits[index];
    if (outfit) {
        outfit.equipped = { ...wardrobe.equipped };
        showToast(`Saved: ${outfit.name}`);
    }
}

function deleteOutfit(index) {
    if (!WardrobeAPI) return;
    const wardrobe = WardrobeAPI.State.variables.wardrobe;
    const outfit = wardrobe.outfits[index];
    if (!outfit) return;
    
    if (window.ModalTabSystem && window.ModalTabSystem.confirm) {
        window.ModalTabSystem.confirm(
            'Delete Outfit',
            `Are you sure you want to delete "${outfit.name}"?`,
            function() {
                wardrobe.outfits[index] = null;
                showToast('Outfit deleted');
                renderOutfits();
            },
            null,
            'danger'
        );
    } else {
        // Fallback to browser confirm
        if (confirm(`Delete "${outfit.name}"?`)) {
            wardrobe.outfits[index] = null;
            showToast('Outfit deleted');
            renderOutfits();
        }
    }
}

function wearOutfit(index) {
    if (!WardrobeAPI) return;
    const wardrobe = WardrobeAPI.State.variables.wardrobe;
    const outfit = wardrobe.outfits[index];
    if (outfit?.equipped) {
        wardrobe.equipped = { ...outfit.equipped };
        showToast(`Wearing: ${outfit.name}`);
        renderAll();
    }
}

function renderAll() {
    renderCategories();
    renderClothingGrid();
    renderSelectedInfo();
    renderWearingSlots();
    renderStats();
    renderOutfits();
}

function createWardrobeHTML() {
    return `
        <div class="wardrobe-container">
            <div class="wardrobe-header">
                <a href="#" class="back-link" data-passage="fhBedroom">
                    <i class="icon icon-chevron-left"></i> Bedroom
                </a>
                <div class="wardrobe-title">Wardrobe</div>
                <button class="wear-return-btn">
                    Wear this outfit <i class="icon icon-chevron-right" style="margin-left: 5px; width: 12px; height: 12px;"></i>
                </button>
            </div>

            <div class="wardrobe-main">
                <div class="categories" id="categories"></div>

                <div class="middle-column">
                    <div class="clothing-panel">
                        <div class="panel-header">
                            <span class="panel-title">Tops</span>
                        </div>
                        <div class="clothing-grid" id="clothing-grid"></div>
                        <div class="selected-info">
                            <div class="selected-header">
                                <div class="selected-thumb"><img class="selected-img" src="" alt=""></div>
                                <div class="selected-details">
                                    <div class="selected-name-row">
                                        <span class="selected-name"></span>
                                        <span class="style-tag" id="selected-style"></span>
                                    </div>
                                    <div class="selected-brand"></div>
                                    <div class="selected-desc"></div>
                                </div>
                            </div>
                            <div class="selected-meta">
                                <span>Quality: <span class="meta-value" id="selected-quality"></span></span>
                                <span>Looks: <span class="meta-value" id="selected-looks"></span></span>
                            </div>
                        </div>
                    </div>

                    <div class="outfits-section">
                        <div class="outfits-title">Quick Outfits</div>
                        <div class="outfits-grid"></div>
                    </div>
                </div>

                <div class="wearing-panel">
                    <div class="wearing-header"><div class="wearing-title">Currently Wearing</div></div>
                    <div class="wearing-slots"></div>
                    <div class="stats-summary">
                        <div class="stat-item">
                            <div class="stat-label">Total Looks</div>
                            <div class="stat-value looks" id="total-looks">+0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Style</div>
                            <div class="stat-value" id="style-text">Normal</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="wardrobe-toast"></div>
    `;
}

// ============================================
// MACRO HANDLER
// ============================================

function wardrobeMacroHandler(output) {
    const $wrapper = $(document.createElement('div'));
    $wrapper.addClass('wardrobe-wrapper');
    $wrapper.html(createWardrobeHTML());
    $wrapper.appendTo(output);

    wardrobeContainer = $wrapper.find('.wardrobe-container')[0];
    
    // Add special class to body to help CSS target the passage width
    document.body.classList.add('wardrobe-active');

    // Robust Initial Check
    const S = getState();
    const setupObj = getSetup();
    const wardrobe = S.variables.wardrobe;
    const clothingData = setupObj.clothingData || {};

    console.log('[Wardrobe] Macro Handler Check: clothingData categories:', Object.keys(clothingData).length);
    console.log('[Wardrobe] Macro Handler Check: wardrobe.owned count:', wardrobe?.owned?.length || 0);

    // If owned is empty, try to initialize (Data might have loaded late)
    if (wardrobe && (!wardrobe.owned || wardrobe.owned.length === 0)) {
        console.log('[Wardrobe] Wardrobe empty or not initialized. Running initializePlayerWardrobe...');
        let populatedCount = initializePlayerWardrobe();
        
        // DEBUG FALLBACK: If still empty, add dummy items to verify UI
        if (populatedCount === 0) {
            console.warn('[Wardrobe] initializePlayerWardrobe found no items. Adding DEBUG items.');
            const debugItem = {
                 id: 'debug_top', 
                 name: 'Debug Top', 
                 image: 'assets/content/clothing/tops/crop_black.jpg', 
                 looks: 1, 
                 quality: 'Common', 
                 startOwned: true 
            };
            
            const setupObj = getSetup();
            if (!setupObj.clothingData) setupObj.clothingData = {};
            if (!setupObj.clothingData.tops) setupObj.clothingData.tops = [];
            setupObj.clothingData.tops.push(debugItem);
            
            populatedCount = initializePlayerWardrobe(); // Retry
        }
    }

    $wrapper.find('.back-link').on('click', function(e) {
        e.preventDefault();
        document.body.classList.remove('wardrobe-active');
        const passage = $(this).data('passage');
        if (passage && WardrobeAPI) {
             WardrobeAPI.Engine.play(passage);
        }
    });

    $wrapper.find('.wear-return-btn').on('click', function(e) {
        e.preventDefault();
        // Saving is automatic via state, so we just navigate back
        document.body.classList.remove('wardrobe-active');
        if (WardrobeAPI) {
             WardrobeAPI.Engine.play('fhBedroom');
        }
    });

    setTimeout(() => renderAll(), 0);
}

// ============================================
// INIT FUNCTION (called by loader)
// ============================================

function WardrobeInit(API) {
    console.log('[Wardrobe] WardrobeInit called with API:', API);
    WardrobeAPI = API;
    
    // Export helper functions to setup
    const s = getSetup();
    s.initializePlayerWardrobe = initializePlayerWardrobe;
    s.ownsClothing = ownsClothing;
    s.getClothingById = getClothingById;
    s.getEquippedItem = getEquippedItem;
    s.calculateTotalLooks = calculateTotalLooks;
    s.getOverallStyle = getOverallStyle;
    
    console.log('[Wardrobe] Helper functions exported');
}

// Export to window for macro access
window.wardrobeModule = {
    macroHandler: wardrobeMacroHandler
};