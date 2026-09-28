import { apiClient } from "./client";
import { ChargingStationItem, mockChargingStations } from "@/data/mockChargingStations";

export interface ChargingFilterParams {
  city?: string;
  min_power?: number;
  max_distance?: number;
}

export interface RoutePlanRequest {
  fromCity: string;
  toCity: string;
  vehicleModel?: string;
}

export interface RouteStop {
  stop_number: number;
  station_name: string;
  distance_from_start_km: number;
  action: string;
  charge_time_min: number;
  power: string;
}

export interface RoutePlanResponse {
  route_name: string;
  total_distance_km: number;
  estimated_drive_time: string;
  vehicle_model: string;
  recommended_stops: RouteStop[];
  advisor_pitch: string;
  total_charging_cost_estimate: string;
}

export const chargingApi = {
  getStations: async (params?: ChargingFilterParams): Promise<ChargingStationItem[]> => {
    const query = new URLSearchParams();
    if (params?.city) query.append("city", params.city);
    if (params?.min_power) query.append("min_power", params.min_power.toString());
    if (params?.max_distance) query.append("max_distance", params.max_distance.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";

    try {
      return await apiClient<ChargingStationItem[]>(`/charging/stations${qs}`);
    } catch {
      // Offline / fallback to rich mock stations
      let filtered = mockChargingStations;
      if (params?.city && params.city !== "all") {
        filtered = filtered.filter(
          (s) =>
            s.city.toLowerCase().includes(params.city!.toLowerCase()) ||
            s.province.toLowerCase().includes(params.city!.toLowerCase())
        );
      }
      if (params?.min_power) {
        filtered = filtered.filter((s) => s.max_power_kw >= params.min_power!);
      }
      return filtered;
    }
  },

  getStationById: async (id: string): Promise<ChargingStationItem | null> => {
    try {
      return await apiClient<ChargingStationItem>(`/charging/stations/${id}`);
    } catch {
      return mockChargingStations.find((s) => s.id === id) || null;
    }
  },

  planRoute: async (data: RoutePlanRequest): Promise<RoutePlanResponse> => {
    try {
      return await apiClient<RoutePlanResponse>("/charging/plan-route", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      return {
        route_name: `Lộ trình ${data.fromCity} ⇄ ${data.toCity}`,
        total_distance_km: 300,
        estimated_drive_time: "3 giờ 45 phút",
        vehicle_model: data.vehicleModel || "VF 8",
        recommended_stops: [
          {
            stop_number: 1,
            station_name: "Trạm sạc V-GREEN Vincom Plaza Thanh Hóa",
            distance_from_start_km: 140,
            action: "Nghỉ giữa chặng: Ăn nhẹ & Sạc pin từ 25% lên 80%",
            charge_time_min: 22,
            power: "250kW Siêu nhanh",
          },
        ],
        advisor_pitch: `Dạ anh hoàn toàn an tâm nhé! Chiếc ${data.vehicleModel || "VF 8"} sạc đầy đi được hơn 450km. Suốt cung đường cứ cách 40-50km đều có trạm sạc siêu nhanh 250kW của V-GREEN, dừng uống cà phê 20 phút là xe lại đầy pin chạy tiếp!`,
        total_charging_cost_estimate: "0 VNĐ (Áp dụng tặng 1 năm sạc miễn phí V-GREEN)",
      };
    }
  },
};
