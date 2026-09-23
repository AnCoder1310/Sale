"use client";

import React, { useState } from "react";
import { VinFastCarVisual } from "./VinFastCarVisual";

interface VehicleImageProps {
  vehicleId: string;
  model: string;
  src?: string;
  alt?: string;
  className?: string;
}

export const VehicleImage: React.FC<VehicleImageProps> = ({
  vehicleId,
  model,
  src,
  alt = "",
  className = ""
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return <VinFastCarVisual vehicleId={vehicleId} model={model} className={className} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-2xl bg-slate-900 ${className}`}>
      {/* Background visual during loading */}
      {isLoading && (
        <div className="absolute inset-0 z-0">
          <VinFastCarVisual vehicleId={vehicleId} model={model} />
        </div>
      )}

      <img
        src={src}
        alt={alt || model}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
