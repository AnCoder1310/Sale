"""
Policy Versioning & Temporal Freshness Resolver.
Chủ quản: Chương (Platform, RAG & Runtime)
Xử lý các quy tắc về ngày hiệu lực, chính sách hết hạn, và xung đột phiên bản văn bản bán hàng.
"""
from datetime import date
from typing import Any, Dict, List, Optional, Tuple

from src.knowledge.metadata import DocumentStatus, NormalizedDocument


class PolicyVersioningManager:
    """Quản lý trạng thái vòng đời và kiểm soát hiệu lực thời gian của chính sách bán hàng."""

    @staticmethod
    def is_policy_active(doc: NormalizedDocument, query_date: Optional[date] = None) -> bool:
        """Kiểm tra chính sách có đang có hiệu lực tại ngày truy vấn hay không."""
        check_date = query_date or date.today()

        if doc.status == DocumentStatus.EXPIRED:
            return False

        if doc.effective_date > check_date:
            return False

        if doc.expiry_date and doc.expiry_date < check_date:
            return False

        return True

    @staticmethod
    def filter_active_documents(
        docs: List[NormalizedDocument],
        query_date: Optional[date] = None
    ) -> List[NormalizedDocument]:
        """Lọc bỏ toàn bộ chính sách đã hết hạn."""
        return [d for d in docs if PolicyVersioningManager.is_policy_active(d, query_date)]

    @staticmethod
    def resolve_latest_version(docs: List[NormalizedDocument]) -> List[NormalizedDocument]:
        """
        Nếu có nhiều phiên bản của cùng một mã tài liệu hoặc cùng chủ đề chính sách,
        ưu tiên chọn phiên bản có số version cao hơn hoặc ngày hiệu lực mới nhất.
        """
        grouped: Dict[str, NormalizedDocument] = {}

        for doc in docs:
            key = f"{doc.document_type.value}:{doc.product_model}:{doc.policy_type.value if doc.policy_type else 'none'}"
            if key not in grouped:
                grouped[key] = doc
            else:
                existing = grouped[key]
                # So sánh theo ngày hiệu lực
                if doc.effective_date > existing.effective_date:
                    grouped[key] = doc
                elif doc.effective_date == existing.effective_date and doc.version > existing.version:
                    grouped[key] = doc

        return list(grouped.values())

    @staticmethod
    def check_deprecation_warning(doc: NormalizedDocument) -> Optional[str]:
        """Tạo cảnh báo nếu tài liệu đã hết hạn hoặc sắp hết hạn."""
        if doc.status == DocumentStatus.EXPIRED:
            return f"CẢNH BÁO: Văn bản '{doc.title}' ({doc.document_id}) ĐÃ HẾT HIỆU LỰC từ ngày {doc.expiry_date}. Không sử dụng làm căn cứ báo giá!"
        
        if doc.expiry_date:
            days_left = (doc.expiry_date - date.today()).days
            if 0 <= days_left <= 30:
                return f"LƯU Ý: Văn bản '{doc.title}' sắp hết hạn sau {days_left} ngày (hết hạn ngày {doc.expiry_date})."

        return None


policy_manager = PolicyVersioningManager()
