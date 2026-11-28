"use client";

import dayjs from "dayjs";
import timezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { io } from "next/cache";
import { useTranslations } from "next-intl";
import { use } from "react";
import { useForm, useWatch } from "react-hook-form";

import { type StoresForm, useStoresFormSchema } from "./definitions";
import StoreCard from "./StoreCard";

import GradientBox from "@/components/GradientBox";

import { STORE_TIMEZONE } from "@/constants/timezone";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Container,
  type ContainerProps,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";

import { hasSpecialHoursAt, isOpenAt } from "@/utils/openingHours";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const HeaderStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const StyledTypography = styled(Typography)<TypographyProps>({
  fontWeight: "bold",
});

const ContentStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
}));

const StyledOrganizationSelect = styled(TextField)({
  maxWidth: 240,
});

interface StoresProps {
  organizations: OrganizationResponse[];
}

const Stores = ({ organizations }: StoresProps) => {
  // https://nextjs.org/docs/app/api-reference/functions/io#usage
  use(io());
  const now = dayjs().tz(STORE_TIMEZONE);

  const storesFormSchema = useStoresFormSchema();
  const { control, register } = useForm<StoresForm>({
    values: { organizationId: organizations[0]?.id || "" },
    resolver: zodResolver(storesFormSchema),
  });
  const selectedOrganizationId = useWatch({ control, name: "organizationId" });

  const organization = organizations.find(
    ({ id }) => id === selectedOrganizationId,
  );

  const tHomeStores = useTranslations("home.stores");

  return (
    <StyledContainer component="section" disableGutters maxWidth="lg">
      <HeaderStack>
        <StyledTypography color="primary" variant="body2">
          {tHomeStores("subtitle")}
        </StyledTypography>
        <StyledTypography component="h2" variant="h5">
          {tHomeStores("titlePrefix")}
          <GradientBox component="span">
            {tHomeStores("titleHighlight")}
          </GradientBox>
        </StyledTypography>
        <Typography color="textSecondary" variant="body1">
          {tHomeStores("description")}
        </Typography>
      </HeaderStack>
      <ContentStack>
        <StyledOrganizationSelect
          label={tHomeStores("selectOrganization.label")}
          select
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                const selectedOrganization = organizations.find(
                  ({ id }) => id === selected,
                );

                return selectedOrganization ? (
                  selectedOrganization.name
                ) : (
                  <em>{tHomeStores("selectOrganization.placeholder")}</em>
                );
              },
            },
          }}
          value={selectedOrganizationId}
          {...register("organizationId")}
        >
          <MenuItem disabled value="">
            <em>{tHomeStores("selectOrganization.placeholder")}</em>
          </MenuItem>
          {organizations.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </StyledOrganizationSelect>
        {organization && (
          <StoreCard
            isOpen={
              organization.openingHours ||
              hasSpecialHoursAt(organization.specialHours, now)
                ? isOpenAt(
                    organization.openingHours ?? "",
                    now,
                    organization.specialHours,
                  )
                : null
            }
            organization={organization}
            upcomingSpecialHours={organization.specialHours.filter(
              ({ validThrough }) => validThrough >= now.format("YYYY-MM-DD"),
            )}
          />
        )}
      </ContentStack>
    </StyledContainer>
  );
};

export default Stores;
