"use client";

import dayjs from "dayjs";
import timezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useNow, useTranslations } from "next-intl";

import StoreCard from "./StoreCard";

import GradientBox from "@/components/GradientBox";

import { STORE_TIMEZONE } from "@/constants/timezone";

import {
  Container,
  type ContainerProps,
  Grid,
  Stack,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";

import { isOpenAt } from "@/utils/openingHours";

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

interface StoresProps {
  organizations: OrganizationResponse[];
}

const Stores = ({ organizations }: StoresProps) => {
  // https://next-intl.dev/docs/usage/dates-times#relative-times-update
  const now = dayjs(useNow({ updateInterval: 60_000 })).tz(STORE_TIMEZONE);

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
      <Grid container spacing={2}>
        {organizations.map((organization) => (
          <Grid key={organization.id} size={{ xs: 12, md: 6 }}>
            <StoreCard
              isOpen={
                organization.openingHours
                  ? isOpenAt(organization.openingHours, now)
                  : null
              }
              organization={organization}
            />
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default Stores;
