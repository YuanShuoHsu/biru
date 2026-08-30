// vibe coding

import type { Dayjs } from "dayjs";

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

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const isOvernight = ({
  startTime,
  endTime,
}: Pick<Schedule, "startTime" | "endTime">): boolean =>
  toMinutes(endTime) <= toMinutes(startTime);

const hasNextDayTail = (schedule: Schedule): boolean =>
  isOvernight(schedule) && toMinutes(schedule.endTime) > 0;

const isAllDay = ({ startTime, endTime }: Schedule): boolean =>
  toMinutes(startTime) === 0 && toMinutes(endTime) === 0;

const SCHEDULE_CACHE_LIMIT = 64;
const scheduleCache = new Map<string, Schedule[]>();

const parseOpeningHours = (value: string): Schedule[] => {
  const cached = scheduleCache.get(value);
  if (cached) return cached;

  const schedules = parseSchedules(value);
  scheduleCache.set(value, schedules);

  if (scheduleCache.size > SCHEDULE_CACHE_LIMIT) {
    const oldest = scheduleCache.keys().next().value;
    if (oldest !== undefined) scheduleCache.delete(oldest);
  }

  return schedules;
};

const parseSchedules = (value: string): Schedule[] => {
  if (!value?.trim()) return [];

  return value
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const trimmed = line.trim();
      const spaceIdx = trimmed.indexOf(" ");
      if (spaceIdx === -1)
        return {
          days: parseDays(trimmed),
          startTime: "00:00",
          endTime: "00:00",
        };

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

const getDaySchedules = (value: string, at: Dayjs): Schedule[] => {
  const day = DAYS[(at.day() + 6) % 7];

  return parseOpeningHours(value).filter(
    (schedule) =>
      schedule.days.includes(day) && !!schedule.startTime && !!schedule.endTime,
  );
};

const isUnrestricted = (value: string): boolean =>
  parseOpeningHours(value).length === 0;

export const isOpenOn = (value: string, at: Dayjs): boolean =>
  isUnrestricted(value) ||
  getDaySchedules(value, at).length > 0 ||
  getDaySchedules(value, at.subtract(1, "day")).some(hasNextDayTail);

export const getCloseTimeAt = (value: string, at: Dayjs): Dayjs | null => {
  const minutes = at.hour() * 60 + at.minute();
  const startOfDay = at.startOf("day");

  const current = getDaySchedules(value, at).find((schedule) =>
    isOvernight(schedule)
      ? minutes >= toMinutes(schedule.startTime)
      : minutes >= toMinutes(schedule.startTime) &&
        minutes < toMinutes(schedule.endTime),
  );
  if (current)
    return startOfDay
      .add(isOvernight(current) ? 1 : 0, "day")
      .add(toMinutes(current.endTime), "minute");

  const previous = getDaySchedules(value, at.subtract(1, "day")).find(
    (schedule) =>
      isOvernight(schedule) && minutes < toMinutes(schedule.endTime),
  );

  return previous
    ? startOfDay.add(toMinutes(previous.endTime), "minute")
    : null;
};

export const isOpenAt = (value: string, at: Dayjs): boolean =>
  isUnrestricted(value) || !!getCloseTimeAt(value, at);

export interface OpeningHoursDisplayConfig {
  formatDay: (day: Day) => string;
  formatNextDayTime: (time: string) => string;
  allDayLabel: string;
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
      .map((schedule) =>
        isAllDay(schedule)
          ? config.allDayLabel
          : `${schedule.startTime}–${
              hasNextDayTail(schedule)
                ? config.formatNextDayTime(schedule.endTime)
                : schedule.endTime
            }`,
      );

    const daysLabel = formatDisplayDays(group[0].days, config);

    return times.length === 0
      ? daysLabel
      : `${daysLabel}　${times.join(config.delimiter)}`;
  });
};
