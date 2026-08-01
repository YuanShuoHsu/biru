import type { Metadata } from "next";

import AuthContainer from "./AuthContainer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  robots: { follow: true, index: false },
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <AuthContainer>{children}</AuthContainer>
);

export default AuthLayout;
