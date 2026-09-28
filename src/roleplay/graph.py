"""
Roleplay Graph Workflow Engine.
Duy & Chương co-ownership.
Điều phối toàn bộ vòng đời phiên luyện tập:
1. start (Khởi tạo phiên theo Scenario)
2. continue_session (Lượt tương tác đa chiều Advisor <-> AI Customer)
3. finish (Kết thúc và kích hoạt SessionEvaluator chấm điểm 5 tiêu chí)
"""
from datetime import datetime
from typing import Any, Dict, Optional
import uuid

from src.roleplay.checkpoint import checkpoint_manager
from src.roleplay.contracts import RoleplayGraphContract, ScenarioContract
from src.roleplay.customer_agent import customer_agent
from src.roleplay.evaluator import session_evaluator
from src.roleplay.persistence import session_persistence
from src.roleplay.scenario_loader import scenario_loader
from src.roleplay.state import RoleplayMessage, RoleplayState, TerminationStatus


class RoleplayGraph:
    """Bộ điều phối luồng nghiệp vụ RoleplayGraph."""

    def __init__(self):
        self.loader = scenario_loader
        self.customer = customer_agent
        self.evaluator = session_evaluator
        self.checkpoint = checkpoint_manager
        self.persistence = session_persistence

    async def start(
        self,
        session_id: str,
        scenario_id: str,
        advisor_id: str = "adv-001",
        advisor_name: str = "Võ Trường An"
    ) -> Dict[str, Any]:
        """Bắt đầu một phiên luyện tập mới."""
        scenario: Optional[ScenarioContract] = self.loader.get_scenario(scenario_id)
        if not scenario:
            raise ValueError(f"Scenario ID '{scenario_id}' không tồn tại trong hệ thống.")

        state = RoleplayState.from_scenario(session_id=session_id, scenario=scenario)

        # Tin nhắn mở đầu của khách hàng
        initial_text = scenario.visible_context
        initial_msg = RoleplayMessage(role="customer", content=initial_text)
        state.messages.append(initial_msg)
        state.turn_count = 1

        # Lưu checkpoint và persistence
        await self.checkpoint.save(session_id, state.model_dump())

        session_meta = {
            "session_id": session_id,
            "scenario_id": scenario.scenario_id,
            "scenario_title": scenario.title,
            "vehicle_model": scenario.title.split("—")[0].strip() if "—" in scenario.title else "VinFast",
            "advisor_id": advisor_id,
            "advisor_name": advisor_name,
            "created_at": datetime.now().isoformat(),
            "turn_count": 1,
            "scenario": scenario.model_dump(),
            "messages": [
                {
                    "id": f"msg-{uuid.uuid4().hex[:6]}",
                    "sender": "customer",
                    "text": initial_text,
                    "timestamp": datetime.now().strftime("%H:%M")
                }
            ]
        }
        self.persistence.save_session(session_id, session_meta)

        return {
            "session_id": session_id,
            "sessionId": session_id,
            "scenario": scenario.model_dump(),
            "initial_message": session_meta["messages"][0],
            "trust_level": state.trust_level,
            "interest_level": state.interest_level,
            "advisor_context": state.advisor_visible_context()
        }

    async def continue_session(self, session_id: str, advisor_message: str) -> Dict[str, Any]:
        """Tư vấn viên gửi câu trả lời, nhận lại phản ứng thích ứng của khách hàng."""
        state_data = await self.checkpoint.load(session_id)
        session_meta = self.persistence.get_session(session_id)

        if not state_data or not session_meta:
            # Fallback nếu session chưa có trong bộ nhớ
            return {
                "message": {
                    "id": f"msg-{uuid.uuid4().hex[:6]}",
                    "sender": "customer",
                    "text": "Cảm ơn em đã tư vấn chi tiết cho anh.",
                    "timestamp": datetime.now().strftime("%H:%M")
                },
                "trust_level": 4,
                "interest_level": 4
            }

        state = RoleplayState.model_validate(state_data)
        scenario = ScenarioContract.model_validate(session_meta["scenario"])

        # Thực hiện tương tác qua CustomerAgent
        step_res = await self.customer.step(
            advisor_message=advisor_message,
            state=state,
            scenario=scenario
        )

        # Lưu lại checkpoint
        await self.checkpoint.save(session_id, state.model_dump())

        # Ghi nhận vào persistence
        advisor_entry = {
            "id": f"msg-{uuid.uuid4().hex[:6]}",
            "sender": "advisor",
            "text": advisor_message,
            "timestamp": datetime.now().strftime("%H:%M"),
            "intentDetected": step_res["analysis"]["intent_detected"]
        }
        customer_entry = {
            "id": f"msg-{uuid.uuid4().hex[:6]}",
            "sender": "customer",
            "text": step_res["reply"],
            "timestamp": datetime.now().strftime("%H:%M")
        }
        session_meta["messages"].extend([advisor_entry, customer_entry])
        session_meta["turn_count"] = state.turn_count
        self.persistence.save_session(session_id, session_meta)

        return {
            "advisor_message": advisor_entry,
            "customer_message": customer_entry,
            "trust_level": state.trust_level,
            "interest_level": state.interest_level,
            "turn_count": state.turn_count,
            "revealed_facts": state.revealed_facts,
            "stage": step_res["stage"]
        }

    async def finish(self, session_id: str) -> Dict[str, Any]:
        """Kết thúc phiên và tính điểm Rubric."""
        state_data = await self.checkpoint.load(session_id)
        session_meta = self.persistence.get_session(session_id) or {}

        if not state_data:
            state = RoleplayState(
                session_id=session_id,
                scenario_id="scen-01",
                difficulty="Tiêu chuẩn",
                visible_context="",
                customer_goals="",
                current_intent=""
            )
            scenario = scenario_loader.get_scenario("scen-01")
        else:
            state = RoleplayState.model_validate(state_data)
            scenario = ScenarioContract.model_validate(session_meta["scenario"])

        state.conversation_stage = state.conversation_stage.FINISHED
        state.termination_status = TerminationStatus.ADVISOR_ENDED

        # Kích hoạt đánh giá
        eval_result = self.evaluator.evaluate_session(state=state, scenario=scenario)

        now_str = datetime.now().strftime("%d/%m/%Y %H:%M")
        result_payload = {
            "sessionId": session_id,
            "scenarioId": state.scenario_id,
            "scenarioTitle": session_meta.get("scenario_title", "Kịch bản luyện tập VinFast"),
            "vehicleModel": session_meta.get("vehicle_model", "VinFast EV"),
            "advisorName": session_meta.get("advisor_name", "Võ Trường An"),
            "advisorId": session_meta.get("advisor_id", "adv-001"),
            "date": now_str,
            "duration": f"{state.turn_count * 2} phút",
            "overallScore": eval_result["overallScore"],
            "managerReviewed": False,
            "rubricBreakdown": eval_result["rubricBreakdown"],
            "aiSummary": eval_result["aiSummary"],
            "transcript": session_meta.get("messages", []),
            "recommendedNextPractice": eval_result["recommendedNextPractice"]
        }

        # Lưu kết quả đánh giá vào persistence layer
        self.persistence.save_result(session_id, result_payload)
        return result_payload


roleplay_graph = RoleplayGraph()
