"use client";

import { useLocale, useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  type AcceptInvitationForm,
  useAcceptInvitationFormSchema,
} from "./definitions";

import FormCard, {
  StyledCardActions,
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";

import { query } from "@/constants/query";

import { zodResolver } from "@hookform/resolvers/zod";

import { useHref } from "@/hooks/useHref";

import { useRouter } from "@/i18n/navigation";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import {
  CheckCircle,
  GroupAdd,
  ReportGmailerrorred,
} from "@mui/icons-material";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { useCountdownStore } from "@/providers/countdown-store-provider";

import { getHref } from "@/utils/href";

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

  const locale = useLocale();

  const router = useRouter();

  const tAuth = useTranslations("auth");
  const verifyingTitle = tAuth("acceptInvitation.verifying.title");

  const acceptInvitationFormSchema = useAcceptInvitationFormSchema();
  const {
    formState: { errors },
    register,
  } = useForm<AcceptInvitationForm>({
    defaultValues: { email },
    resolver: zodResolver(acceptInvitationFormSchema),
  });

  useEffect(() => {
    const accept = async () => {
      await authClient.organization.acceptInvitation(
        { invitationId },
        {
          headers: { "Accept-Language": locale },
          onError: ({ error: { code } }) => {
            if (code === "UNAUTHORIZED") {
              enqueueSnackbar(getErrorMessage(code, locale), {
                variant: "error",
              });

              router.replace(
                getHref("/auth/sign-in", { [query.redirectTo]: currentHref }),
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
              router.replace(process.env.NEXT_PUBLIC_ADMIN_URL!);
            });
          },
        },
      );
    };

    accept();
  }, [currentHref, invitationId, locale, router, startCountdown]);

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
          autoComplete="email"
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message}
          label={tAuth("email.label")}
          placeholder={tAuth("email.placeholder")}
          required
          slotProps={{ input: { readOnly: true } }}
          type="email"
          {...register("email")}
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>{config.actions}</StyledCardActions>
    </FormCard>
  );
};

export default AuthAcceptInvitation;
