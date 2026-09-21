# FotoSort — Project Context

## Product
FotoSort is a minimalist desktop photo culling application.

## Core Job
Help users review a chaotic camera folder one photo at a time, classify each photo into exactly one category, optionally rate it for portfolio purposes, and only then execute file separation.

## Core Workflow
1. Select source folder.
2. Scan supported photos.
3. Review one photo at a time.
4. See previous/current/next photo context.
5. Select exactly one classification:
   - Sempurna
   - Blur
   - Kurang Bagus
6. Optionally give a 1–5 star portfolio rating.
7. Continue until all photos are classified.
8. Review all decisions.
9. Confirm separation.
10. Copy files into destination folders.
11. Show completion result.

## Critical Product Rule
Classification and filesystem execution are separate phases.

During culling:
- Never move files.
- Never copy files.
- Never delete files.

Classification only stores an in-memory/persisted decision.

Filesystem operations happen only after explicit user confirmation.

## Classification
| ID | Label | Destination |
|---|---|---|
| PERFECT | Sempurna | `Sempurna/` |
| BLUR | Blur | `Blur/` |
| POOR | Kurang Bagus | `Kurang Bagus/` |

## Portfolio Rating
Rating is optional metadata:
- 1 star
- 2 stars
- 3 stars
- 4 stars
- 5 stars

Rating does not affect:
- classification
- destination folder
- reviewed status
- file processing

A photo is considered reviewed when classification is set, even if rating is empty.

## UX Principle
The dominant loop is:

> Look → Decide → Optionally Rate → Next

Avoid unnecessary dialogs and interruptions.

## Visual Principle
Photo-first:
1. Main photo
2. Classification
3. Portfolio rating
4. Previous/next context
5. Metadata

## Default File Behavior
Use COPY as the default separation behavior so original source files remain intact.

Move mode can be added later behind an explicit setting.

## Out of Scope for MVP
- AI classification
- Face recognition
- Photo editing
- Cloud sync
- Advanced EXIF editing
- Social sharing
- Advanced batch culling

## Design Personality
Minimal, professional, calm, focused, photography-oriented, keyboard-friendly.

Avoid:
- generic SaaS dashboards
- excessive cards
- glassmorphism
- neon gradients
- file-manager-heavy UI
