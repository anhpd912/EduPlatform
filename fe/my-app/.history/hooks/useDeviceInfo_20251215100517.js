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
      let ipAddress = null;
      let location = null;
      let city = null;
      let country = null;

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

      // Lấy IP và vị trí từ API công khai
      try {
        const response = await fetch("https://ipinfo.io/json/");
        if (response.ok) {
          const data = await response.json();
          ipAddress = data.ip;
          city = data.city;
          country = data.country;
          location = `${city || "Unknown"}, ${country || "Unknown"}`;
          console.log("Device Data: ", ipAddress, location);
        }
      } catch (e) {
        console.warn("Cannot fetch IP and location data", e);
        // Fallback: thử API khác nếu API đầu tiên fail
        try {
          const fallbackResponse = await fetch(
            "https://geolocation-db.com/json/"
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            ipAddress = fallbackData.IPv4;
            city = fallbackData.city;
            country = fallbackData.country_name;
            location = `${city || "Unknown"}, ${country || "Unknown"}`;
          }
        } catch (fallbackError) {
          console.warn("Fallback IP API also failed", fallbackError);
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
        ipAddress,
        location,
        city,
        country,
        friendlyName,
      });
    };

    collect();
  }, []);

  return deviceInfo;
}
