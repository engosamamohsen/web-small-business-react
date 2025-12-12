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
    const userAgent = navigator.userAgent || navigator.vendor || window?.opera;

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
