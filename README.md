# FBWG-Editor

A modern, browser-based, serverless level editor for the classic platformer game **Fireboy & Watergirl**.

Built with modern ES modules and a Photoshop-inspired desktop UI, FBWG-Editor allows level designers to intuitively construct, test, and export canonical levels compatible with Fireboy & Watergirl game engines.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [User Interface Overview](#user-interface-overview)
- [Tool Suite & Keyboard Shortcuts](#tool-suite--keyboard-shortcuts)
- [Level File Format](#level-file-format)
- [Architecture & Project Structure](#architecture--project-structure)
- [Development & Building](#development--building)
- [License](#license)

---

## Features

- **Photoshop-Inspired Desktop UI:**
  - **Menu Bar:** Classic cascading menus for File, Edit, View, and Level operations.
  - **Contextual Tool Options Bar:** Dynamic options strip at the top that updates based on the currently active tool.
  - **Tool Rail:** Left-hand icon strip with single-key shortcuts for rapid switching.
  - **Center Viewport:** Pinned canvas content, smooth GPU-accelerated canvas panning, and zoom scaling (25% to 500%).
  - **Collapsible Right Dock:**
    - **Layers Panel:** Controls for the 4 canonical FBWG layers (`Ground`, `Chars`, `Objects`, `Tutorial_keyboard`) with visibility toggling, locking, and selection protection.
    - **Properties Inspector:** Live object inspector for single-object selection, coordinate editing (`x`, `y`, `width`, `height`), color groups (1–8), moving platform deltas (`dx`, `dy`), and tutorial text trigger content.
  - **Status Bar:** Real-time document dimensions, zoom percentage, cursor world coordinates, selection indicator, and transient feedback messages.

- **Comprehensive Tool Palette:**
  - **Tile Brush (B):** Place standard ground and boundary tiles.
  - **Slope Brush (S):** Place directional 45° slopes (top-left, top-right, bottom-left, bottom-right).
  - **Fluid Brush (F):** Paint hazards (Water, Lava, Acid/Poison).
  - **Tile Eraser (E):** Erase tiles from the Ground layer with live cursor preview.
  - **Move & Select (V):** Single-click selection with cyan bounding box and corner handles. Respects locked/hidden layers.
  - **Hand / Pan (H):** Move the canvas across the workspace. Also accessible via middle-click drag or <kbd>Space</kbd> + drag.
  - **Platform Tool (P):** Place moving platforms with group colors 1–8 and movement deltas.
  - **Box Tool (O):** Place Normal, Heavy, or Mirror pushable boxes.
  - **Button & Lever Tool (L):** Place floor buttons, timed buttons, and levers with linked group triggers.
  - **Spawns & Doors (D):** Place Fireboy & Watergirl player spawn locations and exit doors.
  - **Diamond Tool (G):** Place Red (Fireboy), Blue (Watergirl), Silver, and Split diamonds.
  - **Text / Trigger Tool (T):** Place on-screen tutorial hints and text trigger boxes.

- **Level Management & Safe Resizing:**
  - Non-destructive level resizing modal with dimension inputs and warnings for boundary shrinking.
  - Built-in one-click reload for the official Tutorial Level.
  - URL-safe export (`encodeURIComponent`) for quick sharing and URL-hash embedding without whitespace or newlines.

- **Serverless & Zero-Runtime Overhead:**
  - Compiles to static HTML, CSS, and JS. Can be served from GitHub Pages, S3, or any static hosting service.

---

## Quick Start

### Running Locally with Node.js

1. **Clone the repository:**
   ```bash
   git clone https://github.com/twboom/FBWG-Editor.git
   cd FBWG-Editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The bundled static application is written to `dist/`.

---

## Tool Suite & Keyboard Shortcuts

### Tools

| Key | Tool | Description |
|:---:|:---|:---|
| <kbd>V</kbd> | **Move / Select** | Select objects to view/edit properties in the Inspector or delete them. |
| <kbd>H</kbd> | **Hand / Pan** | Drag to pan the canvas within the workspace. |
| <kbd>B</kbd> | **Tile Brush** | Paint solid ground tiles onto the Ground layer. |
| <kbd>S</kbd> | **Slope Brush** | Place 45-degree angle slope tiles in 4 orientations. |
| <kbd>F</kbd> | **Fluid Brush** | Paint hazard tiles: Water (Watergirl only), Lava (Fireboy only), or Acid. |
| <kbd>E</kbd> | **Tile Eraser** | Erase ground tiles back to empty air. |
| <kbd>P</kbd> | **Platform Tool** | Place moving platforms; set color group (1–8) and `dx`/`dy` travel distances. |
| <kbd>O</kbd> | **Box Tool** | Place pushable boxes (Standard, Heavy, Mirror). |
| <kbd>L</kbd> | **Lever / Button** | Place switches (Floor Button, Timed Button, Lever Left, Lever Right). |
| <kbd>D</kbd> | **Spawns & Doors** | Place player spawn portals and exit doors for Fireboy and Watergirl. |
| <kbd>G</kbd> | **Diamond Tool** | Place collectible gems (Fireboy Red, Watergirl Blue, Silver, Split). |
| <kbd>T</kbd> | **Text / Trigger** | Place in-level tutorial instructions and keyboard prompts. |

### Global Shortcuts & Actions

| Shortcut | Action | Description |
|:---|:---|:---|
| <kbd>Ctrl</kbd> + <kbd>S</kbd> | **Save / Export** | Downloads level as canonical `level.json`. |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | **Delete Object** | Deletes the currently selected object. |
| <kbd>Ctrl</kbd> + <kbd>+</kbd> | **Zoom In** | Increments zoom level by 20%. |
| <kbd>Ctrl</kbd> + <kbd>-</kbd> | **Zoom Out** | Decrements zoom level by 20%. |
| <kbd>Ctrl</kbd> + <kbd>0</kbd> | **Reset View** | Resets zoom to 100% and resets canvas position. |
| <kbd>Space</kbd> + Drag | **Temporary Pan** | Temporarily activates Hand tool to drag canvas. |
| Middle Mouse Drag | **Viewport Pan** | Drags the canvas around the workspace. |
| Mouse Wheel | **Zoom Viewport** | Zooms smoothly centered on pointer. |

---

## Level File Format

FBWG-Editor uses the standard, canonical **Tiled JSON** level format utilized by Fireboy & Watergirl games:

- **Tile Size:** Fixed `32×32` pixels per grid cell (`tilewidth: 32`, `tileheight: 32`).
- **Layers Structure:**
  1. `Ground` (`tilelayer`): 1D array of GIDs representing solid terrain, slopes, and hazard fluids.
  2. `Chars` (`objectgroup`): Contains player spawns (GIDs 16, 17), exit doors (GIDs 18, 19), and collectible diamonds (GIDs 20–23).
  3. `Objects` (`objectgroup`): Contains switches, levers, pushable boxes, and moving platforms with movement vectors and group IDs.
  4. `Tutorial_keyboard` (`objectgroup`): Contains text triggers and helper messages rendered to players.

For a full breakdown of GIDs, object properties, and JSON schemas, see [docs/FILE_FORMAT.md](docs/FILE_FORMAT.md).

---

## Architecture & Project Structure

```
FBWG-Editor/
├── dist/                     # Production build artifacts (self-contained static app)
├── docs/                     # Technical documentation
│   ├── ARCHITECTURE.md       # Component hierarchy and rendering pipeline
│   └── FILE_FORMAT.md        # Canonical Tiled JSON specification
├── index.html                # Root redirect to dist/index.html
├── package.json              # Project scripts and dependencies
├── src/                      # Source code
│   ├── index.html            # Main HTML template
│   ├── css/                  # Modular styles (theme, canvas, photoshop layout)
│   ├── data/                 # Sample levels (example_level.json)
│   ├── public/               # Static public assets (blank_level.json)
│   └── js/                   # Core application modules
│       ├── core/             # SelectionManager
│       ├── interface/        # MenuBar, ToolRail, ToolOptionsBar, StatusBar, Dock
│       ├── level/            # LevelModel, TileMap, LevelObject, serializer
│       ├── renderer/         # Camera, CanvasRenderer, renderObjects
│       ├── tools/            # ToolManager, ToolBase, and 12 tool implementations
│       └── EditorApp.js      # Root application coordinator
└── vite.config.js            # Vite build configuration
```

For more in-depth architectural details, refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [src/README.md](src/README.md).

---

## Development & Building

### Scripts

- `npm run dev`: Launches Vite dev server with hot module reloading.
- `npm run build`: Bundles the production distribution into `dist/`.

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
