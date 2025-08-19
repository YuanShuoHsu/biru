"use client";

import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

interface MemberAuthLayoutProps {
  children: React.ReactNode;
}

const MemberAuthLayout = ({ children }: MemberAuthLayoutProps) => (
  <StyledContainer maxWidth="sm" disableGutters>
    {children}
  </StyledContainer>
);

export default MemberAuthLayout;
