"""
Turn Analyzer Logic.
Chủ quản: Duy (AI Customer Role-play & Coaching Engine)
Phân tích mỗi lượt trao đổi của Tư vấn viên để cập nhật trạng thái RoleplayState.
"""
import re
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel
from src.roleplay.contracts import ScenarioContract
from src.roleplay.state import RoleplayState


class TurnAnalysisResult(BaseModel):
    intent_detected: str
    uncovered_facts: List[str] = []
    revealed_statements: List[str] = []
    resolved_objections: List[str] = []
    is_closing_attempt: bool = False
    trust_delta: int = 0
    interest_delta: int = 0


class TurnAnalyzer:
    """Phân tích hành vi và kỹ năng của tư vấn viên trong từng lượt thoại."""

    DIALECT_REPLACEMENTS = [
        ("cấy chi rứa", "cái gì thế"), ("chi rứa", "gì thế"), ("răng rứa", "sao thế"),
        ("mần răng", "làm sao"), ("làm răng", "làm thế nào"), ("ở mô", "ở đâu"),
        ("chỗ mô", "chỗ nào"), ("giữa đàng", "giữa đường"), ("mùa lụt", "ngập nước"),
        ("vô nước", "ngập nước"), ("chai bình", "chai pin"), ("hổng", "không"), ("hông", "không")
    ]

    def normalize_dialect(self, text: str) -> str:
        """Chuẩn hóa khẩu ngữ vùng miền để nhận diện ngữ nghĩa."""
        norm = text.lower()
        for p, r in self.DIALECT_REPLACEMENTS:
            norm = norm.replace(p, r)
        return norm

    def _match_keyword(self, keyword: str, text: str) -> bool:
        """Khớp từ khóa trực tiếp hoặc theo tập từ vựng đầy đủ."""
        kw_clean = keyword.lower().strip()
        if kw_clean in text:
            return True
        tokens = [t for t in re.findall(r"\w+", kw_clean) if len(t) > 1]
        if tokens and all(t in text for t in tokens):
            return True
        return False

    def analyze_turn(
        self,
        advisor_message: str,
        scenario: ScenarioContract,
        state: RoleplayState
    ) -> TurnAnalysisResult:
        """Phân tích tin nhắn của sales và đưa ra kết quả phân loại."""
        norm_text = self.normalize_dialect(advisor_message)
        uncovered = []
        revealed_stmts = []
        resolved_objs = []
        trust_delta = 0
        interest_delta = 0
        is_closing = False

        # 1. Kiểm tra quy tắc hé lộ thông tin (Disclosure Rules)
        for rule in scenario.disclosure_rules:
            if rule.fact_key not in state.revealed_facts:
                matched = False
                for kw in rule.trigger_keywords:
                    if self._match_keyword(kw, norm_text):
                        matched = True
                        break
                if matched:
                    uncovered.append(rule.fact_key)
                    revealed_stmts.append(rule.revealed_statement)
                    trust_delta += 1
                    interest_delta += 1

        # 2. Kiểm tra hóa giải từ chối (Objection Handling)
        objection_resolution_keywords = [
            "bảo hành", "đổi pin", "70%", "soh", "sạc nhanh", "v-green",
            "tiết kiệm", "trước bạ", "0%", "nghị định", "ip67", "chống nước",
            "lội nước", "treo khí nén", "massage", "trc", "work permit", "tiếng anh"
        ]
        
        has_strong_argument = any(kw in norm_text for kw in objection_resolution_keywords)
        if has_strong_argument:
            for obj in scenario.objections:
                if obj.objection_id not in state.resolved_objections:
                    resolved_objs.append(obj.objection_id)
                    trust_delta += 1
                    interest_delta += 1

        # 3. Kiểm tra nỗ lực chốt đơn / mời lái thử (Closing Attempt)
        closing_keywords = [
            "lái thử", "trải nghiệm", "đặt cọc", "giữ xe", "hợp đồng",
            "nhận xe", "ghé showroom", "cuối tuần này", "bấm biển", "test drive"
        ]
        is_closing = any(kw in norm_text for kw in closing_keywords)

        # 4. Đánh giá tính phù hợp của việc chốt:
        if is_closing:
            if state.turn_count <= 1 and not state.revealed_facts:
                trust_delta -= 1
                intent = "Chốt đơn quá sớm (Chưa khai thác nhu cầu)"
            else:
                intent = "Đề xuất chốt đơn & Lái thử trải nghiệm"
                interest_delta += 1
        elif uncovered:
            intent = "Đặt câu hỏi khai thác nhu cầu thành công"
        elif has_strong_argument:
            intent = "Đưa ra luận điểm giải tỏa băn khoăn & tư vấn chính sách"
        else:
            intent = "Trao đổi & lắng nghe khách hàng"

        return TurnAnalysisResult(
            intent_detected=intent,
            uncovered_facts=uncovered,
            revealed_statements=revealed_stmts,
            resolved_objections=resolved_objs,
            is_closing_attempt=is_closing,
            trust_delta=trust_delta,
            interest_delta=interest_delta
        )


turn_analyzer = TurnAnalyzer()
