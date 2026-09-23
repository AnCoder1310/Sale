import json
import os
import re
from typing import Any, Dict, List, Optional

DIALECT_PATH = os.path.join(os.path.dirname(__file__), "../../data/knowledge/regional_dialects.json")

class DialectService:
    def __init__(self):
        self.dialects: List[Dict[str, Any]] = []
        self._load_dialects()

    def _load_dialects(self):
        if os.path.exists(DIALECT_PATH):
            try:
                with open(DIALECT_PATH, "r", encoding="utf-8") as f:
                    self.dialects = json.load(f)
            except Exception as e:
                print(f"Error loading dialects dataset: {e}")
                self.dialects = []

    def get_all(self, region: Optional[str] = None) -> List[Dict[str, Any]]:
        if region:
            return [d for d in self.dialects if region.lower() in d.get("region", "").lower()]
        return self.dialects

    def detect_and_normalize(self, text: str) -> Dict[str, Any]:
        clean = text.lower().strip()
        matched = []

        for item in self.dialects:
            term = item["dialect_term"].lower()
            if term in clean:
                matched.append(item)

        if not matched:
            return {
                "detected": False,
                "matches": [],
                "normalized_text": text,
                "coaching_tips": []
            }

        # Build normalized interpretation
        tips = [m.get("sales_coaching_tip") for m in matched if m.get("sales_coaching_tip")]
        meanings = [f"{m['dialect_term']} ➔ '{m['normalized_vietnamese']}'" for m in matched]

        return {
            "detected": True,
            "region": matched[0].get("region"),
            "matches": matched,
            "interpretation": " | ".join(meanings),
            "primary_intent": matched[0].get("intent"),
            "coaching_tips": tips
        }

dialect_service = DialectService()
