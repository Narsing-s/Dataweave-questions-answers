# Advanced Language Edge Questions — Verified Additions

This file is additive. Existing question files are not modified or deleted.

Repository searches found substantial coverage for ordinary functions, recursion, update, null handling, XML namespaces, default parameters, and typed functions. These questions focus on narrower DataWeave language/reference behaviors that were not found as dedicated question scenarios during this audit.

## A18-01 — Prefix versus infix function notation

**Question:** Rewrite a two-argument function call using infix notation.

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  prefix: contains("DataWeave", "Weave"),
  infix: "DataWeave" contains "Weave"
}
```

**Answer**
```json
{"prefix":true,"infix":true}
```

**Why it matters:** DataWeave supports prefix function calls and infix notation for eligible two-parameter functions. citeturn0search7

---

## A18-02 — Coercive equality with `~=`

**Question:** Compare a string number with a numeric value using coercive equality.

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  strict: "10" == 10,
  coercive: "10" ~= 10
}
```

**Answer**
```json
{"strict":false,"coercive":true}
```

**Key point:** `==` and `~=` are different equality operations; `~=` attempts type coercion. citeturn0search2

---

## A18-03 — Add and remove values from an array with operators

**Question:** Append one value and remove another value from an array.

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  appended: [1,2,3] + 4,
  removed: [1,2,3] - 2
}
```

**Answer**
```json
{"appended":[1,2,3,4],"removed":[1,3]}
```

**Key point:** DataWeave operators can operate on collections as well as scalar values. citeturn0search2

---

## A18-04 — Pass a function as an argument

**Question:** Create a reusable function that accepts another function and applies it to a value.

**DataWeave**
```dw
%dw 2.0
output application/json
fun applyRule(value, rule) = rule(value)
---
applyRule("ravi", (x) -> upper(x))
```

**Answer**
```json
"RAVI"
```

**Key point:** DataWeave function signatures support function-typed parameters, which enables reusable higher-order transformations. citeturn0search3

---

## A18-05 — Generic function with a type parameter

**Question:** Write a generic function that wraps any value in an array.

**DataWeave**
```dw
%dw 2.0
output application/json
fun toArray<T>(value: T): Array<T> = [value]
---
{
  number: toArray(10),
  text: toArray("Ravi")
}
```

**Answer**
```json
{"number":[10],"text":["Ravi"]}
```

**Key point:** DataWeave supports type parameters similar to generics in other languages. citeturn0search6

---

## A18-06 — Generic constraint on a function

**Question:** Accept only values whose type contains a `name: String` field.

**DataWeave**
```dw
%dw 2.0
output application/json
fun getName<T <: {name: String}>(value: T): String = value.name
---
getName({name: "Ravi", id: 10})
```

**Answer**
```json
"Ravi"
```

**Key point:** A constrained type parameter can document and enforce the expected structural contract for a reusable function. citeturn0search6

---

## A18-07 — Function overloading by parameter type

**Question:** Define different behavior for String and Number inputs using the same function name.

**DataWeave**
```dw
%dw 2.0
output application/json
fun describe(value: String): String = "TEXT"
fun describe(value: Number): String = "NUMBER"
---
[
  describe("123"),
  describe(123)
]
```

**Answer**
```json
["TEXT","NUMBER"]
```

**Key point:** DataWeave supports overloaded functions with different parameter counts or types; declaration order matters when more than one overload can accept an argument. citeturn0search4

---

## A18-08 — Select a type from a custom type

**Question:** Define an `Address` type from a field of a larger `User` type.

**DataWeave**
```dw
%dw 2.0
type User = {
  name: String,
  address: {
    city: String,
    country: String
  }
}
type Address = User.address
output application/json
var a: Address = {city: "Hyderabad", country: "India"}
---
a
```

**Answer**
```json
{"city":"Hyderabad","country":"India"}
```

**Key point:** DataWeave type selection can derive a reusable type from an existing complex type. citeturn0search1

---

## A18-09 — Type selection from a union type

**Question:** Create a union type where `id` can be String or Number, then select that field's type.

**DataWeave**
```dw
%dw 2.0
type Customer = {id: String, name: String} | {id: Number, name: String}
type CustomerId = Customer.id
output application/json
---
{
  stringId: "C100" is CustomerId,
  numericId: 100 is CustomerId
}
```

**Answer**
```json
{"stringId":true,"numericId":true}
```

**Key point:** Type selection works with union types and can be useful when modeling alternative source contracts. citeturn0search1

---

## A18-10 — Type metadata affects type identity

**Question:** Define a formatted Date type and test whether two dates match the type metadata.

**DataWeave**
```dw
%dw 2.0
type BankDate = Date {format: "dd-MM-yyyy"}
output application/json
var a = "16-09-2026" as BankDate
var b = "2026-09-16" as Date {format: "yyyy-MM-dd"}
---
{
  firstMatches: a is BankDate,
  secondMatches: b is BankDate
}
```

**Answer**
```json
{"firstMatches":true,"secondMatches":false}
```

**Key point:** DataWeave type metadata can participate in type identity; this is different from merely having the same primitive value type. citeturn0search1

---

## A18-11 — Module-qualified function call

**Question:** Import the Strings module and call a function using its module-qualified name.

**DataWeave**
```dw
%dw 2.0
import dw::core::Strings
output application/json
---
Strings::capitalize("dataweave")
```

**Answer**
```json
"Dataweave"
```

**Key point:** DataWeave functions are organized into modules. Imports can expose a module or selected functions. citeturn0search3

---

## A18-12 — Selectively import a function

**Question:** Import only `capitalize` from the Strings module.

**DataWeave**
```dw
%dw 2.0
import capitalize from dw::core::Strings
output application/json
---
capitalize("dataweave")
```

**Answer**
```json
"Dataweave"
```

**Key point:** Selective imports can make reusable scripts clearer by exposing only the functions they need. citeturn0search3

---

## A18-13 — Function result type contract

**Question:** Declare a function that must return a String.

**DataWeave**
```dw
%dw 2.0
output application/json
fun accountLabel(id: Number): String = "ACC-" ++ (id as String)
---
accountLabel(1001)
```

**Answer**
```json
"ACC-1001"
```

**Key point:** Parameter and return type declarations provide an explicit reusable function contract. citeturn0search6

---

## A18-14 — Distinguish type constraints from business validation

**Question:** A function is declared as `fun f(age: Number): String`. Does that guarantee `age >= 18`?

**Answer:** No. The type constraint says the argument must satisfy the declared type contract; the business rule `age >= 18` still needs explicit logic.

**Example**
```dw
%dw 2.0
output application/json
fun adultLabel(age: Number): String =
  if (age >= 18) "ADULT" else "MINOR"
---
adultLabel(17)
```

**Output**
```json
"MINOR"
```

**Key point:** Type-system constraints and business validation solve different problems. citeturn0search6

---

## A18-15 — Explain lazy evaluation in a transformation review

**Question:** Why should a DataWeave developer understand that expressions are evaluated when needed rather than assuming every intermediate expression is eagerly executed?

**Answer:** DataWeave uses a call-by-need strategy, also known as lazy evaluation. Understanding this helps developers reason about repeated expressions, performance, and why an apparently unused computation does not necessarily behave like an eagerly executed statement in an imperative language. citeturn0search7

**Interview answer:**
> DataWeave is expression-oriented and uses call-by-need evaluation. I still measure performance for large transformations rather than assuming laziness removes all performance concerns.

---

## A18-16 — Identify the default module available without an explicit import

**Question:** Which DataWeave function module is imported automatically?

**Answer:** `dw::Core` is imported automatically. Other modules can be imported explicitly. citeturn0search3

**Example**
```dw
%dw 2.0
output application/json
---
upper("ravi")
```

**Output**
```json
"RAVI"
```

---

## A18-17 — Choose a function by its signature

**Question:** What information should you inspect when a DataWeave function behaves differently from what you expect?

**Answer:** Inspect its function signature: parameter types, number of parameters, return type, overloads, and whether a parameter itself is a function. Many DataWeave functions are overloaded for different data types. citeturn0search3

**Practical rule:** Do not rely only on the function name. Verify the signature and the actual input type.

---

## A18-18 — Repository question: feature coverage versus language-reference coverage

**Question:** If a repository contains thousands of `map`, `filter`, `groupBy`, recursion, XML, and API examples, is it automatically complete?

**Answer:** No. A high question count can still miss language-reference concepts such as function overloading, generic type parameters, type selection, function-valued parameters, module-qualified calls, coercive equality, and type metadata.

**Audit rule:** Track both the number of questions and the set of distinct DataWeave language/reference concepts represented. MuleSoft's reference organizes functions by modules and documents function signatures, overloads, type parameters, and function types. citeturn0search3

---

## Duplicate-control statement

- Existing files were not modified.
- Existing recursion, `update`, XML namespace, default-parameter, typed-function, and ordinary transformation questions were not copied.
- These additions target narrower language/reference behaviors and deliberately use different question shapes.
- New IDs are isolated under `A18-*`.
