# FotoSort — Coding Vibe

This file defines the engineering style of the project.

## General Philosophy
Write code that is:
- boring in the best way
- explicit
- composable
- testable
- easy to delete
- easy to reason about

Prefer clear abstractions over clever abstractions.

## Core Rule
Business logic must be understandable without opening a UI component.

Bad:
```text
UI click handler
    → filesystem call
    → classification mutation
```

Good:
```text
UI action
    → application command
    → domain decision
```

Filesystem work belongs in infrastructure.

## Naming
Prefer domain language:
- `PhotoDecision`
- `Classification`
- `PortfolioRating`
- `SortingSession`
- `SeparationService`

Avoid vague names:
- `DataManager`
- `Helper`
- `Utils`
- `StuffService`

## Functions
Prefer small functions with one clear responsibility.

Bad:
```text
processEverything()
```

Better:
```text
scanPhotos()
classifyPhoto()
calculateProgress()
buildSeparationPlan()
copyPhoto()
verifyCopy()
```

## Error Handling
Never silently swallow filesystem errors.

Errors should retain:
- operation
- source path
- destination path
- reason

User-facing messages should be simple. Internal logs can be technical.

## State Management
Use explicit states.

Do not infer critical business state from UI appearance.

For example:
- button selected ≠ file processed
- photo visible ≠ photo reviewed
- review complete ≠ filesystem completed

## Async Work
All potentially expensive operations must be asynchronous:
- scan
- decode
- thumbnail generation
- copy
- verification

UI should remain responsive.

## Testing
Prioritize tests around:
1. classification rules
2. rating independence
3. navigation
4. decision persistence
5. destination mapping
6. duplicate handling
7. failed file operations

## Comments
Comments should explain WHY, not WHAT.

Good:
```text
// Keep source files intact during culling so users can revise decisions safely.
```

Avoid:
```text
// Set the index to i.
```

## Git Commit Style
Use focused commits.

Examples:
```text
feat: add photo scanner
feat: add classification state
feat: add star rating
feat: add culling workspace
fix: preserve source files during processing
test: cover duplicate handling
refactor: isolate filesystem adapter
```

Avoid giant commits that mix UI redesign, architecture, and unrelated fixes.
