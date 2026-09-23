// https://mui.com/
// https://mui.com/templates/

"use client";

import Copyright from "./Copyright";
import LinkSection from "./LinkSection";
import Newsletter from "./Newsletter";
import SocialLinks from "./SocialLinks";

import { Box, type BoxProps, Container, Divider, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(5),
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const Footer = () => (
  <StyledBox component="footer">
    <StyledContainer disableGutters maxWidth="lg">
      <Newsletter />
      <LinkSection />
      <Divider />
      <StyledStack direction={{ xs: "column", sm: "row" }}>
        <Copyright />
        <SocialLinks />
      </StyledStack>
    </StyledContainer>
  </StyledBox>
);

export default Footer;
