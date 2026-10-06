"use client";

import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { StyledCardContent } from "@/components/FormCard";
import LocationDetails from "@/components/LocationDetails";

import { WAITLIST_STATUS_COLORS } from "@/constants/waitlist";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useRouter } from "@/i18n/navigation";

import { useDialogStore } from "@/providers/dialog-store-provider";

import {
  NotificationsActive,
  NotificationsNone,
  Replay,
} from "@mui/icons-material";
import { Button, Card, Chip, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";
import type { WaitlistTicketResponse } from "@/types/waitlist";

import { getErrorMessage } from "@/utils/errors";
import { fetcher } from "@/utils/fetcher";
import { getWaitlistErrorCode } from "@/utils/waitlist";

const ALERT_VIBRATION = [400, 200, 400, 200, 400];

const StyledStack = styled(Stack)(({ theme }) => ({
  alignSelf: "center",
  gap: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
  width: "100%",
}));

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "called",
})<{ called: boolean }>(({ called, theme }) => ({
  ...(called && {
    backgroundColor: `rgba(${theme.vars.palette.success.mainChannel} / 0.08)`,
    borderColor: theme.vars.palette.success.main,
    borderWidth: 2,
  }),
}));

const CenterStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(1),
  textAlign: "center",
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

const playChime = (audioContext: AudioContext) => {
  [0, 0.35, 0.7].forEach((offset) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startAt = audioContext.currentTime + offset;

    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.3);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.3);
  });
};

interface WaitlistTicketProps {
  organization: OrganizationResponse;
  ticket: WaitlistTicketResponse;
}

const WaitlistTicket = ({
  organization,
  ticket: initialTicket,
}: WaitlistTicketProps) => {
  const setDialog = useDialogStore((state) => state.setDialog);

  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const tWaitlist = useTranslations("waitlist");

  const ticketUrl = `/api/organizations/${organization.slug}/waitlist/tickets/${initialTicket.id}`;

  const { data: ticket = initialTicket, mutate } =
    useSWR<WaitlistTicketResponse>(ticketUrl, {
      fallbackData: initialTicket,
    });

  const previousStatusRef = useRef(ticket.status);

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    const handleUpdate = () => {
      mutate();
    };

    menuSocket
      .timeout(5000)
      .emitWithAck("joinPublicWaitlist", { organizationId: organization.id })
      .then(handleUpdate)
      .catch(() => {});

    menuSocket.on("publicWaitlistUpdated", handleUpdate);

    return () => {
      menuSocket.off("publicWaitlistUpdated", handleUpdate);
    };
  }, [isConnected, mutate, organization.id]);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = ticket.status;

    if (ticket.status !== "called" || ticket.status === previousStatus) return;

    navigator.vibrate?.(ALERT_VIBRATION);

    if (audioContextRef.current) playChime(audioContextRef.current);

    if (
      document.hidden &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(
          tWaitlist("ticket.notify.title", {
            organizationName: organization.name,
            ticketNumber: ticket.ticketNumber,
          }),
          { body: tWaitlist("ticket.notify.body"), tag: ticket.id },
        );
      } catch {}
    }
  }, [
    organization.name,
    tWaitlist,
    ticket.id,
    ticket.status,
    ticket.ticketNumber,
  ]);

  const isActive = ticket.status === "waiting" || ticket.status === "called";

  const handleEnableReminder = async () => {
    audioContextRef.current ??= new AudioContext();
    await audioContextRef.current.resume();

    if ("Notification" in window && Notification.permission === "default")
      await Notification.requestPermission();

    setIsReminderEnabled(true);
  };

  const handleCancelConfirm = async () => {
    try {
      await fetcher(`${ticketUrl}/cancel`, { method: "POST" });
    } catch (error) {
      const code = getWaitlistErrorCode(error);

      throw new Error(
        code ? tWaitlist(`errors.${code}`) : getErrorMessage(error),
      );
    } finally {
      await mutate();
    }

    enqueueSnackbar(tWaitlist("ticket.cancel.success"), {
      variant: "success",
    });
  };

  const handleCancelDialog = () =>
    setDialog({
      contentText: tWaitlist("ticket.cancel.contentText", {
        ticketNumber: ticket.ticketNumber,
      }),
      onConfirm: handleCancelConfirm,
      open: true,
      title: tWaitlist("ticket.cancel.label"),
    });

  return (
    <StyledStack>
      <BoldTypography variant="h5">
        {tWaitlist("title", { organizationName: organization.name })}
      </BoldTypography>
      <StyledCard called={ticket.status === "called"} variant="outlined">
        <StyledCardContent>
          <CenterStack>
            <Chip
              color={WAITLIST_STATUS_COLORS[ticket.status]}
              label={tWaitlist(`ticket.status.${ticket.status}`)}
              variant={ticket.status === "called" ? "filled" : "outlined"}
            />
            <Typography color="textSecondary" variant="caption">
              {tWaitlist("ticket.number")}
            </Typography>
            <BoldTypography
              color={ticket.status === "called" ? "success" : "primary"}
              variant="h2"
            >
              {ticket.ticketNumber}
            </BoldTypography>
            <Typography variant="body1">
              {tWaitlist("ticket.partySize", { count: ticket.partySize })}
            </Typography>
            {ticket.status === "waiting" && (
              <BoldTypography variant="h6">
                {tWaitlist("ticket.ahead", { count: ticket.aheadCount })}
              </BoldTypography>
            )}
            <Typography color="textSecondary" variant="body2">
              {tWaitlist(`ticket.message.${ticket.status}`)}
            </Typography>
          </CenterStack>
          {isActive ? (
            <>
              <Button
                disabled={isReminderEnabled}
                onClick={handleEnableReminder}
                startIcon={
                  isReminderEnabled ? (
                    <NotificationsActive />
                  ) : (
                    <NotificationsNone />
                  )
                }
                variant="contained"
              >
                {tWaitlist(
                  isReminderEnabled
                    ? "ticket.notify.enabled"
                    : "ticket.notify.enable",
                )}
              </Button>
              <Button color="error" onClick={handleCancelDialog}>
                {tWaitlist("ticket.cancel.label")}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push(`/waitlist/${organization.slug}`)}
              startIcon={<Replay />}
              variant="outlined"
            >
              {tWaitlist("ticket.again")}
            </Button>
          )}
        </StyledCardContent>
      </StyledCard>
      <Card variant="outlined">
        <StyledCardContent>
          <BoldTypography color="textSecondary" variant="subtitle2">
            {tWaitlist("ticket.store")}
          </BoldTypography>
          <LocationDetails organization={organization} showMap={false} />
        </StyledCardContent>
      </Card>
    </StyledStack>
  );
};

export default WaitlistTicket;
