# Source Code Architecture (`src/`)

This directory contains the modern ES module implementation of **FBWG-Editor**.

---

## Directory Overview

```
src/
├── css/                          # CSS Stylesheets
│   ├── main.css                  # Master CSS loader
│   ├── theme.css                 # Photoshop dark theme tokens & component styles
│   ├── vars.css                  # Colors, fonts, and layout variables
│   ├── canvas.css                # Viewport and canvas styling
│   └── displaybar.css            # Legacy bar styles
├── data/                         # Bundled level data
│   └── example_level.json        # Canonical tutorial level data
├── index.html                    # Application HTML shell with #application mount point
├── js/
│   ├── main.js                   # Application bootstrap entry point
│   ├── EditorApp.js              # Central coordinator mounting all subsystems
│   ├── core/                     # Foundational state managers
│   │   └── SelectionManager.js   # Single-object selection & highlight management
│   ├── interface/                # UI Chrome Components
│   │   ├── MenuBar.js            # Top menu bar (File, Edit, View, Level)
│   │   ├── ToolRail.js           # Left vertical toolbar with icon buttons & hotkeys
│   │   ├── ToolOptionsBar.js     # Contextual options strip for active tool
│   │   ├── StatusBar.js          # Bottom status bar (zoom, cursor, doc info)
│   │   ├── dialogs/
│   │   │   └── LevelResizeModal.js # Level resize dialog with boundary pruning warning
│   │   └── dock/
│   │       ├── DockPanel.js      # Collapsible right-side dock container
│   │       ├── LayersPanel.js    # Layer visibility, lock toggles, and selection rules
│   │       └── PropertiesInspector.js # Interactive inspector for selected object
│   ├── level/                    # Data Model & Canonical Serialization
│   │   ├── LevelModel.js         # Core level model (dimensions, tilemap, objects)
│   │   ├── LevelObject.js        # Individual object representation with clone & bounds
│   │   ├── TileMap.js            # 2D grid storage with resize support
│   │   └── serializer.js         # Canonical Tiled JSON import & export routines
│   ├── renderer/                 # Multi-Layer Canvas Rendering
│   │   ├── Camera.js             # Viewport pan, zoom clamping, and coordinate mapping
│   │   ├── CanvasRenderer.js     # 5-canvas layer stack coordinator with pinned content
│   │   └── renderObjects.js      # Procedural Canvas 2D drawers for GIDs and objects
│   └── tools/                    # Tool Subsystem
│       ├── ToolBase.js           # Base class providing lifecycle and event hooks
│       ├── ToolManager.js        # Tool registry, active tool state, and event router
│       ├── SelectTool.js         # Single-object hit-testing and selection
│       ├── PanTool.js            # Workspace canvas panning
│       ├── TileBrushTool.js      # Solid tile painting with drag support
│       ├── SlopeBrushTool.js     # 45° directional slope placement
│       ├── FluidBrushTool.js     # Hazard fluid painting (Water, Lava, Acid)
│       ├── TileEraserTool.js     # Tile erasing
│       ├── ObjectPlaceTool.js    # Universal object stamper (platforms, boxes, levers, spawns, gems)
│       └── TextTool.js           # Text trigger placement and editing
└── public/                       # Static public assets served by Vite
    ├── blank_level.json          # Template for new levels
    └── data/
        └── example_level.json    # Public tutorial level
```

---

## Core Architectural Subsystems

### 1. `EditorApp.js` (Root Coordinator)
`EditorApp` initializes and wires together all major subsystems:
- Creates the `LevelModel`, `Camera`, `SelectionManager`, and `ToolManager`.
- Builds the DOM structure (`MenuBar`, `ToolOptionsBar`, `ToolRail`, `viewport`, `DockPanel`, `StatusBar`).
- Handles file I/O operations (open JSON, save/export, export URL-safe clipboard, tutorial level reset).
- Coordinates keyboard shortcuts (<kbd>Ctrl+S</kbd>, <kbd>Ctrl+Z</kbd>, <kbd>Delete</kbd>, single-key tool switches).

### 2. Multi-Layer Canvas Pipeline (`renderer/`)
Rendering is separated into 5 stacked, absolutely positioned `<canvas>` elements inside `.canvas-content`:
1. **`Ground`:** 2D grid tiles, slopes, and fluid hazards.
2. **`Chars`:** Player spawns (Fireboy, Watergirl), exit doors, and diamonds.
3. **`Objects`:** Levers, buttons, timed buttons, pushable boxes, and moving platforms.
4. **`Tutorial_keyboard`:** In-level text hints and keyboard triggers.
5. **`Highlight`:** Active selection outline with corner resize/drag handles.

**Pinned Content Architecture:**
- The drawing context inside each `<canvas>` is pinned to `(0, 0)` (`pinContent: true`), scaling purely with `this.camera.scale`.
- When panning via the Hand tool, the entire DOM `.canvas-container` moves via CSS `transform: translate(x, y)`. The drawings inside never drift relative to the canvas boundary or background grid.

### 3. Level Model & Serialization (`level/`)
- **`LevelModel`:** Encapsulates the tilemap grid (`TileMap`) and the array of `LevelObject` instances. Handles level resizing and bounds pruning.
- **`serializer.js`:** Pure functional parser and serializer conforming to canonical Fireboy & Watergirl Tiled JSON:
  - Generates exact 4-layer structure: `Ground`, `Chars`, `Objects`, `Tutorial_keyboard`.
  - Enforces strictly lowercase `dx` and `dy` deltas for moving platforms.
  - Omits empty `properties` blocks on passive objects (spawns, doors, diamonds, boxes).

### 4. Tool System (`tools/`)
Tools extend `ToolBase` and implement standard lifecycle hooks:
- `activate()` / `deactivate()`: Cursor and state initialization.
- `onPointerDown(e)`, `onPointerMove(e)`, `onPointerUp(e)`: Pointer handling.
- Event objects provide both raw screen coordinates and transformed level `worldX`, `worldY`.

### 5. Selection & Properties Inspector (`interface/dock/`)
- Selecting an object in `SelectTool` registers it in `SelectionManager`.
- Locked or hidden layers cannot be selected. Toggling a layer's lock/visibility automatically clears selection if the selected object is on that layer.
- `PropertiesInspector` provides reactive two-way binding for coordinates, platform groups, movement vectors, and tutorial text.

---

## How to Add a New Tool

1. **Create the Tool Class:**
   Create `src/js/tools/MyCustomTool.js` extending `ToolBase`:
   ```javascript
   import { ToolBase } from './ToolBase.js';

   export class MyCustomTool extends ToolBase {
       constructor(options = {}) {
           super({ name: 'mytool', ...options });
       }

       onPointerDown(event) {
           const { worldX, worldY } = event;
           // Implement tool behavior...
       }
   }
   ```

2. **Register in `ToolManager.js`:**
   In `src/js/tools/ToolManager.js`:
   ```javascript
   import { MyCustomTool } from './MyCustomTool.js';
   // In constructor:
   this.registerTool('mytool', new MyCustomTool(commonOptions));
   ```

3. **Add Button to `ToolRail.js`:**
   In `src/js/interface/ToolRail.js`, add the tool definition with an SVG icon and shortcut:
   ```javascript
   {
       id: 'mytool',
       title: 'My Custom Tool (M)',
       shortcut: 'M',
       icon: '<svg ...></svg>'
   }
   ```

4. **Add Contextual Options in `ToolOptionsBar.js`:**
   In `src/js/interface/ToolOptionsBar.js`, add a renderer case in `_renderToolSpecificControls()` to display custom controls whenever the tool is active.
