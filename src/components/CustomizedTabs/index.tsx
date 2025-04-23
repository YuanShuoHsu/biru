// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import { useEffect, useState } from "react";

import ResponsiveGrid from "./ResponsiveGrid";
import TabPanel from "./TabPanel";

import { Stack, Tab, Tabs } from "@mui/material";

import { menuData } from "@/utils/menu";

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
    menuData.length > 0 ? menuData[0].id : "",
  );

  const filteredMenuData = menuData
    .map((category) => ({
      ...category,
      items: category.items.filter(({ name }) =>
        name.includes(searchText.trim()),
      ),
    }))
    .filter(({ items }) => items.length > 0);

  const currentIndex = filteredMenuData.findIndex(
    ({ id }) => id === selectedId,
  );

  const displayIndex = currentIndex >= 0 ? currentIndex : 0;

  useEffect(() => {
    if (
      filteredMenuData.length > 0 &&
      !filteredMenuData.some((cat) => cat.id === selectedId)
    ) {
      setSelectedId(filteredMenuData[0].id);
    }
  }, [filteredMenuData, selectedId]);

  const handleChange = (_: React.SyntheticEvent, newIndex: number) =>
    setSelectedId(filteredMenuData[newIndex].id);

  return (
    <Stack
      height="100%"
      direction={{ xs: "row", sm: "column" }}
      gap={2}
      bgcolor="background.paper"
    >
      <Tabs
        allowScrollButtonsMobile
        aria-label="Horizontal tabs"
        onChange={handleChange}
        orientation="horizontal"
        sx={{
          display: { xs: "none", sm: "flex" },
          borderBottom: 1,
          borderColor: "divider",
        }}
        value={displayIndex}
        variant="scrollable"
      >
        {filteredMenuData.map((category, index) => (
          <Tab key={category.id} label={category.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      <Tabs
        allowScrollButtonsMobile
        aria-label="Vertical tabs"
        onChange={handleChange}
        orientation="vertical"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          display: { xs: "flex", sm: "none" },
          flexShrink: 0,

          "& .MuiTabs-scroller": {
            width: "90px",
            flex: "1 1 0",
          },
        }}
        value={displayIndex}
        variant="scrollable"
      >
        {filteredMenuData.map((category, index) => (
          <Tab key={category.id} label={category.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      {filteredMenuData.map((category, index) => (
        <TabPanel index={index} key={category.id} value={displayIndex}>
          <ResponsiveGrid items={category.items} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default CustomizedTabs;
