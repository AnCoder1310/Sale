"""
AI Customer Agent Simulation.
Chủ quản: Duy (AI Customer Role-play & Coaching Engine)
Mô phỏng chân dung khách hàng mua xe thích ứng theo diễn biến cuộc hội thoại.
"""
from typing import Any, Dict, List, Optional
from src.roleplay.contracts import ScenarioContract
from src.roleplay.prompts.customer_prompts import CUSTOMER_SYSTEM_TEMPLATE
from src.roleplay.state import ConversationStage, RoleplayMessage, RoleplayState, TerminationStatus
from src.roleplay.turn_analyzer import TurnAnalysisResult, turn_analyzer
from src.services.llm_client import openrouter_client


class CustomerAgent:
    """Tác tử mô phỏng khách hàng bán xe VinFast."""

    async def step(
        self,
        advisor_message: str,
        state: RoleplayState,
        scenario: ScenarioContract
    ) -> Dict[str, Any]:
        """Thực hiện một bước tương tác khách hàng mô phỏng."""
        state.turn_count += 1

        # 1. Phân tích lượt nói của Advisor
        analysis: TurnAnalysisResult = turn_analyzer.analyze_turn(
            advisor_message=advisor_message,
            scenario=scenario,
            state=state
        )

        # 2. Cập nhật trạng thái thông tin hé lộ & từ chối
        for f in analysis.uncovered_facts:
            if f not in state.revealed_facts:
                state.revealed_facts.append(f)
                state.advisor_discoveries.append(f)

        for obj in analysis.resolved_objections:
            if obj not in state.resolved_objections:
                state.resolved_objections.append(obj)
            if obj in state.unresolved_objections:
                state.unresolved_objections.remove(obj)

        # 3. Cập nhật mức độ tin cậy và quan tâm
        state.trust_level = min(5, max(1, state.trust_level + analysis.trust_delta))
        state.interest_level = min(5, max(1, state.interest_level + analysis.interest_delta))

        # 4. Quyết định giai đoạn hội thoại (Conversation Stage)
        if state.turn_count >= scenario.termination_conditions.max_turns:
            state.conversation_stage = ConversationStage.FINISHED
            state.termination_status = TerminationStatus.MAX_TURNS
            state.termination_reason = "Đã đạt giới hạn số lượt hội thoại của kịch bản."
        elif analysis.is_closing_attempt and state.trust_level >= 4:
            state.conversation_stage = ConversationStage.CLOSING
        elif state.unresolved_objections and state.turn_count >= 2:
            state.conversation_stage = ConversationStage.OBJECTION_HANDLING
        elif state.revealed_facts:
            state.conversation_stage = ConversationStage.PRESENTATION
        else:
            state.conversation_stage = ConversationStage.DISCOVERY

        # 5. Sinh phản hồi của khách hàng (Customer Reply)
        customer_reply = await self._generate_customer_reply(
            advisor_message=advisor_message,
            analysis=analysis,
            state=state,
            scenario=scenario
        )

        # Lưu vào message history
        state.messages.append(RoleplayMessage(role="advisor", content=advisor_message))
        state.messages.append(RoleplayMessage(role="customer", content=customer_reply))

        return {
            "reply": customer_reply,
            "analysis": analysis.model_dump(),
            "state": state.advisor_visible_context(),
            "trust_level": state.trust_level,
            "interest_level": state.interest_level,
            "stage": state.conversation_stage.value
        }

    async def _generate_customer_reply(
        self,
        advisor_message: str,
        analysis: TurnAnalysisResult,
        state: RoleplayState,
        scenario: ScenarioContract
    ) -> str:
        """Sinh câu trả lời của khách hàng: gọi LLM hoặc dùng persona-grounded deterministic engine."""
        persona = scenario.persona
        name = persona.get("name", "Khách hàng")
        style = persona.get("communication_style", "Thực tế")
        age = persona.get("age", 35)

        # Nếu có thông tin hé lộ vừa được kích hoạt, ưu tiên cung cấp thông tin đó
        if analysis.revealed_statements:
            stmt = analysis.revealed_statements[0]
            if analysis.is_closing_attempt and state.trust_level >= 4:
                return f"{stmt} Em tư vấn rất rõ ràng. Cho anh đặt lịch lái thử cuối tuần này luôn nhé!"
            return stmt

        # Nếu tư vấn viên chốt đơn khi đã đủ tin tưởng
        if analysis.is_closing_attempt and state.trust_level >= 4:
            if "david" in name.lower():
                return "That sounds very reasonable and convincing! Please book me a test drive this Saturday morning and send the quotation."
            elif "nghệ an" in name.lower() or "bác ba" in name.lower():
                return "Nghe chú em giải thích rành rọt rứa tui ưng cấy bụng rồi nợ! Cuối tuần cho tui ghé VinFast Vinh lái thử con xe nhé."
            elif "bác quang minh" in name.lower() or "minh" in name.lower():
                return "Được rồi, cậu cho người đưa xe VF 9 qua cơ quan tôi vào sáng thứ Bảy này để tôi và tài xế cùng lái thử nhé."
            return "Nghe em phân tích rõ ràng và minh bạch anh thấy rất an tâm. Cho anh đăng ký lái thử và gửi hợp đồng cọc giữ xe luôn nhé!"

        # Thử gọi qua OpenRouter LLM nếu có cấu hình
        system_prompt = CUSTOMER_SYSTEM_TEMPLATE.format(
            customer_name=name,
            age=age,
            style=style,
            customer_goals=scenario.customer_goals,
            buyer_intent=scenario.buyer_intent,
            stage=state.conversation_stage.value,
            trust_level=state.trust_level,
            interest_level=state.interest_level,
            revealed_facts=", ".join(state.revealed_facts) or "Chưa có",
            active_objections=", ".join(state.unresolved_objections) or "Không có"
        )

        messages_payload = [{"role": m.role if m.role == "customer" else "user", "content": m.content} for m in state.messages]
        messages_payload.append({"role": "user", "content": advisor_message})

        llm_reply = await openrouter_client.generate_chat_completion(
            messages=messages_payload,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=200
        )

        if llm_reply and len(llm_reply.strip()) > 10:
            return llm_reply.strip()

        # Deterministic Persona-Grounded Fallback
        if "david" in name.lower():
            if state.turn_count <= 2:
                return "I see. And how does the English voice control work when driving on busy roads?"
            return "Alright, and what about the legal paperworks for the Temporary Residence Card registration?"
        elif "nghệ an" in name.lower() or "bác ba" in name.lower():
            if state.turn_count <= 2:
                return "Nghe cũng bùi tai. Nhưng ngặt nỗi pin ni ngập nước lụt ở Vinh thì mần răng hả chú em?"
            return "Rứa thì tiền điện sạc mỗi tháng tính ra có đỡ hơn tiền dầu chạy xe cũ hông chú?"
        elif "quang minh" in name.lower():
            if state.turn_count <= 2:
                return "Tôi muốn hỏi thêm về hàng ghế Cơ trưởng phía sau có thực sự êm ái khi tôi đi tiếp khách đường dài không?"
            return "Cậu giải thích nghe có lý. Nhưng xe điện đi tiếp khách ngoại giao thì đối tác nhìn vào có đánh giá không?"
        else:
            if state.turn_count <= 2:
                return "Nghe cũng hợp lý. Nhưng anh vẫn băn khoăn về trạm sạc và chính sách bảo hành pin nhỡ sau này chai thì sao hả em?"
            elif state.turn_count <= 4:
                return "À, nghĩa là chai pin dưới 70% là được đổi pin mới miễn phí luôn à? Thế chi phí bảo dưỡng xe điện so với xe xăng thì chênh lệch thế nào em?"
            return "Ừ, nghe em phân tích rõ ràng và minh bạch từng số liệu anh thấy an tâm hơn rồi đấy."


customer_agent = CustomerAgent()
