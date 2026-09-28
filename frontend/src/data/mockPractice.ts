import { PracticeSessionResult } from "@/types";

export const mockSampleSessionResult: PracticeSessionResult = {
  sessionId: "sess-2026-0922-01",
  scenarioId: "scen-01",
  scenarioTitle: "VF 8 — Xử lý băn khoăn Pin Thuê vs Mua Đứt & Tính toán kinh tế",
  vehicleModel: "VinFast VF 8 Plus",
  advisorName: "Võ Trường An",
  advisorId: "adv-001",
  date: "22/09/2026 14:30",
  duration: "14 phút 25 giây",
  overallScore: 86,
  managerReviewed: true,
  managerScore: 88,
  managerNote: "An xử lý rất chắc chắn bài toán dòng tiền thuê pin và khéo léo dùng ưu đãi trước bạ 0% để giải tỏa tâm lý cho anh Tuấn. Cần chủ động đề xuất lái thử trải nghiệm ADAS sớm hơn ở lượt 4.",
  managerReviewerName: "Lê Văn Hoàng (Training Director)",
  managerReviewedAt: "22/09/2026 16:15",
  aiSummary: "Tư vấn viên thể hiện kiến thức sản phẩm và chính sách xuất sắc, nắm chắc điều khoản cam kết pin SOH < 70%. Kỹ năng xử lý từ chối đạt mức thuyết phục cao nhờ đưa ra số liệu so sánh chi phí minh bạch.",
  rubricBreakdown: [
    {
      criterion: "need_discovery",
      criterionNameVi: "Thấu hiểu nhu cầu (Need Discovery)",
      score: 85,
      maxScore: 100,
      definition: "Khai thác thói quen di chuyển thực tế, quy mô gia đình và lý do tài chính ẩn sau câu hỏi của khách hàng.",
      evidence: [
        "Lượt 2: 'Dạ anh Tuấn cho em hỏi trung bình mỗi ngày anh di chuyển khoảng bao nhiêu km từ nhà đến cơ quan ạ?'",
        "Lượt 4: 'Ngoài việc đi làm hằng ngày, cuối tuần anh chị có thường đưa hai bé về quê hay đi dã ngoại không ạ?'"
      ],
      reason: "Đã làm rõ được quãng đường di chuyển trung bình (~1.400 km/tháng) giúp định vị ngay gói thuê pin tối ưu.",
      improvementTip: "Nên hỏi thêm về khả năng sạc tại hầm chung cư của khách ngay từ đầu để chủ động giải tỏa tâm lý."
    },
    {
      criterion: "product_knowledge",
      criterionNameVi: "Kiến thức sản phẩm (Product Knowledge)",
      score: 92,
      maxScore: 100,
      definition: "Nắm vững thông số công suất, tầm hoạt động, thời gian sạc nhanh và trang bị tiện nghi của VF 8.",
      evidence: [
        "Lượt 5: Trình bày chính xác thời gian sạc siêu nhanh 10% - 70% trong 24 phút tại trụ sạc 250kW của V-GREEN.",
        "Lượt 7: Nêu rõ tầm hoạt động chuẩn WLTP đạt 457 km của phiên bản VF 8 Plus."
      ],
      reason: "Số liệu chính xác tuyệt đối, không bị nhầm lẫn giữa bản Eco và Plus.",
      improvementTip: "Có thể lồng ghép thêm cảm giác tăng tốc 5.5s để tạo sự phấn khích hơn cho khách hàng trẻ."
    },
    {
      criterion: "objection_handling",
      criterionNameVi: "Xử lý từ chối (Objection Handling)",
      score: 88,
      maxScore: 100,
      definition: "Xử lý băn khoăn về chi phí thuê pin tích lũy và rủi ro pin chai sau nhiều năm sử dụng.",
      evidence: [
        "Lượt 6: 'Gói thuê pin thực chất hoạt động như một gói bảo hiểm rủi ro trọn đời. Bất kỳ khi nào pin xuống dưới 70%, VinFast đổi mới hoàn toàn miễn phí cho anh.'",
        "Lượt 8: Tính toán bài toán trước bạ 0% giúp anh tiết kiệm ngay hơn 130 triệu đồng tiền lăn bánh."
      ],
      reason: "Biến điểm yếu tâm lý 'phải trả tiền hàng tháng' thành lợi thế 'an tâm tuyệt đối không lo chai pin'.",
      improvementTip: "Cần công nhận cảm xúc băn khoăn của khách trước khi đưa ra các con số phản biện."
    },
    {
      criterion: "policy_accuracy",
      criterionNameVi: "Độ chính xác chính sách (Policy Accuracy)",
      score: 95,
      maxScore: 100,
      definition: "Cập nhật chính xác các văn bản ưu đãi 2026, lệ phí trước bạ và gói sạc công cộng V-GREEN.",
      evidence: [
        "Lượt 8: Dẫn chứng đúng Nghị định miễn lệ phí trước bạ xe điện và gói tặng 1 năm sạc pin V-GREEN.",
        "Lượt 10: Nêu chính xác chính sách bảo hành 10 năm hoặc 200.000 km."
      ],
      reason: "Không xuất hiện bất kỳ sai sót nào về số tiền khuyến mãi hay thời hạn bảo hành.",
      improvementTip: "Duy trì phong độ cập nhật tài liệu chính sách."
    },
    {
      criterion: "closing_next_step",
      criterionNameVi: "Chốt đơn & Bước tiếp theo (Closing / Next Step)",
      score: 72,
      maxScore: 100,
      definition: "Thúc đẩy cam kết cụ thể: Lái thử, đặt cọc giữ xe hoặc chốt lịch giao xe.",
      evidence: [
        "Lượt 11: 'Anh Tuấn có muốn đặt cọc thử để giữ xe giao trước đợt tăng giá không ạ?'"
      ],
      reason: "Đã có hành động chốt cọc nhưng câu hỏi còn mang tính do dự ('thử'), chưa tạo đủ tính cấp bách.",
      improvementTip: "Nên chốt bằng kỹ năng 'Lựa chọn thay thế': 'Anh Tuấn muốn nhận xe màu Trắng hay màu Đen trong tuần tới để em chuẩn bị hồ sơ giữ ưu đãi sạc 1 năm cho mình ạ?'"
    }
  ],
  transcript: [
    {
      id: "tr-01",
      sender: "customer",
      text: "Chào em, anh vừa xem qua chiếc VF 8 Plus. Xe thì anh thấy khá ưng, nhưng anh tính ra mỗi tháng trả gần 3 triệu tiền thuê pin, 5 năm mất gần 180 triệu, bằng nửa cục pin rồi. Sao anh không mua đứt luôn cho đỡ mệt đầu?",
      timestamp: "14:30:10"
    },
    {
      id: "tr-02",
      sender: "advisor",
      text: "Dạ em chào anh Tuấn! Em rất hiểu băn khoăn của anh, nhiều khách hàng công nghệ yêu cầu sự chính xác như anh lúc đầu cũng tính bài toán tương tự. Anh Tuấn cho em hỏi thêm, trung bình mỗi tháng nhu cầu di chuyển của anh chị và gia đình khoảng bao nhiêu km ạ?",
      timestamp: "14:31:05",
      intentDetected: "Need Discovery - Quãng đường di chuyển"
    },
    {
      id: "tr-03",
      sender: "customer",
      text: "Anh đi làm từ Thủ Đức qua Quận 1 tầm 25km cả đi lẫn về. Cuối tuần thỉnh thoảng chở vợ con đi siêu thị hoặc Vũng Tàu. Chắc trung bình tầm 1.200 - 1.500 km/tháng là cùng.",
      timestamp: "14:32:00",
      factRevealed: "Di chuyển 1.200 - 1.500 km/tháng"
    },
    {
      id: "tr-04",
      sender: "advisor",
      text: "Tuyệt vời anh ạ! Với mức di chuyển 1.200 - 1.500 km/tháng, phương án thuê pin chính là lựa chọn kinh tế nhất cho anh. Vì anh không phải bỏ ra 200 triệu chênh lệch mua pin ban đầu. Số tiền 200 triệu này anh có thể đầu tư sinh lời khoảng 7-8%/năm, số tiền lãi đó đã đủ bù đắp phần lớn chi phí thuê pin hàng tháng rồi anh ạ.",
      timestamp: "14:33:15",
      intentDetected: "Financial Comparison & Value Pitch"
    },
    {
      id: "tr-05",
      sender: "customer",
      text: "Nghe cũng có lý. Nhưng mà lỡ sau 3-4 năm pin nó bị chai, sạc mãi không đầy, lúc bán lại xe ai mua chiếc xe pin yếu hả em?",
      timestamp: "14:34:20"
    },
    {
      id: "tr-06",
      sender: "advisor",
      text: "Dạ đây chính là giá trị lớn nhất của gói thuê pin anh Tuấn ạ! Gói thuê pin thực chất hoạt động như một hợp đồng 'bảo hiểm rủi ro trọn đời' cho pin. Trong hợp đồng cam kết bằng văn bản: Bất cứ khi nào dung lượng pin khả dụng (SOH) xuống dưới 70%, VinFast sẽ thay thế bộ pin mới hoàn toàn miễn phí cho anh. Nghĩa là anh Tuấn không bao giờ phải chịu rủi ro chai pin, chiếc xe của anh luôn luôn có một bộ pin đạt chuẩn trên 70%.",
      timestamp: "14:35:45",
      objectionResolved: true,
      intentDetected: "Objection Handling - Cam kết SOH < 70%"
    },
    {
      id: "tr-07",
      sender: "customer",
      text: "À, nghĩa là chai pin dưới 70% là được đổi pin mới miễn phí luôn à? Cái này anh chưa đọc kỹ trong hợp đồng. Thế còn vụ sạc xe thì sao? Chung cư anh ở Sala cũng có trụ sạc, nhưng tối về nhỡ đầy chỗ thì sáng mai anh đi làm thế nào?",
      timestamp: "14:37:00",
      factRevealed: "Ở chung cư Sala - Có trụ sạc nhưng lo quá tải"
    },
    {
      id: "tr-08",
      sender: "advisor",
      text: "Dạ anh Tuấn hoàn toàn yên tâm. VF 8 Plus sạc đầy đi được tới 457 km. Một tuần anh đi khoảng 300 km thì chỉ cần sạc đúng 1 lần là thoải mái vi vu cả tuần. Hơn nữa, với trụ sạc siêu nhanh 250kW của V-GREEN ngay cây xăng Vincom cách chung cư anh 500m, anh chỉ cần cắm sạc uống một ly cà phê tầm 24 phút là pin đã lên từ 10% đến 70% rồi ạ.",
      timestamp: "14:38:50",
      intentDetected: "Product Knowledge & Charging Convenience"
    },
    {
      id: "tr-09",
      sender: "customer",
      text: "Ừ, 24 phút thì tiện thật. Thế xe này lăn bánh bây giờ tổng cộng bao nhiêu, có ưu đãi gì đặc biệt không?",
      timestamp: "14:40:10"
    },
    {
      id: "tr-10",
      sender: "advisor",
      text: "Dạ hiện tại xe điện được nhà nước miễn 100% lệ phí trước bạ, giúp anh tiết kiệm ngay hơn 130 triệu đồng so với xe xăng cùng tầm giá. Ngoài ra, trong tháng này VinFast đang tặng 1 năm sạc pin miễn phí tại toàn bộ trạm V-GREEN và miễn phí gửi xe tại Vinhomes/Vincom. Anh Tuấn có muốn đặt cọc 10 triệu để em giữ suất ưu đãi màu xe anh thích trong tuần này không ạ?",
      timestamp: "14:42:00",
      intentDetected: "Policy Accuracy & Closing Call"
    },
    {
      id: "tr-11",
      sender: "customer",
      text: "Được rồi, nghe em tư vấn rõ ràng và rành mạch anh thấy tin tưởng. Lấy hợp đồng cho anh xem các điều khoản bảo hành pin, nếu chuẩn như em nói anh sẽ cọc giữ xe màu Xanh VinFast Blue luôn.",
      timestamp: "14:43:30"
    }
  ],
  recommendedNextPractice: "Luyện tập thêm kịch bản VF 7 với khách hàng thích so sánh công nghệ ADAS để tăng tốc độ và sự quyết đoán trong bước Closing."
};
