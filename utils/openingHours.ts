export const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
export type Day = (typeof DAYS)[number];

const DAYS_SET = new Set<string>(DAYS);
const isDayCode = (code: string): code is Day => DAYS_SET.has(code);

const parseDays = (daysPart: string): Day[] => {
  if (daysPart.includes(",")) return daysPart.split(",").filter(isDayCode);

  const parts = daysPart.split("-");
  if (parts.length === 2 && isDayCode(parts[0]) && isDayCode(parts[1])) {
    const startIdx = DAYS.indexOf(parts[0]);
    const endIdx = DAYS.indexOf(parts[1]);
    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx)
      return DAYS.slice(startIdx, endIdx + 1);
  }

  if (isDayCode(daysPart)) return [daysPart];

  return [];
};

interface Schedule {
  days: Day[];
  startTime: string;
  endTime: string;
}

const parseOpeningHours = (value: string): Schedule[] => {
  if (!value?.trim()) return [];

  return value
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const trimmed = line.trim();
      const spaceIdx = trimmed.indexOf(" ");
      if (spaceIdx === -1)
        return { days: parseDays(trimmed), startTime: "", endTime: "" };

      const daysPart = trimmed.slice(0, spaceIdx);
      const timePart = trimmed.slice(spaceIdx + 1);
      const dashIdx = timePart.indexOf("-");
      return {
        days: parseDays(daysPart),
        startTime: dashIdx !== -1 ? timePart.slice(0, dashIdx) : timePart,
        endTime: dashIdx !== -1 ? timePart.slice(dashIdx + 1) : "",
      };
    })
    .filter((s) => s.days.length > 0);
};

export interface OpeningHoursDisplayConfig {
  formatDay: (day: Day) => string;
  rangeSeparator: string;
  delimiter: string;
}

const formatDisplayDays = (
  days: Day[],
  { formatDay, rangeSeparator, delimiter }: OpeningHoursDisplayConfig,
): string => {
  if (days.length === 0) return "";
  if (days.length === 1) return formatDay(days[0]);

  const first = DAYS.indexOf(days[0]);
  const last = DAYS.indexOf(days[days.length - 1]);
  const isConsecutive = last - first === days.length - 1;

  if (isConsecutive)
    return `${formatDay(days[0])}${rangeSeparator}${formatDay(days[days.length - 1])}`;

  return days.map(formatDay).join(delimiter);
};

export const formatOpeningHoursForDisplay = (
  value: string,
  config: OpeningHoursDisplayConfig,
): string[] => {
  const schedules = parseOpeningHours(value);
  const keys = [...new Set(schedules.map(({ days }) => days.join(",")))];

  return keys.map((key) => {
    const group = schedules.filter(({ days }) => days.join(",") === key);
    const times = group
      .filter(({ startTime, endTime }) => startTime && endTime)
      .map(({ startTime, endTime }) => `${startTime}–${endTime}`);

    const daysLabel = formatDisplayDays(group[0].days, config);

    return times.length === 0
      ? daysLabel
      : `${daysLabel}　${times.join(config.delimiter)}`;
  });
};
