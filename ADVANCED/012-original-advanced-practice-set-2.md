# Advanced DataWeave Practice Set 2 — Original Questions & Answers

> This is original educational content created for this repository. It does not reproduce third-party copyrighted material.

## Q26 — Group orders by customer and calculate totals

**Input**
```json
[
  {"customer":"A","amount":100},
  {"customer":"B","amount":50},
  {"customer":"A","amount":75}
]
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload groupBy $.customer mapObject ((items, customer) -> {
  (customer): {
    orderCount: sizeOf(items),
    total: sum(items.amount)
  }
})
```

**Expected output**
```json
{"A":{"orderCount":2,"total":175},"B":{"orderCount":1,"total":50}}
```

---

## Q27 — Remove duplicate customers using email

```dataweave
%dw 2.0
output application/json
---
payload distinctBy lower($.email)
```

This keeps the first record for each case-insensitive email address.

---

## Q28 — Convert an array into a dynamic object

**Input**
```json
[{"code":"IN","name":"India"},{"code":"US","name":"United States"}]
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.code): item.name})
```

**Output**
```json
{"IN":"India","US":"United States"}
```

---

## Q29 — Flatten nested departments and employees

```dataweave
%dw 2.0
output application/json
---
payload flatMap ((department) -> department.employees map ((employee) -> {
  department: department.name,
  employee: employee.name
}))
```

---

## Q30 — Safely read an optional field

```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  phone: $.phone default "NOT_PROVIDED"
}
```

Use `default` when the field can be absent or null and a fallback is acceptable.

---

## Q31 — Calculate running account balance

**Input**
```json
[
  {"type":"CREDIT","amount":1000},
  {"type":"DEBIT","amount":250},
  {"type":"CREDIT","amount":100}
]
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((tx, balance = 0) ->
  balance + (if (tx.type == "CREDIT") tx.amount else -tx.amount)
)
```

**Output:** `850`

---

## Q32 — Join orders with customer data

```dataweave
%dw 2.0
output application/json
var customers = vars.customers
---
payload map ((order) -> do {
  var customer = customers filter ($.id == order.customerId) [0]
  ---
  order ++ {customerName: customer.name default "Unknown"}
})
```

---

## Q33 — Create an API response envelope

```dataweave
%dw 2.0
output application/json
---
{
  success: true,
  timestamp: now(),
  count: sizeOf(payload),
  data: payload
}
```

---

## Q34 — Convert object fields into an array

**Input**
```json
{"name":"Narsing","city":"Vizag","role":"Developer"}
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> {
  field: key as String,
  value: value
})
```

---

## Q35 — Keep only selected object fields

```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> ["id", "name", "email"] contains (key as String))
```

---

## Q36 — Sort by two fields

Sort employees by department and then salary descending.

```dataweave
%dw 2.0
output application/json
---
payload orderBy ((item) -> (item.department ++ "|" ++ ((999999 - item.salary) as String)))
```

For production code, prefer a comparator/secondary-sort approach appropriate to the Mule/DataWeave runtime version instead of relying on string tricks when numeric precision or formatting matters.

---

## Q37 — Build a validation report

```dataweave
%dw 2.0
output application/json
---
{
  valid: payload.email != null and payload.name != null and payload.age >= 18,
  errors: [
    if (payload.name == null) "name is required" else null,
    if (payload.email == null) "email is required" else null,
    if (payload.age < 18) "age must be 18 or above" else null
  ] filter ($ != null)
}
```

---

## Q38 — Format a date

```dataweave
%dw 2.0
output application/json
---
{formattedDate: payload.date as Date {format: "yyyy-MM-dd"} as String {format: "dd-MMM-yyyy"}}
```

---

## Q39 — Create a reusable masking function

```dataweave
%dw 2.0
output application/json
fun mask(value, visible = 4) =
  if (value == null) null
  else if (sizeOf(value as String) <= visible) "*" * sizeOf(value as String)
  else ("*" * (sizeOf(value as String) - visible)) ++ ((value as String)[-visible to -1])
---
{account: mask(payload.accountNumber)}
```

**Note:** For sensitive banking data, masking rules should be defined by the application's security requirements.

---

## Q40 — Paginate an array

Assume `vars.page` is 2 and `vars.pageSize` is 10.

```dataweave
%dw 2.0
output application/json
var page = vars.page default 1
var pageSize = vars.pageSize default 10
var start = (page - 1) * pageSize
---
{
  page: page,
  pageSize: pageSize,
  total: sizeOf(payload),
  data: payload[start to (start + pageSize - 1)] default []
}
```

---

## Q41 — Count records by status

```dataweave
%dw 2.0
output application/json
---
payload groupBy $.status mapObject ((items, status) -> {(status): sizeOf(items)})
```

---

## Q42 — Calculate minimum, maximum and average

```dataweave
%dw 2.0
output application/json
---
{
  minimum: min(payload.amount),
  maximum: max(payload.amount),
  average: avg(payload.amount),
  total: sum(payload.amount)
}
```

---

## Q43 — Remove null fields from an object

```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value != null)
```

---

## Q44 — Normalize names and emails

```dataweave
%dw 2.0
output application/json
---
payload map {
  name: trim($.name) upper,
  email: lower(trim($.email))
}
```

---

## Q45 — Find the highest-value transaction

```dataweave
%dw 2.0
output application/json
---
(payload orderBy $.amount)[-1]
```

For an empty input, add an explicit empty-array guard before indexing.

---

## Q46 — Create a transaction summary

```dataweave
%dw 2.0
output application/json
---
{
  credits: sum((payload filter $.type == "CREDIT").amount),
  debits: sum((payload filter $.type == "DEBIT").amount),
  transactionCount: sizeOf(payload)
}
```

---

## Q47 — Convert database-style uppercase fields to API fields

**Input**
```json
{"CUSTOMER_ID":101,"FULL_NAME":"Ravi Kumar","MOBILE_NUMBER":"9999999999"}
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
{
  customerId: payload.CUSTOMER_ID,
  fullName: payload.FULL_NAME,
  mobileNumber: payload.MOBILE_NUMBER
}
```

---

## Q48 — Build a nested order response

```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  customer: {
    id: payload.customer.id,
    name: payload.customer.name
  },
  items: payload.items map {
    sku: $.sku,
    quantity: $.quantity,
    lineTotal: $.quantity * $.unitPrice
  },
  total: sum(payload.items map ($.quantity * $.unitPrice))
}
```

---

## Q49 — Extract unique values after filtering

Find unique active product categories.

```dataweave
%dw 2.0
output application/json
---
(payload filter $.active == true).category distinctBy $
```

---

## Q50 — Create a lookup map for fast access

```dataweave
%dw 2.0
output application/json
---
(payload reduce ((item, acc = {}) -> acc ++ {(item.id as String): item}))
```

This produces an object keyed by ID, useful when later transformations need direct key-based lookup.

---

## Q51 — Handle empty input safely

```dataweave
%dw 2.0
output application/json
---
if (payload == null or isEmpty(payload))
  {count: 0, data: []}
else
  {count: sizeOf(payload), data: payload}
```

---

## Q52 — Convert a CSV-like array into API JSON

```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.ID as Number,
  name: trim($.NAME),
  active: lower($.ACTIVE) == "true"
}
```

---

## Q53 — Build an error contract from Mule error information

```dataweave
%dw 2.0
output application/json
---
{
  success: false,
  error: {
    type: (error.errorType.identifier default "UNKNOWN") as String,
    message: error.description default "Unexpected error"
  },
  correlationId: correlationId
}
```

---

## Q54 — Calculate available bank balance

```dataweave
%dw 2.0
output application/json
---
{
  accountNumber: payload.accountNumber,
  openingBalance: payload.openingBalance,
  credits: sum((payload.transactions filter $.type == "CREDIT").amount),
  debits: sum((payload.transactions filter $.type == "DEBIT").amount),
  availableBalance: payload.openingBalance
    + sum((payload.transactions filter $.type == "CREDIT").amount)
    - sum((payload.transactions filter $.type == "DEBIT").amount)
}
```

In a real banking integration, balance calculations must follow the authoritative ledger/business rules rather than trusting client-supplied values.

---

## Q55 — Merge two arrays and remove duplicate IDs

```dataweave
%dw 2.0
output application/json
---
((vars.oldRecords default []) ++ (payload default [])) distinctBy $.id
```

---

## Q56 — Partition successful and failed records

```dataweave
%dw 2.0
output application/json
var successful = payload filter $.status == "SUCCESS"
---
{
  successful: successful,
  failed: payload -- successful
}
```

---

## Q57 — Convert a flat key into nested structure

**Input**
```json
{"customer_name":"Ravi","address_city":"Vizag","address_state":"AP"}
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
{
  customerName: payload.customer_name,
  address: {
    city: payload.address_city,
    state: payload.address_state
  }
}
```

---

## Q58 — Add calculated fields without mutating the source

```dataweave
%dw 2.0
output application/json
---
payload map ($ ++ {
  fullName: $.firstName ++ " " ++ $.lastName,
  isAdult: $.age >= 18
})
```

---

## Q59 — Generate a response for each validation result

```dataweave
%dw 2.0
output application/json
---
payload map ((item) -> {
  id: item.id,
  status: if (item.email matches /.+@.+\..+/) "VALID" else "INVALID"
})
```

---

## Q60 — Use a local function for currency conversion

```dataweave
%dw 2.0
output application/json
var usdToInr = (amount) -> amount * 83.0
---
payload map {
  product: $.product,
  usd: $.price,
  inr: usdToInr($.price)
}
```

The exchange rate is intentionally an input/example constant; production integrations should source rates from the required authoritative system.

---

## Q61 — Extract fields dynamically

If `vars.fieldName` contains `email`:

```dataweave
%dw 2.0
output application/json
var field = vars.fieldName
---
{
  requestedField: field,
  value: payload[field]
}
```

---

## Q62 — Group transactions by month

```dataweave
%dw 2.0
output application/json
---
payload groupBy (($.transactionDate as Date {format: "yyyy-MM-dd"}) as String {format: "yyyy-MM"})
```

---

## Q63 — Produce monthly totals

```dataweave
%dw 2.0
output application/json
var grouped = payload groupBy (($.date as Date {format: "yyyy-MM-dd"}) as String {format: "yyyy-MM"})
---
grouped mapObject ((items, month) -> {
  (month): sum(items.amount)
})
```

---

## Q64 — Find records missing required fields

```dataweave
%dw 2.0
output application/json
---
payload filter (
  $.id == null or
  $.name == null or
  $.email == null
)
```

---

## Q65 — Build a compact audit event

```dataweave
%dw 2.0
output application/json
---
{
  eventType: "CUSTOMER_UPDATED",
  entityId: payload.id,
  changedFields: payload.changes map $.field,
  occurredAt: now()
}
```

---

## Q66 — Compare two versions of a record

```dataweave
%dw 2.0
output application/json
var old = vars.oldRecord
var current = payload
---
{
  nameChanged: old.name != current.name,
  emailChanged: old.email != current.email,
  phoneChanged: old.phone != current.phone
}
```

---

## Q67 — Create a field-level change list

```dataweave
%dw 2.0
output application/json
var old = vars.oldRecord
var current = payload
---
[
  {field: "name", oldValue: old.name, newValue: current.name} if (old.name != current.name),
  {field: "email", oldValue: old.email, newValue: current.email} if (old.email != current.email),
  {field: "phone", oldValue: old.phone, newValue: current.phone} if (old.phone != current.phone)
] filter ($ != null)
```

---

## Q68 — Aggregate by bank and transaction type

```dataweave
%dw 2.0
output application/json
---
payload groupBy $.bank groupBy $.type
```

For a production report, follow this with `mapObject`/`pluck` to turn the grouped structure into the exact API contract required by consumers.

---

## Q69 — Create a boolean feature summary

```dataweave
%dw 2.0
output application/json
---
{
  hasEmail: payload.email != null,
  hasPhone: payload.phone != null,
  hasAddress: payload.address != null,
  isVerified: payload.verified default false
}
```

---

## Q70 — Generate a stable API metadata block

```dataweave
%dw 2.0
output application/json
---
{
  requestId: attributes.headers.'x-request-id' default correlationId,
  generatedAt: now(),
  itemCount: sizeOf(payload),
  data: payload
}
```

---

## Q71 — Flatten selected nested values

```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  city: $.profile.address.city default null,
  state: $.profile.address.state default null
}
```

---

## Q72 — Filter by a dynamic list of statuses

If `vars.allowedStatuses` is `['ACTIVE','PENDING']`:

```dataweave
%dw 2.0
output application/json
---
payload filter (vars.allowedStatuses contains $.status)
```

---

## Q73 — Calculate percentages

```dataweave
%dw 2.0
output application/json
var total = sum(payload.amount)
---
payload map {
  category: $.category,
  amount: $.amount,
  percentage: if (total == 0) 0 else ($.amount / total) * 100
}
```

---

## Q74 — Build a dashboard summary

```dataweave
%dw 2.0
output application/json
---
{
  totalCustomers: sizeOf(payload),
  activeCustomers: sizeOf(payload filter $.status == "ACTIVE"),
  inactiveCustomers: sizeOf(payload filter $.status == "INACTIVE"),
  verifiedCustomers: sizeOf(payload filter $.verified == true)
}
```

---

## Q75 — Expert challenge: combine filtering, grouping and aggregation

**Requirement:** From a transaction array, keep successful transactions above 1,000, group by customer, and return transaction count plus total amount for each customer.

**Answer**
```dataweave
%dw 2.0
output application/json
var selected = payload filter (
  $.status == "SUCCESS" and $.amount > 1000
)
---
selected groupBy $.customerId mapObject ((items, customerId) -> {
  (customerId as String): {
    transactionCount: sizeOf(items),
    totalAmount: sum(items.amount)
  }
})
```

### Advanced checklist

When solving advanced DataWeave problems, check:

- Is the input an object or an array?
- Can fields be null or missing?
- Does the output contract require an object, array, XML, CSV, or another MIME type?
- Are dates explicitly parsed and formatted?
- Are duplicate records expected?
- Can the input be empty?
- Can numeric calculations encounter zero or null?
- Is a dynamic field/key required?
- Can the transformation be expressed with `map`, `filter`, `reduce`, `groupBy`, `pluck`, `mapObject`, or `filterObject`?
- Would a reusable function improve readability?
- Does the transformation expose sensitive information that should be masked or omitted?
- Does the solution need to preserve ordering?
- What happens for malformed or unexpected input?

### Practice goal

Do not memorize the solutions. Re-create each transformation from the requirement, test it with normal and edge-case inputs, and then compare your implementation with the reference solution.
