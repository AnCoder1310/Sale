#!/usr/bin/env python3
"""
Database SQL Export & Import Tool.
Xuất toàn bộ cơ sở dữ liệu SQLite data/app.db thành file SQL độc lập
và hỗ trợ khôi phục database từ file SQL.
"""
import argparse
import os
import sqlite3
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DB_PATH = ROOT_DIR / "data" / "app.db"
SQL_DUMP_PATH = ROOT_DIR / "data" / "database.sql"
SQL_SCHEMA_PATH = ROOT_DIR / "data" / "schema.sql"


def export_sql(target_file: Path = SQL_DUMP_PATH):
    """Xuất toàn bộ cơ sở dữ liệu thành file SQL."""
    if not DB_PATH.exists():
        print(f"Lỗi: Không tìm thấy database tại {DB_PATH}")
        sys.exit(1)

    conn = sqlite3.connect(str(DB_PATH))
    with open(target_file, "w", encoding="utf-8") as f:
        f.write("-- ==========================================================\n")
        f.write("-- VINFAST AI ENABLEMENT COACH (VFO2O-20) - SQL DUMP\n")
        f.write("-- Database: SQLite 3 / SQLAlchemy Compatible\n")
        f.write("-- ==========================================================\n\n")
        for line in conn.iterdump():
            f.write(f"{line}\n")
    conn.close()
    file_size_kb = target_file.stat().st_size / 1024.0
    print(f"✅ Đã xuất database ra file SQL thành công: {target_file} ({file_size_kb:.1f} KB)")


def import_sql(source_file: Path = SQL_DUMP_PATH):
    """Khôi phục database từ file SQL."""
    if not source_file.exists():
        print(f"Lỗi: Không tìm thấy file SQL tại {source_file}")
        sys.exit(1)

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DB_PATH.exists():
        os.remove(DB_PATH)

    conn = sqlite3.connect(str(DB_PATH))
    with open(source_file, "r", encoding="utf-8") as f:
        sql_content = f.read()
    conn.executescript(sql_content)
    conn.close()
    print(f"✅ Đã khôi phục database thành công vào {DB_PATH}")


def main():
    parser = argparse.ArgumentParser(description="Quản lý xuất/nhập database SQL")
    parser.add_argument("--action", choices=["export", "import"], default="export")
    parser.add_argument("--file", default=str(SQL_DUMP_PATH), help="Đường dẫn file SQL")
    args = parser.parse_args()

    target_file = Path(args.file)
    if args.action == "export":
        export_sql(target_file)
    elif args.action == "import":
        import_sql(target_file)


if __name__ == "__main__":
    main()
