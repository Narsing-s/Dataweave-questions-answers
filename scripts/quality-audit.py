#!/usr/bin/env python3
"""Static repository and dataset integrity audit.

This checks structure and metadata only; it does not execute DataWeave.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "dataset" / "questions-10000.json"
REQUIRED = {"id", "difficulty", "topic", "question", "input", "dataweave", "output", "explanation"}
LEVELS = ["Easy", "Medium", "Advanced"]


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
    if not isinstance(rows, list) or len(rows) != 10000:
        fail(f"expected exactly 10,000 records, found {len(rows) if isinstance(rows, list) else 'invalid'}")
    seen_ids: set[str] = set()
    seen_questions: set[str] = set()
    previous_rank = -1
    for i, row in enumerate(rows, 1):
        missing = REQUIRED - row.keys()
        if missing:
            fail(f"record {i} missing fields: {sorted(missing)}")
        expected_id = f"DW-{i:05d}"
        if row["id"] != expected_id:
            fail(f"record {i} expected ID {expected_id}, found {row['id']}")
        if row["id"] in seen_ids:
            fail(f"duplicate record ID: {row['id']}")
        seen_ids.add(row["id"])
        if row["difficulty"] not in LEVELS:
            fail(f"record {row['id']} has unsupported difficulty {row['difficulty']!r}")
        rank = LEVELS.index(row["difficulty"])
        if rank < previous_rank:
            fail(f"difficulty order is not Easy -> Medium -> Advanced at {row['id']}")
        previous_rank = rank
        if not str(row["topic"]).strip() or not str(row["question"]).strip():
            fail(f"record {row['id']} has an empty topic/question")
        if not str(row["dataweave"]).lstrip().startswith("%dw"):
            fail(f"record {row['id']} DataWeave script does not start with %dw")
        normalized = " ".join(str(row["question"]).lower().split())
        if normalized in seen_questions:
            fail(f"duplicate normalized question: {row['id']}")
        seen_questions.add(normalized)
    required_pages = ["index.html", "explorer.html", "practice-bank.html", "assistant.html", "progress.html", "review.html", "lab-v2.html"]
    required_assets = ["auth.js", "learning.js", "lab-bootstrap.js", "manifest.webmanifest", "service-worker.js"]
    for group, files in (("pages", required_pages), ("assets", required_assets)):
        missing = [p for p in files if not (ROOT / p).exists()]
        if missing:
            fail(f"missing required {group}: {missing}")
    print("QUALITY AUDIT PASSED")
    print("records: 10,000")
    print("IDs: sequential and unique")
    print("difficulty: valid and ordered Easy -> Medium -> Advanced")
    print("required fields: present")
    print("DataWeave headers: present")
    print("questions: unique after normalization")
    print("UI entry pages/assets: present")
    print("runtime DataWeave execution: not performed by this static audit")


if __name__ == "__main__":
    main()
