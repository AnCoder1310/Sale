import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

@pytest.mark.asyncio
async def test_auth_login_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/auth/login", json={
            "email": "an.vt@vinfast.vn",
            "password": "123456"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "user" in data
        assert "tokens" in data
        assert data["user"]["role"] == "advisor"
        assert "accessToken" in data["tokens"]

@pytest.mark.asyncio
async def test_auth_login_invalid_password():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/auth/login", json={
            "email": "an.vt@vinfast.vn",
            "password": "wrong_password_xyz"
        })
        assert resp.status_code == 401

@pytest.mark.asyncio
async def test_auth_register_pending_and_admin_approve():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register new applicant (becomes pending guest, no role chosen)
        reg_resp = await client.post("/api/v1/auth/register", json={
            "name": "Nguyễn Văn Khách Mới",
            "email": "khach.moi@vinfast.vn",
            "phone": "0911223344",
            "password": "strongpassword123"
        })
        assert reg_resp.status_code == 200
        data = reg_resp.json()
        assert data["success"] is True
        assert data["user"]["account_status"] == "pending"
        assert data["user"]["role"] == "pending"
        user_id = data["user"]["id"]

        # 2. Admin views pending applicants
        pending_resp = await client.get("/api/v1/admin/pending-users")
        assert pending_resp.status_code == 200
        pending_users = pending_resp.json()
        assert any(u["id"] == user_id for u in pending_users)

        # 3. Admin approves applicant and assigns them to be an Advisor
        approve_resp = await client.post("/api/v1/admin/approve-user", json={
            "userId": user_id,
            "assignedRole": "advisor",
            "showroom": "VinFast Vinh, Nghệ An"
        })
        assert approve_resp.status_code == 200
        approved_user = approve_resp.json()["user"]
        assert approved_user["role"] == "advisor"
        assert approved_user["account_status"] == "active"

@pytest.mark.asyncio
async def test_auth_get_me():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/users/me")
        assert resp.status_code == 200
        assert resp.json()["id"] == "adv-001"
