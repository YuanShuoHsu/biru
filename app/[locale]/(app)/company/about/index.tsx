"use client";

import Hero from "./Hero";
import Location from "./Location";
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
    <Support />
    <Divider />
    <Location />
    <Footer />
  </>
);

export default About;
