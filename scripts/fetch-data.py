# Run: python scripts/fetch_airtable.py

import json
import math
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from dotenv import load_dotenv

# Load .env.local from project root (one level up from scripts/)
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DOTENV_PATH = PROJECT_ROOT / ".env.local"
if DOTENV_PATH.exists():
    load_dotenv(DOTENV_PATH, override=False)

else:
    # fall back to default .env if present
    load_dotenv(PROJECT_ROOT / ".env", override=False)

# Configuration from env
API_KEY = os.getenv("AIRTABLE_API_KEY")
BASE_ID = os.getenv("AIRTABLE_BASE_ID")

# Main table (projects) - support legacy name for backward compatibility
MAIN_TABLE_IDENTIFIER = os.getenv("AIRTABLE_TABLE_ID")

AIRTABLE_TIMEZONE = os.getenv("AIRTABLE_TIMEZONE", "UTC")
AIRTABLE_USER_LOCALE = os.getenv("AIRTABLE_USER_LOCALE", "en-US")

if not API_KEY or not BASE_ID or not MAIN_TABLE_IDENTIFIER:
    print(
        "Error: Ensure AIRTABLE_API_KEY, AIRTABLE_BASE_ID and AIRTABLE_TABLE_ID_PROJECTS (or AIRTABLE_TABLE_ID) are set in .env.local",
        file=sys.stderr,
    )
    sys.exit(1)

OUTPUT_DIR = PROJECT_ROOT / "public" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Utilities
def log(*args):
    print("[airtable-fetch]", *args)


HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}


def airtable_fetch(url: str) -> Dict[str, Any]:
    resp = requests.get(url, headers=HEADERS, timeout=30)
    if not resp.ok:
        raise RuntimeError(
            f"Airtable API error: {resp.status_code} {resp.reason}\n{resp.text}"
        )
    return resp.json()


def add_basic_params(params: Dict[str, str]):
    params["pageSize"] = "100"


def build_table_url(
    table_identifier: str, extra_params: Optional[Dict[str, Any]] = None
) -> str:
    base = f"https://api.airtable.com/v0/{BASE_ID}/{requests.utils.quote(table_identifier, safe='')}"  # type: ignore
    params = {}
    add_basic_params(params)
    if extra_params:
        for k, v in extra_params.items():
            if v is None:
                continue
            # If list, append each as separate param (Airtable expects this for fields[])
            if isinstance(v, list):
                # We'll encode later by building query string manually
                # Represent as k=item repeated
                params[k] = v
            else:
                params[k] = str(v)
    # build query string allowing repeated keys
    parts = []
    for k, v in params.items():
        if isinstance(v, list):
            for item in v:
                parts.append(
                    f"{requests.utils.quote(k)}={requests.utils.quote(str(item))}"
                )  # type: ignore
        else:
            parts.append(f"{requests.utils.quote(k)}={requests.utils.quote(str(v))}")  # type: ignore
    if parts:
        return base + "?" + "&".join(parts)
    else:
        return base


def fetch_airtable_table(
    table_identifier: str, extra_params: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    all_records: List[Dict[str, Any]] = []
    offset = None
    page = 0
    while True:
        params = dict(extra_params or {})
        if offset:
            params["offset"] = offset
        url = build_table_url(table_identifier, params)
        page += 1
        data = airtable_fetch(url)
        records = data.get("records", [])
        count = len(records)
        all_records.extend(records)
        offset = data.get("offset") or None
        log(
            f"Fetched {count} records (total {len(all_records)}) from {table_identifier} (page {page})"
        )
        if not offset:
            break
    return all_records


def save_to_json(data: Any, filename: str) -> Path:
    file_path = OUTPUT_DIR / filename
    with open(file_path, "w", encoding="utf-8") as f:
        # Ensure we do not include Airtable's top-level `createdTime` on any record
        if isinstance(data, list):
            for rec in data:
                if isinstance(rec, dict):
                    rec.pop("createdTime", None)
        elif isinstance(data, dict):
            # If a single object was passed, remove createdTime if present
            data.pop("createdTime", None)

        json.dump(data, f, indent=2, ensure_ascii=False)
    if isinstance(data, list):
        count = len(data)
    elif isinstance(data, dict):
        count = len(data.keys())
    else:
        count = 1
    log(f"Saved {count} items to {file_path}")
    return file_path


# ---- Main flow ----
def main():
    try:
        log("Starting simplified Airtable fetch...")

        # 1) Fetch main (projects) table with specified fields
        log(f"Fetching main/projects table: {MAIN_TABLE_IDENTIFIER}")
        # Request only the configured project fields from Airtable
        projects_extra_params: Dict[str, Any] = {}

        main_records = fetch_airtable_table(
            MAIN_TABLE_IDENTIFIER, extra_params=projects_extra_params # type: ignore
        )
        save_to_json(main_records, "ecosystem-table.json")

        # 2) Fetch organizations table (if provided)
       
        # Summary
        log("SUMMARY:")
        log(
            f'  Main projects table "{MAIN_TABLE_IDENTIFIER}": {len(main_records)} records (saved to ecosystem-table.json)'
        )
        log("Airtable fetch completed successfully.")

        # Data validation before proceeding
       
if __name__ == "__main__":
    main()