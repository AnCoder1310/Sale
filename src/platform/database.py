"""
Persistent Database Layer (SQLite + SQLAlchemy).
Chương (Platform Lead).
Cung cấp mô hình bảng, kết nối cơ sở dữ liệu bền vững data/app.db,
tự động tạo schema và khởi tạo dữ liệu mẫu (Seeding).
"""
import hashlib
import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from sqlalchemy import (
    Boolean,
    Column,
    Float,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

DB_PATH = Path("data/app.db")
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# =====================================================================
# MODELS
# =====================================================================

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), nullable=False)  # advisor, manager, admin
    avatar = Column(String(255), nullable=True)
    title = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    showroom = Column(String(100), nullable=True)
    status = Column(String(20), default="online")
    account_status = Column(String(20), default="active")  # active, pending, rejected
    password_hash = Column(String(128), nullable=False)
    created_at = Column(String(50), default=lambda: datetime.now().isoformat())


class PracticeSessionModel(Base):
    __tablename__ = "practice_sessions"

    session_id = Column(String(60), primary_key=True)
    scenario_id = Column(String(60), index=True, nullable=False)
    scenario_title = Column(String(200), nullable=False)
    vehicle_model = Column(String(50), nullable=False)
    advisor_id = Column(String(50), index=True, nullable=False)
    advisor_name = Column(String(100), nullable=False)
    turn_count = Column(Integer, default=1)
    trust_level = Column(Integer, default=3)
    interest_level = Column(Integer, default=3)
    conversation_stage = Column(String(30), default="opening")
    status = Column(String(30), default="active")
    revealed_facts_json = Column(Text, default="[]")
    resolved_objections_json = Column(Text, default="[]")
    created_at = Column(String(50), default=lambda: datetime.now().isoformat())
    updated_at = Column(String(50), default=lambda: datetime.now().isoformat())


class SessionMessageModel(Base):
    __tablename__ = "session_messages"

    id = Column(String(60), primary_key=True)
    session_id = Column(String(60), index=True, nullable=False)
    sender = Column(String(20), nullable=False)  # customer, advisor
    text = Column(Text, nullable=False)
    timestamp = Column(String(20), nullable=False)
    intent_detected = Column(String(100), nullable=True)


class SessionEvaluationModel(Base):
    __tablename__ = "session_evaluations"

    session_id = Column(String(60), primary_key=True)
    scenario_id = Column(String(60), nullable=False)
    scenario_title = Column(String(200), nullable=False)
    vehicle_model = Column(String(50), nullable=False)
    advisor_id = Column(String(50), index=True, nullable=False)
    advisor_name = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    duration = Column(String(30), nullable=False)
    overall_score = Column(Integer, nullable=False)
    overall_score_5 = Column(Float, nullable=False)
    passed = Column(Boolean, default=True)
    rubric_breakdown_json = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=False)
    transcript_json = Column(Text, nullable=False)
    recommended_next_practice = Column(Text, nullable=True)
    manager_reviewed = Column(Boolean, default=False)
    manager_score = Column(Integer, nullable=True)
    manager_note = Column(Text, nullable=True)
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(String(50), nullable=True)


class TelemetryEventModel(Base):
    __tablename__ = "telemetry_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_name = Column(String(100), index=True, nullable=False)
    payload_json = Column(Text, nullable=False)
    created_at = Column(String(50), default=lambda: datetime.now().isoformat())


class AssignmentModel(Base):
    __tablename__ = "training_assignments"

    id = Column(String(50), primary_key=True)
    title = Column(String(200), nullable=False)
    scenario_title = Column(String(200), nullable=False)
    target_vehicle = Column(String(50), nullable=False)
    assigned_to_advisor = Column(String(100), nullable=False)
    assigned_by_manager = Column(String(100), nullable=False)
    due_date = Column(String(30), nullable=False)
    status = Column(String(20), default="pending")
    score = Column(Integer, nullable=True)
    created_at = Column(String(50), default=lambda: datetime.now().isoformat())


# =====================================================================
# DATABASE INITIALIZATION & SEEDING
# =====================================================================

def _hash(pwd: str) -> str:
    return hashlib.sha256(pwd.encode("utf-8")).hexdigest()


def init_db():
    """Khởi tạo tất cả các bảng và seed tài khoản mặc định."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Default Users if empty
        if db.query(UserModel).count() == 0:
            default_users = [
                UserModel(
                    id="adv-001",
                    email="an.vt@vinfast.vn",
                    name="Võ Trường An",
                    phone="0912 345 678",
                    role="advisor",
                    avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                    title="Senior Sales Consultant",
                    department="Phòng Kinh Doanh Ô Tô",
                    showroom="VinFast Vinh, Nghệ An",
                    status="online",
                    account_status="active",
                    password_hash=_hash("123456"),
                    created_at="2026-01-15T08:00:00Z"
                ),
                UserModel(
                    id="mgr-001",
                    email="hoang.lv@vinfast.vn",
                    name="Lê Văn Hoàng",
                    phone="0988 765 432",
                    role="manager",
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                    title="Training Director",
                    department="Khối Đào Tạo & Phát Triển Năng Lực",
                    showroom="VinFast Vinh, Nghệ An",
                    status="online",
                    account_status="active",
                    password_hash=_hash("123456"),
                    created_at="2025-11-01T08:00:00Z"
                ),
                UserModel(
                    id="adm-001",
                    email="admin@vinfast.vn",
                    name="Hệ Thống Admin",
                    phone="0909 000 999",
                    role="admin",
                    avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                    title="System Administrator",
                    department="Khối Công Nghệ & Hạ Tầng AI",
                    showroom="Headquarters",
                    status="online",
                    account_status="active",
                    password_hash=_hash("123456"),
                    created_at="2025-10-01T08:00:00Z"
                )
            ]
            db.add_all(default_users)
            db.commit()
            logger.info("Seeded default users into SQLite database.")

        # 2. Seed Default Assignments if empty
        if db.query(AssignmentModel).count() == 0:
            default_assignments = [
                AssignmentModel(
                    id="asg-01",
                    title="Luyện tập xử lý thắc mắc Pin VF 8",
                    scenario_title="Bác tài chạy dịch vụ cân nhắc đổi từ xe xăng sang VF 5 Plus",
                    target_vehicle="VinFast VF 5 Plus",
                    assigned_to_advisor="Trần Thị Mai Anh",
                    assigned_by_manager="Lê Văn Hoàng",
                    due_date="2026-09-30",
                    status="pending"
                ),
                AssignmentModel(
                    id="asg-02",
                    title="Thuyết phục khách hàng truyền thống đi VF 9",
                    scenario_title="Khách hàng băn khoăn trạm sạc và tính năng tự lái ADAS",
                    target_vehicle="VinFast VF 9 Plus (6 chỗ)",
                    assigned_to_advisor="Võ Trường An",
                    assigned_by_manager="Lê Văn Hoàng",
                    due_date="2026-09-28",
                    status="completed",
                    score=88
                )
            ]
            db.add_all(default_assignments)
            db.commit()
            logger.info("Seeded default assignments into SQLite database.")

    finally:
        db.close()


# Tự động khởi tạo DB khi module được load
init_db()
