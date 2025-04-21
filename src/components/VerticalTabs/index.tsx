import theme from "@/theme";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import TabPanel from "./TabPanel";

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const VerticalTabs = () => {
  const [value, setValue] = useState(0);

  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: isSmUp ? "column" : "row",
        overflow: "hidden",
      }}
    >
      <Tabs
        allowScrollButtonsMobile
        aria-label="Vertical tabs example"
        onChange={handleChange}
        orientation={isSmUp ? "horizontal" : "vertical"}
        scrollButtons
        sx={{
          borderRight: isSmUp ? 0 : 1,
          borderBottom: isSmUp ? 1 : 0,
          borderColor: "divider",
        }}
        value={value}
        variant="scrollable"
      >
        <Tab label="Item One" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab label="Item Seven" {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
};

export default VerticalTabs;
