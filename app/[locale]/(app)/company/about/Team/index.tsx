"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { type TeamForm, useTeamFormSchema } from "./definitions";

import GradientBox from "@/components/GradientBox";

import { LocaleEnum } from "@/enums/Locale";

import { zodResolver } from "@hookform/resolvers/zod";

import { useOrganizationMembers } from "@/hooks/useOrganizationMembers";
import { useOrganizations } from "@/hooks/useOrganizations";

import {
  Avatar,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const StyledOrganizationSelect = styled(TextField)({
  maxWidth: 240,
});

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const MemberAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8.5),
  height: theme.spacing(8.5),
}));

const Team = () => {
  const organizations = useOrganizations();

  const defaultOrganizationId = organizations[0]?.id || "";

  const teamFormSchema = useTeamFormSchema();
  const {
    control,
    formState: { errors },
    register,
  } = useForm<TeamForm>({
    values: { organizationId: defaultOrganizationId },
    resolver: zodResolver(teamFormSchema),
  });
  const selectedOrganizationId = useWatch({ control, name: "organizationId" });

  const locale = useLocale();
  const isEnglish = locale === LocaleEnum.En;

  const organizationMembers = useOrganizationMembers(selectedOrganizationId);

  const tCompanyAboutTeam = useTranslations("company.about.team");

  return (
    <StyledContainer maxWidth="lg">
      <Stack gap={1}>
        <Typography
          color="primary.main"
          component="h2"
          fontWeight="bold"
          variant="body2"
        >
          {tCompanyAboutTeam("label")}
        </Typography>
        <Typography
          color="text.primary"
          component="h2"
          fontWeight="bold"
          variant="h4"
        >
          {tCompanyAboutTeam("titlePrefix")}
          <GradientBox component="span">
            {tCompanyAboutTeam("titleHighlight")}
          </GradientBox>
        </Typography>
        <Typography color="text.secondary" variant="body1">
          {tCompanyAboutTeam("description")}
        </Typography>
        <StyledOrganizationSelect
          error={!!errors.organizationId}
          helperText={errors.organizationId?.message}
          label={tCompanyAboutTeam("selectOrganization.label")}
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
                  <em>{tCompanyAboutTeam("selectOrganization.placeholder")}</em>
                );
              },
            },
          }}
          value={selectedOrganizationId}
          {...register("organizationId")}
        >
          <MenuItem disabled value="">
            <em>{tCompanyAboutTeam("selectOrganization.placeholder")}</em>
          </MenuItem>
          {organizations.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </StyledOrganizationSelect>
      </Stack>
      <Grid container spacing={2}>
        {organizationMembers.map(
          ({ bio, firstName, id, image, lastName, role, teams }) => (
            <StyledGrid key={id} size={{ xs: 12, sm: 6, md: 3 }}>
              <MemberAvatar src={image || undefined} variant="rounded">
                {firstName[0]}
              </MemberAvatar>
              <Typography
                color="text.primary"
                fontWeight="bold"
                variant="body2"
              >
                {(isEnglish ? [firstName, lastName] : [lastName, firstName])
                  .filter(Boolean)
                  .join(isEnglish ? " " : "")}
              </Typography>
              <Chip label={tCompanyAboutTeam(`role.${role}`)} size="small" />
              <Divider />
              {bio && (
                <Typography color="text.secondary" variant="body2">
                  {bio}
                </Typography>
              )}
              <Typography color="text.secondary" variant="body2">
                {teams.map(({ name }) => name).join(" · ")}
              </Typography>
            </StyledGrid>
          ),
        )}
      </Grid>
    </StyledContainer>
  );
};

export default Team;
