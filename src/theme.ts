// https://mui.com/material-ui/customization/breakpoints/
// https://mui.com/material-ui/customization/css-theme-variables/configuration/#preventing-ssr-flickering

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "#b0bec5", // blueGrey[200]
        },
        secondary: {
          main: "#f48fb1", // pink[200]
        },
        warning: {
          main: "#ffcc80", // orange[200]
        },
        info: {
          main: "#a1887f", // brown[300]
        },
        success: {
          main: "#bcaaa4", // brown[200]
        },
        background: {
          default: "#000000",
          paper: "#212121", // grey[900]
        },
        text: {
          primary: "#fafafa",
          secondary: "#b0bec5", // blueGrey[200]
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: "#607d8b", // blueGrey[500]
        },
        secondary: {
          main: "#f8bbd0", // pink[100]
        },
        warning: {
          main: "#ffe0b2", // orange[100]
        },
        info: {
          main: "#bcaaa4", // brown[200]
        },
        success: {
          main: "#5d4037", // brown[700]
        },
        background: {
          default: "#fafafa", // grey[50]
          paper: "#ffffff",
        },
        text: {
          primary: "#212121", // grey[900]
          secondary: "#607d8b", // blueGrey[500]
        },
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  // palette: {
  //   primary: {
  //     main: "#607d8b", // blueGrey[500]
  //   },
  // secondary: {
  //   main: "#f8bbd0", // pink[100]
  // },
  // warning: {
  //   main: "#ffe0b2", // orange[100]
  // },
  // info: {
  //   main: "#bcaaa4", // brown[200]
  // },
  // success: {
  //   main: "#5d4037", // brown[700]
  // },
  // background: {
  //   default: "#fafafa", // grey[50]
  //   paper: "#fafafa",
  // },
  // text: {
  //   primary: "#212121", // grey[900]
  //   secondary: "#607d8b", // blueGrey[500]
  // },
  // },
});

export default theme;
