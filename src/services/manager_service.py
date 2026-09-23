from datetime import datetime
from typing import Any, Dict, List, Optional
from src.services.practice_service import practice_service

class ManagerService:
    def __init__(self):
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
        # Filter unreviewed results
        return [r for r in practice_service.pending_reviews if not r.get("managerReviewed")]

    def update_review(self, session_id: str, manager_score: int, manager_note: str, reviewer_name: str = "Lê Văn Hoàng") -> Optional[Dict[str, Any]]:
        result = practice_service.results.get(session_id)
        if not result:
            for r in practice_service.pending_reviews:
                if r.get("sessionId") == session_id:
                    result = r
                    break

        if result:
            result["managerReviewed"] = True
            result["managerScore"] = manager_score
            result["managerNote"] = manager_note
            result["managerReviewerName"] = reviewer_name
            result["managerReviewedAt"] = datetime.now().strftime("%d/%m/%Y %H:%M")
            return result
        return None

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
