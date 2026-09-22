# Web-Sourced DataWeave Questions — Batch 011

These questions were selected after comparing public DataWeave material with the repository. Semantically equivalent questions already present in the repository were excluded.

## Q75 — How can `filterObjectLeafs` remove matching leaf fields from nested objects?

**Answer:** `dw::util::Tree::filterObjectLeafs` applies a condition to leaf values in objects throughout a nested structure. When the condition returns `true`, the leaf and its key remain; when it returns `false`, the leaf and key are removed.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Tree
output application/json
---
{
  name: "Narsing",
  age: 26,
  address: {
    city: "Hyderabad",
    zip: 500001
  }
} filterObjectLeafs ((value, path) -> !(value is String))
```

**Output**
```json
{
  "age": 26,
  "address": {
    "zip": 500001
  }
}
```

**Explanation:** This is different from ordinary `filterObject`: the Tree function can inspect leaf values throughout a nested object structure without manually traversing every level. MuleSoft documents `filterObjectLeafs` as a Tree-module function introduced in DataWeave 2.4.0. citeturn2search20

## Q76 — How can `filterArrayLeafs` filter leaf values inside nested arrays?

**Answer:** `filterArrayLeafs` applies a condition to simple or null leaf values contained in arrays at any level of the input. A leaf is retained when the condition is true and removed when it is false.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Tree
output application/json
---
[
  1,
  2,
  { values: [1, 2, 3] },
  [2, 4]
] filterArrayLeafs ((value, path) -> value is Number and value mod 2 == 0)
```

**Output**
```json
[
  2,
  {
    "values": [2]
  },
  [2, 4]
]
```

**Explanation:** `filterArrayLeafs` is useful when the filtering rule must reach array leaves throughout a nested tree. It differs from ordinary `filter`, which operates on the elements of one array expression. MuleSoft documents it as a Tree-module function introduced in DataWeave 2.4.0. citeturn2search13

## Q77 — How can `dw::util::Timer::duration` measure the execution time of a DataWeave function?

**Answer:** `duration` executes a supplied function and returns an object containing the elapsed execution time in milliseconds and the function result.

**Example**
```dataweave
%dw 2.0
import * from dw::util::Timer
output application/json
---
duration(() -> sum([1, 2, 3, 4]))
```

**Output**
```json
{
  "time": 0,
  "result": 10
}
```

**Explanation:** The exact `time` value depends on the runtime, so it is not deterministic. The important result shape is `{time: Number, result: T}`. The Timer module is intended for measuring execution, and MuleSoft documents `duration` as returning elapsed milliseconds together with the function result. citeturn2search2turn2search3