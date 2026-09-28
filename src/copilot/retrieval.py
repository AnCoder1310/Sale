"""
Copilot Retrieval Node.
Chủ quản: Chương (Platform, RAG & Runtime)
"""
from typing import Any, Dict, List, Optional
from src.knowledge.retrieval_service import retrieval_service


def retrieve_copilot_evidence(
    query: str,
    vehicle_model: Optional[str] = None,
    top_k: int = 3,
    intent: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Truy xuất tài liệu từ Knowledge Retrieval Service."""
    # Nếu là câu chào hỏi hoặc giao tiếp xã giao thì không tìm kiếm văn bản xe
    if intent == "greeting":
        return []

    evidence = retrieval_service.search_evidence(
        query=query,
        vehicle_model=vehicle_model,
        top_k=top_k,
        exclude_expired=True
    )

    # Lọc bỏ những tài liệu có độ tin cậy quá thấp nếu không có keyword match
    filtered_evidence = [e for e in evidence if e.get("confidence", 0) >= 0.20]
    return filtered_evidence
