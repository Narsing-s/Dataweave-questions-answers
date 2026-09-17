# A491-A493 — New DataWeave 2.12 Runtime and Security Questions

## A491 — Java module builder/converter cache thread-safety livelock

**Question:** A Mule application using DataWeave Java interoperability occasionally appears stuck under concurrent load, with threads repeatedly waiting around Java module builder/converter cache activity. What DataWeave runtime issue should you investigate?

**Answer:** Check the DataWeave/Mule runtime version for the Java module builder and converter cache thread-safety livelock fixed in DataWeave 2.12.3. This is a runtime/cache concurrency problem rather than a normal DataWeave transformation error. Upgrade to a supported patched runtime when the symptoms match the documented issue.

**Production scenario:** The same Java interoperability path works in a single-thread test but becomes intermittently stuck when many messages execute concurrently. Do not immediately rewrite the mapping; first check whether the runtime contains the relevant DataWeave fix.

**Interview tip:** Distinguish transformation logic defects from runtime concurrency defects. A DataWeave expression can be correct while the engine/runtime version still has a concurrency problem.

---

## A492 — `evalUrl` and dynamic DataWeave execution

**Question:** What does `dw::Runtime::evalUrl` do, and why should it be treated differently from a normal static DataWeave import?

**Answer:** `evalUrl` evaluates a DataWeave script located at a URL and can provide reader inputs, direct input values, and runtime configuration. It is an experimental runtime feature. Because the script is selected dynamically, it should not be treated like a normal statically reviewed transformation: control the script location, inputs, permissions, and deployment process carefully.

**Example:**
```dwl
%dw 2.0
import * from dw::Runtime
output application/json
---
evalUrl(
  "classpath://com/acme/transform/customer.dwl",
  {},
  { payload: { name: "Narsing" } }
)
```

**Production scenario:** A platform team wants configurable transformations without rebuilding the application. Before adopting dynamic evaluation, verify that only trusted, version-controlled scripts can be selected and that the operational/security model is acceptable.

**Interview tip:** `evalUrl` is dynamic script evaluation, not simply another way to import a reusable module. Its experimental status and dynamic execution model are important design considerations.

---

## A493 — Cryptographic taint analysis for insecure algorithms

**Question:** How can the DataWeave Maven plugin detect configured insecure cryptographic algorithms during compilation?

**Answer:** The Maven plugin can enable cryptographic taint analysis. It tracks literal algorithm values flowing into parameters annotated with `@CryptographicSink` and can fail compilation when an algorithm matches the configured insecure-algorithm list. This moves part of cryptographic policy enforcement into the build rather than discovering the issue only during runtime testing.

**Example:**
```xml
<cryptoTaintAnalysisSettings>
  <enabled>true</enabled>
  <insecureAlgorithms>MD5,SHA1,DES,RC4</insecureAlgorithms>
  <sensitiveModules>dw::crypto::CryptoModule</sensitiveModules>
</cryptoTaintAnalysisSettings>
```

**Production scenario:** An enterprise wants builds to reject newly introduced use of algorithms such as MD5 or SHA-1 in security-sensitive DataWeave code. Configure the Maven plugin policy and annotate cryptographic sink parameters appropriately.

**Interview tip:** Explain the difference between ordinary DataWeave validation and compile-time security analysis: taint analysis tracks an algorithm value reaching a security-sensitive sink and can turn a policy violation into a build failure.

---

## Coverage note

These three questions target distinct areas:

- **A491:** Java interoperability runtime concurrency/livelock.
- **A492:** Dynamic runtime script evaluation through `evalUrl`.
- **A493:** Build-time cryptographic taint analysis.

They are intentionally not rewordings of parser-cache sizing, JavaBean cache isolation, JPMS access restrictions, recursive type metadata, scope visibility, or existing cryptographic/security questions.
