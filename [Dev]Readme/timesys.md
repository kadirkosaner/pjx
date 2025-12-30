# Time System Documentation

## Overview
Comprehensive time management system for SugarCube 2 games with automatic age calculation for characters.

## Installation

### 1. StoryInit Setup
Add to your `StoryInit` passage:
```sugarcube
<<set $timeSys to {
    year: 2025,
    month: 1,
    day: 1,
    hour: 8,
    minute: 0,
    weekday: 1
}>>

<<set $timeConfig to {
    monthNames: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    monthDays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    weekdayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    periods: {
        morning: { start: 6, end: 12, name: "Morning" },
        afternoon: { start: 12, end: 18, name: "Afternoon" },
        evening: { start: 18, end: 22, name: "Evening" },
        night: { start: 22, end: 6, name: "Night" }
    }
}>>

<<set $timeSysYear to $timeSys.year>>
```

### 2. Create TimeWidgets Passage
1. Create a new passage named `TimeWidgets`
2. Add the tag `widget` to this passage
3. Paste all widget code from the TimeWidgets section

### 3. Update topbar.js
Replace the time display code in topbar.js with the new version.

---

## Widget Reference

### `<<advanceTime minutes>>`
Advances time by specified minutes.

**Parameters:**
- `minutes` (number): Minutes to advance (default: 30)

**Examples:**
```sugarcube
<<advanceTime 30>>     /* 30 minutes */
<<advanceTime 120>>    /* 2 hours */
<<advanceTime 15>>     /* 15 minutes */
```

**Usage in Links:**
```sugarcube
<<link "Study (2 hours)">>
    <<advanceTime 120>>
    <<goto "Study Result">>
<</link>>
```

---

### `<<advanceDay days>>`
Advances time by specified days.

**Parameters:**
- `days` (number): Days to advance (default: 1)

**Examples:**
```sugarcube
<<advanceDay 1>>       /* Next day */
<<advanceDay 7>>       /* Next week */
<<advanceDay 30>>      /* Next month (approx) */
```

**Auto-handles:**
- Month overflow (31 days → next month)
- Year overflow (December → January next year)
- Leap years
- Weekday cycling

---

### `<<setTime hour minute>>`
Sets time to specific hour and minute. Automatically advances day if time is earlier than current.

**Parameters:**
- `hour` (number): Hour (0-23)
- `minute` (number): Minute (0-59, default: 0)

**Examples:**
```sugarcube
<<setTime 8 0>>        /* 08:00 AM */
<<setTime 14 30>>      /* 02:30 PM */
<<setTime 23 45>>      /* 11:45 PM */
```

**Usage:**
```sugarcube
<<link "Sleep until morning">>
    <<setTime 8 0>>
    <<goto "Morning">>
<</link>>

<<link "Go to bed">>
    <<setTime 23 0>>
    <<goto "Bedroom">>
<</link>>
```

---

### `<<nextPeriod>>`
Skips to the next time period.

**Period Transitions:**
- Morning (06:00) → Afternoon (12:00)
- Afternoon (12:00) → Evening (18:00)
- Evening (18:00) → Night (22:00)
- Night (22:00) → Morning (06:00 next day)

**Example:**
```sugarcube
<<link "Pass time">>
    <<nextPeriod>>
    <<goto "Next Period">>
<</link>>
```

---

### `<<showTime>>`
Displays current time in formatted text.

**Output Format:**
`Weekday - Time, Date`

**Example:**
```sugarcube
Current time: <<showTime>>
/* Output: Monday - 14:30, January 15, 2025 */
```

---

### `<<getPeriod>>`
Gets current period name. Returns value in `_period` variable.

**Returns:** "morning", "afternoon", "evening", or "night"

**Example:**
```sugarcube
<<getPeriod>>
<<if _period == "morning">>
    Good morning!
<<elseif _period == "night">>
    It's late...
<</if>>
```

---

### `<<formatTime>>`
Formats current time as HH:MM. Returns value in `_return` variable.

**Example:**
```sugarcube
<<formatTime>>
Time: <<print _return>>
/* Output: Time: 14:30 */
```

---

### `<<formatDate>>`
Formats current date. Returns value in `_return` variable.

**Example:**
```sugarcube
<<formatDate>>
Date: <<print _return>>
/* Output: Date: January 15, 2025 */
```

---

### `<<getWeekdayName>>`
Gets current weekday name. Returns value in `_return` variable.

**Example:**
```sugarcube
<<getWeekdayName>>
Today is <<print _return>>
/* Output: Today is Monday */
```

---

## Usage Examples

### Basic Time Display
```sugarcube
Current time: <<showTime>>

<<getPeriod>>
It's <<print _period>> time.
```

### Time-Based Events
```sugarcube
<<getPeriod>>
<<switch _period>>
    <<case "morning">>
        The cafeteria is serving breakfast.
    <<case "afternoon">>
        Students are in class.
    <<case "evening">>
        The library is closing soon.
    <<case "night">>
        Everything is closed.
<</switch>>
```

### Activity Menu
```sugarcube
<<link "Study (30 min)">>
    <<advanceTime 30>>
    <<goto "Study">>
<</link>>

<<link "Exercise (1 hour)">>
    <<advanceTime 60>>
    <<goto "Gym">>
<</link>>

<<link "Work (4 hours)">>
    <<advanceTime 240>>
    <<goto "Work">>
<</link>>

<<link "Sleep until morning">>
    <<setTime 8 0>>
    <<goto "Morning">>
<</link>>
```

### Hour Restrictions
```sugarcube
<<if $timeSys.hour >= 22 or $timeSys.hour < 6>>
    The shop is closed at this hour.
<<else>>
    [[Enter Shop]]
<</if>>
```

### Weekday Check
```sugarcube
<<if $timeSys.weekday >= 1 and $timeSys.weekday <= 5>>
    It's a weekday. School is open.
<<else>>
    It's the weekend!
<</if>>
```

---

## Automatic Passage Tags

Add these tags to passages for automatic time setting:

### Period Tags
- `morning` → Sets time to 08:00
- `afternoon` → Sets time to 14:00
- `evening` → Sets time to 19:00
- `night` → Sets time to 23:00

### Time Advance Tags
- `time-30` → Advances 30 minutes
- `time-60` → Advances 1 hour
- `time-120` → Advances 2 hours

**Example:**
Create a passage named "Library" with tags: `afternoon time-60`
- Automatically sets time to 14:00 (afternoon)
- Then advances 1 hour

---

## Character Age System

Characters use `birthYear` instead of static age. Age calculates automatically from `$timeSys.year`.

### Character Setup
```sugarcube
<<set $characters.mother to {
    name: "Sarah Williams",
    birthYear: 1982,
    /* other properties */
}>>
```

### Age Calculation
Age is automatically calculated in Relations system:
```javascript
const age = $timeSys.year - character.birthYear
```

**Example:**
- Birth Year: 1982
- Current Year: 2025
- Age: 43 years old

As `$timeSys.year` advances, all character ages update automatically!

---

## Debug Console Usage

### Set Specific Time
```
Variable: timeSys.hour
Operation: =
Value: 14
```

### Advance Day
```
Variable: timeSys.day
Operation: +=
Value: 1
```

### Change Month
```
Variable: timeSys.month
Operation: =
Value: 6
```

### Set Year
```
Variable: timeSys.year
Operation: =
Value: 2026
```

---

## Tips & Best Practices

### 1. Always Use Widgets
❌ Don't: `<<set $timeSys.hour += 2>>`
✅ Do: `<<advanceTime 120>>`

### 2. Use setTime for Fixed Times
❌ Don't: `<<set $timeSys.hour to 8>>`
✅ Do: `<<setTime 8 0>>`

### 3. Period-Based Content
```sugarcube
<<getPeriod>>
<<include `"Location_" + _period`>>
```

### 4. Time-Based Variables
```sugarcube
<<if $timeSys.hour >= 18>>
    <<set $isEvening to true>>
<</if>>
```

### 5. Character Aging
Always use `birthYear` for characters that age with time progression.

---

## Troubleshooting

### Time not updating in topbar
- Check if `$timeSys` exists
- Verify topbar.js is updated
- Refresh the page

### Widgets not working
- Check if TimeWidgets passage has `widget` tag
- Verify widget names are correct
- Check for typos in widget calls

### Age showing as NaN
- Ensure character has `birthYear` property
- Check if `$timeSys.year` exists
- Verify birthYear is a number

---

## Advanced: Custom Period Creation

Add custom periods to `$timeConfig.periods`:
```sugarcube
<<set $timeConfig.periods.dawn to {
    start: 5,
    end: 7,
    name: "Dawn"
}>>
```

---

## Support

For issues or questions, check:
1. All widgets are in TimeWidgets passage with `widget` tag
2. StoryInit variables are set correctly
3. topbar.js is updated
4. Console for JavaScript errors (F12)