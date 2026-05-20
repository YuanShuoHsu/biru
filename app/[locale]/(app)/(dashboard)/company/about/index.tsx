"use client";

import CommunitySection from "./components/CommunitySection";
import StatsSection from "./components/StatsSection";
import SupportSection from "./components/SupportSection";
import TeamPhotoStrip from "./components/TeamPhotoStrip";
import TeamSection from "./components/TeamSection";
import ValuesSection from "./components/ValuesSection";

import Footer from "@/components/Footer";

import { Box, Container, Divider, Typography } from "@mui/material";

const About = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#0a1929",
          color: "white",
          pt: { xs: 10, sm: 14 },
          pb: { xs: 8, sm: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 3,
              letterSpacing: "-0.5px",
            }}
          >
            We&apos;re on a mission to make great coffee effortless.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
          >
            We provide tools and spaces to bring a stunning coffee experience to
            life with unrivalled speed and warmth.
          </Typography>
        </Container>
      </Box>
      <TeamPhotoStrip />
      <StatsSection />
      <Divider />
      <ValuesSection />
      <Divider />
      <TeamSection />
      <Divider />
      <CommunitySection />
      <Divider />
      <SupportSection />
      <Footer />
    </Box>
  );
};

export default About;
