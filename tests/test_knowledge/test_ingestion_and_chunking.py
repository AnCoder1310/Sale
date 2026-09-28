import pytest
from src.knowledge.chunking import TextChunker, default_chunker
from src.knowledge.ingestion import KnowledgeIngestionPipeline
from src.knowledge.metadata import NormalizedDocument, validate_metadata
from src.knowledge.policy_versioning import policy_manager


def test_metadata_validation_success():
    sample_doc = {
        "document_id": "TEST_DOC_001",
        "title": "Tài liệu kiểm thử thông số xe",
        "document_type": "product_specs",
        "product_model": "VF 8",
        "effective_date": "2026-01-01",
        "source": "Tài liệu nội bộ",
        "version": "1.0",
        "status": "active",
        "content": "Đây là nội dung thử nghiệm xe điện VinFast VF 8 công suất 402 mã lực."
    }
    res = validate_metadata(sample_doc)
    assert res["is_valid"] is True
    assert res["validated_doc"] is not None


def test_metadata_validation_missing_field():
    sample_doc = {
        "document_id": "TEST_INVALID",
        "title": "Thiếu content"
    }
    res = validate_metadata(sample_doc)
    assert res["is_valid"] is False
    assert len(res["errors"]) > 0


def test_chunking_creates_valid_chunks():
    chunker = TextChunker(chunk_size=40, chunk_overlap=10)
    doc = NormalizedDocument(
        document_id="TEST_CHUNKING",
        title="Kiểm thử chunking",
        document_type="product_specs",
        product_model="VF 7",
        effective_date="2026-01-01",
        source="Catalog 2026",
        version="1.0",
        status="active",
        content="Đoạn 1 về động cơ điện 349 mã lực rất mạnh mẽ.\n\nĐoạn 2 về hệ thống sạc nhanh 24 phút tại trạm V-GREEN."
    )
    chunks = chunker.chunk_document(doc)
    assert len(chunks) >= 2
    assert chunks[0].document_id == "TEST_CHUNKING"
    assert "349 mã lực" in chunks[0].content


def test_policy_versioning_filters_expired():
    doc_active = NormalizedDocument(
        document_id="ACT",
        title="Active Doc",
        document_type="policy",
        product_model="ALL",
        effective_date="2026-01-01",
        source="VinFast",
        status="active",
        content="Active"
    )
    doc_expired = NormalizedDocument(
        document_id="EXP",
        title="Expired Doc",
        document_type="policy",
        product_model="ALL",
        effective_date="2022-01-01",
        expiry_date="2023-12-31",
        source="VinFast",
        status="expired",
        content="Expired"
    )
    assert policy_manager.is_policy_active(doc_active) is True
    assert policy_manager.is_policy_active(doc_expired) is False
