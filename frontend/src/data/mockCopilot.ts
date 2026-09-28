import { CopilotMessage } from "@/types";

export const mockCopilotSuggestedQuestions = [
  "So sánh chi phí thuê pin vs mua đứt VF 8 cho khách đi 1.500 km/tháng?",
  "Chính sách bảo hành pin VF 9 khi nào được thay mới miễn phí?",
  "Khách hàng so sánh ADAS của VF 7 với Honda Sensing trên CR-V thì nhấn mạnh điểm gì?",
  "Ưu đãi lệ phí trước bạ xe điện và miễn phí sạc V-GREEN hiện hành gồm những gì?",
  "Tư vấn cho khách ở chung cư lo ngại không có chỗ sạc xe qua đêm?",
];

export const mockCopilotInitialMessages: CopilotMessage[] = [
  {
    id: "cop-01",
    sender: "ai",
    timestamp: "10:15",
    text: "Xin chào Trường An! Tôi là **AI Sales Copilot**. Tôi có thể hỗ trợ bạn tra cứu thông số kỹ thuật xe, cập nhật chính sách bán hàng mới nhất, trích xuất căn cứ tài liệu chính thức và gợi ý kịch bản xử lý từ chối hiệu quả.\n\nBạn có câu hỏi nào về các mẫu xe VinFast hoặc chính sách ưu đãi hôm nay không?",
    recommendedTalkingPoints: [
      "Kiểm tra ưu đãi trước bạ 0% và quà tặng sạc pin V-GREEN",
      "So sánh chi phí vận hành xe điện vs xe xăng cùng phân khúc",
      "Nắm chắc điều khoản cam kết đổi pin SOH < 70%"
    ]
  },
  {
    id: "cop-02",
    sender: "user",
    timestamp: "10:16",
    text: "Khách hàng đang phân vân giữa việc Thuê pin và Mua đứt pin trên chiếc VF 8. Tôi nên tư vấn thế nào để khách thấy thuê pin là lựa chọn kinh tế?",
    category: "Chính sách bán hàng"
  },
  {
    id: "cop-03",
    sender: "ai",
    timestamp: "10:16",
    text: "Để tư vấn phương án **Thuê pin** cho khách hàng mua **VF 8**, bạn nên tập trung vào 3 luận điểm cốt lõi sau:\n\n### 1. Tối ưu dòng tiền & Chi phí đầu tư ban đầu\n* Giá xe bản thuê pin rẻ hơn bản mua pin **200.000.000 VNĐ** (1.099 tỷ vs 1.299 tỷ bản Eco).\n* Khách hàng giữ lại 200 triệu này để gửi tiết kiệm hoặc đầu tư (sinh lời ~7-8%/năm = 14-16 triệu/năm), số tiền này đã bù đắp gần một nửa chi phí thuê pin hàng tháng.\n\n### 2. Gói thuê pin chính là 'Bảo hiểm rủi ro trọn đời'\n* Tâm lý khách hàng sợ nhất là pin bị chai sau 3-5 năm. Gói thuê pin cam kết bằng văn bản: **Khi dung lượng pin khả dụng (SOH) giảm xuống dưới 70%, VinFast sẽ sửa chữa hoặc thay thế bộ pin mới hoàn toàn miễn phí**.\n* Khách hàng hoàn toàn không phải gánh chịu rủi ro hao hụt tài sản do pin thoái hóa.\n\n### 3. Điểm hòa vốn theo km di chuyển\n* Nếu khách hàng di chuyển **dưới 1.800 km/tháng**, chi phí thuê pin (2.900.000 đ/tháng) cộng tiền điện sạc (~350 đ/km) vẫn tiết kiệm hơn đáng kể so với tiền xăng của một chiếc D-SUV máy xăng như Santa Fe (tiêu hao ~10-12 lít/100km ~ 3.500.000 - 4.500.000 đ tiền xăng).",
    citations: [
      {
        id: "cit-01",
        docTitle: "Chính sách Pin Thuê vs Mua Đứt - Quy chuẩn tư vấn 2026",
        version: "v2.6.2",
        effectiveDate: "01/01/2026",
        confidence: 0.98,
        snippet: "Bất kỳ khi nào dung lượng pin khả dụng (SOH) xuống dưới 70%, VinFast cam kết sửa chữa hoặc thay thế bộ pin mới hoàn toàn miễn phí."
      },
      {
        id: "cit-02",
        docTitle: "Bảng giá & Chính sách thuê pin VinFast toàn quốc 2026",
        version: "v1.4",
        effectiveDate: "15/01/2026",
        confidence: 0.96,
        snippet: "Gói thuê pin VF 8: 2.900.000 VNĐ/tháng áp dụng quãng đường dưới 3.000 km/tháng. Đặt cọc thuê pin linh hoạt."
      }
    ],
    recommendedTalkingPoints: [
      "Hỏi khách: 'Mỗi tháng anh chị dự kiến đi khoảng bao nhiêu km?'",
      "Nhấn mạnh: 'Thuê pin giúp loại bỏ hoàn toàn nỗi lo chai pin và chi phí thay pin hàng trăm triệu về sau.'",
      "Đưa ra số liệu trước bạ 0% tiết kiệm hơn 130 triệu bù đắp cho tiền thuê pin 4 năm đầu."
    ],
    followUpQuestions: [
      "Khách hàng di chuyển trên 3.000 km/tháng thì tư vấn gói nào?",
      "Thủ tục chuyển nhượng xe khi khách đang dùng gói thuê pin ra sao?",
      "Khách hàng có thể chuyển từ thuê pin sang mua đứt pin sau này được không?"
    ],
    customerFitReasoning: "Phù hợp nhất với khách hàng chuộng dòng tiền, doanh nghiệp tối ưu chi phí khấu hao, hoặc khách hàng lần đầu tiếp cận xe điện còn dè dặt về độ bền của pin."
  }
];
