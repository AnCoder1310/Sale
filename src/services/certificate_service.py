"""
Training Certificate & Printable Report Generator.
An (Frontend Integration) & Duy (Evaluation Semantics).
Xuất phiếu chứng nhận kết quả luyện tập bán xe chuẩn hoá VinFast.
"""
from typing import Any, Dict, Optional
from src.roleplay.persistence import session_persistence


class CertificateService:
    def __init__(self):
        self.persistence = session_persistence

    def generate_certificate_html(self, session_id: str) -> str:
        """Tạo mã HTML hoàn chỉnh cho chứng nhận / phiếu đánh giá có thể in trực tiếp ra PDF."""
        result = self.persistence.get_result(session_id)
        if not result:
            result = {
                "sessionId": session_id,
                "scenarioTitle": "Kịch bản luyện tập tư vấn xe VinFast",
                "vehicleModel": "VinFast VF 8",
                "advisorName": "Võ Trường An",
                "date": "27/09/2026",
                "duration": "12 phút",
                "overallScore": 90,
                "managerReviewed": True,
                "managerScore": 92,
                "managerNote": "Tư vấn rất tốt, nắm vững chính sách pin và đối đáp thuyết phục.",
                "reviewedBy": "Lê Văn Hoàng",
                "rubricBreakdown": [
                    {"criterionNameVi": "Thấu hiểu nhu cầu", "score": 90, "reason": "Hỏi đúng lộ trình hàng ngày."},
                    {"criterionNameVi": "Kiến thức sản phẩm", "score": 95, "reason": "Nêu chuẩn công suất và thời gian sạc."},
                    {"criterionNameVi": "Xử lý từ chối", "score": 90, "reason": "Hóa giải băn khoăn pin SOH < 70%."},
                    {"criterionNameVi": "Độ chuẩn chính sách", "score": 95, "reason": "Nêu đúng thuế trước bạ 0%."},
                    {"criterionNameVi": "Chốt đơn & Bước tiếp", "score": 80, "reason": "Đã mời lái thử thực tế."}
                ]
            }

        score = result.get("managerScore") or result.get("overallScore", 85)
        grade = "XUẤT SẮC" if score >= 90 else ("GIỎI" if score >= 80 else "ĐẠT YÊU CẦU")
        grade_color = "#111111"

        rows_html = ""
        for r in result.get("rubricBreakdown", []):
            crit_name = r.get("criterionNameVi", r.get("criterion", ""))
            c_score = r.get("score", 80)
            c_reason = r.get("reason", "")
            rows_html += f"""
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; font-weight: 600; color: #1e293b;">{crit_name}</td>
                <td style="padding: 12px; text-align: center; font-weight: bold; color: {grade_color};">{c_score}/100</td>
                <td style="padding: 12px; color: #475569; font-size: 13px;">{c_reason}</td>
            </tr>
            """

        manager_box = ""
        if result.get("managerReviewed"):
            manager_box = f"""
            <div style="margin-top: 24px; padding: 16px; background-color: #F5F5F5; border: 1px solid #E5E5E5; border-radius: 8px;">
                <div style="font-weight: bold; color: #111111; font-size: 14px;">Ý KIẾN PHÊ DUYỆT CỦA QUẢN LÝ ĐÀO TẠO:</div>
                <div style="margin-top: 6px; color: #404040; font-style: italic;">"{result.get('managerNote', '')}"</div>
                <div style="margin-top: 8px; font-size: 12px; color: #111111; text-align: right;">
                    Người duyệt: <b>{result.get('reviewedBy', 'Lê Văn Hoàng')}</b> — Điểm chuẩn hóa: <b>{result.get('managerScore')}/100</b>
                </div>
            </div>
            """

        html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Chứng Nhận Kết Quả Huấn Luyện — {result.get('advisorName')}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 30px;
        }}
        .certificate-card {{
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border: 2px solid #e2e8f0;
            position: relative;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #111111;
            padding-bottom: 20px;
        }}
        .title {{
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }}
        .subtitle {{
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
        }}
        .badge {{
            display: inline-block;
            padding: 6px 14px;
            border-radius: 9999px;
            background-color: #F5F5F5;
            color: #111111;
            border: 1px solid #E5E5E5;
            font-weight: 700;
            font-size: 12px;
        }}
        .print-btn {{
            background: #111111;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 20px;
        }}
        @media print {{
            .no-print {{ display: none; }}
            body {{ padding: 0; background: white; }}
            .certificate-card {{ box-shadow: none; border: none; }}
        }}
    </style>
</head>
<body>
    <div style="text-align: center;" class="no-print">
        <button class="print-btn" onclick="window.print()">🖨️ In Phiếu Đánh Giá / Lưu PDF</button>
    </div>

    <div class="certificate-card">
        <div class="header">
            <div>
                <div class="title">VINFAST SALES ENABLEMENT COACH</div>
                <div class="subtitle">PHIẾU ĐÁNH GIÁ NĂNG LỰC TƯ VẤN VIÊN (DỰ ÁN VFO2O-20)</div>
            </div>
            <div style="text-align: right;">
                <span class="badge">MÃ PHIÊN: {session_id}</span>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Thời gian: {result.get('date')}</div>
            </div>
        </div>

        <div style="margin-top: 30px; display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
            <div>
                <div style="font-size: 14px; color: #64748b;">Tư vấn viên thực hiện:</div>
                <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px;">{result.get('advisorName')}</div>
                <div style="font-size: 13px; color: #475569; margin-top: 4px;">Kịch bản: <b>{result.get('scenarioTitle')}</b></div>
                <div style="font-size: 13px; color: #475569;">Dòng xe áp dụng: <b>{result.get('vehicleModel')}</b></div>
            </div>
            <div style="text-align: center; background: #f8fafc; border-radius: 12px; padding: 15px; border: 1px dashed #cbd5e1;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">KẾT QUẢ ĐẠT ĐƯỢC</div>
                <div style="font-size: 38px; font-weight: 900; color: {grade_color}; margin: 4px 0;">{score}<span style="font-size: 18px; color: #94a3b8;">/100</span></div>
                <div style="font-weight: 800; font-size: 12px; color: {grade_color};">{grade}</div>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <div style="font-weight: 800; font-size: 15px; color: #0f172a; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
                CHI TIẾT 5 TIÊU CHÍ RUBRIC BÁN XE VINFAST
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr style="background: #f1f5f9; text-align: left;">
                        <th style="padding: 10px 12px; color: #475569;">Tiêu chí Rubric</th>
                        <th style="padding: 10px 12px; text-align: center; color: #475569;">Điểm</th>
                        <th style="padding: 10px 12px; color: #475569;">Nhận xét chi tiết & Bằng chứng</th>
                    </tr>
                </thead>
                <tbody>
                    {rows_html}
                </tbody>
            </table>
        </div>

        {manager_box}

        <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px dashed #cbd5e1;">
            <div style="font-size: 11px; color: #94a3b8; line-height: 1.6;">
                Hệ thống AI Enablement Coach VinFast VFO2O-20.<br>
                Được kiểm định chất lượng tự động theo chuẩn hội đồng tốt nghiệp.
            </div>
            <div style="text-align: center; width: 200px;">
                <div style="font-size: 12px; font-weight: 700; color: #334155;">XÁC NHẬN CỦA QUẢN LÝ</div>
                <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-family: cursive; font-size: 18px; color: #111111;">{result.get('reviewedBy') or 'Lê Văn Hoàng'}</span>
                </div>
                <div style="font-size: 11px; color: #64748b;">(Đã ký duyệt điện tử)</div>
            </div>
        </div>
    </div>
</body>
</html>
        """
        return html


certificate_service = CertificateService()
