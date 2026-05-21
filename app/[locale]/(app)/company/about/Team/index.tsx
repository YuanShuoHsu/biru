import { useTranslations } from "next-intl";
import Image from "next/image";

import GradientBox from "@/components/GradientBox";

import { Link } from "@/i18n/navigation";

import { ChevronRight, GitHub } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  SvgIcon,
  type SvgIconProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const XIcon = (props: SvgIconProps) => (
  <SvgIcon fontSize="small" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </SvgIcon>
);

interface TeamMember {
  name: string;
  title: string;
  location: string;
  countryCode: string;
  github?: string;
  twitter?: string;
  bio: string;
}

const CORE_TEAM: TeamMember[] = [
  {
    name: "Yuan-Shuo Hsu",
    title: "Co-founder, CEO",
    location: "Taoyuan, Taiwan",
    countryCode: "tw",
    github: "https://github.com/",
    bio: "Building the future of dining, one coffee at a time.",
  },
  {
    name: "Biru Member",
    title: "Co-founder, CTO",
    location: "Taipei, Taiwan",
    countryCode: "tw",
    github: "https://github.com/",
    bio: "Loves coding and great coffee.",
  },
  {
    name: "Biru Member",
    title: "Lead Engineer",
    location: "Tokyo, Japan",
    countryCode: "jp",
    github: "https://github.com/",
    bio: "Passionate about building things that matter.",
  },
  {
    name: "Biru Member",
    title: "Product Designer",
    location: "Seoul, South Korea",
    countryCode: "kr",
    github: "https://github.com/",
    bio: "Designing experiences people love.",
  },
  {
    name: "Biru Member",
    title: "Frontend Engineer",
    location: "San Francisco, US",
    countryCode: "us",
    github: "https://github.com/",
    bio: "Turning ideas into beautiful interfaces.",
  },
  {
    name: "Biru Member",
    title: "Backend Engineer",
    location: "Singapore",
    countryCode: "sg",
    github: "https://github.com/",
    bio: "Making sure everything runs smoothly.",
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
          sx={{ flexShrink: 0 }}
        >
          {tCompanyAboutTeam("joinUs")}
        </Button>
      </Stack>
      <Grid container spacing={2}>
        {CORE_TEAM.map((member, i) => (
          <StyledGrid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box title={member.location}>
                <Avatar
                  variant="rounded"
                  sx={{ width: 70, height: 70, mb: 0.5 }}
                >
                  {member.name[0]}
                </Avatar>
                <Box sx={{ lineHeight: 0 }}>
                  <Image
                    src={`/images/flags/w20/${member.countryCode}.png`}
                    alt=""
                    height={20}
                    width={40}
                  />
                </Box>
              </Box>
              <Stack direction="row">
                {member.github && (
                  <IconButton
                    size="medium"
                    aria-label={`${member.name} GitHub profile`}
                    href={member.github}
                    target="_blank"
                    rel="noopener"
                    component="a"
                  >
                    <GitHub fontSize="small" />
                  </IconButton>
                )}
                {member.twitter && (
                  <IconButton
                    size="medium"
                    aria-label={`${member.name} X profile`}
                    href={member.twitter}
                    target="_blank"
                    rel="noopener"
                    component="a"
                  >
                    <XIcon />
                  </IconButton>
                )}
              </Stack>
            </Stack>
            <Stack gap={0.5}>
              <Typography color="text.primary" fontWeight={500} variant="body2">
                {member.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {member.title}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {member.bio}
            </Typography>
          </StyledGrid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default Team;
