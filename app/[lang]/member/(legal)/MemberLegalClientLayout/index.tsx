"use client";

import { useSearchParams } from "next/navigation";

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
}

const MemberLegalClientLayout = ({
  children,
  lang,
}: MemberLegalClientLayoutProps) => {
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <StyledContainer disableGutters maxWidth="sm">
      <ArrowBackButton lang={lang} redirect={safeRedirect} />
      {children}
    </StyledContainer>
  );
};

export default MemberLegalClientLayout;
