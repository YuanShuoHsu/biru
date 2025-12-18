// https://mui.com/
// https://mui.com/templates/

"use client";

import FooterLinkSection from "./FooterLinkSection";
import FooterNewsletter from "./FooterNewsletter";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterCopyright from "./FooterCopyright";

import {
  Box,
  type BoxProps,
  Container,
  Divider,
  Grid,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.paper,
  borderTop: `1px solid ${theme.vars.palette.divider}`,
  transition: theme.transitions.create("background-color"),
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const Footer = () => {
  return (
    <StyledBox component="footer">
      <StyledContainer disableGutters maxWidth="lg">
        <Grid container spacing={2}>
          <FooterNewsletter />
          <FooterLinkSection />
        </Grid>
        <Divider />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <FooterCopyright />
          <FooterSocialLinks />
        </Stack>
      </StyledContainer>
    </StyledBox>
  );
};

export default Footer;
