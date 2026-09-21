# Normal DataWeave Questions & Answers — Additional Set 041-060

These are additional practical Q&A items. I checked repository search results for the functions/topics before adding them and used new scenarios and answer expressions rather than copying the existing question/answer pairs.

## DW-N41 — Convert a negative transaction amount to its absolute value

**Question:** A transaction feed stores a reversal as a negative amount. Return its positive magnitude.

**Input**
```json
{"transactionId":"T100","amount":-450}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  transactionId: payload.transactionId,
  magnitude: abs(payload.amount)
}
```

**Output**
```json
{"transactionId":"T100","magnitude":450}
```

**Explanation:** `abs` returns the absolute value of a number. citeturn0search9

---

## DW-N42 — Round a product rating

**Question:** Round a product rating to the nearest whole number.

**Input**
```json
{"product":"Phone","rating":4.6}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  product: payload.product,
  rating: round(payload.rating)
}
```

**Output**
```json
{"product":"Phone","rating":5}
```

**Explanation:** The number function rounds the decimal rating to a whole number.

---

## DW-N43 — Round a price upward

**Question:** Round a calculated shipping price upward to the next whole number.

**Input**
```json
{"shipping":125.25}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
ceil(payload.shipping)
```

**Output**
```json
126
```

**Explanation:** `ceil` rounds a number up to the nearest whole number. citeturn0search9

---

## DW-N44 — Round a quantity downward

**Question:** A calculation produces 8.9 units. Return the whole-number quantity without rounding upward.

**Input**
```json
{"calculatedQuantity":8.9}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
floor(payload.calculatedQuantity)
```

**Output**
```json
8
```

**Explanation:** `floor` returns the lower whole-number value.

---

## DW-N45 — Calculate the average score

**Question:** Calculate the average of three customer survey scores.

**Input**
```json
{"scores":[4,5,3]}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  averageScore: avg(payload.scores)
}
```

**Output**
```json
{"averageScore":4}
```

**Explanation:** `avg` calculates the average of numeric values. citeturn0search9

---

## DW-N46 — Find the highest order amount

**Question:** Return the highest amount from a list of orders.

**Input**
```json
[
  {"id":"O1","amount":250},
  {"id":"O2","amount":900},
  {"id":"O3","amount":450}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
max(payload.amount)
```

**Output**
```json
900
```

**Explanation:** The selector extracts the amounts and `max` returns the largest value.

---

## DW-N47 — Find the lowest order amount

**Question:** Return the lowest amount from a list of orders.

**Input**
```json
[
  {"id":"O1","amount":250},
  {"id":"O2","amount":900},
  {"id":"O3","amount":450}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
min(payload.amount)
```

**Output**
```json
250
```

**Explanation:** `min` returns the smallest numeric value.

---

## DW-N48 — Remove duplicate product categories

**Question:** Return each product category only once.

**Input**
```json
["Books","Electronics","Books","Clothing","Electronics"]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy $
```

**Output**
```json
["Books","Electronics","Clothing"]
```

**Explanation:** `distinctBy` returns unique elements according to the supplied uniqueness criterion. citeturn0search0

---

## DW-N49 — Group employees by department

**Question:** Group employee records by their department.

**Input**
```json
[
  {"name":"Ravi","department":"IT"},
  {"name":"Asha","department":"HR"},
  {"name":"Kiran","department":"IT"}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.department
```

**Output**
```json
{
  "IT":[
    {"name":"Ravi","department":"IT"},
    {"name":"Kiran","department":"IT"}
  ],
  "HR":[
    {"name":"Asha","department":"HR"}
  ]
}
```

**Explanation:** `groupBy` creates an object whose keys are the grouping values. citeturn0search2

---

## DW-N50 — Sort products by price

**Question:** Sort products from the lowest price to the highest price.

**Input**
```json
[
  {"name":"Tablet","price":500},
  {"name":"Mouse","price":50},
  {"name":"Monitor","price":300}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $.price
```

**Output**
```json
[
  {"name":"Mouse","price":50},
  {"name":"Monitor","price":300},
  {"name":"Tablet","price":500}
]
```

**Explanation:** `orderBy` orders array elements using the supplied expression.

---

## DW-N51 — Add an index to every item

**Question:** Add a zero-based position to every product.

**Input**
```json
["Laptop","Mouse","Keyboard"]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map (item, index) -> {
  position: index,
  product: item
}
```

**Output**
```json
[
  {"position":0,"product":"Laptop"},
  {"position":1,"product":"Mouse"},
  {"position":2,"product":"Keyboard"}
]
```

**Explanation:** `map` can use both the current item and its index. citeturn0search4

---

## DW-N52 — Convert object values to uppercase

**Question:** Convert every string value in a customer object to uppercase.

**Input**
```json
{"firstName":"ravi","city":"hyderabad"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> (key): upper(value))
```

**Output**
```json
{"firstName":"RAVI","city":"HYDERABAD"}
```

**Explanation:** `mapObject` transforms object entries rather than array elements.

---

## DW-N53 — Convert an object into key-value entries

**Question:** Convert configuration fields into an array of key-value objects.

**Input**
```json
{"host":"localhost","port":8081}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload)
```

**Output**
```json
[
  {"key":"host","value":"localhost"},
  {"key":"port","value":8081}
]
```

**Explanation:** `entriesOf` represents object key/value pairs as an array. citeturn0search9

---

## DW-N54 — Extract all object values

**Question:** Return only the values from a simple configuration object.

**Input**
```json
{"host":"localhost","port":8081,"protocol":"HTTP"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
valuesOf(payload)
```

**Output**
```json
["localhost",8081,"HTTP"]
```

**Explanation:** `valuesOf` extracts the values from an object.

---

## DW-N55 — Extract all object keys

**Question:** Return the field names from a customer object.

**Input**
```json
{"id":"C10","name":"Ravi","active":true}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
keysOf(payload)
```

**Output**
```json
["id","name","active"]
```

**Explanation:** `keysOf` returns the keys of the object.

---

## DW-N56 — Extract a nested list with pluck

**Question:** From a map of departments to employee counts, return only the counts.

**Input**
```json
{"IT":12,"HR":5,"Finance":8}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload pluck $
```

**Output**
```json
[12,5,8]
```

**Explanation:** `pluck` converts object values into an array.

---

## DW-N57 — Flatten nested product codes

**Question:** Convert an array of product-code arrays into one flat array.

**Input**
```json
[["P1","P2"],["P3"],["P4","P5"]]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload)
```

**Output**
```json
["P1","P2","P3","P4","P5"]
```

**Explanation:** `flatten` removes one level of nested arrays.

---

## DW-N58 — Create one record per order item

**Question:** Each order contains an array of items. Produce one output record for every item.

**Input**
```json
[
  {"orderId":"O1","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]},
  {"orderId":"O2","items":[{"sku":"C","qty":3}]}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap (order) ->
  order.items map (item) -> {
    orderId: order.orderId,
    sku: item.sku,
    quantity: item.qty
  }
```

**Output**
```json
[
  {"orderId":"O1","sku":"A","quantity":2},
  {"orderId":"O1","sku":"B","quantity":1},
  {"orderId":"O2","sku":"C","quantity":3}
]
```

**Explanation:** The nested mapping creates item records and `flatMap` combines the resulting arrays.

---

## DW-N59 — Check whether a product code exists

**Question:** Return true when a requested product code exists in the supplied product-code list.

**Input**
```json
{
  "codes":["P100","P200","P300"],
  "requested":"P200"
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.codes contains payload.requested
```

**Output**
```json
true
```

**Explanation:** `contains` checks whether a collection contains the requested value. citeturn0search9

---

## DW-N60 — Filter failed API responses

**Question:** From an API response list, return only requests that failed with a status of 500 or greater.

**Input**
```json
[
  {"requestId":"R1","status":200},
  {"requestId":"R2","status":500},
  {"requestId":"R3","status":404},
  {"requestId":"R4","status":503}
]
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.status >= 500
```

**Output**
```json
[
  {"requestId":"R2","status":500},
  {"requestId":"R4","status":503}
]
```

**Explanation:** `filter` keeps only elements for which the condition evaluates to true. citeturn0search1

---

## Duplicate-control note

The repository already contains many examples of common DataWeave functions. These 20 entries were added as new practical scenarios rather than copying existing question/answer text.
