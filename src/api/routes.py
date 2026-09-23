from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException

from src.agents.graph import agent
from src.models.schemas import (
    ChatRequest,
    ChatResponse,
    CopilotQueryRequest,
    CopilotQueryResponse,
    CreatePracticeSessionRequest,
    SendPracticeMessageRequest,
    UpdateManagerReviewRequest,
    CreateAssignmentRequest,
    TelemetryEventRequest,
)
from src.services.copilot_service import copilot_service
from src.services.practice_service import practice_service
from src.services.manager_service import manager_service
from src.services.telemetry_service import telemetry_service

router = APIRouter()

# ----------------- Copilot RAG Endpoints -----------------
@router.post("/copilot/query", response_model=CopilotQueryResponse)
async def query_copilot(req: CopilotQueryRequest):
    """Truy vấn kiến thức xe VinFast và chính sách bán hàng."""
    try:
        res = await copilot_service.query(req.query, req.vehicleModel)
        telemetry_service.record_event("copilot_query", {"query": req.query})
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/copilot/sources/{doc_id}")
async def get_copilot_source(doc_id: str):
    """Lấy chi tiết văn bản căn cứ nguồn."""
    doc = copilot_service.get_source_detail(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu nguồn")
    telemetry_service.record_event("source_clicked", {"doc_id": doc_id})
    return doc


# ----------------- Role-play Practice Endpoints -----------------
@router.get("/scenarios")
async def list_scenarios():
    """Danh sách các kịch bản luyện tập bán xe VinFast."""
    return practice_service.get_scenarios()


@router.post("/practice/sessions")
async def create_practice_session(req: CreatePracticeSessionRequest):
    """Khởi tạo phiên luyện tập tương tác đa lượt với AI Customer."""
    session = practice_service.create_session(
        scenario_id=req.scenarioId,
        advisor_id=req.advisorId or "adv-001",
        advisor_name=req.advisorName or "Võ Trường An"
    )
    telemetry_service.record_event("session_started", {
        "session_id": session["session_id"],
        "scenario_id": req.scenarioId
    })
    return session


@router.post("/practice/{session_id}/message")
async def send_practice_message(session_id: str, req: SendPracticeMessageRequest):
    """Gửi phản hồi của tư vấn viên và nhận câu trả lời mô phỏng từ khách hàng."""
    res = await practice_service.send_message(session_id, req.message)
    telemetry_service.record_event("message_sent", {
        "session_id": session_id,
        "length": len(req.message)
    })
    return res


@router.post("/practice/{session_id}/finish")
async def finish_practice_session(session_id: str):
    """Kết thúc phiên luyện tập và tạo báo cáo đánh giá 5 tiêu chí Rubric."""
    result = practice_service.finish_session(session_id)
    telemetry_service.record_event("session_finished", {
        "session_id": session_id,
        "overall_score": result["overallScore"]
    })
    # Real-time push to Training Manager
    try:
        await notification_service.push_notification(
            user_id="mgr-001",
            title="Phiên luyện tập mới chờ duyệt",
            message=f"{result.get('advisorName', 'Tư vấn viên')} vừa hoàn thành '{result.get('scenarioTitle', 'Bài luyện tập')}' (AI chấm: {result['overallScore']}/100).",
            notif_type="practice_completed",
            target_tab="manager_dashboard",
            target_data={"sessionId": session_id}
        )
    except Exception as e:
        print("Notification push error:", e)
    return result


@router.get("/practice/{session_id}/result")
async def get_practice_result(session_id: str):
    """Xem lại kết quả đánh giá của phiên luyện tập."""
    result = practice_service.get_result(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Không tìm thấy kết quả phiên")
    return result


# ----------------- Manager HITL Endpoints -----------------
@router.get("/manager/reviews")
async def get_pending_reviews():
    """Hàng đợi các phiên luyện tập đang chờ Quản lý phê duyệt (HITL)."""
    return manager_service.get_pending_reviews()


@router.patch("/manager/reviews/{session_id}")
async def update_manager_review(session_id: str, req: UpdateManagerReviewRequest):
    """Quản lý hiệu chỉnh điểm số, nhập nhận xét và phê duyệt kết quả."""
    updated = manager_service.update_review(
        session_id=session_id,
        manager_score=req.managerScore,
        manager_note=req.managerNote,
        reviewer_name=req.reviewerName or "Lê Văn Hoàng"
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiên cần duyệt")
    telemetry_service.record_event("manager_review_approved", {
        "session_id": session_id,
        "manager_score": req.managerScore
    })
    # Real-time push to Advisor
    try:
        await notification_service.push_notification(
            user_id=updated.get("advisorId", "adv-001"),
            title="Manager đã duyệt đánh giá",
            message=f"Quản lý {req.reviewerName or 'Lê Văn Hoàng'} đã phê duyệt phiên luyện tập của bạn với điểm số {req.managerScore}/100!",
            notif_type="review_approved",
            target_tab="session_result",
            target_data={"sessionId": session_id}
        )
    except Exception as e:
        print("Notification push error:", e)
    return updated


@router.get("/manager/assignments")
async def get_assignments():
    """Danh sách các bài tập đã giao cho đội ngũ."""
    return manager_service.get_assignments()


@router.post("/manager/assignments")
async def create_assignment(req: CreateAssignmentRequest):
    """Giao bài tập kịch bản mới cho tư vấn viên."""
    asg = manager_service.create_assignment(req.model_dump())
    telemetry_service.record_event("assignment_created", asg)
    return asg


# ----------------- Telemetry Endpoints -----------------
@router.post("/telemetry")
async def log_telemetry_event(req: TelemetryEventRequest):
    """Ghi nhận sự kiện UX telemetry từ phía client."""
    return telemetry_service.record_event(req.eventName, req.payload, req.userId or "adv-001")


@router.get("/telemetry")
async def get_telemetry_summary():
    """Thống kê tổng hợp số liệu tương tác của người dùng."""
    return telemetry_service.get_summary()


# ----------------- Admin Health & Status -----------------
@router.get("/admin/health")
async def admin_system_health():
    """Trạng thái sức khỏe vi dịch vụ hệ thống."""
    return {
        "status": "healthy",
        "services": [
            {"name": "FastAPI Core Engine", "status": "UP", "latencyMs": 15},
            {"name": "Knowledge Corpus Engine", "status": "UP", "docsCount": len(copilot_service.documents)},
            {"name": "Roleplay Multi-turn Graph", "status": "UP", "activeSessions": len(practice_service.sessions)},
            {"name": "Manager HITL Pipeline", "status": "UP", "pendingCount": len(manager_service.get_pending_reviews())},
        ]
    }


# Legacy agent compatibility
@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        result = await agent.ainvoke({"query": request.message})
        return ChatResponse(
            response=result.get("response", ""),
            analysis=result.get("analysis", ""),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def agent_status():
    return {"status": "ready", "agent": "VinFast Sales Coach Agent v1.0"}


# ----------------- Real-time Notifications & WebSocket -----------------
from fastapi import WebSocket, WebSocketDisconnect
from src.services.notification_service import notification_service

@router.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    """Kênh WebSocket lắng nghe thông báo thời gian thực theo user_id."""
    await notification_service.connect(websocket, user_id)
    try:
        while True:
            # Keep-alive ping/pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        notification_service.disconnect(websocket, user_id)
    except Exception:
        notification_service.disconnect(websocket, user_id)


@router.get("/notifications")
async def get_user_notifications(user_id: str = "adv-001"):
    """Lấy danh sách thông báo của người dùng kèm số lượng chưa đọc."""
    items = notification_service.get_notifications(user_id)
    unread_count = sum(1 for item in items if not item.get("read"))
    return {
        "unread_count": unread_count,
        "notifications": items
    }


@router.patch("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, user_id: str = "adv-001"):
    """Đánh dấu một thông báo đã đọc."""
    ok = notification_service.mark_read(notif_id, user_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông báo")
    return {"status": "success", "id": notif_id}


@router.post("/notifications/read-all")
async def mark_all_notifications_read(user_id: str = "adv-001"):
    """Đánh dấu toàn bộ thông báo của người dùng đã đọc."""
    count = notification_service.mark_all_read(user_id)
    return {"status": "success", "marked_count": count}

# ----------------- Regional Dialects Knowledge Endpoints -----------------
from src.services.dialect_service import dialect_service

@router.get("/dialects")
async def list_regional_dialects(region: Optional[str] = None):
    """Danh mục từ điển khẩu ngữ vùng miền chuẩn hóa (Nghệ Tĩnh, Miền Nam, Miền Bắc)."""
    return dialect_service.get_all(region)

@router.post("/dialects/normalize")
async def normalize_dialect_query(payload: Dict[str, str]):
    """Phân tích và dịch nghĩa câu khẩu ngữ địa phương của khách hàng."""
    text = payload.get("text", "")
    return dialect_service.detect_and_normalize(text)

# ----------------- Authentication Endpoints -----------------
from src.services.auth_service import auth_service
from src.models.schemas import LoginRequest, RegisterRequest, RefreshTokenRequest, AuthLoginResponse

@router.post("/auth/login", response_model=AuthLoginResponse)
async def api_auth_login(req: LoginRequest):
    """Xác thực đăng nhập và cấp phát JWT tokens."""
    try:
        res = auth_service.login(req.email, req.password)
        telemetry_service.record_event("user_login_success", {"email": req.email, "role": res["user"]["role"]})
        return res
    except ValueError as e:
        telemetry_service.record_event("user_login_failed", {"email": req.email})
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/register")
async def api_auth_register(req: RegisterRequest):
    """Đăng ký tài khoản Advisor hoặc Manager."""
    try:
        res = auth_service.register(req.model_dump())
        telemetry_service.record_event("user_registered", {"email": req.email, "role": req.role})
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auth/logout")
async def api_auth_logout():
    """Đăng xuất phiên làm việc."""
    return {"success": True, "message": "Logged out successfully"}

@router.post("/auth/refresh")
async def api_auth_refresh(req: RefreshTokenRequest):
    """Làm mới access token."""
    user = auth_service.users.get("an.vt@vinfast.vn")
    token = auth_service.create_jwt_token(user["id"], user["role"])
    return {
        "accessToken": token,
        "refreshToken": req.refreshToken,
        "tokenType": "Bearer",
        "expiresIn": 28800
    }

@router.get("/auth/me")
@router.get("/users/me")
async def api_get_current_user():
    """Lấy thông tin profile người dùng hiện tại."""
    user = auth_service.get_user_by_id("adv-001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/users/me")
async def api_update_current_user(patch: Dict[str, Any]):
    """Cập nhật thông tin profile người dùng."""
    updated = auth_service.update_user("adv-001", patch)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

# ----------------- Admin User Approval Endpoints -----------------
from src.models.schemas import ApproveUserRequest, RejectUserRequest

@router.get("/admin/pending-users")
async def api_admin_get_pending_users():
    """Lấy danh sách các tài khoản khách vừa đăng ký đang chờ Admin duyệt."""
    return auth_service.get_pending_users()

@router.post("/admin/approve-user")
async def api_admin_approve_user(req: ApproveUserRequest):
    """Admin duyệt tài khoản và chỉ định vai trò (Advisor / Manager)."""
    user = auth_service.approve_user(req.userId, req.assignedRole, req.showroom or "VinFast Vinh, Nghệ An")
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản cần duyệt")
    telemetry_service.record_event("user_approved_by_admin", {"userId": req.userId, "assignedRole": req.assignedRole})
    return {"success": True, "message": "Đã phê duyệt tài khoản thành công!", "user": user}

@router.post("/admin/reject-user")
async def api_admin_reject_user(req: RejectUserRequest):
    """Admin từ chối cấp quyền cho tài khoản."""
    ok = auth_service.reject_user(req.userId)
    if not ok:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
    return {"success": True, "message": "Đã từ chối tài khoản"}
