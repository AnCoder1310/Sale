"use client";

import React from "react";
import { VinFastLogo } from "./VinFastLogo";

interface VinFastCarVisualProps {
  vehicleId: string;
  model: string;
  className?: string;
}

export const VinFastCarVisual: React.FC<VinFastCarVisualProps> = ({
  vehicleId,
  model,
  className = ""
}) => {
  // Model specific colors & styling
  const getConfig = () => {
    switch (vehicleId) {
      case "vf-3":
        return {
          bodyColor: "from-amber-400 via-yellow-400 to-amber-500",
          roofColor: "#FFFFFF",
          accentColor: "#F59E0B",
          type: "Mini e-SUV",
          tag: "VF 3"
        };
      case "vf-5":
        return {
          bodyColor: "from-orange-500 via-amber-500 to-orange-600",
          roofColor: "#E2E8F0",
          accentColor: "#F97316",
          type: "A-SUV Đô Thị",
          tag: "VF 5 Plus"
        };
      case "vf-6":
        return {
          bodyColor: "from-teal-600 via-emerald-600 to-teal-700",
          roofColor: "#0F172A",
          accentColor: "#0D9488",
          type: "B-SUV Gia Đình",
          tag: "VF 6"
        };
      case "vf-7":
        return {
          bodyColor: "from-red-600 via-rose-600 to-red-700",
          roofColor: "#0B1220",
          accentColor: "#DC2626",
          type: "C-SUV Phi Thuyền AWD",
          tag: "VF 7"
        };
      case "vf-8":
        return {
          bodyColor: "from-blue-700 via-indigo-700 to-blue-900",
          roofColor: "#0B1220",
          accentColor: "#2563EB",
          type: "D-SUV Toàn Cầu",
          tag: "VF 8"
        };
      case "vf-9":
      default:
        return {
          bodyColor: "from-slate-900 via-slate-800 to-blue-950",
          roofColor: "#0B1220",
          accentColor: "#38BDF8",
          type: "E-SUV Full-size VIP",
          tag: "VF 9"
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-[#0B1220] to-slate-950 flex flex-col justify-between p-4 border border-slate-800 select-none ${className}`}>
      {/* Studio Lighting Glow Behind Car */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-28 rounded-full bg-blue-500/15 blur-2xl pointer-events-none"></div>

      {/* Top badges */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold tracking-wider">
          <VinFastLogo size={12} variant="silver" />
          <span>{config.tag}</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {config.type}
        </span>
      </div>

      {/* Center: Iconic VinFast Front-Fascia Graphic with Signature V-Wing LED Lightbar */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2">
        {/* Car Silhouette Wireframe with Signature LED */}
        <div className="relative w-56 sm:w-64 h-24 flex flex-col items-center justify-center">
          {/* Aerodynamic Windshield & Roof */}
          <div className="w-36 h-9 rounded-t-2xl border-t border-x border-slate-600/60 bg-gradient-to-b from-slate-800/80 to-transparent flex items-center justify-center">
            <div className="w-24 h-4 bg-slate-900/90 rounded-t-lg"></div>
          </div>

          {/* Car Body Shell with Model Paint Gradient */}
          <div className={`w-52 sm:w-56 h-12 rounded-2xl bg-gradient-to-r ${config.bodyColor} shadow-xl relative flex flex-col items-center justify-center border border-white/20`}>
            {/* Signature VinFast LED Lightbar spanning across the front */}
            <div className="relative w-44 flex items-center justify-between px-2">
              {/* Left Wing LED */}
              <div className="flex-1 h-1.5 bg-gradient-to-r from-transparent via-cyan-200 to-white rounded-l-full shadow-[0_0_8px_#38BDF8]"></div>
              
              {/* Center V-Emblem */}
              <div className="mx-2 z-10 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                <VinFastLogo size={18} variant="silver" />
              </div>

              {/* Right Wing LED */}
              <div className="flex-1 h-1.5 bg-gradient-to-l from-transparent via-cyan-200 to-white rounded-r-full shadow-[0_0_8px_#38BDF8]"></div>
            </div>

            {/* Headlight Projectors */}
            <div className="w-full flex justify-between px-4 mt-1.5">
              <div className="w-4 h-2 rounded bg-cyan-100 shadow-[0_0_8px_#38BDF8]"></div>
              <div className="w-4 h-2 rounded bg-cyan-100 shadow-[0_0_8px_#38BDF8]"></div>
            </div>
          </div>

          {/* Wheels & Ground Shadow */}
          <div className="w-48 flex justify-between px-2 -mt-1">
            <div className="w-8 h-3.5 bg-slate-950 rounded-b-lg border-b border-slate-700"></div>
            <div className="w-8 h-3.5 bg-slate-950 rounded-b-lg border-b border-slate-700"></div>
          </div>
          <div className="w-52 h-2 bg-black/60 blur-sm rounded-full -mt-0.5"></div>
        </div>
      </div>

      {/* Bottom Model Name */}
      <div className="relative z-10 flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
        <span className="font-extrabold text-white tracking-wide">{model}</span>
        <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Thuần Điện (EV)
        </span>
      </div>
    </div>
  );
};
