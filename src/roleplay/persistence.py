"""
Roleplay Persistence & Storage Layer with SQLite Backend.
Chương (Platform, RAG & Runtime).
Đảm bảo mọi phiên luyện tập, tin nhắn lịch sử và kết quả đánh giá tồn tại vĩnh viễn trên đĩa.
"""
import copy
from datetime import datetime
import json
import logging
from typing import Any, Dict, List, Optional

from src.platform.database import (
    PracticeSessionModel,
    SessionEvaluationModel,
    SessionLocal,
    SessionMessageModel,
)

logger = logging.getLogger(__name__)


class SessionPersistence:
    """Kho lưu trữ phiên luyện tập và kết quả đánh giá backed by SQLite."""

    def __init__(self):
        self._sessions: Dict[str, Dict[str, Any]] = {}
        self._results: Dict[str, Dict[str, Any]] = {}
        self._pending_reviews: List[Dict[str, Any]] = []
        self._load_from_db()

    def _load_from_db(self):
        """Khôi phục dữ liệu đã lưu từ database SQLite."""
        db = SessionLocal()
        try:
            # 1. Load Sessions
            sessions = db.query(PracticeSessionModel).all()
            for s in sessions:
                messages = (
                    db.query(SessionMessageModel)
                    .filter(SessionMessageModel.session_id == s.session_id)
                    .order_by(SessionMessageModel.timestamp.asc())
                    .all()
                )
                msg_list = [
                    {
                        "id": m.id,
                        "sender": m.sender,
                        "text": m.text,
                        "timestamp": m.timestamp,
                        "intentDetected": m.intent_detected
                    }
                    for m in messages
                ]
                self._sessions[s.session_id] = {
                    "session_id": s.session_id,
                    "scenario_id": s.scenario_id,
                    "scenario_title": s.scenario_title,
                    "vehicle_model": s.vehicle_model,
                    "advisor_id": s.advisor_id,
                    "advisor_name": s.advisor_name,
                    "turn_count": s.turn_count,
                    "trust_level": s.trust_level,
                    "interest_level": s.interest_level,
                    "conversation_stage": s.conversation_stage,
                    "status": s.status,
                    "revealed_facts": json.loads(s.revealed_facts_json or "[]"),
                    "resolved_objections": json.loads(s.resolved_objections_json or "[]"),
                    "created_at": s.created_at,
                    "updated_at": s.updated_at,
                    "messages": msg_list,
                    "scenario": {"scenario_id": s.scenario_id, "title": s.scenario_title}
                }

            # 2. Load Evaluations
            evals = db.query(SessionEvaluationModel).all()
            for ev in evals:
                res = {
                    "sessionId": ev.session_id,
                    "scenarioId": ev.scenario_id,
                    "scenarioTitle": ev.scenario_title,
                    "vehicleModel": ev.vehicle_model,
                    "advisorName": ev.advisor_name,
                    "advisorId": ev.advisor_id,
                    "date": ev.date,
                    "duration": ev.duration,
                    "overallScore": ev.overall_score,
                    "overall_score_5": ev.overall_score_5,
                    "passed": ev.passed,
                    "rubricBreakdown": json.loads(ev.rubric_breakdown_json or "[]"),
                    "aiSummary": ev.ai_summary,
                    "transcript": json.loads(ev.transcript_json or "[]"),
                    "recommendedNextPractice": ev.recommended_next_practice,
                    "managerReviewed": ev.manager_reviewed,
                    "managerScore": ev.manager_score,
                    "managerNote": ev.manager_note,
                    "reviewedBy": ev.reviewed_by,
                    "reviewedAt": ev.reviewed_at
                }
                self._results[ev.session_id] = res
                if not ev.manager_reviewed:
                    self._pending_reviews.append(res)

            logger.info(f"Loaded {len(self._sessions)} sessions and {len(self._results)} evaluations from SQLite.")
        except Exception as e:
            logger.warning(f"Could not load roleplay data from SQLite: {e}")
        finally:
            db.close()

    def save_session(self, session_id: str, session_data: Dict[str, Any]) -> None:
        self._sessions[session_id] = copy.deepcopy(session_data)

        # Persist to SQLite
        db = SessionLocal()
        try:
            s_record = db.query(PracticeSessionModel).filter(PracticeSessionModel.session_id == session_id).first()
            if not s_record:
                s_record = PracticeSessionModel(
                    session_id=session_id,
                    scenario_id=session_data.get("scenario_id", "unknown"),
                    scenario_title=session_data.get("scenario_title", "Bài tập tư vấn"),
                    vehicle_model=session_data.get("vehicle_model", "VinFast"),
                    advisor_id=session_data.get("advisor_id", "adv-001"),
                    advisor_name=session_data.get("advisor_name", "Tư vấn viên"),
                    turn_count=session_data.get("turn_count", 1),
                    trust_level=session_data.get("trust_level", 3),
                    interest_level=session_data.get("interest_level", 3),
                    conversation_stage=session_data.get("conversation_stage", "opening"),
                    status=session_data.get("status", "active"),
                    revealed_facts_json=json.dumps(session_data.get("revealed_facts", []), ensure_ascii=False),
                    resolved_objections_json=json.dumps(session_data.get("resolved_objections", []), ensure_ascii=False),
                    created_at=session_data.get("created_at", datetime.now().isoformat()),
                    updated_at=datetime.now().isoformat()
                )
                db.add(s_record)
            else:
                s_record.turn_count = session_data.get("turn_count", s_record.turn_count)
                s_record.trust_level = session_data.get("trust_level", s_record.trust_level)
                s_record.interest_level = session_data.get("interest_level", s_record.interest_level)
                s_record.conversation_stage = session_data.get("conversation_stage", s_record.conversation_stage)
                s_record.revealed_facts_json = json.dumps(session_data.get("revealed_facts", []), ensure_ascii=False)
                s_record.resolved_objections_json = json.dumps(session_data.get("resolved_objections", []), ensure_ascii=False)
                s_record.updated_at = datetime.now().isoformat()

            # Save recent messages
            for msg in session_data.get("messages", []):
                msg_id = msg.get("id")
                if msg_id:
                    existing_msg = db.query(SessionMessageModel).filter(SessionMessageModel.id == msg_id).first()
                    if not existing_msg:
                        db.add(SessionMessageModel(
                            id=msg_id,
                            session_id=session_id,
                            sender=msg.get("sender", "customer"),
                            text=msg.get("text", ""),
                            timestamp=msg.get("timestamp", datetime.now().strftime("%H:%M")),
                            intent_detected=msg.get("intentDetected")
                        ))

            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving session to DB: {e}")
        finally:
            db.close()

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        sess = self._sessions.get(session_id)
        return copy.deepcopy(sess) if sess else None

    def save_result(self, session_id: str, result: Dict[str, Any]) -> None:
        self._results[session_id] = copy.deepcopy(result)
        if not any(r.get("sessionId") == session_id for r in self._pending_reviews):
            self._pending_reviews.append(copy.deepcopy(result))

        # Persist to SQLite
        db = SessionLocal()
        try:
            ev_record = db.query(SessionEvaluationModel).filter(SessionEvaluationModel.session_id == session_id).first()
            if not ev_record:
                ev_record = SessionEvaluationModel(
                    session_id=session_id,
                    scenario_id=result.get("scenarioId", "scen-01"),
                    scenario_title=result.get("scenarioTitle", ""),
                    vehicle_model=result.get("vehicleModel", "VinFast"),
                    advisor_id=result.get("advisorId", "adv-001"),
                    advisor_name=result.get("advisorName", "Tư vấn viên"),
                    date=result.get("date", datetime.now().strftime("%d/%m/%Y %H:%M")),
                    duration=result.get("duration", "10 phút"),
                    overall_score=result.get("overallScore", 80),
                    overall_score_5=result.get("overall_score_5", 4.0),
                    passed=result.get("passed", True),
                    rubric_breakdown_json=json.dumps(result.get("rubricBreakdown", []), ensure_ascii=False),
                    ai_summary=result.get("aiSummary", ""),
                    transcript_json=json.dumps(result.get("transcript", []), ensure_ascii=False),
                    recommended_next_practice=result.get("recommendedNextPractice", ""),
                    manager_reviewed=result.get("managerReviewed", False),
                    manager_score=result.get("managerScore"),
                    manager_note=result.get("managerNote")
                )
                db.add(ev_record)
            else:
                ev_record.overall_score = result.get("overallScore", ev_record.overall_score)
                ev_record.manager_reviewed = result.get("managerReviewed", ev_record.manager_reviewed)
                ev_record.manager_score = result.get("managerScore", ev_record.manager_score)
                ev_record.manager_note = result.get("managerNote", ev_record.manager_note)

            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving evaluation to DB: {e}")
        finally:
            db.close()

    def get_result(self, session_id: str) -> Optional[Dict[str, Any]]:
        res = self._results.get(session_id)
        return copy.deepcopy(res) if res else None

    def get_all_results_by_advisor(self, advisor_id: str = "adv-001") -> List[Dict[str, Any]]:
        """Lấy tất cả các kết quả thực hành của một tư vấn viên để vẽ biểu đồ tiến độ."""
        return [
            copy.deepcopy(r) for r in self._results.values()
            if r.get("advisorId") == advisor_id or advisor_id == "all"
        ]

    def get_pending_reviews(self) -> List[Dict[str, Any]]:
        return [copy.deepcopy(r) for r in self._pending_reviews if not r.get("managerReviewed")]

    def update_review(
        self,
        session_id: str,
        manager_score: int,
        manager_note: str,
        reviewer_name: str
    ) -> Optional[Dict[str, Any]]:
        target = self._results.get(session_id)
        if not target:
            return None

        now_str = datetime.now().strftime("%d/%m/%Y %H:%M")
        target["managerReviewed"] = True
        target["managerScore"] = manager_score
        target["managerNote"] = manager_note
        target["reviewedBy"] = reviewer_name
        target["managerReviewerName"] = reviewer_name
        target["managerReviewedAt"] = now_str

        for r in self._pending_reviews:
            if r.get("sessionId") == session_id:
                r["managerReviewed"] = True
                r["managerScore"] = manager_score
                r["managerNote"] = manager_note
                r["reviewedBy"] = reviewer_name
                r["managerReviewerName"] = reviewer_name
                r["managerReviewedAt"] = now_str

        # Update SQLite
        db = SessionLocal()
        try:
            ev = db.query(SessionEvaluationModel).filter(SessionEvaluationModel.session_id == session_id).first()
            if ev:
                ev.manager_reviewed = True
                ev.manager_score = manager_score
                ev.manager_note = manager_note
                ev.reviewed_by = reviewer_name
                ev.reviewed_at = now_str
                db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating review in DB: {e}")
        finally:
            db.close()

        return copy.deepcopy(target)


session_persistence = SessionPersistence()
