"""
Roleplay Knowledge Tools.
Chủ quản: Chương (Platform, RAG & Runtime)
Tuân thủ KnowledgeToolContract trong src/roleplay/contracts.py.
Cung cấp công cụ tra cứu thông tin xe và chính sách trong quá trình diễn tập khách hàng mô phỏng.
"""
from typing import Any, Dict, List, Optional
from src.knowledge.retrieval_service import retrieval_service


class RoleplayKnowledgeTool:
    """Công cụ truy vấn tri thức dùng trong hội thoại roleplay."""

    async def search(self, query: str) -> List[Dict[str, Any]]:
        """Triển khai hàm search bắt buộc của KnowledgeToolContract."""
        return retrieval_service.search_evidence(query=query, top_k=2)

    async def search_product(self, model: str) -> List[Dict[str, Any]]:
        """Tra cứu thông số kỹ thuật xe theo model."""
        return retrieval_service.search_evidence(
            query=f"thông số kỹ thuật {model}",
            vehicle_model=model,
            top_k=2
        )

    async def search_policy(self, topic: str) -> List[Dict[str, Any]]:
        """Tra cứu chính sách bảo hành, pin, trạm sạc."""
        return retrieval_service.search_evidence(
            query=topic,
            top_k=2,
            exclude_expired=True
        )


roleplay_knowledge_tool = RoleplayKnowledgeTool()
