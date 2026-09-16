# DataWeave Compatibility and Runtime-Behavior Gaps — A410-A411

These questions cover distinct documented behaviors that were not found as dedicated conceptual questions in the curated bank.

## A410 — Strict `orderBy` comparison across mixed types

**Difficulty:** Advanced  
**Topic:** `orderBy`, type comparison, compatibility behavior

**Question:** A transformation sorts values containing both Numbers and Strings. What happens when strict `orderBy` comparison is enabled, and why is this different from the lazy evaluation behavior covered elsewhere?

**Scenario:**

```dataweave
%dw 2.4
output application/json
---
[5, 1, "10"] orderBy $
```

**Answer:** With `com.mulesoft.dw.stableOrderBy` enabled, DataWeave throws `InvalidComparisonException` when `orderBy` attempts to compare values of different types. With the compatibility behavior disabled, DataWeave can coerce values during comparison, which can produce a different ordering.

**Expected behavior:**

- `stableOrderBy = true`: mixed-type comparison is rejected with `InvalidComparisonException`.
- `stableOrderBy = false`: DataWeave may use coercion for the comparison and produce an order such as `[1, "10", 5]` for the documented example.

**Explanation:** This question concerns the **comparison policy** used by `orderBy`. It is distinct from A382, which focuses on when the sort-key expression is evaluated. One is about type compatibility during comparison; the other is about evaluation strategy.

**Common mistake:** Assuming that `orderBy` always coerces unlike types or assuming that a stable-order setting controls whether the key expression is evaluated lazily.

**Interview tip:** Separate sorting's **key evaluation**, **value comparison**, and **compatibility configuration** as three different concerns.

---

## A411 — Inspecting a DataWeave compatibility flag at runtime

**Difficulty:** Advanced  
**Topic:** Compatibility introspection, runtime diagnostics, migration

**Question:** A migration diagnostic needs to report whether a specific DataWeave compatibility flag is active in the current execution environment. Which function can inspect the flag without hard-coding the runtime version?

**Scenario:**

```dataweave
%dw 2.0
output application/json
---
{
  mixedContentCompatibility:
    evaluateCompatibilityFlag("com.mulesoft.dw.xml_reader.honourMixedContentStructure")
}
```

**Answer:** Use `evaluateCompatibilityFlag(flag: String)`. It returns the Boolean value of the named compatibility flag in the current DataWeave environment.

**Expected behavior:** The transformation reports the effective compatibility-flag state rather than assuming that the running Mule/DataWeave version alone determines the behavior.

**Explanation:** DataWeave compatibility flags are tied to the configured DataWeave language level, and some flags can remain available for backward compatibility even on a newer runtime. `evaluateCompatibilityFlag` provides runtime introspection of the flag's current value.

**Common mistake:** Inferring a compatibility flag solely from the Mule runtime version or from the `%dw` syntax directive.

**Interview tip:** Distinguish the **Mule runtime version**, **DataWeave language level**, **script syntax version**, and the **effective compatibility flag**. They are related but not interchangeable.

## Source note

MuleSoft's current system-property documentation describes `com.mulesoft.dw.stableOrderBy` and its mixed-type comparison behavior, while the `evaluateCompatibilityFlag` reference documents runtime inspection of compatibility flags. DataWeave versioning documentation explains that compatibility flags depend on the configured language level. citeturn0search0turn0search1turn0search5
