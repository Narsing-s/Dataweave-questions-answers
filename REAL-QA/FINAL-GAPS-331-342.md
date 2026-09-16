# Final Unique DataWeave Gaps — A331-A342

These questions target runtime and language capabilities that are materially different from the existing curated bank. They avoid duplicating the earlier runtime-evaluation, format, annotation, streaming, and interoperability questions.

## A331 — Runtime DataFormatDescriptor lookup by MIME
**Question:** A diagnostic utility receives a MIME type such as `application/json` and must locate the installed DataWeave format descriptor without scanning every descriptor. How can `findDataFormatDescriptorByMime` be used, and what should the transformation return when no descriptor exists?

**Focus:** direct runtime data-format lookup by semantic MIME type.

## A332 — Runtime `fail` as an explicit exception boundary
**Question:** A reusable validation function must stop processing immediately with a controlled message when a business invariant is violated. How can `dw::Runtime::fail` be used, and how does its behavior differ from returning an error-shaped object as ordinary data?

**Focus:** explicit exception generation versus data-level error representation.

## A333 — Conditional runtime failure with `failIf`
**Question:** A transformation should continue normally when an expression is false but throw a runtime error with a supplied message when the expression is true. Design the rule with `failIf` and explain the value-preserving behavior of the successful branch.

**Focus:** conditional exception generation.

## A334 — Chaining failed `try` evaluations with `orElseTry`
**Question:** A parser must try several independent conversion strategies in sequence and only accept the first successful result. How can `orElseTry` compose multiple `try` evaluations without manually inspecting every intermediate error object?

**Focus:** structured failure chaining and fallback evaluation.

## A335 — Runtime properties as a complete configuration object
**Question:** A diagnostic mapping must inspect the full set of properties configured for the DataWeave runtime rather than requesting one property at a time. How does `dw::Runtime::props` differ from `prop`, and what should the mapping consider when exposing runtime configuration?

**Focus:** complete runtime-property introspection versus single-property lookup.

## A336 — `RuntimeExecutionConfiguration` for dynamic script execution
**Question:** A platform evaluates DataWeave dynamically and needs to control execution settings such as timeout, maximum stack size, or runtime services. How should `RuntimeExecutionConfiguration` be modeled as part of an `eval`/`run` request, and which settings are runtime-specific rather than transformation logic?

**Focus:** execution configuration as a separate runtime concern.

## A337 — `RunResult` output contract versus ordinary `eval` results
**Question:** A tool executes a DataWeave script dynamically and must preserve the generated value, MIME type, encoding, and execution logs. How does the `RunResult`/`RunSuccess` result contract differ from simply returning the evaluated value?

**Focus:** runtime execution result metadata.

## A338 — `ExecutionFailure` diagnostic structure
**Question:** A dynamic DataWeave execution fails and an operations tool must display the failure message, error kind, location, stack information, and logs when available. How should `ExecutionFailure` be handled without fabricating source locations that are unavailable?

**Focus:** structured runtime failure diagnostics.

## A339 — `Location` and `Position` source-range diagnostics
**Question:** A developer-support tool receives a DataWeave value or execution failure and needs to report the source range responsible for it. How do `Location`, `Position`, `start`, `end`, `locationString`, and optional source information fit together?

**Focus:** precise source-position modeling.

## A340 — Runtime `run` output format versus `eval` value semantics
**Question:** Two internal tools execute the same DataWeave source: one needs the computed value directly while the other needs the complete serialized runtime result. Compare the distinct contracts of `eval` and `run` and explain when the output format metadata matters.

**Focus:** semantic difference between evaluation and full script execution.

## A341 — DataWeave runtime `try` versus language-level error propagation
**Question:** A reusable library wants to convert an exception into a structured success/error result at a precise expression boundary rather than allowing the exception to propagate. How does `dw::Runtime::try` provide that boundary, and what information is retained on failure?

**Focus:** localized exception capture and structured results.

## A342 — Runtime version gating for feature-aware tooling
**Question:** A DataWeave support tool must report the runtime version and conditionally describe features available to that runtime. How can `dw::Runtime::version` be used, and why should version reporting be separated from assuming a particular `%dw` syntax version?

**Focus:** runtime version discovery versus script syntax/version compatibility.
