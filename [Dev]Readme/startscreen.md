# START SCREEN SYSTEM
A simple start screen that shows only the main menu, hiding all other UI elements.

## USAGE

Create a passage with the `startscreen` tag:

### Example: Start Passage
```
:: Start [startscreen]

<<script>>
    // Optional: Set initial variables
    State.variables.gameName = "Your Game Name";
    State.variables.gameVersion = "v1.0.0";
<</script>>
```

When player enters a passage with `startscreen` tag:
- All UI elements (topbar, rightbar, phone, map) are hidden
- Only main menu is accessible
- Start screen container is displayed

When player moves to another passage without the tag:
- Normal UI elements are restored
- Start screen is removed

## CUSTOMIZATION

Edit `base.css` to change:
- Background gradient
- Title styling
- Button appearance
- Animations

Edit `createStartScreenContainer()` in `startscreen.js` to:
- Add more buttons
- Change layout
- Add images/logos
- Customize content

## NOTES

- Start screen automatically detects passage tags
- No manual show/hide needed
- Works with existing main menu system
- Compatible with all other UI systems
