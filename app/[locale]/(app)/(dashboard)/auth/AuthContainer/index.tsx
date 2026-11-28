"use client";

import { usePathname } from "@/i18n/navigation";

import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  const pathname = usePathname();

  const isAccountPage = [
    "/auth/coupons",
    "/auth/orders",
    "/auth/points",
    "/auth/settings",
  ].some((prefix) => pathname.startsWith(prefix));

  return (
    <StyledContainer disableGutters maxWidth={isAccountPage ? "md" : "sm"}>
      {children}
    </StyledContainer>
  );
};

export default AuthContainer;
