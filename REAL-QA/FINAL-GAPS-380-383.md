# DataWeave Runtime and Edge-Case Gaps — A380-A383

These questions cover distinct documented runtime/edge-case behaviors from the DataWeave 2.9 maintenance line that are not represented by the existing curated bank. They are not generic duplicates of the existing streaming, selector, CSV, or performance questions.

## A380 — Function materialization with a single `var` declaration

**Difficulty:** Advanced  
**Topic:** Function materialization, local variables, runtime evaluation

**Question:** A reusable DataWeave function contains exactly one local `var` declaration before returning its result. What runtime behavior should you expect when the function is materialized?

**Scenario:**
```dataweave
%dw 2.0
fun customerLabel(c) = do {
  var label = upper(c.name)
  ---
  label ++ "-" ++ (c.id as String)
}
---
customerLabel({id: 101, name: "Ravi"})
```

**Expected result:** The function can be materialized and evaluated normally; the presence of the single local variable does not cause a materialization failure.

**Explanation:** A documented DataWeave runtime fix corrected materialization for functions whose body contains a single `var` declaration. This is a runtime-materialization edge case, not a question about ordinary `var` syntax.

**Common mistake:** Assuming any `do`/`var` combination is equivalent to a streaming or lazy-evaluation problem.

**Interview tip:** Distinguish language syntax correctness from historical runtime materialization defects.

---

## A381 — Multibyte characters in a streaming reader

**Difficulty:** Advanced  
**Topic:** Streaming, Unicode, character decoding

**Question:** A streaming input contains UTF-8 characters such as `₹`, `é`, and `中`. What must a correct DataWeave stream reader preserve when decoding the input?

**Input:**
```text
{"name":"Narsing ₹ é 中"}
```

**Expected behavior:** The decoded character sequence must remain intact; a byte boundary splitting a multibyte UTF-8 character must not produce corrupted characters or replacement data.

**Explanation:** Streaming readers process data incrementally, so byte-buffer boundaries can occur in the middle of a multibyte character. The reader must carry enough decoder state across chunks to reconstruct the original Unicode characters.

**Common mistake:** Assuming each input byte can be independently converted to a character.

**Interview tip:** Explain why character decoding must be stateful across streaming buffer boundaries, especially for UTF-8.

---

## A382 — Lazy evaluation of `orderBy` criteria

**Difficulty:** Advanced  
**Topic:** Performance, lazy evaluation, sorting

**Question:** A large array is sorted by a calculated key that is expensive to compute. When should DataWeave evaluate the ordering criterion?

**Scenario:**
```dataweave
%dw 2.0
var orders = [
  {id: 1, customer: "Ravi"},
  {id: 2, customer: "Priya"},
  {id: 3, customer: "David"}
]
fun expensiveKey(o) = upper(o.customer)
---
orders orderBy expensiveKey($)
```

**Expected behavior:** The ordering criterion should be evaluated only as required by the sorting operation rather than eagerly performing unnecessary evaluations unrelated to determining the order.

**Explanation:** This is a performance/runtime behavior of `orderBy`. It is distinct from the general question of how `orderBy` sorts values: the focus here is evaluation strategy for the ordering expression.

**Common mistake:** Treating the ordering expression as if it must be eagerly evaluated for every possible downstream use before sorting begins.

**Interview tip:** Separate the semantics of the sort key from the runtime strategy used to evaluate that key.

---

## A383 — `fromCharCode` with Unicode surrogate characters

**Difficulty:** Advanced  
**Topic:** Unicode, strings, character construction

**Question:** A transformation converts numeric character codes into a string and receives values representing UTF-16 surrogate characters. What must the character-construction function handle correctly?

**Input:**
```dataweave
%dw 2.0
import fromCharCode from dw::core::Strings
---
fromCharCode(0xD83D)
```

**Expected behavior:** Surrogate character values must be handled according to DataWeave's Unicode/string semantics rather than being silently corrupted because the code unit is outside the basic single-code-point range.

**Explanation:** Character construction and Unicode surrogate handling are distinct from ordinary ASCII `fromCharCode` examples. This edge case matters when transformations receive UTF-16 code units from external systems.

**Common mistake:** Assuming every numeric character code represents an independent Unicode scalar value.

**Interview tip:** Know the distinction between Unicode code points, UTF-16 code units, and surrogate pairs when transforming character data.

---

## Source note

These additions are based on MuleSoft's documented DataWeave maintenance-release fixes for function materialization, multibyte stream reading, `orderBy` evaluation, and surrogate-character handling. They were screened against the repository's existing coverage to avoid adding merely reworded duplicates.
