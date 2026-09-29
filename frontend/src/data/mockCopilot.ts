import { CopilotMessage } from "@/types";

export const mockCopilotSuggestedQuestions = [
  "So sánh chi phí thuê pin vs mua đứt VF 8?",
  "Chính sách bảo hành đổi pin khi SOH < 70%?",
  "So sánh ADAS của VF 7 với Honda Sensing?",
  "Ưu đãi lệ phí trước bạ xe điện và sạc V-GREEN?",
  "Giải pháp sạc cho cư dân ở chung cư?",
];

export const mockCopilotInitialMessages: CopilotMessage[] = [
  {
    id: "cop-01",
    sender: "ai",
    timestamp: "10:00",
    text: "Chào bạn! Tôi là **AI Sales Copilot**. Tôi có thể hỗ trợ bạn tra cứu nhanh thông số kỹ thuật, giá bán, chính sách pin và kịch bản tư vấn xe VinFast 2026.\n\nBạn cần tra cứu thông tin gì hôm nay?",
    recommendedTalkingPoints: [
      "Kiểm tra ưu đãi trước bạ 0% và sạc V-GREEN",
      "So sánh chi phí xe điện vs xe xăng cùng phân khúc",
      "Chính sách đổi pin khi SOH < 70%"
    ]
  }
];
