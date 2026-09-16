# A471-A472 — Current DataWeave metadata-operation gaps

These questions cover concrete metadata behavior that is distinct from the existing `@Metadata` annotation-definition question.

## A471 — Metadata assignment with `<~`
**Question:** A DataWeave value already has a useful type/value and you need to attach metadata without coercing the value to another type. When should the metadata assignment operator `<~` be used instead of `as`, and what does the operator preserve?

**Answer:** `<~` assigns a metadata object to an existing value while retaining the value itself and its current value type. The `as` operator is used when coercing a value to a target type and can also carry metadata as part of the type expression. Therefore, `<~` is the direct choice when the goal is metadata assignment rather than type coercion.

**Focus:** metadata assignment versus type coercion and value preservation.

---

## A472 — Metadata annotation restrictions and additive metadata
**Question:** A reusable DataWeave metadata annotation is declared with `@Metadata(key = "class")`. What restrictions apply to the annotation's parameter, and what happens when multiple metadata annotations are applied to a value that already has metadata?

**Answer:** A metadata annotation can have only one parameter, and that parameter must be named `value`. The metadata key comes from the `key` supplied to `@Metadata`, not from the annotation name. Metadata annotations are additive: applying another metadata annotation appends its key-value information to the existing metadata rather than replacing the existing metadata.

**Focus:** metadata annotation contract, key/value semantics, and additive metadata behavior.

---

## Source basis
- MuleSoft DataWeave Operators documentation: metadata assignment with `<~` and metadata annotations.
- MuleSoft DataWeave Core Annotations documentation: `@Metadata`.
