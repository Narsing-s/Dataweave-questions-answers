# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. Future additions must continue to be conceptually distinct.

## Covered in the final/deep batches

- Temporal type matrix — A238
- Generic type parameters and type metadata — A239-A240
- Streaming, tail recursion, stream-capable functions and deferred output — A241-A243, A252, A275, A369
- Java interoperability and less-common mappings — A244-A245, A269-A271, A308-A309
- Explicit coercion and semantic types — A246, A272
- Selector/navigation edge cases — A247-A249, A254
- XML namespace/encoding/mixed-content behavior — A250, A257, A234
- DataWeave language/system-property compatibility — A251, A276
- Result/error contracts and diagnostics — A253, A343-A350
- Multipart, crypto, URI, Base64 and specialized formats — A261-A286, A299-A322
- Tree, Runtime, URL, Diff, binary and function-introspection capabilities — A287-A298
- Runtime evaluation, dynamic readers/writers and execution configuration — A299-A342
- Annotation/security/runtime privilege boundaries — A311-A322
- Runtime data-format discovery and descriptor behavior — A311, A331, A348
- Custom data-format registration — A351
- Scoped DataWeave logging and runtime logging services — A352, A354
- Dynamic `ReaderInput` contracts — A353
- Structured `Position` diagnostics — A355
- Cross-module overloaded-function dispatch — A368
- Indexed XML reader behavior for very large text/CDATA nodes — A370

## DataWeave 2.12 coverage

- Component descriptors and compiler ownership metadata — A356
- `ComponentDescriptor`, `ComponentsDescriptor`, and `ModuleDescriptor` types — A357
- Per-component language levels for embedded DataWeave engines — A358
- `UNLIMITED_CONTEXT` precision and rounding metadata — A359
- Scope visibility (`private`, `internal`, `@VisibleTo`) remains represented by A259 and the existing visibility coverage.
- Repeated XML attribute selector result-shape preservation — A364
- Sibling-reference annotation identity in type metadata — A365
- Self-referential Java-array scope resolution — A366
- Cycle-aware recursive type-metadata resolution — A367
- Deferred values consumed by `write` — A369
- Consistent visibility across overloaded functions — A371
- Intersections of unbound generic type parameters — A372
- Optional-to-required object-field compatibility — A373

## Previously covered

- `try` and structured error values — E207
- `orElse` and optional-value fallback — E206
- `read` with explicit MIME type — M206
- `write` with explicit MIME type — A206
- CSV header/quoting configuration — M207
- Date and Time type semantics — A207
- Regex `scan` and capture groups — M208
- Typed reusable functions — M209
- Reuse of derived collections for performance — M210
- Pagination/window boundaries — A208
- Financial rounding considerations — A209
- Deterministic business-key generation — A210
- Selector/navigation defaults and blank-versus-null handling — E208-E210

## Remaining research rule

The repository should not keep adding questions merely to increase the count. Future additions should target a genuinely different DataWeave feature, input shape, edge case, business rule, runtime behavior, or performance/design trade-off.

## Duplication rule

A new question is not considered unique merely because IDs, names, numbers, or business nouns were changed. The transformation objective, operator combination, input shape, edge case, or business rule must materially differ.

## Verification rule

Every new question should contain a complete transformation or concrete scenario, deterministic expected behavior, explanation, common mistake, and interview tip. Runtime correctness must not be claimed unless the expression has actually been executed in a compatible DataWeave runtime. Runtime-dependent error metadata and serialized line-ending details should be described rather than fabricated.

## Automated protection

`scripts/check-real-qa-duplicates.py` checks exact normalized question-title duplicates. GitHub Actions runs this check whenever `REAL-QA` changes. Exact-title checking does not replace human conceptual-duplicate review.

See [`docs/REAL-QA-COVERAGE.md`](../docs/REAL-QA-COVERAGE.md) for the broader coverage matrix.
