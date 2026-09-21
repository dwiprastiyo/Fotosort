# FotoSort — AI Coding Context

You are contributing to the FotoSort codebase.

## Always Remember
FotoSort is a photo culling application, not a generic file manager.

The user's primary action is to classify a photo:
- Sempurna
- Blur
- Kurang Bagus

The secondary action is optional portfolio rating:
- 1–5 stars

## Never Break These Invariants

### Invariant A
Rating does not affect classification.

### Invariant B
Classification does not immediately touch the filesystem.

### Invariant C
A photo is reviewed once classified, even without a rating.

### Invariant D
Original files are preserved by default.

### Invariant E
Processing happens only after explicit confirmation.

## When Adding a Feature
Ask internally:
1. Does this belong to the culling phase or execution phase?
2. Does this change domain rules?
3. Does this introduce filesystem side effects?
4. Can it interrupt the user's rapid review rhythm?
5. Can the feature be tested independently?

## Preferred Change Strategy
1. Update domain model/rules if necessary.
2. Add application service/command.
3. Add infrastructure adapter only if needed.
4. Add UI.
5. Add tests.
6. Update documentation.

## UI Guidance
Do not add UI because "there might be room for it."

Every control should justify its existence.

The main photo must remain dominant.

## Performance Guidance
Do not eagerly decode every full-resolution image.

Prefer:
- thumbnails for navigation
- lazy full-resolution preview
- background processing
- caching

## Safety Guidance
Treat filesystem code as high-risk code.

Before changing it, consider:
- duplicate files
- permissions
- partial failure
- interrupted process
- source preservation
- idempotency

## Output Quality
Favor maintainability over cleverness.

If a change makes the architecture harder to explain in one paragraph, reconsider the design.
