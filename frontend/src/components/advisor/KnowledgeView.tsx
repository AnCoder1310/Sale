"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  Car, 
  FileText, 
  ExternalLink, 
  BadgeCheck, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { mockVehicles } from "@/data/mockVehicles";
import { mockKnowledgeDocs } from "@/data/mockKnowledge";
import { Vehicle, KnowledgeDoc } from "@/types";
import { VehicleImage } from "@/components/ui/VehicleImage";
import { VinFastLogo } from "@/components/ui/VinFastLogo";

export const KnowledgeView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(mockVehicles[0]);

  const categories = [
    { id: "all", label: "Tất cả tài liệu" },
    { id: "policy", label: "Chính sách & Ưu đãi" },
    { id: "warranty_charging", label: "Bảo hành & Trạm sạc" },
    { id: "competitor_battlecard", label: "So sánh đối thủ (Battlecard)" },
  ];

  const filteredDocs = mockKnowledgeDocs.filter((doc) => {
    if (activeCategory !== "all" && doc.category !== activeCategory) return false;
    if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase()) && !doc.summary.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Search */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1220] via-slate-900 to-blue-950 text-white shadow-xl border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <VinFastLogo size={14} variant="silver" />
            <span>Kho Tri Thức Bán Hàng & Thông Số Kỹ Thuật VinFast</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight">Tra Cứu Dải Xe Điện & Chính Sách 2026</h1>
          <p className="text-xs text-slate-300">
            Tất cả tài liệu được số hóa, gắn nhãn phiên bản và thẩm định bởi Khối Bán hàng & Dịch vụ Hậu mãi VinFast.
          </p>

          <div className="relative pt-2">
            <Search className="absolute left-3.5 top-5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm: chính sách pin, bảo hành 10 năm, trạm sạc V-GREEN, ADAS..."
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Showroom Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-blue-600" />
          <span>Dải Sản Phẩm Xe Thuần Điện VinFast (6 Mẫu Xe)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`cursor-pointer rounded-3xl bg-white border p-5 transition-all duration-200 shadow-sm group ${
                selectedVehicle?.id === v.id
                  ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="h-44 w-full rounded-2xl overflow-hidden mb-3 relative bg-slate-900">
                <VehicleImage
                  vehicleId={v.id}
                  model={v.model}
                  src={v.image}
                  className="w-full h-full"
                />
                <span className="absolute top-2 left-2 z-20 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold">
                  {v.segment}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {v.model}
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Bảo hành {v.warranty.split(" ")[0]} năm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{v.tagline}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Giá từ:</span>
                  <span className="font-bold text-blue-600">{v.startingPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tầm hoạt động:</span>
                  <span className="font-semibold text-slate-800">{v.rangeWltp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Vehicle Specs Detail Card */}
      {selectedVehicle && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <VinFastLogo size={20} variant="blue" />
              <h3 className="text-base font-bold text-slate-900">
                Thông số kỹ thuật chi tiết: {selectedVehicle.model} ({selectedVehicle.segment})
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Bảo hành xe: {selectedVehicle.warranty}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Công suất tối đa:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{selectedVehicle.powerHp} HP ({selectedVehicle.torqueNm} Nm)</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Tăng tốc / Vận hành:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{selectedVehicle.acceleration}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Sạc siêu nhanh:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{selectedVehicle.fastCharging}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Bảo hành bộ Pin:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{selectedVehicle.batteryWarranty}</p>
            </div>
          </div>

          <div className="pt-2 text-xs">
            <p className="font-bold text-slate-800 mb-1.5">Trang bị & Tính năng nổi bật:</p>
            <div className="flex flex-wrap gap-2">
              {selectedVehicle.keyFeatures.map((feat, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-medium">
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Knowledge Documents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Tài Liệu Chính Sách & Quy Chuẩn Bán Hàng VinFast</span>
          </h2>

          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategory === c.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:border-blue-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {doc.version} • {doc.effectiveDate}
                  </span>
                  <span className="text-slate-400">Độ tin cậy: {(doc.confidenceScore * 100).toFixed(0)}%</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 whitespace-pre-line font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  {doc.content}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="line-clamp-1 italic text-[11px]">Nguồn: {doc.source}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                  Hiệu lực
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
