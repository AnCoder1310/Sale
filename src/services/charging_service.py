from typing import Any, Dict, List, Optional

class ChargingService:
    def __init__(self):
        self.stations: List[Dict[str, Any]] = [
            # === KHU VỰC TP. VINH & NGHỆ AN ===
            {
                "id": "vg-na-01",
                "name": "Trạm sạc V-GREEN TTTM Vincom Plaza Vinh",
                "code": "VG-NA-VINH-01",
                "address": "Số 01 Đường Quang Trung, Phường Quang Trung, TP. Vinh, Nghệ An",
                "province": "Nghệ An",
                "city": "TP. Vinh",
                "lat": 18.6732,
                "lng": 105.6784,
                "distance_km": 1.2,
                "total_ports": 12,
                "available_ports": 9,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ nhanh 60kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh (Miễn phí 100% cho chủ xe VinFast hưởng ưu đãi 2026)",
                "opening_hours": "24/7 (Bãi đỗ xe hầm B1 & B2)",
                "amenities": ["VinMart", "Cà phê Highlands", "Nhà hàng ẩm thực", "Rạp chiếu phim CGV", "WC sạch sẽ", "Bảo vệ 24/7"],
                "featured": True,
                "notes": "Có làn ưu tiên sạc cho xe VF 8, VF 9 và dịch vụ cứu hộ pin lưu động."
            },
            {
                "id": "vg-na-02",
                "name": "Trạm sạc V-GREEN Showroom VinFast Vinh - Đại lộ Lê Nin",
                "code": "VG-NA-VINH-02",
                "address": "Km 3+500 Đại lộ Lê Nin, Phường Hà Huy Tập, TP. Vinh, Nghệ An",
                "province": "Nghệ An",
                "city": "TP. Vinh",
                "lat": 18.6925,
                "lng": 105.6882,
                "distance_km": 0.1,
                "total_ports": 16,
                "available_ports": 13,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 6, "available": 5},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 6, "available": 5},
                    {"type": "AC Tiêu chuẩn 11kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh (Miễn phí theo gói ưu đãi)",
                "opening_hours": "24/7",
                "amenities": ["Phòng chờ VIP Showroom", "Trà & Cà phê miễn phí", "Wifi tốc độ cao", "Xưởng dịch vụ chính hãng"],
                "featured": True,
                "notes": "Trạm sạc trung tâm tại Showroom, có kỹ thuật viên hướng dẫn sạc cho khách mới nhận xe."
            },
            {
                "id": "vg-na-03",
                "name": "Trạm sạc V-GREEN Trạm dừng nghỉ Cao tốc Diễn Châu - Bãi Vọt",
                "code": "VG-NA-EXPWY-01",
                "address": "Km 452 Cao tốc Diễn Châu - Bãi Vọt (Địa phận Nghi Lộc, Nghệ An)",
                "province": "Nghệ An",
                "city": "Huyện Nghi Lộc",
                "lat": 18.7845,
                "lng": 105.6120,
                "distance_km": 14.5,
                "total_ports": 20,
                "available_ports": 15,
                "status": "active",
                "max_power_kw": 300,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 300kW", "count": 8, "available": 6},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 8, "available": 6},
                    {"type": "CCS2 Trụ 60kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Trạm dừng chân cao tốc", "Trạm xăng dầu", "Siêu thị tiện lợi", "Quán cơm phục vụ 24/7", "WC miễn phí"],
                "featured": True,
                "notes": "Trạm sạc chiến lược trên tuyến cao tốc Bắc - Nam, sạc từ 10% - 70% chỉ 20 - 24 phút."
            },
            {
                "id": "vg-na-04",
                "name": "Trạm sạc V-GREEN Cây xăng PVOIL Quán Bàu QL1A",
                "code": "VG-NA-PVOIL-01",
                "address": "Ngã tư Quán Bàu, Đường Mai Hắc Đế, TP. Vinh, Nghệ An",
                "province": "Nghệ An",
                "city": "TP. Vinh",
                "lat": 18.6998,
                "lng": 105.6710,
                "distance_km": 2.8,
                "total_ports": 8,
                "available_ports": 5,
                "status": "active",
                "max_power_kw": 150,
                "port_types": [
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 2},
                    {"type": "CCS2 Trụ nhanh 60kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Cửa hàng tiện ích", "Cây xăng PVOIL", "Rửa xe nhanh"],
                "featured": False,
                "notes": "Vị trí cửa ngõ phía Bắc TP. Vinh trên tuyến Quốc lộ 1A."
            },
            {
                "id": "vg-na-05",
                "name": "Trạm sạc V-GREEN Quảng trường Bình Minh - Thị xã Cửa Lò",
                "code": "VG-NA-CUALO-01",
                "address": "Đường Bình Minh, Phường Nghi Hương, Thị xã Cửa Lò, Nghệ An",
                "province": "Nghệ An",
                "city": "Thị xã Cửa Lò",
                "lat": 18.7981,
                "lng": 105.7334,
                "distance_km": 16.2,
                "total_ports": 10,
                "available_ports": 7,
                "status": "active",
                "max_power_kw": 180,
                "port_types": [
                    {"type": "CCS2 Trụ nhanh 180kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ nhanh 60kW", "count": 4, "available": 3},
                    {"type": "AC 11kW", "count": 2, "available": 1}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Bãi biển Cửa Lò", "Khách sạn lân cận", "Nhà hàng hải sản", "Khu dạo bộ"],
                "featured": False,
                "notes": "Phục vụ khách du lịch tắm biển và dã ngoại cuối tuần tại Cửa Lò."
            },
            {
                "id": "vg-na-06",
                "name": "Trạm sạc V-GREEN Quần thể Vinpearl Cửa Hội Resort & Spa",
                "code": "VG-NA-VINPEARL-01",
                "address": "Đường Bình Minh, Bãi biển Cửa Hội, Nghi Hải, Thị xã Cửa Lò, Nghệ An",
                "province": "Nghệ An",
                "city": "Thị xã Cửa Lò",
                "lat": 18.7712,
                "lng": 105.7512,
                "distance_km": 18.0,
                "total_ports": 12,
                "available_ports": 10,
                "status": "active",
                "max_power_kw": 150,
                "port_types": [
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 4},
                    {"type": "CCS2 Trụ nhanh 60kW", "count": 4, "available": 3},
                    {"type": "AC Tiêu chuẩn 11kW", "count": 4, "available": 3}
                ],
                "pricing": "Miễn phí sạc cho khách lưu trú Vinpearl / 3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Resort 5 sao", "Hồ bơi", "Nhà hàng cao cấp", "Spa thư giãn"],
                "featured": True,
                "notes": "Trạm sạc nghỉ dưỡng cao cấp kết hợp cáp treo Cửa Hội - Đảo Song Ngư."
            },
            {
                "id": "vg-na-07",
                "name": "Trạm sạc V-GREEN Trung tâm Thị xã Hoàng Mai",
                "code": "VG-NA-HOANGMAI-01",
                "address": "Quốc lộ 1A, Phường Quỳnh Thiện, Thị xã Hoàng Mai, Nghệ An",
                "province": "Nghệ An",
                "city": "Thị xã Hoàng Mai",
                "lat": 19.2450,
                "lng": 105.7120,
                "distance_km": 68.0,
                "total_ports": 12,
                "available_ports": 8,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 2},
                    {"type": "CCS2 Trụ 60kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Trạm dừng nghỉ", "Nhà hàng", "Trạm xăng dầu"],
                "featured": False,
                "notes": "Điểm sạc cửa ngõ phía Bắc tỉnh Nghệ An giáp ranh Thanh Hóa."
            },

            # === TUYẾN HUYẾT MẠCH KẾT NỐI: HÀ NỘI - THANH HÓA - HÀ TĨNH - ĐÀ NẴNG ===
            {
                "id": "vg-th-01",
                "name": "Trạm sạc V-GREEN TTTM Vincom Plaza Thanh Hóa",
                "code": "VG-TH-VINCOM-01",
                "address": "Số 27 Đường Trần Phú, Phường Điện Biên, TP. Thanh Hóa",
                "province": "Thanh Hóa",
                "city": "TP. Thanh Hóa",
                "lat": 19.8066,
                "lng": 105.7845,
                "distance_km": 138.0,
                "total_ports": 14,
                "available_ports": 9,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 6, "available": 4},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ 60kW", "count": 4, "available": 2}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Vincom", "Highlands Coffee", "Ẩm thực", "WC"],
                "featured": True,
                "notes": "Điểm sạc lý tưởng giữa chặng Hà Nội ⇄ Vinh."
            },
            {
                "id": "vg-ht-01",
                "name": "Trạm sạc V-GREEN Vincom Plaza Hà Tĩnh",
                "code": "VG-HT-VINCOM-01",
                "address": "Góc ngã tư Hà Huy Tập - Hàm Nghi, TP. Hà Tĩnh",
                "province": "Hà Tĩnh",
                "city": "TP. Hà Tĩnh",
                "lat": 18.3421,
                "lng": 105.9056,
                "distance_km": 52.0,
                "total_ports": 12,
                "available_ports": 8,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 4, "available": 3},
                    {"type": "CCS2 Trụ 60kW", "count": 4, "available": 2}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Vincom", "Siêu thị WinMart", "Phòng vé CGV"],
                "featured": True,
                "notes": "Điểm sạc nhanh tiện lợi đi về phía Nam Đèo Ngang."
            },
            {
                "id": "vg-hn-01",
                "name": "Trạm sạc V-GREEN Đại đô thị Vinhomes Smart City",
                "code": "VG-HN-SMART-01",
                "address": "Tây Mỗ - Đại Mỗ, Quận Nam Từ Liêm, Hà Nội",
                "province": "Hà Nội",
                "city": "Hà Nội",
                "lat": 20.9995,
                "lng": 105.7420,
                "distance_km": 295.0,
                "total_ports": 48,
                "available_ports": 36,
                "status": "active",
                "max_power_kw": 300,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 300kW", "count": 16, "available": 12},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 20, "available": 16},
                    {"type": "AC 11kW", "count": 12, "available": 8}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["TTTM Vincom Mega Mall", "Khu công viên Nhật Bản", "Hàng chục quán cafe & ẩm thực"],
                "featured": True,
                "notes": "Đại trạm sạc lớn bậc nhất miền Bắc."
            },
            {
                "id": "vg-dn-01",
                "name": "Trạm sạc V-GREEN TTTM Vincom Plaza Ngô Quyền - Đà Nẵng",
                "code": "VG-DN-VINCOM-01",
                "address": "Số 910A Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, TP. Đà Nẵng",
                "province": "Đà Nẵng",
                "city": "TP. Đà Nẵng",
                "lat": 16.0712,
                "lng": 108.2325,
                "distance_km": 465.0,
                "total_ports": 16,
                "available_ports": 11,
                "status": "active",
                "max_power_kw": 250,
                "port_types": [
                    {"type": "CCS2 Trụ siêu nhanh 250kW", "count": 6, "available": 4},
                    {"type": "CCS2 Trụ nhanh 150kW", "count": 6, "available": 4},
                    {"type": "CCS2 Trụ 60kW", "count": 4, "available": 3}
                ],
                "pricing": "3.858 VNĐ/kWh",
                "opening_hours": "24/7",
                "amenities": ["Vincom", "Sân băng nghệ thuật", "Nhà hàng", "Cầu Sông Hàn kế bên"],
                "featured": True,
                "notes": "Trạm sạc trung tâm thành phố biển Đà Nẵng."
            }
        ]

    def get_stations(
        self,
        province: Optional[str] = None,
        city: Optional[str] = None,
        min_power: Optional[int] = None,
        max_distance: Optional[float] = None,
        only_available: bool = False
    ) -> List[Dict[str, Any]]:
        results = self.stations
        if province and province != "all":
            results = [s for s in results if s.get("province", "").lower() == province.lower()]
        if city and city != "all":
            results = [s for s in results if city.lower() in s.get("city", "").lower() or city.lower() in s.get("address", "").lower()]
        if min_power and min_power > 0:
            results = [s for s in results if s.get("max_power_kw", 0) >= min_power]
        if max_distance and max_distance > 0:
            results = [s for s in results if s.get("distance_km", 999) <= max_distance]
        if only_available:
            results = [s for s in results if s.get("available_ports", 0) > 0]
        return results

    def get_station_by_id(self, station_id: str) -> Optional[Dict[str, Any]]:
        for s in self.stations:
            if s["id"] == station_id:
                return s
        return None

    def plan_route(self, from_city: str, to_city: str, vehicle_model: str = "VF 8") -> Dict[str, Any]:
        """Tự động tính toán lộ trình và điểm sạc dừng nghỉ cho khách hàng."""
        if "hà nội" in to_city.lower() or "hanoi" in to_city.lower():
            # Chặng Vinh -> Hà Nội (~300 km)
            return {
                "route_name": "Lộ trình: TP. Vinh, Nghệ An ⇄ Thủ đô Hà Nội",
                "total_distance_km": 298,
                "estimated_drive_time": "3 giờ 45 phút (Toàn tuyến Cao tốc)",
                "vehicle_model": vehicle_model,
                "recommended_stops": [
                    {
                        "stop_number": 1,
                        "station_name": "Trạm sạc Trạm dừng nghỉ Cao tốc Diễn Châu - Bãi Vọt (Km 452)",
                        "distance_from_start_km": 15,
                        "action": "Tùy chọn: Bổ sung 10 phút nếu xuất phát dưới 50% pin",
                        "charge_time_min": 10,
                        "power": "300kW Siêu nhanh"
                    },
                    {
                        "stop_number": 2,
                        "station_name": "Trạm sạc V-GREEN TTTM Vincom Plaza Thanh Hóa",
                        "distance_from_start_km": 140,
                        "action": "Nghỉ giữa chặng: Ăn nhẹ & Sạc pin từ 25% lên 80%",
                        "charge_time_min": 22,
                        "power": "250kW Siêu nhanh"
                    }
                ],
                "advisor_pitch": "Dạ anh hoàn toàn an tâm nhé! Cung đường từ Vinh ra Hà Nội dài khoảng 300km, chiếc VF 8 sạc đầy đi được hơn 450km là ra thẳng Hà Nội không cần ghé sạc. Nếu anh muốn dừng chân nghỉ ngơi ăn nhẹ tại Thanh Hóa (cách Vinh 140km), anh chỉ cần cắm sạc đúng 20 phút tại trạm 250kW của Vincom Thanh Hóa là pin lại đầy 80%, vừa an toàn vừa thư thái!",
                "total_charging_cost_estimate": "0 VNĐ (Áp dụng tặng 1 năm sạc miễn phí V-GREEN)"
            }
        elif "đà nẵng" in to_city.lower() or "danang" in to_city.lower():
            # Chặng Vinh -> Đà Nẵng (~465 km)
            return {
                "route_name": "Lộ trình: TP. Vinh, Nghệ An ⇄ TP. Đà Nẵng",
                "total_distance_km": 465,
                "estimated_drive_time": "7 giờ 30 phút",
                "vehicle_model": vehicle_model,
                "recommended_stops": [
                    {
                        "stop_number": 1,
                        "station_name": "Trạm sạc V-GREEN Vincom Plaza Hà Tĩnh",
                        "distance_from_start_km": 52,
                        "action": "Điểm dừng cà phê sáng",
                        "charge_time_min": 15,
                        "power": "250kW Siêu nhanh"
                    },
                    {
                        "stop_number": 2,
                        "station_name": "Trạm sạc V-GREEN Vincom Plaza Đồng Hới, Quảng Bình",
                        "distance_from_start_km": 200,
                        "action": "Nghỉ trưa ăn cơm & Sạc pin từ 20% lên 80%",
                        "charge_time_min": 25,
                        "power": "250kW Siêu nhanh"
                    },
                    {
                        "stop_number": 3,
                        "station_name": "Trạm sạc V-GREEN TTTM Vincom Plaza Huế",
                        "distance_from_start_km": 365,
                        "action": "Dừng chân giải lao 15 phút trước khi qua Hầm Hải Vân vào Đà Nẵng",
                        "charge_time_min": 15,
                        "power": "250kW Siêu nhanh"
                    }
                ],
                "advisor_pitch": "Với chuyến đi từ Vinh vào Đà Nẵng dài 465km, cứ cách 40-50km dọc Quốc lộ 1A đều có trạm sạc V-GREEN. Anh chỉ cần dừng nghỉ ăn trưa 25 phút tại Vincom Đồng Hới là xe nạp đủ pin chạy thẳng vào Đà Nẵng, không hề có cảm giác lo hết pin!",
                "total_charging_cost_estimate": "0 VNĐ (Áp dụng miễn phí trạm sạc V-GREEN)"
            }
        else:
            return {
                "route_name": f"Lộ trình đô thị & Ngoại tỉnh TP. Vinh ⇄ {to_city}",
                "total_distance_km": 80,
                "estimated_drive_time": "1 giờ 30 phút",
                "vehicle_model": vehicle_model,
                "recommended_stops": [
                    {
                        "stop_number": 1,
                        "station_name": "Trạm sạc V-GREEN Vincom Plaza Vinh (Quang Trung)",
                        "distance_from_start_km": 1.2,
                        "action": "Sạc đầy qua đêm hoặc sạc nhanh 25 phút",
                        "charge_time_min": 25,
                        "power": "250kW Siêu nhanh"
                    }
                ],
                "advisor_pitch": "Tại TP. Vinh, mật độ trạm sạc rất dày đặc: từ Vincom Quang Trung, Đại lộ Lê Nin cho đến bãi biển Cửa Lò và cao tốc Diễn Châu đều có trụ siêu nhanh 250kW. Anh đi làm hàng ngày thì 1 tuần chỉ cần sạc đúng 1 lần thôi ạ!",
                "total_charging_cost_estimate": "0 VNĐ"
            }

charging_service = ChargingService()
