"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { ORDER_MODE } from "@/constants/orderMode";
import { PARTY_SIZE_MAX } from "@/constants/partySize";

import { useRouter } from "@/i18n/navigation";

import { MenuItem, TextField, styled } from "@mui/material";

import type { Organization } from "@/types/organizations";

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.up("sm")]: {
    flex: "none",
    width: theme.spacing(30),
  },
}));

const HiddenSelectIcon = () => null;

interface OrderPartySizeTextFieldProps {
  organizationSlug: Organization["slug"];
  partySize?: string;
  readOnly?: boolean;
}

const OrderPartySizeTextField = ({
  organizationSlug,
  partySize,
  readOnly = false,
}: OrderPartySizeTextFieldProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tOrder = useTranslations("order");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("partySize", event.target.value);

    router.push(
      `/order/${ORDER_MODE.DineIn}/${organizationSlug}?${nextSearchParams}`,
    );
  };

  return (
    <StyledTextField
      fullWidth
      label={tOrder("mode.dineIn.partySize.select.label")}
      name="partySize"
      onChange={handleChange}
      required
      select
      size="small"
      slotProps={{
        inputLabel: { shrink: true },
        select: {
          displayEmpty: true,
          IconComponent: readOnly ? HiddenSelectIcon : undefined,
          readOnly,
          renderValue: (selected) =>
            selected ? (
              tOrder("mode.dineIn.partySize.select.value", {
                count: Number(selected),
              })
            ) : (
              <em>{tOrder("mode.dineIn.partySize.select.placeholder")}</em>
            ),
        },
      }}
      value={partySize ? Number(partySize) : ""}
    >
      <MenuItem disabled value="">
        <em>{tOrder("mode.dineIn.partySize.select.placeholder")}</em>
      </MenuItem>
      {Array.from({ length: PARTY_SIZE_MAX }, (_, index) => index + 1).map(
        (count) => (
          <MenuItem key={count} value={count}>
            {tOrder("mode.dineIn.partySize.select.value", { count })}
          </MenuItem>
        ),
      )}
    </StyledTextField>
  );
};

export default OrderPartySizeTextField;
