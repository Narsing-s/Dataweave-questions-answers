# Contributing

Thank you for helping improve the DataWeave practice library.

## How the community workflow works

Use the right GitHub surface for the right kind of contribution:

- **Discussions** — questions, ideas, brainstorming, learning conversations, and proposals that are not ready to become code changes.
- **Issues** — confirmed bugs, scoped improvements, and work that is ready to be implemented.
- **Pull requests** — concrete changes to the repository.

A useful path is:

**Discussion → validated idea → Issue → Pull Request → review → merge → contributor recognition**

GitHub Discussions is intended for open-ended community conversations; once an idea is ready to be scoped, it can move into an Issue. See the repository's Discussions page for community conversations.

## What makes a good question?

A curated question should:

- teach a clear DataWeave concept or production pattern;
- contain realistic input and deterministic expected output;
- use valid DataWeave 2.x syntax;
- explain the transformation in beginner-friendly language;
- mention important null, empty, type, or boundary cases;
- avoid being a trivial rename/number variation of an existing question;
- add useful interview or production context when appropriate.

## Before submitting

1. Search the existing question bank and `REAL-QA` coverage.
2. Confirm that the proposed concept is genuinely new.
3. Explain why nearby existing questions do not already cover it.
4. Include input, solution, and expected output when proposing a complete question.
5. Prefer realistic API/integration, debugging, performance, or interview scenarios over artificial variations.
6. Do not add secrets, credentials, customer data, or proprietary information.

Changing only names, numbers, IDs, business nouns, ordering, or wording is **not** considered new conceptual coverage.

Run:

```bash
python scripts/validate_examples.py
python scripts/generate_10000.py
```

Review generated changes before committing them.

## Pull requests

Include:

1. what changed;
2. why it is useful;
3. how it was verified;
4. any runtime/version assumptions.

For a new question, use the repository's PR checklist and explain the uniqueness of the concept.

## DataWeave runtime note

Static validation checks structure and script headers. It does not execute every transformation. For runtime-sensitive changes, test with the Mule/DataWeave runtime version used by your project and document any version-specific behavior.

## Good first contributions

You do not need to create a large feature to contribute. Good first contributions include:

- finding an incorrect expected output;
- reporting a duplicate or overlapping question;
- improving an explanation or common-mistakes section;
- adding a missing edge case;
- testing an example against a Mule/DataWeave runtime;
- improving documentation or navigation;
- suggesting a genuinely missing DataWeave concept;
- improving the static learning-site UI.

If you are unsure whether an idea is new, start a Discussion before opening a PR.

## Review standard

Maintainers prioritize conceptual uniqueness, correctness, clarity, reproducibility, and learner value over raw question count. A proposed change may be declined when it adds duplicate coverage even if the wording or business example is different.
