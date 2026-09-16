# DataWeave Compatibility and Language-Edge Gaps — A407-A409

These questions were added only after checking the existing curated bank and the current official DataWeave documentation/release notes. They target distinct compatibility/language behaviors rather than repeating ordinary transformation exercises.

## A407 — `internal` as a valid identifier

**Difficulty:** Medium  
**Topic:** Language compatibility, reserved words, identifiers

**Question:** A DataWeave script from an older language level uses `internal` as an ordinary variable or field identifier. What should you check when moving it to a current DataWeave language level?

**Scenario:**

```dataweave
%dw 2.0
output application/json
var internal = "legacy-value"
---
{
  value: internal
}
```

**Answer:** In current DataWeave 2.12, `internal` is no longer treated as a reserved word, so it can be used as an identifier. The important migration concern is to distinguish the keyword's historical lexical status from the `internal` visibility modifier introduced for scope control.

**Expected behavior:** A current DataWeave 2.12 compiler accepts `internal` as an identifier in a script such as the scenario above, while `internal` can also be used in its visibility-related language role where applicable.

**Explanation:** This is a language-compatibility edge case, not a scope-visibility question. A word can have a special syntactic role in one context while still being legal as an identifier in another language version/context. DataWeave 2.12 specifically documents that `internal` is no longer a reserved word.

**Common mistake:** Assuming that because `internal` participates in scope visibility, it must be forbidden everywhere as a variable or field name.

**Interview tip:** Separate **reserved-word rules**, **identifier rules**, and **visibility modifiers** when discussing DataWeave language compatibility.

---

## A408 — `sizeOf` compatibility for `NumberType`

**Difficulty:** Advanced  
**Topic:** Compatibility flags, type metadata, numeric semantics

**Question:** An application upgraded across DataWeave versions and an expression involving `sizeOf` on a value represented by `NumberType` produces a different result than before. What kind of compatibility issue should you investigate?

**Scenario:**

```dataweave
%dw 2.0
output application/json
var amount = 123.4500 as Number
---
{
  value: amount,
  size: sizeOf(amount)
}
```

**Answer:** Investigate the DataWeave compatibility behavior associated with `sizeOf` and `NumberType`, rather than assuming the transformation logic itself changed. MuleSoft documented a compatibility flag for differences in `sizeOf` results for `NumberType`.

**Expected behavior:** When migrating an application whose behavior depends on the historical `NumberType`/`sizeOf` result, select the appropriate DataWeave language level or compatibility setting instead of hard-coding a guessed numeric size.

**Explanation:** `sizeOf` is overloaded across DataWeave value types, and numeric type semantics can be compatibility-sensitive. This question is about migration-safe behavior and version compatibility, not about the ordinary `sizeOf` examples for strings, arrays, or objects.

**Common mistake:** Treating `sizeOf(Number)` as a universal numeric-length operation whose result can never vary across language versions.

**Interview tip:** When a DataWeave upgrade changes a result without an obvious transformation change, check the language-level compatibility flags before rewriting the mapping.

---

## A409 — Preserving trailing-zero numeric formatting across language levels

**Difficulty:** Advanced  
**Topic:** Number formatting, coercion, compatibility flags

**Question:** A legacy DataWeave application expects a numeric value written as `12.30` to retain its trailing zeroes, but a newer language level writes the numeric value without preserving that formatting. How should the mapping be designed?

**Scenario:**

```dataweave
%dw 2.0
output application/json
var amount = "12.30" as Number {format: "0.00"}
---
{
  amount: amount
}
```

**Answer:** Do not assume that number format metadata remains attached to a numeric value for output formatting across language levels. Current DataWeave behavior strips trailing zeroes when directly writing number values for consistency across formats. If legacy behavior must be preserved, use the documented `stripTrailingZeroes` compatibility setting or explicitly coerce the number to a formatted `String` at the output boundary.

**Expected behavior:**

- For a numeric JSON value, the representation is subject to the current number-writing rules.
- If the business contract requires textual formatting such as exactly `12.30`, emit a `String` with an explicit format rather than relying on numeric representation.

**Explanation:** DataWeave documentation notes that starting with DataWeave 2.5, directly writing number values does not preserve formatting and strips trailing zeroes. The `stripTrailingZeroes` compatibility behavior exists for applications that need to retain the historical behavior. This is different from ordinary number-to-string coercion with a `format` property.

**Common mistake:** Expecting a numeric JSON value to carry presentation formatting such as a fixed number of decimal places.

**Interview tip:** Distinguish **numeric value semantics** from **serialized presentation**. If `12.30` is a contractual display/string requirement, make the output type a `String` with explicit formatting.

---

## Source note

MuleSoft's current DataWeave documentation and release notes document that `internal` is no longer a reserved word in DataWeave 2.12, that a compatibility flag addresses historical `sizeOf` differences for `NumberType`, and that trailing-zero preservation is compatibility-sensitive when writing numeric values. These topics were checked against the repository's existing curated coverage before adding them.
