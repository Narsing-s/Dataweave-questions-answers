# DataWeave Web Questions — Additional Deduplicated Set 003

## 44. What is the difference between `keysOf`, `namesOf`, and `valuesOf`?

**Answer:** `keysOf` returns an array of object keys as DataWeave Key values, `namesOf` returns the key names as strings, and `valuesOf` returns the corresponding values.

**Example**
```dataweave
%dw 2.0
output application/json
var customer = {id: 100, name: "Ravi"}
---
{
  keys: keysOf(customer),
  names: namesOf(customer),
  values: valuesOf(customer)
}
```

**Output**
```json
{
  "keys": ["id", "name"],
  "names": ["id", "name"],
  "values": [100, "Ravi"]
}
```

**Explanation:** For ordinary JSON objects the visible key names can look identical, but `keysOf` preserves DataWeave key metadata that can matter for XML attributes and namespaces. MuleSoft documents these as distinct functions. citeturn1search0turn1search3

## 45. What is the difference between `do` and `using` in DataWeave?

**Answer:** Both create a local scope, but `do` is the current syntax. `using` is retained for backward compatibility and is no longer the recommended syntax.

**Example**
```dataweave
%dw 2.0
output application/json
---
do {
  var price = 100
  var tax = 18
  ---
  price + tax
}
```

**Output:** `118`

**Explanation:** A `do` scope can contain local variables, functions, annotations, and namespaces. Use `do` for new DataWeave code. citeturn1search1turn1search2

## 46. What is the difference between `takeWhile` and `filter`?

**Answer:** `takeWhile` keeps elements only until the first element that fails the condition. `filter` evaluates the condition against the whole array and keeps every matching element.

**Example**
```dataweave
%dw 2.0
output application/json
var numbers = [2, 4, 6, 3, 8]
---
{
  takeWhileResult: numbers takeWhile ($ mod 2 == 0),
  filterResult: numbers filter ($ mod 2 == 0)
}
```

**Output**
```json
{
  "takeWhileResult": [2, 4, 6],
  "filterResult": [2, 4, 6, 8]
}
```

**Explanation:** Use `takeWhile` when the input has a meaningful stopping point. Use `filter` when every element should be independently tested. citeturn1search9turn0search8

## 47. What is `divideBy` used for in DataWeave?

**Answer:** `divideBy` splits an array into sub-arrays containing a specified number of elements.

**Example**
```dataweave
%dw 2.0
import divideBy from dw::core::Arrays
output application/json
---
[1, 2, 3, 4, 5] divideBy 2
```

**Output**
```json
[[1, 2], [3, 4], [5]]
```

**Explanation:** This is useful when a large collection needs to be processed in smaller groups. MuleSoft documents `divideBy` in the DataWeave Arrays module. citeturn1search9

## Deduplication note

These questions were added only after checking the repository for the corresponding concepts. Existing questions and coverage for `map`, `filter`, `reduce`, `pluck`, `update`, `default`, `scan`, XML/multipart handling, streaming, and other previously documented areas were not copied again.

**Primary technical references:** MuleSoft DataWeave Core, Operators, Variables, and Arrays documentation.