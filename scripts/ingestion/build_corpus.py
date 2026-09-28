#!/usr/bin/env python3
"""
Build Corpus Script.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Tổng hợp toàn bộ tài liệu nguồn, chuẩn hoá, khử trùng lặp và xuất kho tri thức sẵn sàng cho Vector Store.
"""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.knowledge.ingestion import KnowledgeIngestionPipeline


def main():
    parser = argparse.ArgumentParser(description="Build production knowledge corpus for VinFast Sales Enablement")
    parser.add_argument("--source", default="data/knowledge/corpus.json")
    parser.add_argument("--dest", default="data/knowledge/corpus.json")
    args = parser.parse_args()

    pipeline = KnowledgeIngestionPipeline(args.source)
    pipeline.load_from_json(args.source)
    summary = pipeline.run_ingestion()
    saved = pipeline.export_normalized_corpus(args.dest)

    print("====================================================")
    print("      VINFAST SALES ENABLEMENT - CORPUS BUILDER     ")
    print("====================================================")
    print(f"Trạng thái: THÀNH CÔNG")
    print(f"Tổng tài liệu nạp: {summary['total_input']}")
    print(f"Hợp lệ: {summary['valid_count']} ({summary['success_rate']}%)")
    print(f"Lỗi: {summary['invalid_count']}")
    print(f"Dòng xe bao phủ: {len(summary['models_covered'])} ({', '.join(sorted(summary['models_covered']))})")
    print(f"Phân loại tài liệu: {', '.join(sorted(summary['doc_types_covered']))}")
    print(f"Xuất file: {saved}")
    print("====================================================")


if __name__ == "__main__":
    main()
