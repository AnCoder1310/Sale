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
    { id: "all", label: "Tất cả tài liệu (27)" },
    { id: "scenario", label: "🎯 Kịch bản thực chiến (8 Kịch bản)" },
    { id: "competitor_battlecard", label: "⚔️ So sánh đối thủ" },
    { id: "warranty_charging", label: "🔋 Pin & Trạm sạc" },
    { id: "policy", label: "💰 Chính sách & Bảng giá" },
  ];

  const filteredDocs = mockKnowledgeDocs.filter((doc) => {
    if (activeCategory === "scenario") {
      if (!doc.title.toLowerCase().includes("kịch bản") && doc.category !== "sales_technique") return false;
    } else if (activeCategory !== "all" && doc.category !== activeCategory) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (
        !doc.title.toLowerCase().includes(q) &&
        !doc.summary.toLowerCase().includes(q) &&
        !doc.content.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Search */}
      <div className="p-8 rounded-3xl bg-[#111111] text-white shadow-sm border border-[#262626]">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
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
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Showroom Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-slate-900" />
          <span>Dải Sản Phẩm Xe Điện VinFast (7 Mẫu Xe)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`cursor-pointer rounded-3xl bg-white border p-5 transition-all duration-200 shadow-sm group ${
                selectedVehicle?.id === v.id
                  ? "border-slate-900 ring-2 ring-slate-400 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="h-44 w-full rounded-2xl overflow-hidden mb-3 relative bg-slate-900">
                <VehicleImage
                  vehicleId={v.id}
                  model={v.model}
                  src={v.image}
                  fallbackSrc={v.fallbackImage}
                  className="w-full h-full"
                />
                <span className="absolute top-2 left-2 z-20 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold">
                  {v.segment}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-slate-900 transition-colors">
                  {v.model}
                </h3>
                <span className="text-[10px] font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">
                  Bảo hành {v.warranty.split(" ")[0]} năm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{v.tagline}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Giá từ:</span>
                  <span className="font-bold text-slate-900">{v.startingPrice}</span>
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

      {/* Selected Vehicle Specs Detail Card with Large Photo & Dealer Link */}
      {selectedVehicle && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Large High-Res Vehicle Photo Banner */}
            <div className="w-full lg:w-96 h-56 rounded-2xl overflow-hidden relative flex-shrink-0 bg-slate-900 border border-slate-200 shadow-sm">
              <VehicleImage
                vehicleId={selectedVehicle.id}
                model={selectedVehicle.model}
                src={selectedVehicle.image}
                fallbackSrc={selectedVehicle.fallbackImage}
                className="w-full h-full"
              />
              <span className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold">
                {selectedVehicle.segment}
              </span>
            </div>

            {/* Right: Overview & Source Links */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <VinFastLogo size={24} variant="silver" />
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedVehicle.model}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  Bảo hành xe: {selectedVehicle.warranty}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedVehicle.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-900">
                  Giá niêm yết: <span className="text-sm font-black">{selectedVehicle.startingPrice}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-800">
                  Tầm di chuyển: <b>{selectedVehicle.rangeWltp}</b>
                </div>
                {selectedVehicle.sourceUrl && (
                  <a
                    href={selectedVehicle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm ml-auto"
                  >
                    <span>Xem bài viết & hình ảnh gốc</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-slate-100">
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

          <div className="text-xs">
            <p className="font-bold text-slate-800 mb-1.5">Trang bị & Tính năng nổi bật:</p>
            <div className="flex flex-wrap gap-2">
              {selectedVehicle.keyFeatures.map((feat, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-slate-50 text-slate-900 font-medium">
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
            <FileText className="h-4 w-4 text-slate-900" />
            <span>Tài Liệu Chính Sách & Quy Chuẩn Bán Hàng VinFast</span>
          </h2>

          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategory === c.id
                    ? "bg-slate-900 text-white shadow-sm"
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
              className="flex flex-col justify-between rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:border-slate-200 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded">
                    {doc.version} • {doc.effectiveDate}
                  </span>
                  {doc.title.includes("Kịch bản") ? (
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-extrabold text-[10px]">
                      🎯 ĐỒNG BỘ PHÒNG LUYỆN TẬP
                    </span>
                  ) : (
                    <span className="text-slate-400">Độ tin cậy: {(doc.confidenceScore * 100).toFixed(0)}%</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 whitespace-pre-line font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  {doc.content}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="line-clamp-1 italic text-[11px]">Nguồn: {doc.source}</span>
                <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-800 font-semibold text-[10px]">
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
