import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

@pytest.mark.asyncio
async def test_copilot_query():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/copilot/query", json={"query": "VF 3 pin bao nhiêu km"})
        assert resp.status_code == 200
        data = resp.json()
        assert "answer" in data
        assert "citations" in data
        assert len(data["citations"]) > 0

@pytest.mark.asyncio
async def test_practice_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List scenarios
        scen_resp = await client.get("/api/v1/scenarios")
        assert scen_resp.status_code == 200
        scenarios = scen_resp.json()
        assert len(scenarios) > 0
        scen_id = scenarios[0]["scenario_id"]

        # 2. Create session
        sess_resp = await client.post("/api/v1/practice/sessions", json={"scenarioId": scen_id})
        assert sess_resp.status_code == 200
        sess_data = sess_resp.json()
        session_id = sess_data["session_id"]
        assert "initial_message" in sess_data

        # 3. Send message
        msg_resp = await client.post(
            f"/api/v1/practice/{session_id}/message",
            json={"message": "Dạ em chào anh, anh đi mỗi ngày khoảng bao nhiêu km ạ?"}
        )
        assert msg_resp.status_code == 200
        msg_data = msg_resp.json()
        assert "customer_message" in msg_data

        # 4. Finish session
        finish_resp = await client.post(f"/api/v1/practice/{session_id}/finish")
        assert finish_resp.status_code == 200
        result = finish_resp.json()
        assert "overallScore" in result
        assert len(result["rubricBreakdown"]) == 5

@pytest.mark.asyncio
async def test_manager_hitl_and_telemetry():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a session and finish it to have a review
        sess_resp = await client.post("/api/v1/practice/sessions", json={"scenarioId": "SCENARIO_01_VF5_TAXI"})
        sess_id = sess_resp.json()["session_id"]
        await client.post(f"/api/v1/practice/{sess_id}/finish")

        # Get pending reviews
        rev_resp = await client.get("/api/v1/manager/reviews")
        assert rev_resp.status_code == 200

        # Approve review with manager score
        patch_resp = await client.patch(
            f"/api/v1/manager/reviews/{sess_id}",
            json={"managerScore": 90, "managerNote": "Tư vấn rất tốt bài toán dòng tiền."}
        )
        assert patch_resp.status_code == 200
        assert patch_resp.json()["managerScore"] == 90

        # Send telemetry
        tel_resp = await client.post("/api/v1/telemetry", json={"eventName": "test_event", "payload": {"foo": "bar"}})
        assert tel_resp.status_code == 200

        # Check telemetry summary
        sum_resp = await client.get("/api/v1/telemetry")
        assert sum_resp.status_code == 200
        assert sum_resp.json()["total_events"] > 0
