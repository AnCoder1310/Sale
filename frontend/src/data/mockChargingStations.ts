export interface PortTypeInfo {
  type: string;
  count: number;
  available: number;
}

export interface ChargingStationItem {
  id: string;
  name: string;
  code: string;
  address: string;
  province: string;
  city: string;
  lat: number;
  lng: number;
  distance_km: number;
  total_ports: number;
  available_ports: number;
  status: "active" | "maintenance";
  max_power_kw: number;
  port_types: PortTypeInfo[];
  pricing: string;
  opening_hours: string;
  amenities: string[];
  featured: boolean;
  notes: string;
}

export const mockChargingStations: ChargingStationItem[] = [
  {
    id: "vg-na-01",
    name: "Trạm sạc V-GREEN TTTM Vincom Plaza Vinh",
    code: "VG-NA-VINH-01",
    address: "Số 01 Đường Quang Trung, Phường Quang Trung, TP. Vinh, Nghệ An",
    province: "Nghệ An",
    city: "TP. Vinh",
    lat: 18.6732,
    lng: 105.6784,
    distance_km: 1.2,
    total_ports: 12,
    available_ports: 9,
    status: "active",
    max_power_kw: 250,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 250kW", count: 4, available: 3 },
      { type: "CCS2 Trụ nhanh 150kW", count: 4, available: 3 },
      { type: "CCS2 Trụ nhanh 60kW", count: 4, available: 3 }
    ],
    pricing: "3.858 VNĐ/kWh (Miễn phí 100% cho chủ xe VinFast hưởng ưu đãi 2026)",
    opening_hours: "24/7 (Bãi đỗ xe hầm B1 & B2)",
    amenities: ["VinMart", "Highlands Coffee", "Nhà hàng ẩm thực", "Rạp chiếu phim CGV", "WC sạch sẽ", "Bảo vệ 24/7"],
    featured: true,
    notes: "Có làn ưu tiên sạc cho xe VF 8, VF 9 và dịch vụ cứu hộ pin lưu động."
  },
  {
    id: "vg-na-02",
    name: "Trạm sạc V-GREEN Showroom VinFast Vinh - Đại lộ Lê Nin",
    code: "VG-NA-VINH-02",
    address: "Km 3+500 Đại lộ Lê Nin, Phường Hà Huy Tập, TP. Vinh, Nghệ An",
    province: "Nghệ An",
    city: "TP. Vinh",
    lat: 18.6925,
    lng: 105.6882,
    distance_km: 0.1,
    total_ports: 16,
    available_ports: 13,
    status: "active",
    max_power_kw: 250,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 250kW", count: 6, available: 5 },
      { type: "CCS2 Trụ nhanh 150kW", count: 6, available: 5 },
      { type: "AC Tiêu chuẩn 11kW", count: 4, available: 3 }
    ],
    pricing: "3.858 VNĐ/kWh (Miễn phí theo gói ưu đãi)",
    opening_hours: "24/7",
    amenities: ["Phòng chờ VIP Showroom", "Trà & Cà phê miễn phí", "Wifi tốc độ cao", "Xưởng dịch vụ chính hãng"],
    featured: true,
    notes: "Trạm sạc trung tâm tại Showroom, có kỹ thuật viên hướng dẫn sạc cho khách mới nhận xe."
  },
  {
    id: "vg-na-03",
    name: "Trạm sạc V-GREEN Trạm dừng nghỉ Cao tốc Diễn Châu - Bãi Vọt",
    code: "VG-NA-EXPWY-01",
    address: "Km 452 Cao tốc Diễn Châu - Bãi Vọt (Địa phận Nghi Lộc, Nghệ An)",
    province: "Nghệ An",
    city: "Huyện Nghi Lộc",
    lat: 18.7845,
    lng: 105.6120,
    distance_km: 14.5,
    total_ports: 20,
    available_ports: 15,
    status: "active",
    max_power_kw: 300,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 300kW", count: 8, available: 6 },
      { type: "CCS2 Trụ nhanh 150kW", count: 8, available: 6 },
      { type: "CCS2 Trụ 60kW", count: 4, available: 3 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["Trạm dừng chân cao tốc", "Trạm xăng dầu", "Siêu thị tiện lợi", "Quán cơm phục vụ 24/7", "WC miễn phí"],
    featured: true,
    notes: "Trạm sạc chiến lược trên tuyến cao tốc Bắc - Nam, sạc từ 10% - 70% chỉ 20 - 24 phút."
  },
  {
    id: "vg-na-04",
    name: "Trạm sạc V-GREEN Bãi biển Cửa Lò (Quảng trường Bình Minh)",
    code: "VG-NA-CUALO-01",
    address: "Đường Bình Minh, Phường Nghi Hương, Thị xã Cửa Lò, Nghệ An",
    province: "Nghệ An",
    city: "Thị xã Cửa Lò",
    lat: 18.8055,
    lng: 105.7198,
    distance_km: 16.0,
    total_ports: 10,
    available_ports: 7,
    status: "active",
    max_power_kw: 150,
    port_types: [
      { type: "CCS2 Trụ nhanh 150kW", count: 4, available: 3 },
      { type: "CCS2 Trụ nhanh 60kW", count: 4, available: 3 },
      { type: "AC 11kW", count: 2, available: 1 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["Bãi đỗ xe view biển", "Khu ẩm thực hải sản", "Khách sạn nghỉ dưỡng"],
    featured: false,
    notes: "Phục vụ khách du lịch tắm biển và xe công nghệ chạy tuyến Vinh - Cửa Lò."
  },
  {
    id: "vg-th-01",
    name: "Trạm sạc V-GREEN TTTM Vincom Plaza Thanh Hóa",
    code: "VG-TH-VINCOM-01",
    address: "Số 27 Đường Trần Phú, Phường Điện Biên, TP. Thanh Hóa",
    province: "Thanh Hóa",
    city: "TP. Thanh Hóa",
    lat: 19.8066,
    lng: 105.7845,
    distance_km: 138.0,
    total_ports: 14,
    available_ports: 9,
    status: "active",
    max_power_kw: 250,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 250kW", count: 6, available: 4 },
      { type: "CCS2 Trụ nhanh 150kW", count: 4, available: 3 },
      { type: "CCS2 Trụ 60kW", count: 4, available: 2 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["Vincom", "Highlands Coffee", "Ẩm thực", "WC"],
    featured: true,
    notes: "Điểm sạc lý tưởng giữa chặng Hà Nội ⇄ Vinh."
  },
  {
    id: "vg-ht-01",
    name: "Trạm sạc V-GREEN Vincom Plaza Hà Tĩnh",
    code: "VG-HT-VINCOM-01",
    address: "Góc ngã tư Hà Huy Tập - Hàm Nghi, TP. Hà Tĩnh",
    province: "Hà Tĩnh",
    city: "TP. Hà Tĩnh",
    lat: 18.3421,
    lng: 105.9056,
    distance_km: 52.0,
    total_ports: 12,
    available_ports: 8,
    status: "active",
    max_power_kw: 250,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 250kW", count: 4, available: 3 },
      { type: "CCS2 Trụ nhanh 150kW", count: 4, available: 3 },
      { type: "CCS2 Trụ 60kW", count: 4, available: 2 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["Vincom", "VinMart", "Cafe", "Trạm xăng"],
    featured: false,
    notes: "Phục vụ cư dân và hành khách tuyến Nghệ An - Hà Tĩnh."
  },
  {
    id: "vg-hn-01",
    name: "Đại trạm sạc V-GREEN Vinhomes Smart City Hà Nội",
    code: "VG-HN-SMARTCITY-01",
    address: "Khu đô thị Vinhomes Smart City, Nam Từ Liêm, Hà Nội",
    province: "Hà Nội",
    city: "Hà Nội",
    lat: 20.9995,
    lng: 105.7420,
    distance_km: 295.0,
    total_ports: 48,
    available_ports: 36,
    status: "active",
    max_power_kw: 300,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 300kW", count: 16, available: 12 },
      { type: "CCS2 Trụ nhanh 150kW", count: 20, available: 16 },
      { type: "AC 11kW", count: 12, available: 8 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["TTTM Vincom Mega Mall", "Khu công viên Nhật Bản", "Hàng chục quán cafe & ẩm thực"],
    featured: true,
    notes: "Đại trạm sạc lớn bậc nhất miền Bắc."
  },
  {
    id: "vg-dn-01",
    name: "Trạm sạc V-GREEN TTTM Vincom Plaza Ngô Quyền - Đà Nẵng",
    code: "VG-DN-VINCOM-01",
    address: "Số 910A Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, TP. Đà Nẵng",
    province: "Đà Nẵng",
    city: "TP. Đà Nẵng",
    lat: 16.0712,
    lng: 108.2325,
    distance_km: 465.0,
    total_ports: 16,
    available_ports: 11,
    status: "active",
    max_power_kw: 250,
    port_types: [
      { type: "CCS2 Trụ siêu nhanh 250kW", count: 6, available: 4 },
      { type: "CCS2 Trụ nhanh 150kW", count: 6, available: 4 },
      { type: "CCS2 Trụ 60kW", count: 4, available: 3 }
    ],
    pricing: "3.858 VNĐ/kWh",
    opening_hours: "24/7",
    amenities: ["Vincom", "Sân băng nghệ thuật", "Nhà hàng", "Cầu Sông Hàn kế bên"],
    featured: true,
    notes: "Trạm sạc trung tâm thành phố biển Đà Nẵng."
  }
];
