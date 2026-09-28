import { RoleplayScenario } from "@/types";

export const mockScenarios: RoleplayScenario[] = [
  {
    id: "scen-01",
    title: "VF 8 — Xử lý băn khoăn Pin Thuê vs Mua Đứt & Tính toán kinh tế",
    vehicleId: "vf-8",
    vehicleModel: "VinFast VF 8 Plus",
    difficulty: "Tiêu chuẩn",
    durationMinutes: 15,
    customerPersona: {
      id: "per-01",
      name: "Anh Hoàng Tuấn",
      age: 36,
      occupation: "Trưởng phòng Kỹ thuật Phần mềm (Tech Lead)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      personality: "Logic, thực dụng, tính toán kỹ lưỡng từng con số, hay so sánh chi phí cơ hội.",
      familyProfile: "Đã có vợ và 2 con nhỏ (4 tuổi và 7 tuổi), ở chung cư cao cấp.",
      primaryGoal: "Tìm một chiếc SUV rộng rãi, công nghệ cao, an toàn cho gia đình nhưng phải chứng minh được hiệu quả kinh tế.",
      budgetVnd: "1.3 - 1.5 tỷ đồng",
      trustInitial: 45,
      interestInitial: 75,
      hiddenNeeds: [
        "Chung cư đã có sẵn trụ sạc dưới hầm nhưng ngại người khác tranh chỗ",
        "Có ngân sách đủ mua đứt pin nhưng muốn giữ vốn đầu tư cổ phiếu/trái phiếu",
        "Rất quan tâm tính năng giữ làn và phanh tự động vì vợ cũng thỉnh thoảng lái xe"
      ],
      primaryObjections: [
        "Mỗi tháng trả gần 3 triệu tiền thuê pin, tính ra 5 năm bằng nửa cục pin rồi, sao không mua đứt?",
        "Nghe nói pin sạc nhiều thì chai, sau 3 năm bán lại xe điện có bị mất giá không?",
        "Chung cư đông xe, nhỡ tối về không có chỗ cắm sạc thì sáng hôm sau đi làm thế nào?"
      ],
    },
    context: "Khách hàng đã đi xem xe tại showroom và lái thử một vòng. Anh Tuấn đang ngồi tại bàn tư vấn, cầm bảng báo giá và liên tục bấm máy tính trên điện thoại để so sánh.",
    trainingObjective: "Giúp tư vấn viên luyện tập kỹ năng Need Discovery (khai thác thói quen di chuyển), trình bày bài toán dòng tiền thuê pin dưới góc nhìn 'Bảo hiểm rủi ro pin', và xử lý lo ngại trạm sạc chung cư.",
    targetSkills: ["Need Discovery", "Product Knowledge", "Objection Handling", "Closing / Next Step"],
    successConditions: [
      "Làm rõ số km khách đi trung bình hàng tháng (dưới 1.500km hay trên 2.500km)",
      "Giải thích cam kết đổi pin miễn phí khi dung lượng SOH dưới 70%",
      "So sánh chi phí lăn bánh: Trước bạ 0% bù đắp tiền thuê pin 3-4 năm đầu",
      "Thuyết phục khách hàng đăng ký đặt cọc giữ xe nhận ưu đãi sạc 1 năm"
    ],
    terminationConditions: [
      "Khách hàng đồng ý phương án thuê pin và ký giấy đặt cọc",
      "Tư vấn viên nói sai chính sách bảo hành hoặc cung cấp giá cũ",
      "Vượt quá 12 lượt phản hồi mà không giải tỏa được thắc mắc pin"
    ]
  },
  {
    id: "scen-02",
    title: "VF 7 — So sánh trực diện ADAS & Vận hành với C-SUV Máy Xăng",
    vehicleId: "vf-7",
    vehicleModel: "VinFast VF 7 Plus AWD",
    difficulty: "Nâng cao",
    durationMinutes: 18,
    customerPersona: {
      id: "per-02",
      name: "Chị Phương Lan",
      age: 41,
      occupation: "Giám đốc Công ty Truyền thông & Sự kiện",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      personality: "Cá tính, yêu thích cái đẹp và sự đột phá, hay di chuyển liên tỉnh dự event, quyết đoán nhưng đòi hỏi khắt khe.",
      familyProfile: "Gia đình 4 người, hiện đang sở hữu một chiếc Mazda CX-5 đời 2021.",
      primaryGoal: "Muốn đổi lên xe mới có ngoại hình độc đáo, tăng tốc bốc, nhiều công nghệ an toàn để đi cao tốc đêm.",
      budgetVnd: "1.0 - 1.2 tỷ đồng",
      trustInitial: 55,
      interestInitial: 85,
      hiddenNeeds: [
        "Thường xuyên lái xe đêm từ TP.HCM đi Phan Thiết, Vũng Tàu, rất sợ ngủ gật hoặc chướng ngại vật bất ngờ",
        "Yêu thích thiết kế phi thuyền của VF 7 nhưng bạn bè can ngăn vì sợ đi tỉnh thiếu trạm sạc",
        "Thích cảm giác đạp ga dính lưng của động cơ 349 mã lực"
      ],
      primaryObjections: [
        "Chị đang đi CX-5 quen rồi, đổ xăng 3 phút là chạy tiếp, mua xe điện đi sự kiện tỉnh nhỡ giữa đường hết pin thì trễ việc công ty?",
        "VF 7 bản Plus lăn bánh gần 1.1 tỷ, tầm tiền này mua được Hyundai Tucson hoặc Kia Sportage bản cao cấp nhất, tại sao chị phải chọn xe điện?",
        "Hệ thống tự lái ADAS ở đường xá Việt Nam xe máy tạt đầu liên tục liệu có phanh gấp gây nguy hiểm không?"
      ],
    },
    context: "Khách hàng vào showroom sau giờ làm việc, vừa ngắm chiếc VF 7 màu đỏ hỏa long vừa nghe cuộc điện thoại từ một người bạn khuyên nên mua CR-V.",
    trainingObjective: "Rèn luyện khả năng so sánh thông số kỹ thuật (349 HP vs 180 HP của xe xăng), chứng minh mạng lưới sạc dọc cao tốc, và giải thích cơ chế ADAS Stop & Go dải tốc độ đầy đủ.",
    targetSkills: ["Product Knowledge", "Objection Handling", "Policy Accuracy"],
    successConditions: [
      "Nhấn mạnh công suất 349 mã lực và dẫn động AWD vượt trội hoàn toàn phân khúc C",
      "Vẽ lộ trình sạc cụ thể trên cung đường khách hay đi (VD: Cao tốc Dầu Giây - Phan Thiết có 3 trạm sạc V-GREEN)",
      "Mời khách hàng trải nghiệm tính năng ADAS thực tế trên xe lái thử"
    ],
    terminationConditions: [
      "Khách chốt lịch lái thử vào cuối tuần cùng chồng",
      "Tư vấn viên công kích đối thủ Mazda CX-5 thay vì nói về giá trị VF 7"
    ]
  },
  {
    id: "scen-03",
    title: "VF 9 — Thuyết phục Doanh nhân lựa chọn Ghế Cơ trưởng VIP",
    vehicleId: "vf-9",
    vehicleModel: "VinFast VF 9 Plus (6 chỗ)",
    difficulty: "Nâng cao",
    durationMinutes: 20,
    customerPersona: {
      id: "per-03",
      name: "Bác Quang Minh",
      age: 58,
      occupation: "Chủ tịch Hội đồng Quản trị Công ty Cơ khí & Xây dựng",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      personality: "Điềm đạm, uy quyền, coi trọng sự thoải mái và vị thế cá nhân, có tài xế riêng.",
      familyProfile: "Con cái đã trưởng thành, xe phục vụ đi tiếp khách, đánh golf và về quê cuối tuần.",
      primaryGoal: "Tìm xe gầm cao cỡ lớn hạng sang, cách âm tuyệt đối, hàng ghế thứ 2 phải đẳng cấp như phòng khách di động.",
      budgetVnd: "2.0 - 2.5 tỷ đồng",
      trustInitial: 40,
      interestInitial: 65,
      hiddenNeeds: [
        "Thường xuyên bị đau lưng sau những chuyến đi dài, rất cần ghế massage chuyên sâu và điều hòa riêng biệt",
        "Muốn ủng hộ thương hiệu Việt Nam của tập đoàn Vingroup nhưng lo ngại xe mới ra nhiều lỗi vặt phần mềm",
        "Quan tâm đến chính sách đón tiễn và dịch vụ cứu hộ 24/7 chuyên biệt dành riêng cho chủ nhân VF 9"
      ],
      primaryObjections: [
        "Với hơn 2 tỷ, tôi mua Ford Explorer hay Lexus cũ vừa có thương hiệu, vừa sang trọng, mua VinFast đối tác nhìn vào có nghĩ tôi mua xe taxi không?",
        "Xe to gần 5m2 như này đi trong phố có cồng kềnh quá không? Pin to sạc có lâu không?",
        "Hàng ghế sau có thực sự êm bằng xe Đức không?"
      ],
    },
    context: "Bác Minh được tài xế riêng đưa đến showroom VIP lounge. Bác ngồi uống trà và nhìn kỹ vào nội thất da Nappa màu nâu của chiếc VF 9 6 chỗ.",
    trainingObjective: "Rèn luyện phong thái tư vấn cao cấp, nhấn mạnh hàng ghế Captain Seat massage đa điểm, hệ thống treo khí nén chủ động và đặc quyền cứu hộ VIP 24/7.",
    targetSkills: ["Need Discovery", "Closing / Next Step", "Product Knowledge"],
    successConditions: [
      "Mời bác trải nghiệm trực tiếp tính năng massage và làm mát của hàng ghế cơ trưởng",
      "Giới thiệu chính sách đặc quyền chủ xe VF 9: Cứu hộ 24/7 miễn phí, xe cấp cứu pin lưu động, đường dây nóng riêng",
      "Tập trung vào chi phí sử dụng và độ êm ái của hệ thống treo khí nén so với Explorer dùng giảm xóc cơ"
    ],
    terminationConditions: [
      "Bác đồng ý hẹn ngày mang xe VF 9 đến tận biệt thự cho tài xế và bác trải nghiệm thử"
    ]
  },
  {
    id: "scen-04",
    title: "VF 6 — Khách hàng mua xe lần đầu cân nhắc bài toán kinh tế gia đình",
    vehicleId: "vf-6",
    vehicleModel: "VinFast VF 6 Plus",
    difficulty: "Cơ bản",
    durationMinutes: 12,
    customerPersona: {
      id: "per-04",
      name: "Bạn Trí Dũng",
      age: 29,
      occupation: "Chuyên viên Marketing Ngân hàng",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      personality: "Trẻ trung, cởi mở, thích công nghệ mới nhưng thu nhập ở mức trung bình khá, phải vay ngân hàng 50%.",
      familyProfile: "Mới cưới vợ 1 năm, chuẩn bị đón em bé đầu lòng.",
      primaryGoal: "Mua xe che nắng che mưa cho vợ con, chi phí nuôi xe hàng tháng phải rẻ nhất có thể.",
      budgetVnd: "700 - 800 triệu đồng",
      trustInitial: 60,
      interestInitial: 80,
      hiddenNeeds: [
        "Rất sợ khoản trả nợ ngân hàng hàng tháng vượt quá 8 triệu đồng",
        "Thích kiểu dáng trẻ trung và màn hình giải trí lớn để vợ xem Youtube khi đi đường dài"
      ],
      primaryObjections: [
        "Em nghe nói xe điện sau này thay pin tốn cả trăm triệu, liệu có quá sức với gia đình trẻ?",
        "Tầm tiền này bạn em bảo mua Kia Seltos hoặc Mitsubishi Xpander thực dụng hơn, phụ tùng rẻ dễ sửa."
      ],
    },
    context: "Hai vợ chồng trẻ đang dắt tay nhau vào showroom, vừa xem giá vừa thì thầm tính toán chi phí xăng cộ hàng tháng.",
    trainingObjective: "Tư vấn gói vay trả góp ưu đãi, chứng minh chi phí tiền điện chỉ bằng 1/3 tiền xăng, và bảo hành 7 năm giúp không lo chi phí sửa chữa.",
    targetSkills: ["Need Discovery", "Objection Handling", "Closing / Next Step"],
    successConditions: [
      "Đưa ra bảng tính so sánh chi phí nuôi xe điện VF 6 vs xe xăng: Tiết kiệm ~2.5 triệu/tháng",
      "Giải thích chính sách bảo hành 7 năm/160.000 km vượt trội so với 3 năm của xe xăng"
    ],
    terminationConditions: ["Chốt được lịch ký hợp đồng cọc 10 triệu để giữ ưu đãi"]
  },
  {
    id: "scen-05",
    title: "VF 3 — Tư vấn Mini e-SUV cho bạn trẻ mua xe đầu đời & so sánh xe máy",
    vehicleId: "vf-3",
    vehicleModel: "VinFast VF 3",
    difficulty: "Cơ bản",
    durationMinutes: 10,
    customerPersona: {
      id: "per-05",
      name: "Bạn Thu Trang",
      age: 24,
      occupation: "Sáng tạo nội dung (Content Creator)",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      personality: "Năng động, chuộng thời trang và phong cách sống xanh, tài chính tích lũy ban đầu vừa phải.",
      familyProfile: "Độc thân, sống cùng bố mẹ tại nhà phố có sân để xe.",
      primaryGoal: "Tìm xe ô tô nhỏ gọn cá tính đi làm hàng ngày, sạc điện tại nhà, chi phí nuôi xe rẻ như xe máy SH.",
      budgetVnd: "250 - 320 triệu đồng",
      trustInitial: 70,
      interestInitial: 90,
      hiddenNeeds: [
        "Thích màu sơn vàng nóc trắng hoặc hồng phấn cá tính để quay video",
        "Có sẵn 100 triệu, cần gói trả góp ngân hàng mỗi tháng trả dưới 3 triệu đồng",
        "Muốn sạc chậm qua đêm tại nhà bằng ổ điện dân dụng 220V"
      ],
      primaryObjections: [
        "Pin đi 215 km/lần sạc liệu có đủ cho cả tuần đi làm không em?",
        "Xe mini này leo vỉa hè hoặc đường ngập nước mùa mưa ở phố có bị chết máy không?"
      ],
    },
    context: "Bạn Trang đến showroom sau khi xem loạt video review VF 3 trên TikTok. Bạn đang ngắm nghía màu sơn vàng nóc trắng với nụ cười rạng rỡ.",
    trainingObjective: "Rèn luyện kỹ năng tư vấn dòng xe điện quốc dân VF 3, nhấn mạnh khoảng sáng gầm 191mm cao nhất phân khúc, chi phí sạc siêu rẻ 150đ/km và giải pháp sạc tại nhà 220V.",
    targetSkills: ["Need Discovery", "Product Knowledge", "Closing / Next Step"],
    successConditions: [
      "Làm rõ nhu cầu sạc qua đêm tại nhà của khách hàng",
      "Nhấn mạnh khoảng sáng gầm 191mm và khả năng lội nước vượt trội xe xăng",
      "Chốt lịch cọc 15 triệu để nhận xe theo số thứ tự ưu tiên"
    ],
    terminationConditions: ["Khách đồng ý đặt cọc màu xe yêu thích"]
  },
  {
    id: "scen-06",
    title: "VF 5 Plus — Bài toán chuyển đổi từ xe xăng chạy dịch vụ công nghệ",
    vehicleId: "vf-5",
    vehicleModel: "VinFast VF 5 Plus",
    difficulty: "Tiêu chuẩn",
    durationMinutes: 15,
    customerPersona: {
      id: "per-06",
      name: "Anh Trọng Nam",
      age: 38,
      occupation: "Tài xế xe công nghệ GrabCar",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      personality: "Thực dụng, thẳng thắn, bám sát từng đồng chi phí xăng cộ và bảo dưỡng hàng tháng.",
      familyProfile: "1 vợ và 2 con, hiện đang lái chiếc Toyota Vios số sàn đời 2018.",
      primaryGoal: "Tính toán xem nếu đổi sang VF 5 Plus chạy 5.000 km/tháng thì mỗi tháng dôi dư thêm bao nhiêu tiền cho vợ con.",
      budgetVnd: "450 - 550 triệu đồng",
      trustInitial: 50,
      interestInitial: 80,
      hiddenNeeds: [
        "Mỗi ngày chạy trung bình 180 - 200 km, tiền xăng Vios ngốn 7 - 8 triệu/tháng",
        "Có sẵn 150 triệu, cần gói vay trả góp 5 năm cố định lãi suất ưu đãi",
        "Rất quan tâm trạm sạc nhanh V-GREEN buổi trưa nghỉ ngơi ăn cơm 30 phút"
      ],
      primaryObjections: [
        "Nghe anh em bảo tiền thuê pin cộng tiền sạc điện tính ra cũng bằng tiền xăng, vậy đổi làm gì cho tốn tiền mua xe hả em?",
        "Sạc điện 30 phút giữa trưa nhỡ hết trụ sạc thì trễ giờ chạy khách cao điểm thì sao?"
      ],
    },
    context: "Anh Nam ghé showroom giờ nghỉ trưa, tay cầm sổ ghi chép chi phí đổ xăng tháng trước của chiếc Vios.",
    trainingObjective: "Trình bày bài toán kinh tế thực chiến: Tiền điện + thuê pin VF 5 chỉ ~950đ/km so với 1.600đ/km của xe xăng, tiết kiệm hơn 3.2 triệu/tháng khi chạy 5.000km.",
    targetSkills: ["Need Discovery", "Product Knowledge", "Objection Handling", "Closing / Next Step"],
    successConditions: [
      "Đưa ra bảng so sánh chi phí cụ thể: Tiết kiệm gần 40 triệu đồng tiền nhiên liệu mỗi năm",
      "Giới thiệu mạng lưới trạm sạc nhanh V-GREEN sạc 10%-70% trong 30 phút",
      "Mời lái thử trải nghiệm động cơ 134 HP êm ái hơn hẳn xe xăng"
    ],
    terminationConditions: ["Anh Nam đồng ý nộp hồ sơ thẩm định gói vay trả góp ưu đãi"]
  }
,
  {
    id: "scen-07",
    title: "VF 8 — Khách nước ngoài (Mr. David Miller: Đàm phán tiếng Anh & Thủ tục đứng tên xe)",
    vehicleId: "vf-8",
    vehicleModel: "VinFast VF 8 Plus",
    difficulty: "Nâng cao",
    durationMinutes: 15,
    customerPersona: {
      id: "per-07",
      name: "Mr. David Miller",
      age: 42,
      occupation: "Giám đốc Kỹ thuật (Expat Tech Director from California)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      personality: "Chuyên nghiệp, thẳng thắn, giao tiếp tiếng Anh, rất quan tâm thủ tục pháp lý sở hữu tài sản tại Việt Nam.",
      familyProfile: "Gia đình 4 người sống tại KĐT Vinhomes, làm việc cho tập đoàn đa quốc gia.",
      primaryGoal: "Tìm mua chiếc SUV điện thông minh chuẩn quốc tế và làm rõ thủ tục đăng ký biển số đứng tên người nước ngoài tại Việt Nam.",
      budgetVnd: "1.3 - 1.5 tỷ đồng (~$55,000 USD)",
      trustInitial: 65,
      interestInitial: 85,
      hiddenNeeds: [
        "Cần xe có hệ thống điều khiển giọng nói tiếng Anh hoàn toàn để vợ con sử dụng dễ dàng",
        "Có Thẻ tạm trú (TRC) thời hạn 3 năm và Giấy phép lao động hợp pháp",
        "Muốn kiểm tra mạng lưới trạm sạc quanh khu căn hộ cao cấp và các tuyến resort dã ngoại"
      ],
      primaryObjections: [
        "Can a foreign expat legally register and own a VinFast car in Vietnam under my own name?",
        "Does the vehicle screen and virtual assistant support 100% fluent English voice commands?"
      ],
    },
    context: "Mr. David Miller ghé showroom VinFast vào chiều thứ Bảy. Anh nói tiếng Anh lưu loát và muốn tìm hiểu dòng xe VF 8 Plus cho cả gia đình.",
    trainingObjective: "Rèn luyện kỹ năng tư vấn khách nước ngoài bằng tiếng Anh hoặc song ngữ; làm rõ thủ tục đứng tên xe (Hộ chiếu còn hạn + Thẻ tạm trú TRC từ 1 năm trở lên); giới thiệu trợ lý ảo tiếng Anh và tiêu chuẩn an toàn 5 sao NHTSA.",
    targetSkills: ["English / Bilingual Sales", "Foreigner Policy Accuracy", "Product Knowledge", "Closing / Next Step"],
    successConditions: [
      "Giải thích rõ điều kiện người nước ngoài sở hữu xe: Hộ chiếu hợp lệ + Thẻ tạm trú (TRC) còn hạn trên 1 năm",
      "Xác nhận hệ thống trợ lý ảo và màn hình 15.6 inch hỗ trợ đầy đủ tiếng Anh (English Language Pack)",
      "Mời Mr. David đăng ký lái thử xe trải nghiệm thực tế vào cuối tuần"
    ],
    terminationConditions: ["Mr. David đồng ý đặt cọc và hẹn ngày nộp hồ sơ TRC"]
  },
  {
    id: "scen-08",
    title: "VF 5 Plus — Bác tài Miền Trung (Bác Ba Nghệ An: Khẩu ngữ địa phương & Nỗi lo sạc pin)",
    vehicleId: "vf-5",
    vehicleModel: "VinFast VF 5 Plus",
    difficulty: "Tiêu chuẩn",
    durationMinutes: 12,
    customerPersona: {
      id: "per-08",
      name: "Bác Ba Nghệ An",
      age: 53,
      occupation: "Tài xế chạy tuyến Vinh - Cửa Lò - Hà Tĩnh",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      personality: "Mộc mạc, chất phác, dùng khẩu ngữ Nghệ Tĩnh (mô, tê, răng, rứa, đàng), tính toán chi li từng cuốc khách.",
      familyProfile: "Gia đình làm nông và kinh doanh dịch vụ vận tải hành khách địa phương.",
      primaryGoal: "Tìm xe điện nhỏ gọn, gầm cao, chạy bền, chi phí nạp điện rẻ hơn hẳn xe dầu/xăng.",
      budgetVnd: "450 - 500 triệu đồng",
      trustInitial: 55,
      interestInitial: 80,
      hiddenNeeds: [
        "Mỗi ngày chạy 150 - 200km đưa đón khách từ Vinh đi biển Cửa Lò và đền thờ Bác Hồ",
        "Có sẵn 140 triệu tiền gửi tiết kiệm, muốn vay ngân hàng mỗi tháng trả dưới 4 triệu",
        "Sợ xe gặp sự cố hỏng pin giữa đường cao tốc hoặc ngập nước lụt mùa mưa lũ miền Trung"
      ],
      primaryObjections: [
        "Rứa pin ni chạy có bị chai hông chú, với lỡ đang chạy giữa đàng mà hết điện thì mần răng?",
        "Nghe người ta đồn xe điện vô nước mùa lụt là chập cháy, xe ni lội nước có ổn hông?"
      ],
    },
    context: "Bác Ba ghé showroom trong bộ quần áo kaki giản dị, vừa uống nước chè vừa hỏi thăm về chiếc VF 5 Plus màu trắng.",
    trainingObjective: "Rèn luyện kỹ năng giao tiếp thấu cảm văn hóa địa phương, hiểu và phản hồi tự nhiên trước khẩu ngữ Nghệ Tĩnh; giải thích chuẩn chống nước pin IP67 (lội nước 300mm), mạng lưới sạc V-GREEN dày đặc dọc đường 72m Cửa Lò và bài toán kinh tế tiết kiệm tiền xăng.",
    targetSkills: ["Thấu cảm văn hóa địa phương", "Need Discovery", "Product Knowledge", "Objection Handling"],
    successConditions: [
      "Dùng ngôn từ gần gũi, tôn trọng và đồng cảm với thói quen ngôn ngữ của bác tài miền Trung",
      "Giải thích tiêu chuẩn pin chống nước IP67 và khả năng lội nước vượt trội xe xăng",
      "Chỉ rõ vị trí các trạm sạc trên tuyến đường bác hay chạy (Vincom Quang Trung, đường 72m Cửa Lò)",
      "Mời bác Ba lái thử một vòng ra Đại lộ Lê Nin"
    ],
    terminationConditions: ["Bác Ba ưng ý và đồng ý nộp hồ sơ vay vốn ưu đãi"]
  }
];