"use client";

import { useTranslations } from "next-intl";
import useSWR from "swr";

import OtherSessionItem from "./OtherSessionItem";
import SessionItem from "./SessionItem";

import ErrorAlert from "@/components/ErrorAlert";
import FormCard, {
  StyledCardContent,
  StyledCardHeader,
} from "@/components/FormCard";

import { authClient } from "@/lib/auth-client";

import { Laptop, Login } from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useRoutes } from "@/hooks/useRoutes";
import { useSession } from "@/hooks/useSession";

import { toFetchError } from "@/utils/errors";
import type { FetchError } from "@/utils/fetcher";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const StyledStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(2),
}));

const StyledAlert = styled(Alert)({
  "& .MuiAlert-action": {
    flexShrink: 0,
  },
});

export const sessionsKey = "sessions";

export type UserSession = NonNullable<
  Awaited<ReturnType<typeof authClient.listSessions>>["data"]
>[number];

const Sessions = () => {
  const session = useSession();

  const {
    data: sessions = [],
    error,
    mutate,
  } = useSWR<UserSession[], FetchError>(
    session ? sessionsKey : null,
    async () => {
      const { data, error } = await authClient.listSessions();
      if (error) throw toFetchError(error);

      return data;
    },
    {
      shouldRetryOnError: (error: FetchError) =>
        error.info?.code !== "SESSION_NOT_FRESH",
    },
  );
  const isSessionNotFresh = error?.info?.code === "SESSION_NOT_FRESH";
  const otherSessions = sessions.filter(
    ({ token }) => token !== session?.session.token,
  );

  const navItem = useRoutes();

  const tAuth = useTranslations("auth");

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Laptop color="primary" />}
        subheader={tAuth("settings.sessions.subtitle")}
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.sessions.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        <StyledStack>
          {session && (
            <SessionItem
              isCurrent
              secondaryAction={null}
              session={session.session}
            />
          )}
          {isSessionNotFresh ? (
            <StyledAlert
              action={
                <Button
                  color="inherit"
                  href={navItem("/auth/sign-in").to ?? "/auth/sign-in"}
                  size="small"
                  startIcon={<Login />}
                >
                  {tAuth("settings.sessions.notFresh.action")}
                </Button>
              }
              role="status"
              severity="info"
            >
              {tAuth("settings.sessions.notFresh.description")}
            </StyledAlert>
          ) : (
            error && <ErrorAlert onRetry={() => mutate()} />
          )}
          {otherSessions.map((session) => (
            <OtherSessionItem key={session.token} session={session} />
          ))}
        </StyledStack>
      </StyledCardContent>
    </FormCard>
  );
};

export default Sessions;
