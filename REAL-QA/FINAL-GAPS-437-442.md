# A437-A442 — Additional DataWeave multipart, logging, telemetry, cursor, working-directory, and failure-dump gaps

These questions were selected after reviewing the current DataWeave System Properties reference and searching the curated repository for exact property coverage. Existing large-field, Base64, buffering, scheduler, Java, and general diagnostics topics were excluded where they would create conceptual duplicates.

## A437 — Multipart part default content type

**Difficulty:** Advanced  
**Focus:** Multipart reader/writer behavior / `com.mulesoft.dw.multipart.defaultContentType`

### Question
A DataWeave application receives a `multipart/*` payload in which one part has no `Content-Type` header. The application needs a predictable default content type for that part. Which DataWeave system property controls this behavior and what is its documented default?

### Expected answer
`com.mulesoft.dw.multipart.defaultContentType` controls the default Content-Type assigned to multipart parts when a part does not specify one. Its documented default is `application/octet-stream`.

### Explanation
This property handles missing per-part content-type metadata. It is different from generic multipart parsing or explicitly supplied MIME types because the question concerns the fallback applied only when the part does not provide its own Content-Type.

### Common mistake
Assuming the property overrides an explicitly supplied Content-Type on every multipart part.

### Interview tip
When debugging multipart transformations, distinguish an explicitly declared part MIME type from the reader's fallback MIME type for a missing header.

---

## A438 — Debouncing repeated DataWeave message logs

**Difficulty:** Advanced  
**Focus:** Runtime logging / `com.mulesoft.dw.messageLogging.debounceDuration`

### Question
A Mule application uses a DataWeave message-logging service that supports debounce operations. Repeated identical log events are generating too many entries. Which system property controls how long DataWeave waits before logging the same message again, and what is the documented default?

### Expected answer
`com.mulesoft.dw.messageLogging.debounceDuration` controls the debounce interval in milliseconds for the `MessageLoggingService.logXXXXDebounce` methods. Its documented default is `3000` milliseconds.

### Explanation
The property changes the debounce interval for the DataWeave message-logging service. It is a logging-volume control, not a general transformation timeout or scheduler setting.

### Common mistake
Confusing debounce duration with the CPU watchdog or DataWeave scheduler thread-pool size.

### Interview tip
When investigating excessive runtime logging, separate event-rate control from script execution limits and thread-pool configuration.

---

## A439 — DataWeave telemetry configuration

**Difficulty:** Advanced  
**Focus:** Telemetry / `com.mulesoft.dw.telemetry.*`

### Question
An operations team wants to enable DataWeave telemetry and optionally collect memory statistics while controlling the telemetry event buffer and whether events are published synchronously. Which system properties control these four behaviors, and what are their documented defaults?

### Expected answer
The relevant properties are:

- `com.mulesoft.dw.telemetry.enabled` — enables the DataWeave telemetry service; default `false`.
- `com.mulesoft.dw.telemetry.memory` — enables collection of memory usage statistics; default `false`.
- `com.mulesoft.dw.telemetry.bufferSize` — controls the telemetry event buffer size in bytes; default `1048576`.
- `com.mulesoft.dw.telemetry.sync` — makes telemetry events publish synchronously when `true`; default `false`.

### Explanation
These properties form a telemetry configuration surface rather than transformation logic. Enabling telemetry, collecting memory statistics, sizing its buffer, and selecting synchronous publication are separate controls.

### Common mistake
Treating `telemetry.bufferSize` as the DataWeave payload buffer or assuming telemetry memory collection is enabled whenever telemetry itself is enabled.

### Interview tip
Keep application payload buffering, telemetry buffering, and telemetry memory collection conceptually separate when diagnosing runtime overhead.

---

## A440 — Tracking the origin of cursor-close calls

**Difficulty:** Advanced  
**Focus:** Cursor diagnostics / `com.mulesoft.dw.track.cursor.close`

### Question
A streaming DataWeave application reports that a cursor is being closed unexpectedly, and the team needs the stack trace showing where `CursorProvider#close()` was called. Which system property enables this diagnostic tracking?

### Expected answer
Set `com.mulesoft.dw.track.cursor.close` to `true`. The property tracks the stack trace from which `CursorProvider#close()` is called and is intended for troubleshooting cases such as opening a cursor that has already been closed. Its documented default is `false`.

### Explanation
This is a targeted streaming/cursor diagnostic switch. It does not change normal cursor semantics; it provides additional diagnostic information about cursor closure.

### Common mistake
Assuming the property prevents a cursor from being closed. It only tracks the close call for troubleshooting.

### Interview tip
For streaming failures, distinguish lifecycle diagnostics from settings that actually change buffering or cursor behavior.

---

## A441 — Per-script temporary-directory tracking

**Difficulty:** Advanced  
**Focus:** Working-directory management / `com.mulesoft.dw.workingdirectory.tracking`

### Question
A team troubleshooting temporary-file behavior wants each DataWeave script to generate its temporary files in its own directory so the files can be associated with the script that created them. Which system property enables this behavior, and what is its default?

### Expected answer
Set `com.mulesoft.dw.workingdirectory.tracking` to `true`. With this setting, each script generates temporary files in its own directory. The documented default is `false`.

### Explanation
This property is about temporary working-directory organization and troubleshooting. It is distinct from `com.mulesoft.dw.buffersize`, which controls when input/output buffers spill to temporary files.

### Common mistake
Thinking `workingdirectory.tracking` changes the threshold at which DataWeave creates temporary files.

### Interview tip
Separate temporary-file creation thresholds from temporary-file directory organization when diagnosing DataWeave disk usage.

---

## A442 — Experimental failure input/script dumps

**Difficulty:** Advanced  
**Focus:** Failure diagnostics / `com.mulesoft.dw.dump_files`

### Question
A team troubleshooting a failing DataWeave script needs DataWeave to dump the input context and failing script to a folder so the failure can be reproduced offline. Which system property enables this behavior, where are the files written by default, and what caution applies to the feature?

### Expected answer
Set `com.mulesoft.dw.dump_files` to `true`. The feature dumps the input context and failing script. `com.mulesoft.dw.dump_folder` controls the destination, whose documented default is the `java.io.tmpdir` system-property value. The dump feature is explicitly documented as experimental and may change or be removed in future DataWeave versions.

### Explanation
This is a targeted failure-reproduction diagnostic. It is different from exception-message length, coercion verbosity, Java stack-trace depth, or cursor-close tracking because it captures the failing script and input context for troubleshooting.

### Common mistake
Treating the dump feature as a normal production logging mechanism without considering that it can capture input data and is documented as experimental.

### Interview tip
Use failure-dump facilities deliberately and consider the sensitivity of the captured input before enabling them in a production environment.

---

## Duplication review

Exact repository searches were performed for the selected property names before addition. Existing related concepts were deliberately excluded where they were already covered:

- Large-field chunking (`buffered_char_sequence.enabled`) — already A361.
- Base64 chunking (`base64ChunksEnabled`) — already A310.
- Scheduler sizing — already A436.
- General buffer sizing and temporary-file spill thresholds — already A423.
- Java stack-trace depth — already A435.
- Existing runtime logging service coverage — A352/A354, but those do not cover message-log debounce duration.

The six selected questions therefore target distinct property-specific behaviors rather than rewording existing questions.

## Source basis

The current MuleSoft DataWeave System Properties documentation defines these properties and their documented defaults. System-property availability can depend on the configured DataWeave language level, not only the Mule runtime version.
