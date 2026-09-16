# Final Unique DataWeave Gaps — A299-A310

These questions target capabilities that were still absent from the curated bank after checking the existing REAL-QA coverage. They deliberately avoid simple rewordings of existing questions.

## A299 — Runtime script evaluation with `evalUrl`
**Question:** A DataWeave application must execute another DataWeave script from a classpath URL and supply both reader inputs and direct input values. How can `dw::Runtime::evalUrl` be used, and what does its `EvalResult` expose on success?

**Focus:** runtime script evaluation, external DWL execution, `readerInputs`, `inputValues`, `EvalResult`.

---

## A300 — Java `^class` metadata-driven object creation
**Question:** A transformation must create a specific Java class from a DataWeave value without changing the payload shape. How does Java `^class` metadata control the Java writer's target class, and when would explicit `class` metadata be required?

**Focus:** Java metadata, object construction, Java writer interoperability.

---

## A301 — Java duplicate-key and attribute writer behavior
**Question:** A DataWeave object contains duplicate keys and attribute metadata. Design an `application/java` output configuration that converts duplicate keys into an array and materializes attributes as child entries. What do `duplicateKeyAsArray` and `writeAttributes` change?

**Focus:** Java writer-specific behavior and metadata materialization.

---

## A302 — DWB indexed reader versus write index
**Question:** A large DataWeave Binary file is read repeatedly. Explain the difference between the DWB `indexedReader` reader property and the `writeIndex` writer property, including why encoding can affect indexed reading and how a written index can avoid reparsing.

**Focus:** DWB random-access/index design and performance.

---

## A303 — NDJSON invalid-record policy
**Question:** An NDJSON feed contains blank lines and occasional malformed records. Design a reader configuration that ignores blank lines but deliberately skips malformed records. Explain the trade-off between `ignoreEmptyLine` and `skipInvalid`.

**Focus:** NDJSON resilience and data-quality policy.

---

## A304 — Excel table offset and header semantics
**Question:** An XLSX worksheet contains a table beginning at `C5`, and the source does not contain a header row. How should `tableOffset` and `header` be configured, and what column names should the transformation expect when headers are disabled?

**Focus:** Excel reader/writer table positioning and header semantics.

---

## A305 — Excel zip-bomb protection boundary
**Question:** An XLSX integration rejects a file during archive safety validation. Explain the purpose of the Excel `zipBombCheck` property, what changes when it is disabled, and why this is a security-sensitive configuration rather than an ordinary parsing option.

**Focus:** XLSX archive safety and defensive configuration.

---

## A306 — Flat-file missing-value semantics
**Question:** A COBOL copybook represents missing numeric data using zeroes while another fixed-width feed represents missing values using spaces. Design the reader configuration using `missingValues` and `useMissCharAsDefaultForFill`, and explain why the same input characters can represent either data or missing values depending on configuration.

**Focus:** flat-file missing-value semantics and schema-dependent interpretation.

---

## A307 — Flat-file record selection in multi-structure schemas
**Question:** A flat-file schema defines multiple segment or structure definitions, but an integration needs to parse only one specific record definition. Which schema-identification properties are relevant, and how do `segmentIdent` and `structureIdent` differ?

**Focus:** multi-record flat-file schema selection.

---

## A308 — Java `Reader` and `File` mappings to DataWeave
**Question:** A Java integration supplies a `java.io.Reader` in one case and a `java.io.File` in another. What DataWeave types do these Java values map to, and how does that differ from `InputStream` and `ByteBuffer` mappings?

**Focus:** less-common Java-to-DataWeave type boundaries.

---

## A309 — Java `Atomic*` and Optional primitive mappings
**Question:** A Java API exposes `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `OptionalInt`, `OptionalLong`, and `OptionalDouble`. Map each to its DataWeave representation and explain how empty primitive Optionals differ from present values.

**Focus:** Java wrapper/atomic and primitive-Optional interoperability.

---

## A310 — Base64 large-payload memory behavior
**Question:** A transformation Base64-encodes very large binary content. Explain how the DataWeave system property `com.mulesoft.dw.base64ChunksEnabled` changes the memory behavior of `dw::core::Binaries::fromBase64` and `toBase64`, and what design concern it addresses.

**Focus:** large-payload Base64 processing and memory behavior.
