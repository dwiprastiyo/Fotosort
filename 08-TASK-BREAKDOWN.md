# FotoSort — Task Breakdown

## Phase 0 — Foundation
- [ ] Create repository
- [ ] Setup desktop framework
- [ ] Setup linting/formatting
- [ ] Setup test framework
- [ ] Establish folder/module structure
- [ ] Establish design tokens

## Phase 1 — Filesystem
- [ ] Folder picker
- [ ] Directory scanner
- [ ] Image format filter
- [ ] Photo entity
- [ ] Metadata reader
- [ ] Permission error handling

## Phase 2 — Image Pipeline
- [ ] Image decoder
- [ ] Thumbnail generation
- [ ] Thumbnail cache
- [ ] Lazy loading
- [ ] Full-size preview
- [ ] Corrupt image handling

## Phase 3 — Domain
- [ ] Classification enum
- [ ] PortfolioRating
- [ ] PhotoDecision
- [ ] SortingSession
- [ ] Classification service
- [ ] Progress calculator

## Phase 4 — Navigation
- [ ] Current photo index
- [ ] Previous photo
- [ ] Next photo
- [ ] Previous/next thumbnails
- [ ] Thumbnail click navigation
- [ ] Keyboard shortcuts
- [ ] Auto-advance

## Phase 5 — Persistence
- [ ] Save session
- [ ] Load session
- [ ] Restore decisions
- [ ] Resume interrupted session

## Phase 6 — UI
- [ ] Welcome
- [ ] Scanning
- [ ] Culling workspace
- [ ] Classification buttons
- [ ] Star rating
- [ ] Progress
- [ ] Review
- [ ] Confirmation
- [ ] Processing
- [ ] Completion
- [ ] Empty state
- [ ] Error state
- [ ] Duplicate state

## Phase 7 — Separation Engine
- [ ] Validate decisions
- [ ] Build separation plan
- [ ] Create folders
- [ ] Copy files
- [ ] Duplicate handling
- [ ] Progress reporting
- [ ] Retry
- [ ] Verify output
- [ ] Failure summary

## Phase 8 — Testing
- [ ] Domain unit tests
- [ ] Navigation tests
- [ ] Rating tests
- [ ] Persistence tests
- [ ] Filesystem integration tests
- [ ] Duplicate tests
- [ ] Permission failure tests
- [ ] Disk-full tests
- [ ] End-to-end sorting flow

## Phase 9 — Performance
- [ ] Test 1,000 photos
- [ ] Test 5,000 photos
- [ ] Thumbnail memory profiling
- [ ] Scan performance
- [ ] Copy performance
- [ ] UI responsiveness profiling

## Phase 10 — Release
- [ ] Build pipeline
- [ ] Installer/package
- [ ] Smoke tests
- [ ] Release candidate
- [ ] Final documentation

## Definition of Done
A task is done when:
- behavior works
- edge cases are handled
- tests exist where appropriate
- UI follows the design system
- no unrelated code is changed
