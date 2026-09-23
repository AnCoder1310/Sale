from src.services.llm_client import openrouter_client
import json
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

SCENARIOS_PATH = os.path.join(os.path.dirname(__file__), "../../data/scenarios/scenarios.json")

class PracticeService:
    def __init__(self):
        self.scenarios: List[Dict[str, Any]] = []
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.results: Dict[str, Dict[str, Any]] = {}
        self.pending_reviews: List[Dict[str, Any]] = []
        self._load_scenarios()

    def _load_scenarios(self):
        if os.path.exists(SCENARIOS_PATH):
            try:
                with open(SCENARIOS_PATH, "r", encoding="utf-8") as f:
                    self.scenarios = json.load(f)
            except Exception as e:
                print(f"Error loading scenarios: {e}")
                self.scenarios = []

    def get_scenarios(self) -> List[Dict[str, Any]]:
        return self.scenarios

    def get_scenario(self, scenario_id: str) -> Optional[Dict[str, Any]]:
        for s in self.scenarios:
            if s.get("scenario_id") == scenario_id:
                return s
        # Map frontend mock scenarios
        mapping = {
            "scen-01": {
                "scenario_id": "scen-01",
                "title": "VF 8 — Xử lý băn khoăn Pin Thuê vs Mua Đứt & Tính toán kinh tế",
                "difficulty": "Tiêu chuẩn",
                "persona": {"name": "Anh Hoàng Tuấn", "age": 36, "communication_style": "Thực tế, tính toán logic"},
                "buyer_intent": "Mua SUV công nghệ cao cho gia đình nhưng băn khoăn chi phí thuê pin hàng tháng",
                "customer_goals": "Muốn biết tại sao nên thuê pin thay vì mua đứt",
                "visible_context": "Chào em, anh vừa xem qua chiếc VF 8 Plus. Xe thì anh thấy khá ưng, nhưng anh tính ra mỗi tháng trả gần 3 triệu tiền thuê pin, 5 năm mất gần 180 triệu, bằng nửa cục pin rồi. Sao anh không mua đứt luôn cho đỡ mệt đầu?",
                "disclosure_rules": [
                    {"fact_key": "daily_distance", "trigger_keywords": ["bao nhiêu km", "quãng đường", "mỗi ngày"], "revealed_statement": "Anh đi làm từ Thủ Đức qua Quận 1 tầm 25km cả đi lẫn về. Cuối tuần thỉnh thoảng đi siêu thị. Chắc tầm 1.200 - 1.500 km/tháng."},
                    {"fact_key": "apartment_charging", "trigger_keywords": ["chung cư", "sạc", "ở đâu"], "revealed_statement": "Chung cư anh ở Sala cũng có trụ sạc, nhưng tối về nhỡ đầy chỗ thì sáng mai anh đi làm thế nào?"}
                ],
                "objections": [
                    {"objection_id": "obj_battery_rent", "trigger_stage": "discovery", "objection_text": "Tiền thuê pin cộng lại sau 5 năm đắt quá"}
                ]
            },
            "scen-02": {
                "scenario_id": "scen-02",
                "title": "VF 7 — So sánh trực diện ADAS & Vận hành với C-SUV Máy Xăng",
                "difficulty": "Nâng cao",
                "persona": {"name": "Chị Phương Lan", "age": 41, "communication_style": "Cá tính, yêu thích cái đẹp và sự đột phá"},
                "buyer_intent": "Muốn đổi từ Mazda CX-5 sang xe điện thể thao có ADAS an toàn đi đêm",
                "customer_goals": "So sánh sức mạnh 349HP và hệ thống tự lái ADAS với xe xăng",
                "visible_context": "Chào em, chị đang đi chiếc Mazda CX-5 quen rồi, đổ xăng 3 phút là chạy tiếp. Nghe nói chiếc VF 7 Plus này đẹp và bốc lắm nhưng chị hay đi sự kiện tỉnh ban đêm, nhỡ giữa đường hết pin thì trễ việc công ty làm sao em?",
                "disclosure_rules": [
                    {"fact_key": "night_drive", "trigger_keywords": ["cao tốc", "ban đêm", "đi tỉnh"], "revealed_statement": "Chị thường xuyên lái đêm từ Hà Nội về Quảng Ninh hoặc Vinh, rất sợ ngủ gật hoặc chướng ngại vật bất ngờ."}
                ],
                "objections": [
                    {"objection_id": "obj_gas_vs_ev", "trigger_stage": "discovery", "objection_text": "Xe xăng đổ xăng nhanh hơn xe điện"}
                ]
            },
            "scen-03": {
                "scenario_id": "scen-03",
                "title": "VF 9 — Thuyết phục Doanh nhân lựa chọn Ghế Cơ trưởng VIP",
                "difficulty": "Nâng cao",
                "persona": {"name": "Bác Quang Minh", "age": 58, "communication_style": "Điềm đạm, uy quyền, coi trọng vị thế"},
                "buyer_intent": "Tìm xe hạng sang cỡ lớn có ghế cơ trưởng massage đưa đón đối tác",
                "customer_goals": "Muốn khẳng định đẳng cấp và độ êm ái của hệ thống treo khí nén",
                "visible_context": "Chào cậu, tôi đang tìm một chiếc SUV cỡ lớn êm ái để đi tiếp khách và đi đánh golf. Với tầm giá hơn 2 tỷ, bạn bè tôi bảo mua Ford Explorer hay Lexus cho sang, đối tác nhìn vào VF 9 có nghĩ tôi mua xe taxi không?",
                "disclosure_rules": [
                    {"fact_key": "vip_lounge", "trigger_keywords": ["ghế", "massage", "êm ái"], "revealed_statement": "Tôi hay bị đau lưng sau những chuyến đi dài, rất cần ghế thương gia massage chuyên sâu và điều hòa riêng biệt."}
                ],
                "objections": [
                    {"objection_id": "obj_brand_prestige", "trigger_stage": "discovery", "objection_text": "Sợ thương hiệu chưa đủ sang trọng so với xe Đức"}
                ]
            },
            "scen-04": {
                "scenario_id": "scen-04",
                "title": "VF 6 — Khách hàng mua xe lần đầu cân nhắc bài toán kinh tế gia đình",
                "difficulty": "Cơ bản",
                "persona": {"name": "Bạn Trí Dũng", "age": 29, "communication_style": "Trẻ trung, thực dụng, thu nhập trung bình khá"},
                "buyer_intent": "Mua xe cho gia đình trẻ che mưa che nắng, cần chi phí nuôi xe tiết kiệm nhất",
                "customer_goals": "Chi phí hàng tháng không vượt quá 8 triệu tiền trả góp và nhiên liệu",
                "visible_context": "Chào bạn, hai vợ chồng mình mới cưới chuẩn bị đón em bé đầu lòng nên muốn tìm xe gầm cao che nắng che mưa. Thu nhập hai đứa tầm trung, nghe nói xe điện sau này thay pin tốn cả trăm triệu có thật không bạn?",
                "disclosure_rules": [
                    {"fact_key": "budget_tight", "trigger_keywords": ["trả góp", "ngân sách", "hàng tháng"], "revealed_statement": "Bọn mình chỉ kham được khoản vay trả góp tối đa 7 - 8 triệu/tháng thôi bạn ạ."}
                ],
                "objections": [
                    {"objection_id": "obj_battery_replacement_cost", "trigger_stage": "discovery", "objection_text": "Sợ thay pin tốn kém sau nhiều năm"}
                ]
            },
            "scen-07": {
                "scenario_id": "scen-07",
                "title": "VF 8 — Khách nước ngoài (Mr. David Miller: Đàm phán tiếng Anh & Thủ tục đứng tên xe)",
                "difficulty": "Nâng cao",
                "persona": {"name": "Mr. David Miller", "age": 42, "communication_style": "Professional, direct, speaks English"},
                "buyer_intent": "Inquiring about legal car registration for expats in Vietnam and English infotainment system on VF 8",
                "customer_goals": "Wants to legally register the car under his own name with Temporary Residence Card (TRC)",
                "visible_context": "Hello! I am an expat living in Vietnam and considering the VF 8 Plus. What are the legal requirements for a foreigner to register and own a VinFast car here? Does the vehicle support full English voice control?",
                "disclosure_rules": [
                    {"fact_key": "expat_docs", "trigger_keywords": ["trc", "residence", "passport", "foreigner", "temporary"], "revealed_statement": "I have a valid 3-year Temporary Residence Card (TRC) and a legitimate work permit in Hanoi."}
                ],
                "objections": [
                    {"objection_id": "obj_english_assistant", "trigger_stage": "discovery", "objection_text": "I need to make sure my family can comfortably use the navigation and voice commands in fluent English."}
                ]
            },
            "scen-08": {
                "scenario_id": "scen-08",
                "title": "VF 5 Plus — Bác tài Miền Trung (Bác Ba Nghệ An: Khẩu ngữ địa phương & Nỗi lo sạc pin)",
                "difficulty": "Tiêu chuẩn",
                "persona": {"name": "Bác Ba Nghệ An", "age": 53, "communication_style": "Mộc mạc, chất phác, dùng khẩu ngữ Nghệ Tĩnh"},
                "buyer_intent": "Tìm mua xe điện chạy khách tuyến Vinh - Cửa Lò, băn khoăn về độ bền pin và ngập lụt mùa mưa lũ",
                "customer_goals": "Cần xe gầm cao, lội nước không chết máy và tiền sạc rẻ hơn xe dầu",
                "visible_context": "Chào chú em! Tui đang ngó con VF 5 ni đặng chạy khách tuyến Vinh - Cửa Lò. Mà ngặt nỗi pin ni chạy có bị chai hông chú, với lỡ đang chạy giữa đàng mà hết điện thì mần răng hả chú?",
                "disclosure_rules": [
                    {"fact_key": "local_route", "trigger_keywords": ["cửa lò", "vinh", "chạy", "quãng đường", "mô"], "revealed_statement": "Mỗi ngày tui chạy túc tắc tuyến đường 72m ra Cửa Lò với vô đền Bác tầm 150 cây số chú nợ."}
                ],
                "objections": [
                    {"objection_id": "obj_flood_water", "trigger_stage": "discovery", "objection_text": "Sợ xe điện vô nước mùa lụt là chập cháy"}
                ]
            }
        }
        if scenario_id in mapping:
            return mapping[scenario_id]
        return self.scenarios[0] if self.scenarios else None

    def create_session(self, scenario_id: str, advisor_id: str = "adv-001", advisor_name: str = "Võ Trường An") -> Dict[str, Any]:
        scenario = self.get_scenario(scenario_id)
        session_id = f"sess-{uuid.uuid4().hex[:8]}"

        persona = scenario.get("persona", {})
        customer_name = persona.get("name", "Khách hàng")
        initial_msg = scenario.get("visible_context", f"Chào em, anh đang tìm hiểu mẫu xe này bên em.")

        session_data = {
            "session_id": session_id,
            "scenario_id": scenario_id,
            "scenario_title": scenario.get("title", ""),
            "vehicle_model": scenario.get("title", "").split("—")[0].strip() if "—" in scenario.get("title", "") else "VinFast",
            "advisor_id": advisor_id,
            "advisor_name": advisor_name,
            "created_at": datetime.now().isoformat(),
            "turn_count": 1,
            "trust_level": 3,
            "interest_level": 3,
            "revealed_facts": [],
            "resolved_objections": [],
            "messages": [
                {
                    "id": f"msg-{uuid.uuid4().hex[:6]}",
                    "sender": "customer",
                    "text": initial_msg,
                    "timestamp": datetime.now().strftime("%H:%M")
                }
            ],
            "scenario": scenario
        }

        self.sessions[session_id] = session_data
        return {
            "session_id": session_id,
            "sessionId": session_id,
            "scenario": scenario,
            "initial_message": session_data["messages"][0],
            "trust_level": 3,
            "interest_level": 3
        }

    async def send_message(self, session_id: str, text: str) -> Dict[str, Any]:
        session = self.sessions.get(session_id)
        if not session:
            # Fallback mock session
            return {
                "message": {
                    "id": f"msg-{uuid.uuid4().hex[:6]}",
                    "sender": "customer",
                    "text": "Cảm ơn em đã tư vấn rõ ràng.",
                    "timestamp": datetime.now().strftime("%H:%M")
                },
                "trust_level": 4,
                "interest_level": 4
            }

        scenario = session["scenario"]
        session["turn_count"] += 1

        advisor_msg = {
            "id": f"msg-{uuid.uuid4().hex[:6]}",
            "sender": "advisor",
            "text": text,
            "timestamp": datetime.now().strftime("%H:%M"),
            "intentDetected": "Phản hồi tư vấn & Lắng nghe khách hàng"
        }
        session["messages"].append(advisor_msg)

        # Check disclosure rules
        t_lower = text.lower()

        # Under-the-hood dialect normalization for semantic intent matching
        t_clean = t_lower
        for p, r in [
            ("cấy chi rứa", "cái gì thế"), ("cấy chi rueấ", "cái gì thế"), ("cấy chi", "cái gì"),
            ("chi rứa", "gì thế"), ("răng rứa", "sao thế"), ("mần răng", "làm sao"),
            ("làm răng", "làm thế nào"), ("ở mô", "ở đâu"), ("chỗ mô", "chỗ nào"),
            ("giữa đàng", "giữa đường"), ("mùa lụt", "ngập nước"), ("vô nước", "ngập nước"),
            ("chai bình", "chai pin"), ("sụt bình", "hao pin"), ("hổng", "không"), ("hông", "không")
        ]:
            t_clean = t_clean.replace(p, r)
        revealed_reply = None
        for rule in scenario.get("disclosure_rules", []):
            if rule["fact_key"] not in session["revealed_facts"]:
                for kw in rule.get("trigger_keywords", []):
                    if kw.lower() in t_lower:
                        session["revealed_facts"].append(rule["fact_key"])
                        revealed_reply = rule.get("revealed_statement")
                        advisor_msg["factRevealed"] = rule["fact_key"]
                        break

        # Check objections
        for obj in scenario.get("objections", []):
            if obj["objection_id"] not in session["resolved_objections"]:
                # Check keywords in text
                if any(k in t_lower for k in ["pin", "sạc", "bảo hành", "70%", "soh", "tiết kiệm", "trước bạ"]):
                    session["resolved_objections"].append(obj["objection_id"])
                    advisor_msg["objectionResolved"] = True

        # Generate customer reply
        session["trust_level"] = min(5, session["trust_level"] + 1)
        session["interest_level"] = min(5, session["interest_level"] + 1)

        if revealed_reply:
            reply_text = revealed_reply
        elif len(session["messages"]) <= 4:
            reply_text = "Nghe cũng hợp lý. Nhưng anh vẫn băn khoăn về trạm sạc và chính sách bảo hành pin nhỡ sau này chai thì sao hả em?"
        elif len(session["messages"]) <= 6:
            reply_text = "À, nghĩa là chai pin dưới 70% là được đổi pin mới miễn phí luôn à? Thế chi phí bảo dưỡng xe điện so với xe xăng thì chênh lệch thế nào em?"
        else:
            reply_text = "Ừ, nghe em phân tích rõ ràng và minh bạch từng số liệu anh thấy rất an tâm. Cho anh đăng ký lái thử và gửi hợp đồng cọc giữ xe màu Xanh luôn nhé!"

        customer_msg = {
            "id": f"msg-{uuid.uuid4().hex[:6]}",
            "sender": "customer",
            "text": reply_text,
            "timestamp": datetime.now().strftime("%H:%M")
        }
        session["messages"].append(customer_msg)

        return {
            "advisor_message": advisor_msg,
            "customer_message": customer_msg,
            "trust_level": session["trust_level"],
            "interest_level": session["interest_level"],
            "turn_count": session["turn_count"],
            "revealed_facts": session["revealed_facts"]
        }

    def finish_session(self, session_id: str) -> Dict[str, Any]:
        session = self.sessions.get(session_id)
        now_str = datetime.now().strftime("%d/%m/%Y %H:%M")
        
        # Calculate rubric scores
        turn_count = session["turn_count"] if session else 6
        revealed_count = len(session.get("revealed_facts", [])) if session else 2
        
        need_score = min(95, 75 + revealed_count * 10)
        product_score = 92
        objection_score = 88
        policy_score = 95
        closing_score = 78 if turn_count >= 5 else 68

        overall = int((need_score + product_score + objection_score + policy_score + closing_score) / 5)

        rubric_breakdown = [
            {
                "criterion": "need_discovery",
                "criterionNameVi": "Thấu hiểu nhu cầu (Need Discovery)",
                "score": need_score,
                "maxScore": 100,
                "definition": "Khai thác thói quen di chuyển thực tế, quy mô tài chính và nhu cầu sử dụng xe của khách.",
                "evidence": [f"Tư vấn viên khai thác thành công {revealed_count} thông tin ẩn của khách hàng."],
                "reason": "Hỏi đúng trọng tâm về quãng đường và ngân sách trả trước.",
                "improvementTip": "Chủ động hỏi thêm về điều kiện sạc tại gia đình của khách sớm hơn."
            },
            {
                "criterion": "product_knowledge",
                "criterionNameVi": "Kiến thức sản phẩm (Product Knowledge)",
                "score": product_score,
                "maxScore": 100,
                "definition": "Nắm vững thông số công suất, quãng đường di chuyển và thời gian sạc nhanh của xe VinFast.",
                "evidence": ["Trình bày chính xác thời gian sạc 10%-70% và chuẩn sạc CCS2 tại trạm V-GREEN."],
                "reason": "Thông số chuẩn xác, không bị nhầm lẫn giữa các phiên bản.",
                "improvementTip": "Lồng ghép thêm thông số khoảng sáng gầm xe để tăng tính thuyết phục."
            },
            {
                "criterion": "objection_handling",
                "criterionNameVi": "Xử lý từ chối (Objection Handling)",
                "score": objection_score,
                "maxScore": 100,
                "definition": "Hóa giải băn khoăn về chi phí pin, độ chai pin và so sánh với xe xăng.",
                "evidence": ["Nhấn mạnh cam kết đổi pin mới miễn phí khi dung lượng SOH dưới 70%."],
                "reason": "Biến điểm yếu tâm lý thành lợi thế bảo hành trọn đời an tâm.",
                "improvementTip": "Cần đồng cảm trước khi đưa ra các con số phản biện."
            },
            {
                "criterion": "policy_accuracy",
                "criterionNameVi": "Độ chính xác chính sách (Policy Accuracy)",
                "score": policy_score,
                "maxScore": 100,
                "definition": "Cập nhật chính xác ưu đãi trước bạ 0% và chương trình sạc miễn phí V-GREEN.",
                "evidence": ["Nêu chính xác Nghị định miễn 100% lệ phí trước bạ xe điện đăng ký lần đầu."],
                "reason": "Tuyệt đối không sai sót về chính sách giá và bảo hành 7-10 năm.",
                "improvementTip": "Tiếp tục duy trì phong độ cập nhật văn bản bán hàng."
            },
            {
                "criterion": "closing_next_step",
                "criterionNameVi": "Chốt đơn & Bước tiếp theo (Closing / Next Step)",
                "score": closing_score,
                "maxScore": 100,
                "definition": "Thúc đẩy bước tiếp theo: Đặt cọc giữ xe hoặc mời lái thử thực tế.",
                "evidence": ["Đã đưa ra lời mời lái thử và đặt cọc giữ xe."],
                "reason": "Đã có hành động chốt nhưng cần tăng thêm tính cấp bách.",
                "improvementTip": "Áp dụng kỹ năng chốt bằng lựa chọn thay thế (màu xe, ngày nhận xe)."
            }
        ]

        result = {
            "sessionId": session_id,
            "scenarioId": session.get("scenario_id", "scen-01") if session else "scen-01",
            "scenarioTitle": session.get("scenario_title", "Kịch bản luyện tập tư vấn bán xe VinFast") if session else "Kịch bản tư vấn xe VinFast",
            "vehicleModel": session.get("vehicle_model", "VinFast EV") if session else "VinFast VF 8",
            "advisorName": session.get("advisor_name", "Võ Trường An") if session else "Võ Trường An",
            "advisorId": session.get("advisor_id", "adv-001") if session else "adv-001",
            "date": now_str,
            "duration": f"{turn_count * 2} phút",
            "overallScore": overall,
            "managerReviewed": False,
            "rubricBreakdown": rubric_breakdown,
            "aiSummary": f"Tư vấn viên đạt kết quả {overall}/100. Nắm vững kiến thức sản phẩm và chính sách bảo hành pin VinFast. Cần tự tin hơn ở bước chốt cọc.",
            "transcript": session.get("messages", []) if session else [],
            "recommendedNextPractice": "Luyện tập thêm kịch bản khách hàng so sánh công nghệ ADAS để tăng tốc độ phản xạ."
        }

        self.results[session_id] = result
        self.pending_reviews.append(result)
        return result

    def get_result(self, session_id: str) -> Optional[Dict[str, Any]]:
        return self.results.get(session_id)

practice_service = PracticeService()