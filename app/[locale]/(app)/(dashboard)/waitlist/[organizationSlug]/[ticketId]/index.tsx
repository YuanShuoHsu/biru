"use client";

import dayjs from "dayjs";
import timezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { StyledCardContent } from "@/components/FormCard";
import LocationDetails from "@/components/LocationDetails";
import WaitlistStatTile from "@/components/WaitlistStatTile";

import { STORE_TIMEZONE } from "@/constants/timezone";
import { WAITLIST_STATUS_COLORS } from "@/constants/waitlist";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useRouter } from "@/i18n/navigation";

import { useDialogStore } from "@/providers/dialog-store-provider";

import {
  AccessTime,
  Campaign,
  CheckCircleOutlined,
  HelpOutlined,
  HourglassTop,
  People,
  Replay,
} from "@mui/icons-material";
import {
  Button,
  Card,
  Chip,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";
import type {
  WaitlistTicketDetailResponse,
  WaitlistTicketStatus,
} from "@/types/waitlist";

import { getErrorMessage } from "@/utils/errors";
import { fetcher } from "@/utils/fetcher";
import {
  enableCallAlertSound,
  getWaitlistErrorCode,
  playCallChime,
} from "@/utils/waitlist";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const ALERT_VIBRATION = [400, 200, 400, 200, 400];

const STEPS = ["taken", "called", "seated"] as const;

const ACTIVE_STEPS: Record<WaitlistTicketStatus, number> = {
  called: 2,
  cancelled: 1,
  noShow: 2,
  seated: 3,
  waiting: 1,
};

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

const PartySizeStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.vars.palette.text.secondary,
  gap: theme.spacing(0.5),
}));

const TilesStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

interface WaitlistTicketProps {
  organization: OrganizationResponse;
  ticket: WaitlistTicketDetailResponse;
}

const WaitlistTicket = ({
  organization,
  ticket: initialTicket,
}: WaitlistTicketProps) => {
  const setDialog = useDialogStore((state) => state.setDialog);

  const [isConfirming, setIsConfirming] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const tWaitlist = useTranslations("waitlist");

  const ticketUrl = `/api/organizations/${organization.slug}/waitlist/tickets/${initialTicket.id}`;

  const { data: ticket = initialTicket, mutate } =
    useSWR<WaitlistTicketDetailResponse>(ticketUrl, {
      fallbackData: initialTicket,
    });

  const previousStatusRef = useRef(ticket.status);

  useEffect(() => {
    const handleFirstInteraction = () => {
      enableCallAlertSound();
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

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

    playCallChime();

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
  const activeStep =
    ticket.status === "cancelled" && ticket.calledAt
      ? 2
      : ACTIVE_STEPS[ticket.status];
  const errorStep =
    ticket.status === "noShow" || ticket.status === "cancelled"
      ? activeStep
      : null;

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      await fetcher(`${ticketUrl}/confirm`, { method: "POST" });

      enqueueSnackbar(tWaitlist("ticket.confirm.success"), {
        variant: "success",
      });
    } catch (error) {
      const code = getWaitlistErrorCode(error);

      enqueueSnackbar(
        code ? tWaitlist(`errors.${code}`) : getErrorMessage(error),
        { variant: "error" },
      );
    } finally {
      await mutate();
      setIsConfirming(false);
    }
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
            <PartySizeStack direction="row">
              <People fontSize="small" />
              <Typography variant="body1">
                {tWaitlist("ticket.partySize", { count: ticket.partySize })}
              </Typography>
            </PartySizeStack>
          </CenterStack>
          {ticket.status === "waiting" && (
            <TilesStack direction="row">
              <WaitlistStatTile
                icon={Campaign}
                label={tWaitlist("ticket.stats.current")}
                value={ticket.currentTicketNumber || "—"}
              />
              <WaitlistStatTile
                icon={HourglassTop}
                label={tWaitlist("ticket.stats.ahead")}
                value={tWaitlist("ticket.stats.aheadValue", {
                  count: ticket.aheadCount,
                })}
              />
            </TilesStack>
          )}
          {ticket.status === "called" && ticket.holdUntil && (
            <TilesStack direction="row">
              <WaitlistStatTile
                icon={AccessTime}
                label={tWaitlist("ticket.stats.deadline")}
                value={dayjs(ticket.holdUntil)
                  .tz(STORE_TIMEZONE)
                  .format("HH:mm")}
              />
              <WaitlistStatTile
                icon={ticket.confirmedAt ? CheckCircleOutlined : HelpOutlined}
                label={tWaitlist("ticket.stats.reply")}
                value={tWaitlist(
                  ticket.confirmedAt
                    ? "ticket.stats.replied"
                    : "ticket.stats.notReplied",
                )}
              />
            </TilesStack>
          )}
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((step, index) => (
              <Step key={step}>
                <StepLabel
                  error={index === errorStep}
                  optional={
                    index === errorStep && (
                      <Typography color="error" variant="caption">
                        {tWaitlist(`ticket.status.${ticket.status}`)}
                      </Typography>
                    )
                  }
                >
                  {tWaitlist(`ticket.steps.${step}`)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {ticket.status !== "called" && (
            <Typography align="center" color="textSecondary" variant="body2">
              {tWaitlist(`ticket.message.${ticket.status}`)}
            </Typography>
          )}
          {isActive ? (
            <>
              {ticket.status === "called" && !ticket.confirmedAt && (
                <Button
                  color="success"
                  loading={isConfirming}
                  onClick={handleConfirm}
                  size="large"
                  startIcon={<CheckCircleOutlined />}
                  variant="contained"
                >
                  {tWaitlist("ticket.confirm.label")}
                </Button>
              )}
              <Button color="error" onClick={handleCancelDialog}>
                {tWaitlist("ticket.cancel.label")}
              </Button>
            </>
          ) : (
            ticket.status === "cancelled" && (
              <Button
                onClick={() => router.push(`/waitlist/${organization.slug}`)}
                startIcon={<Replay />}
                variant="outlined"
              >
                {tWaitlist("ticket.again")}
              </Button>
            )
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
