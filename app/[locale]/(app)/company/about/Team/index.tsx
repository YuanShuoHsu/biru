import { useTranslations } from "next-intl";

import BadgeAvatars from "@/components/BadgeAvatars";
import GradientBox from "@/components/GradientBox";

import { Link } from "@/i18n/navigation";

import { ChevronRight } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface TeamMember {
  bio: string;
  countryCode: string;
  github?: string;
  location: string;
  name: string;
  title: string;
  twitter?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    bio: "Building the future of dining, one coffee at a time.",
    countryCode: "tw",
    github: "https://github.com/",
    location: "Taoyuan, Taiwan",
    name: "Yuan-Shuo Hsu",
    title: "Co-founder, CEO",
  },
  {
    bio: "Loves coding and great coffee.",
    countryCode: "tw",
    github: "https://github.com/",
    location: "Taipei, Taiwan",
    name: "Biru Member",
    title: "Co-founder, CTO",
  },
  {
    bio: "Passionate about building things that matter.",
    countryCode: "jp",
    github: "https://github.com/",
    location: "Tokyo, Japan",
    name: "Biru Member",
    title: "Lead Engineer",
  },
  {
    bio: "Designing experiences people love.",
    countryCode: "kr",
    github: "https://github.com/",
    location: "Seoul, South Korea",
    name: "Biru Member",
    title: "Product Designer",
  },
  {
    bio: "Turning ideas into beautiful interfaces.",
    countryCode: "us",
    github: "https://github.com/",
    location: "San Francisco, US",
    name: "Biru Member",
    title: "Frontend Engineer",
  },
  {
    bio: "Making sure everything runs smoothly.",
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
        <Button
          component={Link}
          href="/careers"
          variant="contained"
          disableElevation
          endIcon={<ChevronRight />}
        >
          {tCompanyAboutTeam("joinUs")}
        </Button>
      </Stack>
      <Grid container spacing={2}>
        {TEAM_MEMBERS.map(
          ({ bio, countryCode, location, name, title }, index) => (
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
                {bio}
              </Typography>
            </StyledGrid>
          ),
        )}
      </Grid>
    </StyledContainer>
  );
};

export default Team;
