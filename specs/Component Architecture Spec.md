# Terminal Echo - Component Specification

## Component Architecture

### Base Component Structure

All components must follow this interface: 

```javascript
class Component {
  constructor(config) {
    this.id = config.id || generateId();
    this.element = null;
    this.state = config.initialState || {};
    this.config = config;
  }

  // Lifecycle methods
  render() { /* Returns HTML string or creates DOM element */ }
  mount(container) { /* Attaches to DOM */ }
  unmount() { /* Cleanup */ }
  update(newState) { /* Updates component state */ }
  
  // Event handling
  bindEvents() { /* Attach event listeners */ }
  unbindEvents() { /* Remove event listeners */ }
}
```

## Component Catalog

### 1. StatusBar Component

**Purpose**: Display player stats (HP, XP, Caps, etc.)

**Config**:
```javascript
{
  stats: {
    name: string,
    hp: number,
    maxHp: number,
    xp: number,
    level: number,
    caps: number,
    reputation: string
  },
  visible: boolean
}
```

### 2. ScreenTitle Component

**Purpose**: Centered title, capitalised letters

**Config**:  `{ text: string }`

### 3. ScreenDescription Component

**Purpose**: Narrative text block

**Config**: `{ text: string, centered: boolean }`

### 4. Menu Component

**Purpose**:  Navigable list of items with keyboard/touch support

**Config**:
```javascript
{
  items: [
    { 
      id: string,
      label: string,
      type: 'action' | 'input' | 'attribute' | 'navigation',
      // **Types**:
      // - **action**: Execute function on select
      // - **input**: Text input field
      // - **attribute**: Number adjuster (left/right arrow buttons)
      // - **navigation**: Navigate to another screen
      action: function,
      value: string (optional),
      // default and current value of field input and attribute selector
      hotkey: string (optional),
      disabled: boolean (optional),
      value: any (for input/attribute types)
    }
  ],
  defaultFocusIndex: number,
  onSelect: function,
  allowEmpty: boolean
}
```

**Menu item States**: focused, active, inactive (shown but grayed out and striked through)

### 5. Field input component
**Purpose**: Player name field input


### 6. Two Columns Layout
**Purpose**: Allows to align sub-components in table with two columns.
This component is designed specifically for trading screen, on which each column will contain the title and menu elements. Menu items placed in different columns remain navigable with arrows up and down, i.e. menu remains non-breakable by columns.

On mobile columns are placed one by another.


### 7. EventLog Component

EventLog pinned to the bottom of all screens. Has fixed size and contain 4 last event records. Scrollable.
New record pops up on top, each records starts with prompt-like sign ">".
**Purpose**:  Scrolling history of game events

**Config**:
```javascript
{
  maxEntries: number,
  autoScroll: boolean,
  filters: string[] (optional)
}
```

**Methods**:
- `addEntry(text, type)` - types: 'system', 'dialogue', 'combat', 'loot'

## Screen Specification

### Base Screen Structure

```javascript
class Screen {
  constructor(config) {
    this.name = config.name;
    this.components = [];
    this.eventLog = null; // reference if used
    this.statusBar = null; // reference if used
  }

  // Lifecycle
  init() { /* Initialize components */ }
  enter() { /* Called when screen becomes active */ }
  exit() { /* Cleanup before leaving */ }
  update(deltaTime) { /* Update loop */ }
  
  // Required
  render() { /* Return screen HTML */ }
  handleInput(input) { /* Handle keyboard/touch */ }
}
```

### Screen Layout Template

```javascript
class Screen {
  constructor(config) {
    this.name = config.name;
    this.components = [];
    this.eventLog = null; // reference if used
    this.statusBar = null; // reference if used
  }

  // Lifecycle
  init() { /* Initialize components */ }
  enter() { /* Called when screen becomes active */ }
  exit() { /* Cleanup before leaving */ }
  update(deltaTime) { /* Update loop */ }
  
  // Required
  render() { /* Return screen HTML */ }
  handleInput(input) { /* Handle keyboard/touch */ }
}
```

## Screen Catalog
### 1. Main Screen

**Purpose**: Starting screen

Pseudo code
```
class MainMenu {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle,
      ScreenDescriptor,
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu allows**:
- navigate to NewGameMode
- load game
- print Credits on eventlog

### 2. New Game Mode Selection Screen

**Purpose**: Starting new game -> game mode selection

Pseudo code
```
class NewGameMode {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle,
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu allows**:
- to choose pre scripted mode or AI-generated (disabled option), after navigates to player name screen, after navigates to player name screen
- back to mode selector

### 3. New Game Player Name

**Purpose**: Starting new game -> player name input

Pseudo code
```
class NewGamePlayerName {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle,
      ScreenDesciption,
      FieldInput, //for name
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu allows**:
- Type in player name
- Confirm the name and navigate to player attributes screen
- get back to game mode selection

### 4. New Game Player Attributes allocation
Pseudo code
```
class NewGamePlayerAttributes {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle,
      ScreenDescription,
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu allows**:
- str: "<" <str_value> ">"
  - shows current value, allows increase and decrese it
- int, same as str
- lck, same as str
- Confirm and navigate to the worldmap screen
- Navigate back to player name screen

### 5. World Map Screen
Pseudo code
```
class WorldMapScreen {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle,
      ScreenDescription,
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu has**:
- list of unlocked locations
- navigates to inventory
- opens game menu pop up

Additionally, handles hotkeys:
- i: navigates to inventory
- m or esc: opens game menu pop up

### 6. Location Screen
Pseudo code
```
class LocationScreen {
  constructor(config) {
  ...
    this.components = [
      StatusBar,
      ScreenTitle, # shows Location name
      ScreenDescription, # shows Location desciption
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

**Menu has**:
- list of NPCs to talk to
- travel to another location (navigates to World Map Screen)

Additionally, handles hotkeys:
- i: opens inventory
- m or esc: opens game menu pop up

### 7. Dialogue Screen 
Pseudo code
```
class DialogueScreen {
  constructor(config) {
  ...
    this.components = [
      StatusBar,
      ScreenTitle, # shows NPC's name
      ScreenDescription, # shows current NPC's dialogue text 
      Menu,
      EventLog
    ]
    
  }

  ...
}
```

Once dialogue screen has entered a dialogue node, to render it properly, the logic must:
1. display NPC response
2. Shape menu items from prompts of the destination nodes
3. Those menu items which conditions are not meet must be shown but be inactive (disabled)


### 8. Inventory Screen
Pseudo code
```
class InventoryScreen {
  constructor(config) {
  ...
    this.components = [
      StatusBar,
      ScreenTitle, # Shows Player's name
      ScreenDescription, # Prints all player stat
      Menu, # Players items and ability to a) drop them (if it is not a quest item), b) consume (if it is consumable)
      EventLog
    ]
    
  }

  ...
}
```

Additionally, menu allows get back to previous screen.

### 9. Trading Screen 

Trading screen shows items in NPCs and players inventory and allows to sell them or buy.
As player buies an item it moves from NPCs inventory into player's and player loses appropriate amount of caps.
As player sells and item the same is happening: item moves to NPCs inventory and player gains caps.

Pseudo code
```
class TradeScreen {
  constructor(config) {
  ...
    this.components = [
      StatusBar,
      ScreenTitle, # shows NPC's name - Tradings
      TwoColumnsLayout: {
        LeftColumn: {
          ScreenTitle, # shows NPC's name
          Menu,  # NPC's items with available actions to buy
        },
        RightColumn: {
          ScreenTitle, # shows effective and taken inventory capacity and caps
          Menu,  # Players items and ability to sell
        }
      },
      Menu, # with only option to get back to dialogue node
      EventLog
    ]
    
  }
  ...
}
```


### 10. Game Menu Popup
Screen that shows up ontop of the screen which handled hotkey. Visaully it makes the main screen grayed out and looks as a centered half-sized pop up.

Pseudo code
```
class GameMenuPopup {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle, # Game menu
      Menu,  # Players items and ability to drop them
      EventLog
    ]
    
  }

  ...
}
```
**Menu allows**:
- to main menu
- save game to a file
- close the pop up

### 11. Game Over Popup
Pops up when user's HP hit 0. Visaully it makes the main screen grayed out and looks as a centered half-sized pop up.

Pseudo code
```
class GameMenuPopup {
  constructor(config) {
  ...
    this.components = [
      ScreenTitle, # Game over
      ScreenDescription, # Player died. Explains the reason.
      Menu,  # Players items and ability to drop them
      EventLog
    ]
    
  }

  ...
}
```
**Menu allows**:
- to main menu

## Input Handling Specification

### Keyboard Controls

- **Arrow Up/Down**: Navigate menu items
- **Arrow left/right**: increase a value of a menu item (skills attributes), or switch between merchant stock and user inventory
- **Enter**: Select/Activate
- **Escape**: game menu or back
- **Hotkeys** should not conflict with field input:
  - **i**: user inventory.
  - **m**: game menu
- **Name field input**: 0-9, english letters

### Touch Controls

- **Tap**: Select item
- **Swipe Up/Down**:  Scroll (event log, long menus)
- **Long Press**: Show context (optional)

### Focus Management Rules

1. Always maintain a focused element
2. Visual highlight must be clear
3. Focus cycles (top→bottom→top)
4. Preserve focus on screen transitions when possible
5. Default focus: first enabled menu item

## State Management

### Global State Structure

```javascript
{
  player: {
    name: string,
    str: number,
    int: number,
    lck: number,
    hp: number,
    maxHp: number,
    xp: number,
    level:  number,
    caps: number,
    reputation: string,
    inventory: []
  },
  gameMode: 'scripted' | 'ai-generated',
  currentLocation: string,
  unlocked_locations: ["location_id_1", "location_id_2"],
  currentScreen: string,
  quests: {/*...*/}, // Quest flags, events
  eventHistory: []
}
```

### Component State

Each component maintains internal state isolated from global state.  Communication happens through: 
- Events (via EventBus)
- Props (passed down)
- State updates (callback functions)
```