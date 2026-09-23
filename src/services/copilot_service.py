import json
import os
import re
from typing import Any, Dict, List, Optional
from src.services.llm_client import openrouter_client

CORPUS_PATH = os.path.join(os.path.dirname(__file__), "../../data/knowledge/corpus.json")

class CopilotService:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self._load_corpus()

    def _load_corpus(self):
        if os.path.exists(CORPUS_PATH):
            try:
                with open(CORPUS_PATH, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
            except Exception as e:
                print(f"Error loading corpus: {e}")
                self.documents = []

    async def query(self, query: str, vehicle_model: Optional[str] = None) -> Dict[str, Any]:
        q_lower = query.lower()
        scored_docs = []

        for doc in self.documents:
            score = 0
            title = doc.get("title", "").lower()
            content = doc.get("content", "").lower()
            model = (doc.get("product_model") or "").lower()

            if model and model in q_lower:
                score += 5
            
            # Keyword matching
            keywords = re.findall(r"\w+", q_lower)
            for kw in keywords:
                if len(kw) > 2:
                    if kw in title:
                        score += 3
                    if kw in content:
                        score += 1

            if score > 0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        top_docs = [doc for _, doc in scored_docs[:2]]

        if not top_docs and self.documents:
            top_docs = self.documents[:1]

        citations = []
        for d in top_docs:
            citations.append({
                "id": d.get("document_id"),
                "docTitle": d.get("title"),
                "version": d.get("version", "1.0"),
                "effectiveDate": d.get("effective_date", "2026-01-01"),
                "confidence": 0.98,
                "snippet": d.get("content", "")[:250] + "..."
            })

        # Try generating via OpenRouter LLM first
        context_text = "\n\n".join([f"TÀI LIỆU: {d.get('title')}\nNỘI DUNG: {d.get('content')}" for d in top_docs])
        system_prompt = (
            "Bạn là AI Sales Enablement Copilot chính thức của VinFast (VFO2O-20). "
            "Nhiệm vụ của bạn là hỗ trợ tư vấn viên bán xe giải đáp thắc mắc, đưa ra các luận điểm bán hàng sắc bén, "
            "và đối chiếu chính sách chính xác dựa trên tài liệu được cung cấp. "
            "Trả lời bằng tiếng Việt chuyên nghiệp, tự tin, định dạng Markdown rõ ràng, luôn nhấn mạnh cam kết chất lượng và ưu đãi xe điện VinFast."
        )

        user_prompt = (
            f"CĂN CỨ TÀI LIỆU:\n{context_text}\n\n"
            f"CÂU HỎI CỦA TƯ VẤN VIÊN:\n{query}\n\n"
            f"Hãy đưa ra câu trả lời chi tiết, trích dẫn số liệu cụ thể và gợi ý cách tư vấn cho khách hàng."
        )

        llm_answer = await openrouter_client.generate_chat_completion(
            messages=[{"role": "user", "content": user_prompt}],
            system_prompt=system_prompt,
            temperature=0.3
        )

        if llm_answer:
            answer = llm_answer
        elif top_docs:
            primary = top_docs[0]
            answer = f"### {primary.get('title')}\n\n{primary.get('content')}\n\n"
            sales_script = primary.get("sales_script", {})
            if sales_script and "core_arguments" in sales_script:
                answer += "**Luận điểm tư vấn cốt lõi:**\n"
                for arg in sales_script["core_arguments"]:
                    answer += f"* {arg}\n"
        else:
            answer = f"Theo quy chuẩn VinFast 2026 về: {query}, quý khách có thể an tâm với chính sách miễn 100% lệ phí trước bạ và hệ thống trạm sạc V-GREEN phủ sóng 63 tỉnh thành."

        talking_points = [
            "Làm rõ thói quen di chuyển hàng ngày của khách hàng",
            "Nhấn mạnh chi phí nuôi xe điện siêu tiết kiệm so với xe xăng",
            "Chính sách bảo hành 7-10 năm cam kết chất lượng của VinFast"
        ]

        return {
            "answer": answer,
            "citations": citations,
            "recommendedTalkingPoints": talking_points,
            "followUpQuestions": [
                "So sánh chi phí thuê pin vs mua đứt pin theo từng mức km?",
                "Chính sách bảo hành pin khi dung lượng SOH dưới 70%?",
                "Chương trình ưu đãi lệ phí trước bạ và quà tặng sạc pin 1 năm?"
            ]
        }

    def get_source_detail(self, doc_id: str) -> Optional[Dict[str, Any]]:
        for d in self.documents:
            if d.get("document_id") == doc_id:
                return d
        return None

copilot_service = CopilotService()
