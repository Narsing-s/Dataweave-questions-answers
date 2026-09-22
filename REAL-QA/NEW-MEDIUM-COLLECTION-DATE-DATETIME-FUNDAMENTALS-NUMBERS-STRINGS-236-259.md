# Medium DataWeave Q&A — DW-M236 to DW-M259

These questions add Medium-level practice across Array Collections, Dates, DateTime, DataWeave Fundamentals, Numbers, and Strings. Existing repository coverage was checked first; these use distinct scenarios rather than renaming or changing values in existing questions.

## Array Collections

### DW-M236 — Combine nested arrays with flatten
**Difficulty:** Medium  
**Topic:** Array Collections

**Question:** Convert an array of departments containing employee arrays into one employee array.

**Input**
~~~json
{"departments":[{"name":"IT","employees":["Ravi","Anu"]},{"name":"HR","employees":["Kiran"]}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.departments.employees flatten
~~~

**Expected Output**
~~~json
["Ravi","Anu","Kiran"]
~~~

**Explanation:** The selector produces an array of employee arrays. flatten removes one level of nesting.

**Common Mistake:** Using map alone and leaving the result as an array of arrays.

**Interview Tip:** Identify whether the requirement needs a nested result or one combined array.

---

### DW-M237 — Create one array from multiple collection fields
**Difficulty:** Medium  
**Topic:** Array Collections

**Question:** Combine the primary and secondary contact arrays into one array.

**Input**
~~~json
{"contacts":{"primary":["Ravi","Anu"],"secondary":["Kiran","Meena"]}}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.contacts.primary ++ payload.contacts.secondary
~~~

**Expected Output**
~~~json
["Ravi","Anu","Kiran","Meena"]
~~~

**Explanation:** The ++ operator concatenates the two arrays while preserving their order.

**Common Mistake:** Using flatten when the input is two separate arrays.

**Interview Tip:** Distinguish array concatenation from array flattening.

---

### DW-M238 — Remove duplicate values from a collection
**Difficulty:** Medium  
**Topic:** Array Collections

**Question:** Return unique product categories from an array.

**Input**
~~~json
{"categories":["Books","Electronics","Books","Clothing","Electronics"]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.categories distinctBy $
~~~

**Expected Output**
~~~json
["Books","Electronics","Clothing"]
~~~

**Explanation:** distinctBy keeps one occurrence for each value according to the supplied criteria.

**Common Mistake:** Building manual duplicate-tracking logic.

**Interview Tip:** distinctBy can also use an expression when uniqueness is based on a property.

---

### DW-M239 — Sort an array of objects by a field
**Difficulty:** Medium  
**Topic:** Array Collections

**Question:** Sort products from the lowest price to the highest price.

**Input**
~~~json
{"products":[{"name":"Phone","price":25000},{"name":"Laptop","price":60000},{"name":"Tablet","price":30000}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.products orderBy $.price
~~~

**Expected Output**
~~~json
[{"name":"Phone","price":25000},{"name":"Tablet","price":30000},{"name":"Laptop","price":60000}]
~~~

**Explanation:** orderBy reorders the array using the selected price value.

**Common Mistake:** Sorting the whole object instead of the field used for ordering.

**Interview Tip:** State clearly whether the requirement is ascending or descending.

---

## Dates

### DW-M240 — Add days to a Date
**Difficulty:** Medium  
**Topic:** Dates

**Question:** Calculate a delivery date seven days after the order date.

**Input**
~~~json
{"orderDate":"2026-09-16"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  orderDate: payload.orderDate as Date,
  deliveryDate: (payload.orderDate as Date) + |P7D|
}
~~~

**Expected Output**
~~~json
{"orderDate":"2026-09-16","deliveryDate":"2026-09-23"}
~~~

**Explanation:** The Date is converted from the input string and a seven-day Period is added.

**Common Mistake:** Treating a date as a plain string.

**Interview Tip:** Use Date and Period types for calendar calculations.

---

### DW-M241 — Calculate days between two dates
**Difficulty:** Medium  
**Topic:** Dates

**Question:** Return the number of days between a start date and an end date.

**Input**
~~~json
{"start":"2026-09-10","end":"2026-09-16"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{days: daysBetween(payload.start as Date, payload.end as Date)}
~~~

**Expected Output**
~~~json
{"days":6}
~~~

**Explanation:** Both strings are converted to Date values and daysBetween calculates their calendar-day difference.

**Common Mistake:** Subtracting the original strings.

**Interview Tip:** Define whether the business requirement means elapsed days or inclusive calendar dates.

---

### DW-M242 — Extract the month from a Date
**Difficulty:** Medium  
**Topic:** Dates

**Question:** Return the year and month from a transaction date.

**Input**
~~~json
{"transactionDate":"2026-09-16"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  year: (payload.transactionDate as Date).year,
  month: (payload.transactionDate as Date).month
}
~~~

**Expected Output**
~~~json
{"year":2026,"month":9}
~~~

**Explanation:** Date decomposition accesses individual parts of a Date value.

**Common Mistake:** Extracting characters from the original string.

**Interview Tip:** Prefer typed date decomposition for date calculations.

---

### DW-M243 — Create a Date from separate fields
**Difficulty:** Medium  
**Topic:** Dates

**Question:** Build a Date from separate year, month, and day fields.

**Input**
~~~json
{"year":2026,"month":9,"day":22}
~~~

**DataWeave**
~~~dw
%dw 2.0
import * from dw::core::Dates
output application/json
---
{
  date: date({
    year: payload.year,
    month: payload.month,
    day: payload.day
  })
}
~~~

**Expected Output**
~~~json
{"date":"2026-09-22"}
~~~

**Explanation:** The Dates module date function creates a typed Date from its component fields.

**Common Mistake:** Building the date only with string concatenation.

**Interview Tip:** Know both Date coercion and Date construction.

---

## DateTime

### DW-M244 — Extract the date from a DateTime
**Difficulty:** Medium  
**Topic:** DateTime

**Question:** Convert a DateTime value into its date-only component.

**Input**
~~~json
{"createdAt":"2026-09-16T10:30:00Z"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{createdDate: (payload.createdAt as DateTime) as Date}
~~~

**Expected Output**
~~~json
{"createdDate":"2026-09-16"}
~~~

**Explanation:** The input is parsed as DateTime and then coerced to Date.

**Common Mistake:** Splitting the timestamp manually at T.

**Interview Tip:** Use DataWeave temporal types when the source is a valid timestamp.

---

### DW-M245 — Convert DateTime to another timezone
**Difficulty:** Medium  
**Topic:** DateTime and TimeZone

**Question:** Convert a UTC timestamp to an India Standard Time DateTime.

**Input**
~~~json
{"timestamp":"2026-09-16T10:30:00Z"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{indiaTime: (payload.timestamp as DateTime) >> "Asia/Kolkata"}
~~~

**Expected Output**
~~~json
{"indiaTime":"2026-09-16T16:00:00+05:30"}
~~~

**Explanation:** The DateTime is shifted to the Asia/Kolkata timezone while representing the same instant.

**Common Mistake:** Adding five hours manually.

**Interview Tip:** Treat timezone conversion as a temporal operation, not string arithmetic.

---

### DW-M246 — Create a DateTime from components
**Difficulty:** Medium  
**Topic:** DateTime construction

**Question:** Create a DateTime using separate date, time, and timezone components.

**Input**
~~~json
{"year":2026,"month":9,"day":22,"hour":14,"minutes":30,"seconds":0,"timeZone":"+05:30"}
~~~

**DataWeave**
~~~dw
%dw 2.0
import * from dw::core::Dates
output application/json
---
{
  scheduledAt: dateTime({
    year: payload.year,
    month: payload.month,
    day: payload.day,
    hour: payload.hour,
    minutes: payload.minutes,
    seconds: payload.seconds,
    timeZone: payload.timeZone
  })
}
~~~

**Expected Output**
~~~json
{"scheduledAt":"2026-09-22T14:30:00+05:30"}
~~~

**Explanation:** The Dates module dateTime function creates a DateTime from its components.

**Common Mistake:** Omitting the timezone when the value represents an actual instant.

**Interview Tip:** DateTime includes timezone information; LocalDateTime does not.

---

### DW-M247 — Format a DateTime for an API response
**Difficulty:** Medium  
**Topic:** DateTime formatting

**Question:** Convert an ISO timestamp into a compact API response string.

**Input**
~~~json
{"createdAt":"2026-09-16T10:30:45Z"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  createdAt: (payload.createdAt as DateTime)
    as String {format: "yyyy-MM-dd HH:mm:ssXXX"}
}
~~~

**Expected Output**
~~~json
{"createdAt":"2026-09-16 10:30:45Z"}
~~~

**Explanation:** The DateTime is parsed first and then formatted with the target pattern.

**Common Mistake:** Manipulating the timestamp with string replacement.

**Interview Tip:** Parse first, then format.

---

## DataWeave Fundamentals

### DW-M248 — Use variables for repeated values
**Difficulty:** Medium  
**Topic:** DataWeave Fundamentals

**Question:** Calculate subtotal, tax, and total using variables.

**Input**
~~~json
{"price":100,"quantity":3,"taxRate":0.18}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
var subtotal = payload.price * payload.quantity
var tax = subtotal * payload.taxRate
---
{
  subtotal: subtotal,
  tax: tax,
  total: subtotal + tax
}
~~~

**Expected Output**
~~~json
{"subtotal":300,"tax":54,"total":354}
~~~

**Explanation:** Variables store intermediate values and make the transformation easier to maintain.

**Common Mistake:** Repeating the same long calculation in every field.

**Interview Tip:** Use variables for meaningful intermediate business calculations.

---

### DW-M249 — Use if/else to classify a value
**Difficulty:** Medium  
**Topic:** DataWeave Fundamentals

**Question:** Classify an order amount as HIGH when it is at least 50000; otherwise classify it as NORMAL.

**Input**
~~~json
{"amount":65000}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{category: if (payload.amount >= 50000) "HIGH" else "NORMAL"}
~~~

**Expected Output**
~~~json
{"category":"HIGH"}
~~~

**Explanation:** The if/else expression evaluates a Boolean condition and returns one of two values.

**Common Mistake:** Forgetting the else branch.

**Interview Tip:** Make both possible output values explicit.

---

### DW-M250 — Build an object conditionally
**Difficulty:** Medium  
**Topic:** DataWeave Fundamentals

**Question:** Include a discount field only when the customer is eligible.

**Input**
~~~json
{"customer":"Ravi","eligible":true,"discount":10}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  customer: payload.customer,
  (discount: payload.discount) if payload.eligible
}
~~~

**Expected Output**
~~~json
{"customer":"Ravi","discount":10}
~~~

**Explanation:** A conditional object field is emitted only when its condition is true.

**Common Mistake:** Returning a null field when the requirement is to omit it.

**Interview Tip:** Distinguish an omitted field from a field whose value is null.

---

### DW-M251 — Build a dynamic string with interpolation
**Difficulty:** Medium  
**Topic:** DataWeave Fundamentals and Strings

**Question:** Create a customer display label from first name and customer ID.

**Input**
~~~json
{"firstName":"Ravi","customerId":1042}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  label: "${payload.firstName} (#${payload.customerId})"
}
~~~

**Expected Output**
~~~json
{"label":"Ravi (#1042)"}
~~~

**Explanation:** String interpolation evaluates DataWeave expressions inside a string.

**Common Mistake:** Building a long string through many concatenation fragments.

**Interview Tip:** Use interpolation when it improves readability.

---

## Numbers

### DW-M252 — Calculate an average
**Difficulty:** Medium  
**Topic:** Numbers

**Question:** Calculate the average score of the supplied scores.

**Input**
~~~json
{"scores":[80,90,70,100]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{average: avg(payload.scores)}
~~~

**Expected Output**
~~~json
{"average":85}
~~~

**Explanation:** avg calculates the arithmetic mean of the numeric array.

**Common Mistake:** Dividing by a hard-coded record count.

**Interview Tip:** Use collection-aware numeric functions when the record count can change.

---

### DW-M253 — Calculate a percentage
**Difficulty:** Medium  
**Topic:** Numbers

**Question:** Calculate the percentage score from obtained marks and total marks.

**Input**
~~~json
{"obtained":72,"total":90}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{percentage: (payload.obtained / payload.total) * 100}
~~~

**Expected Output**
~~~json
{"percentage":80}
~~~

**Explanation:** The obtained score is divided by the maximum score and multiplied by 100.

**Common Mistake:** Ignoring the zero-total case.

**Interview Tip:** Define the expected behavior for division by zero in real requirements.

---

### DW-M254 — Round a calculated number
**Difficulty:** Medium  
**Topic:** Numbers and rounding

**Question:** Round the calculated average to two decimal places.

**Input**
~~~json
{"total":127,"count":6}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{average: round((payload.total / payload.count) * 100) / 100}
~~~

**Expected Output**
~~~json
{"average":21.17}
~~~

**Explanation:** The calculation is scaled by 100, rounded, and scaled back to two decimal places.

**Common Mistake:** Rounding the total before division.

**Interview Tip:** Decide whether rounding is for presentation or part of the business calculation.

---

### DW-M255 — Calculate a maximum from numeric records
**Difficulty:** Medium  
**Topic:** Numbers and collections

**Question:** Return the highest transaction amount.

**Input**
~~~json
{"transactions":[1200,850,2400,1750]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{highest: max(payload.transactions)}
~~~

**Expected Output**
~~~json
{"highest":2400}
~~~

**Explanation:** max returns the highest comparable value in the numeric array.

**Common Mistake:** Sorting the entire array when only one aggregate value is needed.

**Interview Tip:** Prefer the direct aggregation function when the requirement asks for one value.

---

## Strings

### DW-M256 — Normalize whitespace in a string
**Difficulty:** Medium  
**Topic:** Strings

**Question:** Remove surrounding whitespace from a customer name and convert it to uppercase.

**Input**
~~~json
{"name":"  ravi kumar  "}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{name: upper(trim(payload.name))}
~~~

**Expected Output**
~~~json
{"name":"RAVI KUMAR"}
~~~

**Explanation:** trim removes surrounding whitespace and upper converts the resulting string to uppercase.

**Common Mistake:** Assuming upper also removes whitespace.

**Interview Tip:** Chain small string functions when each step has a clear purpose.

---

### DW-M257 — Split a delimited string into an array
**Difficulty:** Medium  
**Topic:** Strings

**Question:** Convert a comma-separated list of roles into an array.

**Input**
~~~json
{"roles":"admin,developer,reviewer"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{roles: payload.roles splitBy ","}
~~~

**Expected Output**
~~~json
{"roles":["admin","developer","reviewer"]}
~~~

**Explanation:** splitBy separates the string at each comma and returns an array.

**Common Mistake:** Leaving the entire comma-separated value as one string.

**Interview Tip:** Consider trimming each resulting item when source data can contain spaces.

---

### DW-M258 — Join an array into a string
**Difficulty:** Medium  
**Topic:** Strings and collections

**Question:** Convert an array of product codes into one pipe-separated string.

**Input**
~~~json
{"codes":["P100","P200","P300"]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{codeList: payload.codes joinBy "|"}
~~~

**Expected Output**
~~~json
{"codeList":"P100|P200|P300"}
~~~

**Explanation:** joinBy combines array values into one String using the supplied separator.

**Common Mistake:** Manually concatenating values and leaving an unwanted separator.

**Interview Tip:** Use joinBy when the source is already an array.

---

### DW-M259 — Replace part of a string
**Difficulty:** Medium  
**Topic:** Strings

**Question:** Mask the domain of an email address by replacing it with example.com.

**Input**
~~~json
{"email":"ravi@company.com"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{email: payload.email replace /@.*$/ with "@example.com"}
~~~

**Expected Output**
~~~json
{"email":"ravi@example.com"}
~~~

**Explanation:** The regular expression matches the @ character and everything after it, and replace substitutes the matched portion.

**Common Mistake:** Replacing only one fixed source domain when different domains are possible.

**Interview Tip:** Use a regex when the part to replace follows a pattern.
