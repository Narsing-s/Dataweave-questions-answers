# Question Quality Standard

Every curated DataWeave question should teach a distinct transformation skill and be independently understandable.

## Required fields

Each question should include:

1. Stable ID
2. Difficulty
3. Topic and subtopic
4. Problem statement
5. Input data
6. DataWeave 2.x solution
7. Expected output
8. Step-by-step explanation
9. Why the solution works
10. Common mistakes
11. Edge cases
12. Interview variation or follow-up
13. Runtime/version notes when behavior is version-sensitive

## Quality gates

A question should be rejected or revised when it:

- only changes names or numbers from another question;
- has ambiguous expected output;
- contains production/customer data;
- teaches syntax that is not explained;
- relies on undocumented behavior without a note;
- cannot be reproduced from the supplied input and script;
- claims runtime validation without an actual runtime test.

## Difficulty model

### Easy
One primary concept, small input, predictable output.

### Medium
Multiple concepts, nested data, type conversion, aggregation, or realistic API/file mapping.

### Advanced
Complex transformations, reusable functions, dynamic keys, error/edge handling, performance considerations, or production-style MuleSoft scenarios.

## Deduplication principle

Large question banks should maximize concept coverage rather than artificial record count. Generated records are useful for practice, but curated questions should remain meaningfully different.
