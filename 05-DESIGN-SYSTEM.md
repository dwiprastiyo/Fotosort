# FotoSort — Design System

## Principles
1. Photo-first
2. Decision-first
3. Low cognitive load
4. Consistent motion
5. Minimal visual noise

## Color Direction
Use a dark neutral photography workspace by default.

Do not rely on color alone to communicate classification.

Recommended semantic accents may be subtle:
- success-like accent for Sempurna
- neutral/warning-like accent for Blur
- destructive-like accent for Kurang Bagus

Do not over-saturate the interface.

## Typography
Use a modern sans-serif.

Hierarchy:
- App title: medium/semibold
- Screen title: semibold
- Main action labels: medium/semibold
- Metadata: regular, muted
- Shortcut hints: small, muted

## Spacing
Use a consistent spacing scale.

Prioritize:
- generous photo margins
- comfortable button padding
- compact metadata
- consistent vertical rhythm

## Components

### ClassificationButton
States:
- default
- hover
- focused
- selected
- disabled

Props:
```text
label
folder
shortcut
selected
disabled
```

### StarRating
States:
- empty
- hover
- selected
- focused

Props:
```text
value: 0..5
optional: true
```

### PhotoThumbnail
States:
- default
- hover
- active
- loading
- unavailable

### Progress
Display:
`reviewed / total`

### StatusBadge
Should support text plus optional icon.

## Motion
Use short, subtle transitions.

Avoid:
- dramatic animations
- bouncing
- unnecessary page transitions

The photo transition should feel immediate.

## Responsive Behavior
Primary target is desktop. Preserve the main photo as the dominant region.

If width becomes constrained:
1. reduce thumbnail size
2. reduce metadata
3. reduce spacing

Do not shrink classification controls below comfortable click targets.
