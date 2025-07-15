// https://mui.com/material-ui/react-badge/#system-CustomizedBadges.tsx

import type { BadgeProps } from "@mui/material";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    padding: "0 4px",
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    transition: theme.transitions.create(["background-color"]),
  },
}));

interface CustomizedBadgesProps extends BadgeProps {
  children: React.ReactNode;
}

const CustomizedBadges = ({ children, ...rest }: CustomizedBadgesProps) => {
  return (
    <StyledBadge color="secondary" {...rest}>
      {children}
    </StyledBadge>
  );
};

export default CustomizedBadges;
