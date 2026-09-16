# Medium — Collections and Object Transformations

## DW-M001 — How do you transform an array of customer objects into an array containing only IDs?

**Input**
```json
[{"id":101,"name":"Ravi"},{"id":102,"name":"Anil"}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload map $.id
```

**Expected output**
```json
[101,102]
```

**Explanation**
`map` iterates over every customer. `$.id` selects the ID of the current object, producing a new array containing only IDs.

**Common mistakes**
- Using `filter`, which selects elements rather than transforming them.
- Writing `payload.id`, which is not the same as selecting the field from each array element.

**Interview tip**
Explain `$` as the current item and show how `map` changes the shape of the collection.

---

## DW-M002 — How do you filter customers whose status is ACTIVE?

**Input**
```json
[{"id":1,"status":"ACTIVE"},{"id":2,"status":"INACTIVE"},{"id":3,"status":"ACTIVE"}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload filter ($.status == "ACTIVE")
```

**Expected output**
```json
[{"id":1,"status":"ACTIVE"},{"id":3,"status":"ACTIVE"}]
```

**Explanation**
`filter` retains an item only when its status equals `ACTIVE`.

**Common mistakes**
- Using `=` instead of `==` for comparison.
- Returning only the IDs when the requirement is to retain complete customer objects.

**Interview tip**
Always state whether the requirement is to transform, select, group, or aggregate collection elements.

---

## DW-M003 — How do you calculate the total of an array of numbers with `reduce`?

**Input**
```json
[10,20,30,40]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, total = 0) -> total + item)
```

**Expected output**
```json
100
```

**Explanation**
`reduce` accumulates the array into a single result. The accumulator starts at `0` and each item is added to it.

**Common mistakes**
- Returning an array from the reducer when a scalar is required.
- Forgetting to initialize the accumulator when the chosen pattern requires it.

**Interview tip**
Compare `map`, `filter`, and `reduce`: transform each item, select items, and collapse a collection into one result respectively.

---

## DW-M004 — How do you flatten a nested array?

**Input**
```json
[[1,2],[3,4],[5]]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
flatten(payload)
```

**Expected output**
```json
[1,2,3,4,5]
```

**Explanation**
`flatten` removes one level of array nesting and returns a single array containing the nested elements.

**Common mistakes**
- Confusing `flatten` with `flatMap`.
- Expecting recursive flattening of arbitrarily deep structures without checking the function behavior.

**Interview tip**
Know when the source has nested collections and whether one-level flattening is sufficient.

---

## DW-M005 — How do you remove duplicate values from an array?

**Input**
```json
["MuleSoft","API","MuleSoft","DataWeave","API"]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
distinctBy payload
```

**Expected output**
```json
["MuleSoft","API","DataWeave"]
```

**Explanation**
`distinctBy` keeps one occurrence for each distinct value when the value itself is used as the uniqueness key.

**Common mistakes**
- Applying `distinctBy` to objects without defining an appropriate uniqueness expression.
- Assuming duplicate removal is the same as sorting.

**Interview tip**
For object arrays, explain what business field defines uniqueness, such as customer ID.

---

## DW-M006 — How do you sort an array of numbers in ascending order?

**Input**
```json
[50,10,40,20,30]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
orderBy $
```

**Expected output**
```json
[10,20,30,40,50]
```

**Explanation**
`orderBy` sorts the array according to the expression supplied for each element. Here the element itself is the sorting key.

**Common mistakes**
- Sorting a string representation of a number instead of numeric values.
- Forgetting that sorting does not remove duplicates.

**Interview tip**
When sorting objects, identify the field used as the sort key explicitly.

---

## DW-M007 — How do you group orders by status?

**Input**
```json
[{"id":1,"status":"PAID"},{"id":2,"status":"PENDING"},{"id":3,"status":"PAID"}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
groupBy $.status
```

**Expected output**
```json
{
  "PAID":[{"id":1,"status":"PAID"},{"id":3,"status":"PAID"}],
  "PENDING":[{"id":2,"status":"PENDING"}]
}
```

**Explanation**
`groupBy` creates an object whose keys are produced by the grouping expression. Every item with the same status is placed into the corresponding group.

**Common mistakes**
- Expecting an array rather than an object of groups.
- Grouping by the wrong field.

**Interview tip**
This is a common interview pattern for aggregating records by department, status, country, or category.

---

## DW-M008 — How do you convert an object into an array of key/value entries?

**Input**
```json
{"name":"Ravi","city":"Hyderabad"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> { key: key, value: value })
```

**Expected output**
```json
[{"key":"name","value":"Ravi"},{"key":"city","value":"Hyderabad"}]
```

**Explanation**
`pluck` iterates over object fields and produces an array. The lambda receives the value and key and creates a new object for each entry.

**Common mistakes**
- Confusing `pluck` with `mapObject`.
- Forgetting that `pluck` returns an array.

**Interview tip**
Remember: `mapObject` returns an object, while `pluck` is useful when you need an array from object entries.

---

## DW-M009 — How do you transform every value in an object while keeping its keys?

**Input**
```json
{"first":"ravi","last":"kumar"}
```

**DataWeave answer**
```dataweave
%dw 2.0
import upper from dw::core::Strings
output application/json
---
payload mapObject ((value, key) -> (upper(value)) : value)
```

**Expected output**
```json
{"RAVI":"ravi","KUMAR":"kumar"}
```

**Explanation**
`mapObject` transforms object entries and returns another object. The expression explicitly controls the output key and value for each entry.

**Common mistakes**
- Using `map`, which is designed for arrays.
- Forgetting that dynamic keys use parentheses around expressions when needed.

**Interview tip**
Understand the shape of the input before choosing `map`, `mapObject`, `filter`, or `filterObject`.

---

## DW-M010 — How do you filter object fields by key?

**Input**
```json
{"id":101,"name":"Ravi","password":"secret","role":"admin"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> key != "password")
```

**Expected output**
```json
{"id":101,"name":"Ravi","role":"admin"}
```

**Explanation**
`filterObject` keeps object entries for which the predicate returns true. Here the password entry is excluded.

**Common mistakes**
- Using `filter`, which is intended for arrays.
- Filtering by value when the requirement is based on the field name.

**Interview tip**
`filterObject` is particularly useful when sanitizing or dynamically selecting object fields.

---

## DW-M011 — How do you transform an array of employees into a simplified API response?

**Input**
```json
[
  {"employeeId":1,"firstName":"Ravi","department":"IT"},
  {"employeeId":2,"firstName":"Anil","department":"HR"}
]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.employeeId,
  name: $.firstName,
  team: $.department
}
```

**Expected output**
```json
[
  {"id":1,"name":"Ravi","team":"IT"},
  {"id":2,"name":"Anil","team":"HR"}
]
```

**Explanation**
Each source employee is mapped into a new response shape. Only the fields required by the API are exposed.

**Common mistakes**
- Returning internal fields accidentally.
- Using incorrect selectors inside the `map` expression.

**Interview tip**
Describe this as a canonical API transformation: source contract on one side and consumer contract on the other.

---

## DW-M012 — How do you calculate the total amount of all orders?

**Input**
```json
[{"amount":100},{"amount":250},{"amount":150}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((order, total = 0) -> total + order.amount)
```

**Expected output**
```json
500
```

**Explanation**
The reducer starts at zero and adds each order's amount to the running total.

**Common mistakes**
- Adding the entire object instead of `order.amount`.
- Not defining the accumulator's initial value correctly.

**Interview tip**
For production mappings, discuss what should happen if an amount is null or missing.

---

## DW-M013 — How do you create a CSV-ready array from customer data?

**Input**
```json
[{"id":1,"name":"Ravi"},{"id":2,"name":"Anil"}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/csv
---
payload map {
  customerId: $.id,
  customerName: $.name
}
```

**Expected output**
```text
customerId,customerName
1,Ravi
2,Anil
```

**Explanation**
The input objects are mapped into a consistent row structure and the output MIME type instructs DataWeave to serialize the array as CSV.

**Common mistakes**
- Returning an object when multiple CSV rows are expected.
- Forgetting that CSV output formatting depends on the output directive and writer configuration.

**Interview tip**
Know how the same transformation logic can target JSON, CSV, XML, or other supported output formats.

---

## DW-M014 — How do you create an XML response from JSON input?

**Input**
```json
{"id":101,"name":"Ravi"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/xml
---
customer: {
  id: payload.id,
  name: payload.name
}
```

**Expected output**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<customer><id>101</id><name>Ravi</name></customer>
```

**Explanation**
The output directive selects XML serialization, while the DataWeave object-like structure defines the XML element hierarchy.

**Common mistakes**
- Treating XML attributes and child elements as identical concepts.
- Forgetting that XML serialization can be affected by writer properties.

**Interview tip**
Be comfortable explaining JSON-to-XML and XML-to-JSON transformations because they are common integration requirements.

---

## DW-M015 — How do you use `default` while mapping optional customer fields?

**Input**
```json
[{"id":1,"city":"Hyderabad"},{"id":2}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  city: $.city default "Unknown"
}
```

**Expected output**
```json
[{"id":1,"city":"Hyderabad"},{"id":2,"city":"Unknown"}]
```

**Explanation**
For each item, DataWeave selects `city`. When it is null or absent, the default value is used.

**Common mistakes**
- Applying a default to the wrong expression.
- Assuming an empty string is automatically treated exactly like null.

**Interview tip**
Discuss how source-system optionality maps to the target API's required fields.
