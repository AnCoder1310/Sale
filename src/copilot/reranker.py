"""
Copilot Evidence Reranker.
Chủ quản: Chương (Platform, RAG & Runtime)
Tái xếp hạng danh sách căn cứ dựa trên độ tương thích của intent, độ mới và tỷ lệ trùng khớp tiêu đề.
"""
from typing import Any, Dict, List, Optional


def rerank_evidence(
    query: str,
    evidence_list: List[Dict[str, Any]],
    intent: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Tái tính toán trọng số căn cứ và sắp xếp lại."""
    if not evidence_list:
        return []

    q_lower = query.lower()
    reranked = []

    for item in evidence_list:
        score = item.get("confidence", 0.5)
        title = item.get("docTitle", "").lower()

        # Intent boost
        if intent == "battlecard_comparison" and "battlecard" in item.get("id", "").lower():
            score += 0.25
        elif intent == "battery_and_charging" and ("battery" in item.get("id", "").lower() or "charging" in item.get("id", "").lower()):
            score += 0.25
        elif intent == "policy_and_pricing" and ("policy" in item.get("id", "").lower() or "price" in item.get("id", "").lower() or "promotion" in item.get("id", "").lower()):
            score += 0.25

        # Check vehicle match
        model = item.get("product_model", "").lower()
        if model and model in q_lower:
            score += 0.15

        item_copy = dict(item)
        item_copy["confidence"] = round(min(1.0, score), 2)
        reranked.append(item_copy)

    reranked.sort(key=lambda x: x["confidence"], reverse=True)
    return reranked
