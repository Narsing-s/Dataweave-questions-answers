# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical MuleSoft DataWeave learning library built around one workflow:

**Question → Input → DataWeave Answer → Expected Output → Explanation → Common Mistakes → Interview Tip**

## 🚀 What is included

The repository contains an ordered **10,000-record DataWeave practice bank**, with IDs `DW-00001` through `DW-10000`, plus separately maintained readable examples in the Easy, Medium, and Advanced folders.

Each structured record contains:

- Question
- Difficulty
- Topic
- Input
- DataWeave 2.x answer
- Expected output
- Explanation
- Common mistakes / edge cases
- Interview tip

The 10,000-record bank is generated and validated structurally. Individual transformations should still be runtime-tested against the DataWeave/Mule runtime used by a real project. The repository also contains hand-authored examples intended to demonstrate the expected quality and learning style.

## 🌐 Interactive learning site

Open `index.html` for the landing page, then use **Explorer** to search and practice.

The hardened explorer is `explorer.html` and supports:

- Easy / Medium / Advanced navigation
- Topic buttons and topic dropdown
- Full-text search across question, code, input, output and explanation
- Pagination
- Random question
- Copy DataWeave
- Hide/show reference solutions
- Practice-this challenge mode
- Challenge mode with reference solution and expected output
- URL-based topic/level/search filters so homepage cards can open directly into the correct view

`examples.html` remains available as the original interactive explorer implementation.

## 📚 Read the questions directly in GitHub

The question banks are published as Markdown files so you can study the actual questions without opening JSON or running a script.

- [Easy Q&A](./EASY/README.md)
- [Medium Q&A](./MEDIUM/README.md)
- [Advanced Q&A](./ADVANCED/README.md)
- [All structured records](./dataset/questions-10000.json)

Scripts are kept for regeneration/validation; they are not a replacement for the published question files.

## 🧭 Recommended learning path

### 🟢 Easy — build the foundation

1. DataWeave script structure
2. `payload` and selectors
3. Objects and arrays
4. Strings and string functions
5. Numbers and arithmetic
6. `if / else`
7. `default`, `null`, and type checks
8. Basic `map` and `filter`

### 🟡 Medium — become productive

9. Nested objects and arrays
10. `map`, `filter`, `reduce`
11. `flatten` and nested collections
12. `distinctBy`, `groupBy`, `orderBy`
13. `mapObject` and `filterObject`
14. `pluck`, keys and values
15. Type conversion
16. JSON/XML/CSV mappings
17. API request/response transformations
18. Reusable functions and business rules

### 🔴 Advanced — production-style practice

19. Complex nested transformations
20. Dynamic keys and object construction
21. Dates, DateTime and business periods
22. Null/empty/error edge cases
23. Aggregations and normalization
24. API metadata and error responses
25. Database/file/MQ-oriented mappings
26. Performance and maintainability considerations
27. Interview coding and output-prediction problems
28. Real-world MuleSoft scenarios

## 🛠️ Regenerate the structured bank

```bash
python scripts/generate_10000.py
```

Output:

```text
dataset/questions-10000.json
EASY/questions-*.md
MEDIUM/questions-*.md
ADVANCED/questions-*.md
```

GitHub Actions also runs the generation/validation workflow.

## 📖 Example format

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

## 🧪 Quality rules

The repository checks the structured bank for:

- exactly 10,000 records
- sequential IDs
- required fields
- supported difficulty values
- DataWeave script headers
- readable Markdown banks for all three levels

Static validation does **not** prove that every transformation executes successfully on every Mule/DataWeave runtime. Runtime-sensitive examples must be tested against the target runtime before production use.

## 🏗️ Repository structure

```text
.
├── index.html                         # Landing page
├── explorer.html                      # Hardened interactive explorer
├── examples.html                      # Original interactive explorer
├── EASY/
│   ├── README.md
│   ├── 001-core-dataweave-fundamentals.md
│   └── questions-*.md
├── MEDIUM/
│   ├── README.md
│   ├── 001-collections-and-objects.md
│   └── questions-*.md
├── ADVANCED/
│   ├── README.md
│   ├── 001-production-transformations.md
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

New curated questions should contain a meaningful problem, realistic input, valid DataWeave, deterministic expected output, a clear explanation, edge-case guidance, and interview value. Avoid changing only numbers/names while teaching the same concept repeatedly.

## License

License details will be added when the project's contribution and redistribution policy is finalized.
