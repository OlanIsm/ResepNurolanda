---
name: Resep Nurolanda
description: Animated restaurant intro and hero prototype.
colors:
  red: "#800b0c"
  yellow: "#ffd000"
  blue: "#0738d5"
  cream: "#fff9f0"
  placeholder: "#e6e2dd"
  title: "#211b17"
  secondary-text: "#4b413b"
  red-hover: "#a41418"
  placeholder-hover: "#dbd5ce"
typography:
  headline:
    fontFamily: "Lobster Two, cursive"
    fontSize: "clamp(54px, 7vw, 96px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.03em"
  body:
    fontFamily: "DM Sans, sans-serif"
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "13px"
rounded:
  button: "3px"
spacing:
  button-gap: "16px"
  button-inset: "24px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.cream}"
    rounded: "{rounded.button}"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
  button-secondary:
    backgroundColor: "{colors.placeholder}"
    textColor: "{colors.secondary-text}"
    rounded: "{rounded.button}"
    padding: "0 24px"
  button-secondary-hover:
    backgroundColor: "{colors.placeholder-hover}"
---

# Design System: Resep Nurolanda

## Overview

This document records the owner-approved intro and hero prototype, not a complete restaurant website. The visual direction pairs yellow script on dark red with a spacious cream hero. Gray copy and blue image placeholders intentionally remain visible.

**Key Characteristics:**
- Two-line script signature with contour drawing, fill and a brief glow.
- Centered copy and two compact calls to action.
- Three tilted, empty blue food strips, with delayed side entrances.

## Colors

Red anchors the intro, wordmark and primary action; yellow illuminates the signature. Blue identifies the approved empty image areas. Cream is the hero canvas, and gray distinguishes provisional copy and the secondary action. Token values above are extracted from `src/style.css`.

## Typography

Locally hosted italic Lobster Two supplies the wordmark and headline. The intro uses letter contours derived from that font in an inline SVG. DM Sans supplies buttons, captions, controls and footer text. The placeholder headline uses the headline token; at widths up to 600px it becomes `clamp(48px, 12vw, 68px)`. Captions use small uppercase text with wide tracking.

## Layout

The hero occupies `100svh`, bounded by 760px and 1200px on desktop. Its centered copy is `min(58vw, 720px)`. Header and footer use 5% horizontal insets. Two buttons sit beneath the rectangular text holder.

At widths up to 600px, the hero bounds become 680px and 1000px, copy expands to 84%, and outer insets become 6%. Buttons remain adjacent with 48px minimum height, 14px horizontal padding and a 10px gap. The main food strip spans 82%; clipped side strips hide their captions. These measurements describe this hero only.

## Elevation & Depth

Surfaces are flat, without box shadows. Overlap, edge clipping and rotation establish depth. Only the intro signature receives a temporary glow. Buttons lift 2px on hover.

## Shapes

Copy and food holders are rectangular. Buttons have subtly softened corners using the button radius token. The main strip rests at -8.5 degrees; the left and right strips rest at 10 and 11 degrees respectively.

## Components

- **Intro:** fixed red curtain with centered yellow signature. Each letter draws its contour over 0.65 seconds and fills at the end. Glow starts at 1.45 seconds. The curtain begins sliding up at 2 seconds and takes 0.95 seconds.
- **Hero entrance:** hero rises as the curtain departs. Main strip enters at 2.15 seconds; side strips enter at 2.65 and 2.8 seconds. Copy, actions, header and footer fade or rise into place.
- **Playback controls:** intro runs once per tab session when session storage is available. Skip and replay remain keyboard accessible. Reduced motion shows the settled hero and disables animation. The hero is inert while covered by the intro.
- **Actions:** red “Lihat Menu” and gray “Pesan via WhatsApp” buttons show preview status messages. They do not open a menu or contact a business. Desktop buttons have a 52px minimum height. Hover changes fill and lifts the button; keyboard focus uses a 3px amber outline with a 6px offset.
- **Placeholders:** gray headline holder and three blue food strips are approved prototype content. Decorative food strips are hidden from assistive technology.

## Do's and Don'ts

- Do preserve local fonts, keyboard controls and reduced-motion behavior.
- Do retain approved empty placeholders until replacement content is supplied.
- Don't present preview buttons as completed ordering or menu flows.
- Don't treat this hero composition as a requirement for future screens.
