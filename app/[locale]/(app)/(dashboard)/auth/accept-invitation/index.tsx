"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import FormCard, {
  StyledCardActions,
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";

import { query } from "@/constants/query";

import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import { getHref } from "@/utils/href";

import {
  CheckCircle,
  GroupAdd,
  ReportGmailerrorred,
} from "@mui/icons-material";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { useCountdownStore } from "@/providers/countdown-store-provider";

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: "error" | "primary" }>(({ color, theme }) => {
  const mainColor = theme.palette[color].main;

  return {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: alpha(mainColor, 0.2),
    color: mainColor,
  };
});

const ACCEPT_STATUS = {
  ACCEPTED: "accepted",
  FAILED: "failed",
  VERIFYING: "verifying",
} as const;

type AcceptStatus = (typeof ACCEPT_STATUS)[keyof typeof ACCEPT_STATUS];

interface AuthAcceptInvitationProps {
  email: string;
  locale: Locale;
  token: string;
}

const AuthAcceptInvitation = ({
  email,
  locale,
  token,
}: AuthAcceptInvitationProps) => {
  const [state, setState] = useState<{
    errorMessage: string;
    status: AcceptStatus;
  }>({
    errorMessage: "",
    status: ACCEPT_STATUS.VERIFYING,
  });

  const { items, startCountdown } = useCountdownStore((state) => state);
  const redirectCountdown = items["accept-invitation-redirect"];

  const router = useRouter();

  const tAuth = useTranslations("auth");

  const verifyingTitle = tAuth("acceptInvitation.verifying.title");

  useEffect(() => {
    const accept = async () => {
      await authClient.organization.acceptInvitation(
        { invitationId: token },
        {
          headers: { "Accept-Language": locale },
          onError: ({ error: { code } }) => {
            if (code === "UNAUTHORIZED") {
              const redirectTo = `/auth/accept-invitation?${new URLSearchParams({ email, token })}`;
              router.replace(
                getHref("/auth/sign-in", { [query.redirectTo]: redirectTo }),
              );
              return;
            }
            setState({
              errorMessage: getErrorMessage(code, locale),
              status: ACCEPT_STATUS.FAILED,
            });
          },
          onSuccess: () => {
            setState({ errorMessage: "", status: ACCEPT_STATUS.ACCEPTED });
            startCountdown("accept-invitation-redirect", 3, () => {
              router.replace("/");
            });
          },
        },
      );
    };

    accept();
  }, [email, locale, router, startCountdown, token]);

  const configs: Record<
    AcceptStatus,
    {
      actions: React.ReactNode;
      color: "error" | "primary";
      icon: React.ElementType;
      subtitle: string;
      title: string;
    }
  > = {
    [ACCEPT_STATUS.VERIFYING]: {
      actions: (
        <Button
          disabled
          fullWidth
          loading
          loadingPosition="end"
          size="large"
          variant="contained"
        >
          {verifyingTitle}
        </Button>
      ),
      color: "primary",
      icon: GroupAdd,
      subtitle: tAuth("acceptInvitation.verifying.subtitle"),
      title: verifyingTitle,
    },
    [ACCEPT_STATUS.ACCEPTED]: {
      actions: (
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => router.replace("/")}
        >
          {redirectCountdown
            ? tAuth("acceptInvitation.accepted.actions", {
                seconds: redirectCountdown,
              })
            : tAuth("acceptInvitation.accepted.title")}
        </Button>
      ),
      color: "primary",
      icon: CheckCircle,
      subtitle: tAuth("acceptInvitation.accepted.subtitle"),
      title: tAuth("acceptInvitation.accepted.title"),
    },
    [ACCEPT_STATUS.FAILED]: {
      actions: (
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => router.replace("/")}
        >
          {tAuth("acceptInvitation.failed.actions")}
        </Button>
      ),
      color: "error",
      icon: ReportGmailerrorred,
      subtitle: state.errorMessage,
      title: tAuth("acceptInvitation.failed.title"),
    },
  };

  const config = configs[state.status];
  const Icon = config.icon;

  return (
    <FormCard>
      <StyledCardHeader
        title={
          <Typography
            color={config.color}
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {config.title}
          </Typography>
        }
      />
      <StyledCardContent>
        <StyledAvatar color={config.color}>
          <Icon fontSize="large" />
        </StyledAvatar>
        <Typography color="text.secondary" textAlign="center" variant="caption">
          {config.subtitle}
        </Typography>
        <TextField
          fullWidth
          label={tAuth("email.label")}
          slotProps={{ input: { readOnly: true } }}
          type="email"
          value={email}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>{config.actions}</StyledCardActions>
    </FormCard>
  );
};

export default AuthAcceptInvitation;
