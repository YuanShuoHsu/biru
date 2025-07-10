import { useState } from "react";

import { ViewList, ViewModule } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ViewToggleButtons = () => {
  const [view, setView] = useState("list");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string,
  ) => {
    setView(nextView);
  };

  return (
    <ToggleButtonGroup exclusive onChange={handleChange} value={view}>
      <ToggleButton aria-label="list" size="small" value="list">
        <ViewList />
      </ToggleButton>
      <ToggleButton aria-label="module" size="small" value="module">
        <ViewModule />
      </ToggleButton>
      {/* <ToggleButton aria-label="quilt" size="small" value="quilt">
        <ViewQuilt />
      </ToggleButton> */}
    </ToggleButtonGroup>
  );
};

export default ViewToggleButtons;
