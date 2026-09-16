# DataWeave Edge Cases and Testing

A transformation is not complete when it works only for the happy path.

## Test matrix

| Case | Example | Expected concern |
|---|---|---|
| Normal | populated array | correct transformation |
| Empty array | `[]` | empty result, no unexpected null |
| Null | `null` | safe behavior |
| Missing field | `{}` | fallback or omission |
| Empty string | `""` | validation/normalization |
| Whitespace | `"   "` | normalization |
| Duplicate IDs | two records with same ID | deterministic business rule |
| Invalid number | `"ABC"` | controlled handling |
| Invalid date | malformed date | controlled error or fallback |
| Large array | thousands of records | performance |
| Deep nesting | many nested levels | selector correctness |
| Mixed types | number/string | explicit coercion |

## Checklist

- [ ] Input MIME type is correct.
- [ ] Output MIME type is correct.
- [ ] Required fields are validated.
- [ ] Optional fields have defined behavior.
- [ ] Null and empty values are tested.
- [ ] Date and timezone assumptions are documented.
- [ ] Numeric conversion is explicit.
- [ ] Duplicate records have a defined rule.
- [ ] Sensitive fields are not accidentally returned.
- [ ] Large-payload behavior has been considered.
- [ ] Transformation has automated tests where appropriate.

## Debugging approach

1. Confirm the actual input type.
2. Test the smallest failing expression.
3. Inspect intermediate values.
4. Check selectors and array/object expectations.
5. Check coercion and null behavior.
6. Re-run with the original payload.
7. Add a regression test for the discovered issue.

MuleSoft documents `log` as a debugging function that returns the expression value while writing it to the system log. citeturn0search4
