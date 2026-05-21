import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  SvgIcon,
  type SvgIconProps,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

import GradientBox from "@/components/GradientBox";
import { Link } from "@/i18n/navigation";

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

const Team = () => {
  const tCompanyAboutTeam = useTranslations("company.about.team");

  return (
    <Box sx={{ py: { xs: 10, sm: 14 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 3,
            mb: 6,
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              {tCompanyAboutTeam("label")}
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{ maxWidth: 500, fontWeight: 800, my: 1 }}
            >
              {tCompanyAboutTeam("title")}{" "}
              <GradientBox component="span">{tCompanyAboutTeam("titleHighlight")}</GradientBox>
            </Typography>
            <Typography color="text.secondary">{tCompanyAboutTeam("description")}</Typography>
          </Box>
          <Button
            component={Link}
            href="/careers"
            variant="contained"
            disableElevation
            endIcon={<ChevronRightIcon />}
            sx={{ flexShrink: 0 }}
          >
            {tCompanyAboutTeam("joinUs")}
          </Button>
        </Box>

        <Grid container spacing={2}>
          {CORE_TEAM.map((member, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, height: "100%" }}
              >
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
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
                    <Box>
                      {member.github && (
                        <IconButton
                          size="medium"
                          aria-label={`${member.name} GitHub profile`}
                          href={member.github}
                          target="_blank"
                          rel="noopener"
                          component="a"
                        >
                          <GitHubIcon fontSize="small" />
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
                    </Box>
                  </Box>

                  <Typography variant="body2" fontWeight={500}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.title}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Team;
