"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { type LocationForm, useLocationFormSchema } from "./definitions";

import GradientBox from "@/components/GradientBox";

import { countries } from "@/constants/countries";

import { LocaleEnum } from "@/enums/Locale";

import { zodResolver } from "@hookform/resolvers/zod";

import { useOrganizations } from "@/hooks/organization";

import { LocationOn } from "@mui/icons-material";
import {
  Box,
  Container,
  type ContainerProps,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const StyledOrganizationSelect = styled(TextField)({
  maxWidth: 240,
});

const Location = () => {
  const organizations = useOrganizations();
  const defaultOrganizationId = organizations[0]?.id || "";

  const locationFormSchema = useLocationFormSchema();
  const { control, register } = useForm<LocationForm>({
    values: { organizationId: defaultOrganizationId },
    resolver: zodResolver(locationFormSchema),
  });
  const selectedOrganizationId = useWatch({ control, name: "organizationId" });

  const organization = organizations.find(
    ({ id }) => id === selectedOrganizationId,
  );

  const countryLabel =
    countries.find(({ code }) => code === organization?.addressCountry)
      ?.label || organization?.addressCountry;

  const locale = useLocale();

  const addressParts = (
    locale === LocaleEnum.En
      ? [
          organization?.streetAddress,
          organization?.extendedAddress,
          organization?.postalCode,
          organization?.addressLocality,
          organization?.addressRegion,
          countryLabel,
        ]
      : [
          countryLabel,
          organization?.postalCode,
          organization?.addressRegion,
          organization?.addressLocality,
          organization?.streetAddress,
          organization?.extendedAddress,
        ]
  ).filter(Boolean);

  const tCompanyAboutLocation = useTranslations("company.about.location");

  return (
    <Box bgcolor="background.paper" component="section">
      <StyledContainer disableGutters maxWidth="lg">
        <Stack gap={1}>
          <Typography
            color="primary.main"
            component="h2"
            fontWeight="bold"
            variant="body2"
          >
            {tCompanyAboutLocation("label")}
          </Typography>
          <Typography
            color="text.primary"
            component="h2"
            fontWeight="bold"
            variant="h5"
          >
            {tCompanyAboutLocation("titlePrefix")}
            <GradientBox component="span">
              {tCompanyAboutLocation("titleHighlight")}
            </GradientBox>
          </Typography>
        </Stack>
        <Stack gap={2}>
          <StyledOrganizationSelect
            label={tCompanyAboutLocation("selectOrganization.label")}
            select
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                displayEmpty: true,
                renderValue: (selected) => {
                  const org = organizations.find(({ id }) => id === selected);
                  return org ? (
                    org.name
                  ) : (
                    <em>
                      {tCompanyAboutLocation("selectOrganization.placeholder")}
                    </em>
                  );
                },
              },
            }}
            value={selectedOrganizationId}
            {...register("organizationId")}
          >
            <MenuItem disabled value="">
              <em>{tCompanyAboutLocation("selectOrganization.placeholder")}</em>
            </MenuItem>
            {organizations.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </StyledOrganizationSelect>
          {addressParts.length > 0 && (
            <Stack direction="row" gap={1}>
              <LocationOn color="primary" fontSize="small" />
              <Typography color="text.secondary" variant="body2">
                {addressParts.join(", ")}
              </Typography>
            </Stack>
          )}
        </Stack>
      </StyledContainer>
    </Box>
  );
};

export default Location;
