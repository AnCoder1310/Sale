"""
Retrieval Evaluation Benchmark Runner.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phối hợp: Chương (Retrieval Service)
Kiểm thử chuyên sâu tầng trích xuất vector và lọc metadata:
- Top-1, Top-3, Top-5 recall
- Active vs Expired Policy filtering accuracy
"""
from typing import Any, Dict, List
from eval.metrics import calculate_hit_rate, calculate_recall_at_k
from src.knowledge.retrieval_service import retrieval_service

RETRIEVAL_TEST_QUERIES = [
    ("Thông số công suất mô tơ điện VF 3", "VF 3", ["SPECS_VF3_2026"]),
    ("Tầm di chuyển và thời gian sạc VF 5 Plus", "VF 5", ["SPECS_VF5_PLUS_2026"]),
    ("Gói ADAS cấp độ 2 và pin VF 6 Plus", "VF 6", ["SPECS_VF6_PLUS_2026"]),
    ("Động cơ 349 mã lực và dẫn động AWD VF 7", "VF 7", ["SPECS_VF7_PLUS_2026"]),
    ("Pin CATL 87.7 kWh và tăng tốc 0-100 VF 8", "VF 8", ["SPECS_VF8_PLUS_2026"]),
    ("Treo khí nén và ghế cơ trưởng massage VF 9", "VF 9", ["SPECS_VF9_PLUS_2026"]),
    ("So sánh trực diện CX-5 và VF 7 Plus", "VF 7", ["BATTLECARD_VF7_PLUS_VS_MAZDA_CX5"]),
    ("So sánh Santa Fe và VF 8 Plus chi phí xăng điện", "VF 8", ["BATTLECARD_VF8_VS_HYUNDAI_SANTAFE"]),
    ("So sánh Ford Explorer và VF 9 Plus trục cơ sở", "VF 9", ["BATTLECARD_VF9_VS_FORD_EXPLORER"]),
    ("So sánh Toyota Raize và VF 5 Plus gầm cao", "VF 5", ["BATTLECARD_VF5_VS_TOYOTA_RAIZE"]),
    ("Bảo hành pin SOH dưới 70% đổi mới", "ALL", ["POLICY_BATTERY_092026"]),
    ("Trạm sạc V-GREEN sạc nhanh chung cư", "ALL", ["POLICY_CHARGING_VGREEN_2026"]),
    ("Nghị định 10/2022 miễn 100% lệ phí trước bạ", "ALL", ["POLICY_REGISTRATION_TAX_2026"]),
    ("Bảo hành 7-10 năm cứu hộ 24/7", "ALL", ["POLICY_WARRANTY_2026"]),
    ("Vay trả góp ngân hàng lãi suất cố định 5%", "ALL", ["POLICY_FINANCING_INSTALLMENT_2026"]),
    ("Expat đăng ký xe bằng thẻ tạm trú TRC", "VF 8", ["FAQ_EXPAT_REGISTRATION_2026"]),
    ("Bảng giá niêm yết xe điện tháng 09/2026", "ALL", ["PRICE_LIST_VINFAST_092026"]),
    ("Khuyến mãi tặng 1 năm sạc pin V-GREEN", "VF 7", ["PROMOTION_AUTUMN_092026"]),
]


def run_retrieval_evaluation() -> Dict[str, Any]:
    """Chạy đánh giá tầng retrieval."""
    top1_hits = 0
    top3_hits = 0
    total = len(RETRIEVAL_TEST_QUERIES)

    for query, model, expected in RETRIEVAL_TEST_QUERIES:
        results = retrieval_service.search_evidence(query=query, vehicle_model=model, top_k=3)
        retrieved_ids = [r["id"] for r in results]

        if retrieved_ids and retrieved_ids[0] in expected:
            top1_hits += 1
        if any(exp in retrieved_ids for exp in expected):
            top3_hits += 1

    # Kiểm tra tính năng lọc bỏ chính sách hết hạn
    expired_query_results = retrieval_service.search_evidence(
        query="gói thuê pin không giới hạn đời đầu cũ",
        top_k=5,
        exclude_expired=True
    )
    has_expired = any(r["id"] == "POLICY_BATTERY_UNLIMITED_EXPIRED" for r in expired_query_results)
    expired_filter_passed = not has_expired

    return {
        "total_queries": total,
        "top_1_accuracy": round(top1_hits / total * 100, 2),
        "top_3_recall": round(top3_hits / total * 100, 2),
        "expired_policy_filter_passed": expired_filter_passed,
        "status": "PASS" if top3_hits / total >= 0.85 and expired_filter_passed else "FAIL"
    }


if __name__ == "__main__":
    rep = run_retrieval_evaluation()
    print("=== KẾT QUẢ RETRIEVAL BENCHMARK ===")
    print(f"Top-1 Accuracy: {rep['top_1_accuracy']}%")
    print(f"Top-3 Recall: {rep['top_3_recall']}%")
    print(f"Lọc chính sách hết hạn thành công: {rep['expired_policy_filter_passed']}")
    print(f"Trạng thái: {rep['status']}")
