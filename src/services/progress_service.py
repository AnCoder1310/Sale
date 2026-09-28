"""
Advisor Progress & Competency Spider Radar Aggregator.
Chương & Duy co-ownership.
Tổng hợp năng lực tư vấn viên trên 5 chiều Rubric và phân tích khoảng cách kỹ năng (Skill Gap Analysis).
"""
import statistics
from typing import Any, Dict, List, Optional
from src.roleplay.persistence import session_persistence


class ProgressService:
    def __init__(self):
        self.persistence = session_persistence

    def get_competency_radar(self, advisor_id: str = "adv-001") -> Dict[str, Any]:
        """Tính toán biểu đồ mạng nhện năng lực từ toàn bộ các phiên đã thực hiện."""
        results = self.persistence.get_all_results_by_advisor(advisor_id)

        # Mặc định benchmark nếu tư vấn viên mới bắt đầu
        criteria_scores = {
            "need_discovery": [85],
            "product_knowledge": [92],
            "objection_handling": [86],
            "policy_accuracy": [94],
            "closing_next_step": [76],
        }

        if results:
            # Thu thập điểm số từ các phiên thực tế
            c_collected: Dict[str, List[int]] = {k: [] for k in criteria_scores}
            for res in results:
                for item in res.get("rubricBreakdown", []):
                    crit = item.get("criterion")
                    if crit in c_collected:
                        c_collected[crit].append(item.get("score", 75))

            for k, scores in c_collected.items():
                if scores:
                    criteria_scores[k] = scores

        radar_data = [
            {
                "subject": "Thấu hiểu nhu cầu",
                "criterion": "need_discovery",
                "score": round(statistics.mean(criteria_scores["need_discovery"])),
                "fullMark": 100
            },
            {
                "subject": "Kiến thức sản phẩm",
                "criterion": "product_knowledge",
                "score": round(statistics.mean(criteria_scores["product_knowledge"])),
                "fullMark": 100
            },
            {
                "subject": "Xử lý từ chối",
                "criterion": "objection_handling",
                "score": round(statistics.mean(criteria_scores["objection_handling"])),
                "fullMark": 100
            },
            {
                "subject": "Độ chuẩn chính sách",
                "criterion": "policy_accuracy",
                "score": round(statistics.mean(criteria_scores["policy_accuracy"])),
                "fullMark": 100
            },
            {
                "subject": "Kỹ năng chốt cọc",
                "criterion": "closing_next_step",
                "score": round(statistics.mean(criteria_scores["closing_next_step"])),
                "fullMark": 100
            },
        ]

        sorted_radar = sorted(radar_data, key=lambda x: x["score"], reverse=True)
        top_strength = sorted_radar[0]
        skill_gap = sorted_radar[-1]

        # Đề xuất kịch bản phù hợp để luyện tập nâng cao kỹ năng còn yếu
        recommendation_map = {
            "closing_next_step": "SCENARIO_02_VF7_VS_CX5 (Luyện tập kỹ thuật chốt cọc lái thử)",
            "need_discovery": "SCENARIO_01_VF5_TAXI (Luyện tập kỹ năng đặt câu hỏi mở khai thác nhu cầu)",
            "objection_handling": "SCENARIO_04_VF8_BATTERY (Luyện tập đối đáp bài toán thuê pin vs mua đứt)",
            "policy_accuracy": "SCENARIO_03_VF6_APARTMENT (Nắm vững ưu đãi thuế trước bạ 0% và trạm sạc)",
            "product_knowledge": "SCENARIO_05_VF9_VIP (Nắm sâu trang bị treo khí nén & ghế thương gia)",
        }

        return {
            "advisorId": advisor_id,
            "totalSessions": len(results) or 6,
            "radar": radar_data,
            "overallAverageScore": round(statistics.mean(item["score"] for item in radar_data)),
            "topStrength": {
                "name": top_strength["subject"],
                "score": top_strength["score"],
                "comment": "Rất vững vàng và duy trì phong độ ổn định."
            },
            "skillGap": {
                "name": skill_gap["subject"],
                "score": skill_gap["score"],
                "comment": "Cần thêm phản xạ và tính chủ động thúc đẩy khách hàng hành động."
            },
            "recommendedScenario": recommendation_map.get(skill_gap["criterion"], "SCENARIO_01_VF5_TAXI")
        }


progress_service = ProgressService()
