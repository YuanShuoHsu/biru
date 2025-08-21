// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx
// https://github.com/mui/material-ui/issues/10739

"use client";

import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ResponsiveGrid from "./ResponsiveGrid";
import TabPanel from "./TabPanel";

import {
  LATEST,
  NEW_PRODUCT_DAYS,
  TOP_SOLD,
  TOP_SOLD_LIMIT,
} from "@/constants/tab";

import { useI18n } from "@/context/i18n";

import { Tab, Tabs, useScrollTrigger } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useOrderSearchStore } from "@/stores/useOrderSearchStore";

import type { LangParam } from "@/types/locale";

import { menu } from "@/utils/menu";

const HorizontalTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== "trigger",
})<{ trigger: boolean }>(({ theme, trigger }) => ({
  position: "sticky",

  top: 56,
  transform: trigger ? "translateY(-56px)" : "translateY(0)",
  [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
    top: 48,
    transform: trigger ? "translateY(-48px)" : "translateY(0)",
  },
  [theme.breakpoints.up("sm")]: {
    top: 64,
    transform: trigger ? "translateY(-64px)" : "translateY(0)",
  },

  backgroundColor: theme.vars.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["background-color", "transform"]),
  zIndex: theme.zIndex.appBar - 1,

  "& .MuiTab-root": {
    transition: theme.transitions.create("color"),
  },
}));

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

const CustomizedTabs = () => {
  const { lang } = useParams<LangParam>();

  const dict = useI18n();

  const { orderSearchText } = useOrderSearchStore();
  const searchText = orderSearchText.trim().toLowerCase();

  const trigger = useScrollTrigger({
    threshold: 150,
  });

  const allItems = menu.flatMap(({ items }) => items);

  const topSoldItems = [...allItems]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, TOP_SOLD_LIMIT);

  const topSoldGroups =
    topSoldItems.length > 0
      ? {
          id: TOP_SOLD,
          items: topSoldItems,
          label: dict.order.tableNumber.topSold,
        }
      : null;

  const latestItems = allItems.filter(
    ({ createdAt }) =>
      dayjs().diff(dayjs(createdAt), "day") <= NEW_PRODUCT_DAYS,
  );

  const latestGroups =
    latestItems.length > 0
      ? {
          id: LATEST,
          items: latestItems,
          label: dict.order.tableNumber.latest,
        }
      : null;

  const categoryGroups = menu.map(({ id, name, items }) => ({
    id,
    items,
    label: name[lang],
  }));

  const combinedGroups = [
    ...(topSoldGroups ? [topSoldGroups] : []),
    ...(latestGroups ? [latestGroups] : []),
    ...categoryGroups,
  ];

  const filteredGroups = combinedGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(({ name }) =>
        name[lang].toLowerCase().includes(searchText),
      ),
    }))
    .filter(
      ({ items, label }) =>
        label.toLowerCase().includes(searchText) || items.length > 0,
    );

  const [selectedId, setSelectedId] = useState(filteredGroups[0]?.id || "");

  const currentIndex = filteredGroups.findIndex(({ id }) => id === selectedId);
  const displayIndex = currentIndex >= 0 ? currentIndex : 0;

  useEffect(() => {
    if (
      filteredGroups.length > 0 &&
      !filteredGroups.some(({ id }) => id === selectedId)
    ) {
      setSelectedId(filteredGroups[0].id);
    }
  }, [filteredGroups, selectedId]);

  const handleChange = (_: React.SyntheticEvent, newIndex: number) =>
    setSelectedId(filteredGroups[newIndex].id);

  const tabList = filteredGroups.map(({ id, label }, index) => (
    <Tab key={id} label={label} {...a11yProps(index)} />
  ));

  return (
    <>
      <HorizontalTabs
        aria-label="Horizontal tabs"
        onChange={handleChange}
        orientation="horizontal"
        trigger={trigger}
        value={displayIndex}
        variant="scrollable"
      >
        {tabList}
      </HorizontalTabs>
      {filteredGroups.map(({ id, items }, index) => (
        <TabPanel index={index} key={id} value={displayIndex}>
          <ResponsiveGrid
            items={items}
            showLatest={id === LATEST}
            showTopSold={id === TOP_SOLD}
          />
        </TabPanel>
      ))}
    </>
  );
};

export default CustomizedTabs;
