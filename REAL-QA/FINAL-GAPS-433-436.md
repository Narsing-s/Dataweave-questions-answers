# A433-A436 — Additional DataWeave indexed-reader, recursion, diagnostics, and scheduler gaps

These questions were selected after reviewing the current curated bank and the current DataWeave System Properties reference. Exact-property searches found no existing dedicated coverage for the four selected properties. Each question targets a distinct runtime or operational behavior rather than rewording an existing question.

## A433 — Indexed-reader page size

**Difficulty:** Advanced  
**Focus:** Indexed readers / `com.mulesoft.dw.indexsize`

### Question
A DataWeave transformation uses an indexed reader for a large input. The team wants to control the maximum number of bytes held by each indexed-reader page in memory. Which system property controls this page size, what is its documented default, and why is it different from the general `com.mulesoft.dw.buffersize` setting?

### Expected answer
`com.mulesoft.dw.indexsize` controls the maximum size, in bytes, of a page in memory used by indexed readers. The documented default is `1572864` bytes (1.5 MiB). It is different from `com.mulesoft.dw.buffersize`, which controls broader DataWeave input/output buffering and temporary-file spill behavior. `indexsize` is specifically an indexed-reader page-size control.

### Explanation
An indexed reader manages input through indexed pages, so its page-size setting is a more specific memory-control point than the general input/output buffer threshold. Existing questions cover indexed formats and general buffering, but this question isolates the page-size tuning behavior.

### Common mistake
Treating `indexsize` as the total DataWeave payload-memory limit or as a replacement for `buffersize`.

### Interview tip
When diagnosing memory usage for indexed formats, distinguish indexed-reader page sizing from general retained-payload buffers and off-heap pool allocation.

---

## A434 — Maximum DataWeave stack depth

**Difficulty:** Advanced  
**Focus:** Recursion limits / `com.mulesoft.dw.stacksize`

### Question
A recursive DataWeave function eventually fails with a stack-overflow-style error. Which DataWeave system property controls the maximum DataWeave stack size, what is its documented default, and what is the documented maximum value?

### Expected answer
`com.mulesoft.dw.stacksize` controls the maximum DataWeave stack size. Its documented default is `256`, and the documented maximum size limit is `256`. When a function recurses too deeply, DataWeave can throw a stack-overflow-style error.

### Explanation
This setting describes the DataWeave recursion stack limit. It is different from designing an algorithm with tail recursion or otherwise reducing recursion depth: those techniques change how the transformation executes, while this property defines the configured maximum stack size.

### Common mistake
Assuming the property can be increased without limit to make arbitrary recursive transformations safe.

### Interview tip
For deep recursive transformations, first consider an iterative or tail-recursive design and only then reason about the configured DataWeave stack limit.

---

## A435 — Java stack-trace depth for diagnostics

**Difficulty:** Advanced  
**Focus:** Java diagnostics / `com.mulesoft.dw.java.stacktrace`

### Question
A DataWeave application needs to control how many frames are included in a Java stack trace produced during Java interoperability or runtime diagnostics. Which DataWeave system property controls this depth, and what is its documented default?

### Expected answer
`com.mulesoft.dw.java.stacktrace` specifies the depth of the Java stack trace. The documented default is `6`.

### Explanation
This is a diagnostics-detail setting, not a transformation semantic or Java reflection-access setting. It should therefore be considered separately from A426's `com.mulesoft.dw.java.disable_set_accessible` and the Java bean access questions.

### Common mistake
Confusing Java stack-trace depth with the DataWeave recursion stack limit controlled by `com.mulesoft.dw.stacksize`.

### Interview tip
When troubleshooting Java interop failures, separate diagnostic-detail settings from settings that change reflection access or bean property resolution.

---

## A436 — DataWeave scheduler thread-pool size

**Difficulty:** Advanced  
**Focus:** Runtime concurrency / `com.mulesoft.dw.scheduler.size`

### Question
A Mule application performs DataWeave work that uses the DataWeave scheduler, and the operations team needs to configure the size of that scheduler's thread pool. Which system property controls it and what is the documented default?

### Expected answer
`com.mulesoft.dw.scheduler.size` specifies the size of the DataWeave scheduler thread pool. The documented default is `100`.

### Explanation
This property controls the scheduler's configured thread-pool size. It is distinct from transformation-level parallelism, Mule flow concurrency, and memory-pool sizing. Increasing it should therefore not be treated as a generic way to make every DataWeave transformation faster.

### Common mistake
Assuming the property directly determines Mule flow concurrency or CPU utilization for every DataWeave operation.

### Interview tip
When discussing DataWeave performance, identify whether the bottleneck is scheduler capacity, flow concurrency, I/O, buffering, or the transformation itself before changing a thread-pool setting.

---

## Duplication review

Exact repository searches found no existing dedicated coverage for these four property names:

- `com.mulesoft.dw.indexsize`
- `com.mulesoft.dw.stacksize`
- `com.mulesoft.dw.java.stacktrace`
- `com.mulesoft.dw.scheduler.size`

They are deliberately separated from existing coverage of indexed-reader behavior, tail recursion, Java reflection access, diagnostics, and off-heap memory-pool sizing.

## Source basis

The current MuleSoft DataWeave System Properties documentation defines these properties and their documented defaults. The documentation also notes that system-property applicability can depend on the configured DataWeave language level, not only the Mule runtime version.
