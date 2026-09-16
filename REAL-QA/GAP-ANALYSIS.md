# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. Future additions must continue to be conceptually distinct.

## Covered in the final/deep batches

- Temporal type matrix — A238
- Generic type parameters and type metadata — A239-A240
- Streaming, tail recursion, stream-capable functions and deferred output — A241-A243, A252, A275, A369, A381
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
- Scope visibility (`private`, `internal`, `@VisibleTo`) — A259
- Repeated XML attribute selector result-shape preservation — A364
- Sibling-reference annotation identity in type metadata — A365
- Self-referential Java-array scope resolution — A366
- Cycle-aware recursive type-metadata resolution — A367
- Deferred values consumed by `write` — A369
- Consistent visibility across overloaded functions — A371
- Intersections of unbound generic type parameters — A372
- Optional-to-required object-field compatibility — A373
- Version-aware overload dispatch with `@Since` — A374
- Optional function-parameter metadata via `FunctionParam` — A375
- Java output type representation via `com.mulesoft.dw.java.output_types_as_string` — A376
- `internal` as a non-reserved identifier in current language levels — A407

## Current runtime/concurrency/format/compatibility coverage

- Binary-specific `isEmpty` overload and coercion boundary — A377
- Concurrent access to `KeyValuePairs` inside lazy materialized objects — A378
- `AvroReader` memory lifecycle in long-running flows — A379
- Single-variable function materialization — A380
- Multibyte character preservation across streaming reader boundaries — A381
- Lazy evaluation strategy for `orderBy` criteria — A382
- Unicode surrogate handling in `fromCharCode` — A383
- Flat-file schema loading with nesting beyond the historical depth limit — A384
- Concurrent DataWeave module loading — A385
- Java bean accessor discovery during Java interoperability — A386
- Event Stream/SSE parsing and representation — A387
- Java module builder/converter cache thread-safety livelock prevention — A388
- Invalid/reversed range behavior and nullable range results — A389
- DST-aware `atBeginningOfDay` offset resolution — A390
- Reusable materialized Java values across executions — A391
- Compiler precompilation without validation/type checking — A392
- Top-level Avro `enum`, `map`, `union`, and `fixed` roots — A393
- Optional-type propagation through chained selectors — A394
- Object-key subtraction type inference — A395
- Lazy source loading during binary compilation — A396
- Warning/error propagation across compilation phases — A397
- Java module bean introspection cache lifecycle and memory-leak prevention — A398
- Eager materialization of values for exception caching inside `try` — A399
- Base-type validation without premature materialization — A400
- Semantic tokens in the DataWeave Tooling API — A401
- Type-check diagnostics for compiler subgraphs — A402
- Cross-file AST scope navigation in the Tooling API — A403
- Array range-selector performance on valid large ranges — A404
- Syntax-version metadata in `TypeGraph` and `WeaveTypeResolution` — A405
- Windows classloader resource resolution — A406
- `NumberType`/`sizeOf` compatibility behavior — A408
- Trailing-zero numeric formatting and compatibility behavior — A409
- Strict mixed-type `orderBy` comparison behavior — A410
- Runtime compatibility-flag introspection with `evaluateCompatibilityFlag` — A411
- Mule `vars` materialization pass for repeated-read null behavior — A412
- XML DTD processing control and default-disabled behavior — A413
- Coercion-exception verbosity and diagnostic metadata — A414
- Exception-message display-length limits — A415
- CPU watchdog execution-time protection — A416
- Direct/off-heap versus heap buffering selection — A417
- Pre-2.3 date subtraction compatibility behavior — A418
- `default` operator exception-handling compatibility — A419
- Java `java.sql.Date` to DataWeave temporal-type mapping — A420
- Indexed Latin-1 XML reader compatibility — A421
- Removal of shadowed implicit inputs — A422
- DataWeave input/output buffer spill thresholds and temporary-file behavior — A423
- Indexed CSV string-retention memory behavior — A424
- Deterministic JavaModuleLoader method ordering — A425
- Java reflection accessibility control on JDK 17+ — A426
- Writer character-buffer sizing — A427
- Java public-interface definition lookup — A428
- Java bean getter/setter versus field accessor selection — A429
- Off-heap memory-pool slot sizing — A430
- Per-slot off-heap allocation limit — A431
- JSON Binary writer-encoding compatibility — A432
- Indexed-reader page sizing — A433
- DataWeave recursion stack limits — A434
- Java stack-trace depth — A435
- DataWeave scheduler thread-pool sizing — A436
- Multipart part default content type — A437
- Message-logging debounce duration — A438
- DataWeave telemetry configuration — A439
- Cursor-close stack-trace tracking — A440
- Per-script temporary-directory tracking — A441
- Experimental failure input/script dumps — A442
- DataWeave temporary-file base directory — A443
- Synchronous temporary-file deletion — A444
- Maximum DataWeave output-file size — A445
- Legacy value-selector first-occurrence compatibility — A446
- Experimental dumper exception stack traces — A447

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
