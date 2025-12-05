"use client";

import ArrowBackButton from "./BackButton";

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

interface MemberLegalClientLayoutProps {
  children: React.ReactNode;
  lang: string;
  redirect?: string | string[];
}

const MemberLegalClientLayout = ({
  children,
  lang,
  redirect,
}: MemberLegalClientLayoutProps) => (
  <StyledContainer maxWidth="sm" disableGutters>
    <ArrowBackButton lang={lang} redirect={redirect} />
    {children}
  </StyledContainer>
);

export default MemberLegalClientLayout;
