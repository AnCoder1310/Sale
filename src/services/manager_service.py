"""
Manager HITL Service.
Chương & Duy co-ownership.
Quản lý hàng đợi xét duyệt (HITL Review), hiệu chỉnh điểm số, và giao bài tập đào tạo.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional
from src.roleplay.persistence import session_persistence


class ManagerService:
    def __init__(self):
        self.persistence = session_persistence
        self.assignments: List[Dict[str, Any]] = [
            {
                "id": "asg-01",
                "title": "Luyện tập xử lý thắc mắc Pin VF 8",
                "scenarioTitle": "Bác tài chạy dịch vụ cân nhắc đổi từ xe xăng sang VF 5 Plus",
                "targetVehicle": "VinFast VF 5 Plus",
                "assignedToAdvisor": "Trần Thị Mai Anh",
                "assignedByManager": "Lê Văn Hoàng",
                "dueDate": "2026-09-30",
                "status": "pending"
            },
            {
                "id": "asg-02",
                "title": "Thuyết phục khách hàng truyền thống đi VF 9",
                "scenarioTitle": "Khách hàng băn khoăn trạm sạc và tính năng tự lái ADAS",
                "targetVehicle": "VinFast VF 9 Plus (6 chỗ)",
                "assignedToAdvisor": "Võ Trường An",
                "assignedByManager": "Lê Văn Hoàng",
                "dueDate": "2026-09-28",
                "status": "completed",
                "score": 88
            }
        ]

    def get_pending_reviews(self) -> List[Dict[str, Any]]:
        """Lấy danh sách các phiên luyện tập đang chờ Quản lý phê duyệt."""
        return self.persistence.get_pending_reviews()

    def update_review(
        self,
        session_id: str,
        manager_score: int,
        manager_note: str,
        reviewer_name: str = "Lê Văn Hoàng"
    ) -> Optional[Dict[str, Any]]:
        """Quản lý điều chỉnh điểm và phê duyệt."""
        return self.persistence.update_review(
            session_id=session_id,
            manager_score=manager_score,
            manager_note=manager_note,
            reviewer_name=reviewer_name
        )

    def get_assignments(self) -> List[Dict[str, Any]]:
        return self.assignments

    def create_assignment(self, assignment_data: Dict[str, Any]) -> Dict[str, Any]:
        asg = {
            "id": f"asg-{len(self.assignments) + 1}",
            "title": assignment_data.get("title", "Luyện tập chỉ định"),
            "scenarioTitle": assignment_data.get("scenarioTitle", "Kịch bản bán xe VinFast"),
            "targetVehicle": assignment_data.get("targetVehicle", "VinFast EV"),
            "assignedToAdvisor": assignment_data.get("assignedToAdvisor", "Võ Trường An"),
            "assignedByManager": assignment_data.get("assignedByManager", "Lê Văn Hoàng"),
            "dueDate": assignment_data.get("dueDate", "2026-09-30"),
            "status": "pending"
        }
        self.assignments.insert(0, asg)
        return asg


manager_service = ManagerService()
