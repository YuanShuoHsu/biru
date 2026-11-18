"use client";

import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

import StatusFormCard, {
  type StatusFormCardConfig,
} from "@/components/StatusFormCard";

import { query } from "@/constants/query";

import { useHref } from "@/hooks/useHref";

import { useRouter } from "@/i18n/navigation";

import { authClient } from "@/lib/auth-client";

import {
  CheckCircle,
  GroupAdd,
  ReportGmailerrorred,
} from "@mui/icons-material";
import { Button } from "@mui/material";

import { useCountdownStore } from "@/providers/countdown-store-provider";

import { getHref } from "@/utils/href";

const ACCEPT_STATUS = {
  ACCEPTED: "accepted",
  FAILED: "failed",
  VERIFYING: "verifying",
} as const;

type AcceptStatus = (typeof ACCEPT_STATUS)[keyof typeof ACCEPT_STATUS];

interface AuthAcceptInvitationProps {
  email: string;
  invitationId: string;
}

const AuthAcceptInvitation = ({
  email,
  invitationId,
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

  const currentHref = useHref();

  const router = useRouter();

  const tAuth = useTranslations("auth");
  const verifyingTitle = tAuth("acceptInvitation.verifying.title");

  useEffect(() => {
    const accept = async () => {
      await authClient.organization.acceptInvitation(
        { invitationId },
        {
          onError: ({ error: { code, message } }) => {
            if (code === "UNAUTHORIZED") {
              enqueueSnackbar(message, {
                variant: "error",
              });

              router.replace(
                getHref("/auth/sign-in", { [query.redirectTo]: currentHref }),
              );

              return;
            }

            setState({
              errorMessage: message,
              status: ACCEPT_STATUS.FAILED,
            });
          },
          onSuccess: () => {
            setState({ errorMessage: "", status: ACCEPT_STATUS.ACCEPTED });
            startCountdown("accept-invitation-redirect", 3, () => {
              router.replace(process.env.NEXT_PUBLIC_ADMIN_URL!);
            });
          },
        },
      );
    };

    accept();
  }, [currentHref, invitationId, router, startCountdown]);

  const configs: Record<AcceptStatus, StatusFormCardConfig> = {
    [ACCEPT_STATUS.ACCEPTED]: {
      actions: (
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => router.replace(process.env.NEXT_PUBLIC_ADMIN_URL!)}
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
    [ACCEPT_STATUS.VERIFYING]: {
      actions: (
        <Button
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
  };

  const config = configs[state.status];

  return <StatusFormCard config={config} email={email} />;
};

export default AuthAcceptInvitation;
