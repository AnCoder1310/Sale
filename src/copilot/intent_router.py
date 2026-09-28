"""
Copilot Intent Router.
Chủ quản: Chương (Platform, RAG & Runtime)
Phân loại ý định người dùng để tối ưu chiến lược truy vấn và chọn tài liệu căn cứ.
"""
import re
from typing import Dict, Optional


class CopilotIntentRouter:
    """Bộ định tuyến ý định câu hỏi tư vấn viên."""

    GREETING_PATTERNS = [
        r"^(chào|xin chào|chào bạn|chào em|chào anh|chào chị|chào ad|hello|hi|hey|alo)\b",
        r"^(bạn là ai|em là ai|bạn có thể làm gì|bạn giúp được gì|hướng dẫn|trợ giúp|help)\b",
        r"^(cảm ơn|thanks|thank you|ok|oke|oki|được rồi)\b",
    ]

    PATTERNS = {
        "battlecard_comparison": [
            r"so sánh", r"đối thủ", r"cx-5", r"cx5", r"santa fe", r"santafe",
            r"explorer", r"raize", r"vios", r"hơn gì", r"xe xăng", r"xe nhật", r"xe hàn"
        ],
        "battery_and_charging": [
            r"thuê pin", r"mua đứt", r"chai pin", r"70%", r"soh", r"trạm sạc",
            r"v-green", r"vgreen", r"sạc ở đâu", r"chung cư", r"sạc bao lâu", r"sạc nhanh"
        ],
        "policy_and_pricing": [
            r"trước bạ", r"thuế", r"lăn bánh", r"bảng giá", r"giá bao nhiêu",
            r"ưu đãi", r"khuyến mãi", r"trả góp", r"vay", r"lãi suất", r"tiền mặt"
        ],
        "product_specs": [
            r"công suất", r"mã lực", r"hp", r"mô-men xoắn", r"tầm hoạt động",
            r"bao nhiêu km", r"quãng đường", r"adas", r"túi khí", r"gầm cao", r"lội nước",
            r"treo khí nén", r"ghế cơ trưởng", r"kích thước", r"tăng tốc", r"0-100", r"0 đến 100", r"vận tốc"
        ],
    }

    def route_intent(self, query: str) -> str:
        """Xác định intent từ query."""
        q_lower = query.lower().strip()

        # 1. Kiểm tra chào hỏi / giao tiếp xã giao trước
        for pat in self.GREETING_PATTERNS:
            if re.search(pat, q_lower):
                # Nếu câu chào có kèm theo câu hỏi xe cụ thể thì tiếp tục xét intent xe
                has_car_topic = any(
                    any(re.search(p, q_lower) for p in patterns)
                    for patterns in self.PATTERNS.values()
                )
                if not has_car_topic:
                    return "greeting"

        # 2. Kiểm tra các nhóm nghiệp vụ bán xe
        for intent, patterns in self.PATTERNS.items():
            for pat in patterns:
                if re.search(pat, q_lower):
                    return intent

        return "general_consultation"


intent_router = CopilotIntentRouter()
