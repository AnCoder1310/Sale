"""
Financial & TCO (Total Cost of Ownership) Calculator Service.
Chương (Platform) & Duy (Sales Enablement Strategy).
Cung cấp công cụ tính toán tài chính tức thì cho tư vấn viên:
1. Tính dự toán vay trả góp ngân hàng (dư nợ giảm dần hoặc cố định).
2. So sánh tổng chi phí sở hữu TCO giữa xe điện VinFast và xe xăng đối thủ.
"""
from typing import Any, Dict, List, Optional


class FinancialCalculatorService:
    """Công cụ tính toán tài chính và bài toán kinh tế xe điện."""

    VINFAST_MODELS_SPECS = {
        "VF 3": {"price": 240_000_000, "kwh_per_100km": 9.0, "default_battery_fee": 900_000},
        "VF 5": {"price": 468_000_000, "kwh_per_100km": 12.0, "default_battery_fee": 1_600_000},
        "VF 6": {"price": 675_000_000, "kwh_per_100km": 14.5, "default_battery_fee": 1_800_000},
        "VF 7": {"price": 850_000_000, "kwh_per_100km": 16.0, "default_battery_fee": 1_800_000},
        "VF 8": {"price": 1_090_000_000, "kwh_per_100km": 18.0, "default_battery_fee": 2_900_000},
        "VF 9": {"price": 1_589_000_000, "kwh_per_100km": 20.0, "default_battery_fee": 3_500_000},
    }

    COMPETITOR_BENCHMARKS = {
        "Mazda CX-5": {"price": 829_000_000, "fuel_l_per_100km": 7.5, "fuel_price_per_l": 23_000},
        "Hyundai Santa Fe": {"price": 1_120_000_000, "fuel_l_per_100km": 10.0, "fuel_price_per_l": 23_000},
        "Ford Explorer": {"price": 2_099_000_000, "fuel_l_per_100km": 13.0, "fuel_price_per_l": 24_000},
        "Toyota Raize": {"price": 498_000_000, "fuel_l_per_100km": 6.6, "fuel_price_per_l": 23_000},
        "Toyota Vios": {"price": 458_000_000, "fuel_l_per_100km": 6.8, "fuel_price_per_l": 23_000},
    }

    ELECTRIC_PRICE_PER_KWH = 3_858  # Đơn giá sạc công cộng V-GREEN tiêu chuẩn (VNĐ/kWh)

    def calculate_loan(
        self,
        car_price: float,
        down_payment_pct: float = 20.0,
        annual_interest_rate_pct: float = 5.0,
        loan_years: int = 5
    ) -> Dict[str, Any]:
        """
        Tính toán bảng dự trù trả góp ngân hàng.
        - car_price: Giá xe (VNĐ)
        - down_payment_pct: Tỷ lệ trả trước (thường 15-30%)
        - annual_interest_rate_pct: Lãi suất năm (ưu đãi 5.0%)
        - loan_years: Thời gian vay (3-8 năm)
        """
        down_payment = car_price * (down_payment_pct / 100.0)
        loan_amount = car_price - down_payment
        total_months = loan_years * 12

        monthly_principal = loan_amount / total_months
        monthly_interest_first_month = loan_amount * (annual_interest_rate_pct / 100.0 / 12.0)
        first_month_total = monthly_principal + monthly_interest_first_month

        # Tổng tiền lãi dự tính theo phương pháp dư nợ giảm dần
        total_interest = (loan_amount * (annual_interest_rate_pct / 100.0) * (loan_years + (1 / 12))) / 2.0
        total_payment = car_price + total_interest

        return {
            "carPrice": int(car_price),
            "downPaymentPct": down_payment_pct,
            "downPaymentAmount": int(down_payment),
            "loanAmount": int(loan_amount),
            "loanYears": loan_years,
            "annualInterestRatePct": annual_interest_rate_pct,
            "monthlyPrincipal": int(monthly_principal),
            "firstMonthPayment": int(first_month_total),
            "estimatedTotalInterest": int(total_interest),
            "estimatedTotalPayment": int(total_payment),
            "summaryVi": (
                f"Trả trước {int(down_payment):,} VNĐ ({down_payment_pct}%). "
                f"Vay {int(loan_amount):,} VNĐ trong {loan_years} năm với lãi suất {annual_interest_rate_pct}%/năm. "
                f"Tháng đầu trả khoảng {int(first_month_total):,} VNĐ (giảm dần từng tháng)."
            )
        }

    def calculate_tco(
        self,
        vehicle_model: str = "VF 7",
        competitor_model: str = "Mazda CX-5",
        monthly_km: int = 1500,
        period_years: int = 5,
        battery_option: str = "rental"  # rental hoặc buyout
    ) -> Dict[str, Any]:
        """
        So sánh Tổng Chi Phí Sở Hữu (TCO - Total Cost of Ownership):
        Bao gồm:
        - Tiết kiệm 100% lệ phí trước bạ (khoảng 10-12% giá xe)
        - Chi phí nhiên liệu (Điện vs Xăng)
        - Chi phí thuê pin (nếu chọn thuê)
        - Chi phí bảo dưỡng (xe điện rẻ hơn ~50% so với xe xăng)
        """
        vf_spec = self.VINFAST_MODELS_SPECS.get(vehicle_model, self.VINFAST_MODELS_SPECS["VF 7"])
        comp_spec = self.COMPETITOR_BENCHMARKS.get(competitor_model, self.COMPETITOR_BENCHMARKS["Mazda CX-5"])

        total_km = monthly_km * 12 * period_years

        # 1. Chi phí điện sạc VinFast
        kwh_total = (total_km / 100.0) * vf_spec["kwh_per_100km"]
        vf_energy_cost = kwh_total * self.ELECTRIC_PRICE_PER_KWH

        # Chi phí pin
        if battery_option == "rental":
            battery_cost_total = vf_spec["default_battery_fee"] * 12 * period_years
        else:
            battery_cost_total = 0

        # Chi phí bảo dưỡng xe điện (ước tính 80đ/km)
        vf_maintenance_cost = total_km * 80

        # Ưu đãi thuế trước bạ 0% (xe xăng nộp 10-12%)
        ice_registration_tax = comp_spec["price"] * 0.10
        vf_registration_tax = 0

        total_vf_operating_cost = vf_energy_cost + battery_cost_total + vf_maintenance_cost

        # 2. Chi phí xe xăng đối thủ
        liters_total = (total_km / 100.0) * comp_spec["fuel_l_per_100km"]
        ice_fuel_cost = liters_total * comp_spec["fuel_price_per_l"]
        ice_maintenance_cost = total_km * 250  # Xe xăng bảo dưỡng thay dầu định kỳ ~250đ/km

        total_ice_operating_cost = ice_fuel_cost + ice_maintenance_cost

        # Tổng chênh lệch tiết kiệm
        energy_savings = ice_fuel_cost - vf_energy_cost
        maintenance_savings = ice_maintenance_cost - vf_maintenance_cost
        total_savings = (
            (total_ice_operating_cost + ice_registration_tax)
            - (total_vf_operating_cost + vf_registration_tax)
        )

        return {
            "vehicleModel": vehicle_model,
            "competitorModel": competitor_model,
            "monthlyKm": monthly_km,
            "periodYears": period_years,
            "totalKm": total_km,
            "batteryOption": battery_option,
            "taxSavings": int(ice_registration_tax),
            "energyCostVinFast": int(vf_energy_cost),
            "fuelCostCompetitor": int(ice_fuel_cost),
            "maintenanceCostVinFast": int(vf_maintenance_cost),
            "maintenanceCostCompetitor": int(ice_maintenance_cost),
            "batteryCostTotal": int(battery_cost_total),
            "totalOperatingVinFast": int(total_vf_operating_cost),
            "totalOperatingCompetitor": int(total_ice_operating_cost),
            "netSavings": int(total_savings),
            "savingsPerMonth": int(total_savings / (period_years * 12)),
            "summaryVi": (
                f"Trong {period_years} năm ({total_km:,} km), lựa chọn {vehicle_model} giúp tiết kiệm "
                f"tổng cộng {int(total_savings):,} VNĐ so với {competitor_model} "
                f"(gồm {int(ice_registration_tax):,} VNĐ thuế trước bạ 0% và {int(energy_savings):,} VNĐ tiền nhiên liệu)."
            )
        }


financial_calculator = FinancialCalculatorService()
