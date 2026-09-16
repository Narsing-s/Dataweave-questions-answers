# DataWeave Practice & Interview Questions — Part 2 Inspired Set

> **Source reference:** AMRENDRA KUMAR, *Mulesoft Dataweave practice & interview questions for beginners: Part2*, published September 21, 2024. The source covers eight core operators: `map`, `mapObject`, `filter`, `filterObject`, `groupBy`, `distinctBy`, `orderBy`, and `reduce`. citeturn0search0
>
> **Copyright note:** This file does **not** reproduce the source article's questions, examples, wording, or code verbatim. It provides original exercises covering the same learning objectives, with expanded explanations and additional edge cases, so the repository can be publicly useful without copying the third-party article.

## Learning objectives

By completing this chapter you should be able to:

- transform arrays with `map`
- transform objects with `mapObject`
- select array elements with `filter`
- select object fields with `filterObject`
- create indexed groupings with `groupBy`
- remove duplicates with `distinctBy`
- perform multi-criteria sorting with `orderBy`
- aggregate arrays with `reduce`
- choose the correct operator for arrays versus objects
- recognize common interview mistakes
- extend a simple transformation into a production-ready version

---

## 1. `map` — Build a customer summary

### Question
Transform customer records into a compact API response containing `id`, `displayName`, and a normalized email address.

### Input
```json
[
  {"id":101,"firstName":"Ravi","lastName":"Kumar","email":" RAVI@EXAMPLE.COM "},
  {"id":102,"firstName":"Priya","lastName":"Sharma","email":"PRIYA@EXAMPLE.COM"}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload map (customer) -> {
  id: customer.id,
  displayName: customer.firstName ++ " " ++ customer.lastName,
  email: lower(trim(customer.email))
}
```

### Expected output
```json
[
  {"id":101,"displayName":"Ravi Kumar","email":"ravi@example.com"},
  {"id":102,"displayName":"Priya Sharma","email":"priya@example.com"}
]
```

### Explanation
`map` transforms every array element and returns a new array with the same number of positions.

### Interview point
`map` is for **arrays**. If the source is an object and you need to transform key/value pairs, consider `mapObject`.

---

## 2. `mapObject` — Apply a controlled salary adjustment

### Question
Increase each employee's salary by 8%, while keeping the employee name as the object key.

### Input
```json
{
  "Ravi":50000,
  "Priya":65000,
  "Arjun":72000
}
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload mapObject ((salary, employee) ->
  (employee): salary * 1.08
)
```

### Expected output
```json
{
  "Ravi":54000,
  "Priya":70200,
  "Arjun":77760
}
```

### Explanation
`mapObject` receives the value and key of every object entry and constructs a new object.

### Common mistake
Using `map` directly on an object.

### Interview point
Remember the basic distinction: **array → `map`; object → `mapObject`**.

---

## 3. `filter` — Select eligible employees

### Question
Return only employees who have at least five years of experience and an active status.

### Input
```json
[
  {"name":"Ravi","experience":6,"status":"ACTIVE"},
  {"name":"Priya","experience":3,"status":"ACTIVE"},
  {"name":"Arjun","experience":8,"status":"INACTIVE"},
  {"name":"Meena","experience":7,"status":"ACTIVE"}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload filter ((employee) ->
  employee.experience >= 5 and employee.status == "ACTIVE"
)
```

### Expected output
```json
[
  {"name":"Ravi","experience":6,"status":"ACTIVE"},
  {"name":"Meena","experience":7,"status":"ACTIVE"}
]
```

### Explanation
`filter` keeps array elements for which the predicate evaluates to `true`.

### Common mistake
Using `map` and returning `null` for rejected records. That creates a different output shape.

---

## 4. `filterObject` — Keep approved configuration entries

### Question
Keep only configuration entries whose numeric value is greater than or equal to 100.

### Input
```json
{
  "timeout":150,
  "retry":3,
  "batchSize":500,
  "connectionLimit":80
}
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value >= 100)
```

### Expected output
```json
{
  "timeout":150,
  "batchSize":500
}
```

### Explanation
`filterObject` returns an object containing only entries that satisfy the predicate.

### Interview point
Do not confuse `filter` and `filterObject`: they operate on different collection types.

---

## 5. `groupBy` — Group transactions by account

### Question
Group transactions by account number so that each account becomes one object key.

### Input
```json
[
  {"transaction":"T1","account":"A100","amount":500},
  {"transaction":"T2","account":"A200","amount":700},
  {"transaction":"T3","account":"A100","amount":300},
  {"transaction":"T4","account":"A200","amount":900}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload groupBy ((transaction) -> transaction.account)
```

### Expected output
```json
{
  "A100":[
    {"transaction":"T1","account":"A100","amount":500},
    {"transaction":"T3","account":"A100","amount":300}
  ],
  "A200":[
    {"transaction":"T2","account":"A200","amount":700},
    {"transaction":"T4","account":"A200","amount":900}
  ]
}
```

### Explanation
`groupBy` produces an object whose keys are generated from the grouping expression and whose values are arrays of matching records.

### Production extension
After grouping, you can calculate totals per account with a second transformation.

---

## 6. `distinctBy` — Keep the first record for each customer

### Question
A customer can occur more than once. Return only the first occurrence for each customer ID.

### Input
```json
[
  {"customerId":"C1","segment":"Retail"},
  {"customerId":"C2","segment":"Business"},
  {"customerId":"C1","segment":"Retail-Updated"},
  {"customerId":"C3","segment":"Retail"}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload distinctBy ((customer) -> customer.customerId)
```

### Expected output
```json
[
  {"customerId":"C1","segment":"Retail"},
  {"customerId":"C2","segment":"Business"},
  {"customerId":"C3","segment":"Retail"}
]
```

### Explanation
`distinctBy` uses the expression result as the uniqueness criterion.

### Common mistake
Using `distinctBy` after sorting without understanding which duplicate record will be retained.

### Interview point
If you need a specific duplicate to survive, define the selection rule first, then sort accordingly.

---

## 7. `orderBy` — Sort by priority and amount

### Question
Sort support tickets by priority (`HIGH`, `MEDIUM`, `LOW`) and then by amount descending within each priority.

### Input
```json
[
  {"ticket":"T1","priority":"LOW","amount":900},
  {"ticket":"T2","priority":"HIGH","amount":200},
  {"ticket":"T3","priority":"HIGH","amount":800},
  {"ticket":"T4","priority":"MEDIUM","amount":1000}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
var priorityRank = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
}
---
payload
  orderBy ((ticket) -> -ticket.amount)
  orderBy ((ticket) -> priorityRank[ticket.priority])
```

### Expected output
```json
[
  {"ticket":"T2","priority":"HIGH","amount":200},
  {"ticket":"T3","priority":"HIGH","amount":800},
  {"ticket":"T4","priority":"MEDIUM","amount":1000},
  {"ticket":"T1","priority":"LOW","amount":900}
]
```

### Important note
When implementing multiple sorting requirements, test the actual ordering behavior in the DataWeave version used by your Mule runtime. An explicit composite sort key can be preferable when deterministic ordering is critical.

### Interview point
Sorting by a business rank is often better than relying on alphabetical ordering of status names.

---

## 8. `reduce` — Create a financial summary

### Question
Calculate total debit, total credit, and net movement from a transaction array.

### Input
```json
[
  {"type":"CREDIT","amount":10000},
  {"type":"DEBIT","amount":2500},
  {"type":"DEBIT","amount":1500},
  {"type":"CREDIT","amount":3000}
]
```

### Answer
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {
  credit: 0,
  debit: 0
}) ->
  if (item.type == "CREDIT")
    acc ++ {credit: acc.credit + item.amount}
  else
    acc ++ {debit: acc.debit + item.amount}
)
```

### Expected output
```json
{
  "credit":13000,
  "debit":4000
}
```

### Add net movement
```dataweave
%dw 2.0
output application/json
var totals = payload reduce ((item, acc = {credit: 0, debit: 0}) ->
  if (item.type == "CREDIT")
    acc ++ {credit: acc.credit + item.amount}
  else
    acc ++ {debit: acc.debit + item.amount}
)
---
totals ++ {net: totals.credit - totals.debit}
```

### Expected output
```json
{
  "credit":13000,
  "debit":4000,
  "net":9000
}
```

### Explanation
`reduce` is useful when many array elements must contribute to one accumulated result.

### Common mistake
Using a sequence of unrelated variables when the result naturally represents one accumulator.

### Interview point
Be able to explain the accumulator's initial value and how each input element changes it.

---

# Operator selection cheat sheet

| Requirement | Typical DataWeave operator |
|---|---|
| Transform every array element | `map` |
| Transform object key/value entries | `mapObject` |
| Keep selected array elements | `filter` |
| Keep selected object entries | `filterObject` |
| Group array records | `groupBy` |
| Remove duplicates using a criterion | `distinctBy` |
| Sort an array | `orderBy` |
| Aggregate an array into one result | `reduce` |

# Production checklist

Before committing a transformation:

- Confirm whether the input is an **Array** or **Object**.
- Check null, missing-field, and empty-array behavior.
- Preserve identifiers as Strings when leading zeroes matter.
- Use explicit type coercion for XML/CSV numeric fields.
- Keep outbound fields limited to the API contract.
- Test duplicate behavior before using `distinctBy`.
- Test secondary sorting rules with equal primary values.
- Verify `reduce` accumulator initialization.
- Add edge-case tests for empty input and unexpected values.
- Run examples against the Mule runtime/DataWeave version used by the project.

# Interview questions to ask yourself

1. What is the difference between `map` and `mapObject`?
2. What is the difference between `filter` and `filterObject`?
3. What does `groupBy` return?
4. How does `distinctBy` determine uniqueness?
5. How would you control which duplicate survives?
6. How can `orderBy` implement descending order?
7. What is the accumulator in `reduce`?
8. When is `reduce` preferable to a simple `sum`?
9. What happens when the input array is empty?
10. How do you prevent null or missing fields from breaking a transformation?

## Source reference

The referenced Medium article was published September 21, 2024 and explicitly presents eight practice areas: `map`, `mapObject`, `filter`, `filterObject`, `groupBy`, `distinctBy`, `orderBy`, and `reduce`. citeturn0search0

This repository uses that article only as a learning-topic reference. The exercises, datasets, explanations, and implementations in this file are newly authored for this repository.
