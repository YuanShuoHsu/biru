"use client";

import { useTranslations } from "next-intl";

import { ORDER_MODE } from "@/constants/orderMode";

import { useOrganizations } from "@/hooks/organizations";

import { useRouter } from "@/i18n/navigation";

import { MenuItem, TextField } from "@mui/material";

const OrderModePickupStoreSlugSelect = () => {
  const router = useRouter();

  const organizations = useOrganizations();

  const tOrder = useTranslations("order");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/order/${event.target.value}?mode=${ORDER_MODE.Pickup}`);

  return (
    <TextField
      fullWidth
      label={tOrder("mode.pickup.select.label")}
      name="storeSlug"
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
              <em>{tOrder("mode.pickup.select.placeholder")}</em>
            );
          },
        },
      }}
      value=""
    >
      <MenuItem disabled value="">
        <em>{tOrder("mode.pickup.select.placeholder")}</em>
      </MenuItem>
      {organizations.map(({ id, slug, name }) => (
        <MenuItem key={id} value={slug}>
          {name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default OrderModePickupStoreSlugSelect;
