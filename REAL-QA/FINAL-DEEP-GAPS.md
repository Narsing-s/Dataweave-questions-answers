# Final Deep DataWeave Gaps

These questions cover language/runtime areas identified after the previous gap pass. They are intentionally different from ordinary map/filter/groupBy practice.

## A238 — Temporal type matrix

**Difficulty:** Advanced

**Question:** What is the difference between `Date`, `LocalDateTime`, `DateTime`, `LocalTime`, `Time`, and `TimeZone`?

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  date: "2026-09-16" as Date,
  localDateTime: "2026-09-16T17:30:00" as LocalDateTime,
  dateTime: "2026-09-16T17:30:00+05:30" as DateTime,
  localTime: "17:30:00" as LocalTime,
  time: "17:30:00+05:30" as Time,
  zone: "Asia/Kolkata" as TimeZone
}
```

**Explanation:** These are distinct DataWeave temporal types. Do not invent timezone information when the source only supplies a local date/time.

## A239 — Generic type parameters

**Difficulty:** Advanced

**Question:** How can one reusable type describe a pair whose two values have different types?

**DataWeave**
```dataweave
%dw 2.0
output application/json
type Pair<A,B> = {first: A, second: B}
fun swap<A,B>(p: Pair<A,B>): Pair<B,A> = {first: p.second, second: p.first}
---
swap({first: "100", second: 25})
```

**Expected output**
```json
{"first":25,"second":"100"}
```

**Explanation:** Type parameters let reusable types express relationships between fields rather than hard-coding one concrete type.

## A240 — Type selection and metadata

**Difficulty:** Advanced

**Question:** How can a type be derived from a nested field of another type?

**DataWeave**
```dataweave
%dw 2.0
output application/json
type Customer = {name: String, age: Number}
type CustomerName = Customer.name
var n: CustomerName = "Ravi"
---
{value: n, type: typeOf(n)}
```

**Expected output**
```json
{"value":"Ravi","type":"String"}
```

**Explanation:** DataWeave supports selecting a type from a field of an existing type. This avoids duplicating type declarations.

## A241 — End-to-end streaming

**Difficulty:** Advanced

**Question:** How can a large JSON array be processed as a stream?

**Mule reader configuration**
```xml
<http:listener config-ref="HTTP_Listener_config"
  path="/orders"
  outputMimeType="application/json; streaming=true"/>
```

**DataWeave writer**
```dataweave
%dw 2.0
output application/json deferred=true
---
payload map (order) -> {id: order.id, amount: order.amount}
```

**Explanation:** Streaming reads supported formats sequentially. `deferred=true` is a writer-side concern. Streaming does not provide random access, so transformations must respect forward-only processing.

## A242 — Tail-recursive function

**Difficulty:** Advanced

**Question:** How can a recursive function be declared as tail recursive?

**DataWeave**
```dataweave
%dw 2.0
output application/json
import * from dw::core::Annotations
@TailRec()
fun sumTo(n: Number, acc: Number = 0) =
  if (n <= 0) acc else sumTo(n - 1, acc + n)
---
sumTo(5)
```

**Expected output:** `15`

**Explanation:** `@TailRec` documents and validates the intended tail-recursive form. Recursion alone does not make a function tail recursive.

## A243 — Stream-capable functions

**Difficulty:** Advanced

**Question:** What does stream-capable mean for a DataWeave function?

**Answer:** A stream-capable parameter can consume array data in a forward-only manner. `map`, `mapObject`, and `pluck` are documented examples. A stream-capable function does not mean every operation around it remains streaming.

**Interview tip:** Check both reader streaming configuration and downstream operations.

## A244 — Java InputStream repeatability

**Difficulty:** Advanced

**Question:** Why can repeatedly processing a Java `InputStream` be unsafe?

**Answer:** A stream can be consumed. DataWeave's Java format can copy an `InputStream`, but a non-repeatable underlying stream may still become unusable after consumption.

**Common mistake:** Treating every `InputStream` like an immutable String.

## A245 — Java 17 POJO interoperability

**Difficulty:** Advanced

**Question:** What characteristics help a Java 17 POJO work reliably through DataWeave Java format?

**Answer:** DataWeave documentation highlights a default constructor and getters/setters for properties when Java reflection is used. Java 17's stronger encapsulation makes arbitrary reflective access less reliable.

**Interview tip:** Separate Java object shape/accessibility from DataWeave transformation logic.

## A246 — Explicit coercion utilities

**Difficulty:** Advanced

**DataWeave**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/json
---
{
  chars: toArray("Mule"),
  flag: toBoolean("true"),
  date: toDate("16-09-2026", ["dd-MM-yyyy"])
}
```

**Expected output**
```json
{"chars":["M","u","l","e"],"flag":true,"date":"2026-09-16"}
```

**Explanation:** The coercions module provides explicit helpers such as `toArray`, `toBoolean`, `toBinary`, `toDate`, and `toDateOrNull`. Explicit conversion is useful at integration boundaries.

## A247 — Dynamic selector

**Difficulty:** Medium

**Input**
```json
{"customer":{"name":"Ravi","email":"ravi@example.com"},"field":"email"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var fieldName = payload.field
---
{selected: payload.customer[fieldName]}
```

**Expected output**
```json
{"selected":"ravi@example.com"}
```

**Explanation:** The field selected at runtime is different from the literal property `fieldName`.

## A248 — Negative array index

**Difficulty:** Easy

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{last: payload.items[-1]}
```

**Input:** `{"items":["A","B","C"]}`

**Expected output:** `{"last":"C"}`

**Explanation:** DataWeave supports negative indexes; `-1` selects the final array element.

## A249 — Key-value selector

**Difficulty:** Medium

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{selectedPair: payload.&name}
```

**Input:** `{"id":"C1","name":"Ravi","status":"ACTIVE"}`

**Expected output:** `{"selectedPair":{"name":"Ravi"}}`

**Explanation:** `.&name` returns the key-value pair rather than only the scalar value returned by `.name`.

## A250 — Explicit XML namespace construction

**Difficulty:** Medium

**DataWeave**
```dataweave
%dw 2.0
output application/xml
ns c "urn:customer"
---
c#customer: {
  c#id: "C1",
  c#name: "Ravi"
}
```

**Explanation:** Selecting a namespace-qualified input field and constructing a namespace-qualified output element are separate skills. The namespace URI, not merely the prefix, identifies the namespace.

## A251 — DataWeave language-level compatibility

**Difficulty:** Advanced

**Question:** Why should a DataWeave feature be checked against the application's language level instead of only the Mule runtime version?

**Answer:** DataWeave documents features and system properties by language level. A newer runtime does not automatically mean every language-level feature/property is enabled for every application configuration.

**Interview tip:** Always distinguish Mule runtime version from DataWeave language level when diagnosing compatibility.

## A252 — Deferred output

**Difficulty:** Advanced

**DataWeave**
```dataweave
%dw 2.0
output application/json deferred=true
---
payload map (item) -> {id: item.id}
```

**Explanation:** Deferred output can pass streamed output downstream. It does not by itself enable input streaming; reader streaming and deferred output are separate settings.

## A253 — Result success/error structure

**Difficulty:** Advanced

**Question:** How should a consumer handle a DataWeave result that can contain either `result` or `error`?

**Answer:** Check `success` first. When successful, the value exposes `result`; when unsuccessful, it exposes `error`.

**Common mistake:** Accessing `result` before checking whether execution succeeded.

## A254 — Selector out-of-range behavior

**Difficulty:** Easy

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  last: payload.items[-1],
  missing: payload.items[99] default "NOT_FOUND"
}
```

**Input:** `{"items":["A","B","C"]}`

**Expected output:** `{"last":"C","missing":"NOT_FOUND"}`

**Explanation:** An index beyond the array size returns null, so an explicit default can convert that absence into a business value.

## A255 — Safe nullable date coercion

**Difficulty:** Medium

**DataWeave**
```dataweave
%dw 2.0
import * from dw::util::Coercions
output application/json
---
{birthDate: toDateOrNull(payload.birthDate, ["yyyy-MM-dd"])}
```

**Input:** `{"birthDate":"not-a-date"}`

**Expected output:** `{"birthDate":null}`

**Explanation:** `toDateOrNull` gives a nullable conversion path. Use it only when invalid data is allowed by the business contract; otherwise validation should reject it.

## A256 — Null, blank, and whitespace are separate cases

**Difficulty:** Medium

**Input**
```json
{"a":null,"b":"","c":"   "}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  a: if (payload.a == null) "NULL" else "VALUE",
  b: if (isEmpty(payload.b)) "EMPTY" else "VALUE",
  c: if (isBlank(payload.c)) "BLANK" else "VALUE"
}
```

**Expected output**
```json
{"a":"NULL","b":"EMPTY","c":"BLANK"}
```

**Explanation:** Production mappings should explicitly define whether null, empty, and whitespace-only values are equivalent.

## A257 — XML encoding configuration

**Difficulty:** Advanced

**Question:** Why can an XML declaration's encoding affect a DataWeave transformation?

**Answer:** DataWeave has XML reader configuration controlling whether the encoding declared in XML is honored. Encoding bugs should therefore be investigated at the byte, transport, XML declaration, and reader-configuration levels.

## A258 — CSV streaming unit

**Difficulty:** Advanced

**Question:** What is the basic streaming unit for CSV?

**Answer:** A CSV record is the streaming unit. This differs structurally from JSON, where an array element is the streaming unit, and from XML, where a configured collection is streamed.

## A259 — DataWeave component visibility

**Difficulty:** Advanced

**Question:** Why should reusable DataWeave libraries not assume every `.dwl` file is globally visible?

**Answer:** Newer DataWeave visibility uses named components and component descriptors to determine ownership and visibility of resources. Version/language-level compatibility matters when using `internal` and related visibility features.

## A260 — Remaining research checklist

Before declaring the repository completely exhaustive, inspect the existing bank for conceptual coverage of:

1. Multipart/form-data and binary payload transformations.
2. URI/URL construction and parsing.
3. `dw::Crypto`, hashing, HMAC and secure transformation boundaries.
4. Additional MIME reader/writer properties.
5. Java generic types and object construction.
6. Additional DataWeave annotations.
7. `public`/`private`/`internal` visibility and component packaging.
8. Version/language-level compatibility.
9. Advanced regex and Unicode edge cases.
10. DST and timezone conversion scenarios.
11. `Period`, `TimeZone`, `LocalTime` and temporal arithmetic combinations.
12. URI/Binary/Key/Regex/Namespace coercion matrices.
13. Streaming plus aggregation/sorting/grouping constraints.
14. Advanced XML reader/writer and namespace serialization.
15. Java InputStream lifecycle/repeatability.
16. Deployment/system-property behavior.

These are research targets, not permission to add duplicates. Each candidate must first be compared with the existing repository and added only if its transformation objective is materially different.
