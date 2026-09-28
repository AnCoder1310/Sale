#!/usr/bin/env python3
"""
Normalize Documents Script.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Chuẩn hóa dữ liệu thô sang schema NormalizedDocument.
"""
import argparse
import json
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.knowledge.ingestion import KnowledgeIngestionPipeline


def main():
    parser = argparse.ArgumentParser(description="Chuẩn hóa văn bản tri thức sang schema VinFast AI Coach")
    parser.add_argument("--input", default="data/knowledge/corpus.json", help="Đường dẫn file đầu vào")
    parser.add_argument("--output", default="data/knowledge/corpus.json", help="Đường dẫn file đầu ra")
    args = parser.parse_args()

    pipeline = KnowledgeIngestionPipeline(args.input)
    raw_docs = pipeline.load_from_json(args.input)
    summary = pipeline.run_ingestion(raw_docs)
    saved_path = pipeline.export_normalized_corpus(args.output)

    print(f"=== KẾT QUẢ CHUẨN HOÁ DỮ LIỆU ===")
    print(f"File nguồn: {args.input}")
    print(f"Tổng số tài liệu: {summary['total_input']}")
    print(f"Số tài liệu hợp lệ: {summary['valid_count']}")
    print(f"Số lỗi: {summary['invalid_count']}")
    print(f"Tỷ lệ thành công: {summary['success_rate']}%")
    print(f"Dòng xe hỗ trợ: {', '.join(summary['models_covered'])}")
    print(f"Đã lưu ra: {saved_path}")


if __name__ == "__main__":
    main()
