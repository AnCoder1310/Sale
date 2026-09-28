# Worklog — Nhóm dự án P-043

> Ghi lại tiến độ và nhật ký công việc hằng ngày của các thành viên phục vụ Đồ án tốt nghiệp: **VFO2O-20 — AI Agent Huấn luyện & Hỗ trợ Tư vấn viên Bán xe (Sales Enablement)**.

## Thành viên nhóm

| Họ và tên | Mã sinh viên | Vai trò phụ trách |
|---|---|---|
| **Phạm Quốc Đạt** | 2A202602384 | Data, Knowledge Ingestion & Evaluation Benchmark Lead |
| **Nguyễn Hữu Chương** | 2A202602601 | AI Sales Copilot, Platform RAG Runtime & Roleplay Checkpoint Lead |
| **Phạm Đình Duy** | 2A202602913 | AI Customer Role-play, Turn Analyzer & Rubric Evaluator Lead |
| **Võ Trường An** | 2A20262656 | Frontend Application, UX/UI & System Integration Lead |

---

## 2026-09-21 (Milestone: Gate 1 Kickoff & Product Framing)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Phạm Đình Duy** | Thống nhất cấu trúc kịch bản hội thoại bán xe, quy tắc phản ứng thích ứng và dự thảo 5 tiêu chí Rubric | ✅ Done | `docs/gate1/ROLEPLAY_CONTRACT.md` & `docs/gate1/BRIEF.md` | 6.5h |
| **Nguyễn Hữu Chương** | Thiết lập kiến trúc hệ thống, API contracts giữa Frontend - Backend, cấu hình FastAPI | ✅ Done | `docs/architecture_diagram.md` & API schema contracts | 6.0h |
| **Phạm Quốc Đạt** | Thiết kế hợp đồng dữ liệu tri thức `NormalizedDocument`, `ChunkMetadata` và metadata validation | ✅ Done | `src/knowledge/metadata.py` & format dữ liệu thô | 6.5h |
| **Võ Trường An** | Khảo sát quy trình nghiệp vụ tư vấn viên VinFast, phác thảo User Journey và Wireframe luồng tương tác | ✅ Done | `docs/gate1/WIREFRAME_UI_FLOW.md` & `docs/gate1/PRD.md` | 7.0h |

**Tổng kết ngày:** Toàn đội hoàn thành định hình bài toán Gate 1, chốt các hợp đồng giao tiếp (Contracts Freeze) và khung kiến trúc tổng thể.

---

## 2026-09-22 (Milestone: Contract Freeze & Walking Skeleton Architecture)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Phạm Quốc Đạt** | Chuẩn hóa bộ dữ liệu tri thức Gate 1 và 3 kịch bản luyện tập mẫu theo chuẩn Pydantic | ✅ Done | `data/knowledge/corpus.json` & `data/scenarios/scenarios.json` | 6.0h |
| **Nguyễn Hữu Chương** | Xây dựng khung FastAPI RESTful routes, middleware CORS và cấu hình Pydantic Settings | ✅ Done | `src/main.py`, `src/config.py`, `src/api/routes.py` | 6.5h |
| **Phạm Đình Duy** | Cụ thể hóa trạng thái nghiệp vụ `RoleplayState` và các quy tắc bảo vệ thông tin ẩn | ✅ Done | `src/roleplay/state.py` & `src/roleplay/contracts.py` | 7.0h |
| **Võ Trường An** | Khởi tạo dự án Next.js 16, cài đặt Tailwind CSS, cấu hình Routing và Client Providers | ✅ Done | `frontend/src/app/`, `frontend/src/components/layout/` | 6.5h |

**Tổng kết ngày:** Đóng băng Gate 1 thành công (Contract Freeze). Toàn bộ hợp đồng dữ liệu và các unit test ban đầu đạt 100% pass.

---

## 2026-09-23 (Milestone: Walking Skeleton E2E & Knowledge Core)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Nguyễn Hữu Chương** | Xây dựng dịch vụ trích xuất vector `InMemoryVectorStore` và `EmbeddingService` | ✅ Done | `src/knowledge/vector_store.py`, `src/knowledge/embeddings.py` | 7.0h |
| **Phạm Đình Duy** | Xây dựng bộ điều phối phiên `RoleplayGraph` kết nối checkpoint và persistence | ✅ Done | `src/roleplay/graph.py`, `src/roleplay/checkpoint.py` | 6.5h |
| **Phạm Quốc Đạt** | Viết bộ kiểm thử dữ liệu `test_contracts.py` và script kiểm tra metadata tài liệu | ✅ Done | `tests/test_roleplay/test_contracts.py` | 6.0h |
| **Võ Trường An** | Xây dựng giao diện Workspace của Tư vấn viên: Copilot Chat và màn hình danh sách Kịch bản | ✅ Done | `frontend/src/components/advisor/CopilotView.tsx`, `RoleplayView.tsx` | 7.5h |

**Tổng kết ngày:** Kết nối thông suốt luồng từ Frontend Next.js tới Backend FastAPI và trả về phản hồi đầu tiên từ LLM.

---

## 2026-09-24 (Milestone: Copilot RAG & Multi-Turn Roleplay Integration)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Nguyễn Hữu Chương** | Xây dựng bộ phân loại ý định `intent_router.py`, bộ rerank và xác thực trích dẫn `citation_validator.py` | ✅ Done | `src/copilot/`, `src/services/copilot_service.py` | 7.0h |
| **Phạm Đình Duy** | Cài đặt `TurnAnalyzer` bóc tách intent, phát hiện từ khóa hé lộ nhu cầu ẩn và tính toán Trust Level | ✅ Done | `src/roleplay/turn_analyzer.py` | 7.0h |
| **Phạm Quốc Đạt** | Bổ sung từ điển khẩu ngữ vùng miền `regional_dialects.json` (Nghệ Tĩnh, Nam Bộ) vào kho dữ liệu | ✅ Done | `data/knowledge/regional_dialects.json`, `src/services/dialect_service.py` | 6.0h |
| **Võ Trường An** | Hoàn thiện Phòng luyện tập thực chiến `PracticeRoomView`: hiển thị tin nhắn, trust/interest bar, voice input | ✅ Done | `frontend/src/components/advisor/PracticeRoomView.tsx` | 8.0h |

**Tổng kết ngày:** Hoàn thiện tính năng Copilot hỏi đáp có trích dẫn và phòng luyện tập tương tác đa lượt có đo lường cảm xúc khách hàng.

---

## 2026-09-25 (Milestone: Ingestion Pipeline & Adaptive Customer Intelligence)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Phạm Quốc Đạt** | Xây dựng bộ công cụ nạp dữ liệu tri thức tự động: chuẩn hóa, khử trùng lặp và build corpus | ✅ Done | `src/knowledge/ingestion.py`, `scripts/ingestion/` | 7.0h |
| **Phạm Đình Duy** | Hoàn thiện tác tử khách hàng `CustomerAgent` mô phỏng chân dung khách hàng thích ứng theo 6 persona | ✅ Done | `src/roleplay/customer_agent.py`, `src/roleplay/prompts/` | 7.5h |
| **Nguyễn Hữu Chương** | Xây dựng giải thuật lọc văn bản hết hạn `PolicyVersioningManager` và hàng rào an toàn `guardrails.py` | ✅ Done | `src/knowledge/policy_versioning.py`, `src/copilot/guardrails.py` | 6.5h |
| **Võ Trường An** | Xây dựng trang kết quả đánh giá `SessionResultView` thể hiện biểu đồ 5 tiêu chí Rubric và chi tiết bằng chứng | ✅ Done | `frontend/src/components/advisor/SessionResultView.tsx` | 7.0h |

**Tổng kết ngày:** Dữ liệu tri thức tự động hóa nạp thành công; AI Customer phản ứng thông minh theo mức độ đồng cảm và thuyết phục của sales.

---

## 2026-09-26 (Milestone: Rubric Evaluator & Manager HITL Portal)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Phạm Đình Duy** | Hoàn thiện công cụ chấm điểm tự động `SessionEvaluator` theo 5 tiêu chí Rubric với trích dẫn evidence | ✅ Done | `src/roleplay/evaluator.py`, `src/services/practice_service.py` | 7.5h |
| **Nguyễn Hữu Chương** | Hoàn thiện API duyệt điểm của Quản lý đào tạo (Human-in-the-Loop) và lưu trữ checkpoint | ✅ Done | `src/roleplay/persistence.py`, `src/services/manager_service.py` | 6.5h |
| **Phạm Quốc Đạt** | Mở rộng kho tri thức lên 19 văn bản chính thức (VF 3 đến VF 9, pin, sạc, trước bạ, đối đầu xe xăng) | ✅ Done | `data/knowledge/corpus.json`, `data/scenarios/expanded_scenarios.json` | 8.0h |
| **Võ Trường An** | Xây dựng giao diện Quản lý Đào tạo `ManagerDashboardView`, modal duyệt điểm HITL và giao việc đào tạo | ✅ Done | `frontend/src/components/manager/`, `frontend/src/app/manager/page.tsx` | 7.5h |

**Tổng kết ngày:** Khép kín chu trình huấn luyện bán xe: Luyện tập -> Kết thúc -> AI Chấm điểm -> Quản lý phê duyệt (HITL).

---

## 2026-09-27 (Milestone: Comprehensive Benchmark Suite & Graduation Thesis Defense Readiness)

| Thành viên | Nhiệm vụ thực hiện | Trạng thái | Sản phẩm đầu ra | Thời gian |
|---|---|---|---|---|
| **Phạm Quốc Đạt** | Xây dựng bộ đo lường và 4 benchmark runners (Copilot 25 câu, Retrieval 18 câu, Roleplay 8 kịch bản, Judge 10 cases) | ✅ Done | `eval/`, `eval/runner.py`, `eval/results/report.md` | 8.0h |
| **Nguyễn Hữu Chương** | Tối ưu hóa độ trễ Copilot RAG (< 0.6ms), đồng bộ hoàn toàn giữa async FastAPI và graph execution | ✅ Done | `src/copilot/graph.py`, `src/knowledge/retrieval_service.py` | 7.0h |
| **Phạm Đình Duy** | Tinh chỉnh thuật toán nhận diện từ khóa mở rộng cho `TurnAnalyzer` và hiệu chuẩn MAE đạt 0.24 | ✅ Done | `src/roleplay/turn_analyzer.py`, `eval/judge_eval/run.py` | 7.0h |
| **Võ Trường An** | Hoàn thiện phân hệ Admin Console, tối ưu trải nghiệm Responsive toàn bộ hệ thống và tài liệu tốt nghiệp | ✅ Done | `frontend/src/components/admin/`, `WORKLOG.md`, `JOURNAL.md` | 7.5h |

**Tổng kết ngày:** Toàn bộ 31 test cases và 4 bộ benchmark đều đạt 100% PASS. Báo cáo đánh giá và hồ sơ đồ án tốt nghiệp sẵn sàng cho buổi bảo vệ.
