# Weekly Journal — Nhóm dự án P-043

> Ghi lại nhật ký học tập, quyết định kiến trúc, khó khăn, giải pháp và bài học kinh nghiệm qua các tuần thực hiện đồ án tốt nghiệp: **VFO2O-20 — AI Agent Huấn luyện & Hỗ trợ Tư vấn viên Bán xe (Sales Enablement)**.

## Thành viên nhóm

| Họ và tên | Mã sinh viên | Vai trò phụ trách |
|---|---|---|
| **Phạm Quốc Đạt** | 2A202602384 | Data, Knowledge Ingestion & Evaluation Benchmark Lead |
| **Nguyễn Hữu Chương** | 2A202602601 | AI Sales Copilot, Platform RAG Runtime & Roleplay Checkpoint Lead |
| **Phạm Đình Duy** | 2A202602913 | AI Customer Role-play, Turn Analyzer & Rubric Evaluator Lead |
| **Võ Trường An** | 2A20262656 | Frontend Application, UX/UI & System Integration Lead |

---

## Week 1: Định hình Sản phẩm, Khung Hợp đồng (Contracts) & Walking Skeleton

### Mục tiêu tuần này
- [x] Xác định bài toán kinh doanh cụ thể của tư vấn viên ô tô điện VinFast (Khoảng cách kiến thức và khoảng cách thực chiến).
- [x] Đóng băng hợp đồng dữ liệu Gate 1: `NormalizedDocument`, `ChunkMetadata`, `RoleplayState`, `ScenarioContract`, 5 tiêu chí Rubric.
- [x] Thiết lập kiến trúc hệ thống tổng thể kết nối FastAPI, LangGraph agent và giao diện Next.js 16.
- [x] Xây dựng thành công phiên bản Walking Skeleton chạy thông suốt từ UI tới LLM.

### Đã hoàn thành
- Bộ tài liệu thiết kế Gate 1: `PRD.md`, `BRIEF.md`, `WIREFRAME_UI_FLOW.md`, `ROLEPLAY_CONTRACT.md`.
- Mã nguồn nền tảng: FastAPI backend (`src/main.py`), Pydantic Settings, khung `RoleplayState` và `contracts.py`.
- Bộ khung Frontend: Next.js 16, Tailwind CSS, Route Guard, cấu trúc Topbar & Sidebar cho 3 đối tượng (Advisor, Manager, Admin).
- Kho dữ liệu mẫu Gate 1 với 9 tài liệu và 3 kịch bản luyện tập đầu tiên.

### Khó khăn & Giải pháp
| Khó khăn | Giải pháp | Kết quả |
|---|---|---|
| Nguy cơ lộ thông tin ẩn (hidden facts) của khách hàng cho tư vấn viên xem trước trên giao diện. | Tách bạch 2 hàm context trong `RoleplayState`: `advisor_visible_context()` (chỉ gửi dữ liệu công khai) và `customer_prompt_context()` (chỉ chạy ở phía server). | Viết bộ test `test_customer_prompt_does_not_leak_unrevealed_hidden_facts` đạt 100% pass, đảm bảo tính bảo mật của phòng luyện tập. |
| Sự không đồng nhất giữa định dạng dữ liệu của các thành viên (Data vs Backend vs Frontend). | Duy và Đạt thống nhất sử dụng Pydantic v2 để validate toàn bộ schemas ngay từ Gate 1. | Mọi thay đổi dữ liệu đều được kiểm tra tự động, không còn xung đột định dạng trường. |

### Bài học kinh nghiệm
- **"Contract First" là chìa khóa:** Việc thống nhất schemas và API contracts trước khi bắt tay viết code giúp 4 thành viên có thể làm việc song song độc lập mà không bị phụ thuộc lẫn nhau.
- **Fail gracefully:** Luôn thiết kế fallback cho LLM để hệ thống không bao giờ bị gián đoạn khi mạng chập chờn hoặc API bên thứ ba quá tải.

---

## Week 2: Xây Dựng Core AI — RAG Copilot Đa Tầng & AI Customer Thích Ứng

### Mục tiêu tuần này
- [x] Xây dựng tầng kiến thức RAG: Chunking thông minh, nhúng vector và tìm kiếm kết hợp Hybrid Search (Cosine + Từ khóa).
- [x] Xây dựng bộ điều phối AI Copilot với Intent Router, Citation Validator và Hàng rào an toàn (Guardrails).
- [x] Phát triển tác tử khách hàng `CustomerAgent` và bộ phân tích lượt thoại `TurnAnalyzer`.
- [x] Tích hợp tính năng nhận diện khẩu ngữ vùng miền (Nghệ Tĩnh, Nam Bộ) giúp tư vấn viên làm quen với nhiều đối tượng khách hàng.

### Đã hoàn thành
- Pipeline RAG hoàn chỉnh: `src/knowledge/chunking.py`, `vector_store.py`, `retrieval_service.py`.
- Tác tử Copilot theo mô hình StateGraph: `src/copilot/graph.py`, `answer_generator.py`, `citation_validator.py`.
- Động cơ diễn tập Role-play: `src/roleplay/customer_agent.py`, `src/roleplay/turn_analyzer.py`.
- Giao diện phòng luyện tập thực chiến hỗ trợ chat tương tác, chỉ số cảm xúc khách hàng thời gian thực và nhập liệu giọng nói (Voice Input).

### Khó khăn & Giải pháp
| Khó khăn | Giải pháp | Kết quả |
|---|---|---|
| Rủi ro AI Copilot trích dẫn các chính sách bán hàng hoặc bảng giá đã hết hạn trong quá khứ. | Chương thiết kế module `PolicyVersioningManager`: kiểm tra cờ `status == expired` và đối chiếu ngày `effective_date`/`expiry_date` trước khi đưa vào ngữ cảnh LLM. | Loại trừ hoàn toàn rủi ro trích dẫn chính sách cũ, đảm bảo tính pháp lý chính xác cho tư vấn viên. |
| Khách hàng mô phỏng dễ bị "xuôi lòng" quá sớm hoặc nói ra thông tin bí mật khi sales chưa hỏi trúng. | Duy xây dựng `TurnAnalyzer` với cơ chế tính điểm biến thiên `trust_delta` và chỉ kích hoạt `DisclosureRule` khi khớp từ khóa nhu cầu thực sự. | Hội thoại bán hàng diễn ra tự nhiên, chân thực và có độ thử thách kỹ năng cao. |

### Bài học kinh nghiệm
- **RAG không chỉ là vector search:** Cần kết hợp lọc metadata theo thời gian (temporal filtering) và kiểm tra tính hợp lệ của văn bản thì câu trả lời mới đạt chuẩn ứng dụng doanh nghiệp.
- **Khẩu ngữ địa phương mang lại giá trị thực tế cao:** Việc hỗ trợ dịch nghĩa từ ngữ Nghệ Tĩnh giúp mô hình hóa được bối cảnh showroom các tỉnh miền Trung chân thực hơn rất nhiều so với kịch bản văn phòng tiêu chuẩn.

---

## Week 3: Chu Trình Đào Tạo Hoàn Chỉnh — Chấm Điểm Rubric, Quản Lý HITL & Benchmark Tốt Nghiệp

### Mục tiêu tuần này
- [x] Hoàn thiện hệ thống chấm điểm tự động `SessionEvaluator` theo 5 tiêu chí Rubric chuẩn của ngành bán xe.
- [x] Xây dựng phân hệ Quản lý Đào tạo (Training Manager) hỗ trợ xem lại transcript, điều chỉnh điểm số (HITL) và giao bài tập.
- [x] Mở rộng kho tri thức lên 19 văn bản chính thức và 8 kịch bản tình huống đa dạng.
- [x] Xây dựng bộ công cụ đo lường và đánh giá toàn diện (Comprehensive Benchmark Suite) để kiểm định chất lượng đồ án tốt nghiệp.

### Đã hoàn thành
- Bộ đánh giá 5 tiêu chí: `src/roleplay/evaluator.py` trích dẫn chứng cứ transcript, xuất ra điểm số 1-5 và 1-100 kèm lời khuyên cải thiện.
- Phân hệ Quản lý HITL: `src/services/manager_service.py`, `frontend/src/components/manager/ManagerDashboardView.tsx`, `HITLReviewModal.tsx`.
- Pipeline nạp và kiểm tra dữ liệu: `src/knowledge/ingestion.py`, `scripts/ingestion/build_corpus.py`.
- Bộ benchmark 4 thành phần: `eval/copilot_eval`, `eval/retrieval_eval`, `eval/roleplay_eval`, `eval/judge_eval`, `eval/runner.py`.
- Báo cáo đánh giá chính thức phục vụ bảo vệ đồ án tốt nghiệp: `eval/results/report.md` và `eval/reports/latest.json`.

### Khó khăn & Giải pháp
| Khó khăn | Giải pháp | Kết quả |
|---|---|---|
| Sự chênh lệch điểm số giữa AI chấm và Giám khảo con người (Chuyên gia đào tạo) trong giai đoạn đầu. | Đạt và Duy tiến hành hiệu chuẩn (calibration) trên 10 bộ transcript thực tế, bổ sung định nghĩa và bằng chứng cụ thể cho từng mức điểm 1 đến 5. | Giảm sai số tuyệt đối trung bình (MAE) xuống chỉ còn **0.24**, tỷ lệ đồng thuận trong khoảng ±1 đạt **94.0%**. |
| Nguy cơ deadlock khi gọi coroutine bất đồng bộ từ các endpoint trong quá trình chạy test song song. | Chuẩn hóa tất cả các hàm dịch vụ (`create_session`, `finish_session`) sang `async def` và dùng `await` nhất quán từ controller FastAPI. | Toàn bộ 31 test cases chạy mượt mà trong **0.06 giây**, không xảy ra bất kỳ hiện tượng nghẽn luồng nào. |

### Bài học kinh nghiệm & Đánh giá Đồ án
- **Chu trình khép kín tạo nên giá trị:** Sự kết hợp nhịp nhàng giữa Tư vấn viên (Thực hành) -> AI Coach (Chấm sơ bộ và gợi ý) -> Quản lý (Phê duyệt và định hướng) giải quyết triệt để bài toán quá tải đào tạo tại các đại lý ô tô.
- **Sẵn sàng bảo vệ tốt nghiệp:** Dự án đạt tiêu chuẩn kỹ thuật cao, mã nguồn mô-đun hóa sạch sẽ, có hệ thống kiểm thử tự động và báo cáo định lượng minh bạch.
