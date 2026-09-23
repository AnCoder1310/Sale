# VFO2O-20 Frontend — AI Sales Enablement Coach

Giao diện hệ thống cho Tư vấn viên, Quản lý đào tạo và Quản trị viên (VinFast Team P-043).

## Cấu trúc 3 Role

1. **👨‍💼 Advisor (User Experience)**:
   - Màu nhận diện: `#2563EB` (Advisor Blue), Sidebar `#0B1220`
   - Menu: Home, AI Copilot, Role-play Training, Knowledge, My Progress, History, Settings
   - Mô phỏng khách hàng đa lượt, chấm điểm 5 tiêu chí Rubric chuẩn.

2. **🛠️ Manager (Management Dashboard)**:
   - Màu nhận diện: `#10B981` (Manager Emerald)
   - Menu: Dashboard, Team, Assignments, Performance, Role-play Results (HITL Review), Reports, Settings
   - Thẩm định và hiệu chỉnh điểm số AI (Human-in-the-loop).

3. **⚙️ Admin (System Administration Dashboard)**:
   - Màu nhận diện: `#7C3AED` (Admin Violet)
   - Menu: Dashboard, Users, Roles, Knowledge Base, Vehicles, Role-play Scenarios, AI Configuration, AI Logs, Audit Logs, Settings.

## Khởi chạy

```bash
cd frontend
npm run dev
# hoặc
pnpm dev
```

Truy cập: `http://localhost:3000`

Topbar có tích hợp sẵn nút chuyển vai trò tức thì (**Advisor** / **Manager** / **Admin**) để thuận tiện trải nghiệm và demo.
