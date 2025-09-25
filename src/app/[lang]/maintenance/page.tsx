// https://github.com/wayou/t-rex-runner

"use client";

import { useI18n } from "@/context/i18n";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  inset: 0,
  backgroundColor: theme.vars.palette.primary.main,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: theme.zIndex.appBar + 1,

  [theme.getColorSchemeSelector("dark")]: {
    backgroundColor: theme.vars.palette.background.paper,
  },
}));

const Maintenance = () => {
  const dict = useI18n();

  return (
    <StyledBox>
      <Typography fontWeight="bold" variant="h4">
        {dict.maintenance.title}
      </Typography>
    </StyledBox>
  );
};

export default Maintenance;
