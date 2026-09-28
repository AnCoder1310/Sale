#!/usr/bin/env python3
"""
Validate Metadata Script.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Kiểm tra tính hợp lệ của metadata và báo cáo vi phạm.
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.knowledge.metadata import validate_metadata


def main():
    parser = argparse.ArgumentParser(description="Kiểm tra hợp đồng metadata của kho tài liệu")
    parser.add_argument("--file", default="data/knowledge/corpus.json", help="File JSON cần kiểm tra")
    args = parser.parse_args()

    path = Path(args.file)
    if not path.exists():
        print(f"Lỗi: Không tìm thấy file {args.file}")
        sys.exit(1)

    with open(path, "r", encoding="utf-8") as f:
        docs = json.load(f)

    valid_count = 0
    errors_list = []

    for idx, doc in enumerate(docs):
        doc_id = doc.get("document_id", f"INDEX_{idx}")
        res = validate_metadata(doc)
        if res["is_valid"]:
            valid_count += 1
        else:
            errors_list.append((doc_id, res["errors"]))

    print(f"=== KẾT QUẢ KIỂM TRA METADATA ===")
    print(f"File: {args.file}")
    print(f"Tổng tài liệu: {len(docs)}")
    print(f"Hợp lệ: {valid_count}/{len(docs)}")

    if errors_list:
        print("\nDanh sách lỗi phát hiện:")
        for doc_id, errs in errors_list:
            print(f"- [{doc_id}]: {', '.join(errs)}")
        sys.exit(1)
    else:
        print("Tất cả tài liệu đều đạt chuẩn hợp đồng dữ liệu Gate 1 & Production!")


if __name__ == "__main__":
    main()
