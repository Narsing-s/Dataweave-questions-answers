# Mastering DataWeave Practice — Original Solved Question Set

> **Purpose:** This chapter is an original, independently written practice set covering the same broad skill areas demonstrated by the public article **“Mastering DataWeave: Solved Questions for Skill Enhancement”** by Debu Singh. It does **not** reproduce the article's questions, inputs, outputs, or scripts verbatim.
>
> Source topic areas include XML attributes, string splitting, grouping, dynamic keys, hierarchical aggregation, cross-object enrichment, CSV-style grouping, XML filtering, date sorting, and recursive key transformation. citeturn0search0

## How to use this chapter

For every exercise:

1. Read the input carefully.
2. Predict the output before looking at the solution.
3. Run the script in a MuleSoft/DataWeave runtime.
4. Change the input and test edge cases.
5. Explain why the selected operator or selector was used.

---

## Q1 — Extract XML attributes into a JSON array

### Problem

Convert every `<product>` element into a compact JSON record containing its `sku` attribute and text value.

### Input

```xml
<catalog>
  <product sku="P-1001">Keyboard</product>
  <product sku="P-1002">Mouse</product>
  <product sku="P-1003">Monitor</product>
</catalog>
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
payload.catalog.*product map (product) -> {
  sku: product.@sku,
  name: product
}
```

### Expected output

```json
[
  { "sku": "P-1001", "name": "Keyboard" },
  { "sku": "P-1002", "name": "Mouse" },
  { "sku": "P-1003", "name": "Monitor" }
]
```

### Explanation

`.*product` selects all repeated `product` elements. `.@sku` accesses the XML attribute while the element itself supplies the text content.

### Common mistake

Using `.sku` instead of `.@sku`. XML attributes and child elements are accessed differently.

### Interview tip

Be able to explain the difference between an XML element, an XML attribute, and repeated-element selectors.

---

## Q2 — Replace only the final delimiter in a string

### Problem

For a path-like value, replace the final `/` with `|` while preserving earlier delimiters.

### Input

```json
{
  "path": "payments/india/bank/statement.json"
}
```

### DataWeave answer

```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  result: substringBeforeLast(payload.path, "/")
    ++ "|"
    ++ substringAfterLast(payload.path, "/")
}
```

### Expected output

```json
{
  "result": "payments/india/bank|statement.json"
}
```

### Explanation

`substringBeforeLast` and `substringAfterLast` are useful when the delimiter can appear multiple times and only the final occurrence matters.

### Common mistake

Using `splitBy "/"` without considering whether the original path structure must be preserved.

---

## Q3 — Group transaction references by year embedded in the ID

### Problem

The fourth through seventh characters of each transaction reference represent its year. Group the references under that year.

### Input

```json
{
  "references": [
    "TXN-2026-001",
    "TXN-2025-002",
    "TXN-2026-003",
    "TXN-2024-004"
  ]
}
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
{
  byYear: payload.references groupBy ((reference) -> reference[4 to 7])
}
```

### Expected output

```json
{
  "byYear": {
    "2026": ["TXN-2026-001", "TXN-2026-003"],
    "2025": ["TXN-2025-002"],
    "2024": ["TXN-2024-004"]
  }
}
```

### Explanation

The substring selector extracts the embedded year, and `groupBy` creates an object whose keys are the grouping values.

### Common mistake

Assuming the year always begins at the same position without first documenting the input contract.

---

## Q4 — Build dynamic object keys from employee data

### Problem

Transform each employee into an object where the employee's name becomes the key and the employee code becomes the value.

### Input

```json
[
  { "name": "Ravi", "code": "EMP-11" },
  { "name": "Meena", "code": "EMP-12" },
  { "name": "Arjun", "code": "EMP-13" }
]
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
payload map (employee) -> {
  (employee.name): employee.code
}
```

### Expected output

```json
[
  { "Ravi": "EMP-11" },
  { "Meena": "EMP-12" },
  { "Arjun": "EMP-13" }
]
```

### Explanation

Parentheses around `(employee.name)` tell DataWeave to evaluate the expression and use its result as a dynamic key.

### Interview tip

Dynamic keys are frequently used when converting database or API records into lookup structures.

---

## Q5 — Convert flat invoice rows into nested invoice documents

### Problem

Multiple rows belong to the same invoice. Produce one invoice object per invoice and place the individual items under `items`.

### Input

```csv
invoiceNo,supplier,total,item,quantity
INV-10,Acme,250,Keyboard,2
INV-10,Acme,250,Mouse,3
INV-20,Zenith,180,Monitor,1
INV-20,Zenith,180,Stand,2
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
(payload groupBy ((row) -> row.invoiceNo))
  pluck ((rows) -> {
    invoiceNo: rows[0].invoiceNo,
    supplier: rows[0].supplier,
    total: rows[0].total,
    items: rows map (row) -> {
      item: row.item,
      quantity: row.quantity
    }
  })
```

### Expected output

```json
[
  {
    "invoiceNo": "INV-10",
    "supplier": "Acme",
    "total": "250",
    "items": [
      { "item": "Keyboard", "quantity": "2" },
      { "item": "Mouse", "quantity": "3" }
    ]
  },
  {
    "invoiceNo": "INV-20",
    "supplier": "Zenith",
    "total": "180",
    "items": [
      { "item": "Monitor", "quantity": "1" },
      { "item": "Stand", "quantity": "2" }
    ]
  }
]
```

### Explanation

This is a common flat-to-hierarchical integration pattern: group rows by the parent identifier, take parent-level values from the first row, and map all rows into child objects.

### Production improvement

For financial transformations, explicitly cast numeric CSV values to `Number` or `Decimal` when arithmetic is required.

---

## Q6 — Enrich employees from a separate department structure

### Problem

Each employee contains an ID. A separate structure maps employee IDs to departments. Add the department and return employees sorted by ID.

### Input

```json
{
  "employees": [
    { "id": "E3", "name": "Sara" },
    { "id": "E1", "name": "Rohit" },
    { "id": "E2", "name": "Kiran" }
  ],
  "departments": [
    { "name": "Finance", "employeeIds": ["E1", "E3"] },
    { "name": "Technology", "employeeIds": ["E2"] }
  ]
}
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
payload.employees
  map (employee) -> {
    id: employee.id,
    name: employee.name,
    department: (
      payload.departments
        filter ((department) -> department.employeeIds contains employee.id)
    )[0].name default "Unassigned"
  }
  orderBy ((employee) -> employee.id)
```

### Expected output

```json
[
  { "id": "E1", "name": "Rohit", "department": "Finance" },
  { "id": "E2", "name": "Kiran", "department": "Technology" },
  { "id": "E3", "name": "Sara", "department": "Finance" }
]
```

### Explanation

The transformation performs an in-memory lookup by filtering department records whose ID list contains the current employee ID.

### Production consideration

For very large datasets, repeatedly filtering a large lookup structure can be expensive. Build an indexed lookup object when performance matters.

---

## Q7 — Group repeated CSV records and keep selected fields

### Problem

Group sales rows by region and return only the product names under each region.

### Input

```csv
region,product,amount
North,Laptop,1200
South,Phone,800
North,Mouse,40
South,Tablet,500
North,Keyboard,70
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
payload groupBy ((row) -> row.region)
  mapObject ((rows, region) -> {
    (region): rows.product
  })
```

### Expected output

```json
{
  "North": ["Laptop", "Mouse", "Keyboard"],
  "South": ["Phone", "Tablet"]
}
```

### Explanation

`groupBy` creates the groups. `mapObject` then changes the value stored for each group while preserving the group key.

### Common mistake

Using `map` after `groupBy` when the requirement is to transform object entries rather than array elements.

---

## Q8 — Filter XML records using a reusable function

### Problem

Read customer records from XML and return customers whose score is at least 80. Include an XML attribute in the output.

### Input

```xml
<customers>
  <customer id="C101">
    <name>Asha</name>
    <score>91</score>
  </customer>
  <customer id="C102">
    <name>Vikram</name>
    <score>74</score>
  </customer>
  <customer id="C103">
    <name>Neha</name>
    <score>86</score>
  </customer>
</customers>
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json

fun isQualified(score) = (score as Number) >= 80

---
payload.customers.*customer
  filter ((customer) -> isQualified(customer.score))
  map ((customer) -> {
    id: customer.@id,
    name: customer.name,
    score: customer.score as Number
  })
```

### Expected output

```json
[
  { "id": "C101", "name": "Asha", "score": 91 },
  { "id": "C103", "name": "Neha", "score": 86 }
]
```

### Explanation

The function isolates the business rule. `filter` removes records that do not meet the threshold, and `map` shapes the surviving records.

### Common mistake

Comparing XML text values without an explicit numeric cast when numeric comparison is required.

---

## Q9 — Sort month-year strings chronologically

### Problem

Sort month-year strings by their actual calendar date instead of alphabetically.

### Input

```json
[
  "Nov-2025",
  "Jan-2024",
  "Mar-2026",
  "Jul-2024",
  "Feb-2025"
]
```

### DataWeave answer

```dataweave
%dw 2.0
output application/json
---
payload orderBy ((value) ->
  ("01-" ++ value) as Date { format: "dd-MMM-yyyy" }
)
```

### Expected output

```json
[
  "Jan-2024",
  "Jul-2024",
  "Feb-2025",
  "Nov-2025",
  "Mar-2026"
]
```

### Explanation

The strings are converted to real `Date` values for comparison. Alphabetical ordering would not produce chronological ordering.

### Production consideration

Validate the input format before casting if the data comes from an uncontrolled external source.

---

## Q10 — Recursively normalize all object keys

### Problem

Convert every object key to `camelCase` while preserving arrays, nested objects, and primitive values.

### Input

```json
{
  "Customer_Name": "Asha",
  "Address_Details": {
    "Postal_Code": "530001"
  },
  "Accounts": [
    {
      "Account_Number": "AC1001",
      "Account_Type": "Savings"
    }
  ]
}
```

### DataWeave answer

```dataweave
%dw 2.0
import camelize from dw::core::Strings
output application/json

fun normalize(value) = value match {
  case object ->
    value mapObject ((item, key) -> {
      (camelize((key as String) replace "_" with " ")): normalize(item)
    })
  case array -> value map ((item) -> normalize(item))
  else -> value
}

---
normalize(payload)
```

### Expected output

```json
{
  "customerName": "Asha",
  "addressDetails": {
    "postalCode": "530001"
  },
  "accounts": [
    {
      "accountNumber": "AC1001",
      "accountType": "Savings"
    }
  ]
}
```

### Explanation

The function recursively handles three categories: objects, arrays, and scalar values. Objects are rebuilt with transformed keys, arrays are traversed, and primitive values pass through unchanged.

### Important note

Recursive transformations should define behavior for every expected data type. Do not silently convert unexpected types into error strings in production unless that is part of the API contract.

---

# Skills covered

| Skill | Exercises |
|---|---:|
| XML repeated elements | Q1, Q8 |
| XML attributes | Q1, Q8 |
| String functions | Q2 |
| Substring selectors | Q3 |
| `groupBy` | Q3, Q5, Q7 |
| Dynamic object keys | Q4, Q7, Q10 |
| Flat-to-nested transformation | Q5 |
| Cross-collection enrichment | Q6 |
| `filter` | Q6, Q8 |
| `map` | Q1, Q4, Q5, Q6, Q8, Q10 |
| `mapObject` | Q7, Q10 |
| `orderBy` | Q6, Q9 |
| Dates | Q9 |
| Reusable functions | Q8, Q10 |
| Pattern matching | Q10 |
| Recursive transformation | Q10 |
| CSV-to-JSON modeling | Q5, Q7 |

# Interview questions to practice

1. When would you use `map` versus `mapObject`?
2. How does `groupBy` change an array into an object?
3. How do you access XML attributes in DataWeave?
4. How would you enrich one array from another array?
5. Why is `orderBy` with a parsed `Date` safer than alphabetical sorting for month strings?
6. How do dynamic keys work in DataWeave?
7. What is the difference between `filter` and `filterObject`?
8. How would you optimize a repeated lookup against a large reference dataset?
9. How do you write a recursive DataWeave function safely?
10. How would you handle malformed dates, missing XML attributes, or missing lookup matches?

# Production checklist

Before using a transformation in an API or production integration:

- Validate the input MIME type and structure.
- Explicitly cast numeric and date fields when their type matters.
- Define behavior for `null`, missing fields, and empty arrays.
- Avoid leaking sensitive fields into API responses or logs.
- Prefer lookup/index structures when repeatedly searching large collections.
- Keep reusable business rules in named functions.
- Test duplicate IDs and missing lookup matches.
- Test malformed dates and unexpected XML attributes.
- Test large payloads before choosing a highly recursive or repeatedly scanning design.
- Keep transformations readable enough that another developer can maintain them.

## Source reference

The source article is:

urlMastering DataWeave: Solved Questions for Skill Enhancement — Debu Singhhttps://medium.com/@debusingh414/mastering-dataweave-solved-questions-for-skill-enhancement-4e955c4b2ae5

The article was published on December 30, 2024 and presents ten solved practice questions. citeturn0search0

This repository chapter intentionally provides **new scenarios and newly written solutions** rather than copying the source article's copyrighted question text or code.
