"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { useGeolocation } from "../hooks/useGeolocation";

const OFFICES = [
  { name: "London, UK", latitude: 51.5074, longitude: -0.1278 },
  { name: "Nairobi, Kenya", latitude: -1.2921, longitude: 36.8219 },
  { name: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792 },
];

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearestOffice() {
  const { coords, permission, request } = useGeolocation();

  const nearest = useMemo(() => {
    if (!coords) return null;
    return OFFICES
      .map((o) => ({ ...o, distance: distanceKm(coords.latitude, coords.longitude, o.latitude, o.longitude) }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [coords]);

  return (
    <div className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-[#3E4C59]" />
        <h3 className="font-bold text-graphite text-sm sm:text-base">Find Your Nearest Office</h3>
      </div>

      {!nearest && (
        <>
          <p className="text-xs sm:text-sm text-slate leading-relaxed">
            Share your location and we&apos;ll show you the closest M&amp;F Technologies hub. This is optional and only used to calculate distance.
          </p>
          <button
            type="button"
            onClick={request}
            disabled={permission === "requesting"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#3E4C59] hover:bg-[#1B222C] transition-colors px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {permission === "requesting" ? "Locating…" : "Share My Location"}
          </button>
          {permission === "denied" && (
            <p className="text-xs text-slate">Location access was denied. You can still reach out via the Contact page.</p>
          )}
          {permission === "unsupported" && (
            <p className="text-xs text-slate">Your browser doesn&apos;t support location sharing.</p>
          )}
        </>
      )}

      {nearest && (
        <p className="text-xs sm:text-sm text-slate leading-relaxed">
          Your nearest hub is <strong className="text-graphite">{nearest.name}</strong>, approximately {Math.round(nearest.distance)} km away.
        </p>
      )}
    </div>
  );
}
