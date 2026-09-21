# FotoSort — SDD

## Architecture

Use a lightweight layered architecture.

```text
Presentation
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

## Presentation Layer
Responsible for:
- screens
- components
- rendering
- input events
- UI state projection

Do not put filesystem logic here.

## Application Layer
Responsible for:
- sorting session orchestration
- classification commands
- navigation
- review calculations
- processing orchestration

## Domain Layer
Responsible for pure business concepts:
- Photo
- Classification
- PortfolioRating
- PhotoDecision
- SortingSession
- ProcessingResult

Domain logic must not depend on UI framework or filesystem APIs.

## Infrastructure Layer
Responsible for:
- filesystem access
- image decoding
- thumbnail cache
- local session persistence
- copy/move operations

## Domain Model

```text
Photo
├── id
├── filename
├── sourcePath
├── width
├── height
└── metadata

PhotoDecision
├── photoId
├── classification
├── rating?
└── reviewed

SortingSession
├── sourceFolder
├── photos[]
├── decisions[]
├── currentIndex
└── status
```

## Enums

```text
Classification:
PERFECT
BLUR
POOR

SessionStatus:
INITIALIZING
READY
REVIEWING
REVIEW_COMPLETE
PROCESSING
COMPLETED
FAILED
```

## State Rule

```text
UNREVIEWED
   ↓ classify
CLASSIFIED
   ↓ all classified + review
CONFIRMED
   ↓ execute
PROCESSED
```

Classification must never transition directly to a filesystem mutation.

## Processing Pipeline

```text
validate decisions
    ↓
create destination directories
    ↓
copy files
    ↓
verify results
    ↓
collect failures
    ↓
show completion
```

## Concurrency Rule
Never block the UI thread with:
- directory scanning
- image decoding
- thumbnail generation
- file copying

Use background workers/tasks and report progress back to the UI.

## Data Safety
Do not delete source files in MVP.

If move mode is ever introduced, it must be opt-in and explicitly communicated.

## Persistence
Use local persistence for session state. A small JSON/SQLite implementation is acceptable for MVP depending on framework choice.

The persistence layer must be replaceable without changing domain logic.
