# DataWeave Web Questions — Additional Deduplicated Set 005

## 51. What does `encodeURIComponent` do in DataWeave?

**Answer:** It encodes a URI component so characters that have special meaning in a URI are represented safely.

**Example**
```dataweave
%dw 2.0
import * from dw::core::URL
output application/json
---
encodeURIComponent("Hello World!")
```

**Output**
```text
Hello%20World!
```

**Explanation:** Use it when a value is going to be placed inside a URI component, such as part of a query value or path-related value. MuleSoft provides the matching `decodeURIComponent` function to reverse the encoding. citeturn1search9turn1search5

## 52. What does `randomInt` do in DataWeave?

**Answer:** `randomInt(upperBound)` returns a pseudo-random whole number from 0 up to, but not including, the supplied upper bound.

**Example**
```dataweave
%dw 2.0
output application/json
---
randomInt(10)
```

**Output:** An integer from `0` through `9`. The exact result changes because it is pseudo-random.

**Explanation:** Unlike a fixed calculation, this function does not guarantee one specific output for the same script execution. MuleSoft documents the upper bound as exclusive. citeturn1search2turn1search7

## 53. What are `toRadians` and `toDegrees` used for in DataWeave?

**Answer:** They convert angles between degrees and radians.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Math
output application/json
---
{
  radians: toRadians(180),
  degrees: toDegrees(3.141592653589793)
}
```

**Output**
```json
{
  "radians": 3.141592653589793,
  "degrees": 180
}
```

**Explanation:** `toRadians` converts degrees to radians, while `toDegrees` converts radians to degrees. These functions are useful when working with trigonometric calculations or systems that use different angle units. citeturn1search12

## 54. What do `camelize`, `capitalize`, and `dasherize` do in DataWeave?

**Answer:** These String functions change the formatting of text:
- `camelize` converts underscore-based text to camel case.
- `capitalize` capitalizes the first letter of each word.
- `dasherize` replaces spaces, underscores, and camel-casing with hyphens.

**Example**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  camel: camelize("hello_world"),
  capital: capitalize("hello world"),
  dashed: dasherize("helloWorld value")
}
```

**Output**
```json
{
  "camel": "helloWorld",
  "capital": "Hello World",
  "dashed": "hello-world-value"
}
```

**Explanation:** These functions are useful when transforming field names or normalizing text between naming conventions. MuleSoft documents them in the DataWeave Strings module and also demonstrates `camelize` and `capitalize` in a transformation example. citeturn1search0turn1search1

## Deduplication note

Questions 51–54 were added only after repository searches found no existing dedicated Q&A for these concepts. Existing coverage was not rewritten or duplicated. The collection continues from Q50 and keeps the format Question → Answer → Example → Output → Explanation.