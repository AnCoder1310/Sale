"""
Copilot Evaluation Benchmark Runner.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Phối hợp: Chương (Copilot Graph & Retrieval)
Chạy bộ benchmark 25 câu hỏi thực chiến, đo lường:
- Hit Rate
- Recall@3
- Citation Precision
- Latency (ms)
- Groundedness Score
"""
import asyncio
import time
from typing import Any, Dict, List

from eval.metrics import (
    calculate_citation_accuracy,
    calculate_groundedness_score,
    calculate_hit_rate,
    calculate_recall_at_k,
)
from src.copilot.graph import copilot_graph

BENCHMARK_CASES = [
    {
        "query": "VF 3 pin đi được bao nhiêu km và gầm cao mấy mm?",
        "vehicle_model": "VF 3",
        "expected_docs": ["SPECS_VF3_2026"],
        "invalid_docs": ["POLICY_BATTERY_UNLIMITED_EXPIRED"]
    },
    {
        "query": "VF 5 Plus công suất bao nhiêu mã lực, sạc nhanh mất bao lâu?",
        "vehicle_model": "VF 5",
        "expected_docs": ["SPECS_VF5_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "VF 6 Plus trang bị gói an toàn ADAS cấp độ mấy và đi được bao xa?",
        "vehicle_model": "VF 6",
        "expected_docs": ["SPECS_VF6_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "VF 7 Plus công suất bao nhiêu, so với Mazda CX-5 thì xe nào mạnh hơn?",
        "vehicle_model": "VF 7",
        "expected_docs": ["BATTLECARD_VF7_PLUS_VS_MAZDA_CX5", "SPECS_VF7_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "VF 8 Plus tăng tốc 0-100km/h mất mấy giây, pin CATL đi được bao nhiêu km?",
        "vehicle_model": "VF 8",
        "expected_docs": ["SPECS_VF8_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "VF 9 Plus bản 6 chỗ có trang bị ghế cơ trưởng massage và treo khí nén không?",
        "vehicle_model": "VF 9",
        "expected_docs": ["SPECS_VF9_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "So sánh VF 8 với Hyundai Santa Fe về sức mạnh động cơ và tiền nhiên liệu?",
        "vehicle_model": "VF 8",
        "expected_docs": ["BATTLECARD_VF8_VS_HYUNDAI_SANTAFE"],
        "invalid_docs": []
    },
    {
        "query": "So sánh VF 9 với Ford Explorer về độ rộng rãi và hệ thống treo khí nén?",
        "vehicle_model": "VF 9",
        "expected_docs": ["BATTLECARD_VF9_VS_FORD_EXPLORER"],
        "invalid_docs": []
    },
    {
        "query": "So sánh VF 5 Plus với Toyota Raize về giá lăn bánh và sức mạnh?",
        "vehicle_model": "VF 5",
        "expected_docs": ["BATTLECARD_VF5_VS_TOYOTA_RAIZE"],
        "invalid_docs": []
    },
    {
        "query": "Chính sách thuê pin tháng 09/2026 giá bao nhiêu và khi nào được đổi pin mới miễn phí?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_BATTERY_092026"],
        "invalid_docs": ["POLICY_BATTERY_UNLIMITED_EXPIRED"]
    },
    {
        "query": "Chính sách pin chai dưới 70% có được bảo hành đổi mới không?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_BATTERY_092026"],
        "invalid_docs": []
    },
    {
        "query": "Gói thuê pin không giới hạn đời đầu có còn áp dụng cho xe mới mua không?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_BATTERY_092026"],
        "invalid_docs": []
    },
    {
        "query": "Mạng lưới trạm sạc V-GREEN đã phủ sóng bao nhiêu tỉnh thành, ở chung cư sạc thế nào?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_CHARGING_VGREEN_2026"],
        "invalid_docs": []
    },
    {
        "query": "Nghị định 10/2022 miễn 100% lệ phí trước bạ cho ô tô điện đến khi nào?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_REGISTRATION_TAX_2026"],
        "invalid_docs": []
    },
    {
        "query": "Xe ô tô điện VinFast được bảo hành mấy năm hoặc bao nhiêu km?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_WARRANTY_2026"],
        "invalid_docs": []
    },
    {
        "query": "Dịch vụ cứu hộ 24/7 và Mobile Service của VinFast có mất phí không?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_WARRANTY_2026"],
        "invalid_docs": []
    },
    {
        "query": "Gói vay trả góp mua xe VinFast lãi suất ưu đãi cố định mấy phần trăm?",
        "vehicle_model": "ALL",
        "expected_docs": ["POLICY_FINANCING_INSTALLMENT_2026"],
        "invalid_docs": []
    },
    {
        "query": "Người nước ngoài có thẻ tạm trú TRC có được đứng tên đăng ký xe VinFast không?",
        "vehicle_model": "VF 8",
        "expected_docs": ["FAQ_EXPAT_REGISTRATION_2026"],
        "invalid_docs": []
    },
    {
        "query": "Trợ lý ảo VinFast có hỗ trợ điều khiển bằng giọng nói tiếng Anh không?",
        "vehicle_model": "VF 8",
        "expected_docs": ["FAQ_EXPAT_REGISTRATION_2026"],
        "invalid_docs": []
    },
    {
        "query": "VF 5 Plus lội nước ngập có bị giật điện hay chết máy không, chuẩn chống nước pin là gì?",
        "vehicle_model": "VF 5",
        "expected_docs": ["SPECS_VF5_PLUS_2026"],
        "invalid_docs": []
    },
    {
        "query": "Ưu đãi tháng 09/2026 mua xe VF 6 và VF 7 được tặng gì?",
        "vehicle_model": "VF 7",
        "expected_docs": ["PROMOTION_AUTUMN_092026"],
        "invalid_docs": []
    },
    {
        "query": "Bảng giá niêm yết các dòng xe VinFast tháng 09/2026?",
        "vehicle_model": "ALL",
        "expected_docs": ["PRICE_LIST_VINFAST_092026"],
        "invalid_docs": []
    },
    {
        "query": "Chi phí sạc điện xe VF 3 tính trên 1 km là bao nhiêu tiền?",
        "vehicle_model": "VF 3",
        "expected_docs": ["SPECS_VF3_2026"],
        "invalid_docs": []
    },
    {
        "query": "Tài xế chạy taxi dịch vụ 5000 km/tháng thì nên chọn gói thuê pin nào?",
        "vehicle_model": "VF 5",
        "expected_docs": ["POLICY_BATTERY_092026"],
        "invalid_docs": ["POLICY_BATTERY_UNLIMITED_EXPIRED"]
    },
    {
        "query": "Trục cơ sở VF 7 dài bao nhiêu mm, hàng ghế sau có rộng hơn CX-5 không?",
        "vehicle_model": "VF 7",
        "expected_docs": ["BATTLECARD_VF7_PLUS_VS_MAZDA_CX5", "SPECS_VF7_PLUS_2026"],
        "invalid_docs": []
    }
]


async def run_copilot_evaluation() -> Dict[str, Any]:
    """Chạy đánh giá Copilot trên toàn bộ 25 câu hỏi benchmark."""
    total_cases = len(BENCHMARK_CASES)
    hit_rate_sum = 0.0
    recall_sum = 0.0
    citation_acc_sum = 0.0
    groundedness_sum = 0.0
    total_latency_ms = 0.0
    detailed_results = []

    for idx, case in enumerate(BENCHMARK_CASES, 1):
        start_t = time.perf_counter()
        res = await copilot_graph.ainvoke({
            "query": case["query"],
            "vehicle_model": case["vehicle_model"]
        })
        latency_ms = (time.perf_counter() - start_t) * 1000.0
        total_latency_ms += latency_ms

        retrieved_ids = [c["id"] for c in res["citations"]]
        hit = calculate_hit_rate(retrieved_ids, case["expected_docs"])
        recall = calculate_recall_at_k(retrieved_ids, case["expected_docs"], k=3)
        cit_acc = calculate_citation_accuracy(retrieved_ids, case["expected_docs"], case["invalid_docs"])
        groundedness = calculate_groundedness_score(res["answer"], [c.get("snippet", "") for c in res["citations"]])

        hit_rate_sum += hit
        recall_sum += recall
        citation_acc_sum += cit_acc
        groundedness_sum += groundedness

        detailed_results.append({
            "case_id": idx,
            "query": case["query"],
            "model": case["vehicle_model"],
            "retrieved": retrieved_ids,
            "expected": case["expected_docs"],
            "hit": hit == 1.0,
            "recall": recall,
            "citation_acc": cit_acc,
            "latency_ms": round(latency_ms, 2)
        })

    avg_hit_rate = round(hit_rate_sum / total_cases * 100, 2)
    avg_recall = round(recall_sum / total_cases * 100, 2)
    avg_cit_acc = round(citation_acc_sum / total_cases * 100, 2)
    avg_groundedness = round(groundedness_sum / total_cases * 100, 2)
    avg_latency = round(total_latency_ms / total_cases, 2)

    return {
        "total_queries": total_cases,
        "hit_rate_pct": avg_hit_rate,
        "recall_at_3_pct": avg_recall,
        "citation_accuracy_pct": avg_cit_acc,
        "groundedness_pct": avg_groundedness,
        "avg_latency_ms": avg_latency,
        "status": "PASS" if avg_hit_rate >= 80 and avg_cit_acc >= 80 else "FAIL",
        "detailed_results": detailed_results
    }


if __name__ == "__main__":
    report = asyncio.run(run_copilot_evaluation())
    print(f"=== KẾT QUẢ COPILOT BENCHMARK ===")
    print(f"Tổng số câu truy vấn: {report['total_queries']}")
    print(f"Hit Rate: {report['hit_rate_pct']}%")
    print(f"Recall@3: {report['recall_at_3_pct']}%")
    print(f"Độ chính xác trích dẫn: {report['citation_accuracy_pct']}%")
    print(f"Độ bám sát tài liệu: {report['groundedness_pct']}%")
    print(f"Độ trễ trung bình: {report['avg_latency_ms']} ms")
    print(f"Đánh giá: {report['status']}")
