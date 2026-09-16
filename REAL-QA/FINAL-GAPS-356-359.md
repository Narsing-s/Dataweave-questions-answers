# Additional Unique DataWeave 2.12 Gaps — A356-A359

## A356 — Component descriptors
**Question:** A DataWeave library uses `internal` directives. How does `META-INF/dw-components.dwl` identify which modules belong to the same component?

**Input:**
```dwl
[{ name: "orders-lib", resources: { "com::acme::Orders": {}, "com::acme::Validation": {} } }]
```

**Expected result:** Both modules belong to `orders-lib`, allowing component-based visibility decisions.

**Explanation:** DataWeave 2.12 introduces component metadata. A component descriptor names a component and lists its owned modules.

**Common mistake:** Treating the descriptor as application payload instead of compiler metadata.

**Interview tip:** Explain why component ownership is needed for `internal` access.

## A357 — Component metadata types
**Question:** A tooling utility reads `dw-components.dwl`. Which types represent the top-level descriptor, a component, and a module entry?

**Input:**
```dwl
[{ name: "orders-lib", resources: { "com::acme::Orders": {} } }]
```

**Expected mapping:** The outer array is `ComponentsDescriptor`; each object is `ComponentDescriptor`; each resource value is `ModuleDescriptor`.

**Explanation:** These types provide a typed model for component metadata. `ModuleDescriptor` is reserved for future fields and is currently `{}`.

**Common mistake:** Assuming resource values contain arbitrary business metadata.

**Interview tip:** Distinguish component identity, owned module names, and module descriptor metadata.

## A358 — Per-component language levels
**Question:** An embedded DataWeave engine must compile a script while imported components use their own compatibility levels. What problem does `componentLanguageLevels` solve?

**Scenario:** The host compiles at language level `2.12` while pinning a legacy component to an earlier level.

**Expected behavior:** The engine can apply the configured language level per component rather than forcing one level on every component.

**Explanation:** DataWeave 2.12 adds `componentLanguageLevels` to the embedded scripting-engine compile API and uses it with version metadata such as `@Since` for library compatibility.

**Common mistake:** Confusing a component language level with the Mule runtime version.

**Interview tip:** Treat component-level language compatibility as a library-evolution problem.

## A359 — `UNLIMITED_CONTEXT` precision metadata
**Question:** A high-precision transformation uses `UNLIMITED_CONTEXT`. What do its `precision=0` and `roundingMode=HALF_UP` properties communicate?

**Input:**
```dwl
{ precision: UNLIMITED_CONTEXT.precision, roundingMode: UNLIMITED_CONTEXT.roundingMode }
```

**Expected result:** The metadata reports precision `0` and rounding mode `HALF_UP` in current DataWeave 2.12 behavior.

**Explanation:** DataWeave 2.12 documents these properties for `UNLIMITED_CONTEXT`, making arithmetic-context assumptions explicit.

**Common mistake:** Assuming an unlimited context means rounding behavior is irrelevant.

**Interview tip:** Separate arithmetic context from business rounding policy.
