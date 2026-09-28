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
          bodyColor: "bg-[#404040]",
          roofColor: "#FFFFFF",
          accentColor: "#737373",
          type: "Mini e-SUV",
          tag: "VF 3"
        };
      case "vf-5":
        return {
          bodyColor: "bg-[#262626]",
          roofColor: "#E2E8F0",
          accentColor: "#737373",
          type: "A-SUV Đô Thị",
          tag: "VF 5 Plus"
        };
      case "vf-6":
        return {
          bodyColor: "bg-[#1F1F1F]",
          roofColor: "#171717",
          accentColor: "#737373",
          type: "B-SUV Gia Đình",
          tag: "VF 6"
        };
      case "vf-7":
        return {
          bodyColor: "bg-[#171717]",
          roofColor: "#171717",
          accentColor: "#737373",
          type: "C-SUV Phi Thuyền AWD",
          tag: "VF 7"
        };
      case "vf-8":
        return {
          bodyColor: "bg-[#141414]",
          roofColor: "#171717",
          accentColor: "#737373",
          type: "D-SUV Toàn Cầu",
          tag: "VF 8"
        };
      case "vf-9":
      default:
        return {
          bodyColor: "bg-[#0A0A0A]",
          roofColor: "#171717",
          accentColor: "#737373",
          type: "E-SUV Full-size VIP",
          tag: "VF 9"
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`relative w-full h-full min-h-[160px] rounded-2xl overflow-hidden bg-[#111111] flex flex-col justify-between p-4 border border-slate-800 select-none ${className}`}>
      {/* Studio Lighting Glow Behind Car */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-28 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

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
          <div className="w-36 h-9 rounded-t-2xl border-t border-x border-slate-600/60 bg-[#1F1F1F] flex items-center justify-center">
            <div className="w-24 h-4 bg-slate-900/90 rounded-t-lg"></div>
          </div>

          {/* Car Body Shell with Model Paint Gradient */}
          <div className={`w-52 sm:w-56 h-12 rounded-2xl ${config.bodyColor} shadow-xl relative flex flex-col items-center justify-center border border-white/20`}>
            {/* Signature VinFast LED Lightbar spanning across the front */}
            <div className="relative w-44 flex items-center justify-between px-2">
              {/* Left Wing LED */}
              <div className="flex-1 h-1.5 bg-white rounded-l-full shadow-[0_0_6px_rgba(255,255,255,0.7)]"></div>
              
              {/* Center V-Emblem */}
              <div className="mx-2 z-10 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                <VinFastLogo size={18} variant="silver" />
              </div>

              {/* Right Wing LED */}
              <div className="flex-1 h-1.5 bg-white rounded-r-full shadow-[0_0_6px_rgba(255,255,255,0.7)]"></div>
            </div>

            {/* Headlight Projectors */}
            <div className="w-full flex justify-between px-4 mt-1.5">
              <div className="w-4 h-2 rounded bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"></div>
              <div className="w-4 h-2 rounded bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]"></div>
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
        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
          Thuần Điện (EV)
        </span>
      </div>
    </div>
  );
};
