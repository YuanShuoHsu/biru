"use client";

import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)({
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

interface MemberLegalLayoutProps {
  children: React.ReactNode;
}

const MemberLegalLayout = ({ children }: MemberLegalLayoutProps) => (
  <StyledContainer maxWidth="md" disableGutters>
    {children}
  </StyledContainer>
);

export default MemberLegalLayout;
