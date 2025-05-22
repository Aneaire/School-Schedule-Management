import { HOURS } from "~/utils/time";
import { Button } from "./ui/button";

const Test = () => {
  function formatHour(hour: number): string {
    const h = Math.floor(hour);
    const m = (hour - h) * 60;
    const hh = h.toString().padStart(2, "0");
    const mm = m === 0 ? "00" : "30";
    return `${hh}:${mm}`;
  }

  const formattedHours = HOURS.map(formatHour);

  const formatHourTo12Hour = (hour: number): string => {
    const h = Math.floor(hour) % 12 || 12;
    const minute = (hour % 1) * 60;
    const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
    return `${h}:${minute < 10 ? "0" + minute : minute} ${ampm}`;
  };

  const seedTimes = HOURS.map((hour) => {
    const startHour = formatHour(hour);
    const endHour = formatHour(hour + 0.5);

    return {
      startTime: startHour,
      endTime: endHour,
    };
  });

  return (
    <Button onClick={() => console.log(" seedTimes", seedTimes)}>Test</Button>
  );
};

export default Test;
