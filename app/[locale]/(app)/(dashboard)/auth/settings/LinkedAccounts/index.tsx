"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import ProviderRow from "./ProviderRow";

import ErrorAlert from "@/components/ErrorAlert";
import FormCard, {
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";
import GoogleIcon from "@/components/GoogleIcon";

import { Link } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import useListAccounts from "@/hooks/useListAccounts";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

export interface Provider {
  id: string;
  Icon: ComponentType;
  label: string;
}

const providers: Provider[] = [
  { id: "google", Icon: GoogleIcon, label: "Google" },
];

const LinkedAccounts = () => {
  const { error, mutate } = useListAccounts();

  const tAuth = useTranslations("auth");

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Link color="primary" />}
        subheader={tAuth("settings.linkedAccounts.description")}
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.linkedAccounts.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        {error && <ErrorAlert onRetry={() => mutate()} />}
        {!error &&
          providers.map(({ id, Icon, label }) => (
            <ProviderRow Icon={Icon} id={id} key={id} label={label} />
          ))}
      </StyledCardContent>
    </FormCard>
  );
};

export default LinkedAccounts;
