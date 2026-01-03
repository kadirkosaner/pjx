# 🏗️ PROJECT SYSTEM ANALYSIS & REFERENCE

**Date:** January 2026
**Type:** Deep Technical Audit

This document serves as the **SINGLE SOURCE OF TRUTH** for the project's architecture. All future development MUST adhere to the structures defined below.

---

## 1. � CORE ARCHITECTURE

The project uses a **Hybrid Event-Driven Architecture**:

- **SugarCube Core:** Handles narrative flow, variable state (`State.variables`), and passage rendering.
- **JS Module Layer:** Pure JavaScript modules that listen to SugarCube events (`:passagerender`, `:passageend`) and manipulate the DOM or State directly.

### **Initialization Sequence**

1.  **Bootloader (`story_javascript.js`)**:
    - Loads `config.js`.
    - Injects CSS via `<link>`.
    - Loads JS via `<script>`.
    - **CRITICAL:** Waits for `init()` exports from modules and executes them.

---

## 2. 🌍 LOCATION & NAVIGATION SYSTEM (STRICT SEPARATION)

**Status:** ✅ UNIFIED & STABLE

| Component       | Responsibility          | Source File                  | Key Variables                            |
| :-------------- | :---------------------- | :--------------------------- | :--------------------------------------- |
| **Nav Cards**   | UI Navigation Menu      | `NavigationCards[INIT].twee` | `setup.navCards`                         |
| **Backgrounds** | Visuals (CSS Injection) | `location.js`                | `$location`, `variablesImage[INIT].twee` |
| **Map Overlay** | Interactive City Map    | `map.js`                     | `$imageMap`, `variablesMap[INIT].twee`   |

### **Logic Flow**

1.  **Game Logic:** Setting `<<set $location = "Park">>` in a passage.
2.  **Visuals:** `location.js` detects `$location` change -> Injects `<style>body::before { background-image... }` to Page Head.
3.  **UI:** `NavigationCards[INIT].twee` renders cards like "Central Park" using `<<navMenu>>` and `<<navCard>>` macros.

> **RULE:** Do NOT merge `NavigationCards` and `variablesImage`. They serve different logic layers (Nav Menu vs Background Image).

---

## 3. 👗 WARDROBE SYSTEM

**File:** `assets/system/js/system/wardrobe.js`
**Lines:** ~700

### **State Variables**

- `$wardrobe.owned` (Array<String>): List of Item IDs owned by player.
- `$wardrobe.equipped` (Object): Map of Slot -> Item ID (e.g. `{ top: 'tshirt', bottom: 'jeans' }`).
- `$wardrobe.outfits` (Array): Saved outfits.

### **Public API (`window.wardrobeModule`)**

- `initializePlayerWardrobe()`: Populates `$wardrobe.owned` from `setup.clothingData`.
- `calculateTotalLooks()`: Returns integer sum of all equipped item "looks" stats.
- `getOverallStyle()`: Returns `{ text: 'Revealing'|'Normal', color: Hex }` based on item tags.

### **Dependencies**

- `setup.clothingData`: Must be defined in `System/wardrobe/` passages.
- **Fallback:** If empty, adds `debug_top` (Logic Line 636).

---

## 4. 📱 PHONE SYSTEM

**File:** `assets/system/js/ui/phone.js`
**Trigger:** `:passagerender` (Auto-renders overlay)

### **State Variables**

- `$timeSys` (Object): `{ hour, minute, ... }`. Source of truth for clock.
- `$notificationPhoneMessages` (Int): Badge count for Messages.
- `$notificationPhoneFotogram` (Int): Badge count for Fotogram.
- `$notificationPhoneFinder` (Int): Badge count for Finder.

### **Apps List (Hardcoded in Logic)**

1.  **Camera**
2.  **Calls**
3.  **Messages** (Has Badge)
4.  **Gallery**
5.  **Calendar**
6.  **Fotogram** (Has Badge)
7.  **Finder** (Has Badge)

---

## 5. � RELATIONS SYSTEM

**File:** `assets/system/js/modal/relations.js`

### **State Variables**

- `$characters` (Map<ID, Object>): Stores all Dynamic Data (Affection, Status, Location) for NPCs.
- `$relationGroups` (Array): Defines grouping (e.g., "Family", "School").

### **Stats Tracked (0-100)**

- Love (`#ec4899`)
- Friendship (`#3b82f6`)
- Lust (`#ef4444`)
- Trust (`#10b981`)

### **Logic Detail**

- **Filtering:** Only shows characters where `known === true`.
- **Age Calc:** Dynamically calculated: `$timeSysYear - char.birthYear`.

---

## 6. 📊 STATS SYSTEM

**File:** `assets/system/js/modal/stats.js`

### **State Variables (Read-Only in UI)**

- **Core:** `$energy`, `$mood`, `$health`, `$hygiene`
- **Physical:** `$upperBody`, `$core`, `$lowerBody`, `$cardio`, `$body.*` (measurements)
- **Mental:** `$intelligence`, `$focus`, `$creativity`, `$willpower`
- **Social:** `$charisma`, `$confidence`, `$reputation`
- **Skills:** `$skills.social`, `$skills.tech`, `$skills.cooking`, etc.

### **Calculated Metrics**

- **Fitness:** `Avg($upperBody, $core, $lowerBody, $cardio)`
- **Looks:** `Avg($beauty, $clothingScore, Fitness, $body.appeal)`

---

## 7. ⏱️ TIME SYSTEM

**Definition:** `sugarcube_passages/System/Base/variablesTime[INIT].twee`
**Logic:** `SystemWidgets[Widget].twee`

### **Data Structure (`$timeSys`)**

```javascript
{
    year: 2025,
    month: 1,
    day: 1,
    hour: 8,
    minute: 0,
    weekday: 1
}
```

### **Configuration (`$timeConfig`)**

- Defines Month Names, Days per Month.
- Defines Periods: Morning (6-12), Afternoon (12-18), Evening (18-22), Night (22-6).

---

## 8. 💾 SAVE/LOAD SYSTEM

**File:** `assets/system/js/modal/saveload.js`

### **Features**

- **Auto-Save:** Triggered on `:passageend` (Slot 0). Exception: `Start` passage.
- **Metadata:** Saves `saveTitle` and Timestamp.
- **Export:** Serializes save data to `.save` text file for download.
- **Import:** Reads `.save` file and restores state.

---

## 9. �️ DIRECTORY MAP (Updated)

| Directory                         | Content Type    | Critical Files                                                         |
| :-------------------------------- | :-------------- | :--------------------------------------------------------------------- |
| `assets/system/js/system/`        | **Core Logic**  | `location.js`, `wardrobe.js`                                           |
| `assets/system/js/ui/`            | **Interface**   | `phone.js`, `map.js`, `topbar.js`                                      |
| `assets/system/js/modal/`         | **Popups**      | `relations.js`, `stats.js`, `saveload.js`                              |
| `sugarcube_passages/System/Base/` | **Definitions** | `NavigationCards[INIT]`, `variablesImage[INIT]`, `variablesTime[INIT]` |

---

_Generated by Antigravity - January 2026_
