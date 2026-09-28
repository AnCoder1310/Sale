"""
Vector Store & Hybrid Semantic Retrieval Index.
Chủ quản: Chương (Platform, RAG & Runtime)
Lưu trữ vector nhúng, hỗ trợ tìm kiếm kết hợp ngữ nghĩa và từ khóa kèm lọc metadata nghiêm ngặt.
"""
import math
import re
from typing import Any, Dict, List, Optional, Set, Tuple

from src.knowledge.chunking import default_chunker
from src.knowledge.embeddings import embedding_service
from src.knowledge.metadata import (
    DocumentStatus,
    IngestedChunk,
    NormalizedDocument,
)

# Danh sách từ dừng tiếng Việt (Stopwords) và từ giao tiếp xã giao
VIETNAMESE_STOPWORDS: Set[str] = {
    "và", "là", "có", "cho", "của", "được", "thì", "ở", "với", "các", "những",
    "một", "trong", "đến", "khi", "đã", "sẽ", "đang", "bạn", "ơi", "ạ", "nhé",
    "nè", "nào", "gì", "thế", "sao", "đâu", "mình", "anh", "chị", "em", "tôi",
    "hỏi", "biết", "về", "cái", "con", "chiếc", "này", "đó", "kia", "chào",
    "xin", "hello", "hi", "alo", "như", "nào", "ra", "vào", "lại", "rồi",
    "cũng", "đều", "rất", "quá", "lắm", "nhiều", "ít", "hơn", "nhất"
}

# Các từ khóa chuyên ngành xe điện VinFast
DOMAIN_KEYWORDS: Set[str] = {
    "vf3", "vf", "vf5", "vf6", "vf7", "vf8", "vf9", "wild",
    "pin", "sạc", "soh", "v-green", "vgreen", "ccs2", "ac", "dc", "kwh",
    "giá", "lăn", "bánh", "thuế", "trước", "bạ", "vay", "góp", "lãi",
    "suất", "bảo", "hành", "cứu", "hộ", "adas", "tự", "lái", "mã", "lực",
    "hp", "km", "quãng", "đường", "tầm", "xa", "tăng", "tốc", "treo", "khí",
    "nén", "ghế", "cơ", "trưởng", "so", "sánh", "cx5", "cx-5", "santafe",
    "santa", "fe", "explorer", "raize", "vios", "xăng", "dầu", "ưu", "đãi",
    "khuyến", "mãi", "nghị", "định", "10/2022", "ip67", "chống", "nước",
    "lội", "chung", "cư", "trạm", "trụ", "thuê", "mua", "đứt"
}


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Tính độ tương đồng Cosine giữa 2 vector chuẩn hoá."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)


class InMemoryVectorStore:
    """Kho lưu trữ vector trong bộ nhớ hỗ trợ metadata filtering và hybrid search."""

    def __init__(self):
        self.chunks: List[IngestedChunk] = []
        self.vectors: List[List[float]] = []

    def clear(self):
        """Xóa toàn bộ chỉ mục."""
        self.chunks.clear()
        self.vectors.clear()

    def add_chunks(self, chunks: List[IngestedChunk]):
        """Nạp danh sách chunk và sinh vector tương ứng."""
        for chunk in chunks:
            vec = embedding_service.embed_text(chunk.content)
            self.chunks.append(chunk)
            self.vectors.append(vec)

    def add_documents(self, docs: List[NormalizedDocument]):
        """Chia nhỏ và nạp danh sách tài liệu."""
        all_chunks: List[IngestedChunk] = []
        for doc in docs:
            chunks = default_chunker.chunk_document(doc)
            all_chunks.extend(chunks)
        self.add_chunks(all_chunks)

    def _extract_domain_tokens(self, text: str) -> Set[str]:
        """Tách các từ khóa chuyên ngành có ý nghĩa, loại bỏ từ dừng."""
        raw_tokens = re.findall(r"\w+", text.lower())
        tokens = set()
        for tok in raw_tokens:
            if len(tok) >= 2 and tok not in VIETNAMESE_STOPWORDS:
                tokens.add(tok)
        return tokens

    def _keyword_score(self, query: str, content: str) -> Tuple[float, int]:
        """Tính điểm trùng khớp từ khóa nghiệp vụ. Trả về (tỷ lệ trùng, số từ khóa khớp)."""
        q_tokens = self._extract_domain_tokens(query)
        if not q_tokens:
            return 0.0, 0
        c_text = content.lower()
        matched = sum(1 for tok in q_tokens if tok in c_text)
        return matched / len(q_tokens), matched

    def search(
        self,
        query: str,
        top_k: int = 4,
        product_model: Optional[str] = None,
        document_type: Optional[str] = None,
        status: Optional[str] = "active",
        exclude_expired: bool = True
    ) -> List[Tuple[float, IngestedChunk]]:
        """
        Tìm kiếm hybrid (ngữ nghĩa + từ khóa + lọc metadata):
        - Cosine similarity: 50%
        - Keyword overlap: 35%
        - Model matching bonus: 15%
        Chỉ trả về các kết quả thực sự liên quan đến câu hỏi.
        """
        if not self.chunks:
            return []

        query_domain_tokens = self._extract_domain_tokens(query)
        # Nếu câu hỏi không chứa bất kỳ từ khóa chuyên ngành xe nào (VD: câu chào hỏi xã giao),
        # không trả về các tài liệu xe bừa bãi!
        if not query_domain_tokens and not product_model:
            return []

        query_vec = embedding_service.embed_text(query)
        candidates: List[Tuple[float, IngestedChunk]] = []
        q_lower = query.lower()

        for idx, chunk in enumerate(self.chunks):
            meta = chunk.metadata

            # 1. Lọc theo trạng thái hiệu lực
            if exclude_expired and meta.status == DocumentStatus.EXPIRED:
                continue
            if status and meta.status.value != status and status != "all":
                continue

            # 2. Lọc theo dòng xe (nếu chỉ định và không phải 'ALL')
            if product_model and product_model.upper() != "ALL":
                pm = meta.product_model.upper()
                if pm != "ALL" and pm != product_model.upper():
                    continue

            # 3. Lọc theo loại văn bản
            if document_type and meta.document_type.value != document_type:
                continue

            # 4. Tính điểm Hybrid
            cos_sim = cosine_similarity(query_vec, self.vectors[idx])
            kw_sim, matched_count = self._keyword_score(query, chunk.content)

            # Bonus nếu tiêu đề hoặc nội dung khớp chính xác tên xe được hỏi
            bonus = 0.0
            if meta.product_model.lower() in q_lower and meta.product_model.upper() != "ALL":
                bonus += 0.20

            # Kết hợp điểm
            total_score = (cos_sim * 0.45) + (kw_sim * 0.40) + bonus
            total_score = min(1.0, max(0.0, total_score))

            # Ngưỡng chặt chẽ: phải có ít nhất 1 từ khóa chuyên ngành khớp hoặc cosine similarity cao
            if (matched_count > 0 or bonus > 0 or cos_sim >= 0.35) and total_score >= 0.20:
                candidates.append((round(total_score, 4), chunk))

        # Sắp xếp giảm dần theo điểm số
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[:top_k]


vector_store = InMemoryVectorStore()
