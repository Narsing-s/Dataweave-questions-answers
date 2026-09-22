# DataWeave Web Questions — Additional Deduplicated Set 006

## 55. What does it mean that DataWeave functions can be pure?

**Answer:** A pure function produces the same result when it receives the same inputs and does not depend on hidden mutable state or side effects.

**Example**
```dataweave
%dw 2.0
output application/json
fun add(a: Number, b: Number): Number = a + b
---
{
  first: add(2, 3),
  second: add(2, 3)
}
```

**Output**
```json
{
  "first": 5,
  "second": 5
}
```

**Explanation:** Pure functions are easier to reason about and test because their result is determined by their inputs. DataWeave is designed as a functional language and supports pure functions. citeturn0search3

## 56. Are DataWeave variables mutable?

**Answer:** No. DataWeave variables are immutable: after a variable is assigned a value, that binding is not changed by a later assignment.

**Example**
```dataweave
%dw 2.0
output application/json
var count = 10
---
{
  original: count,
  calculated: count + 1
}
```

**Output**
```json
{
  "original": 10,
  "calculated": 11
}
```

**Explanation:** The expression `count + 1` creates a new calculated value; it does not modify the `count` variable. Immutability is one of the functional-programming characteristics documented for DataWeave. citeturn0search3

## 57. What is referential transparency in DataWeave?

**Answer:** Referential transparency means an expression can be replaced by its resulting value without changing the behavior of the transformation, provided the expression has no side effects.

**Example**
```dataweave
%dw 2.0
output application/json
fun double(n: Number) = n * 2
---
{
  a: double(5),
  b: 10
}
```

**Output**
```json
{
  "a": 10,
  "b": 10
}
```

**Explanation:** Here `double(5)` can be replaced by `10` because the function depends only on its input and produces a deterministic result. This is a useful way to understand why functional DataWeave transformations are predictable and testable. citeturn0search3

## Deduplication note

Questions 55–57 were added only after repository searches found no existing dedicated Q&A for these exact functional-programming concepts. Existing questions covering functions, function types, overloading, type parameters, lazy evaluation, operators, and related topics were left unchanged.