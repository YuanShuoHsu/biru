// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import { Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack
      direction={{ xs: "row", sm: "column" }}
      spacing={2}
      sx={{
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      <Tabs
        allowScrollButtonsMobile
        aria-label="tabs"
        onChange={handleChange}
        orientation="horizontal"
        sx={{
          display: { xs: "none", sm: "flex" },
          borderBottom: 1,
          borderColor: "divider",
        }}
        value={value}
        variant="scrollable"
      >
        {[...Array(7)].map((_, index) => (
          <Tab key={index} label={`Item ${index + 1}`} {...a11yProps(index)} />
        ))}
      </Tabs>
      <Tabs
        allowScrollButtonsMobile
        aria-label="tabs"
        onChange={handleChange}
        orientation="vertical"
        sx={{
          display: { xs: "flex", sm: "none" },
          borderRight: 1,
          borderColor: "divider",
          flexShrink: 0,
          "& .MuiTabs-scroller": {
            flex: "1 1 0",
          },
        }}
        value={value}
        variant="scrollable"
      >
        {[...Array(7)].map((_, index) => (
          <Tab key={index} label={`Item ${index + 1}`} {...a11yProps(index)} />
        ))}
      </Tabs>
      {[...Array(7)].map((_, index) => (
        <TabPanel index={index} key={index} value={value}>
          <ResponsiveGrid tabIndex={index} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default CustomizedTabs;
