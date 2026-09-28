import pytest
from src.roleplay.graph import roleplay_graph
from src.roleplay.scenario_loader import scenario_loader
from src.roleplay.turn_analyzer import turn_analyzer
from src.roleplay.evaluator import session_evaluator
from src.roleplay.state import RoleplayState


@pytest.mark.asyncio
async def test_roleplay_graph_full_lifecycle():
    session_id = "test-session-engine-01"
    scenario_id = "SCENARIO_01_VF5_TAXI"

    # 1. Start
    start_res = await roleplay_graph.start(
        session_id=session_id,
        scenario_id=scenario_id,
        advisor_id="test-adv",
        advisor_name="Tư Vấn Viên Mẫu"
    )
    assert start_res["sessionId"] == session_id
    assert "initial_message" in start_res
    assert start_res["trust_level"] == 3

    # 2. Continue: Discovery question
    c1 = await roleplay_graph.continue_session(
        session_id=session_id,
        advisor_message="Chào anh Nam, mỗi ngày anh chạy xe khoảng bao nhiêu km ạ?"
    )
    assert "daily_distance" in c1["revealed_facts"]
    assert c1["trust_level"] >= 4

    # 3. Continue: Objection handling
    c2 = await roleplay_graph.continue_session(
        session_id=session_id,
        advisor_message="Xe VF 5 sạc điện và thuê pin tiết kiệm hơn Vios nhiều, lại được bảo hành đổi pin khi SOH dưới 70%."
    )
    assert c2["trust_level"] >= 4

    # 4. Finish
    finish_res = await roleplay_graph.finish(session_id=session_id)
    assert finish_res["overallScore"] >= 70
    assert len(finish_res["rubricBreakdown"]) == 5
    criteria_names = [r["criterion"] for r in finish_res["rubricBreakdown"]]
    assert "need_discovery" in criteria_names
    assert "product_knowledge" in criteria_names
    assert "objection_handling" in criteria_names
    assert "policy_accuracy" in criteria_names
    assert "closing_next_step" in criteria_names


def test_scenario_loader_supports_legacy_and_new():
    scen_legacy = scenario_loader.get_scenario("scen-01")
    assert scen_legacy is not None
    assert "VF 8" in scen_legacy.title

    scen_gate1 = scenario_loader.get_scenario("SCENARIO_01_VF5_TAXI")
    assert scen_gate1 is not None
    assert scen_gate1.difficulty == "Medium"


def test_turn_analyzer_dialect_normalization():
    norm = turn_analyzer.normalize_dialect("Lỡ đang chạy giữa đàng mà hết điện thì mần răng hả chú?")
    assert "giữa đường" in norm
    assert "làm sao" in norm
