import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

import type { Banner as BannerType } from "@/types/banners";

interface HomeProps {
  banners: BannerType[];
}

const Home = ({ banners }: HomeProps) => (
  <>
    <Banner banners={banners} />
    <Footer />
  </>
);

export default Home;
