# DataWeave Runtime, Compiler, Avro and Type-System Gaps — A391-A397

These questions were added only after checking the curated index and existing gap-analysis coverage. They target documented behaviors from the DataWeave 2.11 line that were not represented by a dedicated question.

## A391 — Reusing a materialized Java value across executions

**Difficulty:** Advanced  
**Topic:** Java interoperability, materialization, execution reuse

### Question

A Java-backed value is materialized during one DataWeave execution and the same value is then used by another execution. What runtime behavior should a developer expect, and why is repeated Java-value construction not necessarily required for each execution?

### Scenario

```text
Execution 1 -> obtain/materialize Java-backed value
Execution 2 -> reuse the same materialized value
Execution 3 -> reuse it again
```

### Expected behavior

In the DataWeave 2.11 maintenance line, materialized Java values are cached so that the same materialized value can be used by multiple executions.

### Explanation

Materialization converts a lazily represented value into a concrete value that can be consumed. The documented change allows materialized Java values to be cached, avoiding unnecessary re-materialization when the same value participates in multiple executions.

This is different from general JavaBean introspection caching: the question is about reuse of an already materialized Java value across executions.

### Common mistake

- Assuming every execution must reconstruct the Java-backed value.
- Confusing value materialization with JavaBean metadata/introspection caches.
- Treating the behavior as an application-level database cache.

### Interview tip

Separate **Java metadata caching**, **object/value materialization**, and **DataWeave script execution caching**. They solve different performance problems.

### Source note

MuleSoft documents this behavior as DataWeave 2.11 issue W-20091279.

---

## A392 — Precompiling mappings and modules without validation or type checking

**Difficulty:** Advanced  
**Topic:** Compiler API, precompilation, validation boundaries

### Question

A build pipeline wants to precompile DataWeave mappings and modules before deployment, but the pipeline intentionally does not want validation or type checking to be performed during that precompilation step. What capability does the DataWeave compiler provide, and what important distinction should be made between compilation and validation?

### Expected behavior

`WeaveCompiler` supports precompiling mappings and modules without performing validation or type checking.

### Explanation

Compilation and validation are related but distinct stages. A precompilation workflow can prepare mappings/modules for later use without requiring the same validation/type-checking behavior during that step. This is useful when a build or tooling pipeline needs compilation as an artifact-generation phase rather than treating it as the complete correctness-validation phase.

### Common mistake

- Assuming successful precompilation automatically means every semantic/type validation has been performed.
- Treating compiler precompilation as equivalent to executing the mapping.
- Adding application-runtime assumptions to a compiler-only scenario.

### Interview tip

When discussing DataWeave tooling, distinguish **parse/compile**, **validation/type checking**, and **runtime execution** rather than treating them as one operation.

### Source note

MuleSoft documents this capability as DataWeave 2.11 issue W-19667273.

---

## A393 — Avro `enum`, `map`, `union`, and `fixed` as top-level values

**Difficulty:** Advanced  
**Topic:** Avro reader/writer boundaries, schema-driven formats

### Question

An Avro document is not a record containing fields. Instead, its top-level schema is an `enum`, `map`, `union`, or `fixed` type. What capability should a DataWeave Avro transformation support, and why is assuming that every Avro payload has a record-shaped root incorrect?

### Expected behavior

DataWeave supports Avro `enum`, `map`, `union`, and `fixed` types as top-level elements.

### Explanation

Avro is schema-driven, and its root schema does not have to be a record. A transformation design must therefore consider the schema's actual top-level type rather than assuming object fields are always available at the root.

### Common mistake

- Hard-coding `payload.someField` as though every Avro root were a record.
- Ignoring the supplied Avro schema when determining the payload shape.
- Treating `union` as though it were always one fixed concrete type.

### Interview tip

For schema-driven formats, identify the **root schema type first**, then design selectors and output logic around that type.

### Source note

MuleSoft documents top-level Avro `enum`, `map`, `union`, and `fixed` support in DataWeave 2.11 issue W-19596039.

---

## A394 — Optional types through chained value selectors

**Difficulty:** Advanced  
**Topic:** Type propagation, optional values, safe navigation

### Question

A typed DataWeave expression reads through several selectors, and an intermediate value is optional. How should the optional type propagate through the selector chain, and why is it unsafe to assume that a later selector is automatically non-null just because an earlier selector was valid in one sample payload?

### Example shape

```dataweave
%dw 2.0
output application/json
---
{
  city: payload.customer?.address?.city
}
```

### Expected behavior

Optionality should propagate correctly through chains of value selectors. A later selected value must continue to reflect the possibility that the preceding optional path did not produce a value.

### Explanation

Type propagation matters independently of whether one sample payload happens to contain every nested field. A type-aware transformation must preserve the optional nature of the navigation path instead of prematurely treating the final value as guaranteed.

### Common mistake

- Testing only a fully populated payload and assuming the type is always required.
- Adding unnecessary casts merely to suppress optionality.
- Confusing an absent optional value with an empty string.

### Interview tip

When reviewing nested selectors, reason about the **type of every intermediate expression**, not just the final sample output.

### Source note

MuleSoft documents correct propagation of optional types through chains of value selectors in DataWeave 2.11 issue W-19272070.

---

## A395 — Type inference when subtracting an object key with `--`

**Difficulty:** Advanced  
**Topic:** Object type inference, key subtraction

### Question

A typed object contains several fields and the transformation removes one field using the `--` operator. What should type inference preserve about the resulting object, and why should a developer avoid treating the result as an untyped arbitrary object?

### DataWeave

```dataweave
%dw 2.0
output application/json
var customer = {
  id: 101,
  name: "Ravi",
  internalCode: "X9"
}
---
customer -- "internalCode"
```

### Expected behavior

DataWeave's type inference correctly handles object-key subtraction with `--`, preserving the appropriate inferred structure rather than incorrectly failing type inference.

### Explanation

The `--` operator changes the object shape. A type-aware compiler must account for that shape change when inferring the result. This is a type-inference problem, not simply a runtime deletion problem.

### Common mistake

- Assuming `--` always turns the result into an untyped object.
- Confusing `--` key subtraction with array filtering.
- Reasoning only from runtime values while ignoring the inferred result type.

### Interview tip

For object transformations, distinguish **value-level shape changes** from **type-level shape inference**.

### Source note

MuleSoft documents correct type inference for the `--` object-key subtraction operator in DataWeave 2.11 issue W-19595907.

---

## A396 — Lazy source-file loading during binary compilation

**Difficulty:** Advanced  
**Topic:** Compiler memory behavior, lazy loading, build performance

### Question

A large DataWeave project is being compiled to binary form and contains source files that are not needed immediately. Why is lazy source-file loading useful during binary compilation, and what memory problem does it avoid?

### Expected behavior

DataWeave supports lazy loading of source files during binary compilation so that unnecessary source content is not loaded into memory before it is needed.

### Explanation

Compilation pipelines can consume significant memory when every source file is eagerly loaded. Lazy loading defers loading until the compiler actually needs a source, reducing unnecessary memory consumption during binary compilation.

### Common mistake

- Assuming lazy loading means the source is never loaded.
- Confusing compiler source loading with runtime payload streaming.
- Treating this as a transformation-language operator.

### Interview tip

Separate **compiler/build-time memory optimization** from **runtime streaming**. Both reduce memory, but at different stages and for different reasons.

### Source note

MuleSoft documents lazy source-file loading during binary compilation in DataWeave 2.11 issue W-19594703.

---

## A397 — Warning and error propagation across compilation phases

**Difficulty:** Advanced  
**Topic:** Compiler diagnostics, multi-phase compilation

### Question

A DataWeave compilation pipeline has multiple compilation phases. A warning or error is produced in one phase and must remain visible to the caller after subsequent phases run. What diagnostic behavior should the compiler provide?

### Expected behavior

Warnings and errors should propagate correctly between compilation phases so that diagnostics generated earlier are not silently lost when later compiler stages process the same mapping.

### Explanation

A multi-phase compiler cannot treat each phase's diagnostics as isolated. Preserving warnings and errors across phases allows tooling and build systems to report the complete diagnostic picture rather than only the final phase's messages.

### Common mistake

- Assuming only the final compiler phase's diagnostics matter.
- Replacing earlier diagnostics instead of propagating them.
- Treating compiler diagnostics as runtime error handling.

### Interview tip

For compiler/tooling questions, distinguish **compile-time diagnostics** from **runtime `try`/error handling**. They belong to different execution stages.

### Source note

MuleSoft documents correct warning/error propagation between compilation phases in DataWeave 2.11 issue W-19386849.
