# Normal DataWeave Questions & Answers

This file contains straightforward, practical DataWeave exercises for beginners who want normal day-to-day transformation practice.

## DW-N01 — Calculate a discounted price

**Difficulty:** Easy  
**Topic:** Arithmetic / object transformation

**Question:** Apply a 10% discount to a product price.

**Input**
```json
{"product":"Laptop","price":1000}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  product: payload.product,
  originalPrice: payload.price,
  discountedPrice: payload.price * 0.90
}
```

**Output**
```json
{"product":"Laptop","originalPrice":1000,"discountedPrice":900}
```

**Explanation:** Multiplying the price by `0.90` keeps 90% of the original amount.

---

## DW-N02 — Calculate a total order amount

**Difficulty:** Easy  
**Topic:** Arithmetic / array values

**Question:** Add the quantity and unit price of each line item to calculate its total.

**Input**
```json
[
  {"item":"Pen","quantity":2,"unitPrice":10},
  {"item":"Book","quantity":3,"unitPrice":50}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {
  item: $.item,
  total: $.quantity * $.unitPrice
}
```

**Output**
```json
[
  {"item":"Pen","total":20},
  {"item":"Book","total":150}
]
```

**Explanation:** Each array element is transformed independently.

---

## DW-N03 — Create an employee display name

**Difficulty:** Easy  
**Topic:** String concatenation

**Question:** Combine first and last names into one display name.

**Input**
```json
{"firstName":"Ravi","lastName":"Kumar"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.firstName ++ " " ++ payload.lastName
```

**Output**
```json
"Ravi Kumar"
```

**Explanation:** `++` concatenates the two strings with a space between them.

---

## DW-N04 — Build an API status response

**Difficulty:** Easy  
**Topic:** Object construction

**Question:** Return a simple API response containing status and message.

**Input**
```json
{"operation":"create","success":true}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  status: if (payload.success) "SUCCESS" else "FAILED",
  message: "Operation " ++ payload.operation ++ " completed"
}
```

**Output**
```json
{
  "status":"SUCCESS",
  "message":"Operation create completed"
}
```

**Explanation:** The target object is built directly from input values and a conditional expression.

---

## DW-N05 — Add a full name to every customer

**Difficulty:** Easy  
**Topic:** Array transformation / calculated field

**Question:** Keep each customer record and add a `fullName` field.

**Input**
```json
[
  {"firstName":"Anu","lastName":"Rao","city":"Hyderabad"},
  {"firstName":"Kiran","lastName":"Das","city":"Vijayawada"}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ($ ++ {
  fullName: $.firstName ++ " " ++ $.lastName
})
```

**Output**
```json
[
  {"firstName":"Anu","lastName":"Rao","city":"Hyderabad","fullName":"Anu Rao"},
  {"firstName":"Kiran","lastName":"Das","city":"Vijayawada","fullName":"Kiran Das"}
]
```

**Explanation:** `++` merges the original object with the newly calculated field.

---

## DW-N06 — Select customers from one city

**Difficulty:** Easy  
**Topic:** filter / comparison

**Question:** Return only customers from Hyderabad.

**Input**
```json
[
  {"name":"Ravi","city":"Hyderabad"},
  {"name":"Asha","city":"Chennai"},
  {"name":"Kiran","city":"Hyderabad"}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.city == "Hyderabad"
```

**Output**
```json
[
  {"name":"Ravi","city":"Hyderabad"},
  {"name":"Kiran","city":"Hyderabad"}
]
```

**Explanation:** `filter` keeps records whose city matches the requested value.

---

## DW-N07 — Return only order IDs

**Difficulty:** Easy  
**Topic:** map / field selection

**Question:** Extract the order ID from every order.

**Input**
```json
[
  {"orderId":"O100","amount":500},
  {"orderId":"O101","amount":750},
  {"orderId":"O102","amount":250}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map $.orderId
```

**Output**
```json
["O100","O101","O102"]
```

**Explanation:** The mapping expression selects one field from each array element.

---

## DW-N08 — Add a shipping charge

**Difficulty:** Easy  
**Topic:** Conditional arithmetic

**Question:** Add a shipping charge of 50 when the order amount is below 500; otherwise use zero.

**Input**
```json
[
  {"orderId":"O1","amount":300},
  {"orderId":"O2","amount":800}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {
  orderId: $.orderId,
  amount: $.amount,
  shipping: if ($.amount < 500) 50 else 0,
  finalAmount: $.amount + (if ($.amount < 500) 50 else 0)
}
```

**Output**
```json
[
  {"orderId":"O1","amount":300,"shipping":50,"finalAmount":350},
  {"orderId":"O2","amount":800,"shipping":0,"finalAmount":800}
]
```

**Explanation:** The conditional expression returns a numeric shipping value that can be used in arithmetic.

---

## DW-N09 — Create a compact customer response

**Difficulty:** Easy  
**Topic:** API response mapping

**Question:** Transform a customer record into an API response containing only ID, name, and email.

**Input**
```json
{
  "customerId":"C101",
  "name":"Meena",
  "email":"meena@example.com",
  "internalNote":"VIP"
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.customerId,
  name: payload.name,
  email: payload.email
}
```

**Output**
```json
{
  "id":"C101",
  "name":"Meena",
  "email":"meena@example.com"
}
```

**Explanation:** Explicit object construction prevents internal fields from being exposed.

---

## DW-N10 — Convert a list of products into a price lookup

**Difficulty:** Easy  
**Topic:** Object construction / dynamic keys

**Question:** Create an object whose keys are product codes and whose values are prices.

**Input**
```json
[
  {"code":"P100","price":25},
  {"code":"P200","price":40}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, result = {}) ->
  result ++ {
    (item.code): item.price
  }
)
```

**Output**
```json
{
  "P100":25,
  "P200":40
}
```

**Explanation:** `reduce` builds one object while each product contributes a dynamic key.

---

## DW-N11 — Calculate the invoice total

**Difficulty:** Easy  
**Topic:** reduce / aggregation

**Question:** Calculate the total amount of all invoice lines.

**Input**
```json
[
  {"description":"Service","amount":120},
  {"description":"Support","amount":80},
  {"description":"License","amount":300}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, total = 0) -> total + item.amount)
```

**Output**
```json
500
```

**Explanation:** `reduce` carries the running total from one item to the next.

---

## DW-N12 — Create an HTTP-friendly success object

**Difficulty:** Easy  
**Topic:** Conditional response

**Question:** Return a different message based on an operation result.

**Input**
```json
{"created":false}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  success: payload.created,
  message: if (payload.created) "Customer created successfully" else "Customer was not created"
}
```

**Output**
```json
{
  "success":false,
  "message":"Customer was not created"
}
```

**Explanation:** A Boolean input can directly populate the response while `if/else` supplies the corresponding message.

---

## DW-N13 — Extract nested account numbers

**Difficulty:** Easy  
**Topic:** Nested selectors

**Question:** Return the account number from every customer account record.

**Input**
```json
{
  "customers":[
    {"name":"Ravi","account":{"number":"10001"}},
    {"name":"Asha","account":{"number":"10002"}}
  ]
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customers.account.number
```

**Output**
```json
["10001","10002"]
```

**Explanation:** DataWeave selectors can traverse nested arrays and objects without an explicit loop.

---

## DW-N14 — Keep orders above a minimum amount

**Difficulty:** Easy  
**Topic:** filter / numeric comparison

**Question:** Return orders whose amount is greater than 1000.

**Input**
```json
[
  {"id":"O1","amount":900},
  {"id":"O2","amount":1200},
  {"id":"O3","amount":1500}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.amount > 1000
```

**Output**
```json
[
  {"id":"O2","amount":1200},
  {"id":"O3","amount":1500}
]
```

**Explanation:** The predicate keeps only records satisfying the numeric comparison.

---

## DW-N15 — Add a constant API version

**Difficulty:** Easy  
**Topic:** Object enrichment

**Question:** Add an `apiVersion` field with value `v1` to every response record.

**Input**
```json
[
  {"id":1,"name":"A"},
  {"id":2,"name":"B"}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ($ ++ { apiVersion: "v1" })
```

**Output**
```json
[
  {"id":1,"name":"A","apiVersion":"v1"},
  {"id":2,"name":"B","apiVersion":"v1"}
]
```

**Explanation:** Each object is enriched with the same constant field.

---

## DW-N16 — Build a simple employee summary

**Difficulty:** Easy  
**Topic:** Object mapping

**Question:** Return an employee's name and annual salary when the input contains monthly salary.

**Input**
```json
{"name":"Suresh","monthlySalary":50000}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  annualSalary: payload.monthlySalary * 12
}
```

**Output**
```json
{"name":"Suresh","annualSalary":600000}
```

**Explanation:** The transformation calculates a derived field from the monthly salary.

---

## DW-N17 — Create a Boolean eligibility flag

**Difficulty:** Easy  
**Topic:** Boolean expression

**Question:** Mark a customer as eligible when the customer's age is at least 18 and the account is active.

**Input**
```json
{"name":"Ravi","age":25,"active":true}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  eligible: payload.age >= 18 and payload.active
}
```

**Output**
```json
{"name":"Ravi","eligible":true}
```

**Explanation:** Both Boolean conditions must be true because the `and` operator is used.

---

## DW-N18 — Select a preferred email

**Difficulty:** Easy  
**Topic:** default / fallback

**Question:** Use the work email when present; otherwise use the personal email.

**Input**
```json
{"workEmail":null,"personalEmail":"ravi@example.com"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  email: payload.workEmail default payload.personalEmail
}
```

**Output**
```json
{"email":"ravi@example.com"}
```

**Explanation:** `default` supplies the personal email when the preferred value is null or absent.

---

## DW-N19 — Return a success flag from a status

**Difficulty:** Easy  
**Topic:** Boolean comparison

**Question:** Return `true` when an order status is `COMPLETED`.

**Input**
```json
{"orderId":"O500","status":"COMPLETED"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.status == "COMPLETED"
```

**Output**
```json
true
```

**Explanation:** The equality operator returns a Boolean result.

---

## DW-N20 — Create a reusable customer response

**Difficulty:** Easy  
**Topic:** Function / object mapping

**Question:** Define a function that creates a small customer response from a customer object.

**Input**
```json
{"id":"C10","name":"Priya","email":"priya@example.com","phone":"9999999999"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
fun customerResponse(customer) = {
  id: customer.id,
  name: customer.name,
  email: customer.email
}
---
customerResponse(payload)
```

**Output**
```json
{
  "id":"C10",
  "name":"Priya",
  "email":"priya@example.com"
}
```

**Explanation:** The function keeps the mapping reusable and prevents the phone field from being included in the response.

---

## Coverage

These examples focus on normal day-to-day DataWeave practice: arithmetic, object mapping, selectors, arrays, filtering, conditionals, defaults, Boolean expressions, aggregation, dynamic keys, and reusable functions.
