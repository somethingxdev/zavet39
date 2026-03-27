#!/usr/bin/env python3
"""
Migration script:
Convert frontmatter fields

  dimensions: ...
  price: ...

into

  dimensionsAndPrice:
    - dimensions: ...
      price: ...

for markdown files in src/data/**/*.md

Usage:
  python scripts/migrate_dimensions_price.py
  python scripts/migrate_dimensions_price.py --dry-run
  python scripts/migrate_dimensions_price.py --root C:/path/to/project
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path
from typing import List, Tuple


FRONTMATTER_DELIM = "---"


def normalize_spaces(value: str) -> str:
    return " ".join(value.strip().split())


def split_dimensions(raw: str) -> List[str]:
    value = normalize_spaces(raw)
    parts = [p.strip() for p in value.split(",") if p.strip()]
    return parts if parts else [value]


def split_prices(raw: str) -> List[str]:
    value = normalize_spaces(raw)

    if "," in value:
        parts = [p.strip() for p in value.split(",") if p.strip()]
        return parts if parts else [value]

    # Handle patterns like: "от 36000 р. от 50000 р."
    # Split by repeated "от ...", preserving each chunk.
    repeated_ot = re.findall(r"(от\s*.+?)(?=(?:\s+от\s+)|$)", value, flags=re.IGNORECASE)
    if len(repeated_ot) > 1:
        return [normalize_spaces(p) for p in repeated_ot]

    return [value]


def pair_dimensions_prices(dimensions_raw: str, prices_raw: str) -> List[Tuple[str, str]]:
    dimensions = split_dimensions(dimensions_raw)
    prices = split_prices(prices_raw)

    count = max(len(dimensions), len(prices))
    pairs: List[Tuple[str, str]] = []

    for i in range(count):
        dim = dimensions[i] if i < len(dimensions) else dimensions[-1]
        price = prices[i] if i < len(prices) else prices[-1]
        pairs.append((dim, price))

    return pairs


def yaml_quote(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def migrate_frontmatter(frontmatter: str) -> tuple[str, bool]:
    lines = frontmatter.splitlines()

    has_dimensions_and_price = any(re.match(r"^\s*dimensionsAndPrice\s*:", l) for l in lines)
    if has_dimensions_and_price:
        return frontmatter, False

    dimensions_value = None
    price_value = None
    insert_at = None

    new_lines: List[str] = []

    for line in lines:
        dim_match = re.match(r"^\s*dimensions:\s*(.*?)\s*$", line)
        price_match = re.match(r"^\s*price:\s*(.*?)\s*$", line)

        if dim_match:
            dimensions_value = dim_match.group(1)
            insert_at = len(new_lines)
            continue

        if price_match:
            price_value = price_match.group(1)
            continue

        new_lines.append(line)

    if dimensions_value is None or price_value is None or insert_at is None:
        return frontmatter, False

    pairs = pair_dimensions_prices(dimensions_value, price_value)

    block_lines = ["dimensionsAndPrice:"]
    for dim, price in pairs:
        block_lines.append(f"  - dimensions: {yaml_quote(dim)}")
        block_lines.append(f"    price: {yaml_quote(price)}")

    new_lines[insert_at:insert_at] = block_lines
    return "\n".join(new_lines), True


def migrate_markdown_file(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")

    if not content.startswith(FRONTMATTER_DELIM):
        return False

    # Locate second frontmatter delimiter line
    matches = list(re.finditer(r"^---\s*$", content, flags=re.MULTILINE))
    if len(matches) < 2:
        return False

    first = matches[0]
    second = matches[1]

    frontmatter_start = first.end()
    frontmatter_end = second.start()

    frontmatter = content[frontmatter_start:frontmatter_end].strip("\n")
    migrated_frontmatter, changed = migrate_frontmatter(frontmatter)

    if not changed:
        return False

    before = content[: first.start()]
    after = content[second.end() :]

    rebuilt = f"{before}---\n{migrated_frontmatter}\n---{after}"
    path.write_text(rebuilt, encoding="utf-8")
    return True


def find_markdown_files(data_root: Path) -> List[Path]:
    return sorted(data_root.rglob("*.md"))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migrate dimensions/price frontmatter fields to dimensionsAndPrice array."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Project root path (default: repo root inferred from script location).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show which files would be changed without writing.",
    )
    args = parser.parse_args()

    project_root = args.root.resolve()
    data_root = project_root / "src" / "data"

    if not data_root.exists():
        print(f"[ERROR] Data directory not found: {data_root}")
        return 1

    files = find_markdown_files(data_root)
    changed_files: List[Path] = []

    for file_path in files:
        original = file_path.read_text(encoding="utf-8")

        # Simulate migration
        if not original.startswith(FRONTMATTER_DELIM):
            continue

        matches = list(re.finditer(r"^---\s*$", original, flags=re.MULTILINE))
        if len(matches) < 2:
            continue

        first = matches[0]
        second = matches[1]
        frontmatter = original[first.end() : second.start()].strip("\n")
        migrated_frontmatter, changed = migrate_frontmatter(frontmatter)

        if not changed:
            continue

        changed_files.append(file_path)

        if not args.dry_run:
            before = original[: first.start()]
            after = original[second.end() :]
            rebuilt = f"{before}---\n{migrated_frontmatter}\n---{after}"
            file_path.write_text(rebuilt, encoding="utf-8")

    mode = "DRY-RUN" if args.dry_run else "MIGRATED"
    print(f"[{mode}] Files changed: {len(changed_files)}")
    for p in changed_files:
        print(f" - {p.relative_to(project_root)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
