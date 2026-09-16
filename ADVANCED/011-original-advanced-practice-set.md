# Advanced DataWeave Practice — Original Question & Answer Set

This chapter is an original practice set covering advanced DataWeave concepts and real-world transformation patterns. It is not a reproduction of any third-party question bank.

## How to use

For each problem, first predict the output, then run the transformation in your Mule/DataWeave runtime. Inputs are intentionally realistic and solutions emphasize readable, maintainable DataWeave 2.x.

---

## DW-ADV-001 — Group orders by customer and calculate totals

**Question**

Given an array of orders, return one object per customer containing the customer name, number of orders, and total order amount.

**Input**
```json
[
  {"customer":"Ravi","amount":1200},
  {"customer":"Priya","amount":800},
  {"customer":"Ravi","amount":500}
]
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload
  groupBy $.customer
  pluck ((orders, customer) -> {
    customer: customer,
    orderCount: sizeOf(orders),
    totalAmount: orders reduce ((item, total = 0) -> total + item.amount)
  })
```

**Expected Output**
```json
[
  {"customer":"Ravi","orderCount":2,"totalAmount":1700},
  {"customer":"Priya","orderCount":1,"totalAmount":800}
]
```

**Explanation:** `groupBy` creates customer buckets, `pluck` converts the grouped object into an array, and `reduce` calculates each customer's total.

**Common Mistakes:** Treating the result of `groupBy` as an array; forgetting that the grouped value is an object.

**Interview Tip:** Explain why `pluck` is useful after `groupBy` when an API expects an array.

---

## DW-ADV-002 — Remove duplicate records using a business key

**Question:** Keep only the first customer record for each email address.

**Input**
```json
[
  {"id":1,"email":"ravi@example.com","name":"Ravi"},
  {"id":2,"email":"priya@example.com","name":"Priya"},
  {"id":3,"email":"ravi@example.com","name":"Ravi Kumar"}
]
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload distinctBy $.email
```

**Expected Output**
```json
[
  {"id":1,"email":"ravi@example.com","name":"Ravi"},
  {"id":2,"email":"priya@example.com","name":"Priya"}
]
```

**Explanation:** `distinctBy` uses the expression after it as the uniqueness key.

**Common Mistakes:** Using the entire object as the key when uniqueness is actually based on email.

**Interview Tip:** Ask whether duplicates should keep the first record, last record, or be merged; the business rule changes the implementation.

---

## DW-ADV-003 — Build dynamic object keys

**Question:** Convert an array of departments into an object whose keys are department codes.

**Input**
```json
[
  {"code":"IT","head":"Ravi"},
  {"code":"HR","head":"Priya"}
]
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, result = {}) ->
  result ++ {(item.code): {head: item.head}}
)
```

**Expected Output**
```json
{
  "IT":{"head":"Ravi"},
  "HR":{"head":"Priya"}
}
```

**Explanation:** Parentheses around `(item.code)` allow the value of the expression to become a dynamic object key.

**Common Mistakes:** Writing `{item.code: ...}`, which does not express the same dynamic-key intent.

**Interview Tip:** Dynamic keys are common when converting flat records into lookup objects.

---

## DW-ADV-004 — Flatten nested line items

**Question:** Convert orders containing nested line items into one flat array containing the order ID and product details.

**Input**
```json
[
  {"orderId":"O100","items":[{"sku":"A1","qty":2},{"sku":"B1","qty":1}]},
  {"orderId":"O101","items":[{"sku":"C1","qty":4}]}
]
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload flatMap ((order) ->
  order.items map ((item) -> {
    orderId: order.orderId,
    sku: item.sku,
    quantity: item.qty
  })
)
```

**Expected Output**
```json
[
  {"orderId":"O100","sku":"A1","quantity":2},
  {"orderId":"O100","sku":"B1","quantity":1},
  {"orderId":"O101","sku":"C1","quantity":4}
]
```

**Explanation:** Each order produces an array of transformed items, and `flatMap` combines those arrays into one array.

**Common Mistakes:** Using `map` alone and accidentally producing an array of arrays.

**Interview Tip:** Contrast `map` with `flatMap`: `flatMap` maps and then flattens one level.

---

## DW-ADV-005 — Conditional transformation based on amount

**Question:** Add a `category` field: `HIGH` for amounts of at least 10000, otherwise `NORMAL`.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload map ((item) -> item ++ {
  category: if (item.amount >= 10000) "HIGH" else "NORMAL"
})
```

**Expected behavior:** Every record retains its original fields and receives the calculated category.

**Explanation:** Object concatenation with `++` adds the derived field without rebuilding the complete record.

**Common Mistakes:** Comparing numeric values as strings.

**Interview Tip:** Mention that the condition should reflect the business rule and input type.

---

## DW-ADV-006 — Safely handle missing nested values

**Question:** Return the customer's city, but use `UNKNOWN` when address or city is missing.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  city: payload.address.city default "UNKNOWN"
}
```

**Explanation:** `default` provides a fallback when the selected value is absent or null according to the expression's evaluation.

**Common Mistakes:** Assuming every nested object exists.

**Interview Tip:** Discuss whether an absent address should produce a default, null, or an API validation error.

---

## DW-ADV-007 — Calculate account balance from transactions

**Question:** Starting with an opening balance, calculate the closing balance from credit and debit transactions.

**Input**
```json
{
  "openingBalance":5000,
  "transactions":[
    {"type":"CREDIT","amount":1000},
    {"type":"DEBIT","amount":750},
    {"type":"DEBIT","amount":250}
  ]
}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
var closing = payload.transactions reduce ((tx, balance = payload.openingBalance) ->
  if (tx.type == "CREDIT") balance + tx.amount
  else if (tx.type == "DEBIT") balance - tx.amount
  else balance
)
---
{
  openingBalance: payload.openingBalance,
  closingBalance: closing
}
```

**Expected Output**
```json
{"openingBalance":5000,"closingBalance":5000}
```

**Explanation:** `reduce` carries the running balance from one transaction to the next.

**Common Mistakes:** Starting the accumulator at zero instead of the opening balance.

**Interview Tip:** Explain how the same pattern can implement running totals, inventory counts, or financial summaries.

---

## DW-ADV-008 — Join two arrays by ID

**Question:** Enrich orders with customer names from a separate customer array.

**Input**
```json
{
  "customers":[
    {"id":1,"name":"Ravi"},
    {"id":2,"name":"Priya"}
  ],
  "orders":[
    {"orderId":"O1","customerId":2,"amount":700},
    {"orderId":"O2","customerId":1,"amount":900}
  ]
}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload.orders map ((order) -> do {
  var customer = payload.customers filter ($.id == order.customerId) default []
  ---
  order ++ {
    customerName: if (isEmpty(customer)) null else customer[0].name
  }
})
```

**Expected Output**
```json
[
  {"orderId":"O1","customerId":2,"amount":700,"customerName":"Priya"},
  {"orderId":"O2","customerId":1,"amount":900,"customerName":"Ravi"}
]
```

**Explanation:** Each order looks up its related customer and adds the name.

**Common Mistakes:** Assuming a match always exists or indexing an empty filtered array.

**Interview Tip:** For very large datasets, discuss lookup-map construction and runtime complexity rather than repeatedly scanning the customer array.

---

## DW-ADV-009 — Convert a flat customer record into an API structure

**Question:** Transform a flat database-style record into a nested API response.

**Input**
```json
{
  "customerId":101,
  "fullName":"Ravi Kumar",
  "email":"ravi@example.com",
  "street":"Main Road",
  "city":"Visakhapatnam",
  "country":"India"
}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
{
  customer: {
    id: payload.customerId,
    name: payload.fullName,
    contact: {
      email: payload.email
    },
    address: {
      street: payload.street,
      city: payload.city,
      country: payload.country
    }
  }
}
```

**Explanation:** DataWeave can reshape flat database rows into nested API contracts without changing the source data.

**Common Mistakes:** Leaking internal database column names into the public contract.

**Interview Tip:** Emphasize contract separation between database schemas and API schemas.

---

## DW-ADV-010 — Convert object fields into an array of name/value pairs

**Question:** Transform a customer object into an array suitable for a generic metadata UI.

**Input**
```json
{"name":"Ravi","city":"Vizag","status":"ACTIVE"}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> {
  field: key,
  value: value
})
```

**Expected Output**
```json
[
  {"field":"name","value":"Ravi"},
  {"field":"city","value":"Vizag"},
  {"field":"status","value":"ACTIVE"}
]
```

**Explanation:** `pluck` iterates over object values while exposing each key.

**Common Mistakes:** Using `map`, which is intended for arrays.

**Interview Tip:** Remember: `map` works with arrays; `mapObject` transforms object fields while preserving object shape; `pluck` converts object entries into an array.

---

## DW-ADV-011 — Filter an object by value

**Question:** Keep only configuration properties whose values are enabled.

**Input**
```json
{"audit":true,"notifications":false,"metrics":true}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value == true)
```

**Expected Output**
```json
{"audit":true,"metrics":true}
```

**Explanation:** `filterObject` evaluates each key/value pair and keeps entries whose condition is true.

**Common Mistakes:** Using array `filter` on an object.

**Interview Tip:** Be able to explain why the result remains an object.

---

## DW-ADV-012 — Sort records by multiple business fields

**Question:** Sort employees by department and then by descending salary.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload orderBy ((employee) ->
  [employee.department, -employee.salary]
)
```

**Explanation:** A composite sort key can express multiple ordering criteria.

**Common Mistakes:** Forgetting that descending numeric order can be represented by negating the numeric sort value.

**Interview Tip:** Discuss the desired behavior for null salaries before applying arithmetic.

---

## DW-ADV-013 — Produce a validation report

**Question:** For each customer, report whether required fields are present.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload map ((c) -> do {
  var missing = [
    if (c.name default "") == "" "name" else null,
    if (c.email default "") == "" "email" else null,
    if (c.mobile default "") == "" "mobile" else null
  ] filter ($ != null)
  ---
  {
    customerId: c.id,
    valid: isEmpty(missing),
    missingFields: missing
  }
})
```

**Explanation:** The transformation builds a list of missing fields and derives a boolean validation result from it.

**Common Mistakes:** Treating empty strings and missing properties as automatically equivalent without deciding the contract.

**Interview Tip:** Validation rules should be explicit and testable.

---

## DW-ADV-014 — Convert dates to an API-friendly format

**Question:** Convert an ISO date string into `dd/MM/yyyy`.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
{
  original: payload.date,
  formatted: (payload.date as Date) as String {format: "dd/MM/yyyy"}
}
```

**Expected behavior:** `2026-09-16` becomes `16/09/2026`.

**Explanation:** The value is first interpreted as a `Date`, then formatted as a string.

**Common Mistakes:** Formatting a raw string without parsing it as a date first.

**Interview Tip:** Discuss input timezone and date-vs-datetime semantics when the source contains time information.

---

## DW-ADV-015 — Create a reusable function

**Question:** Create a function that converts a null or blank string to `UNKNOWN`.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
fun safeText(value) =
  if (value == null or (value is String and trim(value) == "")) "UNKNOWN"
  else value
---
{
  name: safeText(payload.name),
  city: safeText(payload.city)
}
```

**Explanation:** A reusable function centralizes the null/blank rule so it does not have to be duplicated.

**Common Mistakes:** Calling string functions on null without checking the value first.

**Interview Tip:** Functions improve consistency and make complex mappings easier to test.

---

## DW-ADV-016 — Generate a pagination response

**Question:** Given a complete array and `page`/`pageSize`, return only the requested page plus pagination metadata.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
var page = 2
var pageSize = 3
var start = (page - 1) * pageSize
var records = payload[start to (start + pageSize - 1)]
---
{
  page: page,
  pageSize: pageSize,
  totalRecords: sizeOf(payload),
  records: records
}
```

**Explanation:** The start index is calculated from page number and page size, then a slice is selected.

**Common Mistakes:** Mixing one-based page numbers with zero-based array indexes.

**Interview Tip:** In production, pagination is usually better performed by the source system rather than loading the entire dataset into memory.

---

## DW-ADV-017 — Create a summary by status

**Question:** Return counts and total amounts for each transaction status.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload
  groupBy $.status
  pluck ((transactions, status) -> {
    status: status,
    count: sizeOf(transactions),
    totalAmount: transactions reduce ((t, sum = 0) -> sum + t.amount)
  })
```

**Explanation:** Grouping and reduction provide a compact aggregation pattern.

**Common Mistakes:** Calculating the total before grouping, which would produce a global total instead of one total per status.

**Interview Tip:** This pattern appears frequently in reporting and dashboard APIs.

---

## DW-ADV-018 — Remove internal fields from an object

**Question:** Build a public API response without internal database fields such as `passwordHash`, `internalId`, and `auditVersion`.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
payload -- "passwordHash" -- "internalId" -- "auditVersion"
```

**Explanation:** Object subtraction removes fields from the output contract.

**Common Mistakes:** Returning the entire database object directly from an API.

**Interview Tip:** Explicitly control what leaves an integration boundary.

---

## DW-ADV-019 — Transform an API error consistently

**Question:** Convert an internal error object into a stable public error contract.

**Input**
```json
{"errorCode":"DB-001","message":"Connection failed","correlationId":"abc-123"}
```

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
{
  error: {
    code: payload.errorCode,
    message: payload.message,
    correlationId: payload.correlationId
  }
}
```

**Expected Output**
```json
{"error":{"code":"DB-001","message":"Connection failed","correlationId":"abc-123"}}
```

**Explanation:** The internal representation is reshaped into a predictable API contract.

**Common Mistakes:** Returning stack traces, SQL details, credentials, or internal implementation information to API consumers.

**Interview Tip:** Error payloads should be useful to consumers while avoiding sensitive implementation details.

---

## DW-ADV-020 — Build a bank transaction statement

**Question:** Transform transactions into a statement containing credits, debits, and closing balance.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
var credits = payload.transactions filter $.type == "CREDIT"
var debits = payload.transactions filter $.type == "DEBIT"
var creditTotal = credits reduce ((x, total = 0) -> total + x.amount)
var debitTotal = debits reduce ((x, total = 0) -> total + x.amount)
---
{
  accountId: payload.accountId,
  openingBalance: payload.openingBalance,
  creditTotal: creditTotal,
  debitTotal: debitTotal,
  closingBalance: payload.openingBalance + creditTotal - debitTotal,
  transactionCount: sizeOf(payload.transactions)
}
```

**Explanation:** Separate filtered collections make the business calculations easy to read and verify.

**Common Mistakes:** Subtracting every transaction instead of only debits.

**Interview Tip:** For money calculations, agree on numeric precision and currency handling with the application design rather than relying on implicit assumptions.

---

## DW-ADV-021 — Find the highest-value transaction

**Question:** Return the transaction with the greatest amount.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
if (isEmpty(payload)) null
else payload orderBy $.amount [-1]
```

**Explanation:** Sorting by amount and selecting the last element returns the largest amount. Empty input is handled explicitly.

**Common Mistakes:** Indexing `[-1]` without deciding what should happen for an empty array.

**Interview Tip:** If performance matters, a single-pass reduction can avoid sorting the complete collection.

---

## DW-ADV-022 — Single-pass maximum with reduce

**Question:** Find the maximum transaction amount without sorting the array.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
if (isEmpty(payload)) null
else payload reduce ((item, max = null) ->
  if (max == null or item.amount > max.amount) item else max
)
```

**Explanation:** `reduce` maintains the current maximum and examines each record once.

**Common Mistakes:** Initializing the maximum to zero when negative values may be valid.

**Interview Tip:** Compare algorithmic complexity: sorting generally costs more work than a single-pass maximum.

---

## DW-ADV-023 — Normalize field names

**Question:** Convert a source object containing inconsistent key names into a standard API model.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
---
{
  firstName: payload.FIRST_NAME,
  lastName: payload.last_name,
  phoneNumber: payload.MobileNumber,
  emailAddress: payload.EMAIL
}
```

**Explanation:** Explicit mapping is often clearer than generic key manipulation when source systems have inconsistent schemas.

**Common Mistakes:** Assuming every source field uses the same casing convention.

**Interview Tip:** Explicit transformations make API contracts visible and maintainable.

---

## DW-ADV-024 — Create a reusable nested function with defaults

**Question:** Calculate an order total while treating a missing discount as zero.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
fun lineTotal(line) = (line.price * line.quantity)
fun orderTotal(order) =
  (order.items map lineTotal reduce ((x, total = 0) -> total + x))
  - (order.discount default 0)
---
{
  orderId: payload.orderId,
  total: orderTotal(payload)
}
```

**Explanation:** Small functions separate line calculation from order-level calculation.

**Common Mistakes:** Applying the discount to each line when the business rule defines it at order level.

**Interview Tip:** State where rounding occurs if the real system handles currency.

---

## DW-ADV-025 — Expert challenge: construct a customer dashboard

**Question:** Given customers and transactions, return one dashboard record per customer containing transaction count, credits, debits, and balance change.

**DataWeave Answer**
```dataweave
%dw 2.0
output application/json
var transactionsByCustomer = payload.transactions groupBy $.customerId
---
payload.customers map ((customer) -> do {
  var tx = transactionsByCustomer[(customer.id as String)] default []
  var credits = tx filter $.type == "CREDIT"
  var debits = tx filter $.type == "DEBIT"
  var creditTotal = credits reduce ((x, total = 0) -> total + x.amount)
  var debitTotal = debits reduce ((x, total = 0) -> total + x.amount)
  ---
  {
    customerId: customer.id,
    customerName: customer.name,
    transactionCount: sizeOf(tx),
    creditTotal: creditTotal,
    debitTotal: debitTotal,
    balanceChange: creditTotal - debitTotal
  }
})
```

**Explanation:** The transactions are grouped once and then looked up while mapping customers. This avoids repeatedly filtering the complete transaction collection for every customer.

**Common Mistakes:** Grouping by one key type and looking up with another without considering DataWeave key coercion.

**Interview Tip:** Discuss preprocessing, lookup structures, null/empty handling, and performance when explaining this solution.

---

# Advanced Interview Checklist

Before considering an advanced DataWeave solution complete, verify:

1. Does the transformation match the required output contract?
2. Are null, missing, and empty values handled intentionally?
3. Are numeric/date types correct?
4. Is sensitive internal information excluded?
5. Are repeated operations avoidable through variables or lookup objects?
6. Is the expression readable by another MuleSoft developer?
7. Are business rules obvious from the code?
8. Does the transformation behave correctly for empty arrays?
9. Has the script been tested against the target Mule/DataWeave runtime?
10. Are edge cases documented?

# Suggested Runtime Tests

Test every solution with:

- normal input
- empty array
- missing optional field
- null value
- duplicate record
- unexpected status/type
- zero amount
- negative amount where applicable
- large collection
- malformed source data

> These examples are original educational material created for this repository. They are not copied from the referenced Scribd document.
