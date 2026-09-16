# Additional Unique DataWeave Gaps — A360-A363

These questions are limited to current documented runtime/performance behaviors that are not represented as dedicated questions in the existing curated gap batches. They are intentionally not generic repeats of the existing system-property coverage.

## A360 — DataWeave script parser cache sizing
**Question:** A Mule application executes many DataWeave scripts and experiences parser-cache pressure. What does `mule.weave.script.parser.cache.size` control, and why should it be treated as a runtime capacity/performance setting rather than a transformation rule?

**Scenario:** An operations team needs to tune the number of parsed DataWeave scripts retained by the runtime without changing any mapping logic.

**Expected behavior:** Changing the property changes the configured size of the DataWeave script parser cache. It does not change the semantic output of an otherwise identical transformation.

**Explanation:** Current DataWeave 2.12.3 release notes document `mule.weave.script.parser.cache.size` as a configurable parser-cache size. This is an operational tuning concern: cache sizing can affect reuse and resource consumption, while the transformation itself remains unchanged.

**Common mistake:** Treating the property as a DataWeave language feature or assuming that increasing it automatically improves every workload.

**Interview tip:** Distinguish transformation semantics from runtime cache configuration and explain that cache tuning should be based on workload measurements.

## A361 — Large-field chunking with `buffered_char_sequence.enabled`
**Question:** A transformation receives text containing fields larger than 1.5 MB. How does `com.mulesoft.dw.buffered_char_sequence.enabled` change the handling of large character fields, and what trade-off should an engineer consider?

**Scenario:** The application processes large text fields and wants to reduce the risk of loading an entire large field into memory at once.

**Expected behavior:** When the documented feature is enabled, DataWeave can process sufficiently large fields by chunks instead of loading the complete large field into memory, reducing out-of-memory risk at the cost of some performance overhead.

**Explanation:** The current DataWeave system-properties documentation describes this property for language levels 2.11 and 2.12 and documents a default of `true`. It is a memory-management/performance control, not a change to the business transformation objective.

**Common mistake:** Assuming chunking means the transformation becomes universally faster or that all payloads become streaming automatically.

**Interview tip:** Explain the difference between reducing peak memory usage and reducing total processing time.

## A362 — JavaBean cache isolation per application
**Question:** Multiple Mule applications use DataWeave JavaBean conversion. Why can `com.mulesoft.dw.java.per_app_java_bean_cache` matter in a multi-application runtime, and what problem does a per-application cache address?

**Scenario:** A shared Mule runtime hosts several applications and JavaBean conversion/cache behavior needs application isolation.

**Expected behavior:** When enabled, the `JavaBeanHelper` uses a per-application cache owned by `WeaveExpressionLanguage` rather than a global singleton cache.

**Explanation:** Current DataWeave system-property documentation describes this property for language level 2.12 and explains that the per-application cache avoids weak-value eviction behavior that can orphan Caffeine's `evictionLock` under stack exhaustion.

**Common mistake:** Confusing this cache with the DataWeave script parser cache or assuming it changes Java-to-DataWeave type mappings.

**Interview tip:** Separate semantic Java mapping rules from the runtime cache used to implement JavaBean conversion.

## A363 — Java 17 JPMS access restrictions at the DataWeave boundary
**Question:** A Mule application running on Java 17 encounters Java Platform Module System access restrictions while DataWeave interacts with Java types. What runtime behavior should an integration developer understand before changing transformation code?

**Scenario:** The same DataWeave mapping works with one Java type but encounters access restrictions with a type affected by JPMS encapsulation.

**Expected behavior:** Current DataWeave 2.12.2 release notes document improved handling of JPMS access restrictions on Java 17 and later for supported Mule runtime versions. The issue is a Java/runtime access boundary rather than an ordinary DataWeave selector or mapping-expression problem.

**Explanation:** JPMS can restrict reflective access to Java internals or non-open packages. DataWeave's documented improvement is a runtime compatibility behavior; it should not be misdiagnosed as a normal transformation-data defect.

**Common mistake:** Changing selectors or adding arbitrary coercions when the actual failure originates from Java module access restrictions.

**Interview tip:** Distinguish DataWeave transformation errors from Java platform access constraints and check the runtime/JDK compatibility context first.
