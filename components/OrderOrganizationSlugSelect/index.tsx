"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";

import { useOrganizations } from "@/hooks/organizations";

import { useRouter } from "@/i18n/navigation";

import { MenuItem, TextField } from "@mui/material";

import type { RouteParams } from "@/types/routeParams";

const OrderOrganizationSlugSelect = () => {
  const router = useRouter();

  const { organizationSlug } = useParams<Partial<RouteParams>>();

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const organizations = useOrganizations();

  const tOrder = useTranslations("order");

  const isDineIn = mode === ORDER_MODE.DineIn;

  const currentOrg = organizations.find(
    ({ slug }) => slug === organizationSlug,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/order/${event.target.value}?mode=${ORDER_MODE.Pickup}`);

  if (isDineIn) {
    return (
      <TextField
        label={tOrder("organizationSlug.label")}
        size="small"
        slotProps={{
          input: { readOnly: true },
          inputLabel: { shrink: true },
        }}
        value={currentOrg?.name ?? ""}
      />
    );
  }

  return (
    <TextField
      label={tOrder("organizationSlug.select.label")}
      name="organizationSlug"
      onChange={handleChange}
      required
      select
      size="small"
      slotProps={{
        inputLabel: { shrink: true },
        select: {
          displayEmpty: true,
          renderValue: (selected) => {
            const organization = organizations.find(
              ({ slug }) => slug === selected,
            );

            return organization ? (
              organization.name
            ) : (
              <em>{tOrder("organizationSlug.select.placeholder")}</em>
            );
          },
        },
      }}
      value={organizationSlug ?? ""}
    >
      <MenuItem disabled value="">
        <em>{tOrder("organizationSlug.select.placeholder")}</em>
      </MenuItem>
      {organizations.map(({ id, slug, name }) => (
        <MenuItem key={id} value={slug}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderOrganizationSlugSelect;
