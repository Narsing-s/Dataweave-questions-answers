# Final DataWeave Coverage Gaps — A287-A298

This batch adds only module/runtime capabilities that were not found in the repository's curated question search. These are intentionally different from ordinary transformation exercises.

## A287 — Tree leaf transformation

**Difficulty:** Advanced

**Question:** How can `dw::util::Tree::mapLeafValues` transform every terminal value in a nested structure without manually writing recursion?

```dataweave
%dw 2.0
import * from dw::util::Tree
output application/json
---
mapLeafValues(payload, (value) ->
  if (value is String) upper(value) else value
)
```

**Input**
```json
{"customer":{"name":"ravi","city":"vizag"},"active":true}
```

**Expected output**
```json
{"customer":{"name":"RAVI","city":"VIZAG"},"active":true}
```

**Explanation:** Tree utilities operate on leaf/path structures and can avoid hand-written recursive traversal for this specific class of problem.

## A288 — Tree node existence validation

**Difficulty:** Advanced

**Question:** How can `dw::util::Tree::nodeExists` test whether a nested tree contains a node matching a criterion?

```dataweave
%dw 2.0
import * from dw::util::Tree
output application/json
---
{
  hasTarget: nodeExists(payload, (value) -> value == "ACTIVE")
}
```

**Input**
```json
{"customer":{"status":"ACTIVE","name":"Ravi"}}
```

**Expected output**
```json
{"hasTarget":true}
```

**Explanation:** This is a tree-wide existence query, distinct from filtering one known array or object level.

## A289 — Runtime version introspection

**Difficulty:** Advanced

**Question:** How can a DataWeave script expose the DataWeave engine version at runtime?

```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
{dataWeaveVersion: version()}
```

**Expected result:** An object containing the DataWeave runtime version.

**Explanation:** `dw::Runtime::version` reports the DataWeave version currently executing the script. This can be useful when diagnosing environment differences.

## A290 — Runtime property lookup

**Difficulty:** Advanced

**Question:** How can `dw::Runtime::prop` safely read a DataWeave runtime property that might not exist?

```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
{
  configuredValue: prop("example.property") default "NOT_CONFIGURED"
}
```

**Expected output**
```json
{"configuredValue":"NOT_CONFIGURED"}
```

**Explanation:** `prop` returns the property's value or `null` when it is not defined. The default then makes the absence explicit.

## A291 — Runtime failure with `fail` / `failIf`

**Difficulty:** Advanced

**Question:** How can a DataWeave transformation deliberately stop processing when a business invariant is violated?

```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
var amount = payload.amount
---
if (amount < 0)
  fail("Amount cannot be negative")
else
  {acceptedAmount: amount}
```

**Input**
```json
{"amount":100}
```

**Expected output**
```json
{"acceptedAmount":100}
```

**Explanation:** `fail` creates an explicit DataWeave error. This is different from merely returning an error-shaped JSON object.

## A292 — Runtime `try` and `orElseTry` chaining

**Difficulty:** Advanced

**Question:** How can multiple fallback transformations be attempted using runtime `try` helpers?

```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
try(() -> payload.primary)
  orElseTry(() -> payload.secondary)
  orElse {result: "DEFAULT"}
```

**Input**
```json
{"secondary":"B"}
```

**Expected output**
```json
{"result":"B"}
```

**Explanation:** Chained fallback is useful when multiple alternative extraction strategies can fail. It is different from `default`, which handles null values rather than arbitrary expression errors.

## A293 — Binary hexadecimal encoding

**Difficulty:** Medium

**Question:** How can binary data be represented as hexadecimal text and converted back?

```dataweave
%dw 2.0
import * from dw::core::Binaries
output application/json
var original = "Mule" as Binary
var hex = toHex(original)
---
{
  hex: hex,
  restored: fromHex(hex) as String
}
```

**Expected output**
```json
{"hex":"4d756c65","restored":"Mule"}
```

**Explanation:** Hex encoding is a byte representation, not encryption. The reverse operation restores the original binary content.

## A294 — Binary line processing

**Difficulty:** Advanced

**Question:** How can binary text be split into lines and then written back as binary content?

```dataweave
%dw 2.0
import * from dw::core::Binaries
output application/json
var source = "A\nB\nC" as Binary
var lines = readLinesWith(source, "UTF-8")
var rebuilt = writeLinesWith(lines, "UTF-8", "\n")
---
{
  lines: lines,
  rebuilt: rebuilt as String
}
```

**Expected output**
```json
{"lines":["A","B","C"],"rebuilt":"A\nB\nC"}
```

**Explanation:** This tests binary line processing rather than simply converting an entire binary value to a String.

## A295 — URL encoding of query values

**Difficulty:** Medium

**Question:** Why should a query parameter value be URL-encoded before it is inserted into a URI?

```dataweave
%dw 2.0
import * from dw::core::URL
output application/json
var value = "Ravi & Sons"
---
{
  encoded: encodeURIComponent(value),
  uri: "https://example.com/search?q=" ++ encodeURIComponent(value)
}
```

**Expected output**
```json
{
  "encoded":"Ravi%20%26%20Sons",
  "uri":"https://example.com/search?q=Ravi%20%26%20Sons"
}
```

**Explanation:** URI encoding protects reserved characters from being interpreted as URI syntax.

## A296 — Structural diff of values

**Difficulty:** Advanced

**Question:** How can the DataWeave diff utility identify changes between two structured values?

```dataweave
%dw 2.0
import * from dw::util::Diff
output application/json
var before = {name: "Ravi", active: true}
var after = {name: "Ravi Kumar", active: true}
---
diff(before, after)
```

**Expected result:** A diff structure describing the changed value, according to the DataWeave diff representation.

**Explanation:** A structural diff answers a different problem from equality: it identifies what changed and is useful for audit, reconciliation and change reporting.

## A297 — Function type parameter introspection

**Difficulty:** Advanced

**Question:** How can DataWeave inspect the parameter types and return type of a function type?

```dataweave
%dw 2.0
import * from dw::core::Types
output application/json
fun add(a: Number, b: Number): Number = a + b
var t = typeOf(add)
---
{
  parameters: functionParamTypes(t),
  returnType: functionReturnType(t)
}
```

**Expected result:** Metadata describing two `Number` parameters and a `Number` return type.

**Explanation:** `dw::core::Types` supports introspection of function signatures. This is different from simply checking the runtime value of a function call.

## A298 — Environment-variable presence versus value

**Difficulty:** Medium

**Question:** How can a DataWeave mapping distinguish an undefined environment variable from an environment variable whose value is an empty string?

```dataweave
%dw 2.0
import * from dw::System
output application/json
var configured = envVar("BANK_REGION")
---
{
  configured: configured != null,
  value: configured default "NOT_SET"
}
```

**Expected output when `BANK_REGION` is undefined**
```json
{"configured":false,"value":"NOT_SET"}
```

**Explanation:** `envVar` returns `null` when the variable is not defined. An empty environment variable is a different state and should not automatically be treated as undefined.

## Coverage note

These questions were selected after checking the current DataWeave module reference for Tree, Runtime, Binaries, URL, Diff, Types and System capabilities. Existing repository searches did not return dedicated coverage for these exact module capabilities. Future additions must still pass conceptual duplicate review.
