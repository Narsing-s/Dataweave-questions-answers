# DataWeave Advanced Gap Questions — A374-A376

These questions cover distinct documented capabilities that were not represented by the existing curated bank. They are intentionally separate from the existing component-language-level, function-introspection, and Java interoperability questions.

## A374 — Version-aware overload dispatch with `@Since`

**Difficulty:** Advanced  
**Topic:** Language levels, library evolution, overload resolution

**Question:** A DataWeave library has evolved a function signature and needs old consumers to keep receiving the older overload while newer language levels use the newer overload. How does `@Since` participate in overload selection when the host supplies per-component language levels?

**Scenario:**

```dataweave
%dw 2.0

@Since(version = "2.12.0")
fun formatCustomer(value: String) = "new:" ++ value

fun formatCustomer(value: Any) = "legacy:" ++ (value as String)

---
formatCustomer("Ravi")
```

**Answer:** In an embedded DataWeave engine, the host can provide a language level for each component. DataWeave uses `@Since` metadata when selecting among versioned overloads so a library can evolve without making a newer overload available to older language-level consumers.

**Expected behavior:** A component compiled against an older supported language level should not select functionality introduced after that level merely because the newer overload exists in the library. A component using a compatible newer language level can select the newer version when its overload is otherwise applicable.

**Explanation:** `componentLanguageLevels` and `@Since` solve a library-compatibility problem. This is different from ordinary overload ordering and different from A358, which focuses on configuring per-component language levels themselves.

**Common mistake:** Assuming `@Since` is only documentation and has no role in version-aware overload dispatch.

**Interview tip:** Explain the distinction between the host's component language level, a function's `@Since` version metadata, and ordinary argument-based overload matching.

---

## A375 — Inspecting whether a function parameter is optional

**Difficulty:** Advanced  
**Topic:** Function type introspection, metadata, optional parameters

**Question:** A reusable DataWeave tool receives a function type and must inspect not only each parameter's type but also whether the parameter is optional. Which type-introspection structure exposes that information?

**Scenario:**

```dataweave
%dw 2.0
import * from dw::core::Types

fun greet(name: String, title: String = "Guest") = title ++ ": " ++ name

var parameterInfo = functionParamTypes(typeOf(greet))
---
parameterInfo
```

**Answer:** `functionParamTypes` returns the function's parameter descriptions, and each `FunctionParam` contains `paramType` and an `optional` Boolean. Therefore the introspection result can distinguish a required parameter from an optional one instead of treating both merely as types.

**Expected behavior:** Parameter metadata should preserve both the parameter's DataWeave type and its optionality flag.

**Explanation:** This is more specific than simply asking for a function's parameter types or return type. The `FunctionParam` type explicitly models whether a function parameter is optional, which is useful when building generic tooling or validating function contracts.

**Common mistake:** Looking only at `paramType` and assuming optionality can always be inferred from the type itself.

**Interview tip:** Know the difference between `functionParamTypes`, `functionReturnType`, and the fields of `FunctionParam`.

---

## A376 — Java output type behavior controlled by `com.mulesoft.dw.java.output_types_as_string`

**Difficulty:** Advanced  
**Topic:** Java interoperability, system properties, output type semantics

**Question:** A DataWeave transformation uses a Java output MIME type and downstream code must either receive a Java class representation or its string representation. Which system property controls that behavior?

**Scenario:**

```text
DataWeave output MIME type: application/java
System property:
com.mulesoft.dw.java.output_types_as_string
```

**Answer:** `com.mulesoft.dw.java.output_types_as_string` controls how DataWeave represents Java output types. When enabled, DataWeave returns the string representation of the corresponding type; when disabled, it returns a Java class constructed from the corresponding DataWeave type class.

**Expected behavior:** The same transformation can expose different Java-facing type representations depending on the configured system-property value. This is a runtime configuration concern, not a change to the logical DataWeave payload itself.

**Explanation:** The property is relevant when integrating DataWeave with Java-facing consumers that care about the representation of output type metadata. It is distinct from ordinary Java object mapping and from Java 17 JPMS access restrictions.

**Common mistake:** Treating the property as a transformation operator or assuming it changes JSON/XML payload content.

**Interview tip:** Separate DataWeave value semantics from Java integration representation and identify system properties as runtime configuration rather than script-level transformation logic.

---

## Source note

These additions are based on current MuleSoft DataWeave documentation for scope/language-level behavior, function type introspection, and DataWeave system properties. They were checked against the repository's existing coverage before inclusion to avoid conceptual duplicates.
