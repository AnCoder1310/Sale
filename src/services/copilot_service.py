"""
Copilot Service Gateway.
Chương & Duy co-ownership.
Kết nối FastAPI routes với CopilotGraph và RetrievalService.
"""
from typing import Any, Dict, List, Optional
from src.copilot.graph import copilot_graph
from src.knowledge.retrieval_service import retrieval_service


class CopilotService:
    def __init__(self):
        self.graph = copilot_graph

    async def query(self, query: str, vehicle_model: Optional[str] = None) -> Dict[str, Any]:
        """Truy vấn trợ lý Copilot thông qua LangGraph pipeline."""
        res = await self.graph.ainvoke({
            "query": query,
            "vehicle_model": vehicle_model
        })
        return {
            "answer": res["answer"],
            "citations": res["citations"],
            "recommendedTalkingPoints": res["recommendedTalkingPoints"],
            "followUpQuestions": res["followUpQuestions"]
        }

    def get_source_detail(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Lấy chi tiết văn bản căn cứ nguồn từ RetrievalService."""
        return retrieval_service.get_document(doc_id)


copilot_service = CopilotService()
