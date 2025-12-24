"use client";

import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(2),
}));

interface MemberLegalLayoutProps {
  children: React.ReactNode;
}

const MemberLegalLayout = ({ children }: MemberLegalLayoutProps) => (
  <StyledContainer disableGutters maxWidth="sm">
    {children}
  </StyledContainer>
);

export default MemberLegalLayout;
