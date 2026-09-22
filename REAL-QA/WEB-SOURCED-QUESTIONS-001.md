# DataWeave Web Questions — Deduplicated

## 1. How can you swap two values in DataWeave?

**Answer:** DataWeave transformations create new values rather than mutating variables. Construct the output with the original values in the opposite positions.

**Example**
```dataweave
%dw 2.0
output application/json
var a = 10
var b = 20
---
{ first: b, second: a }
```

**Output:** `{"first":20,"second":10}`

**Explanation:** The original variables are not mutated; the output simply reverses their positions.

---

## 2. How can you define multiple variables in one DataWeave script?

**Answer:** Declare multiple `var` statements in the DataWeave header and use them in the body.

**Example**
```dataweave
%dw 2.0
var price = 100
var quantity = 3
var taxRate = 0.18
output application/json
---
{ subtotal: price * quantity, tax: price * quantity * taxRate, total: (price * quantity) * (1 + taxRate) }
```

**Explanation:** Script variables make repeated calculations easier to read and maintain. They are different from Mule event variables such as `vars`.

---

## 3. What do $, $$, and $$$ mean in DataWeave?

**Answer:** `$` is the current value, `$$` is the current index in array functions or current key in object functions, and `$$$` is the current index in object functions such as `mapObject`.

**Example**
```dataweave
%dw 2.0
output application/json
---
[10, 20, 30] map (value, index) -> { value: value, index: index }
```

**Output:** `[{"value":10,"index":0},{"value":20,"index":1},{"value":30,"index":2}]`

**Explanation:** Named parameters are clearer for complex transformations, while implicit parameters are convenient for short expressions.
---

## 4. What is the difference between read and readUrl in DataWeave?

**Answer:** `read` parses a String or Binary value. `readUrl` reads and parses content from a URL, including a `classpath:` URL.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  fromText: read("{\\"name\\":\\"Ravi\\"}", "application/json"),
  fromResource: readUrl("classpath://customer.json", "application/json")
}
```

**Explanation:** Use `read` when the content is already available; use `readUrl` when the content is identified by a URL or classpath resource. Both support reader properties.

---

## 5. How can you use readUrl to read a CSV resource with reader properties?

**Answer:** Pass the URL, content type, and reader-property object to `readUrl`.

**Example**
```dataweave
%dw 2.0
output application/json
---
readUrl("https://example.com/data.csv", "application/csv", {header: true})
```

**Explanation:** The content type selects the reader and the property object controls parsing behavior such as CSV headers.

---

## 6. How can you write data in a specific format using DataWeave?

**Answer:** Use the `write` function when you need to explicitly serialize a value and optionally supply writer properties.

**Example**
```dataweave
%dw 2.0
output application/json
---
write({id: 101, name: "Ravi"}, "application/json")
```

**Explanation:** The `output` directive controls the script output, while `write` is useful for explicit serialization and writer configuration.

---

## 7. How can you generate dynamic object keys in DataWeave?

**Answer:** Put an expression inside parentheses in an object key.

**Example**
```dataweave
%dw 2.0
output application/json
var fieldName = "customerId"
---
{ (fieldName): "C100" }
```

**Output:** `{"customerId":"C100"}`

**Explanation:** The expression is evaluated first and its result becomes the property name.

---

## 8. How can you convert an array of key-value records into one object?

**Answer:** Use `reduce` and merge each generated object into the accumulator.

**Example**
```dataweave
%dw 2.0
output application/json
---
[
  {key: "productId", value: "P100"},
  {key: "productName", value: "Laptop"}
] reduce ((item, acc = {}) -> acc ++ {(item.key): item.value})
```

**Output:** `{"productId":"P100","productName":"Laptop"}`

**Explanation:** The accumulator starts as an empty object and each record contributes one dynamic-key field.

---

## 9. How can you perform a lookup between two arrays in DataWeave?

**Answer:** Map over one array and find the related record in the second array using a matching identifier.

**Example**
```dataweave
%dw 2.0
output application/json
var customers = [{id: 1, name: "Ravi"}, {id: 2, name: "John"}]
var orders = [{customerId: 1, amount: 100}, {customerId: 2, amount: 200}]
---
orders map (order) -> {
  customerId: order.customerId,
  customerName: (customers filter ($.id == order.customerId))[0].name,
  amount: order.amount
}
```

**Explanation:** One collection is traversed while the second is searched for the matching record. For large datasets, choose a lookup strategy that avoids unnecessary repeated scans.

---

## 10. How can you conditionally create a field in DataWeave?

**Answer:** Use an object fragment with an `if` condition when the field itself should only exist when the condition is true.

**Example**
```dataweave
%dw 2.0
output application/json
var customer = {name: "Ravi", status: "PREMIUM"}
---
{
  name: customer.name,
  (vip: true) if customer.status == "PREMIUM"
}
```

**Explanation:** Conditional object fragments omit the field entirely when the condition is false, rather than creating a null field.

---

## 11. How can you remove null fields from JSON output?

**Answer:** Use the JSON writer property `skipNullOn="objects"`.

**Example**
```dataweave
%dw 2.0
output application/json skipNullOn="objects"
---
{name: "Ravi", age: null, city: "Hyderabad"}
```

**Output:** `{"name":"Ravi","city":"Hyderabad"}`

**Explanation:** This removes null object fields during JSON serialization. Empty strings and empty arrays require separate handling.

---

## 12. How can you define a custom DataWeave function?

**Answer:** Use the `fun` declaration and invoke the function by name.

**Example**
```dataweave
%dw 2.0
output application/json
fun calculateTotal(price: Number, quantity: Number) = price * quantity
---
{ total: calculateTotal(25, 4) }
```

**Output:** `{"total":100}`

**Explanation:** Custom functions package reusable transformation logic and can use typed parameters, optional parameters, and other functions.

---

## 13. How can you use pattern matching in DataWeave?

**Answer:** Use `match` to evaluate multiple cases and return the result of the first matching case.

**Example**
```dataweave
%dw 2.0
output application/json
var statusCode = 404
---
statusCode match {
  case 200 -> "Success"
  case 400 -> "Bad Request"
  case 404 -> "Not Found"
  else -> "Unknown"
}
```

**Output:** `"Not Found"`

**Explanation:** Pattern matching can make several mutually exclusive cases clearer than a long chain of `if/else` expressions.

---

## 14. How can you pass a function as an argument in DataWeave?

**Answer:** Functions are values, so one function can receive another function as an argument.

**Example**
```dataweave
%dw 2.0
output application/json
fun applyTwice(f, value) = f(f(value))
fun addOne(x) = x + 1
---
applyTwice(addOne, 3)
```

**Output:** `5`

**Explanation:** This is a higher-order functional pattern and is useful for reusable transformation logic.

---

## 15. How can you format dates and convert time zones in DataWeave?

**Answer:** Convert the input to a temporal type, apply the desired time zone, and format it when a string is required.

**Example**
```dataweave
%dw 2.0
output application/json
var dt = "2025-07-24T17:20:58Z" as DateTime
---
{
  indiaTime: dt >> "Asia/Kolkata",
  formatted: (dt >> "Asia/Kolkata") as String {format: "yyyy-MM-dd HH:mm:ss"}
}
```

**Explanation:** DataWeave provides temporal types and formatting capabilities so date/time values can be handled without treating them as ordinary strings.

---

## 16. How can you use regular expressions in DataWeave?

**Answer:** Use DataWeave's regex-capable functions and operators for validation or extraction.

**Example**
```dataweave
%dw 2.0
output application/json
---
"a@test.com b@example.com" scan /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/
```

**Explanation:** Regex extraction and Boolean validation are different requirements, so select the regex operation that matches the use case.

---

## 17. How can you group records and calculate an aggregate?

**Answer:** Use `groupBy` to create groups and then process each group with `mapObject`.

**Example**
```dataweave
%dw 2.0
output application/json
var orders = [
  {department: "IT", amount: 100},
  {department: "HR", amount: 50},
  {department: "IT", amount: 75}
]
---
orders groupBy $.department mapObject ((items, department) -> {
  department: department,
  total: sum(items.amount)
})
```

**Explanation:** `groupBy` creates an object whose values are arrays of records, and `mapObject` processes each group.

---

## 18. How can you remove duplicate records from an array?

**Answer:** Use `distinctBy` with the field that defines record uniqueness.

**Example**
```dataweave
%dw 2.0
output application/json
---
[
  {id: 1, name: "Ravi"},
  {id: 2, name: "John"},
  {id: 1, name: "Ravi Updated"}
] distinctBy $.id
```

**Explanation:** The first record for each distinct criterion is retained. Choose the criterion according to the business definition of a duplicate.

---

## 19. How can you merge nested arrays, remove duplicates, and sort the result?

**Answer:** Combine `flatten`, `distinctBy`, and `orderBy`.

**Example**
```dataweave
%dw 2.0
output application/json
---
flatten([[3, 1, 2], [2, 5, 4]]) distinctBy $ orderBy $
```

**Output:** `[1,2,3,4,5]`

**Explanation:** Flattening removes the nested array level, `distinctBy` removes duplicates, and `orderBy` sorts the result.

---

## 20. How can you filter an object using a dynamic list of keys?

**Answer:** Use `filterObject` and retain only keys contained in an allow-list.

**Example**
```dataweave
%dw 2.0
output application/json
var allowed = ["id", "name", "email"]
---
{id: 1, name: "Ravi", email: "ravi@example.com", password: "secret"}
  filterObject ((value, key) -> allowed contains key)
```

**Explanation:** This creates an allow-list transformation and prevents fields outside the approved list from being returned.

---

## 21. How can you transform JSON to XML in DataWeave?

**Answer:** Set the output to `application/xml` and construct the required XML hierarchy.

**Example**
```dataweave
%dw 2.0
output application/xml
---
employee: { id: 100, name: "Ravi" }
```

**Explanation:** DataWeave uses the output MIME type and the constructed structure to produce XML. The exact XML shape should follow the receiving contract.

---

## 22. How can you transform XML to JSON in DataWeave?

**Answer:** Set the output to `application/json` and select the required XML elements.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.employee.id,
  name: payload.employee.name
}
```

**Explanation:** XML element values commonly arrive as strings unless they are explicitly coerced to another DataWeave type.

---

## 23. How can you transform CSV data into JSON?

**Answer:** Configure the input as CSV and map each row to the desired JSON object.

**Example**
```dataweave
%dw 2.0
input payload application/csv header=true
output application/json
---
payload map (row) -> {
  id: row.Id as Number,
  name: row.Name,
  city: row.City
}
```

**Explanation:** The CSV reader represents each row as an object; the mapping determines output field names and types.

---

## 24. How can you convert a flat file to JSON using DataWeave?

**Answer:** Configure the appropriate flat-file reader and schema, then map the parsed records to JSON.

**Explanation:** Flat files can be delimited or fixed-width. The reader/schema determines how the raw text is interpreted before the transformation builds the JSON output.

---

## 25. How can you remove a field from an object in DataWeave?

**Answer:** Use the `-` operator with the field name.

**Example**
```dataweave
%dw 2.0
output application/json
---
payload - "password"
```

**Explanation:** The expression returns a new object without the selected field; it does not mutate the original payload.

---

## 26. How can you extract object values into an array?

**Answer:** Use `pluck`.

**Example**
```dataweave
%dw 2.0
output application/json
---
{a: 10, b: 20, c: 30} pluck $
```

**Output:** `[10,20,30]`

**Explanation:** `pluck` iterates over an object and returns an array. This differs from `mapObject`, which returns an object.

---

## 27. How can you create a reusable DataWeave module?

**Answer:** Put reusable functions or declarations in a DataWeave module and import that module from another script.

**Example module**
```dataweave
%dw 2.0
fun normalizeName(name: String) = upper(trim(name))
```

**Explanation:** Modules centralize reusable transformation logic and reduce duplication across mappings.

---

## 28. How can you use optional parameters in a DataWeave function?

**Answer:** Give the parameter a default value.

**Example**
```dataweave
%dw 2.0
output application/json
fun greeting(name, country = "India") = {name: name, country: country}
---
[greeting("Ravi"), greeting("John", "USA")]
```

**Explanation:** When the optional argument is omitted, its default value is used.

---

## 29. How can you create overloaded functions in DataWeave?

**Answer:** Define multiple functions with the same name but different parameter types or parameter counts.

**Example**
```dataweave
%dw 2.0
output application/json
fun format(value: String) = upper(value)
fun format(value: Number) = value as String
---
[format("ravi"), format(100)]
```

**Output:** `["RAVI","100"]`

**Explanation:** DataWeave supports function overloading; the applicable declaration is selected according to the arguments and declaration order.

---

## 30. How can you use reader and writer properties with DataWeave?

**Answer:** Pass configuration objects to `read`, `readUrl`, or `write`.

**Example**
```dataweave
%dw 2.0
output application/json
var data = read("<root><value></value></root>", "application/xml", {nullValueOn: "empty"})
---
write(data.root, "application/json", {skipNullOn: "objects"})
```

**Explanation:** Reader properties control parsing and writer properties control serialization. This is useful when default format behavior does not match the integration requirement.

---

## 31. How can you parse JSON text dynamically in DataWeave?

**Answer:** Use `read` and specify `application/json` as the content type.

**Example**
```dataweave
%dw 2.0
output application/json
var jsonText = "{\\"id\\":100,\\"name\\":\\"Ravi\\"}"
---
read(jsonText, "application/json")
```

**Output:** `{"id":100,"name":"Ravi"}`

**Explanation:** `read` converts a String or Binary representation into a parsed DataWeave value according to the specified content type.

---

## 32. How can you use dynamic selectors in DataWeave?

**Answer:** Use bracket notation when the field name is stored in a variable.

**Example**
```dataweave
%dw 2.0
output application/json
var fieldName = "customerName"
var customer = {customerName: "Ravi", city: "Hyderabad"}
---
customer[fieldName]
```

**Output:** `"Ravi"`

**Explanation:** Dynamic selectors are useful when the selected field is determined at runtime rather than hard-coded.

---

## 33. How can you use reduce to calculate a total?

**Answer:** Use an accumulator that stores the running total.

**Example**
```dataweave
%dw 2.0
output application/json
---
[10, 20, 30] reduce ((item, total = 0) -> total + item)
```

**Output:** `60`

**Explanation:** `reduce` processes the collection and collapses it into one result.

---

## 34. What is the difference between map and mapObject?

**Answer:** `map` operates on arrays and returns an array; `mapObject` operates on objects and returns an object.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  arrayResult: [1, 2, 3] map ($ * 2),
  objectResult: {a: 1, b: 2} mapObject ((value, key) -> {(key): value * 2})
}
```

**Explanation:** Choose the function based on the input structure: array → `map`; object → `mapObject`.

---

## 35. What is the difference between filter and filterObject?

**Answer:** `filter` selects array elements and returns an array; `filterObject` selects object fields and returns an object.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  arrayResult: [1, 2, 3, 4] filter ($ > 2),
  objectResult: {a: 1, b: 2, c: 3} filterObject ((value, key) -> value > 1)
}
```

**Explanation:** The input/output structure is the key distinction.

---

## 36. How can you flatten nested arrays?

**Answer:** Use `flatten` to remove one level of array nesting.

**Example**
```dataweave
%dw 2.0
output application/json
---
flatten([[1, 2], [3, 4], [5]])
```

**Output:** `[1,2,3,4,5]`

**Explanation:** When mapping and flattening must happen together, `flatMap` can be a better fit.

---

## 37. How can you remove duplicate values from nested arrays and sort them?

**Answer:** Combine `flatten`, `distinctBy`, and `orderBy`.

**Example**
```dataweave
%dw 2.0
output application/json
---
flatten([[3, 1, 2], [2, 5, 4]]) distinctBy $ orderBy $
```

**Output:** `[1,2,3,4,5]`

**Explanation:** Flatten first, remove duplicates using the value itself as the uniqueness criterion, then sort.

---

## 38. How can you filter an object using a dynamic allow-list of keys?

**Answer:** Use `filterObject` and test whether each key exists in the allowed-key array.

**Example**
```dataweave
%dw 2.0
output application/json
var allowed = ["id", "name"]
---
payload filterObject ((value, key) -> allowed contains key)
```

**Explanation:** This is useful when the fields permitted in an output are configurable.

---

## 39. How can you transform XML to JSON while selecting only required fields?

**Answer:** Set the output to JSON and explicitly construct the fields needed from the XML payload.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.employee.id,
  name: payload.employee.name
}
```

**Explanation:** Explicit field selection is useful when the target API requires only part of the source XML.

---

## 40. How can you transform CSV into JSON with typed fields?

**Answer:** Read the CSV with headers and explicitly coerce fields whose target type is not String.

**Example**
```dataweave
%dw 2.0
input payload application/csv header=true
output application/json
---
payload map (row) -> {
  id: row.Id as Number,
  name: row.Name,
  city: row.City
}
```

**Explanation:** CSV values are commonly read as strings, so explicit coercion is important when the target contract requires numbers, dates, or other types.
