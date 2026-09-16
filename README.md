# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical MuleSoft DataWeave learning library built around one workflow:

**Question → Input → DataWeave Answer → Expected Output → Step-by-Step Explanation → Common Mistakes → Interview Tip**

## 🚀 10,000 complete Q&A examples

The repository contains exactly **10,000 ordered DataWeave examples**, from `DW-00001` through `DW-10000`, organized across Beginner, Intermediate, and Advanced levels.

Every question has an actual learning record—not just a folder name. Each record contains:

- Question
- Difficulty
- Topic
- Real input
- Complete DataWeave 2.x answer
- Exact expected output
- Detailed explanation of what the expression does
- Step-by-step explanation of how the result is produced
- Common mistakes / edge cases
- Interview tip

Run locally:

```bash
python scripts/generate_10000.py
```

The generated dataset is written to:

```text
dataset/questions-10000.json
```

## 📚 Learning levels

### 🟢 Beginner
- DataWeave syntax
- Payload and selectors
- Strings
- Numbers
- Arrays
- Objects
- `map`
- `filter`
- Conditions
- `default`
- Type checks
- Basic transformations

### 🟡 Intermediate
- Nested objects and arrays
- Object transformations
- Collection operations
- Null handling
- Type conversion
- Reusable transformation patterns
- API response mapping
- Real MuleSoft mapping scenarios

### 🔴 Advanced
- Complex transformation patterns
- Conditional business mappings
- Real-world MuleSoft integration scenarios
- Data normalization
- API-oriented transformations
- Edge cases and production considerations
- Interview-focused problems

## 📖 Example format

Every example follows this structure:

```text
DW-00001
Difficulty: Beginner
Topic: Strings

QUESTION
How do you convert a string to uppercase?

INPUT
{"value":"DataWeave"}

DATAWEAVE ANSWER
%dw 2.0
output application/json
---
{ value: upper(payload.value) }

EXPECTED OUTPUT
{"value":"DATAWEAVE"}

EXPLANATION
What this teaches: upper converts the selected string to uppercase.

How it works:
1. DataWeave reads payload.value.
2. upper() converts the characters to uppercase.
3. The converted value is assigned to the output field.
4. The resulting object is returned as JSON.

COMMON MISTAKES
Check null values and input types before applying the function.

INTERVIEW TIP
Explain the input-to-output change and what happens for null or unexpected input.
```

## 🔎 Example Explorer

`examples.html` loads the complete 10,000-question dataset and supports search/filtering by:

- Question
- DataWeave function
- Topic
- Beginner / Intermediate / Advanced
- Input/output content

Each result displays the **question, input, DataWeave answer, expected output, detailed explanation, common mistakes, and interview tip**.

## 🧪 Quality checks

GitHub Actions validates:

- exactly 10,000 examples
- sequential unique IDs
- required Q&A fields
- difficulty metadata
- explanation content
- DataWeave 2.x headers
- generated dataset structure

Generated transformations should still be runtime-tested against the Mule/DataWeave version used by the target application before production use.

## 🏗️ Repository structure

```text
.
├── index.html
├── examples.html
├── dataset/
│   ├── examples.json
│   └── questions-10000.json
├── scripts/
│   ├── generate_10000.py
│   └── validate_examples.py
├── .github/workflows/
│   ├── pages.yml
│   └── generate-10000-dataset.yml
└── README.md
```

## 🤝 Contribution standard

New questions should contain a realistic problem, valid input, readable DataWeave, deterministic expected output, useful explanation, edge-case guidance, and interview value. Avoid meaningless filler or repeated questions with only superficial changes.

## 📚 Reference

Use the official MuleSoft DataWeave language/reference documentation alongside this repository. DataWeave behavior can depend on the DataWeave language level and Mule runtime version.

## License

License details will be added when the project's contribution and redistribution policy is finalized.
