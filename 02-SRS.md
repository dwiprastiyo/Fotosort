# FotoSort — SRS

## Functional Requirements

### FR-01 Folder Selection
The system shall allow the user to select one source folder.

### FR-02 Photo Scanning
The system shall detect supported image files and ignore non-image files.

MVP formats:
- JPG
- JPEG
- PNG
- HEIC

### FR-03 Thumbnail Generation
The system shall generate/cache thumbnails without blocking the UI.

### FR-04 Main Photo Preview
The system shall display the active photo at a larger resolution than neighboring thumbnails.

### FR-05 Previous/Next Context
The system shall display the previous and next photos when available.

### FR-06 Classification
The user shall choose exactly one classification:
- PERFECT
- BLUR
- POOR

### FR-07 Rating
The user may assign an integer rating from 1 to 5.

### FR-08 Rating Independence
Rating shall not affect classification or destination folder.

### FR-09 Reviewed State
A photo is reviewed when classification is assigned. Rating may be empty.

### FR-10 Navigation
The user shall navigate previous/next via mouse and keyboard.

### FR-11 Decision Editing
The user shall be able to change classification and rating before execution.

### FR-12 Progress
The system shall display reviewed/total progress.

### FR-13 Review
The system shall summarize classification counts before execution.

### FR-14 Confirmation
The system shall require explicit confirmation before filesystem operations.

### FR-15 Destination Creation
The system shall create:
- `Sempurna/`
- `Blur/`
- `Kurang Bagus/`

when required.

### FR-16 File Processing
The default operation shall copy source files to their destination.

### FR-17 Duplicate Handling
The system shall support Replace, Rename, and Skip.

### FR-18 Error Handling
Failed operations shall be surfaced and never falsely reported as successful.

### FR-19 Session Persistence
The application should persist progress so an interrupted culling session can be resumed.

## Non-Functional Requirements

### NFR-01 Responsiveness
Scanning, thumbnail generation, and file processing must run asynchronously.

### NFR-02 Reliability
Decision state and filesystem operations must remain separate.

### NFR-03 Safety
Original source files must remain untouched by default.

### NFR-04 Scalability
The MVP should target collections of at least 1,000 photos.

### NFR-05 Accessibility
Keyboard navigation, focus states, readable contrast, and non-color-only status indicators are required.
