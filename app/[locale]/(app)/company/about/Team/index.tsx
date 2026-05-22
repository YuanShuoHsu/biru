"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import BadgeAvatars from "@/components/BadgeAvatars";
import GradientBox from "@/components/GradientBox";

import { useOrganizations } from "@/hooks/useOrganizations";

import {
  Avatar,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface TeamMember {
  biography: string;
  countryCode: string;
  github?: string;
  location: string;
  name: string;
  title: string;
  twitter?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    biography: "Building the future of dining, one coffee at a time.",
    countryCode: "tw",
    github: "https://github.com/",
    location: "Taoyuan, Taiwan",
    name: "Yuan-Shuo Hsu",
    title: "Co-founder, CEO",
  },
  {
    biography: "Loves coding and great coffee.",
    countryCode: "tw",
    github: "https://github.com/",
    location: "Taipei, Taiwan",
    name: "Biru Member",
    title: "Co-founder, CTO",
  },
  {
    biography: "Passionate about building things that matter.",
    countryCode: "jp",
    github: "https://github.com/",
    location: "Tokyo, Japan",
    name: "Biru Member",
    title: "Lead Engineer",
  },
  {
    biography: "Designing experiences people love.",
    countryCode: "kr",
    github: "https://github.com/",
    location: "Seoul, South Korea",
    name: "Biru Member",
    title: "Product Designer",
  },
  {
    biography: "Turning ideas into beautiful interfaces.",
    countryCode: "us",
    github: "https://github.com/",
    location: "San Francisco, US",
    name: "Biru Member",
    title: "Frontend Engineer",
  },
  {
    biography: "Making sure everything runs smoothly.",
    countryCode: "sg",
    github: "https://github.com/",
    location: "Singapore",
    name: "Biru Member",
    title: "Backend Engineer",
  },
];

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const StyledBadgeAvatars = styled(BadgeAvatars)({
  alignSelf: "flex-start",

  "& .MuiBadge-badge": {
    transform: "translateX(50%)",
  },
});

const FlagAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}));

const MemberAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8.5),
  height: theme.spacing(8.5),
}));

const Team = () => {
  const tCompanyAboutTeam = useTranslations("company.about.team");
  const organizations = useOrganizations();
  const [selectedOrg, setSelectedOrg] = useState("");

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
        <TextField
          label={tCompanyAboutTeam("selectOrganization.label")}
          onChange={(e) => setSelectedOrg(e.target.value)}
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
                  <em>{tCompanyAboutTeam("selectOrganization.placeholder")}</em>
                );
              },
            },
          }}
          sx={{ alignSelf: "flex-start", minWidth: 240 }}
          value={selectedOrg}
        >
          <MenuItem disabled value="">
            <em>{tCompanyAboutTeam("selectOrganization.placeholder")}</em>
          </MenuItem>
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Grid container spacing={2}>
        {TEAM_MEMBERS.map(
          ({ biography, countryCode, location, name, title }, index) => (
            <StyledGrid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <StyledBadgeAvatars
                badgeContent={
                  <FlagAvatar
                    alt={location}
                    src={`/images/flags/w20/${countryCode}.png`}
                  />
                }
                overlap="rectangular"
                title={location}
              >
                <MemberAvatar variant="rounded">{name[0]}</MemberAvatar>
              </StyledBadgeAvatars>
              <Typography
                color="text.primary"
                fontWeight="bold"
                variant="body2"
              >
                {name}
              </Typography>
              <Typography color="text.primary" variant="body2">
                {title}
              </Typography>
              <Divider />
              <Typography color="text.secondary" variant="body2">
                {biography}
              </Typography>
            </StyledGrid>
          ),
        )}
      </Grid>
    </StyledContainer>
  );
};

export default Team;
