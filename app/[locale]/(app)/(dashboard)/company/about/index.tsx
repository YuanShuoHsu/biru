"use client";

import { Box, Divider } from "@mui/material";
import Footer from "@/components/Footer";
import CommunitySection from "./CommunitySection";
import HeroArea from "./HeroArea";
import StatsSection from "./StatsSection";
import SupportSection from "./SupportSection";
import TeamSection from "./TeamSection";
import ValuesSection from "./ValuesSection";

const About = () => {
  return (
    <Box>
      <HeroArea />
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
