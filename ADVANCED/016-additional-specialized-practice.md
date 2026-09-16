# Additional Specialized DataWeave Practice

This is an additive set of specialized problems. Existing question files are not modified.

> All examples use synthetic data. The snippets target DataWeave 2.x syntax; validate against the exact Mule runtime/DataWeave version used by your project.

## A01 — Build a dynamic object key

**Question:** Convert each product into an object keyed by its SKU.

**Input**
```json
[
  {"sku":"P100","name":"Keyboard"},
  {"sku":"P200","name":"Mouse"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload map ((p) -> {(p.sku): p})) reduce ((item, acc = {}) -> acc ++ item)
```

**Expected Output**
```json
{"P100":{"sku":"P100","name":"Keyboard"},"P200":{"sku":"P200","name":"Mouse"}}
```

**Key point:** Parenthesized expressions allow a computed key in an object literal.

---

## A02 — Create an object only when a field exists

**Question:** Include `phone` only when it is present and non-null.

**Input**
```json
{"name":"Ravi","phone":"9876543210"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  (phone: payload.phone) if (!isEmpty(payload.phone default ""))
}
```

**Expected Output**
```json
{"name":"Ravi","phone":"9876543210"}
```

**Key point:** Conditional object fields are useful for PATCH requests and optional API properties.

---

## A03 — Normalize two datasets before comparison

**Question:** Find customer IDs present in both arrays, ignoring case in the email address.

**Input**
```json
{
  "left":[{"id":1,"email":"RAVI@EXAMPLE.COM"},{"id":2,"email":"a@example.com"}],
  "right":[{"id":9,"email":"ravi@example.com"},{"id":8,"email":"b@example.com"}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var left = payload.left map ((x) -> lower(x.email))
---
payload.right
  filter ((x) -> left contains lower(x.email))
  map ((x) -> x.id)
```

**Expected Output**
```json
[9]
```

**Key point:** Normalize comparison keys before matching external datasets.

---

## A04 — Generate a field-level change set

**Question:** Compare `before` and `after` and return only changed fields.

**Input**
```json
{
  "before":{"name":"Ravi","city":"Vizag","age":30},
  "after":{"name":"Ravi","city":"Hyderabad","age":31}
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var b = payload.before
var a = payload.after
---
(a mapObject ((value, key) -> {
  before: b[key],
  after: value
}) filterObject ((v) -> v.before != v.after))
```

**Expected Output**
```json
{
  "city":{"before":"Vizag","after":"Hyderabad"},
  "age":{"before":30,"after":31}
}
```

**Key point:** `mapObject` plus `filterObject` is useful for audit and PATCH generation.

---

## A05 — Aggregate nested transactions by customer

**Question:** Return the total transaction amount for each customer.

**Input**
```json
[
  {"customer":"C1","amount":100},
  {"customer":"C2","amount":50},
  {"customer":"C1","amount":75}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload groupBy $.customer mapObject ((items, customer) -> {
  customer: customer,
  total: sum(items.amount)
}) pluck $ 
```

**Expected Output**
```json
[
  {"customer":"C1","total":175},
  {"customer":"C2","total":50}
]
```

**Key point:** Group first, then aggregate the grouped records.

---

## A06 — Safely extract a deeply nested optional value

**Question:** Return the first shipping city, or `"UNKNOWN"` when the structure is missing.

**Input**
```json
{"orders":[{"shipping":{"address":{"city":"Hyderabad"}}}]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload.orders[0].shipping.address.city default "UNKNOWN")
```

**Expected Output**
```json
"Hyderabad"
```

**Key point:** `default` is useful for absent/null values, but it should not hide genuinely invalid data.

---

## A07 — Convert an array into an indexed object

**Question:** Create keys `item1`, `item2`, and so on from an array.

**Input**
```json
["A","B","C"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}, index = 0) ->
  acc ++ {(("item" ++ (index + 1) as String)): item}
)
```

**Expected Output**
```json
{"item1":"A","item2":"B","item3":"C"}
```

**Key point:** `reduce` can construct stateful output when the result cannot be expressed as a simple `map`.

---

## A08 — Produce a deterministic reconciliation result

**Question:** Given source and target records keyed by `id`, classify each source record as `NEW`, `UNCHANGED`, or `CHANGED`.

**Input**
```json
{
  "source":[{"id":1,"name":"A"},{"id":2,"name":"B"}],
  "target":[{"id":1,"name":"A"}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var targetById = payload.target groupBy $.id
---
payload.source map ((s) -> do {
  var t = (targetById[s.id] default [])[0]
  ---
  {
    id: s.id,
    status: if (t == null) "NEW" else if (s == t) "UNCHANGED" else "CHANGED"
  }
})
```

**Expected Output**
```json
[
  {"id":1,"status":"UNCHANGED"},
  {"id":2,"status":"NEW"}
]
```

**Key point:** Building a lookup once avoids repeatedly scanning the target array.

---

## A09 — Normalize a phone number with a regex

**Question:** Keep only digits from a phone-number string.

**Input**
```json
{"phone":"+91 (987) 654-3210"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{phone: payload.phone replace /[^0-9]/ with ""}
```

**Expected Output**
```json
{"phone":"919876543210"}
```

**Key point:** Regex-based normalization is useful at integration boundaries.

---

## A10 — Validate a required email field

**Question:** Return a validation object without throwing for a missing or invalid email.

**Input**
```json
{"email":"not-an-email"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var email = payload.email default ""
---
{
  valid: (email matches /^[^@\s]+@[^@\s]+\.[^@\s]+$/),
  value: email
}
```

**Expected Output**
```json
{"valid":false,"value":"not-an-email"}
```

**Key point:** Keep validation output deterministic when the transformation is used by an API validation layer.

---

## A11 — Convert XML attributes and elements to JSON

**Question:** Transform product XML into a JSON object.

**Input**
```xml
<product id="P100"><name>Keyboard</name><price>1200</price></product>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.product.@id,
  name: payload.product.name,
  price: payload.product.price as Number
}
```

**Expected Output**
```json
{"id":"P100","name":"Keyboard","price":1200}
```

**Key point:** XML attributes and child elements have different selector syntax.

---

## A12 — Preserve an XML namespace

**Question:** Read a namespaced XML element.

**Input**
```xml
<ns0:customer xmlns:ns0="urn:bank"><ns0:name>Ravi</ns0:name></ns0:customer>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
ns ns0 urn:bank
---
{name: payload.ns0#customer.ns0#name}
```

**Expected Output**
```json
{"name":"Ravi"}
```

**Key point:** Namespace-qualified selectors prevent ambiguity in enterprise XML mappings.

---

## A13 — Convert CSV values to typed JSON

**Question:** Convert CSV rows so `amount` becomes a Number.

**Input**
```csv
id,name,amount
1,Ravi,1500.50
2,Priya,2300.00
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload map ((row) -> row ++ {amount: row.amount as Number})
```

**Expected Output**
```json
[
  {"id":"1","name":"Ravi","amount":1500.5},
  {"id":"2","name":"Priya","amount":2300}
]
```

**Key point:** CSV values are commonly read as strings, so explicit typing is important.

---

## A14 — Generate a standard API error structure

**Question:** Convert a list of validation errors into one consistent API response.

**Input**
```json
[
  {"field":"email","message":"Invalid email"},
  {"field":"age","message":"Must be 18+"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  code: "VALIDATION_ERROR",
  message: "Request validation failed",
  errors: payload map ((e) -> {
    field: e.field,
    message: e.message
  })
}
```

**Expected Output**
```json
{
  "code":"VALIDATION_ERROR",
  "message":"Request validation failed",
  "errors":[
    {"field":"email","message":"Invalid email"},
    {"field":"age","message":"Must be 18+"}
  ]
}
```

**Key point:** A stable error contract makes downstream integrations easier to consume.

---

## A15 — Use `match` for classification

**Question:** Classify an HTTP status as `SUCCESS`, `CLIENT_ERROR`, or `SERVER_ERROR`.

**Input**
```json
{"status":404}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.status match {
  case n if (n >= 200 and n < 300) -> "SUCCESS"
  case n if (n >= 400 and n < 500) -> "CLIENT_ERROR"
  case n if (n >= 500 and n < 600) -> "SERVER_ERROR"
  else -> "OTHER"
}
```

**Expected Output**
```json
"CLIENT_ERROR"
```

**Key point:** `match` makes mutually exclusive classification rules explicit.

---

## A16 — Apply an update to a nested field

**Question:** Change the customer's city without reconstructing the entire object.

**Input**
```json
{"customer":{"name":"Ravi","address":{"city":"Vizag","zip":"530001"}}}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload update {
  case .customer.address.city -> "Hyderabad"
}
```

**Expected Output**
```json
{"customer":{"name":"Ravi","address":{"city":"Hyderabad","zip":"530001"}}}
```

**Key point:** `update` is valuable for precise immutable transformations.

---

## A17 — Calculate age from a birth date

**Question:** Calculate age in complete years using a supplied reference date.

**Input**
```json
{"dob":"1990-09-20","today":"2026-09-16"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var dob = payload.dob as Date
var today = payload.today as Date
var years = today.year - dob.year
---
if (today < (dob + |P$(years)Y|)) years - 1 else years
```

**Expected Output**
```json
35
```

**Key point:** Date calculations should account for whether the birthday has occurred in the reference year.

---

## A18 — Round monetary totals

**Question:** Calculate a 5% fee and round the final fee to two decimal places.

**Input**
```json
{"amount":1234.567}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{fee: ((payload.amount * 0.05) as Number {format: "0.00"})}
```

**Expected Output**
```json
{"fee":61.73}
```

**Key point:** Financial transformations should make precision and rounding rules explicit.

---

## A19 — Extract unique values while preserving order

**Question:** Return unique department names in their first-seen order.

**Input**
```json
["IT","HR","IT","Finance","HR"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload distinctBy ((item) -> item)
```

**Expected Output**
```json
["IT","HR","Finance"]
```

**Key point:** `distinctBy` is useful when the first occurrence should be retained.

---

## A20 — Create a reusable local function

**Question:** Create a function that converts a nullable string into trimmed uppercase text.

**Input**
```json
{"name":"  ravi "}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun normalize(value: String | Null) =
  if (value == null) null else upper(trim(value))
---
{normalizedName: normalize(payload.name)}
```

**Expected Output**
```json
{"normalizedName":"RAVI"}
```

**Key point:** Small reusable functions reduce duplicated business rules.

---

## A21 — Use a `do` scope for intermediate calculations

**Question:** Calculate subtotal, tax and total without repeating expressions.

**Input**
```json
{"items":[{"price":100,"qty":2},{"price":50,"qty":1}],"taxRate":0.18}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
do {
  var subtotal = sum(payload.items map ($.price * $.qty))
  var tax = subtotal * payload.taxRate
  ---
  {subtotal: subtotal, tax: tax, total: subtotal + tax}
}
```

**Expected Output**
```json
{"subtotal":250,"tax":45,"total":295}
```

**Key point:** `do` keeps intermediate variables scoped to one transformation expression.

---

## A22 — Return a safe result from a risky conversion

**Question:** Attempt to convert a value to Number and return `null` when conversion fails.

**Input**
```json
{"value":"abc"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{number: (try(() -> payload.value as Number)).result}
```

**Expected Output**
```json
{"number":null}
```

**Key point:** Error-safe expressions are useful when malformed external input is expected and should be handled deliberately.

---

## A23 — Join parent and child data

**Question:** Add the customer name to each order using a customer lookup.

**Input**
```json
{
  "customers":[{"id":1,"name":"Ravi"},{"id":2,"name":"Priya"}],
  "orders":[{"id":"O1","customerId":2,"amount":500}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var customers = payload.customers groupBy $.id
---
payload.orders map ((o) ->
  o ++ {customerName: ((customers[o.customerId] default [])[0].name default null)})
```

**Expected Output**
```json
[
  {"id":"O1","customerId":2,"amount":500,"customerName":"Priya"}
]
```

**Key point:** Pre-building a lookup is a common integration pattern for enriching records.

---

## A24 — Produce a compact audit record

**Question:** Build an audit object without copying sensitive payload content.

**Input**
```json
{"requestId":"REQ-1001","customer":"C1","password":"secret","status":"SUCCESS"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  requestId: payload.requestId,
  customer: payload.customer,
  status: payload.status
}
```

**Expected Output**
```json
{"requestId":"REQ-1001","customer":"C1","status":"SUCCESS"}
```

**Key point:** Transformation logs and audit records should contain only the fields actually required for traceability.

---

## A25 — Create a canonical event envelope

**Question:** Wrap a business event in a standard envelope containing event type, version, ID and data.

**Input**
```json
{"orderId":"O100","amount":2500}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  eventType: "OrderCreated",
  version: 1,
  eventId: "EVT-O100",
  data: payload
}
```

**Expected Output**
```json
{
  "eventType":"OrderCreated",
  "version":1,
  "eventId":"EVT-O100",
  "data":{"orderId":"O100","amount":2500}
}
```

**Key point:** Canonical envelopes make event contracts easier to version and route.

---

## Coverage added

These examples specifically add practice for dynamic object construction, conditional fields, dataset comparison, change detection, aggregation, optional selectors, indexed object creation, reconciliation, regex normalization, validation, XML namespaces, typed CSV, API errors, `match`, `update`, dates, numeric precision, reusable functions, `do`, error-safe expressions, enrichment, audit-safe output and canonical events.

They are intentionally kept in a new file so existing repository content remains unchanged.
