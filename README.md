# DataWeave Lab — Questions, Answers & 10,000+ Examples

A beginner-friendly, practical MuleSoft DataWeave learning library built around one simple idea: **see the input, understand the transformation, and verify the output**.

## 🚀 What is live now

- Interactive homepage in `index.html`
- Searchable Example Explorer in `examples.html`
- Structured dataset in `dataset/examples.json`
- Starter set of 16 documented examples
- Difficulty and topic metadata
- Input → DataWeave → expected output → explanation → common mistakes
- Dataset quality validator in `scripts/validate_examples.py`
- GitHub Pages workflow in `.github/workflows/pages.yml`

The 10,000+ number is the **roadmap target**, not a claim that 10,000 examples are already populated. New examples should be added in validated batches rather than generated as unverified filler.

## 🎯 Learning path

1. Fundamentals
2. Strings
3. Arrays
4. Objects
5. `map`, `filter`, `reduce`
6. `mapObject`, `filterObject`
7. `flatten`, `flatMap` and nested data
8. Dates and DateTime
9. Numbers and calculations
10. Null and default handling
11. JSON transformations
12. XML transformations
13. CSV transformations
14. Database transformations
15. API transformations
16. MQ and file transformations
17. Error handling
18. Real-world MuleSoft scenarios
19. Interview questions
20. Advanced challenges

## 📖 Example contract

Every example should contain:

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

This makes the dataset suitable for humans, search, automated validation and future AI-assisted learning tools.

## 🧪 Quality rules

The repository separates **static quality checks** from **runtime validation**. The validator checks schema completeness, duplicate IDs, difficulty values and basic DataWeave headers. It does not pretend to execute DataWeave.

For runtime-sensitive examples, validate the script against the DataWeave language level used by the target Mule runtime. MuleSoft documents that DataWeave behavior can vary by language level and runtime version.

Run the static validator with:

```bash
python scripts/validate_examples.py
```

## 🏗️ Repository structure

```text
.
├── index.html                         # Modern landing page
├── examples.html                      # Search/filter example explorer
├── dataset/
│   └── examples.json                  # Structured learning dataset
├── scripts/
│   └── validate_examples.py           # Dataset quality checks
├── .github/workflows/
│   └── pages.yml                      # Automatic GitHub Pages deployment
└── README.md
```

## 🌐 Homepage

The repository includes an automatic GitHub Pages workflow. After GitHub Pages is enabled for the repository using **GitHub Actions** as the source, the site can be published at the repository's Pages URL.

## 🤝 Contribution standard

Prefer small, realistic examples over artificially complicated transformations. Every new batch should:

- use a unique ID
- state the input and exact expected output
- explain the transformation in plain English
- include edge cases or common mistakes where useful
- identify the difficulty and topic
- avoid duplicate questions that teach the same thing
- be runtime-validated before being described as verified

## 📚 Official reference

Use the MuleSoft DataWeave language guide and reference documentation alongside this repository. DataWeave scripts have a header and body, support functional transformations such as `map` and `filter`, and use modules for additional functions.

## License

License details will be added when the project's contribution and redistribution policy is finalized.
