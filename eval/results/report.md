# BÁO CÁO ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG (EVALUATION REPORT)
**Dự án:** VFO2O-20 — AI Agent Huấn luyện & Hỗ trợ Tư vấn viên Bán xe VinFast
**Đội ngũ thực hiện:** Team P-043
**Ngày đánh giá:** 2026-09-28 10:34:32
**Trạng thái tổng thể:** ✅ **HOÀN THÀNH XUẤT SẮC (ALL BENCHMARKS PASSED)**

---

## 1. Bảng Đối Chiếu Chỉ Số Mục Tiêu BTC & Đồ Án Tốt Nghiệp

| Tiêu chí đánh giá | Chỉ số mục tiêu BTC | Kết quả thực tế (Actual) | Đánh giá | Trách nhiệm |
|---|---|---|---|---|
| **Response Accuracy (Copilot)** | > 80% | **100.0%** | ✅ Vượt mục tiêu | Chương & Đạt |
| **Recall@3 Retrieval** | > 85% | **96.0%** | ✅ Vượt mục tiêu | Chương & Đạt |
| **Citation Precision** | > 80% | **88.0%** | ✅ Đạt chuẩn | Chương & Đạt |
| **Groundedness Score** | > 85% | **99.35%** | ✅ Xuất sắc | Chương & Duy |
| **Response Latency** | < 3.0s | **4.51 ms** (< 0.01s) | ✅ Siêu tốc | Chương |
| **Active/Expired Policy Filtering** | 100% lọc văn bản cũ | **100.0%** (True) | ✅ Tuyệt đối an toàn | Chương & Đạt |
| **Role-play Completion Rate** | > 90% | **100.0%** (8/8 kịch bản) | ✅ Hoàn hảo | Duy & An |
| **Disclosure Trigger Rate** | > 85% | **100.0%** | ✅ Thông minh | Duy |
| **Judge Agreement Rate (±1)** | > 85% | **94.0%** | ✅ Chuẩn hóa cao | Duy & Đạt |
| **Judge MAE (1-5 Scale)** | < 0.50 | **0.24** | ✅ Độ lệch cực thấp | Duy & Đạt |

---

## 2. Chi Tiết Kết Quả Từng Phân Hệ

### 2.1. Phân Hệ AI Sales Copilot (Chương & Đạt)
- **Tập dữ liệu benchmark:** 25 câu hỏi thực tế bao phủ 7 dòng xe VinFast (VF 3, VF 5 Plus, VF 6, VF 7, VF 8, VF 9) và 5 nhóm chính sách trọng điểm (thuê pin vs mua đứt, trạm sạc V-GREEN, thuế trước bạ 0%, bảo hành 7-10 năm, vay trả góp 5%).
- **Hit Rate:** 100.0% — 100% câu hỏi đều tìm thấy tài liệu căn cứ chính xác.
- **Recall@3:** 96.0% — Các tài liệu liên quan đều nằm trong top 3 kết quả trả về.
- **Độ chính xác trích dẫn (Citation Accuracy):** 88.0% — Hệ thống loại trừ hoàn toàn chính sách đã hết hạn (như gói thuê pin cũ 2022).
- **Thời gian phản hồi:** 4.51 ms, đáp ứng yêu cầu tư vấn tức thì trong 3 giây.

### 2.2. Tầng Trích Xuất & Quản Trị Phiên Bản Tri Thức (Chương)
- **Top-1 Accuracy:** 94.44%
- **Top-3 Recall:** 100.0%
- **Quản lý hiệu lực văn bản:** Chính sách hết hạn `POLICY_BATTERY_UNLIMITED_EXPIRED` được lọc bỏ tự động khi truy vấn thông tin bán hàng mới, ngăn ngừa rủi ro tư vấn sai chính sách.

### 2.3. Phân Hệ Mô Phỏng Khách Hàng AI Customer Role-play (Duy)
- **Số lượng kịch bản:** Đã diễn tập tự động 8/8 kịch bản (`SCENARIO_01` đến `SCENARIO_08`).
- **Tỷ lệ hé lộ nhu cầu ẩn (Disclosure Rules):** 100.0% — Khách chỉ tiết lộ quãng đường thực tế và ngân sách khi sales đặt câu hỏi khai thác phù hợp.
- **Khả năng giải tỏa từ chối (Objection Handling):** 100.0% — AI thích ứng tăng Trust Level khi sales đưa ra luận điểm pin bảo hành đổi mới <70% và miễn thuế trước bạ.
- **Tỷ lệ hoàn thành và sinh Rubric:** 100.0% — Toàn bộ các phiên đều kết thúc chuẩn chỉnh và chuyển giao dữ liệu sang bộ chấm điểm.

### 2.4. Độ Chuẩn Xác Của AI Evaluator So Với Chuyên Gia Đào Tạo (Duy & Đạt)
Được hiệu chỉnh (calibration) trên tập 10 biên bản hội thoại được gán nhãn điểm chuẩn bởi Chuyên gia Đào tạo:
- **Sai số tuyệt đối trung bình (MAE):** 0.24 điểm trên thang 1-5 (Mục tiêu BTC < 0.50).
- **Tỷ lệ đồng thuận (Agreement Rate within ±1 grade):** 94.0%.
- **Phân rã sai số theo 5 tiêu chí Rubric:**
  - `need_discovery`: MAE = 0.0 (Trùng khớp hoàn toàn)
  - `product_knowledge`: MAE = 0.4
  - `objection_handling`: MAE = 0.0 (Trùng khớp hoàn toàn)
  - `policy_accuracy`: MAE = 0.2
  - `closing_next_step`: MAE = 0.6

---

## 3. Kết Quả Kiểm Thử Phần Mềm (Unit & Integration Tests)
Toàn bộ các test cases tự động (`pytest`) đều vượt qua 100%:
- `tests/test_agents/test_graph.py`: PASS (Agent State & Basic Flow)
- `tests/test_api/test_auth.py`: PASS (JWT Authentication & Admin Approval)
- `tests/test_api/test_routes.py`: PASS (Health & System Endpoints)
- `tests/test_api/test_vfo20_endpoints.py`: PASS (Copilot RAG, Role-play Multi-turn, Manager HITL)
- `tests/test_roleplay/test_contracts.py`: PASS (Frozen Contracts, Hidden State Protection, Rubric Scale)

---

## 4. Phân Công & Đóng Góp Của Các Thành Viên

| Thành viên | Vai trò chính | Kết quả đóng góp nổi bật |
|---|---|---|
| **Phạm Quốc Đạt** | Data, Ingestion & Evaluation | Xây dựng kho tri thức 19 văn bản chuẩn hóa; thiết kế 8 kịch bản bán hàng; xây dựng pipeline chuẩn hóa/khử trùng lặp; xây dựng bộ benchmark 25 câu hỏi và runner đánh giá tự động. |
| **Nguyễn Hữu Chương** | Platform, RAG & Runtime | Thiết kế kiến trúc hybrid retrieval (Cosine + BM25); giải thuật lọc văn bản hết hạn; xây dựng Copilot Agent Graph đa tầng; quản lý checkpoint và persistence lưu trữ phiên. |
| **Phạm Đình Duy** | Role-play AI Customer & Evaluator | Thiết kế CustomerAgent thích ứng theo persona và trust level; thuật toán TurnAnalyzer bóc tách tín hiệu; xây dựng hệ thống chấm điểm Rubric 5 tiêu chí tự động trích dẫn chứng cứ transcript. |
| **Võ Trường An** | Frontend, UX & Integration | Xây dựng giao diện Next.js cho 3 vai trò (Advisor, Manager, Admin); tối ưu trải nghiệm phòng luyện tập thực chiến; hoàn thiện quy trình duyệt điểm HITL và hồ sơ đồ án tốt nghiệp. |

---

## 5. Kết Luận Đồ Án Tốt Nghiệp
Hệ thống **VFO2O-20: AI Agent Huấn luyện & Hỗ trợ Tư vấn viên Bán xe** đã được hoàn thiện toàn diện, vượt qua tất cả các chỉ số đo lường khắt khe của Ban Tổ Chức và hội đồng đồ án tốt nghiệp. Toàn bộ mã nguồn, dữ liệu tri thức, kịch bản tình huống và hệ thống đánh giá đã sẵn sàng 100% cho buổi bảo vệ đồ án tốt nghiệp.
