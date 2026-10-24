# Canonical Fireboy & Watergirl Level Format Specification

This document defines the canonical file format used for saving and exporting levels in **FBWG-Editor**. The format is based on the **Tiled JSON** standard (v1.0+) configured specifically for the Fireboy & Watergirl game engine.

---

## 1. Map Header Schema

Every exported level JSON file has the following top-level properties:

```json
{
  "width": 20,
  "height": 15,
  "tilewidth": 32,
  "tileheight": 32,
  "orientation": "orthogonal",
  "renderorder": "right-down",
  "nextobjectid": 100,
  "tilesets": [
    { "firstgid": 1, "source": "../../../assets/tilemaps/tilesets/Ground.json" },
    { "firstgid": 16, "source": "../../../assets/tilemaps/tilesets/Chars.json" },
    { "firstgid": 24, "source": "../../../assets/tilemaps/tilesets/Objects.json" },
    { "firstgid": 40, "source": "../../../assets/tilemaps/tilesets/LargeObjects.json" }
  ],
  "layers": [ ... ]
}
```

### Key Field Rules
- `width` / `height`: Level dimensions in number of tiles.
- `tilewidth` / `tileheight`: Always fixed at `32` pixels.
- `nextobjectid`: Monotonically increasing unique integer for newly spawned objects.
- `layers`: Must contain exactly four canonical layers in standard order:
  1. `Ground` (`tilelayer`)
  2. `Chars` (`objectgroup`)
  3. `Objects` (`objectgroup`)
  4. `Tutorial_keyboard` (`objectgroup`)

---

## 2. Canonical Layers

### Layer 1: `Ground` (`tilelayer`)

Stores solid terrain, 45-degree angle slopes, and lethal fluid hazard pools.
- **Data format:** A single 1D array of integers of length `width × height`.
- A value of `0` denotes empty air.
- Positive values represent tile IDs:

| Tile ID | Name | Description |
|:---:|:---|:---|
| `0` | Air | Empty space |
| `1` | Solid Block | Standard solid ground / wall block |
| `2` | Slope 45° Top-Right | Solid triangle with hypotenuse facing top-right |
| `3` | Slope 45° Top-Left | Solid triangle with hypotenuse facing top-left |
| `4` | Slope 45° Bottom-Right | Solid triangle with hypotenuse facing bottom-right |
| `5` | Slope 45° Bottom-Left | Solid triangle with hypotenuse facing bottom-left |
| `6` | Water Hazard | Blue pool (safe for Watergirl; deadly to Fireboy) |
| `7` | Acid Hazard | Green poison pool (deadly to both characters) |
| `8` | Lava Hazard | Orange/Red pool (safe for Fireboy; deadly to Watergirl) |

---

### Layer 2: `Chars` (`objectgroup`)

Contains player start locations, exit doors, and collectible diamonds.

#### GID Mapping Reference

| GID | Name | Dimensions | Description |
|:---:|:---|:---:|:---|
| `16` | Fireboy Spawn | 64×64 | Start location portal for Fireboy |
| `17` | Watergirl Spawn | 64×64 | Start location portal for Watergirl |
| `18` | Fireboy Door | 64×64 | Exit door for Fireboy (opens on contact) |
| `19` | Watergirl Door | 64×64 | Exit door for Watergirl (opens on contact) |
| `20` | Fireboy Diamond | 64×64 | Red collectible gem (collectible by Fireboy) |
| `21` | Watergirl Diamond | 64×64 | Blue collectible gem (collectible by Watergirl) |
| `22` | Silver Diamond | 64×64 | Gray collectible gem (collectible by either character) |
| `23` | Split Diamond | 64×64 | Bi-color diamond (requires both characters) |

> **Cleanliness Rule:** In canonical exports, passive objects with GIDs (spawns, doors, diamonds) have `"type": ""` and **do not** emit empty `properties` or `propertytypes` blocks.

**Example Serialized Character Object:**
```json
{
  "gid": 20,
  "height": 64,
  "id": 5,
  "name": "",
  "rotation": 0,
  "type": "",
  "visible": true,
  "width": 64,
  "x": 192,
  "y": 256
}
```

---

### Layer 3: `Objects` (`objectgroup`)

Contains switches, interactive physics boxes, and moving platforms.

#### Switch & Box GID Mapping

| GID | Name | Dimensions | Type | Properties |
|:---:|:---|:---:|:---:|:---|
| `24` | Floor Button | 64×64 | `""` | `group` (1–8) |
| `25` | Lever Left | 64×64 | `""` | `group` (1–8) |
| `26` | Lever Right | 64×64 | `""` | `group` (1–8) |
| `28` | Standard Box | 64×64 | `""` | *(none)* |
| `36` | Mirror Box | 64×64 | `""` | *(none)* |
| `37` | Heavy Box | 64×64 | `""` | *(none)* |
| `38` | Timed Button | 64×64 | `""` | `group` (1–8) |

#### Moving Platforms (`type: "platform"`)

Platforms are geometric objects without a GID:
- `"type": "platform"`
- `"width"` / `"height"`: Typically `96×32` or user defined.
- `"properties"`: Must contain `group`, `dx`, and `dy`.

> **Delta Casing Requirement:** Movement offsets **must strictly be lowercase** `"dx"` and `"dy"` (never `"dX"` or `"dY"`).

**Example Serialized Platform Object:**
```json
{
  "height": 32,
  "id": 12,
  "name": "",
  "properties": {
    "dx": 128,
    "dy": 0,
    "group": 1
  },
  "propertytypes": {
    "dx": "int",
    "dy": "int",
    "group": "int"
  },
  "rotation": 0,
  "type": "platform",
  "visible": true,
  "width": 96,
  "x": 320,
  "y": 384
}
```

---

### Layer 4: `Tutorial_keyboard` (`objectgroup`)

Stores on-screen instructions, controls reminders, and trigger boxes.

**Example Serialized Text Trigger Object:**
```json
{
  "height": 64,
  "id": 30,
  "name": "hint_jump",
  "rotation": 0,
  "text": {
    "fontfamily": "sans-serif",
    "pixelsize": 16,
    "text": "Press UP to jump across the lava!"
  },
  "type": "trigger",
  "visible": true,
  "width": 256,
  "x": 64,
  "y": 128
}
```

---

## 3. Serialization Rules Summary

1. **Omit Unused Properties:** Do not serialize empty objects (`properties: {}`, `propertytypes: {}`) for passive objects.
2. **GID-Identified Objects:** When an object has a `gid`, its `type` attribute is serialized as `""` to avoid conflicting engine parsers.
3. **Platform deltas:** Always output lowercase `dx` and `dy`.
4. **URL-Safe Export:** Produced via `encodeURIComponent(JSON.stringify(level))` with no formatting newlines, allowing levels to be stored in URLs or shared via lightweight strings.
