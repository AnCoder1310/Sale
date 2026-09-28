"""
Practice Service Gateway.
Duy & Chương co-ownership.
Kết nối FastAPI routes với RoleplayGraph, ScenarioLoader và SessionPersistence.
"""
from typing import Any, Dict, List, Optional
import uuid

from src.roleplay.graph import roleplay_graph
from src.roleplay.persistence import session_persistence
from src.roleplay.scenario_loader import scenario_loader


class PracticeService:
    def __init__(self):
        self.graph = roleplay_graph
        self.loader = scenario_loader
        self.persistence = session_persistence

    def get_scenarios(self) -> List[Dict[str, Any]]:
        """Lấy danh sách kịch bản chuẩn hoá cho UI."""
        return self.loader.get_all_scenarios()

    def get_scenario(self, scenario_id: str) -> Optional[Dict[str, Any]]:
        sc = self.loader.get_scenario(scenario_id)
        return sc.model_dump() if sc else None

    async def create_session(
        self,
        scenario_id: str,
        advisor_id: str = "adv-001",
        advisor_name: str = "Võ Trường An"
    ) -> Dict[str, Any]:
        """Khởi tạo phiên luyện tập đa lượt với AI Customer."""
        session_id = f"sess-{uuid.uuid4().hex[:8]}"
        return await self.graph.start(
            session_id=session_id,
            scenario_id=scenario_id,
            advisor_id=advisor_id,
            advisor_name=advisor_name
        )

    async def send_message(self, session_id: str, text: str) -> Dict[str, Any]:
        """Tư vấn viên gửi tin nhắn thoại / chat."""
        return await self.graph.continue_session(session_id=session_id, advisor_message=text)

    async def finish_session(self, session_id: str) -> Dict[str, Any]:
        """Kết thúc phiên và lấy báo cáo đánh giá 5 tiêu chí Rubric."""
        return await self.graph.finish(session_id)

    def get_result(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Lấy kết quả đánh giá đã lưu."""
        return self.persistence.get_result(session_id)


practice_service = PracticeService()
