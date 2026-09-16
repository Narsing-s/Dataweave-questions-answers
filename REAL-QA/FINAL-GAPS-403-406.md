# DataWeave Tooling, Range Performance and Version Metadata Gaps — A403-A406

These questions were added after comparing the curated index/gap analysis with the official DataWeave 2.11 release notes. They cover documented behaviors not represented by a dedicated question.

## A403 — Cross-file AST scope navigation in the Tooling API

**Difficulty:** Advanced  
**Topic:** Tooling API, AST navigation, cross-file references

### Question
A DataWeave tooling integration follows a reference from one source file into another. What should the Tooling API provide so cross-file navigation resolves the referenced scope correctly?

### Scenario
```text
module.dwl -> helper.dwl -> referenced scope
```

### Expected behavior
The Tooling API should resolve AST scope navigation correctly for cross-file references.

### Explanation
Editor and language-service tooling needs semantic navigation across source files. This is an AST/tooling concern, not runtime payload transformation.

### Common mistake
- Treating cross-file references as plain text search.
- Assuming AST navigation is limited to one file.
- Confusing tooling scope resolution with runtime module execution.

### Interview tip
Distinguish AST structure, scope resolution, and runtime module loading.

### Source note
DataWeave 2.11 issue W-20212809 documents corrected AST scope navigation for cross-file references.

---

## A404 — Array range-selector performance on large collections

**Difficulty:** Advanced  
**Topic:** Selectors, performance, large collections

### Question
A transformation uses a valid Array range selector on a large collection. What performance behavior should be considered, and how is this different from an invalid-range correctness question?

### Example
```dataweave
%dw 2.0
output application/json
---
payload[1000 to 5000]
```

### Expected behavior
The Array range selector should not exhibit the performance degradation fixed in DataWeave 2.11.1.

### Explanation
This concerns performance of a valid range, not the semantics of invalid or reversed ranges. A selector can be correct while still suffering a runtime performance regression.

### Common mistake
- Treating every range issue as a correctness issue.
- Using invalid-range behavior to diagnose valid-range performance.
- Assuming a performance regression changes language semantics.

### Interview tip
Separate valid-input semantics from runtime performance when troubleshooting selectors.

### Source note
DataWeave 2.11.1 documents the Array range selector performance fix as W-20220578.

---

## A405 — Syntax-version metadata in `TypeGraph` and `WeaveTypeResolution`

**Difficulty:** Advanced  
**Topic:** Compiler type model, language-version metadata, compatibility

### Question
A compiler/tooling component receives a DataWeave type graph and needs to know which syntax version the resolved type information belongs to. What metadata should be available and why can it matter across language levels?

### Scenario
```text
DataWeave source -> TypeGraph -> syntax version -> WeaveTypeResolution
```

### Expected behavior
The syntax version is represented in `TypeGraph` and `WeaveTypeResolution` metadata.

### Explanation
Compiler and tooling consumers can use this information to distinguish type-resolution data associated with different DataWeave language versions. This is compiler metadata, not ordinary runtime version reporting.

### Common mistake
- Assuming Mule runtime version alone describes every type graph's syntax context.
- Treating syntax version as a payload field.
- Confusing compiler metadata with runtime compatibility.

### Interview tip
Keep Mule runtime version, DataWeave language level, and compiler type-model syntax version conceptually separate.

### Source note
DataWeave 2.11 documents syntax-version metadata in `TypeGraph` and `WeaveTypeResolution` as W-19271992.

---

## A406 — Windows classloader resource resolution

**Difficulty:** Advanced  
**Topic:** Compiler environment, classloaders, platform-specific resource resolution

### Question
A DataWeave compiler/tooling process runs on Windows and loads a resource through a classloader. What behavior should the resource resolver provide, and why is this different from a DataWeave transformation expression?

### Scenario
```text
Windows -> classloader resource request -> DataWeave resolver -> correct resource path
```

### Expected behavior
The classloader resource resolver should resolve resource paths correctly on Windows systems.

### Explanation
Platform-specific classloader/path handling matters for compiler and tooling environments that load packaged DataWeave resources. This is an environment/compiler resource-loading concern, not a payload transformation rule.

### Common mistake
- Treating a Windows resource-resolution failure as DataWeave syntax failure.
- Assuming classloader resources behave exactly like ordinary filesystem paths.
- Applying runtime mapping changes to a compiler resource-loading problem.

### Interview tip
Identify whether a failure occurs during parsing, resource loading, compilation, or runtime transformation before changing the mapping.

### Source note
DataWeave 2.11 documents corrected Windows classloader resource resolution as W-19407283.
