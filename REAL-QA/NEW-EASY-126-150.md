# New Easy DataWeave Q&A — DW-E126 to DW-E150

New beginner-level problems covering gaps without intentionally repeating earlier curated questions.

## DW-E126 — Extract text after a delimiter
**Question:** Extract the environment name from `app-prod`.
**Input**
```json
{"value":"app-prod"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value substringAfter "-"
```
**Output**
```json
"prod"
```
**Explanation:** `substringAfter` returns the text after the first matching delimiter.
**Common mistake:** Assuming it returns text after the last delimiter.
**Interview tip:** Ask what should happen when the delimiter is missing.

## DW-E127 — Extract text before a delimiter
**Question:** Extract the service name from `orders-v2`.
**Input**
```json
{"value":"orders-v2"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value substringBefore "-"
```
**Output**
```json
"orders"
```
**Explanation:** `substringBefore` returns the text before the first delimiter.
**Common mistake:** Using array indexing when a string operation is clearer.
**Interview tip:** Explain first-versus-last delimiter behavior.

## DW-E128 — Extract text after the last delimiter
**Question:** Extract the file extension from `report.monthly.csv`.
**Input**
```json
{"file":"report.monthly.csv"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.file substringAfterLast "."
```
**Output**
```json
"csv"
```
**Explanation:** `substringAfterLast` is useful when a value contains multiple delimiters.
**Common mistake:** Using `substringAfter`, which uses the first occurrence.
**Interview tip:** File names are a simple real-world delimiter example.

## DW-E129 — Extract text before the last delimiter
**Question:** Extract the directory-like portion from `reports/2026/january.csv`.
**Input**
```json
{"path":"reports/2026/january.csv"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.path substringBeforeLast "/"
```
**Output**
```json
"reports/2026"
```
**Explanation:** `substringBeforeLast` preserves everything before the final delimiter.
**Common mistake:** Splitting and rebuilding the string unnecessarily.
**Interview tip:** Compare this with `substringBefore`.

## DW-E130 — Convert text to uppercase
**Question:** Normalize a country code to uppercase.
**Input**
```json
{"country":"in"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
upper(payload.country)
```
**Output**
```json
"IN"
```
**Explanation:** `upper` converts alphabetic characters to uppercase.
**Common mistake:** Applying it to unrelated numeric fields.
**Interview tip:** Normalization is often needed before comparisons.

## DW-E131 — Convert text to lowercase
**Question:** Normalize an email address to lowercase.
**Input**
```json
{"email":"USER@EXAMPLE.COM"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
lower(payload.email)
```
**Output**
```json
"user@example.com"
```
**Explanation:** `lower` converts alphabetic characters to lowercase.
**Common mistake:** Treating normalization as validation.
**Interview tip:** Case normalization and business validation are separate concerns.

## DW-E132 — Trim surrounding whitespace
**Question:** Remove leading and trailing spaces from a customer name.
**Input**
```json
{"name":"  Ravi Kumar  "}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
trim(payload.name)
```
**Output**
```json
"Ravi Kumar"
```
**Explanation:** `trim` removes surrounding whitespace.
**Common mistake:** Expecting it to remove spaces between words.
**Interview tip:** Use normalization before exact comparisons.

## DW-E133 — Capitalize a display value
**Question:** Convert a lowercase first name to a capitalized display value.
**Input**
```json
{"name":"ravi"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
capitalize(payload.name)
```
**Output**
```json
"Ravi"
```
**Explanation:** `capitalize` changes the initial character to uppercase.
**Common mistake:** Assuming it performs full title-case formatting for multiple words.
**Interview tip:** Distinguish capitalization from title-case requirements.

## DW-E134 — Repeat a string
**Question:** Create a five-character separator using `-`.
**Input**
```json
{"separator":"-"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
repeat(payload.separator, 5)
```
**Output**
```json
"-----"
```
**Explanation:** `repeat` creates a string containing the supplied value multiple times.
**Common mistake:** Using an array when a string is required.
**Interview tip:** String utility functions can simplify formatting transformations.

## DW-E135 — Encode text as Base64
**Question:** Encode `hello` as Base64.
**Input**
```json
{"text":"hello"}
```
**DataWeave**
```dw
%dw 2.0
import toBase64 from dw::core::Binaries
output application/json
---
toBase64(payload.text as Binary)
```
**Output**
```json
"aGVsbG8="
```
**Explanation:** The text is converted to Binary and then Base64 encoded.
**Common mistake:** Treating Base64 as encryption.
**Interview tip:** Base64 provides encoding, not confidentiality.

## DW-E136 — Decode Base64 text
**Question:** Decode `aGVsbG8=` back to text.
**Input**
```json
{"encoded":"aGVsbG8="}
```
**DataWeave**
```dw
%dw 2.0
import fromBase64 from dw::core::Binaries
output application/json
---
fromBase64(payload.encoded) as String
```
**Output**
```json
"hello"
```
**Explanation:** `fromBase64` produces Binary data, which is cast to String.
**Common mistake:** Forgetting the final Binary-to-String conversion.
**Interview tip:** Always identify the type returned by binary functions.

## DW-E137 — Serialize an object with write
**Question:** Convert a small object to a JSON string.
**Input**
```json
{"id":10,"name":"Ravi"}
```
**DataWeave**
```dw
%dw 2.0
import write from dw::core::Strings
output application/json
---
write(payload, "application/json")
```
**Output**
```json
"{\"id\":10,\"name\":\"Ravi\"}"
```
**Explanation:** `write` serializes a value into the requested format.
**Common mistake:** Confusing serialization with returning the original object.
**Interview tip:** Explain when an integration needs data as text rather than a structured value.

## DW-E138 — Parse JSON text with read
**Question:** Parse a JSON string into a DataWeave value.
**Input**
```json
{"text":"{\"id\":10,\"active\":true}"}
```
**DataWeave**
```dw
%dw 2.0
import read from dw::core::Strings
output application/json
---
read(payload.text, "application/json")
```
**Output**
```json
{"id":10,"active":true}
```
**Explanation:** `read` parses text according to the supplied MIME type.
**Common mistake:** Passing an already parsed object when the input is actually a string.
**Interview tip:** `read` and `write` are useful when dealing with serialized content.

## DW-E139 — Test whether a value is a Number
**Question:** Return whether the input value is numeric.
**Input**
```json
{"value":42}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value is Number
```
**Output**
```json
true
```
**Explanation:** The `is` operator checks the runtime type.
**Common mistake:** Checking the value with a string comparison.
**Interview tip:** Type checks are useful when input contracts are flexible.

## DW-E140 — Test whether a value is String
**Question:** Determine whether a supplied field is text.
**Input**
```json
{"value":"42"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value is String
```
**Output**
```json
true
```
**Explanation:** The value is text even though its characters represent a number.
**Common mistake:** Assuming numeric-looking text is automatically a Number.
**Interview tip:** Distinguish value representation from DataWeave type.

## DW-E141 — Test whether an object contains a key
**Question:** Check whether a customer object contains the `email` key.
**Input**
```json
{"id":1,"email":"a@example.com"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload contains "email")
```
**Output**
```json
true
```
**Explanation:** Object membership can be used when checking whether a key exists.
**Common mistake:** Checking the value when the requirement is key presence.
**Interview tip:** Key existence and non-null value are different requirements.

## DW-E142 — Get an object's values
**Question:** Return all values from a configuration object.
**Input**
```json
{"region":"IN","active":true,"retries":3}
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
["IN",true,3]
```
**Explanation:** `valuesOf` returns the object's values as an array.
**Common mistake:** Expecting the original key/value structure.
**Interview tip:** Compare `valuesOf` with `keysOf` and `entriesOf`.

## DW-E143 — Select a range from an array
**Question:** Return the first three elements of a numeric array.
**Input**
```json
[10,20,30,40,50]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[0 to 2]
```
**Output**
```json
[10,20,30]
```
**Explanation:** Range indexing selects a contiguous portion of the array.
**Common mistake:** Forgetting that the end index is included.
**Interview tip:** State index boundaries explicitly when explaining slices.

## DW-E144 — Check for a blank string
**Question:** Return whether a customer comment is blank.
**Input**
```json
{"comment":"   "}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
isBlank(payload.comment)
```
**Output**
```json
true
```
**Explanation:** `isBlank` handles blank textual content including whitespace.
**Common mistake:** Checking only `== ""`.
**Interview tip:** Blank and null are different states and may require different handling.

## DW-E145 — Provide a fallback for null
**Question:** Use `UNKNOWN` when a customer's city is null.
**Input**
```json
{"city":null}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.city default "UNKNOWN"
```
**Output**
```json
"UNKNOWN"
```
**Explanation:** `default` provides a replacement when the selected value is null or absent.
**Common mistake:** Replacing valid values such as `0` unnecessarily.
**Interview tip:** Explain the difference between null, absent, and valid falsy-like values.

## DW-E146 — Convert an integer to String
**Question:** Return an account ID as text.
**Input**
```json
{"accountId":12345}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.accountId as String
```
**Output**
```json
"12345"
```
**Explanation:** Explicit casting changes the DataWeave type from Number to String.
**Common mistake:** Concatenating without understanding the resulting type.
**Interview tip:** Type conversion matters at API and file boundaries.

## DW-E147 — Convert numeric text to Number
**Question:** Convert an amount received as text into a number.
**Input**
```json
{"amount":"125.50"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount as Number
```
**Output**
```json
125.5
```
**Explanation:** Explicit casting converts numeric text into a Number.
**Common mistake:** Performing arithmetic while the value is still text.
**Interview tip:** Mention invalid input handling when the source contract is unreliable.

## DW-E148 — Build a display label with concatenation
**Question:** Combine a first and last name into one label.
**Input**
```json
{"first":"Ravi","last":"Kumar"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.first ++ " " ++ payload.last
```
**Output**
```json
"Ravi Kumar"
```
**Explanation:** `++` concatenates String values.
**Common mistake:** Forgetting the separator between fields.
**Interview tip:** Discuss null handling if either name is optional.

## DW-E149 — Create a constant field
**Question:** Add a constant source-system value to an API response.
**Input**
```json
{"id":10}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  sourceSystem: "CRM"
}
```
**Output**
```json
{"id":10,"sourceSystem":"CRM"}
```
**Explanation:** Target fields can contain constants as well as mapped values.
**Common mistake:** Trying to read every output field from the input.
**Interview tip:** Constants are common for contract metadata.

## DW-E150 — Create a conditional message
**Question:** Return `Eligible` when the customer's score is at least 700.
**Input**
```json
{"score":725}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.score >= 700) "Eligible" else "Not eligible"
```
**Output**
```json
"Eligible"
```
**Explanation:** The `if/else` expression selects one output based on a condition.
**Common mistake:** Omitting the `else` branch.
**Interview tip:** For many branches, compare `if/else` with `match`.
