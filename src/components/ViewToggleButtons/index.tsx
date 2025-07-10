import { ViewList, ViewModule } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useViewStore } from "@/stores/useViewStore";

import { ViewMode } from "@/types/view";

const ViewToggleButtons = () => {
  const { view, setView } = useViewStore();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: ViewMode | null,
  ) => {
    if (nextView !== null) setView(nextView);
  };

  return (
    <ToggleButtonGroup exclusive onChange={handleChange} value={view}>
      <ToggleButton aria-label="list" size="small" value="list">
        <ViewList />
      </ToggleButton>
      <ToggleButton aria-label="module" size="small" value="module">
        <ViewModule />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggleButtons;
