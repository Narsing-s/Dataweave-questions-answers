# Web-Sourced DataWeave Questions — Batch 010

These entries were selected from public DataWeave documentation and kept only when the repository did not already contain the same concept. Existing questions and semantically equivalent gap questions are not repeated.

## Q74 — What are the `dw::util::Values` helper functions `field`, `attr`, and `index` used for in DataWeave?

**Answer:** The `dw::util::Values` module provides helper functions that create `PathElement` values for dynamic selectors and update-style operations. `field(name)` creates a path element for an object field, `attr(name)` creates one for an XML attribute, and `index(number)` creates one for an array element.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Values
output application/json
---
{
  fieldPath: field("customerId"),
  attributePath: attr("id"),
  arrayPath: index(1)
}
```

**Output**
The exact serialized representation of a `PathElement` is runtime/type dependent. Conceptually, the result contains three path elements representing an object field, an XML attribute, and array index `1`.

**Explanation:** These helpers are useful when a transformation needs to construct selector paths dynamically rather than hard-code a selector expression. The `Values` module was introduced in DataWeave 2.2.2 and includes `attr`, `field`, `index`, `mask`, and `update`. citeturn0search13