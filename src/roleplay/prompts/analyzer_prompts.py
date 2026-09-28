"""
Turn Analyzer Prompts.
Chủ quản: Duy (AI Customer Role-play & Coaching Engine)
"""

TURN_ANALYZER_PROMPT = """Bạn là chuyên gia phân tích hội thoại bán hàng (Sales Conversation Turn Analyzer).
Hãy phân tích lượt nói vừa rồi của Tư vấn viên (Advisor):

NỘI DUNG TƯ VẤN VIÊN NÓI:
\"{advisor_message}\"

THÔNG TIN BỐI CẢNH KỊCH BẢN:
- Quy tắc hé lộ thông tin (Disclosure rules): {disclosure_rules}
- Danh sách từ chối/băn khoăn (Objections): {objections}

HÃY ĐÁNH GIÁ VÀ XUẤT ĐỊNH DẠNG JSON:
{{
  "intent_detected": "loại ý định (chào hỏi / hỏi nhu cầu / giải thích sản phẩm / xử lý từ chối / đề xuất chốt hẹn)",
  "uncovered_fact_key": "khóa thông tin được hé lộ nếu hỏi trúng từ khóa (hoặc null)",
  "objection_resolved": true/false (nếu đã giải tỏa được băn khoăn),
  "is_closing_attempt": true/false (nếu có hành động chốt cọc hoặc mời lái thử),
  "empathy_score": 1-5 (mức độ đồng cảm và lắng nghe),
  "argument_clarity": 1-5 (độ rõ ràng của luận điểm số liệu)
}}
"""
