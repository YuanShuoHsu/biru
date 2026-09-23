import { Mousewheel, Navigation } from "swiper/modules";

import ActionAreaCard from "../ResponsiveGrid/ActionAreaCard";

import Carousel from "@/components/Carousel";

import { ViewSwiperBreakpoints } from "@/constants/view";

import { styled } from "@mui/material/styles";

import { useViewStore } from "@/providers/view-store-provider";

import type { OrderMenuItem } from "@/types/menus";

const StyledCarousel = styled(Carousel)(({ theme }) => ({
  paddingBottom: `${theme.spacing(5)} !important`,

  ".custom-swiper-button-prev, .custom-swiper-button-next": {
    top: `calc(50% - ${theme.spacing(2.5)})`,
  },
}));

interface FeaturedSliderProps {
  latestIds: Set<string>;
  menuItems: OrderMenuItem[];
  priority: boolean;
  topSoldIds: Set<string>;
}

const FeaturedSlider = ({
  latestIds,
  menuItems,
  priority,
  topSoldIds,
}: FeaturedSliderProps) => {
  const { view } = useViewStore((state) => state);

  return (
    <StyledCarousel
      breakpoints={ViewSwiperBreakpoints[view]}
      key={view}
      modules={[Mousewheel, Navigation]}
      mousewheel={{ forceToAxis: true }}
      navigation={true}
      spaceBetween={16}
    >
      {menuItems.map((menuItem, index) => (
        <ActionAreaCard
          isLatest={latestIds.has(menuItem.id)}
          isTopSold={topSoldIds.has(menuItem.id)}
          key={menuItem.id}
          menuItem={menuItem}
          priority={priority && index === 0}
        />
      ))}
    </StyledCarousel>
  );
};

export default FeaturedSlider;
