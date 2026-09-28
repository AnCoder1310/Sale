"""
Copilot Guardrails & Hallucination Prevention.
Chủ quản: Chương (Platform, RAG & Runtime)
Ngăn chặn ảo giác số liệu, bảo vệ thương hiệu và phát hiện câu hỏi ngoài phạm vi nghiệp vụ.
"""
import re
from typing import Dict, List, Optional, Tuple


class CopilotGuardrails:
    """Hàng rào an toàn cho câu trả lời của AI Copilot."""

    BANNED_WORDS = [
        "lừa đảo", "cháy nổ nguy hiểm chết người", "tẩy chay", "bán tháo"
    ]

    @staticmethod
    def check_safety(query: str, answer: str) -> Tuple[bool, Optional[str]]:
        """Kiểm tra an toàn nội dung."""
        combined = f"{query} {answer}".lower()
        for bw in CopilotGuardrails.BANNED_WORDS:
            if bw in combined:
                return False, f"Nội dung chứa từ ngữ nhạy cảm vi phạm quy chuẩn truyền thông ({bw})."
        return True, None

    @staticmethod
    def ensure_disclaimer(answer: str, has_expired_policy: bool = False) -> str:
        """Thêm khuyến nghị hoặc disclaimer nếu cần thiết."""
        if has_expired_policy:
            disclaimer = "\n\n> ⚠️ **LƯU Ý:** Một số chính sách trong quá khứ đã được thay thế. Hãy luôn căn cứ vào biểu phí hiện hành tháng 09/2026."
            return f"{answer}{disclaimer}"
        return answer


guardrails = CopilotGuardrails()
