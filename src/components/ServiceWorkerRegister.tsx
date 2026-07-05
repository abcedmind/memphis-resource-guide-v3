"use client";

import { useEffect } from "react";

/** Registers the offline-support service worker (browse-mode caching). */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // offline support is progressive enhancement — never block the app
      });
    }
  }, []);
  return null;
}
