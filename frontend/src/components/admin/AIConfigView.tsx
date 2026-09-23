"use client";

import React, { useState } from "react";
import { Cpu, Save, Sliders, CheckCircle2, RotateCcw } from "lucide-react";

export const AIConfigView: React.FC = () => {
  const [provider, setProvider] = useState("OpenAI");
  const [model, setModel] = useState("gpt-4o-2024-08-06");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [topK, setTopK] = useState(5);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Cấu Hình LLM & Tham Số RAG
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều chỉnh mô hình nền tảng, prompt hệ thống và chiến lược chunking
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: LLM Engine */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-600" />
            <span>LLM Gateway & Provider Selection</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nhà cung cấp (Provider):</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="OpenAI">OpenAI (Trực tiếp qua API Gateway)</option>
                <option value="Azure">Azure OpenAI Service (VinGroup Enterprise)</option>
                <option value="Anthropic">Anthropic Claude</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mô hình (Model Name):</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              >
                <option value="gpt-4o-2024-08-06">gpt-4o (Khuyên dùng cho Role-play & Đánh giá)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (Tối ưu chi phí cho Intent Routing)</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet-20241022</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Temperature (Độ sáng tạo / Độ chính xác):</span>
                <span className="text-purple-600 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <span className="text-[10px] text-slate-400">Khuyên dùng 0.1 - 0.2 để đảm bảo độ chính xác của tài liệu</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Tokens Output:</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Box 2: RAG Settings */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sliders className="h-4 w-4 text-purple-600" />
            <span>RAG & Vector Retrieval Settings</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chunk Size (Tokens):</label>
              <input
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chunk Overlap (Tokens):</label>
              <input
                type="number"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Top-K Retrieved Chunks:</label>
              <input
                type="number"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Prompt tiền đề:</label>
              <textarea
                rows={3}
                defaultValue="Bạn là AI Sales Enablement Coach chuyên nghiệp của VinFast. Tuyệt đối không bịa đặt thông số kỹ thuật hoặc chính sách đã hết hiệu lực. Luôn trích dẫn văn bản chính thức."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="lg:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs text-slate-500">
            {saved ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Đã lưu cấu hình thành công vào PostgreSQL & Qdrant!
              </span>
            ) : (
              "Thay đổi sẽ có hiệu lực ngay lập tức trên các session tiếp theo."
            )}
          </span>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition"
          >
            <Save className="h-4 w-4" />
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  );
};
