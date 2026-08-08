"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

import type { OrganizationResponse } from "@/types/organizations";

import { MenuItem, TextField, styled } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(30),
  },
}));

interface OrderBoardOrganizationTextFieldProps {
  organizations: OrganizationResponse[];
  organizationSlug: string;
}

const OrderBoardOrganizationTextField = ({
  organizations,
  organizationSlug,
}: OrderBoardOrganizationTextFieldProps) => {
  const router = useRouter();

  const tOrder = useTranslations("order");

  const currentOrganization = organizations.find(
    ({ slug }) => slug === organizationSlug,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    router.push(`/order-board/${event.target.value}`);

  return (
    <StyledTextField
      fullWidth
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
          renderValue: () =>
            currentOrganization ? (
              currentOrganization.name
            ) : (
              <em>{tOrder("organizationSlug.select.placeholder")}</em>
            ),
        },
      }}
      value={currentOrganization?.slug || ""}
    >
      <MenuItem disabled value="">
        <em>{tOrder("organizationSlug.select.placeholder")}</em>
      </MenuItem>
      {organizations.map(({ id, slug, name }) => (
        <MenuItem key={id} value={slug}>
          {name}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default OrderBoardOrganizationTextField;
