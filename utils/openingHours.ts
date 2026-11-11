import type { Dayjs } from "dayjs";

import type { components } from "@/types/api";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type Day = (typeof DAYS)[number];

const DAYS_SET = new Set<string>(DAYS);
const isDayCode = (code: string): code is Day => DAYS_SET.has(code);

const parseDays = (daysPart: string): Day[] => {
  const days = new Set<Day>();

  for (const segment of daysPart.split(",")) {
    if (isDayCode(segment)) {
      days.add(segment);
      continue;
    }

    const [start, end, ...rest] = segment.split("-");
    if (rest.length > 0 || !isDayCode(start) || !isDayCode(end)) continue;

    const startIdx = DAYS.indexOf(start);
    const endIdx = DAYS.indexOf(end);
    if (startIdx <= endIdx)
      for (const day of DAYS.slice(startIdx, endIdx + 1)) days.add(day);
  }

  return DAYS.filter((day) => days.has(day));
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

  return value.split("\n").flatMap((line) => {
    const trimmed = line.trim();
    const spaceIdx = trimmed.indexOf(" ");

    const days = parseDays(
      spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx),
    );
    if (days.length === 0) return [];

    if (spaceIdx === -1)
      return [{ days, startTime: "00:00", endTime: "00:00" }];

    return trimmed
      .slice(spaceIdx + 1)
      .split(",")
      .map((segment) => {
        const dashIdx = segment.indexOf("-");

        return {
          days,
          startTime:
            dashIdx !== -1 ? segment.slice(0, dashIdx).trim() : segment.trim(),
          endTime: dashIdx !== -1 ? segment.slice(dashIdx + 1).trim() : "",
        };
      });
  });
};

type SpecialHours = components["schemas"]["PublicSpecialHoursDto"];

const ALL_DAY: Schedule = {
  days: [...DAYS],
  startTime: "00:00",
  endTime: "00:00",
};

export const MINUTES_PER_DAY = 24 * 60;

const findSpecialHours = (
  specialHours: SpecialHours[],
  at: Dayjs,
): SpecialHours | undefined => {
  const date = at.format("YYYY-MM-DD");

  return specialHours.find(
    ({ validFrom, validThrough }) => validFrom <= date && date <= validThrough,
  );
};

const getDaySchedules = (
  value: string,
  specialHours: SpecialHours[],
  at: Dayjs,
): Schedule[] => {
  const special = findSpecialHours(specialHours, at);
  const schedules = parseOpeningHours(
    special ? (special.openingHours ?? "") : value,
  );
  const day = DAYS[(at.day() + 6) % 7];

  return (special || schedules.length ? schedules : [ALL_DAY]).filter(
    (schedule) =>
      schedule.days.includes(day) && !!schedule.startTime && !!schedule.endTime,
  );
};

export const hasSpecialHoursAt = (
  specialHours: SpecialHours[],
  at: Dayjs,
): boolean => {
  if (findSpecialHours(specialHours, at)) return true;

  const yesterday = at.subtract(1, "day");

  return (
    !!findSpecialHours(specialHours, yesterday) &&
    getDaySchedules("", specialHours, yesterday).some(hasNextDayTail)
  );
};

type Interval = [start: number, end: number];

const getOpenIntervals = (
  value: string,
  specialHours: SpecialHours[],
  date: Dayjs,
): Interval[] => [
  ...getDaySchedules(value, specialHours, date).map(
    (schedule): Interval => [
      toMinutes(schedule.startTime),
      isOvernight(schedule) ? MINUTES_PER_DAY : toMinutes(schedule.endTime),
    ],
  ),
  ...getDaySchedules(value, specialHours, date.subtract(1, "day"))
    .filter(hasNextDayTail)
    .map((schedule): Interval => [0, toMinutes(schedule.endTime)]),
];

interface OpeningDay {
  isOpen: boolean;
  isOpenAt: (minute: number) => boolean;
  minutesUntilClose: (minute: number, enough: number) => number;
}

export const getOpeningDay = (
  value: string,
  date: Dayjs,
  specialHours: SpecialHours[] = [],
): OpeningDay => {
  const startOfDay = date.startOf("day");
  const intervalsByOffset: Interval[][] = [];
  const intervalsOn = (offset: number) =>
    (intervalsByOffset[offset] ??= getOpenIntervals(
      value,
      specialHours,
      startOfDay.add(offset, "day"),
    ));

  const today = intervalsOn(0);

  return {
    isOpen: today.length > 0,

    isOpenAt: (minute) =>
      today.some(([start, end]) => start <= minute && minute < end),

    minutesUntilClose: (minute, enough) => {
      let elapsed = 0;

      for (let offset = 0, cursor = minute; ; offset++, cursor = 0) {
        const intervals = intervalsOn(offset);
        let end = cursor;

        for (let extended = true; extended; ) {
          extended = false;
          for (const [start, stop] of intervals)
            if (start <= end && end < stop) {
              end = stop;
              extended = true;
            }
        }

        elapsed += end - cursor;
        if (end < MINUTES_PER_DAY || elapsed >= enough) return elapsed;
      }
    },
  };
};

export const minuteOfDay = (at: Dayjs): number => at.hour() * 60 + at.minute();

export const isOpenAt = (
  value: string,
  at: Dayjs,
  specialHours: SpecialHours[] = [],
): boolean => getOpeningDay(value, at, specialHours).isOpenAt(minuteOfDay(at));

export const getMinutesUntilClose = (
  value: string,
  at: Dayjs,
  specialHours: SpecialHours[],
  enough: number,
): number =>
  getOpeningDay(value, at, specialHours).minutesUntilClose(
    minuteOfDay(at),
    enough,
  );

interface OpeningHoursDisplayConfig {
  formatDay: (day: Day) => string;
  formatNextDayTime: (time: string) => string;
  allDayLabel: string;
  rangeSeparator: string;
  delimiter: string;
}

const groupConsecutiveDays = (days: Day[]): Day[][] =>
  DAYS.filter((day) => days.includes(day)).reduce<Day[][]>((runs, day) => {
    const run = runs[runs.length - 1];

    if (run && DAYS.indexOf(day) === DAYS.indexOf(run[run.length - 1]) + 1)
      run.push(day);
    else runs.push([day]);

    return runs;
  }, []);

const formatDays = (
  days: Day[],
  {
    formatDay,
    rangeSeparator,
    delimiter,
  }: Pick<
    OpeningHoursDisplayConfig,
    "formatDay" | "rangeSeparator" | "delimiter"
  >,
): string =>
  groupConsecutiveDays(days)
    .map((run) =>
      run.length === 1
        ? formatDay(run[0])
        : `${formatDay(run[0])}${rangeSeparator}${formatDay(run[run.length - 1])}`,
    )
    .join(delimiter);

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

    const daysLabel = formatDays(group[0].days, config);

    return times.length === 0
      ? daysLabel
      : `${daysLabel}　${times.join(config.delimiter)}`;
  });
};
