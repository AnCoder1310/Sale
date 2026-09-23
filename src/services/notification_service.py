import asyncio
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import WebSocket

class NotificationService:
    def __init__(self):
        # Connected active WebSockets by user_id
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # In-memory notifications store
        self.notifications: List[Dict[str, Any]] = [
            {
                "id": "notif-init-01",
                "userId": "adv-001",
                "userRole": "advisor",
                "title": "Chính sách bán hàng VinFast 2026",
                "message": "Nghị định miễn 100% lệ phí trước bạ xe điện và gói tặng 1 năm sạc pin V-GREEN đã có hiệu lực.",
                "timestamp": "08:30 hôm nay",
                "read": False,
                "type": "policy_update",
                "targetTab": "knowledge"
            },
            {
                "id": "notif-init-02",
                "userId": "adv-001",
                "userRole": "advisor",
                "title": "Manager đã phê duyệt điểm",
                "message": "Lê Văn Hoàng (Training Director) đã duyệt phiên luyện tập VF 8 của bạn với điểm số 88/100.",
                "timestamp": "10:15 hôm nay",
                "read": False,
                "type": "review_approved",
                "targetTab": "session_result"
            },
            {
                "id": "notif-init-03",
                "userId": "mgr-001",
                "userRole": "manager",
                "title": "Phiên luyện tập mới chờ thẩm định",
                "message": "Võ Trường An vừa hoàn tất bài luyện tập 'VF 8 — Xử lý băn khoăn Pin Thuê vs Mua Đứt' (AI chấm: 86 điểm).",
                "timestamp": "14:30 hôm nay",
                "read": False,
                "type": "practice_completed",
                "targetTab": "manager_dashboard"
            }
        ]

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def push_notification(self, user_id: str, title: str, message: str, notif_type: str = "system", target_tab: Optional[str] = None, target_data: Optional[Dict[str, Any]] = None):
        notif = {
            "id": f"notif-{uuid.uuid4().hex[:8]}",
            "userId": user_id,
            "title": title,
            "message": message,
            "timestamp": datetime.now().strftime("%H:%M"),
            "read": False,
            "type": notif_type,
            "targetTab": target_tab,
            "targetData": target_data
        }
        self.notifications.insert(0, notif)

        # Broadcast via WebSockets if user is online
        if user_id in self.active_connections:
            dead_connections = []
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(notif)
                except Exception:
                    dead_connections.append(ws)
            for dead in dead_connections:
                self.disconnect(dead, user_id)
        return notif

    async def broadcast_role(self, role: str, title: str, message: str, notif_type: str = "system", target_tab: Optional[str] = None):
        """Send notification to all online users of a specific role."""
        notif = {
            "id": f"notif-{uuid.uuid4().hex[:8]}",
            "userRole": role,
            "title": title,
            "message": message,
            "timestamp": datetime.now().strftime("%H:%M"),
            "read": False,
            "type": notif_type,
            "targetTab": target_tab
        }
        self.notifications.insert(0, notif)

        for user_id, connections in list(self.active_connections.items()):
            dead_connections = []
            for ws in connections:
                try:
                    await ws.send_json(notif)
                except Exception:
                    dead_connections.append(ws)
            for dead in dead_connections:
                self.disconnect(dead, user_id)
        return notif

    def get_notifications(self, user_id: str) -> List[Dict[str, Any]]:
        # Return notifications targeted to this user or matching roles
        return [
            n for n in self.notifications 
            if n.get("userId") == user_id or n.get("userId") is None
        ]

    def mark_read(self, notif_id: str, user_id: str) -> bool:
        for n in self.notifications:
            if n["id"] == notif_id:
                n["read"] = True
                return True
        return False

    def mark_all_read(self, user_id: str) -> int:
        count = 0
        for n in self.notifications:
            if (n.get("userId") == user_id or n.get("userId") is None) and not n["read"]:
                n["read"] = True
                count += 1
        return count

notification_service = NotificationService()
