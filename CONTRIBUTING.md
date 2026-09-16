# Contributing

Thank you for helping improve the DataWeave practice library.

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

Do not include secrets, credentials, customer data, or proprietary banking information.

## DataWeave runtime note

Static validation checks structure and script headers. It does not execute every transformation. For runtime-sensitive changes, test with the Mule/DataWeave runtime version used by your project and document any version-specific behavior.
