"""
Rubric Session Evaluator.
Chủ quản: Duy (AI Customer Role-play & Coaching Engine)
Phối hợp: Đạt (Evaluation & Rubric Specifications)
Chấm điểm toàn diện phiên luyện tập theo 5 tiêu chí Rubric chuẩn:
1. need_discovery
2. product_knowledge
3. objection_handling
4. policy_accuracy
5. closing_next_step
"""
from typing import Any, Dict, List, Optional
from src.knowledge.metadata import (
    CriterionEvaluation,
    CriterionType,
    SessionEvaluationResult,
)
from src.roleplay.contracts import ScenarioContract
from src.roleplay.state import RoleplayState


class SessionEvaluator:
    """Đánh giá và chấm điểm phiên thực hành bán xe của tư vấn viên."""

    def evaluate_session(
        self,
        state: RoleplayState,
        scenario: ScenarioContract
    ) -> Dict[str, Any]:
        """Chấm điểm phiên luyện tập dựa trên transcript thực tế."""
        transcript = state.messages
        turn_count = state.turn_count
        revealed_count = len(state.revealed_facts)
        resolved_count = len(state.resolved_objections)

        advisor_texts = [m.content for m in transcript if m.role == "advisor"]
        full_advisor_str = " ".join(advisor_texts).lower()

        # 1. NEED DISCOVERY (Thấu hiểu nhu cầu)
        need_score = 3
        need_evidence = []
        if revealed_count >= 2:
            need_score = 5
            need_evidence.append(f"Tư vấn viên khai thác thành công {revealed_count} thông tin ẩn trọng yếu của khách hàng.")
        elif revealed_count == 1:
            need_score = 4
            need_evidence.append("Tư vấn viên đã chủ động đặt câu hỏi tìm hiểu quãng đường di chuyển của khách.")
        else:
            need_score = 2
            need_evidence.append("Chưa đặt đủ câu hỏi mở để làm rõ ngân sách và thói quen sạc của khách hàng.")

        need_eval = {
            "criterion": "need_discovery",
            "criterionNameVi": "Thấu hiểu nhu cầu (Need Discovery)",
            "score_5": need_score,
            "score": need_score * 20,
            "maxScore": 100,
            "definition": "Khai thác thói quen di chuyển thực tế, quy mô tài chính và nhu cầu sử dụng xe của khách.",
            "evidence": need_evidence,
            "reason": f"Khai thác được {revealed_count}/{len(scenario.disclosure_rules)} thông tin nhu cầu ẩn.",
            "improvementTip": "Chủ động hỏi thêm về điều kiện sạc pin tại gia đình/chung cư sớm hơn."
        }

        # 2. PRODUCT KNOWLEDGE (Kiến thức sản phẩm)
        pk_score = 3
        pk_evidence = []
        has_specs = any(kw in full_advisor_str for kw in ["mã lực", "hp", "kw", "kwh", "km", "phút", "sạc", "gầm", "ip67"])
        if has_specs:
            pk_score = 5
            pk_evidence.append("Trình bày chính xác thông số vận hành, thời gian sạc nhanh và chuẩn chống nước.")
        else:
            pk_score = 3
            pk_evidence.append("Chưa lồng ghép đủ số liệu kỹ thuật thuyết phục vào câu trả lời.")

        pk_eval = {
            "criterion": "product_knowledge",
            "criterionNameVi": "Kiến thức sản phẩm (Product Knowledge)",
            "score_5": pk_score,
            "score": pk_score * 20,
            "maxScore": 100,
            "definition": "Nắm vững thông số công suất, quãng đường di chuyển và thời gian sạc nhanh của xe VinFast.",
            "evidence": pk_evidence,
            "reason": "Thông số chuẩn xác, không bị nhầm lẫn giữa các phiên bản.",
            "improvementTip": "Lồng ghép thêm thông số khoảng sáng gầm xe để tăng tính thuyết phục."
        }

        # 3. OBJECTION HANDLING (Xử lý từ chối)
        obj_score = 3
        obj_evidence = []
        if resolved_count >= 1 or any(kw in full_advisor_str for kw in ["70%", "soh", "bảo hành", "chai pin", "đổi pin"]):
            obj_score = 5
            obj_evidence.append("Hóa giải thành công băn khoăn về pin bằng chính sách cam kết đổi mới khi SOH dưới 70%.")
        else:
            obj_score = 3
            obj_evidence.append("Cần phản biện thuyết phục hơn về băn khoăn chi phí thuê pin.")

        obj_eval = {
            "criterion": "objection_handling",
            "criterionNameVi": "Xử lý từ chối (Objection Handling)",
            "score_5": obj_score,
            "score": obj_score * 20,
            "maxScore": 100,
            "definition": "Hóa giải băn khoăn về chi phí pin, độ chai pin và so sánh với xe xăng.",
            "evidence": obj_evidence,
            "reason": "Biến điểm yếu tâm lý thành lợi thế bảo hành trọn đời an tâm.",
            "improvementTip": "Cần đồng cảm trước khi đưa ra các con số phản biện."
        }

        # 4. POLICY ACCURACY (Độ chính xác chính sách)
        pol_score = 4
        pol_evidence = []
        if any(kw in full_advisor_str for kw in ["trước bạ", "0%", "miễn", "v-green", "bảo hành 7", "bảo hành 10"]):
            pol_score = 5
            pol_evidence.append("Nêu chính xác Nghị định miễn 100% lệ phí trước bạ xe điện và mạng lưới trạm sạc V-GREEN.")
        else:
            pol_score = 4
            pol_evidence.append("Đã nắm chính sách nhưng chưa nêu bật quyền lợi sạc pin miễn phí.")

        pol_eval = {
            "criterion": "policy_accuracy",
            "criterionNameVi": "Độ chính xác chính sách (Policy Accuracy)",
            "score_5": pol_score,
            "score": pol_score * 20,
            "maxScore": 100,
            "definition": "Cập nhật chính xác ưu đãi trước bạ 0% và chương trình sạc miễn phí V-GREEN.",
            "evidence": pol_evidence,
            "reason": "Tuyệt đối không sai sót về chính sách giá và bảo hành 7-10 năm.",
            "improvementTip": "Tiếp tục duy trì phong độ cập nhật văn bản bán hàng mới nhất."
        }

        # 5. CLOSING / NEXT STEP (Chốt đơn & Bước tiếp theo)
        close_score = 3
        close_evidence = []
        if any(kw in full_advisor_str for kw in ["lái thử", "trải nghiệm", "cọc", "đặt cọc", "ghé showroom"]):
            close_score = 5 if turn_count >= 3 else 4
            close_evidence.append("Đã đưa ra lời mời lái thử và đăng ký giữ xe cụ thể.")
        else:
            close_score = 2
            close_evidence.append("Chưa chủ động đưa ra lời kêu gọi hành động (Call To Action).")

        close_eval = {
            "criterion": "closing_next_step",
            "criterionNameVi": "Chốt đơn & Bước tiếp theo (Closing / Next Step)",
            "score_5": close_score,
            "score": close_score * 20,
            "maxScore": 100,
            "definition": "Thúc đẩy bước tiếp theo: Đặt cọc giữ xe hoặc mời lái thử thực tế.",
            "evidence": close_evidence,
            "reason": "Đã có hành động chốt và hướng khách tới trải nghiệm thực tế.",
            "improvementTip": "Áp dụng kỹ năng chốt bằng lựa chọn thay thế (màu xe, ngày nhận xe)."
        }

        breakdown = [need_eval, pk_eval, obj_eval, pol_eval, close_eval]
        overall_score = int(sum(item["score"] for item in breakdown) / len(breakdown))

        return {
            "overall_score_5": round(sum(item["score_5"] for item in breakdown) / len(breakdown), 2),
            "overallScore": overall_score,
            "rubricBreakdown": breakdown,
            "passed": overall_score >= 70,
            "aiSummary": f"Tư vấn viên đạt kết quả {overall_score}/100. Nắm vững kiến thức sản phẩm và chính sách bảo hành pin VinFast.",
            "recommendedNextPractice": "Luyện tập thêm kịch bản khách hàng so sánh công nghệ ADAS để tăng tốc độ phản xạ."
        }


session_evaluator = SessionEvaluator()
