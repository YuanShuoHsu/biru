// https://mui.com/material-ui/react-avatar/#BadgeAvatars.tsx

import type { BadgeProps } from "@mui/material";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.vars.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`,
    color: theme.vars.palette.secondary.main,
    transition: theme.transitions.create(["background-color", "box-shadow"]),

    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      border: `1px solid ${theme.vars.palette.primary.main}`,
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
    },
  },
  [theme.getColorSchemeSelector("dark")]: {
    "& .MuiBadge-badge": {
      boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,

      "&::after": {
        border: `1px solid ${theme.vars.palette.background.paper}`,
      },
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface BadgeAvatarsProps extends BadgeProps {
  children: React.ReactNode;
}

const BadgeAvatars = ({
  anchorOrigin = { horizontal: "right", vertical: "bottom" },
  children,
  overlap = "circular",
  variant = "dot",
  ...restBadgeProps
}: BadgeAvatarsProps) => (
  <StyledBadge
    anchorOrigin={anchorOrigin}
    overlap={overlap}
    variant={variant}
    {...restBadgeProps}
  >
    {children}
  </StyledBadge>
);

export default BadgeAvatars;
