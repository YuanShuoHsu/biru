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
  const [selectedId, setSelectedId] = useState(
    menu.length > 0 ? menu[0].id : "",
  );

  const filteredMenu = menu
    .map((category) => ({
      ...category,
      items: category.items.filter(({ name }) =>
        name.includes(searchText.trim()),
      ),
    }))
    .filter(
      ({ items, name }) => name.includes(searchText.trim()) || items.length > 0,
    );

  const currentIndex = filteredMenu.findIndex(({ id }) => id === selectedId);
  const displayIndex = currentIndex >= 0 ? currentIndex : 0;

  useEffect(() => {
    if (
      filteredMenu.length > 0 &&
      !filteredMenu.some(({ id }) => id === selectedId)
    ) {
      setSelectedId(filteredMenu[0].id);
    }
  }, [filteredMenu, selectedId]);

  const handleChange = (_: React.SyntheticEvent, newIndex: number) =>
    setSelectedId(filteredMenu[newIndex].id);

  const tabList = filteredMenu.map(({ id, name }, index) => (
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
      {filteredMenu.map(({ id, items }, index) => (
        <TabPanel index={index} key={id} value={displayIndex}>
          <ResponsiveGrid items={items} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default CustomizedTabs;
