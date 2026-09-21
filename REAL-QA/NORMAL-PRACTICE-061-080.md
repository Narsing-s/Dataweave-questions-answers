# Normal DataWeave Practice Q&A — DW-N61 to DW-N80

These are practical, beginner-friendly DataWeave exercises. They were added after checking the repository for existing coverage so the question/answer scenarios are not duplicates.

## DW-N61 — Build a display label from an ID and name

**Question:** Given a customer object, create a label such as `C101 - Ravi`.

**Input**
```json
{
  "customerId": "C101",
  "name": "Ravi"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.customerId ++ " - " ++ payload.name
```

**Answer**
```text
C101 - Ravi
```

---

## DW-N62 — Add a fixed country code to a phone number

**Question:** Add the country code `+91` to a 10-digit phone number.

**Input**
```json
{
  "mobile": "9876543210"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  mobile: "+91" ++ payload.mobile
}
```

**Answer**
```json
{
  "mobile": "+919876543210"
}
```

---

## DW-N63 — Create a simple customer initials field

**Question:** Create initials from the first character of firstName and lastName.

**Input**
```json
{
  "firstName": "Narsing",
  "lastName": "Beesetti"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  initials: upper(payload.firstName[0 to 0] ++ payload.lastName[0 to 0])
}
```

**Answer**
```json
{
  "initials": "NB"
}
```

---

## DW-N64 — Create a login username

**Question:** Build a username by converting a customer's name to lowercase and replacing spaces with underscores.

**Input**
```json
{
  "name": "Ravi Kumar"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  username: lower(payload.name) replace " " with "_"
}
```

**Answer**
```json
{
  "username": "ravi_kumar"
}
```

---

## DW-N65 — Return only product names from an order

**Question:** Given an order containing product objects, return an array containing only their names.

**Input**
```json
{
  "items": [
    {"name": "Keyboard", "qty": 2},
    {"name": "Mouse", "qty": 1}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.items.name
```

**Answer**
```json
[
  "Keyboard",
  "Mouse"
]
```

---

## DW-N66 — Create a quantity summary string

**Question:** Convert an array of quantities into one comma-separated string.

**Input**
```json
{
  "quantities": [2, 5, 1]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  summary: (payload.quantities map ($ as String)) joinBy ", "
}
```

**Answer**
```json
{
  "summary": "2, 5, 1"
}
```

---

## DW-N67 — Add a stock warning field

**Question:** Add `warning: true` when stock is below 5.

**Input**
```json
{
  "product": "Keyboard",
  "stock": 3
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload ++ {
  warning: payload.stock < 5
}
```

**Answer**
```json
{
  "product": "Keyboard",
  "stock": 3,
  "warning": true
}
```

---

## DW-N68 — Create a payment description

**Question:** Build a payment description using transaction ID and amount.

**Input**
```json
{
  "transactionId": "TX9001",
  "amount": 1250
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  description: "Transaction " ++ payload.transactionId ++
    " received amount " ++ (payload.amount as String)
}
```

**Answer**
```json
{
  "description": "Transaction TX9001 received amount 1250"
}
```

---

## DW-N69 — Convert a status into a readable message

**Question:** Return `"Payment completed"` when status is `COMPLETED`, otherwise return `"Payment pending"`.

**Input**
```json
{
  "status": "COMPLETED"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
if (payload.status == "COMPLETED")
  "Payment completed"
else
  "Payment pending"
```

**Answer**
```text
Payment completed
```

---

## DW-N70 — Count orders belonging to one customer

**Question:** Count how many orders in the array belong to customer `C101`.

**Input**
```json
{
  "orders": [
    {"customerId": "C101"},
    {"customerId": "C102"},
    {"customerId": "C101"}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
sizeOf(payload.orders filter ($.customerId == "C101"))
```

**Answer**
```text
2
```

---

## DW-N71 — Get the first three products

**Question:** Return only the first three elements from a product array.

**Input**
```json
{
  "products": ["A", "B", "C", "D", "E"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.products[0 to 2]
```

**Answer**
```json
[
  "A",
  "B",
  "C"
]
```

---

## DW-N72 — Create a numbered product list

**Question:** Add a sequential number to each product.

**Input**
```json
{
  "products": ["Keyboard", "Mouse", "Monitor"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.products map ((item, index) -> {
  number: index + 1,
  product: item
})
```

**Answer**
```json
[
  {"number": 1, "product": "Keyboard"},
  {"number": 2, "product": "Mouse"},
  {"number": 3, "product": "Monitor"}
]
```

---

## DW-N73 — Add a default customer city

**Question:** If the city is null, return `"Unknown"`.

**Input**
```json
{
  "name": "Ravi",
  "city": null
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  city: payload.city default "Unknown"
}
```

**Answer**
```json
{
  "name": "Ravi",
  "city": "Unknown"
}
```

---

## DW-N74 — Create an API response wrapper

**Question:** Wrap an account object inside a standard response containing success and data.

**Input**
```json
{
  "accountNumber": "AC1001",
  "balance": 5000
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  success: true,
  data: payload
}
```

**Answer**
```json
{
  "success": true,
  "data": {
    "accountNumber": "AC1001",
    "balance": 5000
  }
}
```

---

## DW-N75 — Extract a nested customer email

**Question:** Extract the email from a nested customer object.

**Input**
```json
{
  "customer": {
    "contact": {
      "email": "ravi@example.com"
    }
  }
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.customer.contact.email
```

**Answer**
```text
ravi@example.com
```

---

## DW-N76 — Convert a date string to another format

**Question:** Convert `2026-09-21` into `21/09/2026`.

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
"2026-09-21" as Date as String {format: "dd/MM/uuuu"}
```

**Answer**
```text
21/09/2026
```

DataWeave supports explicit date parsing and formatting with `as Date` and a String `format` property. citeturn0search3turn0search0

---

## DW-N77 — Validate an order code with a regular expression

**Question:** Return true only when an order code follows the pattern `ORD-` followed by exactly four digits.

**Input**
```json
{
  "orderCode": "ORD-1234"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.orderCode matches /^ORD-[0-9]{4}$/
```

**Answer**
```text
true
```

DataWeave supports regular expressions with operations such as `matches`. citeturn0search1

---

## DW-N78 — Show the type of a value

**Question:** Return the runtime DataWeave type of an input value.

**Input**
```json
{
  "amount": 1250
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
typeOf(payload.amount)
```

**Answer**
```text
Number
```

DataWeave's `typeOf` can report the type of a value, such as `Number` or `String`. citeturn0search10

---

## DW-N79 — Create a Date value from separate fields

**Question:** Build a DataWeave Date from year, month, and day values.

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Dates
output application/json
---
date({
  year: 2026,
  month: 9,
  day: 21
})
```

**Answer**
```text
2026-09-21
```

DataWeave provides a `date` constructor that creates a Date from year, month, and day fields. citeturn0search2

---

## DW-N80 — Serialize an object as JSON text

**Question:** Convert a DataWeave object into a JSON string rather than returning the object directly.

**Input**
```json
{
  "id": 101,
  "status": "ACTIVE"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
write(payload, "application/json")
```

**Answer**
```text
{"id":101,"status":"ACTIVE"}
```

The `write` function serializes a value into a supported format such as JSON. citeturn0search4
