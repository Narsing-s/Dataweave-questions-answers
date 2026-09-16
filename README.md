# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical MuleSoft DataWeave learning library built around one workflow:

**Question → Input → DataWeave Answer → Expected Output → Step-by-Step Explanation → Common Mistakes → Interview Tip**

## 🚀 10,000 complete Q&A examples

The repository contains exactly **10,000 ordered DataWeave examples**, from `DW-00001` through `DW-10000`, organized across Easy, Medium, and Advanced levels.

Every question is intended to be a readable learning record—not just a folder name. Each record contains:

- Question
- Difficulty
- Topic
- Real input
- Complete DataWeave 2.x answer
- Expected output
- Detailed explanation
- Common mistakes / edge cases
- Interview tip

## 📚 Read the questions directly in GitHub

The question banks are published as Markdown files so you can open and study the questions directly without opening JSON or running a script.

- [Easy Q&A](./EASY/README.md)
- [Medium Q&A](./MEDIUM/README.md)
- [Advanced Q&A](./ADVANCED/README.md)
- [All 10,000 structured records](./dataset/questions-10000.json)

Each level is split into manageable Markdown files so GitHub remains fast and the questions are easy to browse.

## 🛠️ Scripts

Scripts are kept in the repository for regeneration and validation. They are **not a replacement for the published questions**.

Run locally:

```bash
python scripts/generate_10000.py
```

The generated dataset is written to:

```text
dataset/questions-10000.json
```

and the readable question banks are written under:

```text
EASY/
MEDIUM/
ADVANCED/
```

## 🟢 Easy
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

## 🟡 Medium
- Nested objects and arrays
- Object transformations
- Collection operations
- Null handling
- Type conversion
- Reusable transformation patterns
- API response mapping
- Real MuleSoft mapping scenarios

## 🔴 Advanced
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
Difficulty: Easy
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
DataWeave reads payload.value and applies upper() to convert the string to uppercase.

COMMON MISTAKES
Check null values and input types before applying the function.

INTERVIEW TIP
Explain the input-to-output change and what happens for null or unexpected input.
```

## 🔎 Example Explorer

`examples.html` loads the complete 10,000-question dataset and supports search/filtering by question, DataWeave function, topic, difficulty, and input/output content.

## 🧪 Quality checks

GitHub Actions validates the generated dataset and the presence of readable Easy/Medium/Advanced Markdown question banks.

Generated transformations should still be runtime-tested against the Mule/DataWeave version used by the target application before production use.

## 🏗️ Repository structure

```text
.
├── index.html
├── examples.html
├── EASY/
│   ├── README.md
│   └── questions-*.md
├── MEDIUM/
│   ├── README.md
│   └── questions-*.md
├── ADVANCED/
│   ├── README.md
│   └── questions-*.md
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

## License

License details will be added when the project's contribution and redistribution policy is finalized.
