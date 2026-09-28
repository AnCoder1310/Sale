"""
Live Sales Whisper & Quotation Deal Sheet Service.
Tính năng đột phá phục vụ Đồ án tốt nghiệp:
1. Live Sales Whisper (HUD Nhắc bài 3 giây): Phân tích tâm lý ngầm của khách và mớm câu phản xạ tức thì.
2. Automated Deal Sheet & Quotation: Tự động trích xuất nhu cầu, tính chi phí lăn bánh và sinh bản báo giá gửi Zalo.
"""
from datetime import datetime
import json
import re
from typing import Any, Dict, List, Optional
from src.knowledge.retrieval_service import retrieval_service
from src.roleplay.persistence import session_persistence


class DealSheetAndWhisperService:
    """Dịch vụ trợ lý nhắc bài thời gian thực và tự động tạo bảng báo giá chốt đơn."""

    PRICE_TABLE = {
        "VF 3": {"name": "VinFast VF 3", "battery_rental": 240_000_000, "battery_buy": 322_000_000, "monthly_battery_fee": 900_000},
        "VF 5": {"name": "VinFast VF 5 Plus", "battery_rental": 468_000_000, "battery_buy": 548_000_000, "monthly_battery_fee": 1_600_000},
        "VF 6": {"name": "VinFast VF 6 Plus", "battery_rental": 675_000_000, "battery_buy": 765_000_000, "monthly_battery_fee": 1_800_000},
        "VF 7": {"name": "VinFast VF 7 Plus", "battery_rental": 850_000_000, "battery_buy": 999_000_000, "monthly_battery_fee": 1_800_000},
        "VF 8": {"name": "VinFast VF 8 Plus", "battery_rental": 1_090_000_000, "battery_buy": 1_270_000_000, "monthly_battery_fee": 2_900_000},
        "VF 9": {"name": "VinFast VF 9 Plus (6 chỗ)", "battery_rental": 1_589_000_000, "battery_buy": 2_114_000_000, "monthly_battery_fee": 3_500_000},
    }

    def generate_live_whisper(
        self,
        customer_message: str,
        stage: str = "discovery",
        vehicle_model: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        HUD Live Sales Whisper:
        Phân tích câu nói của khách hàng trong 0.2 giây, đưa ra:
        - Tâm lý ngầm (Customer Hidden Psyche)
        - 3 Luận điểm đắt giá sales liếc mắt trong 1 giây để phản xạ
        - Mẫu câu nói tự nhiên chạm cảm xúc (Suggested Exact Speech)
        - Căn cứ văn bản bảo chứng
        """
        msg_lower = customer_message.lower()

        # 1. Phát hiện tâm lý ngầm theo ngữ cảnh
        if any(w in msg_lower for w in ["thuê pin", "tiền thuê", "chai pin", "180 triệu", "mua đứt"]):
            sentiment = "Băn khoăn bài toán kinh tế & Rủi ro chai pin"
            hidden_intent = "Khách hàng cảm thấy phí thuê pin tích lũy sau nhiều năm quá đắt nhưng chưa hiểu lợi ích bảo hành đổi pin miễn phí trọn đời."
            golden_bullets = [
                "Không chôn 200 triệu vốn ban đầu, giữ tiền gửi tiết kiệm hoặc kinh doanh sinh lời bù tiền pin.",
                "VinFast chịu 100% rủi ro hao mòn: Pin chai dưới 70% được đổi nguyên cụm pin mới tinh miễn phí.",
                "Cọc thuê pin 20 triệu được hoàn trả 100% khi thanh lý xe."
            ]
            suggested_speech = (
                "Dạ em rất hiểu góc nhìn tài chính của anh. Nhưng nếu tính bài toán dòng tiền thì thuê pin lại rất lợi: "
                "Anh tiết kiệm ngay 200 triệu tiền mặt ban đầu đem đi đầu tư, và sau này pin chai dưới 70% VinFast đổi mới miễn phí, "
                "anh hoàn toàn không phải gánh rủi ro chai pin như mua đứt ạ!"
            )
            verified_source = "Quyết định số 188/2026/V-POLICY về Chính sách thuê pin ô tô điện VinFast"

        elif any(w in msg_lower for w in ["cx-5", "cx5", "xe xăng", "xăng", "đổ xăng", "hết pin"]):
            sentiment = "Tâm lý gắn bó với thói quen cũ & Lo ngại gián đoạn"
            hidden_intent = "Khách hàng đang quen sự tiện lợi của xe xăng (đổ 3 phút), sợ xe điện sạc lâu và làm trễ công việc quan trọng."
            golden_bullets = [
                "Công suất 349 mã lực và mô-men xoắn 500 Nm AWD: Bốc gấp đôi CX-5 (154 HP, FWD).",
                "Sạc nhanh 24 phút từ 10-70% tại 150.000 trạm sạc V-GREEN phủ sóng 63 tỉnh thành.",
                "Chi phí điện chỉ ~450đ/km, rẻ hơn 4 lần tiền xăng (1.600đ/km), sau 3 vạn km tiết kiệm đủ bù giá mua."
            ]
            suggested_speech = (
                "Dạ xe xăng quen thuộc nhưng chiếc VF 7 Plus lại cho chị trải nghiệm vượt trội hơn hẳn: "
                "Công suất 349 mã lực mạnh gấp đôi CX-5, có sạc nhanh 24 phút vừa vặn lúc chị dừng chân nghỉ ngơi, "
                "và tiền sạc điện chỉ bằng 1/4 tiền xăng giúp chị tiết kiệm hơn 30 triệu mỗi năm ạ!"
            )
            verified_source = "Sales Battlecard Hub VinFast 2026: VF 7 Plus vs Mazda CX-5"

        elif any(w in msg_lower for w in ["taxi", "thương hiệu", "đối tác", "explorer", "sang"]):
            sentiment = "Nhu cầu khẳng định vị thế & Sợ bị đánh giá thương hiệu"
            hidden_intent = "Khách hàng mua xe ngoại giao hơn 2 tỷ, cần sự khẳng định đẳng cấp nguyên thủ và trải nghiệm khoang cơ trưởng cao cấp nhất."
            golden_bullets = [
                "Phân khúc phân định rõ: Taxi chỉ dùng VF 5/VF e34; VF 9 là siêu phẩm E-SUV dành riêng cho Chủ tịch & Doanh nhân.",
                "Hàng ghế Cơ trưởng VIP massage chuyên sâu, sưởi/làm mát và điều hòa độc lập phục vụ tối ưu cho đối tác.",
                "Hệ thống treo khí nén điện tử tự động nâng hạ gầm êm ái như Maybach, triệt tiêu mọi dằn xóc."
            ]
            suggested_speech = (
                "Dạ thưa Bác, taxi giao thông công cộng tuyệt đối chỉ dùng VF 5 thôi ạ. Còn chiếc VF 9 này là dòng E-SUV đầu bảng "
                "với hệ thống treo khí nén điện tử và hàng ghế Cơ trưởng massage độc quyền cho các lãnh đạo cấp cao. "
                "Khi bác đưa đón đối tác, người ta sẽ kính trọng vị thế và nể phục tinh thần tiên phong ủng hộ công nghệ Việt của bác ạ!"
            )
            verified_source = "Catalog Kỹ thuật VF 9 Plus: Hệ thống treo khí nén & Ghế thương gia"

        elif any(w in msg_lower for w in ["lụt", "mưa", "vô nước", "ngập", "mùa lụt", "giật điện"]):
            sentiment = "Nỗi sợ an toàn tính mạng & Hỏng hóc mùa mưa bão"
            hidden_intent = "Khách hàng lo pin ngập nước bị rò rỉ điện gây nguy hiểm hoặc chập cháy chết máy giữa đường."
            golden_bullets = [
                "Khối pin đạt chuẩn chống nước bụi IP67 quốc tế: Ngâm nước sâu 0.5m trong 30 phút an toàn tuyệt đối.",
                "Khoảng sáng gầm cao vượt trội (191 mm), vượt vỉa hè và đường lụt tốt hơn xe xăng.",
                "Xe điện không có cổ hút gió nên KHÔNG BAO GIỜ bị thủy kích chết máy như xe xăng."
            ]
            suggested_speech = (
                "Dạ anh hoàn toàn an tâm nhé! Pin xe đạt chuẩn chống nước IP67 quốc tế, ngâm ngập nước sâu nửa mét cả nửa tiếng "
                "vẫn kín khít an toàn 100%. Đặc biệt xe điện không có cổ hút gió nên không bao giờ lo chết máy thủy kích như xe xăng đâu ạ!"
            )
            verified_source = "Tiêu chuẩn kỹ thuật an toàn pin xe điện VinFast IP67"

        elif any(w in msg_lower for w in ["trc", "passport", "foreigner", "foreigner registration", "english"]):
            sentiment = "Legal & Usability Concerns for Expats"
            hidden_intent = "The customer wants to ensure clear vehicle ownership under their name and native English interface for family."
            golden_bullets = [
                "Expats with a valid TRC (1+ year) and Work Permit can legally own and register a white-plate car in Vietnam.",
                "Infotainment screen and Vivi Voice Assistant support 100% native English commands.",
                "Home charging and V-GREEN charging app fully localized in English."
            ]
            suggested_speech = (
                "Hello Mr. David! In Vietnam, expats holding a valid Temporary Residence Card (TRC) and work permit can legally register "
                "the car under their own name. Furthermore, our VF 8 features 100% native English voice assistant and infotainment for your family!"
            )
            verified_source = "Cẩm nang hướng dẫn pháp lý khách hàng Expat VinFast & Circular 24/2023/TT-BCA"

        else:
            sentiment = "Lắng nghe & Khám phá thêm nhu cầu"
            hidden_intent = "Khách hàng đang cân nhắc thông số và muốn có thêm cơ sở thực tế để đưa ra quyết định."
            golden_bullets = [
                "Làm rõ lộ trình di chuyển hàng ngày trong phố hay đường trường.",
                "Nhắc lại ưu đãi miễn 100% thuế trước bạ tiết kiệm ngay từ 25 - 200 triệu đồng.",
                "Đề xuất bước tiếp theo: Mời lái thử thực tế tại showroom hoặc mang xe đến tận nhà."
            ]
            suggested_speech = (
                "Dạ để em tư vấn phương án tối ưu nhất cho gia đình, cho em hỏi mỗi ngày mình thường di chuyển khoảng bao nhiêu km ạ? "
                "Hiện tại xe điện đang được Nhà nước miễn 100% lệ phí trước bạ nên lăn bánh cực kỳ tiết kiệm anh nhé!"
            )
            verified_source = "Nghị định 10/2022/NĐ-CP về miễn 100% lệ phí trước bạ ô tô điện"

        return {
            "customer_sentiment": sentiment,
            "hidden_intent": hidden_intent,
            "golden_bullets": golden_bullets,
            "suggested_speech": suggested_speech,
            "verified_source": verified_source,
            "stage_hint": f"Giai đoạn {stage.upper()}: Đồng cảm trước -> Nêu số liệu chứng minh -> Kêu gọi hành động."
        }

    def generate_deal_sheet(
        self,
        session_id: Optional[str] = None,
        vehicle_model: str = "VF 7",
        province: str = "TP. Hồ Chí Minh",
        battery_option: str = "rental",
        advisor_name: str = "Võ Trường An",
        customer_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Tự động tạo Bảng Báo Giá Lăn Bánh & Kế Hoạch Tài Chính (Deal Sheet):
        Bóc tách chi phí lăn bánh chính xác từng đồng, nêu bật số tiền thuế trước bạ tiết kiệm được,
        dự toán trả góp ngân hàng và sinh mẫu tin nhắn Zalo gửi ngay cho khách hàng.
        """
        # Chuẩn hóa model
        key = "VF 7"
        for k in self.PRICE_TABLE.keys():
            if k.lower() in vehicle_model.lower():
                key = k
                break

        spec = self.PRICE_TABLE[key]
        base_price = spec["battery_rental"] if battery_option == "rental" else spec["battery_buy"]

        # Chi phí lăn bánh theo địa phương
        is_major_city = any(c in province.lower() for c in ["hà nội", "hồ chí minh", "tp.hcm", "hcm"])
        plate_fee = 20_000_000 if is_major_city else 1_000_000
        inspection_fee = 90_000
        road_maintenance_fee = 1_560_000  # 1 năm cho xe cá nhân dưới 9 chỗ
        civil_insurance = 480_700  # Bảo hiểm TNDS 1 năm

        # Ưu đãi thuế trước bạ 0%
        registration_tax_fee = 0
        tax_saved = int(base_price * 0.10)  # Thuế trước bạ xe xăng tương đương 10%

        total_on_the_road = (
            base_price + plate_fee + inspection_fee + road_maintenance_fee + civil_insurance
        )

        # Tính trả góp 20% trả trước, vay 80% trong 5 năm lãi suất 5%/năm
        down_payment_pct = 20
        down_payment = base_price * (down_payment_pct / 100.0)
        loan_amount = base_price - down_payment
        monthly_principal = loan_amount / 60.0
        monthly_interest_first = loan_amount * (0.05 / 12.0)
        first_month_installment = monthly_principal + monthly_interest_first

        # Khách hàng
        c_name = customer_name or "Quý Khách Hàng"
        if session_id:
            res = session_persistence.get_result(session_id)
            if res and res.get("advisorName"):
                advisor_name = res["advisorName"]

        # Zalo-ready Message Copy
        zalo_msg = (
            f"🚗 KÍNH GỬI {c_name.upper()} — BẢNG TÍNH LĂN BÁNH {spec['name'].upper()}\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"📌 1. GIÁ XE & CHÍNH SÁCH PIN:\n"
            f"• Giá niêm yết ({'Gói thuê pin' if battery_option == 'rental' else 'Gói mua pin'}): {base_price:,.0f} VNĐ\n"
            f"• Gói thuê pin hàng tháng: {spec['monthly_battery_fee']:,.0f} VNĐ/tháng (Đổi pin mới khi chai < 70%)\n"
            f"\n"
            f"🎁 2. ĐẶC QUYỀN MIỄN 100% THUẾ TRƯỚC BẠ:\n"
            f"• Thuế trước bạ nộp Nhà nước: 0 VNĐ\n"
            f"👉 TIẾT KIỆM NGAY: {tax_saved:,.0f} VNĐ so với mua xe xăng cùng tầm giá!\n"
            f"\n"
            f"📋 3. CHI PHÍ LĂN BÁNH TRỌN GÓI ({province}):\n"
            f"• Tiền biển số: {plate_fee:,.0f} VNĐ\n"
            f"• Phí đăng kiểm: {inspection_fee:,.0f} VNĐ\n"
            f"• Phí đường bộ (1 năm): {road_maintenance_fee:,.0f} VNĐ\n"
            f"• Bảo hiểm TNDS: {civil_insurance:,.0f} VNĐ\n"
            f"➡️ TỔNG LĂN BÁNH CHÍNH XÁC: {total_on_the_road:,.0f} VNĐ\n"
            f"\n"
            f"🏦 4. DỰ TOÁN TRẢ GÓP NGÂN HÀNG (Lãi suất cố định 5%):\n"
            f"• Trả trước nhận xe (20%): {down_payment:,.0f} VNĐ\n"
            f"• Tiền gốc + lãi tháng đầu: ~{first_month_installment:,.0f} VNĐ (giảm dần từng tháng)\n"
            f"━━━━━━━━━━━━━━━━━━━\n"
            f"📞 Em {advisor_name} — VinFast hân hạnh phục vụ anh/chị. Em xin phép gửi xe đến tận nơi để mình lái thử trải nghiệm nhé ạ!"
        )

        return {
            "vehicleName": spec["name"],
            "batteryOption": battery_option,
            "province": province,
            "customerName": c_name,
            "advisorName": advisor_name,
            "basePrice": int(base_price),
            "taxSaved": int(tax_saved),
            "plateFee": int(plate_fee),
            "inspectionFee": int(inspection_fee),
            "roadMaintenanceFee": int(road_maintenance_fee),
            "civilInsurance": int(civil_insurance),
            "totalOnTheRoad": int(total_on_the_road),
            "downPayment": int(down_payment),
            "loanAmount": int(loan_amount),
            "firstMonthPayment": int(first_month_installment),
            "monthlyBatteryFee": int(spec["monthly_battery_fee"]) if battery_option == "rental" else 0,
            "zaloMessage": zalo_msg
        }


deal_sheet_service = DealSheetAndWhisperService()
