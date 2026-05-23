"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { type LocationForm, useLocationFormSchema } from "./definitions";

import GradientBox from "@/components/GradientBox";

import { useOrganizationLocation } from "@/hooks/organization";
import { useOrganizations } from "@/hooks/organization";

import { zodResolver } from "@hookform/resolvers/zod";

import { LocationOn, Schedule } from "@mui/icons-material";
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

const StyledIframe = styled("iframe")(({ theme }) => ({
  width: "100%",
  height: theme.spacing(50),
  borderRadius: theme.shape.borderRadius,
}));

const Location = () => {
  const organizations = useOrganizations();
  const defaultOrganizationId = organizations[0]?.id || "";

  const locationFormSchema = useLocationFormSchema();
  const { control, register } = useForm<LocationForm>({
    values: { organizationId: defaultOrganizationId },
    resolver: zodResolver(locationFormSchema),
  });
  const selectedOrganizationId = useWatch({ control, name: "organizationId" });

  const location = useOrganizationLocation(selectedOrganizationId);

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
        <StyledOrganizationSelect
          label={tCompanyAboutLocation("selectOrganization.label")}
          select
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
            select: {
              displayEmpty: true,
              renderValue: (selected) => {
                const organization = organizations.find(
                  ({ id }) => id === selected,
                );
                return organization ? (
                  organization.name
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
        {location && (
          <>
            <Stack gap={1}>
              {location.address && (
                <Stack direction="row" gap={1}>
                  <LocationOn color="primary" fontSize="small" />
                  <Typography color="text.secondary" variant="body2">
                    {location.address}
                  </Typography>
                </Stack>
              )}
              {location.hours && (
                <Stack direction="row" gap={1}>
                  <Schedule color="primary" fontSize="small" />
                  <Typography color="text.secondary" variant="body2">
                    {location.hours}
                  </Typography>
                </Stack>
              )}
            </Stack>
            {location.mapUrl && (
              <StyledIframe
                loading="lazy"
                src={location.mapUrl}
                title={tCompanyAboutLocation("label")}
              />
            )}
          </>
        )}
      </StyledContainer>
    </Box>
  );
};

export default Location;
