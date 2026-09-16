#!/usr/bin/env python3
"""Static quality checks for the DataWeave example dataset.

This intentionally does not claim to execute DataWeave. For runtime validation,
run the examples through a pinned Mule/DataWeave runtime or the DataWeave
extension/playground appropriate to your project version.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "dataset" / "examples.json"
REQUIRED = {"id", "difficulty", "topic", "question", "input", "output", "dataweave", "explanation", "commonMistakes"}
ALLOWED_LEVELS = {"Beginner", "Intermediate", "Advanced"}

def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    examples = data.get("examples", [])
    ids = set()
    errors = []
    for i, ex in enumerate(examples, 1):
        missing = REQUIRED - ex.keys()
        if missing:
            errors.append(f"#{i} {ex.get('id','?')}: missing {sorted(missing)}")
        if ex.get("id") in ids:
            errors.append(f"#{i}: duplicate id {ex.get('id')}")
        ids.add(ex.get("id"))
        if ex.get("difficulty") not in ALLOWED_LEVELS:
            errors.append(f"#{i} {ex.get('id','?')}: invalid difficulty")
        for field in ("question", "input", "output", "dataweave", "explanation"):
            if not str(ex.get(field, "")).strip():
                errors.append(f"#{i} {ex.get('id','?')}: empty {field}")
        if not str(ex.get("dataweave", "")).lstrip().startswith("%dw 2.0"):
            errors.append(f"#{i} {ex.get('id','?')}: expected DataWeave 2.0 header")
    print(f"Checked {len(examples)} examples")
    if errors:
        print(f"FAILED: {len(errors)} issue(s)")
        print("\n".join(errors))
        raise SystemExit(1)
    print("PASS: schema, IDs, required fields and basic script headers are valid.")

if __name__ == "__main__":
    main()
