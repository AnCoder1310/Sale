"""
Scenario Loader & Registry.
Chủ quản: Duy (AI Customer Role-play & Coaching Engine)
Phối hợp: Đạt (Scenario Datasets)
"""
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from src.roleplay.contracts import ScenarioContract

logger = logging.getLogger(__name__)

PRIMARY_PATH = Path("data/scenarios/scenarios.json")
EXPANDED_PATH = Path("data/scenarios/expanded_scenarios.json")


class ScenarioLoader:
    """Tải, xác thực và quản lý thư viện kịch bản luyện tập bán xe."""

    LEGACY_ID_MAP = {
        "scen-01": "SCENARIO_04_VF8_BATTERY",
        "scen-02": "SCENARIO_02_VF7_VS_CX5",
        "scen-03": "SCENARIO_05_VF9_VIP",
        "scen-04": "SCENARIO_03_VF6_APARTMENT",
        "scen-05": "SCENARIO_01_VF5_TAXI",
        "scen-06": "SCENARIO_06_VF3_FIRST_CAR",
        "scen-07": "SCENARIO_07_EXPAT_DAVID",
        "scen-08": "SCENARIO_08_BAC_BA_NGHE_AN",
    }

    def __init__(self):
        self.scenarios_by_id: Dict[str, ScenarioContract] = {}
        self.raw_scenarios: List[Dict[str, Any]] = []
        self.load_scenarios()

    def load_scenarios(self):
        """Nạp danh sách kịch bản từ các file dữ liệu."""
        loaded_raw = []
        
        # Nạp từ expanded nếu có, nếu không thì nạp từ primary
        target_path = EXPANDED_PATH if EXPANDED_PATH.exists() else PRIMARY_PATH
        if target_path.exists():
            with open(target_path, "r", encoding="utf-8") as f:
                loaded_raw = json.load(f)

        # Đảm bảo các kịch bản trong PRIMARY_PATH cũng có mặt
        if PRIMARY_PATH.exists() and target_path != PRIMARY_PATH:
            with open(PRIMARY_PATH, "r", encoding="utf-8") as f:
                primary_raw = json.load(f)
                existing_ids = {s["scenario_id"] for s in loaded_raw}
                for item in primary_raw:
                    if item["scenario_id"] not in existing_ids:
                        loaded_raw.append(item)

        self.raw_scenarios = loaded_raw
        self.scenarios_by_id.clear()

        for item in loaded_raw:
            try:
                sc = ScenarioContract.model_validate(item)
                self.scenarios_by_id[sc.scenario_id] = sc
            except Exception as e:
                logger.error(f"Cannot parse scenario {item.get('scenario_id')}: {e}")

    def get_all_scenarios(self) -> List[Dict[str, Any]]:
        """Lấy danh sách kịch bản định dạng dict cho API và frontend."""
        return [sc.model_dump() for sc in self.scenarios_by_id.values()]

    def get_scenario(self, scenario_id: str) -> Optional[ScenarioContract]:
        """Tìm kịch bản theo ID (hỗ trợ cả legacy alias và chuẩn Gate 1)."""
        actual_id = self.LEGACY_ID_MAP.get(scenario_id, scenario_id)
        if actual_id in self.scenarios_by_id:
            return self.scenarios_by_id[actual_id]
        
        # Nếu chưa thấy, thử tìm case-insensitive
        for sid, sc in self.scenarios_by_id.items():
            if sid.lower() == scenario_id.lower() or sid.lower() == actual_id.lower():
                return sc

        # Fallback về kịch bản đầu tiên nếu có
        if self.scenarios_by_id:
            return next(iter(self.scenarios_by_id.values()))
        return None


scenario_loader = ScenarioLoader()
