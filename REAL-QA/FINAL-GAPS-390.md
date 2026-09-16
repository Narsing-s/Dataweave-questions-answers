# DataWeave Runtime and Temporal Edge-Case Gap — A390

This question covers a documented DataWeave maintenance-line behavior that was not represented by a dedicated question in the curated bank. It is intentionally narrower than the existing generic DST/time-zone questions because it tests the semantics of `atBeginningOfDay` specifically.

## A390 — `atBeginningOfDay` must use the midnight offset on DST days

**Difficulty:** Advanced  
**Topic:** Temporal functions, DST-aware offset resolution, maintenance-version behavior

### Question

A flow receives a `DateTime` whose date falls on a daylight-saving transition day. The input value carries the offset that applies at the supplied time, but the offset at local midnight for that date is different. You need the start of that local calendar day.

What should a DataWeave implementation using `atBeginningOfDay` preserve about the timezone offset, and why is simply assuming that the input offset remains unchanged incorrect?

### DataWeave

```dataweave
%dw 2.0
import atBeginningOfDay from dw::core::Dates
output application/json
---
{
  startOfLocalDay: atBeginningOfDay(payload.eventTime)
}
```

### Expected behavior

For a DST-transition date, `atBeginningOfDay` resolves the result to local midnight **using the offset applicable at midnight**, rather than blindly retaining the offset carried by the input `DateTime`.

The important distinction is:

- the input offset describes the supplied instant/time;
- the result represents the beginning of that local calendar day;
- on a DST day those offsets can differ;
- therefore the result must use the midnight offset.

### Explanation

A DateTime's offset is not necessarily constant throughout a DST transition date. A function that moves the clock to `00:00:00` must resolve the timezone rules for that new local time instead of copying the original offset as text.

DataWeave's documented maintenance fix for `atBeginningOfDay` changed this behavior so the function returns the midnight offset on DST days instead of the input offset. This is a runtime/version-sensitive temporal edge case rather than a generic `DateTime` formatting problem.

### Common mistake

- Treating a timezone offset as a permanent property of the entire calendar date.
- Implementing the operation as string manipulation such as replacing the time with `00:00:00` while preserving the original numeric offset.
- Testing only ordinary non-DST dates and assuming the same rule always holds.

### Interview tip

When discussing temporal transformations, distinguish **local calendar time**, **timezone rules**, **UTC offset**, and **instant**. DST can make a copied offset incorrect even when the calendar date is unchanged.

### Source note

MuleSoft documents this behavior in the DataWeave 2.11.3 maintenance release notes: `atBeginningOfDay` now returns the midnight offset on DST days instead of the input offset (W-21614817). The same fix is listed in later supported maintenance lines. The repository audit found no dedicated existing question for this function-specific behavior.
