from datetime import datetime
from typing import Any, Dict, List

class TelemetryService:
    def __init__(self):
        self.events: List[Dict[str, Any]] = []

    def record_event(self, event_name: str, payload: Dict[str, Any], user_id: str = "adv-001") -> Dict[str, Any]:
        entry = {
            "id": f"evt-{len(self.events) + 1}",
            "event_name": event_name,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "payload": payload
        }
        self.events.append(entry)
        # Keep recent 1000 events
        if len(self.events) > 1000:
            self.events = self.events[-1000:]
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
