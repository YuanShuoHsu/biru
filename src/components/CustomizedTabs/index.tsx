// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import dayjs from "dayjs";
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

import { Stack, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

import { menu } from "@/utils/menu";

const HorizontalTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

interface CustomizedTabsProps {
  searchText: string;
}

const CustomizedTabs = ({ searchText }: CustomizedTabsProps) => {
  const dict = useI18n();

  const allItems = menu.flatMap(({ items }) => items);

  const topSoldItems = [...allItems]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, TOP_SOLD_LIMIT);

  const topSoldGroups = {
    id: TOP_SOLD,
    name: dict.order.tableNumber.topSold,
    items: topSoldItems,
  };

  const latestItems = allItems.filter(
    ({ createdAt }) =>
      dayjs().diff(dayjs(createdAt), "day") <= NEW_PRODUCT_DAYS,
  );

  const latestGroups =
    latestItems.length > 0
      ? {
          id: LATEST,
          name: dict.order.tableNumber.latest,
          items: latestItems,
        }
      : null;

  const allTags = [...new Set(allItems.flatMap(({ tags }) => tags || []))];

  const tagGroups = allTags.map((tagKey) => ({
    id: tagKey,
    name: tagKey,
    items: allItems.filter(({ tags }) => tags?.includes(tagKey)),
  }));

  const categoryGroups = menu.map(({ id, name, items }) => ({
    id,
    name,
    items,
  }));

  const combinedGroups = [
    topSoldGroups,
    ...(latestGroups ? [latestGroups] : []),
    ...tagGroups,
    ...categoryGroups,
  ];

  const filteredGroups = combinedGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(({ name }) =>
        name.toLowerCase().includes(searchText.trim()),
      ),
    }))
    .filter(
      ({ name, items }) =>
        name.toLowerCase().includes(searchText.trim()) || items.length > 0,
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

  const tabList = filteredGroups.map(({ id, name }, index) => (
    <Tab key={id} label={name} {...a11yProps(index)} />
  ));

  return (
    <Stack height="100%" direction="column" gap={2} bgcolor="background.paper">
      <HorizontalTabs
        aria-label="Horizontal tabs"
        onChange={handleChange}
        orientation="horizontal"
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
    </Stack>
  );
};

export default CustomizedTabs;
