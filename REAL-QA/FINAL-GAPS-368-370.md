# Final DataWeave Gap Questions — A368-A370

These additions cover distinct DataWeave 2.12 runtime edge cases identified in the current official release notes and not represented as dedicated questions in the curated bank.

## A368 — Overloaded functions invoked across modules

**Difficulty:** Advanced  
**Topic:** Modules / overload resolution / cross-module invocation

### Scenario
A reusable module defines overloaded functions with the same name:

```dw
%dw 2.0
fun normalize(v: Number) = v as String
fun normalize(v: String) = upper(v)
```

A consuming module imports the function and invokes it with a numeric value.

### Question
What compatibility behavior must be preserved when overloaded DataWeave functions are invoked across module boundaries?

### Expected behavior
The imported overload must be resolved and invoked consistently with the argument type. Cross-module invocation should not introduce a runtime failure simply because the overload was declared in another module.

### Explanation
Overloading is a type/signature concern, while importing is a module-boundary concern. A reusable module can expose multiple signatures for one function name, so metadata and runtime dispatch must remain consistent across that boundary.

### Common mistake
Assuming that importing a function collapses all overloads into one dynamically selected implementation.

### Interview tip
Explain how overloaded signatures differ from ordinary dynamic dispatch and why module boundaries must preserve the overload information.

---

## A369 — Deferred values consumed by `write`

**Difficulty:** Advanced  
**Topic:** Deferred output / serialization / streaming lifecycle

### Scenario
A transformation creates output that is intended to be consumed lazily and then passes it to a writer:

```dw
%dw 2.0
output application/json
var values = [10, 20, 30]
---
write(values map ($ * 2), "application/json")
```

The application uses deferred-output processing around the transformation.

### Question
What should happen when deferred output is ultimately passed to `write`?

### Expected behavior
The writer must fully consume the deferred value and terminate the deferred computation correctly. The serialization boundary must not leave the deferred output incomplete.

### Explanation
Deferred processing postpones materialization, but `write` is a serialization boundary that ultimately needs the value in the requested representation. Correct termination is therefore part of the interaction between deferred computation and output serialization.

### Common mistake
Treating deferred output as only an optimization and ignoring that a writer must eventually force and finish consumption.

### Interview tip
Distinguish lazy/deferred evaluation from serialization. The writer is one of the points where postponed computation becomes observable output.

---

## A370 — Large XML text or CDATA with the indexed reader

**Difficulty:** Advanced  
**Topic:** XML indexed reader / memory behavior / large text nodes

### Scenario
An XML document contains a very large text or CDATA section followed by important business elements. The application uses the indexed XML reader so that it can navigate to selected XML content without treating the entire document as one eagerly materialized value.

### Question
Does using an indexed XML reader automatically guarantee safe memory usage for arbitrarily large text or CDATA sections?

### Expected behavior
No. Indexed navigation does not make the memory cost of every individual text or CDATA node negligible. Large text sections still require careful reader and runtime-version consideration.

### Explanation
Document indexing and node materialization are different concerns. A reader can provide indexed navigation while a single unusually large text node still creates substantial memory pressure. DataWeave 2.12.0 included a fix addressing out-of-memory conditions for large text or CDATA sections with the indexed XML reader.

### Common mistake
Assuming that “indexed” means every part of the XML document is processed with constant memory.

### Interview tip
When evaluating XML streaming/indexing, analyze both the navigation strategy and the size of individual nodes. A production design should consider worst-case text and CDATA sizes as well as document size.
