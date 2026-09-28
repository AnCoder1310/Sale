"""
Roleplay Multi-Turn Evaluation Runner.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phối hợp: Duy (Roleplay Agent & Graph)
Chạy kiểm thử tương tác đa lượt (Multi-turn E2E) trên toàn bộ danh mục kịch bản.
"""
import asyncio
from typing import Any, Dict, List
import uuid

from src.roleplay.graph import roleplay_graph
from src.roleplay.scenario_loader import scenario_loader


async def run_roleplay_evaluation() -> Dict[str, Any]:
    """Chạy giả lập hội thoại bán hàng qua nhiều lượt cho các kịch bản."""
    scenarios = scenario_loader.get_all_scenarios()
    total_scenarios = len(scenarios)

    scenarios_passed = 0
    disclosure_rule_tests_passed = 0
    objection_handling_tests_passed = 0
    finish_eval_tests_passed = 0
    details = []

    for sc in scenarios:
        sc_id = sc["scenario_id"]
        sess_id = f"eval-{uuid.uuid4().hex[:6]}"

        # 1. Start session
        start_res = await roleplay_graph.start(
            session_id=sess_id,
            scenario_id=sc_id,
            advisor_id="eval-adv",
            advisor_name="Kiểm Thử Viên"
        )
        assert start_res["initial_message"]["text"] is not None

        # 2. Turn 1: Discovery Question
        rule = sc.get("disclosure_rules", [{}])[0]
        trigger_kw = rule.get("trigger_keywords", ["quãng đường"])[0]
        t1_res = await roleplay_graph.continue_session(
            session_id=sess_id,
            advisor_message=f"Dạ em chào anh/chị, cho em hỏi mình thường di chuyển {trigger_kw} thế nào ạ?"
        )
        # Check disclosure
        revealed = t1_res.get("revealed_facts", [])
        if rule.get("fact_key") in revealed:
            disclosure_rule_tests_passed += 1

        # 3. Turn 2: Objection Handling & Proof
        t2_res = await roleplay_graph.continue_session(
            session_id=sess_id,
            advisor_message="Dạ xe VinFast có bảo hành pin và đổi pin mới 100% khi dung lượng SOH dưới 70%, lại được miễn 100% lệ phí trước bạ cực kỳ tiết kiệm ạ!"
        )
        if t2_res.get("trust_level", 0) >= 4:
            objection_handling_tests_passed += 1

        # 4. Turn 3: Closing Next Step
        t3_res = await roleplay_graph.continue_session(
            session_id=sess_id,
            advisor_message="Em mời anh/chị cuối tuần này ghé showroom lái thử trải nghiệm thực tế xe và đặt cọc giữ xe nhận ưu đãi luôn nhé!"
        )

        # 5. Finish and Evaluate
        eval_res = await roleplay_graph.finish(session_id=sess_id)
        if eval_res.get("overallScore") and len(eval_res.get("rubricBreakdown", [])) == 5:
            finish_eval_tests_passed += 1
            scenarios_passed += 1

        details.append({
            "scenario_id": sc_id,
            "title": sc["title"],
            "turns": eval_res.get("duration"),
            "score": eval_res.get("overallScore"),
            "revealed_count": len(revealed)
        })

    return {
        "total_scenarios_tested": total_scenarios,
        "scenarios_passed": scenarios_passed,
        "disclosure_pass_rate": round(disclosure_rule_tests_passed / total_scenarios * 100, 2),
        "objection_pass_rate": round(objection_handling_tests_passed / total_scenarios * 100, 2),
        "finish_eval_pass_rate": round(finish_eval_tests_passed / total_scenarios * 100, 2),
        "status": "PASS" if scenarios_passed == total_scenarios else "FAIL",
        "scenario_details": details
    }


if __name__ == "__main__":
    res = asyncio.run(run_roleplay_evaluation())
    print("=== KẾT QUẢ ROLE-PLAY MULTI-TURN BENCHMARK ===")
    print(f"Tổng kịch bản kiểm thử: {res['total_scenarios_tested']}")
    print(f"Hoàn thành trọn vẹn: {res['scenarios_passed']}/{res['total_scenarios_tested']}")
    print(f"Tỷ lệ kích hoạt thông tin ẩn đúng lúc: {res['disclosure_pass_rate']}%")
    print(f"Tỷ lệ giải tỏa từ chối & tăng thiện cảm: {res['objection_pass_rate']}%")
    print(f"Tỷ lệ sinh Rubric 5 tiêu chí: {res['finish_eval_pass_rate']}%")
    print(f"Trạng thái: {res['status']}")
