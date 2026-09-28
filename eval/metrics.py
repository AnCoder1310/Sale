"""
Evaluation Metrics Suite.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Cung cấp các công thức định lượng tiêu chuẩn ngành AI:
- Recall@K, Hit Rate
- Citation Precision & Groundedness Score
- Judge MAE & Criterion Agreement
"""
import math
from typing import Dict, List, Set, Union


def calculate_hit_rate(retrieved_ids: List[str], expected_ids: List[str]) -> float:
    """Tỷ lệ có ít nhất 1 tài liệu kỳ vọng nằm trong danh sách truy xuất (0.0 hoặc 1.0)."""
    if not expected_ids:
        return 1.0
    r_set = set(retrieved_ids)
    for exp in expected_ids:
        if exp in r_set:
            return 1.0
    return 0.0


def calculate_recall_at_k(retrieved_ids: List[str], expected_ids: List[str], k: int = 3) -> float:
    """Tỷ lệ tài liệu liên quan được tìm thấy trong Top-K kết quả."""
    if not expected_ids:
        return 1.0
    top_k = set(retrieved_ids[:k])
    matched = sum(1 for exp in expected_ids if exp in top_k)
    return round(matched / len(expected_ids), 4)


def calculate_citation_accuracy(
    cited_ids: List[str],
    ground_truth_ids: List[str],
    invalid_ids: List[str] = None
) -> float:
    """Độ chính xác của các trích dẫn pháp lý / nguồn."""
    if not cited_ids:
        return 0.0
    invalid_set = set(invalid_ids or [])
    # Phạt nặng nếu trích dẫn tài liệu hết hạn hoặc sai
    has_invalid = any(c in invalid_set for c in cited_ids)
    if has_invalid:
        return 0.0

    gt_set = set(ground_truth_ids)
    valid_count = sum(1 for c in cited_ids if c in gt_set)
    return round(valid_count / len(cited_ids), 4)


def calculate_groundedness_score(answer: str, context_snippets: List[str]) -> float:
    """Đo lường mức độ câu trả lời bám sát vào ngữ cảnh căn cứ."""
    if not answer or not context_snippets:
        return 0.0
    ans_words = set(answer.lower().split())
    ctx_words = set(" ".join(context_snippets).lower().split())

    if not ans_words:
        return 0.0
    overlap = len(ans_words.intersection(ctx_words))
    score = min(1.0, (overlap / len(ans_words)) * 1.5)
    return round(score, 4)


def calculate_rubric_mae(
    predicted: Dict[str, Union[int, float]],
    ground_truth: Dict[str, Union[int, float]]
) -> float:
    """Mean Absolute Error giữa điểm của AI Evaluator và điểm chuyên gia."""
    keys = set(predicted.keys()).intersection(set(ground_truth.keys()))
    if not keys:
        return 0.0
    total_diff = sum(abs(predicted[k] - ground_truth[k]) for k in keys)
    return round(total_diff / len(keys), 4)


def calculate_criterion_agreement(
    predicted: Dict[str, Union[int, float]],
    ground_truth: Dict[str, Union[int, float]],
    tolerance: float = 1.0
) -> float:
    """Tỷ lệ tiêu chí đạt độ đồng thuận trong khoảng sai số cho phép."""
    keys = set(predicted.keys()).intersection(set(ground_truth.keys()))
    if not keys:
        return 0.0
    agreed = sum(1 for k in keys if abs(predicted[k] - ground_truth[k]) <= tolerance)
    return round(agreed / len(keys), 4)
