"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  MapPin, 
  Navigation, 
  Search, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  ShieldCheck, 
  Car, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink,
  SlidersHorizontal,
  Route
} from "lucide-react";
import { ChargingStationItem, mockChargingStations } from "@/data/mockChargingStations";
import { chargingApi, RoutePlanResponse } from "@/api/charging";

export const ChargingStationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "planner">("list");
  const [stations, setStations] = useState<ChargingStationItem[]>(mockChargingStations);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [minPowerFilter, setMinPowerFilter] = useState(0);
  const [selectedStation, setSelectedStation] = useState<ChargingStationItem | null>(null);

  // Route Planner States
  const [fromCity, setFromCity] = useState("TP. Vinh");
  const [toCity, setToCity] = useState("Hà Nội");
  const [vehicleModel, setVehicleModel] = useState("VF 8");
  const [routePlan, setRoutePlan] = useState<RoutePlanResponse | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    chargingApi.getStations({
      city: selectedProvince !== "all" ? selectedProvince : undefined,
      min_power: minPowerFilter > 0 ? minPowerFilter : undefined,
    })
      .then((data) => {
        if (data && data.length > 0) {
          setStations(data);
        }
      })
      .catch((err) => console.log("Charging station load error:", err))
      .finally(() => setIsLoading(false));
  }, [selectedProvince, minPowerFilter]);

  const handlePlanRoute = async () => {
    setIsPlanning(true);
    try {
      const res = await chargingApi.planRoute({
        fromCity,
        toCity,
        vehicleModel,
      });
      setRoutePlan(res);
    } catch (err) {
      console.log("Route plan error:", err);
    } finally {
      setIsPlanning(false);
    }
  };

  // Initial Route Plan
  useEffect(() => {
    handlePlanRoute();
  }, []);

  const filteredStations = stations.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-2 border border-white/20">
              <Zap className="h-3.5 w-3.5" />
              <span>Hạ Tầng Năng Lượng V-GREEN • Phủ Sóng 63 Tỉnh Thành</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mạng Lưới Trạm Sạc & Lộ Trình Sạc Thông Minh
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Tra cứu nhanh điểm sạc theo thời gian thực, lập lộ trình liên tỉnh và sử dụng bài tư vấn chuẩn giúp khách hàng xóa bỏ hoàn toàn nỗi lo hết pin khi đi xa.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tổng Cổng Sạc</span>
              <span className="text-2xl font-black text-white mt-0.5 block">150.000+</span>
            </div>
            <div className="p-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sạc 10%-70%</span>
              <span className="text-2xl font-black text-white mt-0.5 block">20 - 24p</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "list"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Danh Sách & Điểm Sạc ({filteredStations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "planner"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Route className="h-4 w-4" />
            <span>Lập Lộ Trình Sạc Thông Minh (AI Route Planner)</span>
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        /* TAB 1: STATIONS LIST & EXPLORER */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên trạm sạc, địa chỉ, trung tâm thương mại hoặc đường phố..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">Khu vực:</span>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-none"
                >
                  <option value="all">Toàn bộ khu vực</option>
                  <option value="Nghệ An">TP. Vinh & Nghệ An</option>
                  <option value="Hà Tĩnh">Hà Tĩnh</option>
                  <option value="Thanh Hóa">Thanh Hóa</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">Công suất:</span>
                <select
                  value={minPowerFilter}
                  onChange={(e) => setMinPowerFilter(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-none"
                >
                  <option value={0}>Tất cả trụ sạc</option>
                  <option value={150}>Từ 150 kW trở lên</option>
                  <option value={250}>Siêu nhanh 250 kW+</option>
                  <option value={300}>Đại công suất 300 kW</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStations.map((st) => (
              <div
                key={st.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-400 transition"
              >
                <div className="space-y-3">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-black text-[10px] tracking-wide border border-slate-200">
                      {st.max_power_kw} kW SIÊU NHANH
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-900"></span>
                      {st.available_ports}/{st.total_ports} Cổng trống
                    </span>
                  </div>

                  {/* Title & Address */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {st.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{st.address}</span>
                    </p>
                  </div>

                  {/* Port Types List */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                    <span className="font-bold text-slate-700 block">Cấu hình trụ sạc:</span>
                    {st.port_types.map((pt, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-600">
                        <span>• {pt.type}</span>
                        <span className="font-bold text-slate-900">{pt.available}/{pt.count} sẵn sàng</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {st.amenities.map((am, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Details button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{st.opening_hours.split("(")[0]}</span>
                  </span>

                  <button
                    onClick={() => {
                      const query = encodeURIComponent(`${st.name} ${st.address}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition"
                  >
                    <span>Chỉ đường</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TAB 2: AI EV ROUTE PLANNER */
        <div className="space-y-6">
          {/* Planner Setup Form */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Route className="h-4 w-4" />
                <span>Thiết Lập Lộ Trình Di Chuyển & Kế Hoạch Sạc Đường Dài</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                AI tự động gợi ý điểm dừng tối ưu trên cao tốc, tính toán thời gian sạc và soạn sẵn luận điểm tư vấn xóa tan nỗi lo hết pin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Điểm xuất phát:</label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none"
                >
                  <option value="TP. Vinh">TP. Vinh (Nghệ An)</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hà Tĩnh">Hà Tĩnh</option>
                  <option value="Thanh Hóa">Thanh Hóa</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Điểm đến:</label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none"
                >
                  <option value="Hà Nội">Hà Nội (~300 km cao tốc)</option>
                  <option value="Đà Nẵng">Đà Nẵng (~465 km ven biển)</option>
                  <option value="Thanh Hóa">Thanh Hóa (~140 km)</option>
                  <option value="Cửa Lò">Bãi biển Cửa Lò (~16 km)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Mẫu xe tư vấn:</label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:outline-none"
                >
                  <option value="VF 3">VinFast VF 3 (Tầm xa 215 km)</option>
                  <option value="VF 5">VinFast VF 5 Plus (Tầm xa 326 km)</option>
                  <option value="VF 6">VinFast VF 6 Plus (Tầm xa 381 km)</option>
                  <option value="VF 7">VinFast VF 7 Plus (Tầm xa 431 km)</option>
                  <option value="VF 8">VinFast VF 8 Plus (Tầm xa 471 km)</option>
                  <option value="VF 9">VinFast VF 9 Plus (Tầm xa 626 km)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePlanRoute}
              disabled={isPlanning}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              <span>{isPlanning ? "Đang lập lộ trình sạc..." : "Tính Toán Lộ Trình Sạc & Sinh Bài Tư Vấn"}</span>
            </button>
          </div>

          {/* Route Plan Results */}
          {routePlan && (
            <div className="space-y-6">
              {/* Route Summary Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                      Lộ trình đề xuất
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">{routePlan.route_name}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Khoảng cách:</span>
                      <strong className="text-white text-base">{routePlan.total_distance_km} km</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Thời gian di chuyển:</span>
                      <strong className="text-white text-base">{routePlan.estimated_drive_time}</strong>
                    </div>
                  </div>
                </div>

                {/* Timeline Stops */}
                <div className="space-y-3 pt-1 text-xs">
                  <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                    Các điểm dừng sạc khuyến nghị trên hành trình:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {routePlan.recommended_stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-extrabold text-[10px]">
                            ĐIỂM DỪNG #{stop.stop_number} • KM {stop.distance_from_start_km}
                          </span>
                          <span className="text-slate-300 text-[11px] font-bold">
                            ⚡ {stop.power}
                          </span>
                        </div>
                        <p className="font-bold text-white text-sm">{stop.station_name}</p>
                        <p className="text-slate-300 text-xs">
                          {stop.action} — <b>Sạc khoảng {stop.charge_time_min} phút</b>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sales Script Pitch Box */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                      💬
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        Bài Tư Vấn Khách Hàng (Advisor Pitch)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Lời thoại mẫu giải thích thuyết phục để xóa bỏ băn khoăn về pin của khách
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(routePlan.advisor_pitch);
                      setCopiedPitch(true);
                      setTimeout(() => setCopiedPitch(false), 2000);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-sm flex items-center gap-1.5 ${
                      copiedPitch
                        ? "bg-slate-900 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {copiedPitch ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedPitch ? "Đã chép!" : "Sao chép bài tư vấn"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 leading-relaxed italic text-xs">
                  "{routePlan.advisor_pitch}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>• Chi phí sạc ước tính: <b>{routePlan.total_charging_cost_estimate}</b></span>
                  <span>• Bảo hành xe: <b>7 - 10 năm hoặc 200.000 km</b></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
