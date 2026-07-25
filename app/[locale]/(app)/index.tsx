import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

import type { Banner as BannerType } from "@/types/banners";

interface HomeProps {
  banners: BannerType[];
}

const Home = ({ banners }: HomeProps) => (
  <>
    {banners.length > 0 && <Banner banners={banners} />}
    <Footer />
  </>
);

export default Home;
