-- =====================================================================
-- VINFAST AI SALES ENABLEMENT COACH (PROJECT VFO2O-20)
-- RELATIONAL DATABASE SCHEMA DEFINITION (SQL DDL)
-- Target RDBMS: SQLite 3 / PostgreSQL Compatible
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- 1. TABLE: users
-- Lưu trữ tài khoản người dùng: Tư vấn viên, Quản lý đào tạo, Admin
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK(role IN ('advisor', 'manager', 'admin', 'pending')),
    avatar VARCHAR(255),
    title VARCHAR(100),
    department VARCHAR(100),
    showroom VARCHAR(100),
    status VARCHAR(20) DEFAULT 'online',
    account_status VARCHAR(20) DEFAULT 'active' CHECK(account_status IN ('active', 'pending', 'rejected')),
    password_hash VARCHAR(128) NOT NULL,
    created_at VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ---------------------------------------------------------------------
-- 2. TABLE: practice_sessions
-- Lưu trữ phiên luyện tập đàm thoại bán xe đa lượt với AI Customer
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_sessions (
    session_id VARCHAR(60) PRIMARY KEY,
    scenario_id VARCHAR(60) NOT NULL,
    scenario_title VARCHAR(200) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    advisor_id VARCHAR(50) NOT NULL,
    advisor_name VARCHAR(100) NOT NULL,
    turn_count INTEGER DEFAULT 1,
    trust_level INTEGER DEFAULT 3 CHECK(trust_level BETWEEN 1 AND 5),
    interest_level INTEGER DEFAULT 3 CHECK(interest_level BETWEEN 1 AND 5),
    conversation_stage VARCHAR(30) DEFAULT 'opening',
    status VARCHAR(30) DEFAULT 'active',
    revealed_facts_json TEXT DEFAULT '[]',
    resolved_objections_json TEXT DEFAULT '[]',
    created_at VARCHAR(50) NOT NULL,
    updated_at VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_practice_advisor_id ON practice_sessions(advisor_id);
CREATE INDEX IF NOT EXISTS idx_practice_scenario_id ON practice_sessions(scenario_id);

-- ---------------------------------------------------------------------
-- 3. TABLE: session_messages
-- Lưu trữ biên bản hội thoại chi tiết từng câu nói của khách và sales
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_messages (
    id VARCHAR(60) PRIMARY KEY,
    session_id VARCHAR(60) NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK(sender IN ('customer', 'advisor')),
    text TEXT NOT NULL,
    timestamp VARCHAR(20) NOT NULL,
    intent_detected VARCHAR(100),
    FOREIGN KEY(session_id) REFERENCES practice_sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON session_messages(session_id);

-- ---------------------------------------------------------------------
-- 4. TABLE: session_evaluations
-- Báo cáo chấm điểm Rubric 5 tiêu chí tự động và kết quả duyệt HITL
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_evaluations (
    session_id VARCHAR(60) PRIMARY KEY,
    scenario_id VARCHAR(60) NOT NULL,
    scenario_title VARCHAR(200) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    advisor_id VARCHAR(50) NOT NULL,
    advisor_name VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL,
    duration VARCHAR(30) NOT NULL,
    overall_score INTEGER NOT NULL CHECK(overall_score BETWEEN 0 AND 100),
    overall_score_5 REAL NOT NULL CHECK(overall_score_5 BETWEEN 1.0 AND 5.0),
    passed BOOLEAN DEFAULT 1,
    rubric_breakdown_json TEXT NOT NULL,
    ai_summary TEXT NOT NULL,
    transcript_json TEXT NOT NULL,
    recommended_next_practice TEXT,
    manager_reviewed BOOLEAN DEFAULT 0,
    manager_score INTEGER,
    manager_note TEXT,
    reviewed_by VARCHAR(100),
    reviewed_at VARCHAR(50),
    FOREIGN KEY(session_id) REFERENCES practice_sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_eval_advisor_id ON session_evaluations(advisor_id);
CREATE INDEX IF NOT EXISTS idx_eval_manager_reviewed ON session_evaluations(manager_reviewed);

-- ---------------------------------------------------------------------
-- 5. TABLE: telemetry_events
-- Nhật ký sự kiện tương tác người dùng, độ trễ và truy vấn hệ thống
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS telemetry_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name VARCHAR(100) NOT NULL,
    payload_json TEXT NOT NULL,
    created_at VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_event_name ON telemetry_events(event_name);

-- ---------------------------------------------------------------------
-- 6. TABLE: training_assignments
-- Danh sách nhiệm vụ huấn luyện do Quản lý đào tạo chỉ định
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    scenario_title VARCHAR(200) NOT NULL,
    target_vehicle VARCHAR(50) NOT NULL,
    assigned_to_advisor VARCHAR(100) NOT NULL,
    assigned_by_manager VARCHAR(100) NOT NULL,
    due_date VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'overdue')),
    score INTEGER,
    created_at VARCHAR(50) NOT NULL
);

-- =====================================================================
-- SEED INITIAL CORE USERS (MẬT KHẨU MẶC ĐỊNH: 123456)
-- Hash: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
-- =====================================================================
INSERT OR IGNORE INTO users (id, email, name, phone, role, avatar, title, department, showroom, status, account_status, password_hash, created_at)
VALUES 
('adv-001', 'an.vt@vinfast.vn', 'Võ Trường An', '0912 345 678', 'advisor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Senior Sales Consultant', 'Phòng Kinh Doanh Ô Tô', 'VinFast Vinh, Nghệ An', 'online', 'active', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2026-01-15T08:00:00Z'),
('mgr-001', 'hoang.lv@vinfast.vn', 'Lê Văn Hoàng', '0988 765 432', 'manager', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 'Training Director', 'Khối Đào Tạo & Phát Triển Năng Lực', 'VinFast Vinh, Nghệ An', 'online', 'active', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2025-11-01T08:00:00Z'),
('adm-001', 'admin@vinfast.vn', 'Hệ Thống Admin', '0909 000 999', 'admin', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 'System Administrator', 'Khối Công Nghệ & Hạ Tầng AI', 'Headquarters', 'online', 'active', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2025-10-01T08:00:00Z');

-- =====================================================================
-- SEED INITIAL ASSIGNMENTS
-- =====================================================================
INSERT OR IGNORE INTO training_assignments (id, title, scenario_title, target_vehicle, assigned_to_advisor, assigned_by_manager, due_date, status, score, created_at)
VALUES
('asg-01', 'Luyện tập xử lý thắc mắc Pin VF 8', 'Bác tài chạy dịch vụ cân nhắc đổi từ xe xăng sang VF 5 Plus', 'VinFast VF 5 Plus', 'Trần Thị Mai Anh', 'Lê Văn Hoàng', '2026-09-30', 'pending', NULL, '2026-09-20T08:00:00Z'),
('asg-02', 'Thuyết phục khách hàng truyền thống đi VF 9', 'Khách hàng băn khoăn trạm sạc và tính năng tự lái ADAS', 'VinFast VF 9 Plus (6 chỗ)', 'Võ Trường An', 'Lê Văn Hoàng', '2026-09-28', 'completed', 88, '2026-09-18T08:00:00Z');
