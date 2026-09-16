# A465-A467 — Current DataWeave annotation gaps

These questions cover current core annotations that were not materially represented elsewhere in the curated bank. They are intentionally focused on annotation semantics rather than repeating earlier visibility, `@Since`, `@Lazy`, `@StreamCapable`, `@DesignOnlyType`, metadata, or runtime-privilege questions.

## A465 — `@GlobalDescription` with overloaded functions
**Question:** A DataWeave module exposes several overloaded versions of a function, but the generated documentation should use one specific documentation description as the function's global description. What problem does `@GlobalDescription` solve, and why is it useful specifically when functions are overloaded?

**Answer:** `@GlobalDescription` identifies which function's documentation description should be used as the function-level description when multiple overloads exist. It avoids having the generated documentation choose an unsuitable overload description as the primary description. The annotation affects documentation selection; it does not change the overload resolution rules used to execute the function.

**Focus:** annotation-driven generated documentation for overloaded functions.

---

## A466 — `@Labels` for function/variable discoverability
**Question:** A DataWeave library contains functions whose implementation names are not the only terms users might search for. How can `@Labels(labels = ["..."])` improve discoverability, and what does it change compared with renaming the function itself?

**Answer:** `@Labels` attaches searchable/discovery labels to a function or variable definition. The labels can provide alternative terms such as related concepts or aliases without changing the actual identifier used by DataWeave code. This separates API naming from discovery metadata: imports and calls continue to use the declared function name while tooling can use the labels to make the definition easier to find.

**Focus:** discovery metadata versus executable identifiers.

---

## A467 — `@Interceptor` annotation wrapping behavior
**Question:** A DataWeave annotation needs to execute wrapper logic around an annotated function while receiving the annotation arguments, target function name, original arguments, and a callback. What role does `@Interceptor` play, and why is the callback important?

**Answer:** `@Interceptor` marks an annotation as an interceptor and associates it with an interceptor function. When the annotation is applied to a target function, the interceptor can run wrapper logic around that function invocation. The callback represents the target invocation, allowing the interceptor to decide whether, when, or how the original function is called and to work with its arguments/result. This is an advanced and experimental extension point and should not be confused with ordinary DataWeave functions or annotations that only attach metadata.

**Focus:** annotation-based function interception and callback-controlled invocation.

---

## Source basis
- MuleSoft Core Annotations documentation: `@GlobalDescription`, `@Labels`, and `@Interceptor` are documented as core annotations. `@Interceptor` is identified as experimental and subject to change. 
