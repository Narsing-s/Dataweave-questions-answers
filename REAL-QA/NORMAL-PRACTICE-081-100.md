# Normal DataWeave Practice Q&A — DW-N81 to DW-N100

Additional practical exercises. These were checked against the repository's existing question coverage to avoid duplicate question/answer scenarios.

## DW-N81 — Check whether an invoice number is even

**Question:** Return `true` when the numeric invoice sequence is even.

**Input**
```json
{"invoiceSequence": 24}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
isEven(payload.invoiceSequence)
```

**Answer**
```text
true
```

---

## DW-N82 — Check whether a retry count is odd

**Question:** Determine whether a retry count is an odd number.

**Input**
```json
{"retryCount": 3}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
isOdd(payload.retryCount)
```

**Answer**
```text
true
```

---

## DW-N83 — Check whether a quantity is an integer

**Question:** Return whether the supplied product quantity has no decimal portion.

**Input**
```json
{"quantity": 12}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
isInteger(payload.quantity)
```

**Answer**
```text
true
```

---

## DW-N84 — Find the most expensive product

**Question:** Return the product object with the highest price.

**Input**
```json
{
  "products": [
    {"name": "Mouse", "price": 500},
    {"name": "Keyboard", "price": 1500},
    {"name": "Cable", "price": 300}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
maxBy(payload.products, $.price)
```

**Answer**
```json
{
  "name": "Keyboard",
  "price": 1500
}
```

---

## DW-N85 — Find the cheapest product

**Question:** Return the product object with the lowest price.

**Input**
```json
{
  "products": [
    {"name": "Mouse", "price": 500},
    {"name": "Keyboard", "price": 1500},
    {"name": "Cable", "price": 300}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
minBy(payload.products, $.price)
```

**Answer**
```json
{
  "name": "Cable",
  "price": 300
}
```

---

## DW-N86 — Return all field names from a customer object

**Question:** Get an array containing the names of all keys in a customer object.

**Input**
```json
{
  "id": 101,
  "name": "Ravi",
  "city": "Vizag"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
namesOf(payload)
```

**Answer**
```json
[
  "id",
  "name",
  "city"
]
```

---

## DW-N87 — Replace a null delivery date with a fallback

**Question:** If deliveryDate is null, return `"Not scheduled"`.

**Input**
```json
{
  "orderId": "ORD1001",
  "deliveryDate": null
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  deliveryDate: payload.deliveryDate onNull "Not scheduled"
}
```

**Answer**
```json
{
  "orderId": "ORD1001",
  "deliveryDate": "Not scheduled"
}
```

---

## DW-N88 — Calculate a square of an amount

**Question:** Calculate the square of a numeric value.

**Input**
```json
{"value": 12}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
pow(payload.value, 2)
```

**Answer**
```text
144
```

---

## DW-N89 — Create a readable shipment message with interpolation

**Question:** Build a message containing the shipment ID and carrier name.

**Input**
```json
{
  "shipmentId": "S1001",
  "carrier": "DHL"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
"Shipment $(payload.shipmentId) is handled by $(payload.carrier)"
```

**Answer**
```text
Shipment S1001 is handled by DHL
```

---

## DW-N90 — Keep only selected object fields

**Question:** From a customer object, keep only fields whose keys are `name` and `email`.

**Input**
```json
{
  "name": "Ravi",
  "email": "ravi@example.com",
  "age": 30,
  "city": "Vizag"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> key as String == "name" or key as String == "email")
```

**Answer**
```json
{
  "name": "Ravi",
  "email": "ravi@example.com"
}
```

---

## DW-N91 — Find the position of a product code

**Question:** Find the zero-based index of product code `P300`.

**Input**
```json
{
  "codes": ["P100", "P200", "P300", "P400"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
indexOf(payload.codes, "P300")
```

**Answer**
```text
2
```

---

## DW-N92 — Find the last occurrence of a status

**Question:** Find the last index at which `FAILED` occurs in a status array.

**Input**
```json
{
  "statuses": ["FAILED", "SUCCESS", "FAILED", "SUCCESS"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
lastIndexOf(payload.statuses, "FAILED")
```

**Answer**
```text
2
```

---

## DW-N93 — Calculate a discount using a percentage

**Question:** Calculate the discount amount when the price is 2000 and discount percentage is 10.

**Input**
```json
{
  "price": 2000,
  "discountPercent": 10
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.price * payload.discountPercent / 100
```

**Answer**
```text
200
```

---

## DW-N94 — Create a conditional field only for premium customers

**Question:** Add a `benefits` field only when the customer type is `PREMIUM`.

**Input**
```json
{
  "name": "Ravi",
  "type": "PREMIUM"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  type: payload.type,
  (benefits: ["Priority support", "Free delivery"]) if payload.type == "PREMIUM"
}
```

**Answer**
```json
{
  "name": "Ravi",
  "type": "PREMIUM",
  "benefits": [
    "Priority support",
    "Free delivery"
  ]
}
```

---

## DW-N95 — Convert an object into key-value pairs for display

**Question:** Convert a small customer object into an array of key-value objects.

**Input**
```json
{
  "name": "Ravi",
  "city": "Vizag"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {
  field: key as String,
  value: value
}) pluck $
```

**Answer**
```json
[
  {"field": "name", "value": "Ravi"},
  {"field": "city", "value": "Vizag"}
]
```

---

## DW-N96 — Add a sequence number to payment records

**Question:** Add a one-based sequence number to each payment record.

**Input**
```json
[
  {"transactionId": "T1", "amount": 100},
  {"transactionId": "T2", "amount": 200}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload map ((item, index) ->
  item ++ {sequence: index + 1}
)
```

**Answer**
```json
[
  {"transactionId": "T1", "amount": 100, "sequence": 1},
  {"transactionId": "T2", "amount": 200, "sequence": 2}
]
```

---

## DW-N97 — Create a reusable amount formatter

**Question:** Define a function that adds a currency symbol to an amount.

**Input**
```json
{"amount": 1500}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun formatAmount(amount) = "₹" ++ (amount as String)
---
{
  displayAmount: formatAmount(payload.amount)
}
```

**Answer**
```json
{
  "displayAmount": "₹1500"
}
```

DataWeave functions can be declared with the `fun` keyword and reused within the script. citeturn0search11

---

## DW-N98 — Group support tickets by priority

**Question:** Group support-ticket objects by their priority.

**Input**
```json
[
  {"id": "T1", "priority": "HIGH"},
  {"id": "T2", "priority": "LOW"},
  {"id": "T3", "priority": "HIGH"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload groupBy $.priority
```

**Answer**
```json
{
  "HIGH": [
    {"id": "T1", "priority": "HIGH"},
    {"id": "T3", "priority": "HIGH"}
  ],
  "LOW": [
    {"id": "T2", "priority": "LOW"}
  ]
}
```

DataWeave's `groupBy` creates an object whose keys represent the grouping criteria. citeturn0search4

---

## DW-N99 — Join customer tags into one display value

**Question:** Convert customer tags into one string separated by ` | `.

**Input**
```json
{
  "tags": ["VIP", "ONLINE", "ACTIVE"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.tags joinBy " | "
```

**Answer**
```text
VIP | ONLINE | ACTIVE
```

The `joinBy` function merges an array into a single string using the supplied separator. citeturn0search2

---

## DW-N100 — Return a simple typed customer summary

**Question:** Create a summary containing the customer's name and the DataWeave type of the age field.

**Input**
```json
{
  "name": "Ravi",
  "age": 30
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  ageType: typeOf(payload.age)
}
```

**Answer**
```json
{
  "name": "Ravi",
  "ageType": "Number"
}
```
