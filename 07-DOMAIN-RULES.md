# FotoSort — Domain Rules

## Rule 1
Every photo can have only one active classification.

```text
PERFECT | BLUR | POOR
```

## Rule 2
Rating is optional.

Valid:
```text
classification = PERFECT
rating = null
```

## Rule 3
Classification determines destination.

```text
PERFECT → Sempurna/
BLUR    → Blur/
POOR    → Kurang Bagus/
```

## Rule 4
Rating never determines destination.

```text
5★ + BLUR → Blur/
1★ + PERFECT → Sempurna/
```

## Rule 5
Reviewed means classified.

```text
reviewed = classification != null
```

Rating must not be required for progress.

## Rule 6
Classification is reversible before execution.

## Rule 7
Filesystem operations must not happen during classification.

## Rule 8
Execution requires explicit confirmation.

## Rule 9
Source files remain unchanged by default.

## Rule 10
A failed file operation must not be counted as successfully processed.

## Rule 11
Duplicate handling must be deterministic and user-visible.

## Rule 12
Portfolio View is a consumer of rating metadata, not the owner of classification logic.
