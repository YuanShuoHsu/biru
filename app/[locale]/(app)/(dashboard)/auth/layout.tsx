"use client";

import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <StyledContainer disableGutters maxWidth="sm">
    {children}
  </StyledContainer>
);

export default AuthLayout;
