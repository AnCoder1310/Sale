"""
Knowledge Ingestion Pipeline.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phối hợp: Chương (Platform/RAG), Duy (Roleplay)
"""
import json
import logging
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from src.knowledge.metadata import (
    DocumentStatus,
    DocumentType,
    NormalizedDocument,
    PolicyType,
    validate_metadata,
)

logger = logging.getLogger(__name__)


class KnowledgeIngestionPipeline:
    """Pipeline chuẩn hóa, kiểm tra chất lượng và nạp tài liệu vào hệ thống RAG."""

    def __init__(self, corpus_path: Optional[str] = None):
        self.corpus_path = Path(corpus_path) if corpus_path else Path("data/knowledge/corpus.json")
        self.documents: List[NormalizedDocument] = []
        self.raw_documents: List[Dict[str, Any]] = []
        self.validation_errors: List[Dict[str, Any]] = []

    def load_from_json(self, file_path: str) -> List[Dict[str, Any]]:
        """Đọc danh sách tài liệu từ file JSON."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, list):
                raise ValueError("Tệp dữ liệu phải là một mảng JSON (list of documents)")
            self.raw_documents = data
            return data

    def validate_document(self, raw_doc: Dict[str, Any]) -> Tuple[bool, List[str], Optional[NormalizedDocument]]:
        """Kiểm tra tính hợp lệ của tài liệu theo hợp đồng dữ liệu chuẩn."""
        res = validate_metadata(raw_doc)
        return res["is_valid"], res["errors"], res["validated_doc"]

    def deduplicate(self, documents: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Loại bỏ các tài liệu trùng ID và phiên bản."""
        seen = set()
        unique_docs = []
        duplicate_docs = []

        for doc in documents:
            key = (doc.get("document_id"), str(doc.get("version", "1.0")))
            if key in seen:
                duplicate_docs.append(doc)
            else:
                seen.add(key)
                unique_docs.append(doc)

        return unique_docs, duplicate_docs

    def run_ingestion(self, raw_docs: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Chạy toàn bộ pipeline nạp dữ liệu:
        1. Khử trùng lặp
        2. Xác thực cấu trúc & logic ngày tháng
        3. Tạo đối tượng NormalizedDocument
        """
        target_docs = raw_docs if raw_docs is not None else self.raw_documents
        if not target_docs and self.corpus_path.exists():
            target_docs = self.load_from_json(str(self.corpus_path))

        unique_docs, duplicates = self.deduplicate(target_docs)

        valid_docs: List[NormalizedDocument] = []
        invalid_docs: List[Dict[str, Any]] = []

        for doc in unique_docs:
            is_valid, errors, validated = self.validate_document(doc)
            if is_valid and validated:
                valid_docs.append(validated)
            else:
                invalid_docs.append({
                    "document_id": doc.get("document_id", "UNKNOWN"),
                    "errors": errors,
                    "raw": doc
                })

        self.documents = valid_docs
        self.validation_errors = invalid_docs

        summary = {
            "total_input": len(target_docs),
            "duplicates_removed": len(duplicates),
            "valid_count": len(valid_docs),
            "invalid_count": len(invalid_docs),
            "success_rate": round(len(valid_docs) / len(target_docs) * 100, 2) if target_docs else 0.0,
            "models_covered": list(set(d.product_model for d in valid_docs)),
            "doc_types_covered": list(set(d.document_type.value for d in valid_docs)),
        }
        return summary

    def export_normalized_corpus(self, output_path: Optional[str] = None) -> str:
        """Xuất dữ liệu chuẩn hoá ra file JSON."""
        dest = Path(output_path) if output_path else self.corpus_path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dump_data = [doc.model_dump(mode="json") for doc in self.documents]
        with open(dest, "w", encoding="utf-8") as f:
            json.dump(dump_data, f, ensure_ascii=False, indent=2)
        return str(dest)


ingestion_pipeline = KnowledgeIngestionPipeline()
