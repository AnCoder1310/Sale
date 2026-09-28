"""
Judge Evaluation & Rubric Calibration Runner.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phối hợp: Duy (Evaluator Engine)
Đánh giá độ tương thích giữa AI Evaluator và Chuyên gia Đào tạo trên tập 10 transcripts mẫu.
"""
from typing import Any, Dict, List
from eval.metrics import calculate_criterion_agreement, calculate_rubric_mae
from src.roleplay.evaluator import session_evaluator
from src.roleplay.scenario_loader import scenario_loader
from src.roleplay.state import RoleplayMessage, RoleplayState

# Tập 10 transcript mẫu đã được giám khảo con người (Training Manager) gán nhãn điểm chuẩn (1-5)
BENCHMARK_TRANSCRIPTS = [
    {
        "case_id": "TRANSCRIPT_01",
        "scenario_id": "SCENARIO_01_VF5_TAXI",
        "revealed_facts": ["daily_distance", "budget"],
        "resolved_objections": ["OBJ_VF5_BATTERY_VS_GAS"],
        "advisor_texts": [
            "Chào anh Nam, anh chạy xe taxi mỗi ngày khoảng bao nhiêu km ạ?",
            "Anh Nam chuẩn bị ngân sách khoảng bao nhiêu tiền trả trước?",
            "Dạ tiền thuê pin và tiền điện VF 5 chỉ khoảng 980đ/km, rẻ hơn Vios 1.600đ/km, mỗi tháng tiết kiệm hơn 3 triệu. Em mời anh ghé showroom lái thử và đặt cọc xe luôn nhé!"
        ],
        "human_ground_truth": {
            "need_discovery": 5,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 5,
            "closing_next_step": 5
        }
    },
    {
        "case_id": "TRANSCRIPT_02",
        "scenario_id": "SCENARIO_02_VF7_VS_CX5",
        "revealed_facts": ["night_drive"],
        "resolved_objections": [],
        "advisor_texts": [
            "Chị Phương Lan hay đi công tác ban đêm ở tuyến đường nào ạ?",
            "VF 7 công suất 349 mã lực và có ADAS tự giữ làn đi đêm rất an toàn chị ạ."
        ],
        "human_ground_truth": {
            "need_discovery": 4,
            "product_knowledge": 5,
            "objection_handling": 3,
            "policy_accuracy": 4,
            "closing_next_step": 2
        }
    },
    {
        "case_id": "TRANSCRIPT_03",
        "scenario_id": "SCENARIO_03_VF6_APARTMENT",
        "revealed_facts": ["commute_pattern", "charging_constraint"],
        "resolved_objections": ["OBJ_VF6_NO_HOME_CHARGER"],
        "advisor_texts": [
            "Gia đình mình mỗi tuần đi lại bao nhiêu km và chung cư mình có chỗ cắm sạc không ạ?",
            "Xe đi được gần 400km nên cả tuần chỉ cần ghé Vincom sạc nhanh 1 lần 25 phút trong lúc mua sắm. Xe còn được miễn 100% trước bạ.",
            "Cuối tuần này em mời hai vợ chồng qua showroom lái thử nhé!"
        ],
        "human_ground_truth": {
            "need_discovery": 5,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 5,
            "closing_next_step": 4
        }
    },
    {
        "case_id": "TRANSCRIPT_04",
        "scenario_id": "SCENARIO_04_VF8_BATTERY",
        "revealed_facts": [],
        "resolved_objections": [],
        "advisor_texts": [
            "Xe VF 8 đẹp lắm anh mua luôn đi ạ!",
            "Anh cọc luôn hôm nay em giảm giá thêm cho."
        ],
        "human_ground_truth": {
            "need_discovery": 2,
            "product_knowledge": 3,
            "objection_handling": 3,
            "policy_accuracy": 4,
            "closing_next_step": 4
        }
    },
    {
        "case_id": "TRANSCRIPT_05",
        "scenario_id": "SCENARIO_05_VF9_VIP",
        "revealed_facts": ["vip_lounge"],
        "resolved_objections": ["OBJ_BRAND_PRESTIGE"],
        "advisor_texts": [
            "Bác Minh có thường xuyên ngồi ở hàng ghế sau để thư giãn và nghỉ ngơi không ạ?",
            "VF 9 có hàng ghế Cơ trưởng massage chuyên sâu và hệ thống treo khí nén điện tử êm ái như chuyên cơ, chỉ dành riêng cho các chủ tịch và đối tác ngoại giao lớn. Xe bảo hành 10 năm.",
            "Em xin phép cho xe VF 9 qua tận biệt thự mời Bác trải nghiệm thực tế ạ."
        ],
        "human_ground_truth": {
            "need_discovery": 4,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 5,
            "closing_next_step": 5
        }
    },
    {
        "case_id": "TRANSCRIPT_06",
        "scenario_id": "SCENARIO_06_VF3_FIRST_CAR",
        "revealed_facts": ["water_wading", "budget"],
        "resolved_objections": ["OBJ_EV_WATER_SHOCK"],
        "advisor_texts": [
            "Tuyến đường đi làm của bạn có hay bị ngập nước không và bạn chuẩn bị ngân sách trả trước bao nhiêu?",
            "Pin VF 3 đạt chuẩn chống nước IP67 ngâm nước 30 phút an toàn tuyệt đối và gầm cao 191 mm lội nước cực tốt không lo giật điện.",
            "Mời bạn qua lái thử và chọn màu xe cá tính nhé!"
        ],
        "human_ground_truth": {
            "need_discovery": 5,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 4,
            "closing_next_step": 4
        }
    },
    {
        "case_id": "TRANSCRIPT_07",
        "scenario_id": "SCENARIO_07_EXPAT_DAVID",
        "revealed_facts": ["expat_docs", "family_needs"],
        "resolved_objections": ["OBJ_ENGLISH_ASSISTANT"],
        "advisor_texts": [
            "Do you have a valid Temporary Residence Card (TRC) or Work Permit in Vietnam?",
            "Our infotainment system and Vivi smart assistant support 100% native English voice commands for navigation and climate.",
            "I'd love to invite you and your family for an English-guided test drive this weekend."
        ],
        "human_ground_truth": {
            "need_discovery": 5,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 4,
            "closing_next_step": 4
        }
    },
    {
        "case_id": "TRANSCRIPT_08",
        "scenario_id": "SCENARIO_08_BAC_BA_NGHE_AN",
        "revealed_facts": ["local_route", "flooding_anxiety"],
        "resolved_objections": ["OBJ_FLOOD_WATER_NGHE_AN"],
        "advisor_texts": [
            "Mỗi ngày Bác Ba chạy khách tuyến Vinh - Cửa Lò khoảng bao nhiêu cây số ạ?",
            "Bác Ba cứ yên tâm là pin con VF 5 đạt chuẩn IP67 ngâm nước lụt nửa mét thoải mái không sợ chết máy, tiền sạc điện chỉ 450đ/cây số.",
            "Cuối tuần mời Bác Ba ghé VinFast Vinh lái thử con xe nhé!"
        ],
        "human_ground_truth": {
            "need_discovery": 5,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 4,
            "closing_next_step": 4
        }
    },
    {
        "case_id": "TRANSCRIPT_09",
        "scenario_id": "SCENARIO_01_VF5_TAXI",
        "revealed_facts": ["daily_distance"],
        "resolved_objections": [],
        "advisor_texts": [
            "Mỗi ngày anh chạy bao nhiêu km?",
            "VF 5 chạy điện sạc nhanh 30 phút là đầy pin."
        ],
        "human_ground_truth": {
            "need_discovery": 4,
            "product_knowledge": 5,
            "objection_handling": 3,
            "policy_accuracy": 4,
            "closing_next_step": 2
        }
    },
    {
        "case_id": "TRANSCRIPT_10",
        "scenario_id": "SCENARIO_02_VF7_VS_CX5",
        "revealed_facts": ["night_drive"],
        "resolved_objections": ["OBJ_VF7_RANGE_ANXIETY"],
        "advisor_texts": [
            "Chị Lan hay đi tỉnh ban đêm cung đường nào ạ?",
            "Pin VF 7 đi được hơn 430 km và sạc nhanh 24 phút tại trạm V-GREEN, có sạc pin miễn phí 1 năm và bảo hành 10 năm.",
            "Em mời chị ghé lái thử trải nghiệm ga điện 349 mã lực cuối tuần này nhé!"
        ],
        "human_ground_truth": {
            "need_discovery": 4,
            "product_knowledge": 5,
            "objection_handling": 5,
            "policy_accuracy": 5,
            "closing_next_step": 4
        }
    }
]


def run_judge_evaluation() -> Dict[str, Any]:
    """Chạy kiểm định độ chính xác của AI Evaluator đối chiếu với điểm chuẩn Chuyên gia."""
    total_cases = len(BENCHMARK_TRANSCRIPTS)
    mae_list = []
    agreement_list = []

    criteria_errors: Dict[str, List[float]] = {
        "need_discovery": [],
        "product_knowledge": [],
        "objection_handling": [],
        "policy_accuracy": [],
        "closing_next_step": []
    }

    for case in BENCHMARK_TRANSCRIPTS:
        sc = scenario_loader.get_scenario(case["scenario_id"])
        state = RoleplayState.from_scenario("eval-test", sc)
        state.revealed_facts = case["revealed_facts"]
        state.resolved_objections = case["resolved_objections"]
        state.turn_count = len(case["advisor_texts"])

        for txt in case["advisor_texts"]:
            state.messages.append(RoleplayMessage(role="advisor", content=txt))

        # Đánh giá bằng AI Evaluator
        eval_res = session_evaluator.evaluate_session(state, sc)

        predicted_scores = {item["criterion"]: item["score_5"] for item in eval_res["rubricBreakdown"]}
        ground_truth = case["human_ground_truth"]

        mae = calculate_rubric_mae(predicted_scores, ground_truth)
        agreement = calculate_criterion_agreement(predicted_scores, ground_truth, tolerance=1.0)

        mae_list.append(mae)
        agreement_list.append(agreement)

        for crit in criteria_errors.keys():
            diff = abs(predicted_scores.get(crit, 3) - ground_truth.get(crit, 3))
            criteria_errors[crit].append(diff)

    avg_mae = round(sum(mae_list) / total_cases, 2)
    avg_agreement = round(sum(agreement_list) / total_cases * 100, 2)

    crit_summary = {k: round(sum(v) / len(v), 2) for k, v in criteria_errors.items()}

    return {
        "total_cases_evaluated": total_cases,
        "overall_judge_mae": avg_mae,
        "criterion_agreement_pct": avg_agreement,
        "criteria_mae_breakdown": crit_summary,
        "status": "PASS" if avg_mae <= 0.5 and avg_agreement >= 90 else "FAIL"
    }


if __name__ == "__main__":
    res = run_judge_evaluation()
    print("=== KẾT QUẢ JUDGE CALIBRATION BENCHMARK ===")
    print(f"Tổng số hồ sơ chấm điểm đối chứng: {res['total_cases_evaluated']}")
    print(f"Sai số tuyệt đối trung bình (MAE): {res['overall_judge_mae']} (Thang 1-5)")
    print(f"Tỷ lệ đồng thuận với Chuyên gia (±1 điểm): {res['criterion_agreement_pct']}%")
    print("Chi tiết MAE theo từng tiêu chí:")
    for c, val in res["criteria_mae_breakdown"].items():
        print(f"- {c}: {val}")
    print(f"Trạng thái: {res['status']}")
