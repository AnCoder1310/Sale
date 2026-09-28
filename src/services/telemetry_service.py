"""
Telemetry Service with SQLite Persistence.
Chương (Platform) & An (Frontend Telemetry).
"""
from datetime import datetime
import json
from typing import Any, Dict, List
from src.platform.database import SessionLocal, TelemetryEventModel


class TelemetryService:
    def __init__(self):
        self.events: List[Dict[str, Any]] = []
        self._load_from_db()

    def _load_from_db(self):
        db = SessionLocal()
        try:
            records = db.query(TelemetryEventModel).order_by(TelemetryEventModel.id.desc()).limit(100).all()
            for r in reversed(records):
                self.events.append({
                    "id": f"evt-{r.id}",
                    "event_name": r.event_name,
                    "timestamp": r.created_at,
                    "payload": json.loads(r.payload_json)
                })
        except Exception:
            pass
        finally:
            db.close()

    def record_event(self, event_name: str, payload: Dict[str, Any], user_id: str = "adv-001") -> Dict[str, Any]:
        entry = {
            "id": f"evt-{len(self.events) + 1}",
            "event_name": event_name,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "payload": payload
        }
        self.events.append(entry)
        if len(self.events) > 1000:
            self.events = self.events[-1000:]

        # Persist to SQLite
        try:
            db = SessionLocal()
            db_event = TelemetryEventModel(
                event_name=event_name,
                payload_json=json.dumps(payload, ensure_ascii=False),
                created_at=entry["timestamp"]
            )
            db.add(db_event)
            db.commit()
            db.close()
        except Exception:
            pass

        return entry

    def get_summary(self) -> Dict[str, Any]:
        counts: Dict[str, int] = {}
        for e in self.events:
            name = e["event_name"]
            counts[name] = counts.get(name, 0) + 1

        return {
            "total_events": len(self.events),
            "event_counts": counts,
            "recent_events": self.events[-20:]
        }


telemetry_service = TelemetryService()
