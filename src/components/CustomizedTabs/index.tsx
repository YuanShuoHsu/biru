// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import { useEffect, useState } from "react";

import ResponsiveGrid from "./ResponsiveGrid";
import TabPanel from "./TabPanel";

import { Stack, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

import { menu } from "@/utils/menu";

const HorizontalTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: "none",

  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const VerticalTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexShrink: 0,

  [theme.breakpoints.up("sm")]: {
    display: "none",
  },

  "& .MuiTabs-scroller": {
    width: "90px",
    flex: "1 1 0",
  },
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
  const allTags = [
    ...new Set(
      menu.flatMap(({ items }) => items.flatMap(({ tags }) => tags || [])),
    ),
  ];

  const tagGroups = allTags.map((tagKey) => ({
    id: tagKey,
    name: tagKey,
    items: menu.flatMap(({ items }) =>
      items.filter(({ tags }) => tags?.includes(tagKey)),
    ),
  }));

  const categoryGroups = menu.map(({ id, name, items }) => ({
    id,
    name,
    items,
  }));

  const combinedGroups = [...tagGroups, ...categoryGroups];

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
    <Stack
      height="100%"
      direction={{ xs: "row", sm: "column" }}
      gap={2}
      bgcolor="background.paper"
    >
      <HorizontalTabs
        allowScrollButtonsMobile
        aria-label="Horizontal tabs"
        onChange={handleChange}
        orientation="horizontal"
        value={displayIndex}
        variant="scrollable"
      >
        {tabList}
      </HorizontalTabs>
      <VerticalTabs
        allowScrollButtonsMobile
        aria-label="Vertical tabs"
        onChange={handleChange}
        orientation="vertical"
        value={displayIndex}
        variant="scrollable"
      >
        {tabList}
      </VerticalTabs>
      {filteredGroups.map(({ id, items }, index) => (
        <TabPanel index={index} key={id} value={displayIndex}>
          <ResponsiveGrid items={items} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default CustomizedTabs;
