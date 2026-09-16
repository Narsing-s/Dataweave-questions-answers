#!/usr/bin/env python3
"""Repository audit for the DataWeave Lab.

Checks dataset shape, IDs, required fields, duplicate normalized questions,
and referenced static pages. It intentionally does not claim to execute
DataWeave because a Mule/DataWeave runtime is not bundled with this audit.
"""
from __future__ import annotations
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "dataset" / "questions-10000.json"
REQUIRED = {"id", "difficulty", "topic", "question", "input", "dataweave", "output", "explanation"}
LEVELS = {"Easy", "Medium", "Advanced"}

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", str(s).strip().lower())

def fail(msg: str) -> None:
    raise SystemExit(f"QUALITY AUDIT FAILED: {msg}")

def main() -> None:
    if not DATA.exists():
        fail("dataset/questions-10000.json is missing")
    try:
        data = json.loads(DATA.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"dataset JSON is invalid: {exc}")
    rows = data if isinstance(data, list) else data.get("examples")
    if not isinstance(rows, list):
        fail("dataset must be a list or an object containing examples[]")
    if len(rows) != 10000:
        fail(f"expected 10,000 records, found {len(rows)}")

    ids = [str(x.get("id", "")) for x in rows]
    expected = [f"DW-{i:05d}" for i in range(1, 10001)]
    if ids != expected:
        fail("IDs are not exactly sequential DW-00001 through DW-10000")

    titles: dict[str, str] = {}
    for i, row in enumerate(rows, 1):
        missing = REQUIRED - row.keys()
        if missing:
            fail(f"record {i} missing fields: {sorted(missing)}")
        if row["difficulty"] not in LEVELS:
            fail(f"record {row['id']} has unsupported difficulty {row['difficulty']!r}")
        if not norm(row["question"]):
            fail(f"record {row['id']} has an empty question")
        key = norm(row["question"])
        if key in titles:
            fail(f"duplicate normalized question: {row['id']} and {titles[key]}")
        titles[key] = row["id"]
        if not str(row["dataweave"]).lstrip().startswith("%dw"):
            fail(f"record {row['id']} DataWeave script does not start with %dw")

    required_pages = ["index.html", "explorer.html", "practice-bank.html", "assistant.html", "lab-v2.html"]
    missing_pages = [p for p in required_pages if not (ROOT / p).exists()]
    if missing_pages:
        fail(f"missing required UI pages: {missing_pages}")

    print("QUALITY AUDIT PASSED")
    print(f"records: {len(rows)}")
    print("IDs: sequential")
    print("required fields: present")
    print("normalized question duplicates: none")
    print("DataWeave headers: present")
    print("UI entry pages: present")
    print("runtime execution: not performed by this static audit")

if __name__ == "__main__":
    main()
