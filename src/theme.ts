// https://mui.com/material-ui/customization/breakpoints/

"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    tiny: true;
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      tiny: 0,
      xs: 320,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
