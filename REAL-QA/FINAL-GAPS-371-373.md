# DataWeave 2.12 Type-System Gap Questions — A371-A373

These questions cover three distinct DataWeave 2.12 type-system/compiler edge cases identified from the current official release notes. They are intentionally separate from existing visibility, cross-module overload dispatch, generic-type, and recursive-metadata questions.

## A371 — Consistent visibility across overloaded functions

**Difficulty:** Advanced  
**Topic:** Scope visibility, function overloading, compiler validation

**Question:** A DataWeave library defines two overloads of the same function, but one overload is `internal` and the other is public. What should the compiler do, and why is mixing visibility on overloads unsafe for the library contract?

**Scenario:**

```dataweave
%dw 2.0
internal fun normalize(value: String) = upper(value)
fun normalize(value: Number) = value as String
---
normalize("abc")
```

**Answer:** The overloads should not be allowed to expose different visibility for the same function name. DataWeave 2.12 reports a compiler error when overloads of the same function declare different visibility modifiers. The reason is that callers should see one consistent visibility contract for an overloaded function name; otherwise one overload could be visible while another matching overload is hidden.

**Expected behavior:** Treat the mixed-visibility overload set as a compile-time error rather than relying on runtime overload selection.

**Explanation:** This is different from ordinary overload dispatch. Overload dispatch determines which compatible signature is selected, while visibility determines whether a directive can be referenced at all. DataWeave 2.12 requires the overloads to use the same visibility.

**Common mistake:** Assuming that visibility is checked independently for each overload only after dispatch.

**Interview tip:** Distinguish **visibility validation** from **overload dispatch**: the former is a compile-time API-contract rule; the latter selects a compatible function.

---

## A372 — Intersection of unbound type parameters without recursive type-checker failure

**Difficulty:** Advanced  
**Topic:** Type parameters, intersection types, compiler robustness

**Question:** A generic DataWeave library uses an intersection involving type parameters whose concrete types are not yet bound. What should you investigate if the type expression previously caused recursive type-checker failure, and what does DataWeave 2.12 change?

**Scenario:**

```dataweave
%dw 2.0
fun mergeTyped<A, B>(left: A, right: B): A & B = left ++ right
---
mergeTyped({id: 10}, {name: "Ravi"})
```

**Answer:** The type checker should resolve the intersection without overflowing the call stack. DataWeave 2.12 fixes a `StackOverflowError` that could occur while resolving intersections of unbound type parameters.

**Expected behavior:** The compiler/type checker should process the generic intersection normally; it should not fail merely because the type parameters have not yet been concretely bound during type resolution.

**Explanation:** DataWeave supports both type parameters and intersection types. An intersection combines object-type constraints, while a generic parameter represents a type that is determined from usage. This edge case is about the compiler's type-resolution algorithm, not about changing the runtime object merge semantics.

**Common mistake:** Treating this as the same problem as recursive type metadata. Recursive metadata cycles and unbound generic intersections are separate type-system scenarios.

**Interview tip:** Mention the three layers separately: generic type binding, intersection-type resolution, and runtime object construction.

---

## A373 — Optional object field accepted where a required field is expected

**Difficulty:** Advanced  
**Topic:** Object types, optional fields, type compatibility

**Question:** A generic transformation produces an object whose field is conditionally present (`field?: Type`), and that value is then used where a corresponding required field (`field: Type`) is expected. What type-system behavior should a current DataWeave 2.12 implementation provide?

**Scenario:**

```dataweave
%dw 2.0

type Source = { id?: Number }
type Target = { id: Number }

fun consume(value: Target) = value.id

var source: Source = { id: 100 }
---
consume(source)
```

**Answer:** The type checker should correctly reason about the optional-versus-required key relationship instead of producing a spurious type-check error solely because the source object's key was declared optional. DataWeave 2.12 includes a fix for spurious type-check errors when an optional key-value pair is assigned to a required one.

**Expected behavior:** The compiler should distinguish genuine absence/type incompatibility from the specific false-positive compatibility error addressed by the 2.12 fix. If a value can actually be absent in a concrete expression, the transformation still needs an appropriate design for that possibility; the fix is not a blanket conversion of optional fields into guaranteed fields.

**Explanation:** DataWeave object types can declare conditional fields with `?`. Required and optional key constraints participate in structural type checking. This question focuses on the compiler's compatibility analysis rather than ordinary null handling or conditional object construction.

**Common mistake:** Saying that `field?: Number` is always equivalent to `field: Number`. Optionality remains meaningful and must not be ignored when a real absence is possible.

**Interview tip:** Explain the difference between **type-checker compatibility** and **runtime presence**. A compiler fix for a false-positive diagnostic does not remove the semantic distinction between optional and required fields.

---

## Source note

These additions were selected from DataWeave 2.12.0's documented fixed issues after checking the repository for conceptual overlap. MuleSoft documents the mixed-visibility overload restriction, the unbound-type-parameter intersection fix, and the optional-to-required key-value type-checking fix in the 2.12.0 release notes. The DataWeave type-system documentation separately documents intersection types, optional object fields, and generic type parameters.
