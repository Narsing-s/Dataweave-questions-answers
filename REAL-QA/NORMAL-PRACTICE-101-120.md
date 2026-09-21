# Normal DataWeave Practice Q&A — DW-N101 to DW-N120

Practical scenarios selected after repository searches to avoid repeating existing question/answer pairs.

## DW-N101 — Build a page summary

**Question:** Given page number and page size, calculate the first record number shown on the page.

**Input**
```json
{"page": 3, "pageSize": 20}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  firstRecord: ((payload.page - 1) * payload.pageSize) + 1
}
```

**Answer**
```json
{"firstRecord": 41}
```

---

## DW-N102 — Calculate the last record number on a page

**Question:** Given page number 3 and page size 20, calculate the last record number on that page.

**Input**
```json
{"page": 3, "pageSize": 20}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  lastRecord: payload.page * payload.pageSize
}
```

**Answer**
```json
{"lastRecord": 60}
```

---

## DW-N103 — Determine whether an account is overdrawn

**Question:** Return `true` when the account balance is below zero.

**Input**
```json
{"balance": -250}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  overdrawn: payload.balance < 0
}
```

**Answer**
```json
{"overdrawn": true}
```

---

## DW-N104 — Calculate remaining wallet balance

**Question:** Subtract the transaction amount from the wallet balance.

**Input**
```json
{"balance": 5000, "transaction": 750}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  remainingBalance: payload.balance - payload.transaction
}
```

**Answer**
```json
{"remainingBalance": 4250}
```

---

## DW-N105 — Create a low-balance notification

**Question:** Return a notification message only when the balance is below 1000.

**Input**
```json
{"balance": 750}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
if (payload.balance < 1000)
  "Low balance alert"
else
  "Balance is normal"
```

**Answer**
```text
Low balance alert
```

---

## DW-N106 — Calculate the percentage of completed tasks

**Question:** Calculate the completion percentage when 18 out of 24 tasks are completed.

**Input**
```json
{"completed": 18, "total": 24}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload.completed / payload.total) * 100
```

**Answer**
```text
75
```

---

## DW-N107 — Create a customer contact card

**Question:** Return a compact contact object containing name, email, and mobile.

**Input**
```json
{
  "name": "Ravi",
  "email": "ravi@example.com",
  "mobile": "9876543210",
  "address": "Vizag"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  name: payload.name,
  email: payload.email,
  mobile: payload.mobile
}
```

**Answer**
```json
{
  "name": "Ravi",
  "email": "ravi@example.com",
  "mobile": "9876543210"
}
```

---

## DW-N108 — Convert an employee record to an API-safe response

**Question:** Return only the employee ID, name, and department from a larger employee object.

**Input**
```json
{
  "employeeId": "E101",
  "name": "Anil",
  "department": "IT",
  "salary": 80000,
  "internalCode": "X91"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  employeeId: payload.employeeId,
  name: payload.name,
  department: payload.department
}
```

**Answer**
```json
{
  "employeeId": "E101",
  "name": "Anil",
  "department": "IT"
}
```

---

## DW-N109 — Add a Boolean flag for verified email

**Question:** Add `verified: true` when the emailVerified field is `Y`.

**Input**
```json
{"email": "ravi@example.com", "emailVerified": "Y"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  email: payload.email,
  verified: payload.emailVerified == "Y"
}
```

**Answer**
```json
{
  "email": "ravi@example.com",
  "verified": true
}
```

---

## DW-N110 — Select the preferred contact channel

**Question:** Return `"EMAIL"` when emailAvailable is true; otherwise return `"SMS"`.

**Input**
```json
{
  "emailAvailable": true
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
if (payload.emailAvailable) "EMAIL" else "SMS"
```

**Answer**
```text
EMAIL
```

---

## DW-N111 — Add a shipping region

**Question:** Add `region: "SOUTH"` when the state is Andhra Pradesh.

**Input**
```json
{
  "state": "Andhra Pradesh",
  "city": "Visakhapatnam"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload ++ {
  region: if (payload.state == "Andhra Pradesh") "SOUTH" else "OTHER"
}
```

**Answer**
```json
{
  "state": "Andhra Pradesh",
  "city": "Visakhapatnam",
  "region": "SOUTH"
}
```

---

## DW-N112 — Extract the second phone number

**Question:** Return the second phone number from a customer's phone array.

**Input**
```json
{
  "phones": ["9876543210", "9123456780", "9000000000"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.phones[1]
```

**Answer**
```text
9123456780
```

---

## DW-N113 — Get the first available address

**Question:** Return the first address from the customer's address list.

**Input**
```json
{
  "addresses": [
    {"type": "HOME", "city": "Vizag"},
    {"type": "WORK", "city": "Hyderabad"}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.addresses[0]
```

**Answer**
```json
{
  "type": "HOME",
  "city": "Vizag"
}
```

---

## DW-N114 — Calculate total quantity across order lines

**Question:** Add the quantities of all order lines.

**Input**
```json
{
  "items": [
    {"product": "A", "quantity": 2},
    {"product": "B", "quantity": 4},
    {"product": "C", "quantity": 3}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
sum(payload.items.quantity)
```

**Answer**
```text
9
```

---

## DW-N115 — Create a customer count response

**Question:** Return the number of customers in the supplied array.

**Input**
```json
{
  "customers": [
    {"id": "C1"},
    {"id": "C2"},
    {"id": "C3"},
    {"id": "C4"}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  customerCount: sizeOf(payload.customers)
}
```

**Answer**
```json
{"customerCount": 4}
```

---

## DW-N116 — Convert a numeric status code to text

**Question:** Convert an HTTP status number into a string.

**Input**
```json
{"statusCode": 200}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  statusCode: payload.statusCode as String
}
```

**Answer**
```json
{"statusCode": "200"}
```

---

## DW-N117 — Convert a numeric string to a number

**Question:** Convert the string `"4500.75"` into a numeric value.

**Input**
```json
{"amount": "4500.75"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  amount: payload.amount as Number
}
```

**Answer**
```json
{"amount": 4500.75}
```

---

## DW-N118 — Add one day to an order date

**Question:** Calculate the expected processing date as one day after the order date.

**Input**
```json
{
  "orderDate": "2026-09-21"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  processingDate: (payload.orderDate as Date) + |P1D|
}
```

**Answer**
```json
{
  "processingDate": "2026-09-22"
}
```

DataWeave supports adding Period values such as one day to Date values. citeturn0search7

---

## DW-N119 — Create a DateTime from order timestamp parts

**Question:** Build a DateTime for 21 September 2026 at 10:30:00 with a UTC timezone.

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Dates
output application/json
---
dateTime({
  year: 2026,
  month: 9,
  day: 21,
  hour: 10,
  minutes: 30,
  seconds: 0,
  timeZone: |Z|
})
```

**Answer**
```text
2026-09-21T10:30:00Z
```

DataWeave's `dateTime` constructor accepts year, month, day, time, and timezone components. citeturn0search1

---

## DW-N120 — Replace repeated separators in a reference code

**Question:** Replace every underscore in a reference code with a hyphen.

**Input**
```json
{
  "reference": "ORD_2026_001"
}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  reference: replaceAll(payload.reference, "_", "-")
}
```

**Answer**
```json
{
  "reference": "ORD-2026-001"
}
```

DataWeave's `replaceAll` replaces all occurrences of a literal target string. citeturn0search3
