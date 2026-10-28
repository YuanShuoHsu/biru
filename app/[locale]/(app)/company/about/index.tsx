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
import type { StorePhoto } from "@/types/storePhotos";

interface AboutProps {
  organizations: OrganizationResponse[];
  organizationTeams: Record<
    OrganizationResponse["id"],
    OrganizationTeamMember[]
  >;
  storePhotos: StorePhoto[];
}

const About = ({
  organizations,
  organizationTeams,
  storePhotos,
}: AboutProps) => (
  <>
    <Hero storePhotos={storePhotos} />
    <Divider />
    <Values />
    <Divider />
    {Object.values(organizationTeams).some((members) => members.length) && (
      <>
        <Team
          organizations={organizations}
          organizationTeams={organizationTeams}
        />
        <Divider />
      </>
    )}
    {/* <Support />
    <Divider /> */}
    <Location organizations={organizations} />
    <Divider />
    <JoinUs storePhoto={storePhotos[0]} />
    <Divider />
    <Footer />
  </>
);

export default About;
