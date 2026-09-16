# A419-A422 — Current compatibility, Java interop, XML encoding, and implicit-input gaps

## A419 — Disabling exception catching in the `default` operator

**Difficulty:** Advanced  
**Topics:** `default`, runtime exceptions, compatibility flags, error semantics

### Scenario
A legacy DataWeave transformation uses `default` to supply a fallback when a selector or expression produces a missing value. During migration, the team discovers that the historical behavior also allowed `default` to catch some runtime exceptions. They need to disable that exception-catching behavior.

Which compatibility property controls this behavior, and what happens when it is enabled?

### Answer
Use:

```text
com.mulesoft.dw.defaultOperator.disableExceptionHandling=true
```

When the property is `true`, DataWeave disables the behavior in which the `default` operator catches runtime exceptions and returns the default value. With the property set to `false`, the `default` operator can catch the runtime exception and return its fallback value.

This is a compatibility setting that changes the error-handling semantics of `default`; it is not the same as `orElse`, which addresses optional/null-style fallback behavior.

### Common mistake
Assuming `default` only handles `null` or missing values and cannot be affected by runtime exceptions.

### Interview tip
Distinguish **fallback for absent values** from **fallback after a runtime exception**. Compatibility flags can alter the latter without changing the syntax of the `default` operator.

---

## A420 — Mapping `java.sql.Date` to the DataWeave `Date` type

**Difficulty:** Advanced  
**Topics:** Java interoperability, temporal mapping, compatibility

### Scenario
A Java integration passes a `java.sql.Date` value into DataWeave. A migration changes how that Java temporal type is represented. The application must preserve the intended DataWeave temporal type.

Which compatibility property controls whether `java.sql.Date` maps to DataWeave `Date` or `DateTime`?

### Answer
Use:

```text
com.mulesoft.dw.javaSqlDateToDate=true
```

When enabled, `java.sql.Date` maps to the DataWeave `Date` type. When disabled, it maps to `DateTime`.

The current documentation lists this compatibility behavior for language levels 2.4 and 2.5, with `false` as the default for 2.4 and `true` for 2.5.

### Common mistake
Treating `java.sql.Date` as identical to every Java date/time class and assuming DataWeave will always map it to the same temporal type.

### Interview tip
When Java and DataWeave temporal values cross a boundary, identify the **source Java type**, the **target DataWeave type**, and the **language-level compatibility behavior** separately.

---

## A421 — Why indexed Latin-1 XML reading is a compatibility feature

**Difficulty:** Advanced  
**Topics:** XML reader, indexed reader, character encoding, compatibility, memory

### Scenario
A legacy XML integration uses ISO-8859-1 (Latin-1) input with DataWeave's indexed XML reader. After upgrading the application language level, the same indexed-reader configuration is no longer enabled by default.

Which compatibility property controls indexed-reader use for Latin-1 XML, and why should it be treated as a backward-compatibility option?

### Answer
Use:

```text
com.mulesoft.dw.xml_reader.allowIndexedLatin1=true
```

When enabled, DataWeave allows the indexed reader to be used for Latin-1 (ISO-8859-1) encoding. The current documentation explicitly describes this as a backward-compatibility option because Latin-1 is not fully supported by the indexed reader.

The documented defaults changed by language level: it is `true` for 2.6-2.9 and `false` for 2.10-2.12.

### Common mistake
Assuming every XML encoding supported by a normal XML reader is equally supported by the indexed reader.

### Interview tip
Separate **encoding support** from **reader implementation support**. A format can be readable while a specialized indexed reader has additional compatibility limitations.

---

## A422 — Removing shadowed implicit inputs when a root variable has the same name

**Difficulty:** Advanced  
**Topics:** implicit inputs, variable scope, root declarations, compatibility

### Scenario
A DataWeave script relies on implicit inputs, but it also declares a root-level variable with the same name as one of those implicit inputs. The application needs the explicit root declaration to shadow the implicit input rather than retaining the implicit input in the generated context.

Which property controls this behavior?

### Answer
Use:

```text
mule.dw.remove_shadowed_implicit_inputs=true
```

When a root-level variable has the same name as an implicit input and this property is enabled, DataWeave removes the shadowed implicit input.

This affects the compiler's handling of implicit inputs and name shadowing; it does not rename the variable or change the value of the explicitly declared root variable.

### Common mistake
Assuming a same-name root declaration merely creates two independent values that DataWeave will always retain in the implicit input context.

### Interview tip
When debugging implicit-input behavior, inspect **scope and shadowing** before assuming that the payload or input value itself changed.

---

### Source note
These questions are based on the current MuleSoft DataWeave System Properties and Versioning Behavior documentation. They were selected only after checking the repository's existing specialized questions for conceptual overlap.
