# DataWeave Web Questions — Additional Deduplicated Set 007

## 58. What does the DataWeave `parseURI` function do?

**Answer:** `parseURI` parses a URL string and returns a URI object containing information such as the scheme, host, path, query parameters, fragment, and whether the URI is valid.

**Example**
```dataweave
%dw 2.0
import * from dw::core::URL
output application/json
---
parseURI("https://example.com/products?id=10#details")
```

**Output**
```json
{
  "isValid": true,
  "host": "example.com",
  "path": "/products",
  "scheme": "https",
  "fragment": "details"
}
```

**Explanation:** Use `parseURI` when a transformation needs to inspect individual parts of a URI instead of treating the complete URL as a plain string.

## 59. What is `toRegex` used for in DataWeave?

**Answer:** `toRegex` converts a String into a DataWeave Regex value.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/dw
---
toRegex("[A-Z]+")
```

**Output**
```text
/[A-Z]+/
```

**Explanation:** This is useful when a regular-expression pattern is received as text and needs to be converted into a Regex value before it is used by another DataWeave operation.

## 60. What does `toPeriod` do in DataWeave?

**Answer:** `toPeriod` converts a String containing an ISO-8601 period into a DataWeave Period value.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/dw
---
{
  days: toPeriod("P7D"),
  time: toPeriod("PT2H30M")
}
```

**Output**
```text
{
  days: |P7D|,
  time: |PT2H30M|
}
```

**Explanation:** A Period represents calendar-based or date/time duration information such as days, months, hours, and minutes. Converting a string to Period lets DataWeave perform operations using the typed value.

## 61. What does `toUri` do in DataWeave?

**Answer:** `toUri` converts a String into a DataWeave URI value.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/json
---
toUri("https://example.com/orders/100")
```

**Output**
```json
"https://example.com/orders/100"
```

**Explanation:** Use `toUri` when a text value needs to be represented as the DataWeave URI type rather than remaining a normal String.

## 62. What is the difference between `toBoolean` and a Boolean value in DataWeave?

**Answer:** `toBoolean` explicitly converts a String into a Boolean. It is useful when input data contains values such as `"true"` or `"false"` as text.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/json
---
{
  enabled: toBoolean("true"),
  disabled: toBoolean("false")
}
```

**Output**
```json
{
  "enabled": true,
  "disabled": false
}
```

**Explanation:** The result is a Boolean value, not the original String. The conversion is case-insensitive for values such as `"TRUE"` and `"TrUe"`.

## 63. What is `appendIfMissing` used for in DataWeave?

**Answer:** `appendIfMissing` adds a suffix to the end of a String only when that suffix is not already present.

**Example**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  first: appendIfMissing("report.csv", ".csv"),
  second: appendIfMissing("report", ".csv")
}
```

**Output**
```json
{
  "first": "report.csv",
  "second": "report.csv"
}
```

**Explanation:** This prevents accidentally adding the same suffix twice. A similar function, `prependIfMissing`, performs the same type of check at the beginning of a String.

## 64. What do `ordinalize` and `pluralize` do in DataWeave?

**Answer:** `ordinalize` converts a number into an ordinal representation, while `pluralize` converts a singular word to its plural form.

**Example**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  position: ordinalize(2),
  word: pluralize("book")
}
```

**Output**
```json
{
  "position": "2nd",
  "word": "books"
}
```

**Explanation:** These String-module functions are useful for generating human-readable text dynamically.

## 65. What is `toArray` from `dw::util::Coercions` used for?

**Answer:** `toArray` converts a String into an array containing its individual characters.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/json
---
toArray("Mule")
```

**Output**
```json
["M", "u", "l", "e"]
```

**Explanation:** This is useful when character-level array operations are required. It is different from splitting a String by a delimiter because each character becomes a separate array element.