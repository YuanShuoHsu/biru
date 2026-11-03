// https://mui.com/material-ui/getting-started/templates/marketing-page/

"use client";

import FAQ from "./FAQ";
import Hero from "./Hero";
import Highlights from "./Highlights";
import Stores from "./Stores";

import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

import { Divider } from "@mui/material";

import type { Banner as BannerType } from "@/types/banners";
import type { OrganizationResponse } from "@/types/organizations";

interface HomeProps {
  banners: BannerType[];
  organizations: OrganizationResponse[];
}

const Home = ({ banners, organizations }: HomeProps) => (
  <>
    <Banner banners={banners} />
    <Hero />
    <Divider />
    <Highlights />
    <Divider />
    {organizations.length > 0 && (
      <>
        <Stores organizations={organizations} />
        <Divider />
      </>
    )}
    <FAQ />
    <Divider />
    <Footer />
  </>
);

export default Home;
