# DataWeave Critical Interview Questions & Answers — 60

> A curated, non-duplicate set of high-value questions covering the repository's 60-category learning plan. Each item focuses on a concept that commonly matters in MuleSoft development, interviews, debugging, or production transformations.

## 1. DataWeave Fundamentals
### DW-C01 — What is DataWeave?
**Answer:** DataWeave is MuleSoft's expression and transformation language. It is used to read, transform, query, construct, and output data in formats such as JSON, XML, CSV, Java objects, and others.

## 2. Variables and Expressions
### DW-C02 — How are variables declared?
```dataweave
%dw 2.0
output application/json
var tax = 0.18
---
100 * tax
```
**Answer:** `var` creates a named value that can be reused in the expression. Variables are immutable.

## 3. Strings
### DW-C03 — How do you normalize a string for case-insensitive comparison?
```dataweave
lower(trim(payload.name)) == "ravi"
```
**Answer:** `trim` removes surrounding whitespace and `lower` normalizes case.

## 4. Numbers
### DW-C04 — How do you calculate a percentage safely?
```dataweave
if (total == 0) 0 else (part / total) * 100
```
**Answer:** Guard against a zero denominator before division.

## 5. Boolean Logic
### DW-C05 — How do you combine multiple conditions?
```dataweave
payload.active == true and payload.balance > 0
```
**Answer:** Use `and`, `or`, and `not` to compose boolean expressions.

## 6. Arrays
### DW-C06 — How do you determine whether an array is empty?
```dataweave
isEmpty(payload)
```
**Answer:** `isEmpty` tests empty collections and related values without manually checking a length.

## 7. Objects
### DW-C07 — How do you construct a new object from an input object?
```dataweave
{
  id: payload.id,
  name: payload.name
}
```
**Answer:** Explicit construction is useful when you need an API-safe contract and do not want to expose every source field.

## 8. map
### DW-C08 — When should you use `map`?
```dataweave
payload map ((item) -> item.name)
```
**Answer:** Use `map` to transform each element of an array and produce a new array.

## 9. mapObject
### DW-C09 — When should you use `mapObject`?
```dataweave
payload mapObject ((value, key) -> (upper(key)): value)
```
**Answer:** Use `mapObject` when the input is an object and you need to transform its key/value entries while keeping an object result.

## 10. filter
### DW-C10 — How do you filter array records?
```dataweave
payload filter ($.status == "ACTIVE")
```
**Answer:** `filter` keeps only array elements for which the predicate evaluates to true.

## 11. filterObject
### DW-C11 — How do you keep only selected object fields?
```dataweave
payload filterObject ((value, key) -> ["id", "name"] contains key)
```
**Answer:** `filterObject` filters object entries rather than array elements.

## 12. reduce
### DW-C12 — When is `reduce` appropriate?
```dataweave
payload reduce ((item, total = 0) -> total + item)
```
**Answer:** Use `reduce` when many values need to be accumulated into one result, such as a total, state object, or custom aggregate.

## 13. groupBy
### DW-C13 — How do you group records by a field?
```dataweave
payload groupBy $.department
```
**Answer:** `groupBy` returns an object whose keys are grouping values and whose values are arrays of matching records.

## 14. orderBy
### DW-C14 — How do you sort records by salary?
```dataweave
payload orderBy $.salary
```
**Answer:** `orderBy` creates a sorted array using the supplied expression as the sort key.

## 15. distinctBy
### DW-C15 — How do you remove duplicate records by ID?
```dataweave
payload distinctBy $.id
```
**Answer:** `distinctBy` keeps one record for each distinct key produced by its expression.

## 16. pluck
### DW-C16 — What does `pluck` do?
```dataweave
{a: 10, b: 20} pluck $
```
**Answer:** `pluck` transforms an object into an array. `$` represents the value and `$$` represents the key in the pluck lambda context.

## 17. some
### DW-C17 — How do you test whether at least one array item matches?
```dataweave
payload some ((item) -> item.status == "FAILED")
```
**Answer:** `some` returns true when at least one element satisfies the predicate.

## 18. every
### DW-C18 — How do you verify that every record is valid?
```dataweave
payload every ((item) -> item.id != null)
```
**Answer:** `every` returns true only when all array elements satisfy the predicate.

## 19. find
### DW-C19 — How do you find the first matching array value?
```dataweave
payload find ((item) -> item.id == 1001)
```
**Answer:** `find` searches an array using a predicate and returns the matching value when found.

## 20. findIndex
### DW-C20 — How do you find the index of the first matching item?
```dataweave
payload findIndex ((item) -> item.id == 1001)
```
**Answer:** `findIndex` returns the position of the first matching array element.

## 21. flatten
### DW-C21 — What problem does `flatten` solve?
```dataweave
flatten([[1, 2], [3, 4]])
```
**Answer:** It removes one level of array nesting and returns `[1,2,3,4]` for this input.

## 22. flatMap
### DW-C22 — When is `flatMap` useful?
```dataweave
[1, 2, 3] flatMap ((n) -> [n, n * 10])
```
**Answer:** `flatMap` maps each item to an array and then flattens the resulting arrays, useful for one-to-many transformations.

## 23. joinBy
### DW-C23 — How do you convert an array of strings into one delimited string?
```dataweave
["A", "B", "C"] joinBy ","
```
**Answer:** `joinBy` joins array values using the supplied separator.

## 24. splitBy
### DW-C24 — How do you split a delimited string?
```dataweave
"A,B,C" splitBy ","
```
**Answer:** `splitBy` returns an array of segments separated by the supplied delimiter.

## 25. replace
### DW-C25 — How do you replace text?
```dataweave
"Hello MuleSoft" replace "MuleSoft" with "DataWeave"
```
**Answer:** `replace` substitutes matching text; it can also be used with regular-expression patterns.

## 26. Regular Expressions
### DW-C26 — How do you validate a simple numeric string with a regex?
```dataweave
(payload.code as String) matches /^[0-9]+$/
```
**Answer:** `matches` evaluates whether the entire expression satisfies the supplied regular expression pattern.

## 27. Dates
### DW-C27 — How do you convert an ISO date string to a Date?
```dataweave
"2026-09-17" as Date
```
**Answer:** `as Date` performs type coercion from the compatible string representation.

## 28. DateTime
### DW-C28 — How do you format a DateTime for an API response?
```dataweave
payload.createdAt as DateTime as String {format: "yyyy-MM-dd'T'HH:mm:ssXXX"}
```
**Answer:** Convert to `DateTime`, then format it as the required output string.

## 29. Time
### DW-C29 — How do you convert a time string into a Time value?
```dataweave
"14:30:00" as Time
```
**Answer:** `as Time` coerces a compatible string into the DataWeave `Time` type.

## 30. Numbers — Aggregation
### DW-C30 — How do you calculate the average of numeric records?
```dataweave
avg(payload map $.amount)
```
**Answer:** First extract the numeric values, then aggregate them with `avg`. Guard against empty input when the business contract requires a defined fallback.

## 31. if/else
### DW-C31 — When should `if/else` be used?
```dataweave
if (payload.balance > 0) "ACTIVE" else "EMPTY"
```
**Answer:** Use `if/else` for straightforward conditional expressions and value selection.

## 32. match
### DW-C32 — When is `match` preferable to many `if/else` branches?
```dataweave
payload.status match {
  case "A" -> "ACTIVE"
  case "B" -> "BLOCKED"
  else -> "UNKNOWN"
}
```
**Answer:** `match` is useful when one expression has several mutually exclusive cases.

## 33. default
### DW-C33 — How do you provide a fallback for absent or null data?
```dataweave
payload.email default "unknown@example.com"
```
**Answer:** `default` supplies a fallback when the left expression evaluates to null or is absent in the relevant selector context.

## 34. Null Handling
### DW-C34 — How do you safely map a nullable array?
```dataweave
(payload default []) map $.name
```
**Answer:** Normalize null to an empty array before applying array operations when that behavior matches the business requirement.

## 35. Type Coercion
### DW-C35 — How do you convert a string to a number?
```dataweave
"1250.50" as Number
```
**Answer:** `as` performs type coercion. Use explicit formats where the source representation requires them.

## 36. Functions
### DW-C36 — Why use functions?
```dataweave
fun fullName(first, last) = first ++ " " ++ last
```
**Answer:** Functions centralize reusable transformation logic and reduce repetition.

## 37. Custom Functions
### DW-C37 — How do you make a function handle a default value?
```dataweave
fun safeName(name) = name default "Unknown"
```
**Answer:** Put the null/default rule inside the reusable function when multiple transformations require the same behavior.

## 38. Lambda Functions
### DW-C38 — What is a lambda function?
```dataweave
payload map ((item, index) -> item.name)
```
**Answer:** A lambda is an anonymous function passed to another function such as `map` or `filter`.

## 39. Variables and Scope
### DW-C39 — Why use local variables in a transformation?
```dataweave
var active = payload filter $.active
---
active map $.name
```
**Answer:** Variables improve readability, avoid repeating expensive expressions, and make multi-step transformations easier to maintain.

## 40. Modules
### DW-C40 — Why use DataWeave modules?
**Answer:** Modules let reusable functions, types, and constants be organized separately and imported into multiple transformations. This is preferable to copying the same business logic into many scripts.

## 41. Selectors
### DW-C41 — What is a field selector?
```dataweave
payload.customer.name
```
**Answer:** A field selector accesses a named field from an object-like value.

## 42. Conditional Selectors
### DW-C42 — How do you safely select a field that may not exist?
```dataweave
payload.customer?.email
```
**Answer:** The optional selector prevents a missing path from causing the same kind of failure as an ordinary required selector.

## 43. Dynamic Selectors
### DW-C43 — How do you access a field whose name is stored in a variable?
```dataweave
var fieldName = "email"
---
payload[fieldName]
```
**Answer:** Use a dynamic selector when the field name is data rather than a fixed literal.

## 44. XML Transformation
### DW-C44 — How do you create XML from JSON data?
```dataweave
%dw 2.0
output application/xml
---
customers: payload map {
  customer: {
    name: $.name
  }
}
```
**Answer:** Change the output MIME type and construct the required XML hierarchy. XML element naming and repeated-element structure must match the receiving contract.

## 45. JSON Transformation
### DW-C45 — How do you explicitly construct an API JSON response?
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name,
  status: payload.status
}
```
**Answer:** Explicit construction gives control over the public contract and prevents accidental exposure of internal fields.

## 46. CSV Transformation
### DW-C46 — What must you consider when producing CSV?
```dataweave
%dw 2.0
output application/csv header=true
---
payload
```
**Answer:** Consider headers, column order, delimiter/quoting requirements, null values, and the exact CSV contract expected by the consumer.

## 47. Java / Java-like Data
### DW-C47 — Why can Java objects behave differently from JSON objects?
**Answer:** A Java object can contain typed properties, classes, collections, and metadata that are not represented the same way as JSON. Inspect the actual runtime type and coerce or transform it deliberately rather than assuming JSON semantics.

## 48. Error Handling
### DW-C48 — How should a transformation handle invalid input?
**Answer:** Validate required fields and types before performing unsafe operations, use explicit defaults only where business-safe, and let Mule's error handling produce the correct API error contract when the input is invalid.

## 49. Real-world API Transformations
### DW-C49 — How do you prevent internal fields from leaking to an API consumer?
```dataweave
{
  customerId: payload.id,
  name: payload.name,
  email: payload.email
}
```
**Answer:** Build the response from an allow-list of public fields rather than returning the entire database/domain object.

## 50. MuleSoft Interview Questions
### DW-C50 — What is the relationship between payload, attributes, and vars in Mule?
**Answer:** `payload` is the main message content, `attributes` contains source/transport metadata, and `vars` stores flow variables. DataWeave can access them as `payload`, `attributes`, and `vars`.

## 51. Scenario-based Questions
### DW-C51 — How would you find active customers from a selected bank and return only public fields?
```dataweave
payload
  filter ($.bank == vars.bankName and $.active == true)
  map {
    customerId: $.id,
    name: $.name,
    email: $.email
  }
```
**Answer:** Filter first to reduce the dataset, then map to the external contract.

## 52. Debugging Questions
### DW-C52 — What should you inspect when a DataWeave expression fails with a type error?
**Answer:** Inspect the actual runtime type and sample value of the payload/expression, check null or missing fields, verify selector paths, and verify coercions. Do not assume that a value that looks like JSON text is actually an Object or Array at runtime.

## 53. Output-prediction Questions
### DW-C53 — What is the result of this?
```dataweave
[10, 20, 30] map ($ / 10)
```
**Answer:**
```json
[1, 2, 3]
```
**Interview focus:** Understand `$` as the current array value.

## 54. Easy Coding Problems
### DW-C54 — Return only even numbers.
```dataweave
payload filter ($ mod 2 == 0)
```
**Answer:** The result contains only values divisible by two.

## 55. Medium Coding Problems
### DW-C55 — Return names of employees earning above the average salary.
```dataweave
var salaries = payload map $.salary
var averageSalary = avg(salaries)
---
payload
  filter ($.salary > averageSalary)
  map $.name
```
**Answer:** Compute the aggregate once, then filter and project the required field.

## 56. Advanced Coding Problems
### DW-C56 — Create an index object keyed by customer ID.
```dataweave
payload reduce ((customer, result = {}) ->
  result ++ {(customer.id as String): customer}
)
```
**Answer:** `reduce` accumulates the array into an object keyed by ID. Ensure IDs are unique or define the required duplicate policy.

## 57. Production-style Transformations
### DW-C57 — How should a production transformation treat sensitive fields?
**Answer:** Use an explicit allow-list for external responses, mask values where partial display is required, avoid logging secrets/PII unnecessarily, and follow the API's data-classification and security requirements.

## 58. Performance / Optimization
### DW-C58 — How can you improve a slow DataWeave transformation?
**Answer:** Avoid repeatedly evaluating the same expensive expression, filter early when safe, avoid unnecessary nested scans, use variables for reusable results, reduce large intermediate structures, and measure the actual transformation before optimizing. Readability and correctness must remain intact.

## 59. DataWeave 2.x Interview Questions
### DW-C59 — Why should you know the DataWeave version/runtime when answering syntax questions?
**Answer:** DataWeave behavior and available functions can depend on the DataWeave/Mule runtime version. Verify the target runtime when an expression depends on version-specific behavior rather than assuming every environment is identical.

## 60. Certification-style Practice
### DW-C60 — What is the best way to approach a DataWeave output question?
**Answer:** Identify the input type, evaluate selectors, track `$`/`$$` or named lambda parameters, evaluate functions left-to-right where relevant, determine the resulting type, and only then calculate the final output. Do not guess from the visual shape of the input.

---

## Critical Interview Checklist

Before an interview, make sure you can explain and code without reference:

- Array vs Object operations
- `map` vs `mapObject`
- `filter` vs `filterObject`
- `reduce` and accumulators
- `groupBy` + `mapObject`
- `distinctBy` for deduplication
- `orderBy` and composite sorting
- `pluck`, `$`, and `$$`
- `some` vs `every`
- `find` vs `findIndex`
- `flatten` vs `flatMap`
- selectors and dynamic selectors
- null/default handling
- type coercion
- dates and DateTime formatting
- custom functions and modules
- JSON/XML/CSV transformations
- payload/attributes/vars
- API contract filtering and sensitive-field protection
- debugging runtime type errors
- performance and repeated-expression optimization

## Category Coverage

This file intentionally maps one critical question to each of the 60 categories requested for the learning plan. It complements the larger Easy/Medium/Advanced and REAL-QA banks instead of duplicating their full practice sets.
