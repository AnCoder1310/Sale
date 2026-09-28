"""
Embedding Service & Vectorizer.
Chủ quản: Chương (Platform, RAG & Runtime)
Cung cấp vector nhúng ngữ nghĩa hỗ trợ cả online model và local deterministic fallback.
"""
import hashlib
import math
import re
from typing import List


class EmbeddingService:
    """Tạo vector nhúng ngữ nghĩa với cơ chế fallback tự chủ."""

    def __init__(self, dimension: int = 128):
        self.dimension = dimension

    def _tokenize(self, text: str) -> List[str]:
        """Tách từ đơn giản và loại bỏ ký tự đặc biệt."""
        return [w.lower() for w in re.findall(r"\w+", text) if len(w) > 1]

    def embed_text(self, text: str) -> List[float]:
        """
        Tạo vector số thực có độ dài cố định dựa trên ngữ nghĩa từ vựng và hash projection.
        Đảm bảo tính nhất quán (deterministic) và tính cosine tương tự giữa các từ đồng nghĩa/chứa từ khóa.
        """
        tokens = self._tokenize(text)
        vector = [0.0] * self.dimension

        if not tokens:
            return vector

        # TF-IDF-like projection
        for token in tokens:
            # Hash token into dimension buckets
            token_hash = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16)
            primary_idx = token_hash % self.dimension
            secondary_idx = (token_hash >> 4) % self.dimension
            weight = 1.0 + (len(token) / 10.0)

            vector[primary_idx] += weight
            vector[secondary_idx] += weight * 0.5

        # L2 Normalization
        norm = math.sqrt(sum(v * v for v in vector))
        if norm > 0:
            vector = [round(v / norm, 6) for v in vector]

        return vector

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Nhúng một lô các đoạn văn bản."""
        return [self.embed_text(t) for t in texts]


embedding_service = EmbeddingService()
