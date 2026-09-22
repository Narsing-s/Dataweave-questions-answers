# Easy DataWeave Q&A — DW-E226 to DW-E233

These questions fill genuine Easy-level gaps found during a repository-wide review. Existing Easy questions for basic dates, null/defaults, nested selectors, map, and filter were not copied or reworded. The additions use distinct beginner scenarios for DateTime, date formatting, nested transformations, nested defaults, mapObject, and filterObject.

---

## DW-E226 — Parse a DateTime string

**Difficulty:** Easy  
**Topic:** DateTime parsing

**Question:** Convert the ISO-8601 DateTime string into a DataWeave DateTime value.

**Input**
```json
{"createdAt":"2026-09-16T10:30:00Z"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{createdAt: payload.createdAt as DateTime}
```

**Expected Output**
```json
{"createdAt":"2026-09-16T10:30:00Z"}
```

**Explanation:** The as DateTime coercion converts the string into a DateTime value containing date, time, and timezone information.

**Common Mistake:** Treating a DateTime value as an ordinary string when date/time operations are required.

**Interview Tip:** Know the difference between Date, Time, LocalDateTime, and DateTime.

---

## DW-E227 — Format a Date value

**Difficulty:** Easy  
**Topic:** Date formatting

**Question:** Convert a Date string from yyyy-MM-dd into dd/MM/yyyy.

**Input**
```json
{"date":"2026-09-16"}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  formattedDate: (payload.date as Date {format: "yyyy-MM-dd"})
    as String {format: "dd/MM/yyyy"}
}
```

**Expected Output**
```json
{"formattedDate":"16/09/2026"}
```

**Explanation:** The first conversion parses the source format. The second formats the Date for the target output.

**Common Mistake:** Using the target format while parsing the input.

**Interview Tip:** Keep source parsing and target formatting as two separate steps.

---

## DW-E228 — Map values inside nested data

**Difficulty:** Easy  
**Topic:** Nested data transformation

**Question:** Return the names from customers stored inside a nested order object.

**Input**
```json
{
  "order": {
    "customers": [
      {"name":"Ravi","city":"Hyderabad"},
      {"name":"Anu","city":"Vijayawada"}
    ]
  }
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{customerNames: payload.order.customers map $.name}
```

**Expected Output**
```json
{"customerNames":["Ravi","Anu"]}
```

**Explanation:** The selector reaches the nested customers array, and map transforms each customer into its name.

**Common Mistake:** Applying map to payload.order instead of the customers array.

**Interview Tip:** Identify the data type at the selected path before choosing the collection function.

---

## DW-E229 — Apply a default inside nested data

**Difficulty:** Easy  
**Topic:** Nested data and defaults

**Question:** Return a customer's nested city, using UNKNOWN when the city is missing.

**Input**
```json
{"customer":{"name":"Ravi"}}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
{city: payload.customer.city default "UNKNOWN"}
```

**Expected Output**
```json
{"city":"UNKNOWN"}
```

**Explanation:** The nested selector looks for city under customer. Because city is absent, default supplies UNKNOWN.

**Common Mistake:** Applying the fallback to the whole customer object instead of the field that needs it.

**Interview Tip:** Put default on the expression whose value needs a fallback.

---

## DW-E230 — Transform object values with mapObject

**Difficulty:** Easy  
**Topic:** Object functions — mapObject

**Question:** Convert each score value from a Number to a String while keeping the original keys.

**Input**
```json
{"Ravi":90,"Anu":85}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {
  (key): value as String
})
```

**Expected Output**
```json
{"Ravi":"90","Anu":"85"}
```

**Explanation:** mapObject iterates over object key-value pairs and creates another object. The key is preserved while the value is converted.

**Common Mistake:** Using map, which is for array transformations.

**Interview Tip:** map transforms arrays; mapObject transforms object entries.

---

## DW-E231 — Filter object entries with filterObject

**Difficulty:** Easy  
**Topic:** Object functions — filterObject

**Question:** Keep only object entries whose value is at least 80.

**Input**
```json
{"Ravi":90,"Anu":75,"Kiran":85}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value) -> value >= 80)
```

**Expected Output**
```json
{"Ravi":90,"Kiran":85}
```

**Explanation:** filterObject evaluates each object value and retains the key-value pair when the condition is true.

**Common Mistake:** Using array filter directly on an object.

**Interview Tip:** Use filter for arrays and filterObject for objects.

---

## DW-E232 — Map nested objects into a new structure

**Difficulty:** Easy  
**Topic:** Nested data and map

**Question:** Transform nested product records into a simple list containing only id and name.

**Input**
```json
{
  "catalog": {
    "products": [
      {"id":101,"name":"Laptop","price":50000},
      {"id":102,"name":"Phone","price":25000}
    ]
  }
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.catalog.products map {
  id: $.id,
  name: $.name
}
```

**Expected Output**
```json
[
  {"id":101,"name":"Laptop"},
  {"id":102,"name":"Phone"}
]
```

**Explanation:** The transformation navigates to the nested products array, then map creates a new object for every product.

**Common Mistake:** Returning fields that are not part of the requested output contract.

**Interview Tip:** Separate nested navigation from transformation logic.

---

## DW-E233 — Filter nested records

**Difficulty:** Easy  
**Topic:** Nested data and filter

**Question:** Return only active customers from a nested customer array.

**Input**
```json
{
  "account": {
    "customers": [
      {"name":"Ravi","active":true},
      {"name":"Anu","active":false},
      {"name":"Kiran","active":true}
    ]
  }
}
```

**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.account.customers filter $.active
```

**Expected Output**
```json
[
  {"name":"Ravi","active":true},
  {"name":"Kiran","active":true}
]
```

**Explanation:** The selector reaches the nested customers array and filter keeps records whose active value is true.

**Common Mistake:** Using map and returning Boolean values instead of filtering the records.

**Interview Tip:** filter changes which array elements remain; map changes what each element becomes.