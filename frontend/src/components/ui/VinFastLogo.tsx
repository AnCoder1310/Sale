"use client";

import React, { useState } from "react";

interface VinFastLogoProps {
  className?: string;
  size?: number;
  variant?: "silver" | "white" | "blue";
  showWordmark?: boolean;
}

export const VinFastLogo: React.FC<VinFastLogoProps> = ({
  className = "",
  size = 36,
  variant = "silver",
  showWordmark = false,
}) => {
  const [useFallback, setUseFallback] = useState(false);

  // Official VinFast 3D Chrome Emblem URL (Wikimedia Commons Official Asset)
  const officialLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/VinFast_logo.svg/512px-VinFast_logo.svg.png";

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {!useFallback ? (
        <img
          src={officialLogoUrl}
          alt="VinFast Logo"
          width={size}
          height={size}
          onError={() => setUseFallback(true)}
          className="object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          style={{ width: size, height: size }}
        />
      ) : (
        /* High-fidelity 3D Metallic Chrome Vector Fallback (Faceted wings with specular highlights) */
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
        >
          <defs>
            {/* Chrome Top Highlight */}
            <linearGradient id="chrome-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Chrome Shaded Inner Face */}
            <linearGradient id="chrome-shadow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="45%" stopColor="#64748B" />
              <stop offset="85%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Inner Wing Bright Reflection */}
            <linearGradient id="chrome-inner" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F1F5F9" />
              <stop offset="80%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Outer Left Wing - Light Facet */}
          <path
            d="M 14 20 C 26 34, 40 64, 50 88 C 44 65, 30 38, 14 20 Z"
            fill="url(#chrome-highlight)"
          />
          {/* Outer Left Wing - Shadow Facet (Beveled center ridge) */}
          <path
            d="M 14 20 C 32 38, 45 62, 50 88 C 48 70, 36 44, 22 26 Z"
            fill="url(#chrome-shadow)"
            opacity="0.85"
          />

          {/* Outer Right Wing - Light Facet */}
          <path
            d="M 86 20 C 74 34, 60 64, 50 88 C 56 65, 70 38, 86 20 Z"
            fill="url(#chrome-highlight)"
          />
          {/* Outer Right Wing - Shadow Facet (Beveled center ridge) */}
          <path
            d="M 86 20 C 68 38, 55 62, 50 88 C 52 70, 64 44, 78 26 Z"
            fill="url(#chrome-shadow)"
            opacity="0.85"
          />

          {/* Inner Wing Left */}
          <path
            d="M 28 26 C 37 38, 45 56, 50 72 C 46 56, 38 40, 28 26 Z"
            fill="url(#chrome-inner)"
          />

          {/* Inner Wing Right */}
          <path
            d="M 72 26 C 63 38, 55 56, 50 72 C 54 56, 62 40, 72 26 Z"
            fill="url(#chrome-inner)"
          />

          {/* Center Specular Glint */}
          <circle cx="50" cy="72" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </svg>
      )}

      {showWordmark && (
        <span className="font-black tracking-[0.25em] text-[9px] text-white uppercase mt-1">
          VINFAST
        </span>
      )}
    </div>
  );
};
