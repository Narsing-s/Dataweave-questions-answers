# A423-A426 — Current DataWeave system-property and Java/CSV runtime gaps

These additions were selected only after checking the curated repository for the specific properties/concepts. They target distinct runtime, memory, interoperability, and determinism behavior rather than rewording existing questions.

## A423 — Buffer spill threshold and temporary-file behavior

**Difficulty:** Advanced  
**Focus:** DataWeave memory management / `com.mulesoft.dw.buffersize`

### Question
A DataWeave transformation processes a large input and uses internal input/output buffering. The deployment team wants to understand what `com.mulesoft.dw.buffersize` actually controls. Explain the behavior when the processed data stays below the configured byte threshold and when it exceeds it. Why can changing this value affect memory usage without simply eliminating disk I/O?

### Expected answer
`com.mulesoft.dw.buffersize` controls the size of the in-memory input and output buffers. The documented default is 8192 bytes. When processed data exceeds the configured threshold, DataWeave can retain the excess through temporary buffer files such as `dw-buffer-index-${count}.tmp` and `dw-buffer-output-${count}.tmp`. Therefore, increasing the threshold can allow more data to remain in memory, while lowering it can cause earlier spill-to-temporary-file behavior. The property is a buffering trade-off, not a switch that makes a transformation completely memory-only or completely disk-backed.

### Explanation
This is different from `com.mulesoft.dw.directbuffer.disable`: that property concerns whether internal buffering uses off-heap/direct memory versus heap memory. `buffersize` instead controls the size of the in-memory buffer before DataWeave uses temporary files.

### Common mistake
Assuming `buffersize` is the total maximum memory that a DataWeave script can consume. It is a buffer threshold, not a global memory limit.

### Interview tip
When diagnosing memory/performance issues, distinguish buffer size, off-heap/heap selection, indexed-reader page size, and large-field chunking. They control different parts of DataWeave memory behavior.

---

## A424 — Indexed CSV string-retention memory trade-off

**Difficulty:** Advanced  
**Focus:** CSV indexed reader / `com.mulesoft.dw.csv_reader.indexed.retainStringValueInMemory`

### Question
A very large CSV is accessed through indexed-reader behavior and the application experiences memory pressure because string values remain referenced in memory. Which DataWeave system property addresses this specific behavior, what happens when it is set to `false`, and what trade-off should the developer expect?

### Expected answer
Set `com.mulesoft.dw.csv_reader.indexed.retainStringValueInMemory` to `false`. This prevents the DataWeave indexed CSV reader from keeping string-value references in memory. The trade-off is reduced performance, but the setting can help prevent out-of-memory errors. In current DataWeave documentation, the default is `false` for language levels 2.10 through 2.12, while older supported language levels have different defaults.

### Explanation
This question is specifically about indexed CSV string-reference retention. It is not the same as CSV streaming, the general `buffersize` threshold, or indexed XML large-text behavior. The optimization targets retained CSV string references.

### Common mistake
Assuming that `streaming=true` and this property are interchangeable. They address different reader/memory behaviors.

### Interview tip
For large CSV troubleshooting, first identify whether the workload is sequential streaming or indexed/random-access processing; then choose the memory control that matches the actual bottleneck.

---

## A425 — Deterministic Java method ordering during module loading

**Difficulty:** Advanced  
**Focus:** Java interoperability / `mule.dw.java_module_loader_deterministic_functions_ordering`

### Question
A DataWeave application invokes overloaded Java methods and the team needs the JavaModuleLoader to expose those methods in a deterministic order. Which system property controls this, and which method characteristics are used to establish the deterministic order?

### Expected answer
Set `mule.dw.java_module_loader_deterministic_functions_ordering` to `true`. The JavaModuleLoader then loads Java class methods in deterministic order using the method name, the number of parameters, and finally the parameter type name. The documented default is `true` for language levels 2.5 and 2.6.

### Explanation
This is specifically about deterministic JavaModuleLoader method ordering. It should not be confused with ordinary DataWeave overloaded-function dispatch questions: deterministic loading controls how Java methods are ordered when exposed by the Java module loader.

### Common mistake
Assuming deterministic ordering means DataWeave will always choose the same overload regardless of type compatibility. Method ordering and overload applicability/type resolution are separate concerns.

### Interview tip
For Java interop issues, separate three layers: Java reflection/module loading, DataWeave method exposure/order, and DataWeave type/coercion-based overload resolution.

---

## A426 — Java reflection accessibility control on JDK 17+

**Difficulty:** Advanced  
**Focus:** Java interoperability / `com.mulesoft.dw.java.disable_set_accessible`

### Question
A DataWeave application runs on JDK 17+ and uses Java reflection through the JavaModuleLoader. The team wants to prevent DataWeave from changing the Java reflection accessible flag on fields or methods. Which system property controls this behavior, and why is this particularly relevant to newer JDK environments?

### Expected answer
Set `com.mulesoft.dw.java.disable_set_accessible` to `true`. When enabled, the JavaModuleLoader does not change the accessible flag for fields or methods used through reflection. Current documentation describes the default as dependent on the JDK version and DataWeave language level; it is `true` when the JDK is 17 or later and the language version is 2.6 or later.

### Explanation
This is more specific than general Java 17+ JPMS access-boundary coverage. JPMS describes module-access restrictions broadly; this property controls whether DataWeave attempts to alter reflective accessibility for the Java members it uses.

### Common mistake
Treating this property as a general switch that grants or removes Java module permissions. It does not grant permissions; it changes whether DataWeave changes the Java reflection accessible flag.

### Interview tip
When Java interop changes across JDK versions, check both module-access rules and DataWeave's reflection configuration. They are related but not identical mechanisms.

---

## Duplication review

The repository was searched for the specific concepts/properties before these additions. No existing curated match was found for:

- `com.mulesoft.dw.buffersize`
- `com.mulesoft.dw.csv_reader.indexed.retainStringValueInMemory`
- `mule.dw.java_module_loader_deterministic_functions_ordering`
- `com.mulesoft.dw.java.disable_set_accessible`

These questions are intentionally separated from existing coverage of direct/off-heap buffers, indexed XML memory, Java bean accessor discovery, JPMS boundaries, and overloaded DataWeave functions because each adds a distinct system-property behavior or trade-off.

## Source basis

The concepts and documented defaults are based on MuleSoft's current DataWeave System Properties documentation. Availability and defaults can depend on the DataWeave language level, not only the Mule runtime version.
