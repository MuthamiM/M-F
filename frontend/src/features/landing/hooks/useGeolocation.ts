"use client";

import { useState, useCallback } from "react";

export type GeoPermission = "idle" | "requesting" | "granted" | "denied" | "unsupported";

interface GeoCoords {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [permission, setPermission] = useState<GeoPermission>("idle");

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPermission("unsupported");
      return;
    }
    setPermission("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setPermission("granted");
      },
      () => {
        setPermission("denied");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { coords, permission, request };
}
