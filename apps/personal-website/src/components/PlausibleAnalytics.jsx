import React from "react";
import { ensureAnalyticsReady } from "../lib/analytics";

export default function PlausibleAnalytics() {
  React.useEffect(() => {
    void ensureAnalyticsReady();
  }, []);

  return null;
}
