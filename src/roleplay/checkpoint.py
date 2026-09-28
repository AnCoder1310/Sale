"""
Roleplay Session Checkpoint Manager.
Chủ quản: Chương (Platform, RAG & Runtime)
Tuân thủ CheckpointContract trong src/roleplay/contracts.py.
"""
import copy
from typing import Any, Dict, Optional


class InMemoryCheckpointManager:
    """Quản lý lưu và phục hồi checkpoint phiên luyện tập đa lượt."""

    def __init__(self):
        self._checkpoints: Dict[str, Dict[str, Any]] = {}

    async def save(self, session_id: str, state: Dict[str, Any]) -> None:
        """Lưu lại trạng thái hiện tại của phiên."""
        self._checkpoints[session_id] = copy.deepcopy(state)

    async def load(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Phục hồi trạng thái phiên đã lưu."""
        state = self._checkpoints.get(session_id)
        if state is not None:
            return copy.deepcopy(state)
        return None

    def delete(self, session_id: str) -> bool:
        """Xoá checkpoint của phiên."""
        return self._checkpoints.pop(session_id, None) is not None

    def list_sessions(self) -> list[str]:
        """Danh sách các session ID đang lưu."""
        return list(self._checkpoints.keys())


checkpoint_manager = InMemoryCheckpointManager()
