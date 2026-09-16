# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical MuleSoft DataWeave learning library built around one workflow: **question → input → DataWeave → exact expected output → clear explanation → common mistakes**.

## 🚀 10,000-example practice bank

The repository now contains a deterministic generator for **exactly 10,000 structured DataWeave Q&A examples**. The generated dataset uses IDs `DW-00001` through `DW-10000` and covers beginner, intermediate, and advanced practice.

Run locally:

```bash
python scripts/generate_10000.py
```

This creates:

```text
dataset/questions-10000.json
```

The GitHub Actions workflow also generates and validates the dataset automatically.

## 📚 Coverage

- Fundamentals and object selectors
- Strings and string functions
- Arrays and collections
- `map`, `filter`, and conditional transformations
- Object functions
- `mapObject` / `filterObject` concepts
- Nested structures and collection operations
- Null, default, and type handling
- Numbers and calculations
- Dates and DateTime patterns
- JSON, XML, and CSV transformation patterns
- API-response mappings
- Real-world MuleSoft integration scenarios
- Interview-style transformation practice
- Common mistakes and edge-case guidance

## 📖 Example contract

Every generated example contains:

```text
Example ID
Difficulty
Topic
Question
Input
DataWeave
Expected Output
Plain-English Explanation
Common Mistakes / Edge Cases
```

## 🧪 Quality

The repository validates the generated dataset for:

- exactly 10,000 examples
- sequential unique IDs
- required fields
- supported difficulty metadata
- structured input/output/explanation fields
- DataWeave 2.x script headers

The static validator is separate from runtime execution. A generated transformation should still be runtime-tested against the Mule/DataWeave version used by the target application before production use.

## 🏗️ Repository structure

```text
.
├── index.html
├── examples.html
├── dataset/
│   ├── examples.json              # Curated starter examples
│   └── questions-10000.json       # Generated 10,000-example bank
├── scripts/
│   ├── generate_10000.py          # Deterministic dataset generator
│   └── validate_examples.py       # Static quality checks
├── .github/workflows/
│   ├── pages.yml
│   └── generate-10000-dataset.yml
└── README.md
```

## 🌐 Learning experience

The homepage and Example Explorer are designed for quick practice: search by topic, difficulty, question, DataWeave function, or transformation pattern. The dataset format is also suitable for future AI-assisted learning and code-generation features.

## 🤝 Contribution standard

New examples should be practical and verifiable. Avoid meaningless filler. Each example should have a unique ID, realistic input, exact output, readable DataWeave, a plain-English explanation, and useful edge-case guidance.

## 📚 Reference

Use the official MuleSoft DataWeave language/reference documentation alongside this repository. DataWeave behavior can depend on the DataWeave language level and Mule runtime version.

## License

License details will be added when the project's contribution and redistribution policy is finalized.
