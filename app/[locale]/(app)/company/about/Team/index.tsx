"use client";

import { useLocale, useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { type TeamForm, useTeamFormSchema } from "./definitions";

import GradientBox from "@/components/GradientBox";

import { zodResolver } from "@hookform/resolvers/zod";

import { useOrganizationMembers } from "@/hooks/organizations";

import {
  Avatar,
  Chip,
  Container,
  type ContainerProps,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";

import { formatFullName } from "@/utils/auth";

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

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const MemberHeaderStack = styled(Stack)(({ theme }) => ({
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

const MemberAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8.5),
  height: theme.spacing(8.5),
}));

const MemberNameStack = styled(Stack)(({ theme }) => ({
  alignItems: "baseline",
  gap: theme.spacing(1),
}));

interface TeamProps {
  organizations: OrganizationResponse[];
}

const Team = ({ organizations }: TeamProps) => {
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

  const organizationMembers = useOrganizationMembers(selectedOrganizationId);

  const tCompanyAboutTeam = useTranslations("company.about.team");

  return (
    <StyledContainer component="section" disableGutters maxWidth="lg">
      <HeaderStack>
        <StyledTypography color="primary" component="h2" variant="body2">
          {tCompanyAboutTeam("label")}
        </StyledTypography>
        <StyledTypography component="h2" variant="h5">
          {tCompanyAboutTeam("titlePrefix")}
          <GradientBox component="span">
            {tCompanyAboutTeam("titleHighlight")}
          </GradientBox>
        </StyledTypography>
        <Typography color="textSecondary" variant="body1">
          {tCompanyAboutTeam("description")}
        </Typography>
      </HeaderStack>
      <ContentStack>
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
                const selectedOrganization = organizations.find(
                  ({ id }) => id === selected,
                );

                return selectedOrganization ? (
                  selectedOrganization.name
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
        <Grid container spacing={2}>
          {organizationMembers.map(
            ({ bio, firstName, id, image, lastName, role, teams }) => (
              <StyledGrid key={id} size={{ xs: 12, sm: 6, md: 3 }}>
                <MemberHeaderStack direction="row">
                  <MemberAvatar src={image || undefined} variant="rounded">
                    {firstName[0]}
                  </MemberAvatar>
                  <Chip
                    label={tCompanyAboutTeam(`role.${role}`)}
                    size="small"
                  />
                </MemberHeaderStack>
                <MemberNameStack direction="row">
                  <StyledTypography variant="body2">
                    {formatFullName(locale, firstName, lastName)}
                  </StyledTypography>
                  <Typography color="textSecondary" variant="caption">
                    {teams.map(({ name }) => name).join(" · ")}
                  </Typography>
                </MemberNameStack>
                <Divider />
                {bio && (
                  <Typography color="textSecondary" variant="body2">
                    {bio}
                  </Typography>
                )}
              </StyledGrid>
            ),
          )}
        </Grid>
      </ContentStack>
    </StyledContainer>
  );
};

export default Team;
