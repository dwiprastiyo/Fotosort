# FotoSort — PRD

## 1. Problem
Camera folders often contain hundreds or thousands of unorganized photos. Manually opening, evaluating, and moving each photo is repetitive and error-prone.

## 2. Product Goal
Make photo culling fast and deliberate while keeping file operations safe.

## 3. Primary User
A user with a camera folder containing mixed-quality photos.

## 4. Core Value
Reduce the workflow to:

`View → Classify → Optional Rating → Next`

## 5. Classification
Every photo must receive exactly one:
- Sempurna
- Blur
- Kurang Bagus

The classification maps directly to a destination folder.

## 6. Portfolio Rating
Optional 1–5 star rating used later to identify portfolio-worthy work.

Rating is metadata, not a sorting rule.

## 7. Success Criteria
- User can start from a folder.
- User can review one photo at a time.
- Previous and next thumbnails provide context.
- Classification can be done by mouse or keyboard.
- Rating can be added independently.
- No file operation happens during classification.
- User can revise decisions.
- User can review before execution.
- Destination folders are created automatically.
- Original files remain safe by default.

## 8. Main Screens
1. Welcome
2. Scanning
3. Culling workspace
4. Review
5. Separation confirmation
6. Processing
7. Completion
8. Empty/error/duplicate states

## 9. Future Direction
Portfolio View can later use star ratings to surface the best images without changing the original classification structure.
