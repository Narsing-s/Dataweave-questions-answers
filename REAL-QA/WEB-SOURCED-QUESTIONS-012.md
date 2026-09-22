# Web-Sourced DataWeave Questions — Batch 012

Questions below were selected from current public DataWeave documentation and cross-checked against the repository. Existing or semantically equivalent questions were excluded.

## Q78 — What are DataWeave annotations, and what is `@Since` used for?

**Answer:** DataWeave annotations add metadata to declarations such as functions, parameters, variables, types, imports, and other supported language elements. `@Since(version = "...")` records the DataWeave version in which a feature was introduced.

**Example**
```dataweave
%dw 2.0
@Since(version = "2.4.0")
fun greet(name: String) = "Hello " ++ name
output application/json
---
greet("Narsing")
```

**Output**
```json
"Hello Narsing"
```

**Explanation:** Annotations are metadata rather than transformation logic. `@Since` is useful when documenting library features and their version availability. MuleSoft documents `@Since` as an annotation introduced in DataWeave 2.3.0. citeturn0search5

## Q79 — What does the DataWeave `@TailRec` annotation do?

**Answer:** `@TailRec` marks a function that is expected to be tail recursive. If the annotated function is not tail recursive, DataWeave reports a failure.

**Example**
```dataweave
%dw 2.0
@TailRec()
fun countDown(n: Number, acc: Number = 0) =
    if (n <= 0) acc
    else countDown(n - 1, acc + 1)
output application/json
---
countDown(5)
```

**Output**
```json
5
```

**Explanation:** Tail recursion means the recursive call is the final operation performed by the function. The annotation lets DataWeave validate that the function follows this pattern. citeturn0search5

## Q80 — What is the purpose of the DataWeave `@StreamCapable` annotation?

**Answer:** `@StreamCapable` marks a function parameter as capable of consuming an array in a forward-only manner. This is useful for functions that can process streamed data without requiring random access to the complete input.

**Example**
```dataweave
%dw 2.0
@StreamCapable()
fun firstTwo(items: Array) = items[0 to 1]
output application/json
---
firstTwo([10, 20, 30])
```

**Output**
```json
[10, 20]
```

**Explanation:** The annotation communicates stream capability for library/function metadata. MuleSoft lists functions such as `map`, `mapObject`, and `pluck` as examples of functions with stream-capable parameters. citeturn0search5