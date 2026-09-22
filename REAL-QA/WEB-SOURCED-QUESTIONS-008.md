# DataWeave Web Questions — Additional Deduplicated Set 008

## 66. What are charCode, charCodeAt, and fromCharCode used for in DataWeave?

**Answer:** These String functions convert between characters and their Unicode numeric values. charCode gets the Unicode value of the first character, charCodeAt gets the value at a specified index, and fromCharCode converts a Unicode number back into a character.

**Example**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  first: charCode("A"),
  second: charCodeAt("ABC", 1),
  character: fromCharCode(67)
}
```

**Output**
```json
{
  "first": 65,
  "second": 66,
  "character": "C"
}
```

**Explanation:** These functions are useful when a transformation needs to work with Unicode code points rather than only visible text. MuleSoft documents all three in the DataWeave Strings module. citeturn0search0

## 67. What is the difference between importing a DataWeave module and importing a specific function?

**Answer:** Importing a module lets you reference its functions through the module namespace. Importing a specific function lets you call that function directly.

**Example**
```dataweave
%dw 2.0
import dw::core::Strings
import capitalize from dw::core::Strings
output application/json
---
{
  moduleStyle: Strings::pluralize("box"),
  directStyle: capitalize("hello world")
}
```

**Output**
```json
{
  "moduleStyle": "boxes",
  "directStyle": "Hello World"
}
```

**Explanation:** DataWeave also supports import * from a module to import all functions. MuleSoft documents these module and function import styles. citeturn0search1turn0search2

## 68. What is a DataWeave function signature?

**Answer:** A function signature describes a function's name, parameter types, and return type.

**Example**
```dataweave
%dw 2.0
output application/json
fun add(a: Number, b: Number): Number = a + b
---
add(10, 20)
```

**Output:** `30`

**Explanation:** The signature of add accepts two Number parameters and returns a Number. DataWeave identifies functions by signatures and supports overloaded signatures. citeturn0search1turn0search5

## 69. What does the log function do in DataWeave?

**Answer:** log writes the value of an expression to the application log while returning that same value, so it can be used for debugging without changing the transformation result.

**Example**
```dataweave
%dw 2.0
output application/json
---
log("customer payload", payload)
```

**Output:** The transformation returns the payload while the value is also written to the application log.

**Explanation:** log is useful for inspecting intermediate values during troubleshooting. MuleSoft documents it as a debugging function that does not modify the value being transformed. citeturn0search7turn0search10

## 70. What does the uuid function do in DataWeave?

**Answer:** uuid() generates a version 4 UUID using random numbers as its source.

**Example**
```dataweave
%dw 2.0
output application/json
---
{ correlationId: uuid() }
```

**Output:** A newly generated UUID string, for example `550e8400-e29b-41d4-a716-446655440000`.

**Explanation:** Because the value is generated from randomness, the exact UUID varies between executions. MuleSoft documents uuid as a v4 UUID generator. citeturn0search10

## 71. What does the ++ operator do in DataWeave?

**Answer:** ++ concatenates compatible values. Its behavior depends on the input types: it can concatenate arrays, strings, objects, and supported date/time values.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  array: [1, 2] ++ [3, 4],
  text: "Mule" ++ "Soft",
  object: {a: 1} ++ {b: 2}
}
```

**Output**
```json
{
  "array": [1, 2, 3, 4],
  "text": "MuleSoft",
  "object": { "a": 1, "b": 2 }
}
```

**Explanation:** The behavior is determined by the operator overload for the input types. MuleSoft documents ++ as a concatenation operator with multiple supported signatures. citeturn0search11

## Deduplication note

Questions 66–71 were added only after repository searches found no existing dedicated Q&A for these specific concepts. Existing coverage for log, typeOf, uuid references, update, mask, coercions, functions, and operators was checked and not duplicated.