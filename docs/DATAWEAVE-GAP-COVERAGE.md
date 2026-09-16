# DataWeave Gap Coverage — Additional Material

This document is an additive supplement to the existing DataWeave question banks. Existing files and questions are intentionally not modified.

## Why this supplement exists

The repository already covers the core transformation workflow, large practice banks, curated interview questions, production-oriented transformations, and a Mastering DataWeave-inspired section. The following areas are commonly useful in real MuleSoft/DataWeave work and are worth keeping explicitly documented so learners can verify that they have practiced them.

## Additional topics to cover

### 1. DataWeave language fundamentals

- `var` and `fun` declarations
- `do` scopes and `using`
- local variables and variable shadowing
- type annotations and custom types
- type aliases
- `is`, `as`, and `as Type { format: ... }`
- coercion between String, Number, Boolean, Date, DateTime, LocalDateTime and LocalDate
- `null` versus `[]` versus `{}` versus missing keys
- `default` versus explicit null handling
- `if / else if / else`
- `match` and `else`
- `case` guards and pattern matching
- `try`, `orElse`, and error-safe expressions

### 2. Selector mastery

- single-value selectors
- multi-value selectors
- descendant selectors (`..`)
- dynamic selectors (`.[expression]`)
- key-value selectors
- index selectors
- range selectors
- optional selectors (`?`)
- selectors on null and missing fields
- selectors through deeply nested arrays and objects

### 3. Core collection functions

Make sure practice includes distinct examples for:

`map`, `mapObject`, `filter`, `filterObject`, `reduce`, `flatMap`, `flatten`, `pluck`, `groupBy`, `orderBy`, `distinctBy`, `some`, `every`, `everyEntry`, `contains`, `indexOf`, `find`, `findIndex`, `first`, `last`, `take`, `drop`, `takeWhile`, `dropWhile`, `slice`, `sizeOf`, `isEmpty`, `min`, `max`, `sum`, `avg`, `countBy`, `joinBy`, `splitBy`, and `zip`-style transformations.

### 4. String processing

- `trim`
- `upper` / `lower`
- `capitalize`
- substring extraction
- prefix/suffix checks
- replacement with literal text
- replacement with regular expressions
- regex extraction
- split and join
- padding
- repeating strings
- escaping and unescaping
- normalization of whitespace
- phone/email/reference-number normalization

### 5. Object construction and dynamic keys

- dynamic object keys
- dynamic values
- conditional fields
- conditional object fragments
- merging objects
- removing fields
- renaming fields
- `update`
- `case`-based object construction
- converting arrays to keyed objects
- converting objects to arrays of key/value records
- handling duplicate keys deliberately

### 6. Dates and times

- String to Date
- Date to String
- DateTime parsing
- LocalDateTime parsing
- timezone-aware transformations
- date arithmetic
- period/duration calculations
- age calculation
- business-day style logic
- month-end and year-end logic
- extracting year/month/day/hour/minute/second
- comparing dates and times
- handling invalid or missing date values

### 7. Numbers and financial transformations

- rounding and decimal precision
- currency formatting
- percentage calculations
- tax calculations
- installment calculations
- balance reconciliation
- positive/negative amount normalization
- aggregation by account/customer/category
- numeric strings versus Numbers
- safe handling of null numeric values

### 8. JSON/XML/CSV interoperability

- JSON arrays to XML
- XML to JSON
- XML attributes
- XML namespaces
- repeated XML elements
- optional XML nodes
- CDATA-related input handling
- CSV with headers
- CSV without headers
- quoted CSV values
- commas/newlines inside CSV fields
- CSV to JSON and JSON to CSV
- output MIME type and writer properties

### 9. MIME types and reader/writer properties

Practice transformations involving:

- `application/json`
- `application/xml`
- `text/csv`
- `application/csv`
- `text/plain`
- reader properties
- writer properties
- CSV separator/quote/header options
- XML declaration and writer configuration

### 10. Reusable DataWeave modules

- importing functions
- importing types
- importing modules
- namespace aliases
- reusable utility functions
- shared mapping functions
- separating business rules from mapping code
- avoiding repeated transformation logic

### 11. MuleSoft runtime integration

Explicit examples should cover DataWeave used with:

- `payload`
- `attributes`
- `vars`
- `message`
- HTTP request/response attributes
- query parameters
- URI parameters
- headers
- status codes
- database connector results
- Salesforce connector results
- JMS/MQ message bodies and properties
- file connector content and attributes
- error objects
- batch-style records

### 12. Error handling and observability

- safe field access
- predictable fallback values
- transformation failures
- `try` expressions
- error payload normalization
- logging without leaking sensitive values
- correlation/reference IDs
- standard API error response shapes
- validation error aggregation

### 13. Production-quality transformation patterns

- idempotent mappings
- deterministic output ordering
- duplicate detection
- reconciliation between two datasets
- lookup-table joins
- parent/child aggregation
- enrichment from reference data
- change detection
- before/after comparison
- partial updates
- field-level patch generation
- canonicalization before comparison

### 14. Performance and maintainability

- avoiding unnecessary nested traversals
- selecting only required fields
- reducing repeated calculations
- choosing `map` versus `mapObject`
- choosing `filter` versus `filterObject`
- avoiding accidental Cartesian-style expansions
- streaming-aware transformation design
- memory considerations for large arrays
- readable versus overly clever one-liners
- extracting reusable functions

### 15. Interview/output-prediction practice

Include problems where the learner must predict the exact result for:

- nested `map`
- `filter` plus `map`
- `reduce`
- `groupBy`
- `distinctBy`
- `orderBy`
- `mapObject` plus `pluck`
- null propagation
- default values
- coercion
- dates
- dynamic keys
- XML selectors
- conditional object fields
- `match`
- `update`
- function calls
- local variables

### 16. Real integration scenarios

Useful end-to-end practice should include synthetic examples for:

- customer profile normalization
- bank account response mapping
- payment request normalization
- beneficiary validation mapping
- order transformation
- inventory reconciliation
- employee data synchronization
- Salesforce-to-REST mapping
- REST-to-SOAP mapping
- SOAP-to-REST mapping
- database result to API response
- API response to database-ready structure
- MQ message to canonical event
- canonical event to downstream API
- error response standardization

## Verification rule

This is a coverage checklist, not a claim that every item is absent from the existing generated or curated banks. Some topics may already exist in individual questions. The purpose is to make potentially overlooked areas explicit without modifying existing repository content.

## Additive policy

- Do not delete existing questions.
- Do not rewrite existing questions.
- Do not renumber existing questions.
- Do not replace generated records with hand-authored records.
- Do not duplicate an existing question merely by changing names or numbers.
- Add new material as separate files or new uniquely identified records.
