// https://developers.google.com/search/docs/appearance/structured-data/local-business
// https://developers.google.com/search/docs/appearance/structured-data/organization

import { SITE_NAME } from "./metadata";
import { DAYS, type Day, isAllDay, parseOpeningHours } from "./openingHours";
import { getSiteMeta } from "./siteMeta";

import { ORDER_MODE } from "@/constants/orderMode";

import type { Locale } from "@/i18n/routing";

import type { components } from "@/types/api";
import type { OrganizationResponse } from "@/types/organizations";

type SpecialHours = components["schemas"]["PublicSpecialHoursDto"];

interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  closes: string;
  dayOfWeek: string[];
  opens: string;
  validFrom?: string;
  validThrough?: string;
}

interface CafeOrCoffeeShop {
  "@context": "https://schema.org";
  "@type": "CafeOrCoffeeShop";
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    extendedAddress?: string;
    postalCode?: string;
    streetAddress: string;
  };
  hasMap?: string;
  image?: string;
  menu: string;
  name: string;
  openingHoursSpecification: OpeningHoursSpecification[];
  telephone?: string;
  url: string;
}

interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  logo: string;
  name: string;
  url: string;
}

const DAY_OF_WEEK: Record<Day, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

const toDayOfWeek = (days: Day[]) => days.map((day) => DAY_OF_WEEK[day]);

const toOpeningHoursSpecification = (
  openingHours: string,
  period?: Pick<SpecialHours, "validFrom" | "validThrough">,
): OpeningHoursSpecification[] => {
  const schedules = parseOpeningHours(openingHours).filter(
    ({ startTime, endTime }) => startTime && endTime,
  );
  const openDays = new Set(schedules.flatMap(({ days }) => days));
  const closedDays = DAYS.filter((day) => !openDays.has(day));

  return [
    ...schedules.map((schedule) => ({
      "@type": "OpeningHoursSpecification" as const,
      closes: isAllDay(schedule) ? "23:59" : schedule.endTime,
      dayOfWeek: toDayOfWeek(schedule.days),
      opens: schedule.startTime,
      ...period,
    })),
    ...(period && closedDays.length > 0
      ? [
          {
            "@type": "OpeningHoursSpecification" as const,
            closes: "00:00",
            dayOfWeek: toDayOfWeek(closedDays),
            opens: "00:00",
            ...period,
          },
        ]
      : []),
  ];
};

export const buildCafeOrCoffeeShop = (
  organization: OrganizationResponse,
  locale: Locale,
): CafeOrCoffeeShop => {
  const url = `${getSiteMeta().siteUrl}/${locale}/order/${ORDER_MODE.Pickup}/${organization.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    address: {
      "@type": "PostalAddress",
      addressCountry: organization.addressCountry,
      addressLocality: organization.addressLocality,
      addressRegion: organization.addressRegion,
      extendedAddress: organization.extendedAddress || undefined,
      postalCode: organization.postalCode || undefined,
      streetAddress: organization.streetAddress,
    },
    hasMap: organization.hasMap || undefined,
    image: organization.logo?.startsWith("https://")
      ? organization.logo
      : undefined,
    menu: url,
    name: organization.name,
    openingHoursSpecification: [
      ...toOpeningHoursSpecification(organization.openingHours ?? ""),
      ...organization.specialHours.flatMap(
        ({ openingHours, validFrom, validThrough }) =>
          toOpeningHoursSpecification(openingHours ?? "", {
            validFrom,
            validThrough,
          }),
      ),
    ],
    telephone: organization.telephone || undefined,
    url,
  };
};

export const buildOrganization = (locale: Locale): Organization => {
  const { siteUrl } = getSiteMeta();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    logo: `${siteUrl}/icon-512x512.png`,
    name: SITE_NAME,
    url: `${siteUrl}/${locale}`,
  };
};
