# A494-A496 — Advanced DataWeave Runtime and Security Questions

These questions are intentionally multi-part, scenario-based questions rather than one-line syntax exercises. They focus on production reasoning, implementation, failure analysis, and interview-level depth.

## A494 — Design and safely reason about dynamic DataWeave execution with `dw::Runtime::evalUrl`

### Question
A Mule application needs to execute a DataWeave transformation selected at runtime. The transformation is stored as a resource and receives both reader inputs and ordinary input values. Explain how `dw::Runtime::evalUrl` differs from a normal `import` or statically compiled mapping, how its inputs are supplied, what result structure the caller should handle, and what production risks must be considered before allowing a URL or external resource to determine executable DataWeave code.

### Answer
`dw::Runtime::evalUrl` evaluates a DataWeave script located at the supplied URL and returns an `EvalResult`. It can receive `readerInputs` for values that should be interpreted as reader inputs and `inputValues` for values bound directly into the evaluated script. The result is not simply the transformed value: the caller should inspect the execution result and handle success, value, and diagnostic/log information appropriately.

This is materially different from a normal `import`. An import establishes a statically referenced module during compilation, whereas `evalUrl` performs runtime script evaluation. Therefore a design using it must treat the script source as executable code, not merely as data.

For production use, the URL/source must be tightly controlled. Do not allow untrusted users to choose arbitrary executable DataWeave resources. Validate the source location, restrict resource access, control privileges, and define failure handling and observability. The current MuleSoft documentation marks `evalUrl` as experimental, so teams should also account for API evolution when using it.

### Example
```dw
%dw 2.0
import * from dw::Runtime
output application/json
---
{
  execution: evalUrl(
    "classpath://mappings/customer.dwl",
    {},
    { payload: { name: "Narsing" } }
  )
}
```

### Common mistake
Treating `evalUrl` as if it were equivalent to an ordinary module import and assuming that the URL can safely come from user-controlled input.

### Interview tip
Explain the distinction between **compile-time module reuse** and **runtime script evaluation**. A strong answer also discusses source trust, privileges, failure contracts, and operational control rather than only showing the function syntax.

---

## A495 — Build a cryptographic-security gate for DataWeave transformations

### Question
A DataWeave library is built through Maven and security policy requires the build to detect use of weak cryptographic algorithms. Design a DataWeave-oriented build-time control that identifies cryptographic sinks, explain why this is different from validating the final JSON/XML output, and describe how the control should fit into CI/CD without confusing transformation correctness with security analysis.

### Answer
Cryptographic security is a property of how sensitive operations are performed, not merely of the output shape. A DataWeave build can use the Maven-plugin cryptographic taint-analysis guidance to identify flows reaching configured cryptographic sinks and reject or investigate algorithms that the organization's policy considers weak.

The important distinction is that ordinary DataWeave tests answer questions such as:

- Did the mapping produce the expected fields?
- Was the value transformed correctly?
- Did invalid input produce the expected error?

Cryptographic taint analysis answers a different question:

- Can data reach a cryptographic operation that violates the configured security policy?

A robust CI/CD design should therefore keep these controls complementary. Unit/mapping tests verify transformation behavior; static security analysis checks the cryptographic data flow; dependency/security scanning checks the surrounding build; and deployment policy prevents a failing security gate from being promoted.

### Example design
```text
DataWeave source
      |
      v
Maven compile/test
      |
      +---- transformation tests ----> functional result
      |
      +---- cryptographic taint analysis ----> security finding
      |
      v
CI policy gate
      |
      +---- PASS -> package/deploy
      +---- FAIL -> stop promotion
```

### Common mistake
Assuming that because a DataWeave transformation produces the correct JSON response, the implementation is automatically cryptographically safe.

### Interview tip
Separate **functional correctness**, **data validation**, and **security analysis**. They test different properties and should not replace one another.

---

## A496 — Diagnose a DataWeave memory problem caused by large Base64 processing

### Question
A Mule application converts very large Base64 values and occasionally runs out of memory. The transformation itself is logically correct, but production memory usage is much higher than expected. Explain how chunked Base64 processing changes the memory behavior, how the relevant DataWeave system property interacts with language level, what you would verify before changing runtime settings, and how you would test the fix safely.

### Answer
Large Base64 operations can create substantial memory pressure when the complete `String` or `Binary` argument is loaded into memory at once. Current DataWeave documentation describes `com.mulesoft.dw.base64ChunksEnabled`, which allows `dw::core::Binaries::fromBase64` and `toBase64` to process the argument by chunks instead of loading the entire function argument into memory. For the documented current language levels 2.11 and 2.12, the property defaults to `true`.

A production diagnosis should not begin by blindly changing JVM memory. First determine:

1. Which DataWeave language level the application actually uses.
2. Whether the operation is `fromBase64` or `toBase64`.
3. The size and concurrency of the Base64 values.
4. Whether other payload copies, buffering, or downstream transformations retain the data.
5. Whether the deployed Mule/DataWeave version supports the expected property behavior.
6. Whether heap pressure is caused by Base64 processing itself or by another stage of the flow.

After changing configuration, test with production-like payload sizes and concurrency, compare heap usage and throughput, and verify that the functional output remains byte-for-byte equivalent where appropriate.

### Example investigation checklist
```text
Large Base64 payload
       |
       +--> language level?
       |
       +--> base64ChunksEnabled?
       |
       +--> payload copies?
       |
       +--> buffering / temporary storage?
       |
       +--> concurrent messages?
       |
       +--> heap / GC evidence?
       |
       v
Controlled load test -> compare memory + latency + correctness
```

### Common mistake
Changing JVM `-Xmx` first without determining whether DataWeave is unnecessarily materializing the complete Base64 value or whether another transformation is retaining copies.

### Interview tip
A strong production answer connects **DataWeave language level**, **system properties**, **payload size**, **stream/chunk behavior**, **concurrency**, and **measurement**. Do not describe a memory property as a universal solution for every out-of-memory error.

---

## Coverage note
These are deliberately longer scenario questions with implementation reasoning and interview guidance. They are not intended to replace the repository's existing basic syntax questions. The topics were selected as distinct areas: runtime script evaluation, cryptographic build-time analysis, and large-Base64 memory behavior.
