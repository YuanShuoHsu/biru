"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { type LocationForm, useLocationFormSchema } from "./definitions";

import GradientBox from "@/components/GradientBox";
import LocationDetails from "@/components/LocationDetails";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  type BoxProps,
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

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
}));

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

interface LocationProps {
  organizations: OrganizationResponse[];
}

const Location = ({ organizations }: LocationProps) => {
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

  const tCompanyAboutLocation = useTranslations("company.about.location");

  return (
    <StyledBox component="section">
      <StyledContainer disableGutters maxWidth="lg">
        <HeaderStack>
          <StyledTypography color="primary" component="h2" variant="body2">
            {tCompanyAboutLocation("label")}
          </StyledTypography>
          <StyledTypography component="h2" variant="h5">
            {tCompanyAboutLocation("titlePrefix")}
            <GradientBox component="span">
              {tCompanyAboutLocation("titleHighlight")}
            </GradientBox>
          </StyledTypography>
        </HeaderStack>
        <ContentStack>
          <StyledOrganizationSelect
            label={tCompanyAboutLocation("selectOrganization.label")}
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
          <LocationDetails organization={organization} />
        </ContentStack>
      </StyledContainer>
    </StyledBox>
  );
};

export default Location;
