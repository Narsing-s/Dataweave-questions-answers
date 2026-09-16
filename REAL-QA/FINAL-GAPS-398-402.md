# DataWeave Compiler, Materialization, Java Cache and Tooling Gaps — A398-A402

These questions were added only after checking the curated index, gap analysis, and existing question bank. They target documented DataWeave 2.11 behaviors that were not represented by a dedicated question.

## A398 — Java module bean introspection cache memory leaks

**Difficulty:** Advanced  
**Topic:** Java interoperability, introspection cache, long-running applications

### Question

A long-running Mule application repeatedly uses DataWeave Java-module interoperability with many Java bean types. The application shows steadily increasing memory usage related to Java module bean introspection. What runtime/cache behavior should be considered, and how is this different from per-application JavaBean cache configuration?

### Scenario

```text
Long-running application
  -> repeatedly introspects Java module bean accessors
  -> Java types are reused over time
  -> introspection metadata accumulates
  -> memory usage can grow if the cache lifecycle is incorrect
```

### Expected behavior

The DataWeave 2.11.4 fix prevents the Java module bean introspection cache from causing memory leaks.

### Explanation

Java interoperability can require discovery and caching of bean metadata. This cache has a different concern from the `per_app_java_bean_cache` compatibility behavior: the documented fix specifically addresses the lifecycle of the Java module bean introspection cache so that long-running applications do not retain unnecessary metadata indefinitely.

### Common mistake

- Assuming every Java cache setting controls every Java interoperability cache.
- Treating a memory leak as a normal consequence of Java reflection.
- Confusing Java module bean introspection with ordinary payload-value materialization.

### Interview tip

When diagnosing DataWeave Java memory issues, identify the exact cache layer: **bean metadata cache**, **Java module introspection cache**, or **materialized Java values**.

### Source note

MuleSoft documents this fix as DataWeave 2.11.4 issue W-22419118.

---

## A399 — Eager materialization of values to cache all exceptions inside `try`

**Difficulty:** Advanced  
**Topic:** `try`, eager materialization, exception capture

### Question

A `try` expression contains a value whose computation is lazy and whose evaluation can raise an error. Why can eager materialization of values be important when the requirement is for the `try` scope to cache and expose errors raised during evaluation?

### Example shape

```dataweave
%dw 2.0
output application/json
---
try(() -> {
  value: someLazyComputation()
})
```

### Expected behavior

DataWeave supports eager materialization on values so that exceptions encountered while evaluating those values can be cached and correctly captured by the `try` execution scope.

### Explanation

Lazy evaluation can postpone computation until a value is consumed. If the requirement is for `try` to capture all exceptions from its execution scope, the relevant values must be evaluated at the appropriate point. Eager materialization provides that evaluation boundary and allows the resulting exception state to be retained.

This is more specific than the general `try` error-value question: the key issue is the interaction between **lazy values**, **materialization timing**, and **exception caching**.

### Common mistake

- Assuming constructing a lazy value means its errors have already happened.
- Treating `try` as a mechanism that automatically evaluates every deferred value at every time.
- Confusing exception caching with normal output caching.

### Interview tip

For lazy DataWeave expressions, always ask **when the value is evaluated** and **which execution scope owns the resulting exception**.

### Source note

MuleSoft documents eager materialization on values for caching exceptions inside `try` as DataWeave 2.11 issue W-19717874.

---

## A400 — Base-type validation without prematurely materializing a value

**Difficulty:** Advanced  
**Topic:** Type checking, base types, lazy materialization

### Question

A DataWeave value can be validated against its base type before the complete value is materialized. Why is this useful for lazy values, and what problem occurs if type validation unnecessarily forces materialization too early?

### Scenario

```text
Lazy value
   |
   +--> validate against base type
   |
   +--> keep value lazy when full materialization is unnecessary
```

### Expected behavior

DataWeave uses base types when validating accepted values so that type validation does not unnecessarily force premature materialization.

### Explanation

Type validation does not always require constructing the complete concrete value. Using an appropriate base type lets the compiler/runtime establish whether the value is acceptable while preserving laziness where possible. This reduces unnecessary work and helps maintain the memory benefits of lazy evaluation.

### Common mistake

- Assuming every type check must fully evaluate a lazy value.
- Confusing type compatibility with complete value consumption.
- Treating lazy evaluation as useful only for streaming payloads.

### Interview tip

Separate **type validation**, **value materialization**, and **value consumption**. They can occur at different times.

### Source note

MuleSoft documents base-type validation that prevents premature materialization as DataWeave 2.11 issue W-18943395.

---

## A401 — Semantic tokens in the DataWeave Tooling API

**Difficulty:** Advanced  
**Topic:** Tooling API, editor integration, language services

### Question

An IDE integration wants semantic token information from DataWeave so it can distinguish language constructs such as functions, variables, types, and other semantic elements instead of relying only on lexical text coloring. What Tooling API capability should the integration use?

### Expected behavior

The DataWeave Tooling API supports semantic tokens, allowing language-aware tooling to obtain semantic information for editor features such as syntax-aware highlighting.

### Explanation

Lexical highlighting can classify text based on character patterns, while semantic tokens require knowledge of the parsed and resolved DataWeave program. Semantic-token support therefore belongs to the language-service/tooling layer rather than to runtime payload transformation.

### Common mistake

- Treating semantic tokens as a runtime transformation feature.
- Assuming semantic highlighting can be implemented reliably from regular expressions alone.
- Confusing Tooling API metadata with the output of a DataWeave mapping.

### Interview tip

Know the distinction between **DataWeave runtime APIs**, **compiler APIs**, and **Tooling APIs**. IDE features such as semantic tokens belong to the tooling layer.

### Source note

MuleSoft documents semantic-token support in the DataWeave Tooling API as DataWeave 2.11 issue W-19846990.

---

## A402 — Type-check diagnostics for subgraphs

**Difficulty:** Advanced  
**Topic:** Type checking, compiler graphs, diagnostic precision

### Question

A DataWeave compiler resolves type information for only a subgraph of a larger transformation. A type error exists inside that subgraph. What diagnostic behavior should the compiler provide, and why is silently losing the subgraph error dangerous for tooling and build validation?

### Expected behavior

DataWeave correctly reports type-check errors when type checking is resolved on subgraphs.

### Explanation

A compiler may analyze portions of a larger expression/type graph independently. Errors discovered in a subgraph still need to propagate to the caller or consuming compiler phase. Otherwise, a partially analyzed mapping could appear valid even though a nested type relationship is invalid.

### Common mistake

- Assuming type checking is only meaningful for the complete top-level graph.
- Treating a missing subgraph diagnostic as proof that the nested expression is valid.
- Confusing compiler type errors with runtime exceptions.

### Interview tip

For compiler diagnostics, consider **where the error originates**, **which graph/subgraph was analyzed**, and **how diagnostics propagate back to the build or tooling caller**.

### Source note

MuleSoft documents correct type-check error reporting for subgraphs as DataWeave 2.11 issue W-19564697.
