// https://mui.com/material-ui/react-badge/#system-CustomizedBadges.tsx

import { ShoppingCart } from "@mui/icons-material";

import { Badge, IconButton } from "@mui/material";
import type { BadgeProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const CustomizedBadges = () => {
  return (
    <IconButton aria-label="cart">
      <StyledBadge badgeContent={4} color="secondary">
        <ShoppingCart />
      </StyledBadge>
    </IconButton>
  );
};

export default CustomizedBadges;
