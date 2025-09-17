import React, { useEffect, useState } from "react";
import { TextRevealer } from "./RevealTextAnimation";

const pad = (n) => String(n).padStart(2, "0");

export default function TwentyFourHourClock({
  showSeconds = true,
  className = "",
  key, // Added for stability in parent lists
}) {
  // State to hold current time (HH:MM or HH:MM:SS)
  const [time, setTime] = useState(() => {
    const d = new Date();
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  });

  // Update clock every second
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      setTime(showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`);
    };

    // Run immediately + set interval
    tick();
    const id = setInterval(tick, 1000);
    console.log("TwentyFourHourClock: Timer started"); // Debug log

    return () => {
      clearInterval(id); // Cleanup timer
      console.log("TwentyFourHourClock: Timer cleared"); // Debug log
    };
  }, [showSeconds]);

  // Debug for mount/unmount lifecycle
  useEffect(() => {
    console.log("TwentyFourHourClock: Mounted");
    return () => console.log("TwentyFourHourClock: Unmounted");
  }, []);

  return (
    // Force text color to dull/off-white (#F5F5F5)
    <div
      className={`${className} text-[#F5F5F5]`}
      aria-label="current-time"
      key={key}
    >
      {/* Reveal animated text (time string) */}
      <TextRevealer text={time} />
    </div>
  );
}
