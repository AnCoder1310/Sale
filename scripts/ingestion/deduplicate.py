#!/usr/bin/env python3
"""
Deduplicate Documents Script.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phát hiện và khử trùng lặp phiên bản tài liệu.
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.knowledge.ingestion import KnowledgeIngestionPipeline


def main():
    parser = argparse.ArgumentParser(description="Khử trùng lặp tài liệu trong kho tri thức")
    parser.add_argument("--input", default="data/knowledge/corpus.json")
    parser.add_argument("--output", default="data/knowledge/corpus.json")
    args = parser.parse_args()

    pipeline = KnowledgeIngestionPipeline()
    docs = pipeline.load_from_json(args.input)
    unique, duplicates = pipeline.deduplicate(docs)

    print(f"=== KẾT QUẢ KHỬ TRÙNG LẶP ===")
    print(f"Tổng tài liệu ban đầu: {len(docs)}")
    print(f"Tài liệu duy nhất: {len(unique)}")
    print(f"Số lượng trùng lặp: {len(duplicates)}")

    if duplicates:
        print("Chi tiết các bản ghi trùng lặp:")
        for d in duplicates:
            print(f"- {d.get('document_id')} (v{d.get('version', '1.0')})")

        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(unique, f, ensure_ascii=False, indent=2)
        print(f"Đã lưu danh sách đã khử trùng lặp vào: {args.output}")
    else:
        print("Kho dữ liệu hoàn toàn sạch, không có bản ghi trùng lặp!")


if __name__ == "__main__":
    main()
