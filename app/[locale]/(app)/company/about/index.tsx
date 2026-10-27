// https://mui.com/about/

"use client";

import Hero from "./Hero";
import JoinUs from "./JoinUs";
import Location from "./Location";
import Team from "./Team";
import Values from "./Values";

import Footer from "@/components/Footer";

import { Divider } from "@mui/material";

import type {
  OrganizationResponse,
  OrganizationTeamMember,
} from "@/types/organizations";

interface AboutProps {
  organizations: OrganizationResponse[];
  teams: Record<OrganizationResponse["id"], OrganizationTeamMember[]>;
}

const About = ({ organizations, teams }: AboutProps) => (
  <>
    <Hero />
    <Divider />
    <Values />
    <Divider />
    {Object.values(teams).some((members) => members.length) && (
      <>
        <Team organizations={organizations} teams={teams} />
        <Divider />
      </>
    )}
    {/* <Support />
    <Divider /> */}
    <Location organizations={organizations} />
    <Divider />
    <JoinUs />
    <Divider />
    <Footer />
  </>
);

export default About;
