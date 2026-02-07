# Bug Analysis: Text Selection on Android Chrome

## Bug Description
On Android mobile Chrome, when clicking "New Game" (or any menu item) on the main menu screen, all text in the status bar and terminal body becomes selected/highlighted. This appears to affect all menu selections.

## Root Cause Analysis

### Findings:

1. **CSS Issue - Line 585 in styles.css:**
   ```css
   @media (max-width: 768px) {
       user-select: all;  /* ❌ This makes ALL text selectable on mobile */
   }
   ```
   This is applied to the `:root` element, making all text selectable on mobile devices.

2. **Missing user-select: none on body:**
   - Line 41 in styles.css has `/*user-select: none;*/` commented out
   - Body element doesn't prevent text selection

3. **Touch Event Handler Disabled:**
   - `InputManager.handleTouch()` exists but is commented out (line 11)
   - Only `handleClick()` is active, which may not prevent text selection on mobile Chrome

4. **preventDefault() Limitation:**
   - `handleClick()` calls `e.preventDefault()` on menu items
   - This prevents default click behavior but may NOT prevent text selection on mobile Chrome
   - Mobile browsers may need `preventDefault()` on `touchstart`/`touchend` events to prevent selection

## Hypotheses

### Hypothesis 1: CSS user-select: all (HIGH CONFIDENCE)
**Theory:** The `user-select: all` in the mobile media query is causing all text to be selectable. When a user taps a menu item, mobile Chrome's touch behavior triggers text selection across the entire page.

**Evidence:**
- `user-select: all` is explicitly set in mobile media query
- Body has `user-select: none` commented out
- Issue only occurs on mobile (Android Chrome)

**Fix:** Remove or change `user-select: all` to `user-select: none` for interactive elements

### Hypothesis 2: Missing Touch Event Prevention (MEDIUM CONFIDENCE)
**Theory:** Mobile Chrome requires `preventDefault()` on touch events (`touchstart`/`touchend`) to prevent text selection, not just on click events.

**Evidence:**
- `handleTouch()` is commented out
- Only `handleClick()` is active
- Mobile Chrome has different touch vs click behavior

**Fix:** Add touch event handlers with `preventDefault()` or use CSS `touch-action: none`

### Hypothesis 3: Menu Item Selection Triggering Browser Selection (MEDIUM CONFIDENCE)
**Theory:** When a menu item is clicked, the navigation/action triggers a DOM update that causes the browser to select all text as a side effect.

**Evidence:**
- Issue happens specifically when menu items are clicked
- Navigation occurs (screen changes)
- Status bar and terminal body both get selected

**Fix:** Ensure `user-select: none` on menu items and prevent selection during navigation

## Validation Plan

### Step 1: Test CSS Fix (Primary)
1. **Remove `user-select: all` from mobile media query**
   - Change line 585 from `user-select: all;` to `user-select: none;`
   - Or remove it entirely

2. **Uncomment `user-select: none` on body**
   - Uncomment line 41: `user-select: none;`

3. **Add `user-select: none` to menu items**
   - Add to `.menu-item` class
   - Add to `.terminal-status` class
   - Add to `.screen` class

4. **Test on Android Chrome:**
   - Click "New Game" on main menu
   - Verify no text selection occurs
   - Test other menu items
   - Verify status bar text doesn't get selected

### Step 2: Test Touch Event Handling (Secondary)
1. **Uncomment and enable `handleTouch()` method**
   - Uncomment line 11 in InputManager.js
   - Ensure `preventDefault()` is called on touch events

2. **Add CSS touch-action**
   - Add `touch-action: manipulation;` to `.menu-item`
   - This prevents double-tap zoom and may help with selection

3. **Test on Android Chrome:**
   - Verify touch events are handled
   - Check if text selection still occurs

### Step 3: Test Menu Item Click Prevention
1. **Add explicit selection prevention in handleClick**
   ```javascript
   handleClick(e) {
       // ... existing code ...
       if (menuItem) {
           e.preventDefault();
           e.stopPropagation();
           // Prevent text selection
           window.getSelection().removeAllRanges();
           // ... rest of code
       }
   }
   ```

2. **Test on Android Chrome:**
   - Verify selection is cleared on click

### Step 4: Comprehensive Testing
Test the following scenarios on Android Chrome:
- [ ] Click "New Game" - no text selection
- [ ] Click "Load Game" - no text selection  
- [ ] Click "Credits" - no text selection
- [ ] Navigate through game menus - no text selection
- [ ] Long press on menu items - no text selection
- [ ] Verify text input fields still work (name input, etc.)

## Recommended Fix Order

1. **Immediate Fix:** Remove `user-select: all` and add `user-select: none` to body and menu elements
2. **Secondary Fix:** Add `touch-action: manipulation` to menu items
3. **Tertiary Fix:** Add explicit selection clearing in click handler if needed

## Files to Modify

1. `styles.css`:
   - Line 41: Uncomment `user-select: none;`
   - Line 585: Change `user-select: all;` to `user-select: none;` or remove
   - Add `user-select: none;` to `.menu-item`, `.terminal-status`, `.screen`

2. `js/core/InputManager.js` (if needed):
   - Uncomment touch handler or add selection clearing
