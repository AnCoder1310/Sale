import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.mark.asyncio
async def test_loan_calculator_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/calculator/loan", json={
            "carPrice": 850_000_000,
            "downPaymentPct": 20,
            "annualInterestRatePct": 5.0,
            "loanYears": 5
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["loanAmount"] == 680_000_000
        assert data["downPaymentAmount"] == 170_000_000
        assert data["monthlyPrincipal"] > 0
        assert "summaryVi" in data


@pytest.mark.asyncio
async def test_tco_calculator_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/calculator/tco", json={
            "vehicleModel": "VF 7",
            "competitorModel": "Mazda CX-5",
            "monthlyKm": 1500,
            "periodYears": 5
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["netSavings"] > 0
        assert data["taxSavings"] > 0
        assert "summaryVi" in data


@pytest.mark.asyncio
async def test_copilot_streaming_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/copilot/query/stream", json={
            "query": "VF 8 pin CATL đi được bao nhiêu km?"
        })
        assert resp.status_code == 200
        assert "text/event-stream" in resp.headers.get("content-type", "")
        body = resp.text
        assert "data:" in body
        assert "citations" in body or "chunk" in body


@pytest.mark.asyncio
async def test_competency_radar_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/advisor/adv-001/competency-radar")
        assert resp.status_code == 200
        data = resp.json()
        assert "radar" in data
        assert len(data["radar"]) == 5
        assert "topStrength" in data
        assert "skillGap" in data
        assert "recommendedScenario" in data


@pytest.mark.asyncio
async def test_certificate_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/practice/test-sess-01/certificate")
        assert resp.status_code == 200
        assert "text/html" in resp.headers.get("content-type", "")
        assert "VINFAST SALES ENABLEMENT COACH" in resp.text
        assert "RUBRIC" in resp.text


@pytest.mark.asyncio
async def test_database_stats_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/database/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "connected"
        assert data["database_file"] == "data/app.db"
        assert data["tables"]["users"] >= 3
        assert data["tables"]["training_assignments"] >= 2


@pytest.mark.asyncio
async def test_live_whisper_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/whisper/live-assist", json={
            "customerMessage": "Thuê pin 5 năm mất gần 180 triệu đắt quá em ơi?",
            "stage": "objection_handling",
            "vehicleModel": "VF 8"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "customer_sentiment" in data
        assert "hidden_intent" in data
        assert len(data["golden_bullets"]) == 3
        assert "suggested_speech" in data
        assert "verified_source" in data


@pytest.mark.asyncio
async def test_deal_sheet_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/deal-sheet/generate", json={
            "vehicleModel": "VF 7",
            "province": "Hà Nội",
            "batteryOption": "rental",
            "customerName": "Anh Tuấn"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["vehicleName"] == "VinFast VF 7 Plus"
        assert data["taxSaved"] > 0
        assert data["totalOnTheRoad"] > data["basePrice"]
        assert "zaloMessage" in data
        assert "ANH TUẤN" in data["zaloMessage"]


@pytest.mark.asyncio
async def test_charging_stations_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. List stations
        list_resp = await client.get("/api/v1/charging/stations")
        assert list_resp.status_code == 200
        stations = list_resp.json()
        assert len(stations) > 0
        first_id = stations[0]["id"]

        # 2. Get station detail
        detail_resp = await client.get(f"/api/v1/charging/stations/{first_id}")
        assert detail_resp.status_code == 200
        st = detail_resp.json()
        assert st["name"] == stations[0]["name"]
        assert "total_ports" in st

        # 3. Plan route
        route_resp = await client.post("/api/v1/charging/plan-route", json={
            "fromCity": "TP. Vinh",
            "toCity": "Hà Nội",
            "vehicleModel": "VF 8"
        })
        assert route_resp.status_code == 200
        route_data = route_resp.json()
        assert "recommended_stops" in route_data
        assert "advisor_pitch" in route_data
        assert len(route_data["recommended_stops"]) > 0
