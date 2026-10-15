---
version: alpha
name: Yukon
description: >-
  Node-based computer-vision music studio. Y2K Japanese consumer electronics
  meets Soviet lab instrument and terminal HUD. Designed for musicians who know
  theory but have never used node software.
colors:
  primary: "#1A1814"
  secondary: "#5C574C"
  tertiary: "#E85B47"
  neutral: "#B8B2A2"
  surface: "#E6E1D3"
  surface-2: "#F2EEE4"
  surface-3: "#D8D2C2"
  surface-brown: "#3A2422"
  surface-dark: "#161412"
  surface-dark-2: "#221E1A"
  on-surface: "#1A1814"
  on-surface-dark: "#E8E2D4"
  line: "#B8B2A2"
  line-dark: "#3D372F"
  error: "#C43B2F"
  mint: "#2FC4B2"
  coral: "#E85B47"
  yellow: "#E8C547"
  olive: "#8A9A4B"
  phosphor: "#3FA66A"
typography:
  headline-display:
    fontFamily: Martian Mono
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Martian Mono
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Martian Mono
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.01em
  body-lg:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-md:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0em
  body-sm:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Martian Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.08em
  label-md:
    fontFamily: Martian Mono
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Martian Mono
    fontSize: 8px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: 0.14em
  lcd:
    fontFamily: Silkscreen
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.06em
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "#F2705C"
  button-hardware:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 12px 22px
  button-hardware-hover:
    backgroundColor: "{colors.surface-3}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: 8px 12px
  node:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 0px
  node-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: 6px 10px
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: 16px
  panel-terminal:
    backgroundColor: "{colors.surface-brown}"
    textColor: "{colors.on-surface-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 16px
  port:
    size: 10px
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.full}"
  port-visual:
    size: 10px
    backgroundColor: "{colors.mint}"
    rounded: "{rounded.full}"
  port-signal:
    size: 10px
    backgroundColor: "{colors.coral}"
    rounded: "{rounded.full}"
  port-note:
    size: 10px
    backgroundColor: "{colors.yellow}"
    rounded: "{rounded.full}"
  port-audio:
    size: 10px
    backgroundColor: "{colors.olive}"
    rounded: "{rounded.full}"
  meter:
    height: 12px
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.on-surface}"
    typography: "{typography.lcd}"
    rounded: "{rounded.none}"
  meter-live:
    height: 12px
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.on-surface}"
    typography: "{typography.lcd}"
    rounded: "{rounded.none}"
  line-rule:
    height: 1px
    backgroundColor: "{colors.line}"
  line-rule-dark:
    height: 1px
    backgroundColor: "{colors.line-dark}"
  node-dark:
    backgroundColor: "{colors.surface-dark-2}"
    textColor: "{colors.on-surface-dark}"
    rounded: "{rounded.sm}"
    padding: 0px
  tag-code:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.none}"
    padding: 2px 6px
  slider-track:
    height: 4px
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.none}"
  slider-thumb:
    size: 14px
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
---

# Yukon

## Overview

Yukon is a node-based studio where computer vision makes music: a camera, a video
file, or an image becomes notes, rhythms, and sound. The audience is a musician
who reads chord symbols fluently but has never opened TouchDesigner. The software
must feel like an **instrument**, not like a website and not like a visual
programming IDE.

Three references define the identity, taken from the project mood board:

1. **Y2K Japanese consumer electronics** — translucent Sony portables, katakana
   micro-labels, product codes (`4010`, `AR-2000…`), coral and yellow marks on
   brushed silver. The UI is a device with a faceplate, a screen, and printed
   labels.
2. **Soviet lab bench** — a C1-83 oscilloscope drawing a green phosphor bird on a
   cluttered workbench. Readouts are honest, granular, slightly imperfect. DIY
   over polish.
3. **Terminal HUD** — the `SYN / DIAGNOSTIC` screen: bone dot-matrix panels,
   letter-scatter constellations, segmented meters (`STRESS 54%`), crop marks,
   rows of numbers used as texture.

Design posture: **dense, tactile, technical, warm**. Not minimal-luxury, not
neon cyberpunk, not SaaS dashboard. The graph canvas is the instrument body;
nodes are modules screwed onto it.

## Colors

Two surfaces, one instrument. The default (light) theme is the beige plastic of
the Keyboy and the bone screen of the diagnostic phone. The dark theme is the
charcoal faceplate and the maroon `SYN / DIAGNOSTIC` CRT.

| Role | Token | Value | Use |
|---|---|---|---|
| Ink | `primary` | `#1A1814` | Text, node headers, port dots |
| Ink soft | `secondary` | `#5C574C` | Micro-labels, code tags, disabled |
| Coral | `tertiary` | `#E85B47` | Primary actions, record, accents |
| Aluminum | `neutral` | `#B8B2A2` | Lines, borders, tracks |
| Bone | `surface` | `#E6E1D3` | App background (light) |
| Paper | `surface-2` | `#F2EEE4` | Node bodies, inputs (light) |
| Bone shade | `surface-3` | `#D8D2C2` | Recessed controls, code tags |
| SYN maroon | `surface-brown` | `#3A2422` | Terminal panels, oscilloscope readouts |
| Charcoal | `surface-dark` | `#161412` | App background (dark) |
| Charcoal 2 | `surface-dark-2` | `#221E1A` | Node bodies (dark) |

Signal families own a color, like operator families in TouchDesigner. This is
how users read the graph at a glance:

| Family | Token | Color | Meaning |
|---|---|---|---|
| IMAGEN | `mint` | `#2FC4B2` | Camera, video, image, previews |
| SEÑAL | `coral` | `#E85B47` | Continuous values 0–1 (CV + control) |
| NOTA | `yellow` | `#E8C547` | Note events (pitch + trigger + duration) |
| AUDIO | `olive` | `#8A9A4B` | Sound (synths → fx → master) |
| SALIDA | `phosphor` | `#3FA66A` | Master output, meters, "live" states |

Rules:

- Never use a family color decoratively. If it is mint, it carries or displays
  IMAGEN. If it is coral, it carries SEÑAL.
- Text on light is `primary`; text on dark is `on-surface-dark`. Text on
  `surface-brown` is `on-surface-dark`.
- `error` is reserved for invalid connections, audio clipping, and camera
  denial. It is the only red allowed besides `tertiary`.
- Dark theme swaps surfaces (`surface` → `surface-dark`, `surface-2` →
  `surface-dark-2`, `line` → `line-dark`) but keeps accent hexes identical. The
  instrument is the same machine in a dim studio.

## Typography

Four voices, each with a strict job. **Martian Mono** is the engraved faceplate
lettering. **IBM Plex Mono** is the manual and the data. **Silkscreen** is the
LCD. **Noto Sans JP** is decorative hardware texture only.

| Voice | Font | Role |
|---|---|---|
| Faceplate | Martian Mono | Titles, node names, buttons, section headers |
| Data | IBM Plex Mono | Parameter values, descriptions, terminal text |
| LCD | Silkscreen | Meters, node thumbnails, numeric readouts |
| Texture | Noto Sans JP | Katakana/kanji micro-prints on panels (decor only) |

Rules:

- Headings are uppercase with positive tracking (`label-*` tokens), like printed
  labels on a device: `CV.02 // MOVIMIENTO`, `SYN.01 // SUSTRACCTIVO`.
- Numbers are always mono. Big numerals (`4010`, `100`, `11時`) are legitimate
  display anchors: a BPM or a level may be set at `headline-display` size.
- Micro-text at `label-sm` (8px) is texture: product codes, revision strings,
  `AR-2000-XXXX`. It must be readable at 200% zoom but is not meant to be read.
- Slashed zero and technical notation (`0/1`, `####`, `000 T/u`) are part of the
  voice. Prefer raw values over rounded ones: show `53.7%` not `54%`.
- Functional copy is Spanish / French / English only. Japanese glyphs never
  carry meaning. If a string is functional, it is translated; if it is printed
  texture, it is Japanese or Latin micro-codes.
- Do not use proportional sans (Inter, Roboto, system-ui) anywhere.

## Layout

Built on a 4px grid (`spacing` tokens). Density comes from the lab-instrument
grid, not from shrinkage: targets stay ≥ 32px.

- **App frame**: full-bleed graph canvas (the instrument body) with a top bar
  (transport + project + language + theme) and a right rail (inspector for the
  selected node). Panels are divided by 1px `line` rules, not shadows.
- **Canvas**: dot-matrix grid (1px dots at 16px pitch, `neutral` at 35% on
  light, `line-dark` on dark). It must remain visible under nodes — the graph is
  printed on the panel.
- **Node placement**: freeform; nodes snap to the 8px sub-grid when dragged near
  an edge. Cables route as **schematic lines** — orthogonal elbows with a small
  dot at each turning point, like the wiring diagrams on the AEM concept panel —
  never bezier spaghetti, never thick rounded cables.
- **Inspector rail**: 280–320px, `panel` surface, sections divided by dotted
  rules. Parameter order follows signal flow: source → transform → music →
  sound.
- **Crop marks**: 8px L-shaped corner marks on floating panels and node
  previews, drawn in `secondary`. They frame the instrument the way registration
  marks frame a printed faceplate.
- **Rhythm strip**: the transport lives in the top bar as a physical control
  cluster (play, stop, BPM numeral at `headline-md`, meter `7/8`, swing %).
- Breakpoints: the canvas is the priority at every width. Below 900px the
  inspector becomes a bottom sheet. Yukon is a desktop instrument first.

## Elevation & Depth

Depth is **material, not shadow**. Stacked plastics and recessed screens, the
way a device shell frames its LCD.

- Use 1px borders in `line` (light) or `line-dark` (dark) and inset borders on
  screens: `inset 0 0 0 1px` with a 1px `surface-3` lip.
- Exactly one shadow is allowed: a hard offset print shadow `2px 2px 0` in
  `primary` at 8% opacity, for floating panels being dragged. No blur, no
  hover-lift, no glass, no gradient scrims.
- Node previews (LCD area) are recessed: darker lip, `surface-brown` or
  phosphor well, 2px inner border.
- Selected node: 1px outline in the family color + corner crop marks brighten.
  No scale transform.

## Shapes

Squared where it is hardware, pill where it is a physical button.

- Panels, nodes, inputs, meters: `rounded.none` to `rounded.sm` (0–2px).
- Slight rounding (4px) only on floating dialogs so they read as a separate
  plastic part.
- `rounded.full` is reserved for **hardware actions** (Play, Record, Import) and
  ports — the oval `LAST DITCH / PARACHUTE / SIGNAL LANE` buttons and the round
  jack sockets of the reference devices.
- Ports are 10px circles with a 2px well; the cable plugs into the well.
- Knobs and sliders are drawn as engraved controls: rectangular thumb
  (`slider-thumb`), thin track (`slider-track`), tick marks at 25% intervals.

## Components

Component behavior beyond tokens. Token values above are normative; this is how
they are assembled.

### Button

- `button-primary` (coral, pill-or-square per context): one per panel maximum —
  the single committing action (`GUARDAR`, `ENREGISTRER`, `RECORD`).
- `button-hardware`: pill, paper background, engraved `label-md` uppercase. Used
  for transport and irreversible device-like actions. Hover darkens to
  `surface-3` in 120ms linear. Press: 1px translate down, no animation curve
  tricks.
- `button-ghost`: square, for toolbar utilities (zoom, fit, theme, language).

### Node

A node is a module on the instrument, not a rounded card.

- Header bar (`node-header`): black faceplate strip with a mono code and name,
  e.g. `CV.02 // MOVIMIENTO`. Right side: enable toggle (a printed switch, not
  an iOS toggle) and a family color tab on the left edge (4px, family token).
- Body (`node`): paper surface, dotted internal rules between sections.
- **Thumbnail** (LCD preview): recessed well, `surface-brown` background with
  `phosphor` ink on dark theme, `surface-3` background with `primary` ink on
  light. Contents are rendered as pixel blocks (waveforms, dot-matrices, bar
  segments, letter scatter) — never smooth charts, never rounded progress bars.
  This is the `SYN / DIAGNOSTIC` screen in miniature.
- Ports: left = inputs, right = outputs, colored by signal family. Invalid drop
  targets ghost the port in `error`.
- Foot strip: micro-codes and status (`R 44.1k`, `24-EDO`, `LAT 12ms`) in
  `label-sm` `secondary`.

### Slider / Knob

Engraved control. Track 4px, thumb 14px rectangle in `primary` with a 1px
lighter line on top (engraved bevel). Value shown to the right in `body-sm`,
always mono, always with unit (`0.42`, `120 BPM`, `+7 st`, `24 cents`).

### Meter

Segmented blocks (8–24 segments), not smooth bars. Idle segment `surface-3`,
active segment in family color or `phosphor`. Numeric readout in `lcd` type
below or beside. Used for audio levels, CV values, and signal activity.

### Tag / Code label

`tag-code` chips for tuning systems, scales, time signatures: `24-EDO`, `HIJAZ`,
`7/8`, `JI 5-LIM`. Square, `label-sm`, letter-spaced.

### Panel (inspector, dialogs, terminal readouts)

- Standard: `panel` (bone/paper).
- Terminal/diagnostic: `panel-terminal` (SYN maroon on dark, bone-shade on
  light) with `body-sm` data text and dotted rules. Use for logs, diagnostics,
  signal history.

### Cable

Orthogonal schematic wire: 1.5px stroke in family color at 80% opacity, square
caps, a 3px dot at each elbow. Carrying signal animates a 4px dash moving
source→target at 2s linear loop. Dead/unconnected cable is `neutral`.

### Node thumbnail previews

Per family: IMAGEN shows a downsampled pixel-block frame (8×8 to 24×24 blocks);
SEÑAL shows a segmented meter + last 32 samples as a dot strip; NOTA shows a
small scale-degree grid (active notes as filled blocks); AUDIO shows a block
waveform (32 columns). All in `lcd` type labels.

### Motion

Mechanical, never playful. Durations 120–200ms, `linear` or `ease-out` only.
Numbers tick in steps (like an LCD refreshing) instead of tweening. Cables snap.
Panels fade 80ms. The only looping motion is signal flow on live cables and
meter segments. No confetti, no springs, no parallax.

### Loading (kinetic type)

Loading is the one place where motion is loud. Reference: the `type_01`
pindown.io kinetic typography reel — brutalist Swiss type that scatters, flies
into place, and gets pinned by inverted highlight blocks. Yukon loaders are the
same machine with our own voice: mono type, instrument vocabulary, family
colors.

Text material is never lorem ipsum. Use the instrument's own language:
`CV.02 // MOVIMIENTO`, `KARPLUS-STRONG`, `24-EDO`, `HIJAZ`, `7/8`, `LOOP
STATION`, `SEÑAL`, `NOTA`, `AR-2000`, `R 44.1k`, `LAT 12ms`.

**Phases** (boot loader ~2.4s loop; per-node loader slower):

1. **SCATTER** — words and single letters placed at random positions and scales
   (0.4×–2.5× of `headline-display`), random opacity 0.3–1. Random words render
   inverted (paper text on a `primary` or family-color block). Background may
   flip once between `surface` and `surface-brown`.
2. **CONVERGE** — each glyph tweens to its final grid slot and 1× scale, 180ms
   per glyph, staggered 12–20ms in reading order, `ease-out`. Sizes snap in
   steps (three discrete scales: 0.5×, 1×, 1.8×) so it reads as an LCD
   re-layout, not a smooth zoom.
3. **PIN** — highlight blocks snap behind random words: inverted rectangles in
   `primary`, `coral`, `yellow`, `mint`, or `surface-3`. They land instantly
   (0ms) and pop out after 400–900ms. Exactly one block is `coral` (the "live"
   word). This is the signature beat — the word has been pinned down.
4. **SETTLE** — the grid holds still; only 2–3 blocks re-pin every 900ms to
   show the machine is still working. Exit is a hard cut (80ms fade), never a
   dissolve.

**Rules**:

- Layout of the settled state is a strict multi-column word grid (editorial
  columns, like the reference's text columns), not centered hero text.
- Glyphs are `headline-display` (Martian Mono) for full-screen loaders and
  `lcd` (Silkscreen) for node-thumbnail loaders. No proportional sans.
- Flashes are step functions: an inverted block is on or off, never a fade
  ramp. Respect `prefers-reduced-motion`: skip SCATTER/CONVERGE and show the
  SETTLE state directly, with blocks re-pinning at 2s intervals.
- Background flips are limited to one flip per loop. No strobing, no
  full-screen color cycling.

**Loader sizes**:

| Loader | Scope | Type | Text |
|---|---|---|---|
| Boot | Full screen | `headline-display` 40–120px | Project codes + node names |
| Node | Inside node thumbnail | `lcd` 8–10px | That node's parameter names |
| Task | Inspector panel / toast | `headline-md` | Action name (`GUARDAR`, `CARGAR`) |

Reference reel: `yukon-mood-board/type_01_pindown.io_1791947830.mp4`.
Interactive prototype: `yukon-app/preview/loader-kinetic.html`.

### ASCII (glyph boil)

Reference: `ascii-animation.gif` — a standing figure rendered as ASCII
characters in a chunky bitmap font, black on white. The silhouette holds still
while every cell boils: each frame, each glyph is redrawn from the set that
matches its luminance. It is a scan degrading in place.

Yukon uses this as its third motion language, next to kinetic loaders and
mechanical UI motion.

**Mechanics**:

- **Luminance ramp** — dense glyphs for dark values, sparse for light:
  ` .:-=+*#%@` at rest, boiled with the reference's noisy set
  (`B0$RqNzA` dark, `.'~^:;\`` light). Never smooth gradients: the ramp *is*
  the grayscale.
- **Glyph boil** — at 8–24 fps (stepped, never tweened), each cell re-picks a
  character within ±1 ramp step of its target. The mask (shape) stays; the
  texture lives. Low boil (8fps) = calm instrument; high boil (24fps) = signal
  overload.
- **Edge dither** — sparse noise glyphs leak one cell outside the silhouette.
- **Hard pixels** — `Silkscreen` or `IBM Plex Mono`, no antialiasing on the
  raster, black on `surface-2` or `phosphor` on `surface-brown`. Same look as
  an oscilloscope screen or a dot-matrix printout.

**Where it is used**:

| Surface | Behavior |
|---|---|
| IMAGEN node thumbnail | Live camera/video frame rendered as ASCII cells — vision becomes characters in real time |
| SEÑAL / AUDIO thumbnail | ASCII oscilloscope (`~ ^ _ /` strips) and ASCII meters `[#####....]` |
| Loading (decode variant) | Glyphs boil through random characters and settle into the real word — a signal being decoded |
| Idle / empty state | The figure boiling slowly at 8fps — the instrument waiting |
| Panel texture | One-cell-thick ASCII strips on faceplate edges, static or at 4fps |

**Rules**:

- The ramp maps real data (luminance, amplitude, value). ASCII that decorates
  without carrying signal is wallpaper and is not allowed on nodes or meters.
- Boil is a step function: glyphs change or stay. No fade, no blur, no emoji,
  no Unicode art blocks (`█ ▓ ▒`) — only printable ASCII characters.
- `prefers-reduced-motion`: freeze the boil on one frame; keep the ASCII
  render itself.

Prototype: `yukon-app/preview/ascii-boil.html`.

## Do's and Don'ts

- DO keep the dot-matrix canvas grid visible under everything; the graph is
  printed on the instrument.
- DO label things like hardware: `CV.02 // MOVIMIENTO`, `OUT // MASTER`,
  `A-130 REV.C`. Micro-codes are identity.
- DO render readouts as pixel blocks, letter scatter, and segmented meters.
- DO render camera, waveform, and level previews as boiling ASCII when the
  node shows signal texture — the ramp is the grayscale.
- DO keep boil stepped and data-driven: glyphs change or stay, never fade.
- DO use the family colors only for their signal family.
- DO show real numbers with units and raw precision (`53.7%`, `24 cents`).
- DO write functional copy in ES / FR / EN, and keep Japanese as printed
  texture only.
- DO make nodes feel screwed onto a panel: square corners, black header strip,
  recessed screen, engraved labels.
- DON'T use gradients, glassmorphism, blurred shadows, or soft hover lifts.
- DON'T use generic rounded cards, emoji icons, or Inter/system sans anywhere.
- DON'T use neon-on-black cyberpunk, purple-blue SaaS gradients, or pastel
  minimalism.
- DON'T animate with springs, bounces, confetti, or celebration effects.
- DON'T put smooth charts, rounded progress bars, or anti-aliased waveforms in
  node thumbnails; everything readout-like is blocky by design.
- DON'T use Unicode block art (`█ ▓ ▒`), emoji, or decorative ASCII that
  carries no signal on nodes, meters, or previews.
- DON'T color-code decoration. If it glows, it carries signal.
- DON'T translate the aesthetic into a different metaphor (no "notebook", no
  "music streaming app", no "game"). Yukon is a machine for making music from
  images.
