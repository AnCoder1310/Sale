"""
Intelligent Document Chunking Engine.
Chủ quản: Chương (Platform, RAG & Runtime)
Phối hợp: Đạt (Data/Ingestion)
"""
import re
from typing import List, Optional

from src.knowledge.metadata import (
    ChunkMetadata,
    IngestedChunk,
    NormalizedDocument,
)


class TextChunker:
    """Chia nhỏ văn bản tài liệu thành các khối ngữ nghĩa (chunks) kèm metadata."""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 80):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        """Chia văn bản dựa trên đoạn văn và câu kết hợp."""
        if not text:
            return []
        
        # Tách theo đoạn văn hoặc dấu chấm phẩy / xuống dòng
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n|\r\n\r\n", text) if p.strip()]
        
        chunks: List[str] = []
        current_chunk = ""

        for para in paragraphs:
            # Nếu đoạn văn ngắn hơn chunk_size, ghép lại
            if len(current_chunk) + len(para) + 1 <= self.chunk_size:
                current_chunk = f"{current_chunk}\n{para}".strip() if current_chunk else para
            else:
                # Nếu đã có current_chunk, lưu lại
                if current_chunk:
                    chunks.append(current_chunk)
                
                # Nếu một đoạn quá dài, tách theo câu
                if len(para) > self.chunk_size:
                    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", para) if s.strip()]
                    temp_chunk = ""
                    for s in sentences:
                        if len(temp_chunk) + len(s) + 1 <= self.chunk_size:
                            temp_chunk = f"{temp_chunk} {s}".strip() if temp_chunk else s
                        else:
                            if temp_chunk:
                                chunks.append(temp_chunk)
                            temp_chunk = s
                    if temp_chunk:
                        current_chunk = temp_chunk
                    else:
                        current_chunk = ""
                else:
                    current_chunk = para

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def chunk_document(self, doc: NormalizedDocument) -> List[IngestedChunk]:
        """Chuyển đổi một NormalizedDocument thành danh sách IngestedChunk đầy đủ metadata."""
        text_chunks = self.split_text(doc.content)
        
        # Nếu tài liệu có sales_script, thêm một chunk cho sales script để hỗ trợ trả lời tức thì
        if doc.sales_script:
            script_text = (
                f"[GỢI Ý TƯ VẤN] {doc.title}:\n"
                f"- Luận điểm: {'; '.join(doc.sales_script.core_arguments)}\n"
                f"- Mẫu câu trả lời: {doc.sales_script.suggested_message}"
            )
            text_chunks.append(script_text)

        ingested_chunks: List[IngestedChunk] = []
        for idx, text in enumerate(text_chunks):
            chunk_id = f"{doc.document_id}_c{idx:02d}"
            metadata = ChunkMetadata(
                chunk_id=chunk_id,
                document_id=doc.document_id,
                document_type=doc.document_type,
                product_model=doc.product_model,
                policy_type=doc.policy_type,
                effective_date=doc.effective_date,
                expiry_date=doc.expiry_date,
                status=doc.status,
                source=doc.source,
                chunk_index=idx,
            )
            ingested_chunks.append(
                IngestedChunk(
                    chunk_id=chunk_id,
                    document_id=doc.document_id,
                    content=text,
                    metadata=metadata,
                )
            )

        return ingested_chunks


default_chunker = TextChunker()
