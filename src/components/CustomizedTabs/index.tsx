// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import theme from "@/theme";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import ResponsiveGrid from "./ResponsiveGrid";
import TabPanel from "./TabPanel";

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const CustomizedTabs = () => {
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
      }}
    >
      <Tabs
        allowScrollButtonsMobile
        aria-label="tabs"
        onChange={handleChange}
        orientation={isSmUp ? "horizontal" : "vertical"}
        scrollButtons
        sx={{
          "& .MuiTabs-indicator": {
            transition: "left 300ms ease, top 300ms ease",
          },
          borderRight: isSmUp ? 0 : 1,
          borderBottom: isSmUp ? 1 : 0,
          borderColor: "divider",
          flexShrink: 0,
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
      {[...Array(7)].map((_, i) => (
        <TabPanel value={value} index={i} key={i}>
          <ResponsiveGrid tabIndex={i} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default CustomizedTabs;
