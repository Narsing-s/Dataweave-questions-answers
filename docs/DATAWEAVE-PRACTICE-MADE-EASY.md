# DataWeave Practice Made Easy: Solved Questions for Skill Building

> An original, repository-first practice guide for MuleSoft DataWeave learners.

DataWeave becomes much easier when you practice the transformation from **input → logic → output** instead of memorizing functions in isolation.

This guide introduces the learning approach used by the **DataWeave Questions & Answers** repository. It gives you representative solved problems and then points you to the larger Easy, Medium, Advanced, interview, and real-world collections.

## What makes this repository different?

The repository is designed as a complete practice system:

- Easy → Medium → Advanced progression
- Practical JSON, XML, CSV, nested-data, date, string, number, array, and object transformations
- Input, DataWeave, expected output, explanation, common mistakes, and interview guidance
- Interview and certification-style practice
- Real-world API transformation scenarios
- A large structured question bank
- Interactive browser-based search and filtering
- A strong **no-duplicate** rule: changing names or values does not make an existing concept a new question

> **Important:** Examples in the repository are structurally maintained, but individual DataWeave scripts should be runtime-tested against the exact Mule/DataWeave version used by your application.

---

# 1. Transform an array of employee records

### Question

Convert employee records into a smaller API-friendly structure containing only the employee name and birth year.

### Input

```json
[
  { "name": "John", "age": 25 },
  { "name": "Alice", "age": 30 }
]
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload map (employee) -> {
  fullName: employee.name,
  birthYear: now().year - employee.age
}
```

### Expected output

```json
[
  { "fullName": "John", "birthYear": 2001 },
  { "fullName": "Alice", "birthYear": 1996 }
]
```

### What to learn

`map` transforms every item in an array and produces a new array.

**Common mistake:** using `mapObject` for an array. Use `map` for array elements and `mapObject` for object entries.

---

# 2. Filter records before transforming them

### Question

Return only active employees and expose their names and departments.

### Input

```json
[
  { "name": "Ravi", "active": true, "department": "IT" },
  { "name": "Meena", "active": false, "department": "HR" },
  { "name": "Arun", "active": true, "department": "Finance" }
]
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload
  filter ((employee) -> employee.active)
  map ((employee) -> {
    name: employee.name,
    department: employee.department
  })
```

### Expected output

```json
[
  { "name": "Ravi", "department": "IT" },
  { "name": "Arun", "department": "Finance" }
]
```

### What to learn

A common production pattern is:

**filter first → transform second**

This reduces the amount of data processed by later transformations.

---

# 3. Remove duplicate business records

### Question

Keep one customer record for each customer ID.

### Input

```json
[
  { "id": 101, "name": "Asha" },
  { "id": 102, "name": "Vijay" },
  { "id": 101, "name": "Asha" }
]
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload distinctBy $.id
```

### Expected output

```json
[
  { "id": 101, "name": "Asha" },
  { "id": 102, "name": "Vijay" }
]
```

### What to learn

`distinctBy` removes duplicates according to the value produced by its expression.

For enterprise data, always identify the **business key** before deciding what constitutes a duplicate.

---

# 4. Calculate a total with reduce

### Question

Calculate the total value of an array of amounts.

### Input

```json
[120, 50, 75, 200]
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, total = 0) -> total + item)
```

### Expected output

```json
445
```

### What to learn

Use `reduce` when several values need to become one accumulated result.

---

# 5. Group transactions by department

### Question

Group employees by department.

### Input

```json
[
  { "name": "Asha", "department": "IT" },
  { "name": "Ravi", "department": "HR" },
  { "name": "Kiran", "department": "IT" }
]
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload groupBy $.department
```

### Expected output

```json
{
  "IT": [
    { "name": "Asha", "department": "IT" },
    { "name": "Kiran", "department": "IT" }
  ],
  "HR": [
    { "name": "Ravi", "department": "HR" }
  ]
}
```

### What to learn

`groupBy` creates an object whose keys come from the grouping expression.

For more advanced reporting, combine `groupBy` with `mapObject` or `pluck`.

---

# 6. Work with dates

### Question

Convert an ISO date string into a formatted date.

### Input

```json
"2026-09-22"
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
(payload as Date) as String {format: "dd-MMM-yyyy"}
```

### Expected output

```text
"22-Sep-2026"
```

### What to learn

DataWeave separates the **data type** from the **display format**. First parse the value as `Date`, then format it as a string.

---

# 7. Handle missing values safely

### Question

Return a customer's preferred city, using a default when the field is missing.

### Input

```json
{
  "name": "Asha"
}
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  city: payload.city default "Unknown"
}
```

### Expected output

```json
{
  "name": "Asha",
  "city": "Unknown"
}
```

### What to learn

The `default` operator is useful when optional fields may be absent or null.

Do not blindly add defaults everywhere. Decide whether a missing value should be defaulted, preserved as null, or treated as an error.

---

# 8. Transform nested order data

### Question

Create an API response containing each order ID and the names of its products.

### Input

```json
{
  "orders": [
    {
      "id": 1001,
      "items": [
        { "name": "Laptop", "quantity": 1 },
        { "name": "Mouse", "quantity": 2 }
      ]
    }
  ]
}
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
payload.orders map (order) -> {
  orderId: order.id,
  products: order.items map $.name
}
```

### Expected output

```json
[
  {
    "orderId": 1001,
    "products": ["Laptop", "Mouse"]
  }
]
```

### What to learn

Nested transformations are extremely common in API integrations. Think about each level independently:

**orders array → order object → items array → item field**

---

# 9. Calculate an API percentage

### Question

Calculate the percentage of successful transactions.

### Input

```json
{
  "successful": 92,
  "total": 100
}
```

### DataWeave

```dataweave
%dw 2.0
output application/json
---
{
  successPercentage: (payload.successful / payload.total) * 100
}
```

### Expected output

```json
{
  "successPercentage": 92
}
```

### What to learn

Business calculations should make the denominator and edge cases explicit. In production, consider how the transformation should behave when `total` is zero or missing.

---

# 10. Build a reusable DataWeave function

### Question

Normalize customer names by trimming whitespace and converting the result to uppercase.

### Input

```json
[
  { "name": "  asha " },
  { "name": " ravi" }
]
```

### DataWeave

```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json

fun normalizeName(value) =
  upper(trim(value))
---
payload map (customer) -> {
  name: normalizeName(customer.name)
}
```

### Expected output

```json
[
  { "name": "ASHA" },
  { "name": "RAVI" }
]
```

### What to learn

Reusable functions help keep transformations readable and make business rules easier to test and maintain.

---

# How to progress from here

Don't stop after reading the answer.

Use this loop for every problem:

1. Read only the question and input.
2. Predict the output.
3. Write your own DataWeave.
4. Run it against your Mule/DataWeave runtime.
5. Compare your result with the expected output.
6. Read the explanation.
7. Study the common mistake.
8. Try an edge case.
9. Rewrite the solution using another valid approach.
10. Explain the solution without looking at the answer.

## Easy → Medium → Advanced

### 🟢 Easy

Start with:

- DataWeave fundamentals
- Strings
- Numbers
- Arrays
- Objects
- Basic `map` and `filter`
- Dates and DateTime
- Null handling
- `default`
- Basic selectors

### 🟡 Medium

Then practice:

- Nested collections
- `groupBy`
- `orderBy`
- `distinctBy`
- `reduce`
- `flatten`
- `flatMap`
- Date calculations
- DateTime transformations
- Functions
- Practical API response transformations

### 🔴 Advanced

Finally work on:

- Complex nested transformations
- Dynamic objects
- Reusable functions
- Advanced filtering and mapping
- Error handling
- Production-style transformations
- XML/JSON/CSV combinations
- Performance considerations
- Difficult interview scenarios
- Output prediction

## Interview preparation

The repository also separates interview-focused material from general practice.

A strong interview preparation routine is:

**Learn the function → solve a basic problem → solve a scenario → predict output → explain trade-offs → handle an edge case.**

Don't memorize only syntax. Be able to explain **why** a transformation uses `map`, `filter`, `mapObject`, `reduce`, `groupBy`, or another function.

## Explore the complete repository

The main repository contains the full learning ecosystem, including:

- 10,000 structured practice records
- Curated REAL-QA material
- Easy, Medium, and Advanced sections
- Critical interview questions
- Mastering DataWeave learning material
- Edge-case and production-oriented exercises
- Interactive browser-based learning tools
- Blogger publishing support
- Contribution and documentation guidance

## Final takeaway

DataWeave becomes easier when you stop treating it as a collection of functions to memorize and start treating every problem as a transformation:

**Understand the input → define the desired output → choose the transformation → implement → test → handle edge cases.**

The goal of this repository is to make that process repeatable for beginners while still providing challenging material for experienced MuleSoft developers.

---

## Start learning

**Repository:**  
https://github.com/Narsing-s/Dataweave-questions-answers

**Recommended path:**  
**Easy → Medium → Advanced → Real-world scenarios → Interview practice → Edge cases**

If you find an incorrect answer, duplicate concept, missing scenario, or useful improvement, contribute it back to the repository. New questions should add genuinely new conceptual coverage rather than simply changing names, numbers, or wording.

> **Learn it. Practice it. Test it. Explain it. Then build with it.**
