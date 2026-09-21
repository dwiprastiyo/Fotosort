# FotoSort — UI/UX Specification

## Design Goal
Create a focused desktop workspace for rapid photo culling.

## Design Language
- Minimal
- Premium
- Calm
- Professional
- Photography-first
- Keyboard-friendly

## Main Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ FotoSort                                  47 / 248 reviewed  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [Previous]       [     LARGE MAIN PHOTO     ]       [Next]   │
│ thumbnail                                            thumbnail│
│                                                              │
│                       IMG_0047.JPG                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                       Classify this photo                     │
│                                                              │
│ [ Q ] SEMPURNA   [ W ] BLUR   [ E ] KURANG BAGUS             │
│      Sempurna/        Blur/       Kurang Bagus/               │
│                                                              │
│                       Portfolio Rating                       │
│                           ☆ ☆ ☆ ☆ ☆                          │
│                         Optional                             │
├──────────────────────────────────────────────────────────────┤
│ ← Previous                                             Next →│
└──────────────────────────────────────────────────────────────┘
```

## Visual Hierarchy
1. Main photo
2. Classification controls
3. Rating
4. Previous/next thumbnails
5. Filename and metadata
6. Progress

## Photo Context
Display:
- previous thumbnail
- current photo
- next thumbnail

The current image must be visually dominant.

Clicking a neighboring thumbnail makes it the active photo.

## Classification
Exactly three choices:
- Sempurna → `Sempurna/`
- Blur → `Blur/`
- Kurang Bagus → `Kurang Bagus/`

Selected state must be obvious.

## Rating
Use five interactive stars.

Rating is optional and visually secondary.

Examples:
- `Sempurna + 5★`
- `Blur + 3★`
- `Kurang Bagus + 2★`

All are valid.

## Keyboard
- `1–5` = portfolio rating
- `Q` = Sempurna
- `W` = Blur
- `E` = Kurang Bagus
- `←` = previous
- `→` = next
- `Esc` = back/cancel

## Interaction Principle
After classification, auto-advance to the next photo unless the interaction is explicitly configured otherwise.

Do not show confirmation dialogs after every classification.

## Review Screen
Show:
- total photos
- counts per classification
- optional rating distribution
- Review Again
- Pisahkan Foto

Clearly communicate:
`No files have been moved yet.`

## Processing Screen
Show:
- current count
- total count
- progress bar
- current filename
- destination

## Completion Screen
Show:
- total processed
- per-category totals
- Open Folder
- Done

## Avoid
- giant sidebar
- dashboard cards
- unnecessary gradients
- excessive borders
- modal-heavy workflow
- tiny controls
- technical filesystem jargon
