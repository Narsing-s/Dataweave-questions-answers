# Additional Unique DataWeave Gaps — A343-A350

These are deliberately limited to distinct capabilities found in the current official runtime/type documentation and are not renamings of earlier questions.

## A343 — `EvalResult` as a typed success/failure union
**Question:** A dynamic execution service must model an `eval` result without assuming success. How can `EvalResult` be treated as a `Result<EvalSuccess, ExecutionFailure>` and why is explicit success/failure branching safer than assuming a `value` field always exists?

## A344 — `EvalSuccess` logs versus returned value
**Question:** A dynamic script succeeds but emits runtime log entries. How should a consumer use `EvalSuccess.value` and `EvalSuccess.logs` separately so diagnostic information is not confused with the transformation result?

## A345 — `ExecutionFailure.kind` versus human-readable message
**Question:** An operations dashboard receives a failed dynamic DataWeave execution. How should `ExecutionFailure.kind` and `message` be used for machine-oriented classification versus human-readable diagnostics?

## A346 — Optional source information in `Location`
**Question:** A DataWeave error may have a source range but no recoverable source identifier. How should tooling handle optional `sourceIdentifier`, `text`, `start`, and `end` fields without assuming every failure has a complete source location?

## A347 — Runtime result logs across success and failure
**Question:** A monitoring integration needs one normalized log collection regardless of whether dynamic execution succeeds or fails. How can the different log-bearing runtime result types be normalized while preserving the original success/error distinction?

## A348 — Runtime descriptor lookup failure as `null`
**Question:** A format-aware integration receives an unsupported MIME type. How should a transformation safely handle `findDataFormatDescriptorByMime` returning `null` instead of treating a missing descriptor as an exception?

## A349 — Runtime failure versus `try` result as ordinary data
**Question:** A library has two APIs: one deliberately throws with `fail`, while another captures exceptions with `try`. Compare the caller-visible control flow and explain when each contract is appropriate.

## A350 — Experimental runtime APIs and compatibility risk
**Question:** A production design considers `eval`, `run`, `evalUrl`, or `runUrl`. How should an architect document their experimental status and isolate these APIs so a future runtime change does not silently become a core application dependency?
