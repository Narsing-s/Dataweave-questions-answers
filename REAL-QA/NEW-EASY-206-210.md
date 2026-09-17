# Easy DataWeave Q&A — DW-E206 to DW-E210

## DW-E206 — Concatenate the first two object values
**Difficulty:** Easy  
**Topic:** valuesOf, concatenation

**Question:** Given an array of objects where each object contains two values, concatenate the first and second values with `_` between them. Do this without `if/else` and without relying on fixed field names.

**Input**
```json
[
  {
    "FirstName": "durga",
    "LastName": "prasad"
  },
  {
    "FirstName1": "Narsing",
    "LastName2": "somu"
  }
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload map (item) -> {
    Name: valuesOf(item)[0] ++ "_" ++ valuesOf(item)[1]
}
```

**Expected output**
```json
[
  {
    "Name": "durga_prasad"
  },
  {
    "Name": "Narsing_somu"
  }
]
```

**Explanation:** `valuesOf(item)` returns the object's values as an array. Index `0` gets the first value and index `1` gets the second value. The `++` operator concatenates the two strings with `_` between them.

**Common mistake:** Using fixed field names or `if/else` when the requirement is based only on the first two object values.

**Interview tip:** Know the difference between `keysOf`, `valuesOf`, and `entriesOf`. This pattern is useful when field names vary but the value positions are consistent.
