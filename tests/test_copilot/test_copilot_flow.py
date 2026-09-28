import pytest
from src.copilot.citation_validator import citation_validator
from src.copilot.graph import copilot_graph
from src.copilot.guardrails import guardrails
from src.copilot.intent_router import intent_router


@pytest.mark.asyncio
async def test_copilot_graph_end_to_end():
    result = await copilot_graph.ainvoke({
        "query": "VF 8 tăng tốc từ 0 đến 100 km/h mất bao lâu?",
        "vehicle_model": "VF 8"
    })
    assert "answer" in result
    assert "citations" in result
    assert len(result["citations"]) > 0
    assert result["intent"] == "product_specs"
    assert len(result["recommendedTalkingPoints"]) > 0


@pytest.mark.asyncio
async def test_copilot_greeting_flow():
    result = await copilot_graph.ainvoke({
        "query": "chào bạn"
    })
    assert "answer" in result
    assert "VinFast" in result["answer"]
    assert result["intent"] == "greeting"
    assert len(result["citations"]) == 0
    assert len(result["recommendedTalkingPoints"]) > 0


def test_intent_router_classification():
    assert intent_router.route_intent("chào bạn") == "greeting"
    assert intent_router.route_intent("hello bot") == "greeting"
    assert intent_router.route_intent("So sánh VF 7 với Mazda CX-5") == "battlecard_comparison"
    assert intent_router.route_intent("Chính sách thuê pin tháng 9 và chai pin dưới 70%") == "battery_and_charging"
    assert intent_router.route_intent("Miễn lệ phí trước bạ và gói vay trả góp 5%") == "policy_and_pricing"
    assert intent_router.route_intent("Công suất bao nhiêu mã lực") == "product_specs"


def test_guardrails_safety():
    is_safe, err = guardrails.check_safety("Mua xe VinFast", "Xe rất an toàn và đạt tiêu chuẩn ASEAN NCAP 5 sao")
    assert is_safe is True
    assert err is None

    is_unsafe, err = guardrails.check_safety("tẩy chay", "tẩy chay xe")
    assert is_unsafe is False
    assert err is not None


def test_citation_validator_filters_expired():
    citations = [
        {"id": "DOC_ACTIVE", "confidence": 0.8, "status": "active"},
        {"id": "DOC_EXPIRED", "confidence": 0.9, "status": "expired"}
    ]
    is_valid, filtered, warnings = citation_validator.validate_citations(citations, "Answer")
    assert is_valid is True
    assert len(filtered) == 1
    assert filtered[0]["id"] == "DOC_ACTIVE"
    assert len(warnings) > 0
