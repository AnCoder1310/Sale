"""
Knowledge Retrieval Service.
Chủ quản: Chương (Platform, RAG & Runtime)
Phối hợp: Đạt (Corpus/Ingestion), An (Copilot UI)
"""
import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

from src.knowledge.metadata import NormalizedDocument
from src.knowledge.policy_versioning import policy_manager
from src.knowledge.vector_store import InMemoryVectorStore, vector_store

logger = logging.getLogger(__name__)
DEFAULT_CORPUS = Path("data/knowledge/corpus.json")


class RetrievalService:
    """Dịch vụ truy xuất kiến thức RAG phục vụ Copilot và Roleplay."""

    def __init__(self, store: Optional[InMemoryVectorStore] = None, corpus_path: Optional[Path] = None):
        self.store = store or vector_store
        self.corpus_path = corpus_path or DEFAULT_CORPUS
        self.documents_by_id: Dict[str, NormalizedDocument] = {}
        self.is_initialized = False
        self.initialize()

    def initialize(self):
        """Khởi tạo kho vector từ corpus JSON chuẩn hóa."""
        if not self.corpus_path.exists():
            logger.warning(f"Corpus path {self.corpus_path} not found.")
            return

        with open(self.corpus_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        docs: List[NormalizedDocument] = []
        for item in raw_data:
            try:
                nd = NormalizedDocument.model_validate(item)
                docs.append(nd)
                self.documents_by_id[nd.document_id] = nd
            except Exception as e:
                logger.error(f"Cannot parse document {item.get('document_id')}: {e}")

        # Nạp vào vector store
        self.store.clear()
        self.store.add_documents(docs)
        self.is_initialized = True
        logger.info(f"Loaded {len(docs)} documents into RetrievalService vector store.")

    def search_evidence(
        self,
        query: str,
        vehicle_model: Optional[str] = None,
        top_k: int = 3,
        exclude_expired: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Tìm kiếm các đoạn bằng chứng căn cứ có độ tin cậy cao nhất.
        """
        if not self.is_initialized:
            self.initialize()

        results = self.store.search(
            query=query,
            top_k=top_k,
            product_model=vehicle_model,
            exclude_expired=exclude_expired
        )

        evidence_list = []
        for score, chunk in results:
            doc = self.documents_by_id.get(chunk.document_id)
            title = doc.title if doc else chunk.metadata.document_id
            version = doc.version if doc else "1.0"
            eff_date = str(doc.effective_date) if doc else str(chunk.metadata.effective_date)
            source = doc.source if doc else chunk.metadata.source

            evidence_list.append({
                "id": chunk.document_id,
                "chunk_id": chunk.chunk_id,
                "docTitle": title,
                "version": version,
                "effectiveDate": eff_date,
                "confidence": round(float(score), 2),
                "snippet": chunk.content,
                "source": source,
                "product_model": chunk.metadata.product_model,
                "status": chunk.metadata.status.value,
            })

        return evidence_list

    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Lấy toàn văn văn bản căn cứ nguồn."""
        if doc_id in self.documents_by_id:
            return self.documents_by_id[doc_id].model_dump(mode="json")
        return None


retrieval_service = RetrievalService()
