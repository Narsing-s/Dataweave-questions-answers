# A443-A447 — Final DataWeave system-property gaps

These questions were added only after checking the exact property names against the existing curated `REAL-QA` bank. They cover distinct system-property behavior not already represented by A437-A442 or earlier batches.

## A443 — DataWeave temporary-file base directory
**Question:** DataWeave may create temporary files while processing data. Which system property controls the base directory used for those temporary files, and what is its default?

**Answer:** `com.mulesoft.dw.workingdirectory.base` controls the base directory in which DataWeave writes temporary files. Its default is the value of the Java `java.io.tmpdir` system property.

**Example scenario:** A production application needs DataWeave temporary files to be created under a controlled filesystem location rather than the JVM's default temporary directory.

**Explanation:** This property changes the location of DataWeave's temporary working files. It is different from `com.mulesoft.dw.workingdirectory.tracking`, which controls whether each script receives its own temporary-file directory, and from `com.mulesoft.dw.buffersize`, which controls when processed input/output is spilled to temporary files.

**Common mistake:** Assuming `buffersize` changes the temporary-file directory. It does not; `workingdirectory.base` controls the base location.

**Interview tip:** Separate *where* temporary files go (`workingdirectory.base`) from *when* data spills to them (`buffersize`).

## A444 — Synchronous temporary-file deletion
**Question:** What does `com.mulesoft.dw.workingdirectory.delete_sync` change when DataWeave cleans up temporary files, and what is its default?

**Answer:** When `com.mulesoft.dw.workingdirectory.delete_sync` is set to `true`, file deletion occurs synchronously. Its default is `false`.

**Example scenario:** A troubleshooting exercise asks why a deployment's temporary-file cleanup behavior differs when synchronous deletion is explicitly enabled.

**Explanation:** This is a cleanup-behavior setting. It does not determine the temporary-file directory, the buffer spill threshold, or whether each script gets a separate directory.

**Common mistake:** Treating `delete_sync=true` as a setting that prevents temporary files from being created. It only changes the deletion behavior.

**Interview tip:** Remember the distinction between temporary-file creation, location, and cleanup lifecycle.

## A445 — Maximum DataWeave output file size
**Question:** Which DataWeave system property specifies the maximum size, in bytes, of a file written by DataWeave, and what does the default `-1` mean in the documented setting?

**Answer:** `com.mulesoft.dw.workingdirectory.max_output_buffer_size` specifies the maximum size of a file written in bytes. Its documented default is `-1`, representing the default unlimited/no-explicit-size-limit configuration for this property.

**Example scenario:** A deployment needs to understand which system property governs the maximum size of a DataWeave-written file rather than the size at which in-memory buffers spill to temporary files.

**Explanation:** This property is different from `com.mulesoft.dw.buffersize`. `buffersize` controls the size of in-memory input/output buffers before DataWeave uses temporary files, whereas `max_output_buffer_size` specifies the maximum size of a file written in bytes.

**Common mistake:** Confusing a memory/spill threshold with a maximum written-file size.

**Interview tip:** Compare the units and purpose: buffer threshold versus output-file-size limit.

## A446 — Value selector compatibility behavior
**Question:** For older DataWeave language levels 2.3-2.5, what behavior is controlled by `com.mulesoft.dw.valueSelector.selectsAlwaysFirst`, and what trade-off does enabling it introduce?

**Answer:** When set to `true`, DataWeave returns the first occurrence of an element even when that element appears more than once. The documented default is `false`, and enabling the behavior degrades performance. The property is available for language levels 2.3, 2.4, and 2.5.

**Example:** Given XML containing two `<name>` values under the same selected element, enabling the property can make a selector return the first occurrence rather than the later occurrence.

**Explanation:** This is a compatibility property for older language levels, not a general recommendation for current DataWeave applications. It can change selector results when duplicate values occur and has a documented performance trade-off.

**Common mistake:** Assuming the property changes the meaning of all selectors in every DataWeave version. Its documented availability is limited to language levels 2.3-2.5.

**Interview tip:** When discussing compatibility properties, always mention both the behavior change and the language levels where the property applies.

## A447 — Dumper exception stack traces
**Question:** What does the experimental `com.mulesoft.dw.dumper_fill_stacktrace` property do, and when is it relevant?

**Answer:** When `com.mulesoft.dw.dump_files` is set to `true`, `com.mulesoft.dw.dumper_fill_stacktrace` can add the stack trace for dumper exceptions. Its default is `false`. The property is experimental and may change or be removed in future DataWeave versions.

**Example scenario:** A failing DataWeave script is being diagnosed with the experimental dump-file mechanism, and additional stack-trace information about dumper exceptions is required.

**Explanation:** This property supplements the experimental dump-file troubleshooting mechanism; it does not itself enable dumping. `com.mulesoft.dw.dump_files` controls the experimental dump behavior, while `dumper_fill_stacktrace` controls whether dumper exceptions receive stack-trace information.

**Common mistake:** Assuming `dumper_fill_stacktrace=true` alone enables failure dumps.

**Interview tip:** Treat experimental diagnostics separately from normal transformation logic and verify the target DataWeave version before relying on them.

## Source and duplication note

The current MuleSoft DataWeave System Properties documentation lists these properties and their documented behavior/defaults. The repository search was also performed for each exact property name before adding these questions. The current DataWeave 2.12.3 release notes additionally confirm that DataWeave continues to receive system-property and runtime updates in current Mule releases.
