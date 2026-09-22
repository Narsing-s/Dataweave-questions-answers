# Medium DataWeave — Array Deep Practice

These questions fill the **Medium-level array-function gaps** identified during a repository-wide cross-check. They intentionally focus on array operations that were not represented as dedicated Medium questions, while avoiding concepts already covered elsewhere in the repository.

## DW-M226 — Take the first N array elements

**Question:** Return the first three transaction records from an array.

**Input**
```json
[{"id":"T1","amount":100},{"id":"T2","amount":200},{"id":"T3","amount":300},{"id":"T4","amount":400}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload take 3
```

**Expected Output**
```json
[{"id":"T1","amount":100},{"id":"T2","amount":200},{"id":"T3","amount":300}]
```

**Explanation:** `take` keeps the requested number of elements from the beginning of an array.

**Common Mistakes:** Confusing `take` with `slice`, which is useful when both a start and end boundary are required.

**Interview Tip:** Explain how you would implement a simple "first N records" requirement without modifying the source array.

## DW-M227 — Drop the first N array elements

**Question:** Skip the first two transactions and return the remaining records.

**Input**
```json
[{"id":"T1"},{"id":"T2"},{"id":"T3"},{"id":"T4"}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload drop 2
```

**Expected Output**
```json
[{"id":"T3"},{"id":"T4"}]
```

**Explanation:** `drop` removes the specified number of elements from the beginning and returns the remainder.

**Common Mistakes:** Using a filter based on index when the requirement is simply to skip a fixed number of elements.

**Interview Tip:** Compare `drop` with pagination/windowing logic.

## DW-M228 — Slice an array by a range

**Question:** Return transactions at indexes 1 through 3, excluding index 3.

**Input**
```json
["T0","T1","T2","T3","T4"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload[1 to 3]
```

**Expected Output**
```json
["T1","T2","T3"]
```

**Explanation:** A range selector can select a contiguous section of an array using its indexes.

**Common Mistakes:** Assuming the end index is always exclusive. In DataWeave range selection, the specified end index is included.

**Interview Tip:** Always clarify whether the requirement uses inclusive or exclusive boundaries.

## DW-M229 — Take elements while a condition is true

**Question:** Return transactions from the beginning while their amount is below 500. Stop at the first transaction that does not satisfy the condition.

**Input**
```json
[{"id":"T1","amount":100},{"id":"T2","amount":300},{"id":"T3","amount":450},{"id":"T4","amount":800},{"id":"T5","amount":200}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload takeWhile $.amount < 500
```

**Expected Output**
```json
[{"id":"T1","amount":100},{"id":"T2","amount":300},{"id":"T3","amount":450}]
```

**Explanation:** `takeWhile` keeps the leading elements while the predicate remains true. Once the predicate becomes false, later elements are not considered for the result.

**Common Mistakes:** Using `filter`, which would continue checking later elements instead of stopping at the first failure.

**Interview Tip:** The difference between `filter` and `takeWhile` is important for ordered data and threshold-based processing.

## DW-M230 — Drop elements while a condition is true

**Question:** Skip leading transactions whose amount is below 500, then return everything from the first transaction of 500 or more onward.

**Input**
```json
[{"id":"T1","amount":100},{"id":"T2","amount":300},{"id":"T3","amount":700},{"id":"T4","amount":200}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload dropWhile $.amount < 500
```

**Expected Output**
```json
[{"id":"T3","amount":700},{"id":"T4","amount":200}]
```

**Explanation:** `dropWhile` removes leading elements while the predicate is true, then retains the remaining suffix unchanged.

**Common Mistakes:** Using `filter`, which would also remove the later T4 record.

**Interview Tip:** Use `dropWhile` when the position of the first qualifying element matters.

## DW-M231 — Zip two arrays together

**Question:** Combine employee IDs and employee names into paired records.

**Input**
```json
{
  "ids": ["E1","E2","E3"],
  "names": ["Ravi","Sita","John"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
zip(payload.ids, payload.names)
```

**Expected Output**
```json
[
  ["E1","Ravi"],
  ["E2","Sita"],
  ["E3","John"]
]
```

**Explanation:** `zip` combines corresponding positions from two arrays into pairs.

**Common Mistakes:** Assuming it joins records by a business key. It is position-based.

**Interview Tip:** Distinguish positional pairing from key-based joins or lookups.

## DW-M232 — Unzip paired arrays

**Question:** Split paired employee ID/name values back into separate arrays.

**Input**
```json
[
  ["E1","Ravi"],
  ["E2","Sita"],
  ["E3","John"]
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
unzip(payload)
```

**Expected Output**
```json
[
  ["E1","E2","E3"],
  ["Ravi","Sita","John"]
]
```

**Explanation:** `unzip` reverses a zipped sequence into separate arrays of corresponding values.

**Common Mistakes:** Treating the input as an array of arbitrary objects instead of positionally paired values.

**Interview Tip:** Know both `zip` and `unzip` when working with parallel collections.

## DW-M233 — Find the first matching index

**Question:** Return the index of the first transaction whose status is `FAILED`.

**Input**
```json
[{"id":"T1","status":"SUCCESS"},{"id":"T2","status":"SUCCESS"},{"id":"T3","status":"FAILED"},{"id":"T4","status":"FAILED"}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload findIndex ($.status == "FAILED")
```

**Expected Output**
```json
2
```

**Explanation:** `findIndex` returns the index of the first element that satisfies the predicate.

**Common Mistakes:** Using `filter` when only the first matching position is required.

**Interview Tip:** Explain what should happen when no element satisfies the condition.

## DW-M234 — Test whether any array item matches

**Question:** Return `true` when at least one transaction is marked as `FAILED`.

**Input**
```json
[{"status":"SUCCESS"},{"status":"FAILED"},{"status":"SUCCESS"}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
some(payload, (item) -> item.status == "FAILED")
```

**Expected Output**
```json
true
```

**Explanation:** `some` tests whether at least one array element satisfies the supplied condition.

**Common Mistakes:** Filtering the entire array when only a Boolean existence result is required.

**Interview Tip:** Compare `some` with `filter` followed by `sizeOf` and explain why the intent is clearer with `some`.

## DW-M235 — Test whether every array item matches

**Question:** Return `true` only when every payment has status `SUCCESS`.

**Input**
```json
[{"status":"SUCCESS"},{"status":"SUCCESS"},{"status":"SUCCESS"}]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
every(payload, (item) -> item.status == "SUCCESS")
```

**Expected Output**
```json
true
```

**Explanation:** `every` checks whether all elements satisfy the predicate.

**Common Mistakes:** Using `some` when the business rule requires every record to satisfy the condition.

**Interview Tip:** Clearly distinguish "at least one" from "all" validation requirements.
