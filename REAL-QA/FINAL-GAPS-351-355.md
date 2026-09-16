# Additional Unique DataWeave Gaps — A351-A355

These questions target capabilities not represented as dedicated questions in the existing gap analysis.

## A351 — Custom data-format registration with `@DataFormatExtension`
**Question:** A team builds a DataWeave extension exposing a custom data format. What role does `@DataFormatExtension()` play, and why is annotation-based registration different from merely defining a variable that describes the format?

**Concrete scenario:** A custom module defines a data-format value and marks the registration variable with `@DataFormatExtension()`.

**Expected result:** The DataWeave engine can discover the variable as a custom data-format extension; an unannotated variable is not registered through this mechanism.

**Explanation:** `@DataFormatExtension()` is the registration hook used by the DataWeave engine to discover the variable representing a custom data format.

**Common mistake:** Assuming that declaring a data-format object automatically registers it.

**Interview tip:** Distinguish defining extension metadata from registering that metadata with the DataWeave engine.

## A352 — DataWeave logging configuration by scope and level
**Question:** A library needs `Debug` logging only for one function while the global runtime remains at `Warn`. How should `log-config.dwl` represent the scopes?

**Concrete configuration:**
```dwl
[
  { scope: "Runtime", level: "Warn" },
  { scope: "Function", level: "Debug", module: "com::acme::Orders", function: "normalize" }
]
```

**Expected behavior:** Runtime logging remains at `Warn`, while the targeted function receives the more specific `Debug` rule.

**Explanation:** DataWeave logging supports Runtime, Module, and Function scopes; more specific rules override less specific rules.

**Common mistake:** Enabling `Debug` globally when only one function needs diagnostics.

**Interview tip:** Explain scope precedence and why targeted logging reduces diagnostic noise.

## A353 — Building a `ReaderInput` for dynamic MIME parsing
**Question:** A runtime integration receives binary content whose MIME type is selected dynamically. How can a `ReaderInput` carry the binary value, encoding, reader properties, and MIME type?

**Concrete input:**
```dwl
{
  value: '{"id":101,"name":"Narsing"}' as Binary { encoding: "UTF-8" },
  encoding: "UTF-8",
  properties: {},
  mimeType: "application/json"
}
```

**Expected result:** The runtime reader receives the binary payload as JSON using UTF-8 and the supplied reader properties.

**Explanation:** `ReaderInput` is the runtime input contract containing Binary `value`, optional `encoding`, reader `properties`, and `mimeType`.

**Common mistake:** Passing already parsed JSON where the runtime API expects the Binary value contained in `ReaderInput`.

**Interview tip:** Distinguish a parsed DataWeave value from raw bytes plus reader metadata.

## A354 — Custom `LoggerService` lifecycle
**Question:** A host application executes DataWeave dynamically and needs runtime log events in its monitoring system. What responsibilities belong to `LoggerService` `initialize`, `log`, and `shutdown`?

**Concrete scenario:** The host supplies `initialize`, required `log(level, msg, context)`, and optional `shutdown` callbacks.

**Expected behavior:** Initialization can establish shared context, each log event is forwarded to `log`, and shutdown can flush or finalize buffered diagnostics.

**Explanation:** `LoggerService` is the runtime logging-service contract. Initialization context can be reused by later log calls, allowing correlation metadata to be attached to execution logs.

**Common mistake:** Treating logging callbacks as the transformation result rather than a diagnostic side channel.

**Interview tip:** Explain how lifecycle callbacks integrate DataWeave execution with external observability.

## A355 — Precise source diagnostics with `Position`
**Question:** A tooling service receives a DataWeave `Location` containing `start` and `end` positions. How should it use `index`, `line`, and `column` to map an error back to source?

**Concrete input:**
```dwl
{
  start: { index: 12, line: 2, column: 5 },
  end:   { index: 20, line: 2, column: 13 },
  locationString: "2:5-2:13"
}
```

**Expected result:** Tooling identifies the affected range as line 2, columns 5 through 13 and can use indexes 12 through 20 when its source representation supports them.

**Explanation:** `Position` represents a source position using an absolute index plus line and column coordinates. `Location` positions are optional, so diagnostic tooling must handle incomplete source information safely.

**Common mistake:** Assuming every runtime failure contains both positions.

**Interview tip:** Separate human-readable location text from structured source coordinates used by IDEs and automated diagnostics.
