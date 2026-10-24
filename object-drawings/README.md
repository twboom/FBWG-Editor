# Object Drawings Generator (`object-drawings/`)

This directory contains Python scripts and drawing definition files (`.cnvsdrw`) used to generate SVG assets and canvas drawing code for Fireboy & Watergirl level objects (doors, levers, buttons, diamonds, boxes, spawns).

## Scripts

- **`builder.py`**: Compiles template drawings from `drawings/` into SVG assets using configurations in `config.py`.
- **`config.py`**: Defines color themes, states (active/inactive, pressed/unpressed), and dimensions for each object type.
- **`drawings/`**: Vector path definitions for doors, levers, diamonds, buttons, and spawns.
- **`wrapper.js`**: Helper script for embedding generated canvas drawing instructions.
