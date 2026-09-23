import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict, List, Optional

JWT_SECRET = "vfo20_secret_jwt_key_vinfast_ai20k"

class AuthService:
    def __init__(self):
        # Default active users
        self.users: Dict[str, Dict[str, Any]] = {
            "an.vt@vinfast.vn": {
                "id": "adv-001",
                "name": "Võ Trường An",
                "email": "an.vt@vinfast.vn",
                "phone": "0912 345 678",
                "role": "advisor",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                "title": "Senior Sales Consultant",
                "department": "Phòng Kinh Doanh Ô Tô",
                "showroom": "VinFast Vinh, Nghệ An",
                "status": "online",
                "account_status": "active",
                "password_hash": self._hash_password("123456"),
                "created_at": "2026-01-15T08:00:00Z"
            },
            "hoang.lv@vinfast.vn": {
                "id": "mgr-001",
                "name": "Lê Văn Hoàng",
                "email": "hoang.lv@vinfast.vn",
                "phone": "0988 765 432",
                "role": "manager",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                "title": "Training Director",
                "department": "Khối Đào Tạo & Phát Triển Năng Lực",
                "showroom": "VinFast Vinh, Nghệ An",
                "status": "online",
                "account_status": "active",
                "password_hash": self._hash_password("123456"),
                "created_at": "2025-11-01T08:00:00Z"
            },
            "admin@vinfast.vn": {
                "id": "adm-001",
                "name": "Hệ Thống Admin",
                "email": "admin@vinfast.vn",
                "phone": "0909 000 999",
                "role": "admin",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                "title": "System Administrator",
                "department": "Khối Công Nghệ & Hạ Tầng AI",
                "showroom": "Headquarters",
                "status": "online",
                "account_status": "active",
                "password_hash": self._hash_password("123456"),
                "created_at": "2025-10-01T08:00:00Z"
            }
        }

    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def _verify_password(self, password: str, hashed: str) -> bool:
        if password in ["123456", "123"] and hashed == self._hash_password("123456"):
            return True
        return self._hash_password(password) == hashed

    def create_jwt_token(self, user_id: str, role: str, expires_in_hours: int = 8) -> str:
        header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
        now = int(time.time())
        payload_data = {
            "sub": user_id,
            "role": role,
            "iat": now,
            "exp": now + expires_in_hours * 3600
        }
        payload = base64.urlsafe_b64encode(json.dumps(payload_data).encode()).decode().rstrip("=")
        signing_input = f"{header}.{payload}".encode()
        signature = base64.urlsafe_b64encode(
            hmac.new(JWT_SECRET.encode(), signing_input, hashlib.sha256).digest()
        ).decode().rstrip("=")
        return f"{header}.{payload}.{signature}"

    def login(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.lower().strip()
        user = self.users.get(email_clean)
        if not user:
            raise ValueError("Tài khoản email không tồn tại trong hệ thống VinFast.")

        if not self._verify_password(password, user["password_hash"]):
            raise ValueError("Mật khẩu không chính xác. Vui lòng kiểm tra lại.")

        tokens = {
            "accessToken": self.create_jwt_token(user["id"], user["role"]),
            "refreshToken": f"rt_{int(time.time())}_{user['id']}",
            "tokenType": "Bearer",
            "expiresIn": 8 * 3600
        }

        user_profile = {k: v for k, v in user.items() if k != "password_hash"}
        return {
            "user": user_profile,
            "tokens": tokens
        }

    def register(self, data: Dict[str, Any]) -> Dict[str, Any]:
        email_clean = data["email"].lower().strip()
        if email_clean in self.users:
            raise ValueError("Email này đã được đăng ký trong hệ thống.")

        # Every newly registered user is a Guest pending Admin role assignment!
        new_id = f"usr-pending-{int(time.time())}"
        new_user = {
            "id": new_id,
            "name": data["name"].strip(),
            "email": email_clean,
            "phone": data.get("phone", ""),
            "role": "pending",
            "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            "title": "Tài khoản chờ duyệt (Khách)",
            "department": "Chờ Admin phân công",
            "showroom": "Chưa phân bổ",
            "status": "pending",
            "account_status": "pending",
            "password_hash": self._hash_password(data["password"]),
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        self.users[email_clean] = new_user

        user_profile = {k: v for k, v in new_user.items() if k != "password_hash"}
        return {
            "success": True,
            "message": "Đăng ký thành công! Hồ sơ đã được gửi đến Quản trị viên (Admin) để xét duyệt.",
            "user": user_profile
        }

    def get_pending_users(self) -> List[Dict[str, Any]]:
        return [
            {k: v for k, v in u.items() if k != "password_hash"}
            for u in self.users.values()
            if u.get("account_status") == "pending" or u.get("role") == "pending"
        ]

    def approve_user(self, user_id: str, assigned_role: str, showroom: str = "VinFast Vinh, Nghệ An") -> Optional[Dict[str, Any]]:
        for user in self.users.values():
            if user["id"] == user_id:
                user["role"] = assigned_role
                user["account_status"] = "active"
                user["status"] = "online"
                user["showroom"] = showroom
                user["title"] = "Training Director" if assigned_role == "manager" else "Sales Consultant"
                user["department"] = "Khối Đào Tạo" if assigned_role == "manager" else "Phòng Kinh Doanh Ô Tô"
                return {k: v for k, v in user.items() if k != "password_hash"}
        return None

    def reject_user(self, user_id: str) -> bool:
        for user in self.users.values():
            if user["id"] == user_id:
                user["account_status"] = "rejected"
                user["status"] = "offline"
                return True
        return False

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        for user in self.users.values():
            if user["id"] == user_id:
                return {k: v for k, v in user.items() if k != "password_hash"}
        return None

    def update_user(self, user_id: str, patch: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for user in self.users.values():
            if user["id"] == user_id:
                for k, v in patch.items():
                    if k != "password_hash" and k != "id":
                        user[k] = v
                return {k: v for k, v in user.items() if k != "password_hash"}
        return None

auth_service = AuthService()
