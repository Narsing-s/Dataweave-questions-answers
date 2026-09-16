# Advanced — Production-Style DataWeave Problems

These problems focus on transformations commonly discussed in MuleSoft interviews and real integration work: nested payloads, normalization, conditional business rules, aggregation, and robust output design.

## DW-A001 — How do you calculate a customer's available balance after pending debits?

**Input**
```json
{
  "balance": 10000,
  "transactions": [
    {"type":"DEBIT","status":"POSTED","amount":1200},
    {"type":"DEBIT","status":"PENDING","amount":500},
    {"type":"CREDIT","status":"POSTED","amount":1000}
  ]
}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
var pendingDebits =
  (payload.transactions
    filter ($.type == "DEBIT" and $.status == "PENDING"))
    reduce ((item, total = 0) -> total + item.amount)
---
{
  balance: payload.balance,
  pendingDebit: pendingDebits,
  availableBalance: payload.balance - pendingDebits
}
```

**Expected output**
```json
{"balance":10000,"pendingDebit":500,"availableBalance":9500}
```

**Explanation**
The transformation first filters transactions to pending debits. `reduce` converts those transactions into one monetary total. The final object exposes both the calculated pending debit and the resulting available balance.

**Common mistakes**
- Including posted debits in the pending amount.
- Adding credits to the pending-debit total.
- Performing the aggregation before filtering by both type and status.

**Interview tip**
Break complicated business transformations into named variables. It improves readability and makes the logic easier to test.

---

## DW-A002 — How do you normalize a nested customer API response?

**Input**
```json
{
  "customer": {
    "customerId": "C1001",
    "profile": {"firstName":"Ravi","lastName":"Kumar"},
    "contact": {"email":"RAVI@EXAMPLE.COM","phone":"9876543210"}
  }
}
```

**DataWeave answer**
```dataweave
%dw 2.0
import lower from dw::core::Strings
output application/json
---
{
  id: payload.customer.customerId,
  name: payload.customer.profile.firstName ++ " " ++ payload.customer.profile.lastName,
  email: lower(payload.customer.contact.email),
  phone: payload.customer.contact.phone
}
```

**Expected output**
```json
{
  "id":"C1001",
  "name":"Ravi Kumar",
  "email":"ravi@example.com",
  "phone":"9876543210"
}
```

**Explanation**
The transformation navigates several nested levels, changes the target field names, combines first and last names, and normalizes the email address.

**Common mistakes**
- Reading the email from the wrong nesting level.
- Mixing source field names with target field names.
- Performing normalization after the output object has already been built.

**Interview tip**
Describe this as a canonical model transformation rather than a simple field copy.

---

## DW-A003 — How do you build a payment response with a conditional risk status?

**Input**
```json
{"paymentId":"P1001","amount":75000,"country":"IN","customerStatus":"ACTIVE"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  paymentId: payload.paymentId,
  amount: payload.amount,
  risk: if (payload.amount >= 50000 or payload.customerStatus != "ACTIVE") "REVIEW" else "NORMAL"
}
```

**Expected output**
```json
{"paymentId":"P1001","amount":75000,"risk":"REVIEW"}
```

**Explanation**
The payment is marked for review when either the amount reaches the threshold or the customer is not active. Otherwise it receives the normal status.

**Common mistakes**
- Using `and` where the business rule requires `or`.
- Reversing the threshold comparison.
- Mixing business status strings with Boolean expressions.

**Interview tip**
Translate the business rule into plain English before implementing it so that the Boolean logic can be reviewed independently.

---

## DW-A004 — How do you aggregate transaction amounts by currency?

**Input**
```json
[
  {"currency":"INR","amount":1000},
  {"currency":"USD","amount":50},
  {"currency":"INR","amount":2500},
  {"currency":"USD","amount":25}
]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload
  groupBy $.currency
  mapObject ((transactions, currency) ->
    (currency): transactions reduce ((item, total = 0) -> total + item.amount)
  )
```

**Expected output**
```json
{"INR":3500,"USD":75}
```

**Explanation**
The transactions are first grouped by currency. Each group is then reduced into a single amount. `mapObject` converts the grouped object into an object of currency totals.

**Common mistakes**
- Reducing the complete input before grouping.
- Returning arrays instead of totals from `mapObject`.
- Losing the original currency key.

**Interview tip**
This pattern demonstrates how `groupBy`, `mapObject`, and `reduce` can be composed for multi-stage aggregation.

---

## DW-A005 — How do you remove sensitive fields recursively from a known customer structure?

**Input**
```json
{
  "id":101,
  "name":"Ravi",
  "credentials":{"username":"ravi","password":"secret"},
  "contact":{"email":"ravi@example.com","phone":"9999999999"}
}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload - "credentials"
```

**Expected output**
```json
{
  "id":101,
  "name":"Ravi",
  "contact":{"email":"ravi@example.com","phone":"9999999999"}
}
```

**Explanation**
When the entire sensitive structure is not required by the consumer, removing the parent field is simpler and safer than reconstructing every remaining nested field.

**Common mistakes**
- Returning credentials because they were present in the source.
- Removing only `password` while accidentally exposing other authentication material.

**Interview tip**
Data transformation is also a security boundary. Only expose fields required by the target contract.

---

## DW-A006 — How do you create a response containing only successful API results?

**Input**
```json
[
  {"id":1,"status":"SUCCESS","data":{"value":10}},
  {"id":2,"status":"FAILED","data":null},
  {"id":3,"status":"SUCCESS","data":{"value":30}}
]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload
  filter ($.status == "SUCCESS")
  map {
    id: $.id,
    value: $.data.value
  }
```

**Expected output**
```json
[{"id":1,"value":10},{"id":3,"value":30}]
```

**Explanation**
The transformation first removes unsuccessful results. It then maps the successful records into a smaller consumer-facing structure.

**Common mistakes**
- Mapping before filtering and creating null values for failed records.
- Assuming every record has a populated `data` object.

**Interview tip**
Explain why filtering before dereferencing nested data can reduce unnecessary processing and avoid invalid field access.

---

## DW-A007 — How do you split a full name into first and last name when the source provides a single string?

**Input**
```json
{"fullName":"Ravi Kumar"}
```

**DataWeave answer**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
var parts = payload.fullName splitBy " "
---
{
  firstName: parts[0],
  lastName: parts[-1]
}
```

**Expected output**
```json
{"firstName":"Ravi","lastName":"Kumar"}
```

**Explanation**
The name is split into an array and the first and last positions are selected. For production data, additional handling may be needed for multiple spaces, mononyms, prefixes, and suffixes.

**Common mistakes**
- Assuming every person has exactly two name parts.
- Treating the last array position as a universally valid surname rule.

**Interview tip**
Call out assumptions explicitly. Production transformations must account for the actual source-data contract.

---

## DW-A008 — How do you create a reusable function for calculating tax?

**Input**
```json
{"amount":1000,"taxRate":18}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
fun tax(amount: Number, rate: Number) = amount * rate / 100
---
{
  amount: payload.amount,
  tax: tax(payload.amount, payload.taxRate),
  total: payload.amount + tax(payload.amount, payload.taxRate)
}
```

**Expected output**
```json
{"amount":1000,"tax":180,"total":1180}
```

**Explanation**
The named function encapsulates the tax calculation so the same rule can be reused without duplicating the formula.

**Common mistakes**
- Hard-coding the tax rate inside the function.
- Calling the function with values in the wrong order.

**Interview tip**
Reusable functions improve readability, consistency, and testability when a business rule appears in multiple transformations.

---

## DW-A009 — How do you map nested order lines into a flat shipment structure?

**Input**
```json
{
  "orderId":"O100",
  "shipTo":"Hyderabad",
  "lines":[
    {"sku":"A1","quantity":2},
    {"sku":"B2","quantity":3}
  ]
}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  destination: payload.shipTo,
  items: payload.lines map {
    productCode: $.sku,
    quantity: $.quantity
  }
}
```

**Expected output**
```json
{
  "orderId":"O100",
  "destination":"Hyderabad",
  "items":[
    {"productCode":"A1","quantity":2},
    {"productCode":"B2","quantity":3}
  ]
}
```

**Explanation**
The parent order fields are mapped directly while every line item is transformed into the shipment contract's item structure.

**Common mistakes**
- Losing the parent order ID while mapping lines.
- Returning the source line field names instead of the target contract names.

**Interview tip**
Nested `map` expressions are essential for transforming hierarchical API payloads.

---

## DW-A010 — How do you classify a transaction into business bands?

**Input**
```json
{"amount":12500}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  amount: payload.amount,
  band:
    if (payload.amount < 1000) "LOW"
    else if (payload.amount < 10000) "MEDIUM"
    else "HIGH"
}
```

**Expected output**
```json
{"amount":12500,"band":"HIGH"}
```

**Explanation**
The conditions are evaluated from smallest threshold to largest. The first matching branch is selected.

**Common mistakes**
- Creating overlapping conditions with unintended precedence.
- Forgetting a final catch-all branch.

**Interview tip**
For many branches, consider `match` or a reusable lookup structure to keep business rules readable.

---

## DW-A011 — How do you create a normalized API response with metadata?

**Input**
```json
{"customers":[{"id":1,"name":"Ravi"},{"id":2,"name":"Anil"}],"requestId":"REQ-100"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  metadata: {
    requestId: payload.requestId,
    count: sizeOf(payload.customers)
  },
  data: payload.customers map {
    id: $.id,
    name: $.name
  }
}
```

**Expected output**
```json
{
  "metadata":{"requestId":"REQ-100","count":2},
  "data":[{"id":1,"name":"Ravi"},{"id":2,"name":"Anil"}]
}
```

**Explanation**
The response separates metadata from business data. The count is calculated from the source collection while each customer is mapped into the target model.

**Common mistakes**
- Counting the wrong collection.
- Mixing metadata fields into every data item.

**Interview tip**
This is a common API response pattern for pagination, correlation, auditing, and client-side processing.

---

## DW-A012 — How do you safely select an optional nested field with a default?

**Input**
```json
{"customer":{"name":"Ravi"}}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.customer.name,
  city: payload.customer.city default "Unknown"
}
```

**Expected output**
```json
{"name":"Ravi","city":"Unknown"}
```

**Explanation**
The name is mandatory in this example, while city is optional. The default expression supplies a predictable value when city is absent or null.

**Common mistakes**
- Applying the default to the entire customer object instead of the optional field.
- Assuming a missing intermediate parent object can always be dereferenced safely.

**Interview tip**
Distinguish between an optional leaf field and an optional parent structure; the latter may require additional conditional handling.

---

## DW-A013 — How do you calculate the highest transaction amount?

**Input**
```json
[{"id":1,"amount":100},{"id":2,"amount":900},{"id":3,"amount":450}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
max(payload map $.amount)
```

**Expected output**
```json
900
```

**Explanation**
The transaction objects are first converted into an array of amounts. `max` then returns the greatest numeric value.

**Common mistakes**
- Passing the objects directly when the desired comparison is on `amount`.
- Ignoring the empty-array case in a production contract.

**Interview tip**
Separate extraction from aggregation so each step has one clear responsibility.

---

## DW-A014 — How do you find whether any transaction exceeds a threshold?

**Input**
```json
[{"amount":500},{"amount":1200},{"amount":800}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
contains(payload map $.amount, 1200)
```

**Expected output**
```json
true
```

**Explanation**
The amounts are extracted from the transaction objects and then checked for the requested value. For a general threshold rule, a predicate-based function such as `some` can be used.

**Common mistakes**
- Confusing exact-value membership with a greater-than threshold test.
- Forgetting that `contains` checks for a specific value.

**Interview tip**
Read the requirement literally: “contains 1200” and “contains an amount greater than 1200” are different business rules.

---

## DW-A015 — How do you convert an object into a query-string-style parameter map?

**Input**
```json
{"page":2,"limit":50,"status":"ACTIVE"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/x-www-form-urlencoded
---
payload
```

**Expected output**
```text
page=2&limit=50&status=ACTIVE
```

**Explanation**
The output MIME type tells DataWeave to serialize the object as form URL-encoded data, a format frequently used by HTTP integrations.

**Common mistakes**
- Manually concatenating parameters and forgetting URL encoding rules.
- Using JSON output when the receiving system expects form URL encoding.

**Interview tip**
Know how output MIME types influence serialization; the same source structure can be represented differently for different downstream systems.
