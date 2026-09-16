# New Easy DataWeave Q&A — DW-E101 to DW-E125

These questions focus on gaps in the curated bank: substring selectors, basic string helpers, casting, null-safe defaults, and simple transformation utilities.

## DW-E101 — Extract the first three characters
**Difficulty:** Easy  
**Topic:** substring

**Question:** Extract the first three characters from `"MULESOFT"`.

**Input**
```json
{"code":"MULESOFT"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
substring(payload.code, 0, 3)
```

**Expected output**
```json
"MUL"
```

**Explanation:** `substring` uses a zero-based start index and an exclusive end index.

**Common mistake:** Using `1, 3` when the requirement is to start from the first character.

**Interview tip:** Explain the start-inclusive/end-exclusive behavior.

---

## DW-E102 — Get text before a delimiter
**Difficulty:** Easy  
**Topic:** substringBefore

**Question:** From `"ORD-2026-1001"`, return everything before the first `-`.

**Input**
```json
{"value":"ORD-2026-1001"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
substringBefore(payload.value, "-")
```

**Expected output**
```json
"ORD"
```

**Explanation:** `substringBefore` returns the portion before the first matching delimiter.

**Common mistake:** Splitting the complete string when only the prefix is required.

**Interview tip:** Use the function when the delimiter is part of the contract and only one side is needed.

---

## DW-E103 — Get text after a delimiter
**Difficulty:** Easy  
**Topic:** substringAfter

**Question:** From `"ORD-2026-1001"`, return the text after the first `-`.

**Input**
```json
{"value":"ORD-2026-1001"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
substringAfter(payload.value, "-")
```

**Expected output**
```json
"2026-1001"
```

**Explanation:** The function returns the portion after the first delimiter and keeps later delimiters.

**Common mistake:** Expecting only `1001`; that would require a different parsing rule.

**Interview tip:** State whether the first or last delimiter is required before selecting the function.

---

## DW-E104 — Extract the file extension
**Difficulty:** Easy  
**Topic:** substringAfterLast

**Question:** Extract the extension from `"report.final.csv"`.

**Input**
```json
{"file":"report.final.csv"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
substringAfterLast(payload.file, ".")
```

**Expected output**
```json
"csv"
```

**Explanation:** `substringAfterLast` uses the final delimiter, which is useful when filenames contain multiple dots.

**Common mistake:** Using `substringAfter`, which would return `final.csv`.

**Interview tip:** Mention why the last delimiter is safer for multi-dot filenames.

---

## DW-E105 — Extract a filename without its extension
**Difficulty:** Easy  
**Topic:** substringBeforeLast

**Question:** Return the filename portion before the final dot.

**Input**
```json
{"file":"report.final.csv"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
substringBeforeLast(payload.file, ".")
```

**Expected output**
```json
"report.final"
```

**Explanation:** The final dot is treated as the extension separator.

**Common mistake:** Removing everything after the first dot.

**Interview tip:** Distinguish first-delimiter and last-delimiter requirements.

---

## DW-E106 — Convert text to uppercase
**Difficulty:** Easy  
**Topic:** upper

**Question:** Convert a customer code to uppercase.

**Input**
```json
{"code":"ab-17"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
upper(payload.code)
```

**Expected output**
```json
"AB-17"
```

**Explanation:** `upper` normalizes alphabetic characters to uppercase.

**Common mistake:** Assuming numeric characters are changed.

**Interview tip:** Use normalization before case-insensitive business comparisons when appropriate.

---

## DW-E107 — Convert text to lowercase
**Difficulty:** Easy  
**Topic:** lower

**Question:** Normalize an email address to lowercase.

**Input**
```json
{"email":"User@Example.COM"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
lower(payload.email)
```

**Expected output**
```json
"user@example.com"
```

**Explanation:** Lowercasing provides a consistent representation for many lookup and comparison scenarios.

**Common mistake:** Treating lowercase normalization as proof that two business identities are equivalent.

**Interview tip:** Mention that identity rules should come from the source-system contract.

---

## DW-E108 — Trim surrounding whitespace
**Difficulty:** Easy  
**Topic:** trim

**Question:** Remove leading and trailing spaces from a customer name.

**Input**
```json
{"name":"  Ravi Kumar  "}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
trim(payload.name)
```

**Expected output**
```json
"Ravi Kumar"
```

**Explanation:** `trim` removes surrounding whitespace without changing internal spacing.

**Common mistake:** Expecting repeated internal spaces to be collapsed.

**Interview tip:** Separate whitespace cleanup from full name normalization.

---

## DW-E109 — Capitalize a status label
**Difficulty:** Easy  
**Topic:** capitalize

**Question:** Convert `"pending"` into a capitalized label.

**Input**
```json
{"status":"pending"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
capitalize(payload.status)
```

**Expected output**
```json
"Pending"
```

**Explanation:** `capitalize` changes the first character to its capitalized form.

**Common mistake:** Treating it as title-casing every word.

**Interview tip:** Confirm the exact presentation format required by the consumer.

---

## DW-E110 — Repeat a separator
**Difficulty:** Easy  
**Topic:** repeat

**Question:** Create a five-character separator using `-`.

**Input**
```json
{"separator":"-"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
repeat(payload.separator, 5)
```

**Expected output**
```json
"-----"
```

**Explanation:** `repeat` repeats the supplied string the requested number of times.

**Common mistake:** Confusing the count with the final string length when the source string has multiple characters.

**Interview tip:** Check the length of the repeated token before calculating the final output size.

---

## DW-E111 — Check whether a value is blank
**Difficulty:** Easy  
**Topic:** isBlank

**Question:** Return whether a whitespace-only field is blank.

**Input**
```json
{"comment":"   "}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
isBlank(payload.comment)
```

**Expected output**
```json
true
```

**Explanation:** `isBlank` is useful when empty or whitespace-only text should be treated as missing input.

**Common mistake:** Checking only equality with `""`.

**Interview tip:** Clarify whether null, empty, and whitespace-only values have the same business meaning.

---

## DW-E112 — Default a null field
**Difficulty:** Easy  
**Topic:** default

**Question:** Return `"Unknown"` when `customerName` is null.

**Input**
```json
{"customerName":null}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.customerName default "Unknown"
```

**Expected output**
```json
"Unknown"
```

**Explanation:** `default` provides a fallback when the selected value is null or absent.

**Common mistake:** Assuming it replaces every false-like value.

**Interview tip:** Distinguish null handling from Boolean or numeric validation.

---

## DW-E113 — Cast a numeric string to Number
**Difficulty:** Easy  
**Topic:** casting

**Question:** Convert the string amount `"125.50"` into a number.

**Input**
```json
{"amount":"125.50"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.amount as Number
```

**Expected output**
```json
125.5
```

**Explanation:** The `as Number` cast converts compatible text into a numeric value.

**Common mistake:** Performing arithmetic on uncast text.

**Interview tip:** Discuss source formatting and what should happen for invalid numeric strings.

---

## DW-E114 — Format a number as currency text
**Difficulty:** Easy  
**Topic:** number formatting

**Question:** Format `1250.5` as text with two decimal places.

**Input**
```json
{"amount":1250.5}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload.amount as String {format: "0.00"})
```

**Expected output**
```json
"1250.50"
```

**Explanation:** A format pattern can control the textual representation of a number.

**Common mistake:** Treating formatted currency text as a numeric value.

**Interview tip:** Keep calculation values numeric and format only at the presentation boundary.

---

## DW-E115 — Convert a date string to a Date
**Difficulty:** Easy  
**Topic:** date casting

**Question:** Convert `"2026-09-16"` into a DataWeave `Date` value.

**Input**
```json
{"date":"2026-09-16"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.date as Date {format: "yyyy-MM-dd"}
```

**Expected output**
```json
"2026-09-16"
```

**Explanation:** The input format tells DataWeave how to interpret the text as a date.

**Common mistake:** Assuming every date string has the same format.

**Interview tip:** Always identify the source date contract before casting.

---

## DW-E116 — Get the current date
**Difficulty:** Easy  
**Topic:** now

**Question:** Produce today's date from the current DataWeave runtime clock.

**Input**
```json
{}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
now() as Date
```

**Expected output**
```text
Runtime-dependent current date
```

**Explanation:** `now()` reads the runtime clock, so the exact output changes with execution time and timezone.

**Common mistake:** Hard-coding an expected date in a runtime-dependent test.

**Interview tip:** Inject or control time in automated tests when deterministic output is required.

---

## DW-E117 — Get object keys as an array
**Difficulty:** Easy  
**Topic:** keysOf

**Question:** Return the keys of a customer object.

**Input**
```json
{"id":"C1","name":"Ravi","active":true}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
keysOf(payload)
```

**Expected output**
```json
["id","name","active"]
```

**Explanation:** `keysOf` exposes the object's keys as an array.

**Common mistake:** Using `map` directly on an object when an object-entry function is required.

**Interview tip:** Compare `keysOf`, `valuesOf`, `entriesOf`, and `pluck`.

---

## DW-E118 — Get object values as an array
**Difficulty:** Easy  
**Topic:** valuesOf

**Question:** Return the values from a customer object.

**Input**
```json
{"id":"C1","active":true,"score":90}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
valuesOf(payload)
```

**Expected output**
```json
["C1",true,90]
```

**Explanation:** `valuesOf` returns the object's values in an array.

**Common mistake:** Expecting the key-value relationships to remain in the output.

**Interview tip:** Use `entriesOf` when both key and value are needed.

---

## DW-E119 — Convert object entries to an array
**Difficulty:** Easy  
**Topic:** entriesOf

**Question:** Convert an object into explicit key-value-index entries.

**Input**
```json
{"a":10,"b":20}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
entriesOf(payload)
```

**Expected output**
```json
[
  {"key":"a","value":10},
  {"key":"b","value":20}
]
```

**Explanation:** `entriesOf` makes object entries explicit, which is useful for array-style processing.

**Common mistake:** Assuming the result is a plain array of values.

**Interview tip:** Explain when object-to-array conversion is useful before mapping.

---

## DW-E120 — Check whether an array contains a value
**Difficulty:** Easy  
**Topic:** contains

**Question:** Check whether the allowed-role array contains `"ADMIN"`.

**Input**
```json
{"roles":["USER","ADMIN"]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.roles contains "ADMIN"
```

**Expected output**
```json
true
```

**Explanation:** `contains` checks whether a collection contains the requested value.

**Common mistake:** Assuming matching is case-insensitive.

**Interview tip:** Normalize case first if the business rule requires case-insensitive matching.

---

## DW-E121 — Remove duplicate simple values
**Difficulty:** Easy  
**Topic:** distinctBy

**Question:** Remove duplicate status values while preserving the first occurrence.

**Input**
```json
["NEW","PAID","NEW","CANCELLED","PAID"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload distinctBy $
```

**Expected output**
```json
["NEW","PAID","CANCELLED"]
```

**Explanation:** `distinctBy` keeps one value for each distinct criterion.

**Common mistake:** Using `groupBy` when only unique values are required.

**Interview tip:** Explain the criterion expression after `distinctBy`.

---

## DW-E122 — Find the first array element
**Difficulty:** Easy  
**Topic:** first

**Question:** Return the first order ID from an array.

**Input**
```json
{"orders":[{"id":"O1"},{"id":"O2"}]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.orders[0].id
```

**Expected output**
```json
"O1"
```

**Explanation:** Array indexing starts at zero.

**Common mistake:** Using index `1` for the first element.

**Interview tip:** Consider the empty-array case before direct indexing in production mappings.

---

## DW-E123 — Create a boolean based on a numeric threshold
**Difficulty:** Easy  
**Topic:** conditional expression

**Question:** Set `eligible` to true when the balance is at least 1000.

**Input**
```json
{"balance":1250}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{ eligible: payload.balance >= 1000 }
```

**Expected output**
```json
{"eligible":true}
```

**Explanation:** A comparison expression directly produces a Boolean.

**Common mistake:** Returning the numeric balance instead of the condition result.

**Interview tip:** Keep simple predicates explicit and readable.

---

## DW-E124 — Build a display label with concatenation
**Difficulty:** Easy  
**Topic:** string concatenation

**Question:** Build `"C1 - Ravi"` from separate fields.

**Input**
```json
{"id":"C1","name":"Ravi"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.id ++ " - " ++ payload.name
```

**Expected output**
```json
"C1 - Ravi"
```

**Explanation:** `++` concatenates compatible strings.

**Common mistake:** Concatenating numbers and strings without considering type conversion.

**Interview tip:** Know the difference between array, object, and string concatenation with `++`.

---

## DW-E125 — Create a safe display name
**Difficulty:** Easy  
**Topic:** default + concatenation

**Question:** Create a display name from `firstName` and an optional `lastName`.

**Input**
```json
{"firstName":"Ravi","lastName":null}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  displayName: payload.firstName ++ " " ++ (payload.lastName default "")
}
```

**Expected output**
```json
{"displayName":"Ravi "}
```

**Explanation:** `default` prevents a null last name from breaking string concatenation.

**Common mistake:** Forgetting that the example intentionally leaves a trailing space.

**Interview tip:** If presentation quality matters, combine this with trimming after concatenation.
