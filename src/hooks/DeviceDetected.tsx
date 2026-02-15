"use client";
import { useLayoutEffect, useState } from "react";
// Extend the Window interface to include opera
declare global {
  interface Window {
    opera?: any;
  }
}
type DeviceType = "iPhone" | "Mac" | "Other";

function UseDeviceDetected() {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const detectDevice = () => {
    if (typeof window === "undefined") return;
    const nav = window.navigator as any;
    const userAgent = nav.userAgent || nav.vendor || (window as any).opera;

    if (/iPhone/.test(userAgent)) {
      setDeviceType("iPhone");
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
      setDeviceType("Mac");
    } else {
      setDeviceType("Other");
    }
  };

  useLayoutEffect(() => {
    detectDevice();
  }, []);
  return { deviceType };
}

export default UseDeviceDetected;
