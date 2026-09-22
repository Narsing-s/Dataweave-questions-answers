# DataWeave Web Questions — Additional Deduplicated Set 004

## 48. What is `withMaxSize` used for in DataWeave?

**Answer:** `withMaxSize` limits a string to a maximum number of characters. If the input is longer than the limit, it is truncated.

**Example**
```dataweave
%dw 2.0
import withMaxSize from dw::core::Strings
output application/json
---
{
  short: "DataWeave" withMaxSize 20,
  limited: "DataWeave" withMaxSize 4
}
```

**Output**
```json
{
  "short": "DataWeave",
  "limited": "Data"
}
```

**Explanation:** This is useful when a downstream system or database field has a maximum length. MuleSoft documents `withMaxSize` as a DataWeave Strings function introduced in DataWeave 2.3.0. citeturn1search0turn1search1

## 49. What is the difference between `zip` and `unzip` in DataWeave?

**Answer:** `zip` combines corresponding elements from two arrays into pairs. `unzip` performs the reverse operation by turning an array of pairs back into separate arrays.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  zipped: [1, 2, 3] zip ["A", "B", "C"],
  unzipped: unzip([[1, "A"], [2, "B"], [3, "C"]])
}
```

**Output**
```json
{
  "zipped": [[1, "A"], [2, "B"], [3, "C"]],
  "unzipped": [[1, 2, 3], ["A", "B", "C"]]
}
```

**Explanation:** Use `zip` when two related arrays need to be paired by position. Use `unzip` when those pairs need to be separated again. MuleSoft documents `unzip` as the opposite of `zip`. citeturn2search0turn2search1

## 50. What is `substringEvery` used for in DataWeave?

**Answer:** `substringEvery` divides a string into substrings of a specified length.

**Example**
```dataweave
%dw 2.0
import substringEvery from dw::core::Strings
output application/json
---
"ABCDEFGHI" substringEvery 3
```

**Output:** `["ABC", "DEF", "GHI"]`

**Explanation:** This is useful for fixed-width identifiers, reference numbers, or other strings that need to be processed in equal-sized chunks. MuleSoft lists `substringEvery` in the DataWeave Strings module. citeturn1search7

## Deduplication note

These questions were added only after searching the repository for the corresponding concepts. Existing coverage for `onNull`, `everyEntry`, `take`, `drop`, `slice`, `entriesOf`, `valuesOf`, period/date handling, Base64, `then`, and other previously documented topics was left unchanged.

The web research also checked MuleSoft's official DataWeave function reference, cookbook, format documentation, and DataWeave tutorials. citeturn0search0turn0search5turn2search9