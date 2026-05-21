"use client";

import Community from "./Community";
import Hero from "./Hero";
import Support from "./Support";
import Team from "./Team";
import Values from "./Values";

import Footer from "@/components/Footer";

import { Divider } from "@mui/material";

const About = () => (
  <>
    <Hero />
    <Divider />
    <Values />
    <Divider />
    <Team />
    <Divider />
    <Community />
    <Divider />
    <Support />
    <Footer />
  </>
);

export default About;
