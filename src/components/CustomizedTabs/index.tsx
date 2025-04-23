// https://mui.com/material-ui/react-tabs/#system-VerticalTabs.tsx

import { useState } from "react";

import { InputAdornment, Stack, TextField } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import SearchIcon from "@mui/icons-material/Search";

import ResponsiveGrid from "./ResponsiveGrid";
import TabPanel from "./TabPanel";

import { menuData } from "@/utils/menu";

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const CustomizedTabs = () => {
  const [value, setValue] = useState(0);
  const [searchText, setSearchText] = useState("");

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
      <TextField
        size="small"
        placeholder="搜尋菜單…"
        value={searchText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchText(event.target.value)
        }
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
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
        value={value}
        variant="scrollable"
      >
        {menuData.map((category, index) => (
          <Tab key={category.id} label={category.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      <Tabs
        allowScrollButtonsMobile
        aria-label="Vertical tabs"
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
        {menuData.map((category, index) => (
          <Tab key={category.id} label={category.name} {...a11yProps(index)} />
        ))}
      </Tabs>

      {menuData.map((category, index) => (
        <TabPanel index={index} key={category.id} value={value}>
          <ResponsiveGrid items={category.items} />
        </TabPanel>
      ))}
    </Stack>
  );
};

export default CustomizedTabs;
