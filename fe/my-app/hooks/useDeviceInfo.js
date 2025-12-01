"use client";

import { useEffect, useState } from "react";

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;

    const getDeviceType = () => {
      const ua = navigator.userAgent.toLowerCase();
      if (
        ua.includes("mobile") ||
        ua.includes("android") ||
        ua.includes("iphone")
      )
        return "Điện thoại";
      if (ua.includes("ipad") || ua.includes("tablet")) return "Tablet";
      return "Máy tính";
    };

    const collect = async () => {
      const ua = navigator.userAgent;
      const lang = navigator.language;
      const screenSize = `${window.screen.width}x${window.screen.height}`;

      let platform = navigator.platform || null;
      let browser = null;
      let platformVersion = null;
      let model = null;
      let architecture = null;

      const nav = navigator;

      // Chrome / Edge có userAgentData
      if (nav.userAgentData?.getHighEntropyValues) {
        try {
          const brands = nav.userAgentData.brands || [];
          browser = brands.map((b) => `${b.brand} ${b.version}`).join(", ");

          const high = await nav.userAgentData.getHighEntropyValues([
            "platform",
            "platformVersion",
            "architecture",
            "model",
            "uaFullVersion",
          ]);

          platform = high.platform || platform;
          platformVersion = high.platformVersion || null;
          model = high.model || null;
          architecture = high.architecture || null;
        } catch (e) {
          console.warn("Cannot load high entropy UA data", e);
        }
      }

      const deviceType = getDeviceType();

      const friendlyName = `${deviceType} • ${
        platform || "Unknown OS"
      } • ${screenSize}`;

      setDeviceInfo({
        userAgent: ua,
        platform,
        language: lang,
        screenSize,
        browser,
        platformVersion,
        model,
        architecture,
        friendlyName,
      });
    };

    collect();
  }, []);

  return deviceInfo;
}
