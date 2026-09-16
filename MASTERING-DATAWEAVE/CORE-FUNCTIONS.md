# DataWeave Core Functions Reference

| Function | Main use | Typical input | Typical output |
|---|---|---|---|
| `map` | Transform array items | Array | Array |
| `filter` | Keep matching array items | Array | Array |
| `mapObject` | Transform object entries | Object | Object |
| `pluck` | Extract object entries to array | Object | Array |
| `groupBy` | Group by criteria | Array/Object | Object |
| `reduce` | Accumulate values | Array | Any |
| `flatten` | Flatten nested arrays | Array | Array |
| `flatMap` | Map and flatten | Array | Array |
| `orderBy` | Sort values | Array | Array |
| `distinctBy` | Remove duplicates by criteria | Array | Array |
| `sizeOf` | Count elements | Collection/String | Number |
| `isEmpty` | Check empty value | Collection | Boolean |
| `default` | Supply fallback | Any | Any |
| `upper` | Uppercase text | String | String |
| `lower` | Lowercase text | String | String |
| `splitBy` | Split text | String | Array |
| `joinBy` | Join array | Array | String |
| `replace` | Replace text | String | String |
| `substring` | Extract text | String | String |
| `read` | Parse text/binary into typed data | String/Binary | Any |
| `write` | Serialize data | Any | String/Binary |
| `log` | Debug an expression | Any | Same value |

## map

`map` iterates over an array and produces a new array. citeturn0search11

```dw
%dw 2.0
output application/json
---
payload map (item, index) -> {
  id: item.id,
  name: upper(item.name)
}
```

## filter

`filter` keeps values for which the predicate returns `true`. If nothing matches, the result is an empty array. citeturn0search6

```dw
%dw 2.0
output application/json
---
payload filter ($.active == true)
```

## mapObject

Use `mapObject` when the input is an object and you need to transform its key/value entries. citeturn0search1

```dw
%dw 2.0
output application/json
---
payload mapObject (value, key) -> {
  (upper(key)): value
}
```

## groupBy

`groupBy` creates an object whose keys are the grouping criteria and whose values contain the matching records. citeturn0search0

```dw
%dw 2.0
output application/json
---
payload groupBy $.city
```

## reduce

`reduce` accumulates array elements into one result. An explicit accumulator is useful when the result needs a known initial type. citeturn0search2

```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = 0) -> acc + item.amount)
```

## Choosing the function

- Need one output record for every input record -> `map`
- Need only matching records -> `filter`
- Need to transform object keys/values -> `mapObject`
- Need object values as an array -> `pluck`
- Need groups -> `groupBy`
- Need one accumulated result -> `reduce`
- Need nested arrays flattened -> `flatten` / `flatMap`

Official MuleSoft Core documentation lists these and many additional functions. citeturn0search4
