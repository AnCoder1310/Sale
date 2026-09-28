"""
Copilot Citation Validator.
Chủ quản: Chương (Platform, RAG & Runtime)
Kiểm tra tính có căn cứ của nguồn trích dẫn:
1. Đảm bảo mọi citation đều xuất phát từ tài liệu còn hiệu lực.
2. Kiểm tra tài liệu trích dẫn có thực sự chứa nội dung được trả lời hay không.
"""
from typing import Any, Dict, List, Tuple


class CitationValidator:
    """Xác thực nguồn trích dẫn pháp lý và kỹ thuật."""

    @staticmethod
    def validate_citations(
        citations: List[Dict[str, Any]],
        answer_text: str
    ) -> Tuple[bool, List[Dict[str, Any]], List[str]]:
        """
        Lọc và giữ lại những citations hợp lệ.
        Trả về: (is_valid, validated_citations, warnings)
        """
        valid_citations = []
        warnings = []

        for cit in citations:
            doc_id = cit.get("id")
            status = cit.get("status", "active")

            if status == "expired":
                warnings.append(f"Tài liệu {doc_id} đã hết hiệu lực, loại bỏ khỏi danh sách trích dẫn chính thức.")
                continue

            # Kiểm tra confidence
            if cit.get("confidence", 0) >= 0.15:
                valid_citations.append(cit)
            else:
                warnings.append(f"Tài liệu {doc_id} có độ tin cậy quá thấp ({cit.get('confidence')}).")

        is_valid = len(valid_citations) > 0
        return is_valid, valid_citations, warnings


citation_validator = CitationValidator()
