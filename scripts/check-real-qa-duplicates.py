#!/usr/bin/env python3
"""Check REAL-QA markdown files for duplicate question titles.

The checker intentionally reports exact normalized duplicates only. Similar-but-not-identical
questions still require human review because two questions can legitimately use the same
concept with different transformation requirements.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QA_ROOT = ROOT / "REAL-QA"
QUESTION_RE = re.compile(r"^\s*#{1,6}\s+(DW-[A-Z]+\d+\s*[—-]\s*.+?)\s*$", re.MULTILINE)


def normalize(title: str) -> str:
    title = re.sub(r"^DW-[A-Z]+\d+\s*[—-]\s*", "", title, flags=re.I)
    title = title.lower()
    title = re.sub(r"[`*_]", "", title)
    title = re.sub(r"\s+", " ", title).strip()
    return title


def main() -> int:
    if not QA_ROOT.exists():
        print("REAL-QA directory not found", file=sys.stderr)
        return 2

    seen: dict[str, list[str]] = {}
    files_scanned = 0
    questions_scanned = 0

    for path in sorted(QA_ROOT.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        matches = QUESTION_RE.findall(text)
        if not matches:
            continue
        files_scanned += 1
        for title in matches:
            questions_scanned += 1
            key = normalize(title)
            seen.setdefault(key, []).append(f"{path.relative_to(ROOT)} :: {title}")

    duplicates = {key: locations for key, locations in seen.items() if len(locations) > 1}

    print(f"Files with Q&A headings: {files_scanned}")
    print(f"Question headings scanned: {questions_scanned}")
    print(f"Exact normalized duplicates: {len(duplicates)}")

    if duplicates:
        print("\nDuplicate questions:")
        for locations in duplicates.values():
            for location in locations:
                print(f"  - {location}")
        return 1

    print("No exact normalized duplicate question titles found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
