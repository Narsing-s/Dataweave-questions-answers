# Deeper DataWeave Q&A Gaps — 261–276

This batch closes the remaining research checklist from `FINAL-DEEP-GAPS.md`. Each item targets a distinct feature, runtime behavior, or integration boundary rather than another cosmetic `map`/`filter` variation.

## A261 — Multipart form-data part construction

**Difficulty:** Advanced

**Question:** How can DataWeave construct a `multipart/form-data` payload containing JSON metadata and a binary file part?

**DataWeave**
```dataweave
%dw 2.0
output multipart/form-data
---
{
  metadata: {
    headers: {
      "Content-Disposition": {name: "metadata"},
      "Content-Type": "application/json"
    },
    content: {customerId: "C100", documentType: "KYC"}
  },
  document: {
    headers: {
      "Content-Disposition": {name: "document", filename: "proof.txt"},
      "Content-Type": "text/plain"
    },
    content: "proof document" as Binary {class: "java.lang.String"}
  }
}
```

**Expected result:** A multipart payload with two separately typed parts.

**Explanation:** Multipart transformation is a payload-format problem, not merely an object transformation. Each part can carry headers and content, and the boundary separates parts.

**Common mistake:** Treating multipart output as ordinary JSON.

**Interview tip:** Know where part metadata ends and part content begins.

## A262 — Multipart boundary and default content type

**Difficulty:** Advanced

**Question:** Why can a multipart transformation require an explicit boundary or default content type?

**DataWeave**
```dataweave
%dw 2.0
output multipart/form-data boundary="----DWBoundary" 
deferred=true
---
{
  file: {
    headers: {"Content-Type": "application/octet-stream"},
    content: "hello" as Binary
  }
}
```

**Expected result:** A deferred multipart stream using the specified boundary.

**Explanation:** Multipart readers and writers use boundaries to delimit parts. A part without an explicit content type can also depend on the configured multipart default content type.

**Common mistake:** Assuming the boundary is just an arbitrary JSON field.

**Interview tip:** Separate MIME configuration from the DataWeave object that represents parts.

## A263 — HMAC signature generation

**Difficulty:** Advanced

**Question:** How can DataWeave generate an HMAC signature for a request body?

**DataWeave**
```dataweave
%dw 2.0
import * from dw::Crypto
output application/json
var secret = "shared-secret" as Binary
var body = '{"amount":100}' as Binary
---
{
  signature: toBase64(HMACBinary(secret, body, "HmacSHA256"))
}
```

**Expected result:** A Base64-encoded HMAC-SHA256 signature string.

**Explanation:** HMAC uses a secret key and content to produce a keyed digest. The output is binary, so encoding it for an HTTP header is a separate transformation step.

**Common mistake:** Hashing the body without the secret when the protocol requires HMAC.

**Interview tip:** Keep canonicalization, secret handling, hashing, and transport encoding as separate concerns.

## A264 — Cryptographic algorithm validation

**Difficulty:** Advanced

**Question:** What problem does `@CryptographicSink` address when a DataWeave function accepts an algorithm name?

**DataWeave**
```dataweave
%dw 2.0
import * from dw::Crypto
import * from dw::core::Binaries
output application/json
fun digest(data: Binary, @CryptographicSink algorithm: String) =
  Crypto::hashWith(data, algorithm)
---
{hash: toBase64(digest("customer" as Binary, "SHA-256"))}
```

**Expected result:** A Base64 digest when the configured security policy permits the algorithm.

**Explanation:** The annotation marks an algorithm parameter as a cryptographic sink so the compiler can apply security-oriented validation in supported configurations.

**Common mistake:** Treating the annotation as runtime encryption itself.

**Interview tip:** Distinguish cryptographic computation from compile-time security/taint analysis.

## A265 — URI value versus ordinary String

**Difficulty:** Medium

**Question:** When should a URI be represented as a DataWeave `Uri` instead of an ordinary string?

**DataWeave**
```dataweave
%dw 2.0
output application/json
var endpoint = "https://api.example.com/customers/C100" as Uri
---
{
  uri: endpoint as String,
  type: typeOf(endpoint)
}
```

**Expected output**
```json
{"uri":"https://api.example.com/customers/C100","type":"Uri"}
```

**Explanation:** `Uri` is a distinct DataWeave type. Preserving the semantic type can make coercion and type-aware transformations explicit at integration boundaries.

**Common mistake:** Assuming every URL-like value is automatically a `Uri`.

**Interview tip:** Ask whether the downstream contract needs a URI semantic type or simply text.

## A266 — URI parsing with query parameters

**Difficulty:** Medium

**Question:** How can a transformation safely separate the path and query portion of an incoming URI before building an outbound request object?

**DataWeave**
```dataweave
%dw 2.0
output application/json
var requestUri = "https://api.example.com/orders?status=OPEN&limit=10"
---
{
  original: requestUri,
  queryString: ((requestUri splitBy "?")[1]) default "",
  queryParameters: ((requestUri splitBy "?")[1] default "")
    splitBy "&"
    filter ($ != "")
    map ((item) -> {
      name: (item splitBy "=")[0],
      value: (item splitBy "=")[1] default ""
    })
}
```

**Expected output**
```json
{
  "original":"https://api.example.com/orders?status=OPEN&limit=10",
  "queryString":"status=OPEN&limit=10",
  "queryParameters":[{"name":"status","value":"OPEN"},{"name":"limit","value":"10"}]
}
```

**Explanation:** The exercise focuses on URI boundary parsing and query extraction rather than generic string splitting in isolation.

**Common mistake:** Ignoring the case where a URI has no query string.

**Interview tip:** In production, prefer the transport/API component's parsed query parameters when available rather than reparsing a raw URL unnecessarily.

## A267 — Binary round-trip with Base64

**Difficulty:** Medium

**Question:** How can binary content be converted to Base64 text and then restored to binary without changing the payload bytes?

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Binaries
output application/json
var original = "Mule" as Binary
var encoded = toBase64(original)
var restored = fromBase64(encoded)
---
{
  encoded: encoded,
  roundTrip: restored as String
}
```

**Expected output**
```json
{"encoded":"TXVsZQ==","roundTrip":"Mule"}
```

**Explanation:** Base64 is an encoding of bytes, not encryption. The round trip should preserve the original binary content.

**Common mistake:** Treating Base64 text as if it were cryptographic protection.

**Interview tip:** Distinguish encoding, compression, hashing, and encryption.

## A268 — Binary format writer properties

**Difficulty:** Advanced

**Question:** What is the design difference between `deferred`, `bufferSize`, and `writeIndex` when writing DataWeave Binary (`application/dwb`)?

**DataWeave**
```dataweave
%dw 2.0
output application/dwb deferred=true bufferSize=16384 writeIndex=true
---
{
  id: "C100",
  status: "ACTIVE"
}
```

**Expected result:** A DWB binary representation produced with deferred output, a configured writer buffer size, and an index written for later reading.

**Explanation:** These properties affect output generation and reading characteristics; they are not transformation operators on the object itself.

**Common mistake:** Assuming `bufferSize` changes the business data.

**Interview tip:** Separate data semantics from format/runtime performance settings.

## A269 — Java `Optional` mapping

**Difficulty:** Advanced

**Question:** How does DataWeave conceptually map Java `Optional` values?

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  present: payload.present,
  absent: payload.absent
}
```

**Input from Java**
```text
present = Optional.of("Ravi")
absent  = Optional.empty()
```

**Expected output**
```json
{"present":"Ravi","absent":null}
```

**Explanation:** DataWeave's Java format maps `java.util.Optional` to a DataWeave value or `Null`. The transformation should therefore handle the absent case explicitly.

**Common mistake:** Assuming an empty Optional behaves like an empty string.

**Interview tip:** Know the Java-to-DataWeave type mapping before designing null/default logic.

## A270 — Java metadata class selection

**Difficulty:** Advanced

**Question:** How can Java output metadata tell DataWeave which Java class should be created?

**DataWeave**
```dataweave
%dw 2.0
output application/java
---
{
  name: "Ravi",
  active: true
} as Object {class: "com.example.Customer"}
```

**Expected result:** A Java-format value carrying class metadata for `com.example.Customer`, assuming the class is available and compatible with the Java format.

**Explanation:** DataWeave Java output can use class metadata to determine the target Java class. The Java class itself must satisfy the runtime's interoperability requirements.

**Common mistake:** Confusing DataWeave `Object` shape with a guaranteed Java object instance without class metadata.

**Interview tip:** Separate logical DataWeave shape from Java object construction.

## A271 — Java enum conversion

**Difficulty:** Advanced

**Question:** How can DataWeave identify a Java enum value when producing Java output?

**DataWeave**
```dataweave
%dw 2.0
output application/java
---
{
  gender: "Female" as Enum {class: "com.example.Gender"}
}
```

**Expected result:** A Java-compatible enum value for `com.example.Gender.Female`, assuming that enum constant exists.

**Explanation:** The Java format provides an `Enum` custom type and uses class metadata to identify the enum class.

**Common mistake:** Passing an arbitrary string and assuming DataWeave will infer the enum class.

**Interview tip:** Java enum interoperability requires both the symbolic value and target class information.

## A272 — Type coercion matrix for `Key`, `Regex`, and `Namespace`

**Difficulty:** Advanced

**Question:** Why should coercion to `String` be treated as a type-system operation rather than a generic `toString()` assumption?

**DataWeave**
```dataweave
%dw 2.0
output application/json
var key = "customer" as Key
var pattern = /cust.*/ as Regex
ns c "urn:customer"
---
{
  keyText: key as String,
  regexText: pattern as String,
  namespaceText: c as String
}
```

**Expected result:** String representations of the supported DataWeave semantic types.

**Explanation:** DataWeave defines specific coercion rules for several semantic types, including `Key`, `Regex`, and `Namespace`. Their string forms should not be guessed from unrelated Java behavior.

**Common mistake:** Assuming every complex DataWeave type has the same textual representation.

**Interview tip:** Consult the DataWeave coercion/type rules when a transformation crosses a typed boundary.

## A273 — DST-safe timezone conversion

**Difficulty:** Advanced

**Question:** Why can adding a fixed number of hours be incorrect when converting a `DateTime` across daylight-saving changes?

**DataWeave**
```dataweave
%dw 2.0
output application/json
var instant = "2026-11-01T05:30:00Z" as DateTime
---
{
  instant: instant,
  newYork: instant >> "America/New_York"
}
```

**Expected output:** A `DateTime` representing the same instant with the target timezone applied.

**Explanation:** Timezone conversion preserves the instant while representing it in another zone. Fixed-hour arithmetic can fail around DST transitions because the zone offset can change.

**Common mistake:** Treating timezone conversion as `date + 5 hours`.

**Interview tip:** Preserve the instant first; apply timezone semantics second.

## A274 — Period arithmetic versus fixed duration

**Difficulty:** Advanced

**Question:** When should calendar-based `Period` arithmetic be preferred over adding a fixed number of seconds?

**DataWeave**
```dataweave
%dw 2.0
output application/json
var start = "2026-01-31" as Date
---
{
  start: start,
  oneMonthLater: start + |P1M|
}
```

**Expected output:** A calendar-adjusted `Date` produced using a one-month period.

**Explanation:** A calendar month is not a fixed number of seconds. Period arithmetic expresses calendar intent and should be evaluated according to temporal type semantics.

**Common mistake:** Replacing a month period with `30 * 24 * 60 * 60` seconds.

**Interview tip:** Choose temporal arithmetic based on business meaning: calendar period versus elapsed duration.

## A275 — Streaming versus non-streaming aggregation

**Difficulty:** Advanced

**Question:** Why can sorting or arbitrary grouping change the memory characteristics of an otherwise streaming transformation?

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload
  map ((item) -> {id: item.id, amount: item.amount})
  orderBy $.amount
```

**Input**
```json
[
  {"id":"A","amount":30},
  {"id":"B","amount":10},
  {"id":"C","amount":20}
]
```

**Expected output**
```json
[
  {"id":"B","amount":10},
  {"id":"C","amount":20},
  {"id":"A","amount":30}
]
```

**Explanation:** A streaming input is sequential. Operations such as sorting generally need to see multiple records before producing globally ordered output, so the end-to-end pipeline may no longer have the same streaming/memory behavior.

**Common mistake:** Assuming that enabling `streaming=true` makes every downstream function constant-memory.

**Interview tip:** Analyze streaming as a pipeline property, not as a switch that makes every operator streaming.

## A276 — System-property-driven memory behavior

**Difficulty:** Advanced

**Question:** Why can DataWeave system properties matter for production behavior even though they do not change the transformation expression?

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  records: sizeOf(payload),
  total: sum(payload.amount)
}
```

**Input**
```json
[
  {"amount":10},
  {"amount":20},
  {"amount":30}
]
```

**Expected output**
```json
{"records":3,"total":60}
```

**Explanation:** The expression's logical result is independent of configuration, but DataWeave system properties can affect memory allocation, indexed-reader behavior, Base64 chunk processing, multipart defaults, Java reflection behavior, and other runtime characteristics. These properties are also tied to DataWeave language-level compatibility.

**Common mistake:** Debugging a production memory/performance issue by looking only at the transformation expression.

**Interview tip:** For production incidents, inspect the DataWeave language level, reader/writer configuration, and relevant system properties together.
