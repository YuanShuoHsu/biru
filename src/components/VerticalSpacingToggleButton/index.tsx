import { useState } from "react";

import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
} from "@mui/icons-material";
import ToggleButton, { toggleButtonClasses } from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material/styles";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(2),

  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderBottomRightRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderTop: `1px solid ${theme.palette.action.disabledBackground}`,
    },
}));

export default function VerticalSpacingToggleButton() {
  const [alignment, setAlignment] = useState<string | null>("left");

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => setAlignment(newAlignment);

  return (
    <StyledToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      orientation="vertical"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <FormatAlignLeft />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <FormatAlignCenter />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FormatAlignRight />
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified">
        <FormatAlignJustify />
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}
