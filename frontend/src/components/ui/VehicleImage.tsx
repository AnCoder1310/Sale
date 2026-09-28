"use client";

import React, { useState, useEffect, useMemo } from "react";
import { VinFastCarVisual } from "./VinFastCarVisual";

interface VehicleImageProps {
  vehicleId: string;
  model: string;
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicleId,
  model,
  src,
  fallbackSrc,
  alt = "",
  className = ""
}) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Stable single cache key to guarantee constant dependency array size
  const cacheKey = `${vehicleId}::${src || ""}::${fallbackSrc || ""}`;

  const candidates = useMemo(() => {
    const list: string[] = [];
    list.push(`/vehicles/${vehicleId}.jpg`);
    list.push(`/vehicles/${vehicleId}.png`);
    if (src && !list.includes(src)) list.push(src);
    if (fallbackSrc && !list.includes(fallbackSrc)) list.push(fallbackSrc);
    return list;
  }, [cacheKey]);

  useEffect(() => {
    setCurrentSrcIndex(0);
    setHasError(false);
    setIsLoading(true);
  }, [cacheKey]);

  const handleError = () => {
    if (currentSrcIndex + 1 < candidates.length) {
      setCurrentSrcIndex((prev) => prev + 1);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const activeSrc = candidates[currentSrcIndex];

  if (hasError || !activeSrc) {
    return <VinFastCarVisual vehicleId={vehicleId} model={model} className={className} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl bg-slate-900 ${className}`}>
      {/* Background vector visual during initial image load */}
      {isLoading && (
        <div className="absolute inset-0 z-0">
          <VinFastCarVisual vehicleId={vehicleId} model={model} />
        </div>
      )}

      <img
        src={activeSrc}
        alt={alt || model}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-200 relative z-10 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
