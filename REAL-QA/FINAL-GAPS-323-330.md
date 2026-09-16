# Final Unique DataWeave Runtime Gaps — A323-A330

These questions cover distinct `dw::Runtime` capabilities that were still absent from the curated bank after checking the existing gap batches. They are not simple function renamings: each targets a different runtime concern—dynamic evaluation, script execution, source-location tracing, runtime properties, version detection, or controlled waiting.

## A323 — Runtime `eval` with supplied context
**Question:** A platform receives a DataWeave expression as a string together with a controlled context object containing variables and functions. Design a diagnostic transformation that uses `dw::Runtime::eval` to evaluate the expression with that context, and explain why the evaluation context must be deliberately constrained when the expression is not trusted.

**Focus:** dynamic expression evaluation, explicit execution context, runtime boundaries.

---

## A324 — Runtime `run` versus ordinary expression evaluation
**Question:** A tooling service receives a complete DataWeave script rather than a single expression and needs to execute it inside the current runtime with a supplied context. Explain when `dw::Runtime::run` is appropriate, how its result differs conceptually from evaluating an inline expression, and what operational risks exist when executing dynamically supplied scripts.

**Focus:** complete-script execution and runtime-controlled dynamic execution.

---

## A325 — Remote script execution with `runUrl`
**Question:** An internal development tool is configured with the URL of a versioned DataWeave script and must execute that script through the current DataWeave runtime. How does `dw::Runtime::runUrl` differ from local `run`, and what validation, availability, and trust controls should surround remote script execution?

**Focus:** URL-based script execution and external-resource controls.

---

## A326 — Locate a value with `dw::Runtime::location`
**Question:** A diagnostic transformation receives a value produced by another DataWeave expression and needs to determine whether the value can be traced back to a source location. Design the diagnostic output using `dw::Runtime::location` and explain why the result can be `null`.

**Focus:** source-location tracing and diagnostic metadata.

---

## A327 — Human-readable source locations with `locationString`
**Question:** Build a DataWeave diagnostic report that records a human-readable source location for selected values when available, while safely handling values whose source location cannot be traced. How does `dw::Runtime::locationString` complement `location`?

**Focus:** source-location formatting for diagnostics and troubleshooting.

---

## A328 — Inspecting runtime properties with `prop` and `props`
**Question:** A reusable diagnostic mapping must inspect one optional runtime property by name and, for troubleshooting, produce a snapshot of all configured DataWeave runtime properties. How should `dw::Runtime::prop` and `dw::Runtime::props` be used, and why should property values not automatically be treated as stable application configuration contracts?

**Focus:** runtime configuration introspection and defensive property handling.

---

## A329 — Runtime version-aware behavior with `version`
**Question:** A diagnostic library must report the DataWeave version currently executing the mapping and expose that value in its output. How can `dw::Runtime::version` be used, and why is runtime-version detection different from relying only on the Mule application version declared in deployment configuration?

**Focus:** runtime capability identification and version diagnostics.

---

## A330 — Controlled execution delay with `wait`
**Question:** A test harness needs to deliberately pause DataWeave execution for a specified number of milliseconds to reproduce timing-sensitive behavior. How can `dw::Runtime::wait` be used, and what performance and production-safety concerns arise when introducing an execution delay into a transformation?

**Focus:** controlled runtime delay, testing, and performance implications.
