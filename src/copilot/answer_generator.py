"""
Copilot Answer Generator.
Chủ quản: Chương (Platform, RAG & Runtime)
Phối hợp: Duy (Sales Tone & Scripting)
Tạo câu trả lời thông minh, chuẩn số liệu bán hàng VinFast, có mẫu lời thoại chuẩn cho sales tư vấn khách.
"""
from typing import Any, Dict, List, Optional
from src.copilot.prompts import COPILOT_SYSTEM_PROMPT
from src.services.llm_client import openrouter_client


class AnswerGenerator:
    """Tạo câu trả lời tư vấn hoàn chỉnh từ căn cứ tài liệu."""

    @staticmethod
    async def generate(
        query: str,
        evidence_list: List[Dict[str, Any]],
        intent: str,
        vehicle_model: Optional[str] = None
    ) -> Dict[str, Any]:
        """Tạo câu trả lời và gói tài liệu đi kèm."""

        # 1. Xử lý trường hợp câu chào hỏi / giao tiếp mở đầu (Greeting)
        if intent == "greeting":
            welcome_text = (
                "Chào bạn! Tôi là **AI Sales Enablement Copilot của VinFast (VFO2O-20)**.\n\n"
                "Tôi được trang bị toàn bộ cẩm nang kịch bản bán hàng thực chiến và quy chuẩn chính sách 2026. "
                "Bạn có thể hỏi tôi bất kỳ nội dung nào sau đây:\n\n"
                "1. 🚗 **Kịch bản thực chiến (8 Tình huống):**\n"
                "   - *Bài toán taxi:* VF 5 Plus vs Vios chạy 5.000 km/tháng tiết kiệm hơn 3 triệu/tháng.\n"
                "   - *So sánh gia đình:* VF 7 Plus 349HP AWD vs Mazda CX-5 và ADAS lái đêm.\n"
                "   - *Chung cư sạc pin:* VF 6 đi 380km thì 7-10 ngày sạc 1 lần tại Vincom/cây xăng.\n"
                "   - *Tài chính dòng tiền:* Thuê pin vs Mua đứt VF 8 & cam kết đổi pin SOH < 70%.\n"
                "   - *Doanh nhân VIP:* VF 9 Ghế Cơ Trưởng massage trị đau lưng & Treo khí nén.\n"
                "   - *Khách trẻ ngập lụt:* VF 3 lội nước an toàn, pin chuẩn IP67 không sợ thủy kích.\n"
                "   - *Khách nước ngoài (Expat):* Thủ tục thẻ TRC đứng tên xe & Vivi tiếng Anh 100%.\n"
                "   - *Bác Ba Nghệ An:* Khẩu ngữ Nghệ Tĩnh, tuyến Vinh - Cửa Lò & lội nước mùa lũ.\n\n"
                "2. 💰 **Chính sách bán hàng & Chi phí lăn bánh:**\n"
                "   - Ưu đãi miễn 100% lệ phí trước bạ xe điện theo Nghị định của Chính phủ.\n"
                "   - Gói vay liên kết ngân hàng lãi suất ưu đãi cố định 5% trong 2 năm đầu.\n"
                "   - Biểu phí thuê pin tháng 09/2026 và mạng lưới 150.000 trạm sạc V-GREEN.\n\n"
                "Hôm nay bạn cần tôi hỗ trợ tư vấn tình huống hoặc dòng xe nào?"
            )
            return {
                "answer": welcome_text,
                "recommendedTalkingPoints": [
                    "Kịch bản 01: Bài toán VF 5 Plus chạy taxi 5.000km vs Vios",
                    "Kịch bản 02: So sánh VF 7 Plus vs Mazda CX-5",
                    "Kịch bản 04: Thuê pin hay mua đứt pin xe VF 8 có lợi hơn?"
                ],
                "followUpQuestions": [
                    "So sánh VF 5 Plus chạy taxi 5.000 km/tháng với Toyota Vios thế nào?",
                    "Khách ở chung cư lo không có chỗ sạc pin thì tư vấn sao em?",
                    "Tại sao khách nên mua VF 7 Plus thay vì Mazda CX-5?"
                ]
            }

        # 2. Xây dựng ngữ cảnh căn cứ tài liệu nếu có
        context_snippets = []
        for d in evidence_list[:2]:
            context_snippets.append(
                f"TÀI LIỆU CĂN CỨ: {d.get('docTitle')}\n"
                f"NGUỒN: {d.get('source')} (Hiệu lực: {d.get('effectiveDate')})\n"
                f"NỘI DUNG:\n{d.get('snippet')}"
            )
        context_text = "\n\n---\n\n".join(context_snippets)

        user_prompt = (
            f"Ý ĐỊNH CÂU HỎI: {intent}\n"
            f"DÒNG XE TRỌNG TÂM: {vehicle_model or 'Dải xe điện VinFast'}\n\n"
            f"CĂN CỨ VĂN BẢN NỘI BỘ:\n{context_text}\n\n"
            f"CÂU HỎI CỦA TƯ VẤN VIÊN:\n{query}\n\n"
            f"Hãy đưa ra hướng dẫn tư vấn rõ ràng, chuẩn số liệu, có mẫu câu trả lời trực tiếp cho khách và luận điểm thuyết phục."
        )

        llm_response = await openrouter_client.generate_chat_completion(
            messages=[{"role": "user", "content": user_prompt}],
            system_prompt=COPILOT_SYSTEM_PROMPT,
            temperature=0.3
        )

        if llm_response and len(llm_response.strip()) > 40:
            answer = llm_response
        elif evidence_list:
            # Tự động tổng hợp câu trả lời tự nhiên theo đúng nghiệp vụ bán hàng, KHÔNG in raw code dump
            answer = AnswerGenerator._format_intelligent_offline_answer(query, evidence_list)
        else:
            answer = (
                f"Dạ em là **AI Trợ lý Tư vấn xe VinFast**. Em chưa tìm thấy tài liệu phù hợp với câu hỏi: *\"{query}\"*.\n\n"
                "Anh/chị có thể hỏi em các nội dung nghiệp vụ cụ thể sau:\n"
                "- **8 Kịch bản thực chiến:** Bác tài taxi Vios, so sánh CX-5, sạc chung cư VF 6, thuê pin VF 8, VF 9 Doanh nhân, VF 3 ngập lụt, Expat Mr. David, Bác Ba Nghệ An.\n"
                "- **Thông số kỹ thuật:** Công suất, tầm hoạt động, thời gian sạc các dòng xe VF 3, VF 5, VF 6, VF 7, VF 8, VF 9.\n"
                "- **Chính sách bán hàng:** Miễn 100% lệ phí trước bạ, cọc pin 20 triệu, gói vay ngân hàng cố định 5%."
            )

        # Gợi ý luận điểm bán hàng theo Intent
        talking_points = AnswerGenerator._generate_talking_points(intent, vehicle_model)
        follow_up_questions = AnswerGenerator._generate_follow_ups(intent, vehicle_model)

        return {
            "answer": answer,
            "recommendedTalkingPoints": talking_points,
            "followUpQuestions": follow_up_questions
        }

    @staticmethod
    def _format_intelligent_offline_answer(query: str, evidence_list: List[Dict[str, Any]]) -> str:
        """Tổng hợp câu trả lời mạch lạc, văn phong sales chuyên nghiệp khi chạy offline."""
        primary_doc = evidence_list[0]
        title = primary_doc.get("docTitle", "")
        content = primary_doc.get("snippet", "")
        source = primary_doc.get("source", "Tài liệu nội bộ VinFast")

        # Làm sạch các nhãn debug cũ nếu có
        clean_content = content
        for prefix in ["[GỢI Ý TƯ VẤN]", "- Luận điểm:", "- Mẫu câu trả lời:"]:
            clean_content = clean_content.replace(prefix, "")
        clean_content = clean_content.strip()

        # Tách các câu hoặc đoạn văn để trình bày sạch sẽ
        paragraphs = [p.strip() for p in clean_content.split("\n") if p.strip()]

        # Xây dựng phản hồi chuẩn phong cách Sales Enablement
        output = f"Dạ chào anh/chị! Về câu hỏi **\"{query}\"**, em xin phép gửi thông tin tư vấn chuẩn xác từ **{title}** như sau:\n\n"

        # Trích dẫn phân tích chính
        main_body = "\n\n".join(paragraphs[:3])
        output += f"{main_body}\n\n"

        # Phần mẫu câu tư vấn cho khách
        output += (
            "💬 **Mẫu câu tư vấn trực tiếp cho khách hàng (Sales Script):**\n"
            f"> *\"Dạ thưa anh/chị, về băn khoăn này anh/chị hoàn toàn an tâm nhé! "
            "Xe điện VinFast sở hữu lợi thế vượt trội về chi phí vận hành siêu tiết kiệm, "
            "hạ tầng trạm sạc V-GREEN phủ sóng 63 tỉnh thành và chính sách bảo hành 7-10 năm dài nhất thị trường. "
            "Em mời anh/chị ghé showroom bên em lái thử thực tế để trải nghiệm cảm giác lái đầm chắc và êm ái ạ!\"*\n\n"
            f"📜 **Căn cứ tài liệu:** *{source}*."
        )

        return output

    @staticmethod
    def _generate_talking_points(intent: str, vehicle_model: Optional[str]) -> List[str]:
        if intent == "battlecard_comparison":
            return [
                "Nhấn mạnh công suất động cơ điện vượt trội và không có độ trễ chân ga so với máy xăng",
                "Tính bài toán chi phí nhiên liệu rẻ hơn 3-4 lần: Sau 3 vạn km tiết kiệm đủ bù chênh lệch giá",
                "Điểm cộng an toàn: Trọng tâm thấp chống lật và gói trợ lái ADAS cấp độ 2 tiên tiến"
            ]
        elif intent == "battery_and_charging":
            return [
                "Cam kết đổi pin mới miễn phí 100% khi dung lượng pin khả dụng (SOH) xuống dưới 70%",
                "Mạng lưới trạm sạc V-GREEN phủ khắp 63 tỉnh thành, sạc nhanh 10-70% chỉ từ 24-30 phút",
                "Giải pháp cho chung cư: Pin đi 380-470 km nên cả tuần chỉ cần ghé sạc nhanh 1 lần khi đi siêu thị"
            ]
        elif intent == "policy_and_pricing":
            return [
                "Tận dụng ưu đãi miễn 100% lệ phí trước bạ của Chính phủ (tiết kiệm trực tiếp 25 - 200 triệu)",
                "Gói vay ngân hàng liên kết lãi suất cố định 5% trong 2 năm đầu, vốn đối ứng chỉ từ 15-20%",
                "Chi phí lăn bánh trọn gói minh bạch, không phát sinh phụ phí 'bia kèm lạc'"
            ]
        return [
            "Chủ động đặt câu hỏi thấu hiểu nhu cầu và cung đường di chuyển quen thuộc của khách",
            "Đưa ra các con số thực tế chứng minh bài toán kinh tế nuôi xe điện",
            "Mời khách hàng trải nghiệm lái thử thực tế để thuyết phục bằng cảm giác lái chân thật"
        ]

    @staticmethod
    def _generate_follow_ups(intent: str, vehicle_model: Optional[str]) -> List[str]:
        if intent == "battlecard_comparison":
            return [
                "Gia đình mình thường đi trong phố hay đi đường dài cao tốc nhiều hơn ạ?",
                "Anh/chị đã từng trải nghiệm cảm giác tăng tốc tức thì của động cơ điện chưa?",
                "Về kích thước hàng ghế sau và độ êm ái khi chở người lớn, anh/chị ưu tiên tiêu chí nào hơn?"
            ]
        elif intent == "battery_and_charging":
            return [
                "Mỗi tháng trung bình gia đình mình di chuyển khoảng bao nhiêu cây số ạ?",
                "Tại nơi ở hoặc nơi làm việc của anh/chị có gần trung tâm thương mại Vincom hay cây xăng không?",
                "Anh/chị đang nghiêng về phương án thuê pin để tối ưu dòng tiền ban đầu hay muốn mua đứt pin luôn ạ?"
            ]
        return [
            "Ngân sách dự kiến trả trước và khoản vay hàng tháng của mình trong khoảng bao nhiêu ạ?",
            "Anh/chị muốn đăng ký đứng tên cá nhân hay công ty để bên em hướng dẫn giấy tờ trước bạ?",
            "Cuối tuần này em mời anh/chị qua showroom bên em trải nghiệm lái thử chiếc xe này nhé?"
        ]


answer_generator = AnswerGenerator()
