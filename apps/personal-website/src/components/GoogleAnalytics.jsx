import React from "react";

const MEASUREMENT_ID = "G-PZ37S6E5BL";

function getIsProd() {
  return typeof import.meta !== "undefined" && import.meta.env.PROD;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

function initGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
}

export default function GoogleAnalytics() {
  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!getIsProd()) return undefined;
    if (navigator?.doNotTrack === "1") return undefined;
    if (typeof window.gtag === "function") return undefined;

    let canceled = false;
    let started = false;
    let timeoutId;
    const start = async () => {
      if (started) return;
      started = true;
      try {
        await loadScript(
          `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`,
        );
        if (canceled) return;
        initGtag();
      } catch (error) {
        console.warn("[ga] Failed to load gtag.js", error);
      }
    };

    const onFirstInteraction = () => start();
    const interactionEvents = ["pointerdown", "keydown", "touchstart", "scroll"];
    const addInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        window.addEventListener(eventName, onFirstInteraction, {
          passive: true,
          once: true,
        });
      });
    };

    addInteractionListeners();
    const scheduleAfterLoad = () => {
      timeoutId = window.setTimeout(start, 10_000);
    };
    if (document.readyState === "complete") {
      scheduleAfterLoad();
    } else {
      window.addEventListener("load", scheduleAfterLoad, { once: true });
    }

    return () => {
      canceled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
