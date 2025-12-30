# Location Background System

A dynamic location-based background system that displays images at the top 30% of the viewport with a smooth gradient fade to black.

## 🎯 Features

- **Automatic background switching** based on `$location` variable
- **Top 30vh coverage** with gradient fade to black
- **Auto-clear system** - location resets on each passage
- **Instant rendering** - no fade animations
- **Glassmorphism UI** - top bar with subtle blur effect over backgrounds

## 🚀 Quick Start

### Basic Usage

Simply set the `$location` variable in any passage:

```twee
:: Castle Hall
<<set $location = "castle">>

You enter the grand castle hall. Torches flicker on the stone walls.

[[Explore the throne room|Throne Room]]
```

### No Location

If you don't set `$location`, the background will be clear:

```twee
:: Menu
This passage has no background.

[[Start Game|Castle Hall]]
```

## 📁 File Structure

```
assets/
├── content/
│   └── locations/
│       └── castle.jpg          # Location background images
└── system/
    ├── css/
    │   └── base.css            # Location CSS rules
    └── js/
        └── module/
            └── location.js      # Auto-clear & update logic
```

## 🎨 Adding New Locations

### Step 1: Add the Image

Place your image in `assets/content/locations/`:
- **Format**: JPG, PNG, or WebP
- **Recommended size**: 1920x1080 or larger
- **Naming**: Use lowercase with hyphens (e.g., `throne-room.jpg`)

### Step 2: Add CSS Rule

Open `assets/system/css/base.css` and add a new rule in the **LOCATION BACKGROUNDS** section:

```css
body[data-location="Throne Room"]::before {
    background-image: url('../../content/locations/throne-room.jpg');
}
```

**Note**: CSS is relative from `assets/system/css/` → `assets/content/locations/`

### Step 3: Use in Game

```twee
:: Throne Room
<<set $location = "Throne Room">>

The throne sits empty, waiting for its rightful ruler.
```

## 📋 Pre-configured Locations

The following locations have CSS rules ready. Just add the images:

| Location | Filename | Path |
|----------|----------|------|
| Living Room | `living-room.jpg` | `assets/content/locations/living-room.jpg` |
| Bedroom | `bedroom.jpg` | `assets/content/locations/bedroom.jpg` |
| Kitchen | `kitchen.jpg` | `assets/content/locations/kitchen.jpg` |
| Bathroom | `bathroom.jpg` | `assets/content/locations/bathroom.jpg` |
| Office | `office.jpg` | `assets/content/locations/office.jpg` |
| Garden | `garden.jpg` | `assets/content/locations/garden.jpg` |
| Street | `street.jpg` | `assets/content/locations/street.jpg` |
| Park | `park.jpg` | `assets/content/locations/park.jpg` |
| Cafe | `cafe.jpg` | `assets/content/locations/cafe.jpg` |
| School | `school.jpg` | `assets/content/locations/school.jpg` |
| Bar | `bar.jpg` | `assets/content/locations/bar.jpg` |
| Restaurant | `restaurant.jpg` | `assets/content/locations/restaurant.jpg` |
| Gym | `gym.jpg` | `assets/content/locations/gym.jpg` |
| Mall | `mall.jpg` | `assets/content/locations/mall.jpg` |
| Beach | `beach.jpg` | `assets/content/locations/beach.jpg` |
| castle | `castle.jpg` | `assets/content/locations/castle.jpg` |
| Castle | `castle.jpg` | `assets/content/locations/castle.jpg` |

## 🎭 How It Works

### Auto-Clear Mechanism

The location system automatically clears `$location` at the start of each passage:

```javascript
// In location.js
$(document).on(':passagestart', function () {
    LocationAPI.State.variables.location = null;
});
```

This means you must explicitly set the location in each passage where you want a background.

### Background Display

1. **Passage starts** → `$location` is cleared
2. **Passage renders** → If you set `$location`, it's applied
3. **CSS updates** → Background appears instantly via `body[data-location]`

### Gradient Overlay

The gradient creates a smooth transition from image to background:

```
0%   → Transparent (image fully visible)
30%  → rgba(0,0,0,0.3)
60%  → rgba(0,0,0,0.6)
85%  → rgba(0,0,0,0.85)
100% → Solid black (#0a0a0a)
```

## ⚙️ Technical Details

### CSS Structure

```css
/* Background image layer */
body::before {
    position: fixed;
    top: 0;
    height: 30vh;
    background-size: cover;
    opacity: 0; /* Hidden by default */
}

/* Gradient overlay */
body::after {
    position: fixed;
    top: 0;
    height: 30vh;
    background: linear-gradient(...);
    opacity: 0; /* Hidden by default */
}

/* Show when location is set */
body[data-location]::before,
body[data-location]::after {
    opacity: 1;
}
```

### JavaScript Module

```javascript
function updateLocationBackground() {
    const location = LocationAPI.State.variables?.location || null;
    
    if (location) {
        document.body.setAttribute('data-location', location);
    } else {
        document.body.removeAttribute('data-location');
    }
}
```

## 🎨 Customization

### Change Height

Edit `base.css` to adjust the background height:

```css
body::before,
body::after {
    height: 40vh;  /* Default: 30vh */
}
```

### Modify Gradient

Adjust the gradient in `base.css`:

```css
body::after {
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(0, 0, 0, 0.5) 50%,
        #0a0a0a 100%
    );
}
```

### Add Transitions (Optional)

If you want fade effects, add transitions:

```css
body::before,
body::after {
    transition: opacity 0.6s ease;
}
```

## 🔧 Troubleshooting

### Background Not Showing

1. **Check console logs**:
   ```
   [Location] Background set to: castle
   ```
   If you see "Background cleared", the location isn't set.

2. **Verify CSS rule exists** for your location name
3. **Check image path** in browser DevTools Network tab
4. **Ensure `$location` is set** in the passage

### Wrong Image Path

If you see `ERR_FILE_NOT_FOUND`:
- CSS path must be `../../content/locations/` (relative from `assets/system/css/`)
- Image must be in `assets/content/locations/`

### Location Persists

If location doesn't clear between passages:
- Check that `location.js` is loaded in `config.js`
- Verify `:passagestart` event is firing

## 💡 Best Practices

1. **Consistent naming**: Use the same casing in CSS and `$location` variable
2. **Optimize images**: Compress images to 100-300KB for web
3. **Test on passage change**: Verify auto-clear works correctly
4. **Similar visual style**: Keep all location images in a consistent style
5. **Top-focused composition**: Ensure important details are in the top 30% of images

## 📝 Example Story

```twee
:: Start
<<set $location = "castle">>

You stand before a massive castle.

[[Enter the castle|Great Hall]]
[[Walk to the garden|Garden]]

:: Great Hall
<<set $location = "castle">>

The great hall is magnificent with its high ceilings.

[[Go to throne room|Throne Room]]
[[Leave castle|Outside]]

:: Garden
<<set $location = "Garden">>

A peaceful garden with blooming flowers.

[[Return to castle|Start]]

:: Outside
No location set here - just darkness.

[[Enter castle again|Start]]
```

## 🎉 Summary

- Set `$location` in each passage where you want a background
- Location auto-clears each passage
- Images display at top 30vh with gradient fade
- No transitions - instant appearance
- Glassmorphism on top bar for elegant overlay
