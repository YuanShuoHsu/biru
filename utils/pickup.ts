import type { Dayjs } from "dayjs";

import { PICKUP_MINUTES_STEP } from "@/constants/pickup";

import type { OrganizationResponse } from "@/types/organizations";

import { getOpeningDay } from "@/utils/openingHours";

export interface PickupWindow {
  cutoffMinutes: number;
  from: Dayjs;
  openingHours: string;
  specialHours: OrganizationResponse["specialHours"];
  to: Dayjs;
}

type PickupOrganization = Pick<
  OrganizationResponse,
  | "openingHours"
  | "pickupCutoffMinutes"
  | "pickupLeadMinutes"
  | "pickupMaxAdvanceDays"
  | "specialHours"
>;

export const getPickupLeadMinutes = (
  organization: PickupOrganization,
  cartLeadTimeMinutes = 0,
): number => Math.max(organization.pickupLeadMinutes, cartLeadTimeMinutes);

export const getPickupWindow = (
  organization: PickupOrganization,
  now: Dayjs,
  cartLeadTimeMinutes = 0,
): PickupWindow => {
  const base = now.startOf("minute");

  return {
    cutoffMinutes: organization.pickupCutoffMinutes,
    from: base.add(
      getPickupLeadMinutes(organization, cartLeadTimeMinutes),
      "minute",
    ),
    openingHours: organization.openingHours || "",
    specialHours: organization.specialHours,
    to: base.add(organization.pickupMaxAdvanceDays, "day").endOf("day"),
  };
};

const MINUTES_PER_DAY = 24 * 60;

const minuteOfDay = (at: Dayjs): number => at.hour() * 60 + at.minute();

const stepMinutesFrom = (start: number, length: number): number[] =>
  Array.from(
    { length: length / PICKUP_MINUTES_STEP },
    (_, index) => start + index * PICKUP_MINUTES_STEP,
  );

const DAY_MINUTES = stepMinutesFrom(0, MINUTES_PER_DAY);

const hasPickupMinute = (
  { cutoffMinutes, from, openingHours, specialHours, to }: PickupWindow,
  availableHours: string[],
  date: Dayjs,
  minutes: number[],
): boolean => {
  if (date.isBefore(from, "day") || date.isAfter(to, "day")) return false;

  const store = getOpeningDay(openingHours, date, specialHours);
  const items = availableHours.map((hours) => getOpeningDay(hours, date));
  if (!store.isOpen || items.some(({ isOpen }) => !isOpen)) return false;

  const earliest = date.isSame(from, "day") ? minuteOfDay(from) : 0;
  const latest = date.isSame(to, "day") ? minuteOfDay(to) : MINUTES_PER_DAY;

  return minutes.some(
    (minute) =>
      minute >= earliest &&
      minute <= latest &&
      store.isOpenAt(minute) &&
      items.every((item) => item.isOpenAt(minute)) &&
      store.minutesUntilClose(minute, cutoffMinutes) >= cutoffMinutes,
  );
};

export const isPickupTime = (
  pickupWindow: PickupWindow,
  availableHours: string[],
  at: Dayjs,
): boolean =>
  hasPickupMinute(pickupWindow, availableHours, at, [minuteOfDay(at)]);

export const hasPickupTimeInHour = (
  pickupWindow: PickupWindow,
  availableHours: string[],
  at: Dayjs,
): boolean =>
  hasPickupMinute(
    pickupWindow,
    availableHours,
    at,
    stepMinutesFrom(at.hour() * 60, 60),
  );

export const hasPickupTimeOnDate = (
  pickupWindow: PickupWindow,
  availableHours: string[],
  date: Dayjs,
): boolean => hasPickupMinute(pickupWindow, availableHours, date, DAY_MINUTES);

export const hasPickupTimeInWindow = (
  pickupWindow: PickupWindow,
  availableHours: string[],
): boolean => {
  const { from, to } = pickupWindow;
  const days = Math.max(to.diff(from, "day") + 1, 0);

  return Array.from({ length: days }, (_, index) =>
    from.add(index, "day"),
  ).some((date) => hasPickupTimeOnDate(pickupWindow, availableHours, date));
};
