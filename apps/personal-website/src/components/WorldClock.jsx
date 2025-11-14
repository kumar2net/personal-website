import React, { useState, useEffect } from "react";

const Clock = ({ timeZone, label, city }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("en-GB", options));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  return (
    <div className="flex flex-col items-center px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">
        {time.substring(0, 5)}
      </span>
      <span className="text-xs text-gray-600">{city}</span>
    </div>
  );
};

const WorldClock = () => {
  const timeZones = [
    { label: "SGT", timeZone: "Asia/Singapore", city: "SIN" },
    { label: "IST", timeZone: "Asia/Kolkata", city: "MAA" },
    { label: "UTC", timeZone: "Etc/UTC", city: "LON" },
    { label: "EDT", timeZone: "America/New_York", city: "MCO" },
    { label: "PDT", timeZone: "America/Los_Angeles", city: "SFO" },
  ];

  return (
    <div className="mt-12 flex justify-center gap-2 md:gap-3">
      {timeZones.map(({ label, timeZone, city }) => (
        <Clock key={label} label={label} timeZone={timeZone} city={city} />
      ))}
    </div>
  );
};

export default WorldClock;
