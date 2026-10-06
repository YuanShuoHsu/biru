import type { ElementType } from "react";

import {
  Stack,
  type SvgIconProps,
  Typography,
  type TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  backgroundColor: theme.vars.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  flex: 1,
  gap: theme.spacing(0.5),
  minWidth: 0,
  padding: theme.spacing(1.5, 1),
  textAlign: "center",
}));

const LabelStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.vars.palette.text.secondary,
  gap: theme.spacing(0.5),
}));

const ValueTypography = styled(Typography)({
  fontWeight: "bold",
  lineHeight: 1.2,
});

interface WaitlistStatTileProps extends Pick<TypographyProps, "color"> {
  icon: ElementType<SvgIconProps>;
  label: string;
  value: string;
}

const WaitlistStatTile = ({
  color,
  icon: Icon,
  label,
  value,
}: WaitlistStatTileProps) => (
  <StyledStack>
    <LabelStack direction="row">
      <Icon fontSize="inherit" />
      <Typography variant="caption">{label}</Typography>
    </LabelStack>
    <ValueTypography color={color} variant="h5">
      {value}
    </ValueTypography>
  </StyledStack>
);

export default WaitlistStatTile;
