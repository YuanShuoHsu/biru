"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import useSWR from "swr";

import { emitMenuWithAck, menuSocket } from "@/app/socket";

import WaitlistStatTile from "@/components/WaitlistStatTile";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { HourglassTop } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";
import type { WaitlistStatusResponse } from "@/types/waitlist";

import { formatOpeningHoursForDisplay } from "@/utils/openingHours";
import { getWaitlistUnavailable } from "@/utils/waitlist";

const StyledStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(2),
}));

const StyledContainerGrid = styled(Grid)({
  flex: 1,
});

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const StyledCardHeader = styled(CardHeader<"div", object, "h2">)(
  ({ theme }) => ({
    backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
  }),
);

const CalledStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  flex: 1,
  gap: theme.spacing(1),
  justifyContent: "center",
  padding: theme.spacing(3, 2),
  textAlign: "center",
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
  lineHeight: 1.1,
});

const PreviousStack = styled(Stack)(({ theme }) => ({
  flexWrap: "wrap",
  justifyContent: "center",
  columnGap: theme.spacing(2),
}));

interface WaitlistBoardProps {
  organization: OrganizationResponse;
  status: WaitlistStatusResponse;
}

const WaitlistBoard = ({
  organization,
  status: initialStatus,
}: WaitlistBoardProps) => {
  const tCommon = useTranslations("common");
  const tWaitlist = useTranslations("waitlist");

  const { data: status = initialStatus, mutate } =
    useSWR<WaitlistStatusResponse>(
      `/api/organizations/${organization.slug}/waitlist`,
      { fallbackData: initialStatus, refreshInterval: 60_000 },
    );

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    emitMenuWithAck<WaitlistStatusResponse>("joinPublicWaitlist", {
      organizationId: organization.id,
    })
      .then((joined) => mutate(joined, false))
      .catch(() => {});

    const handleUpdate = () => {
      mutate();
    };

    menuSocket.on("publicWaitlistUpdated", handleUpdate);

    return () => {
      menuSocket.off("publicWaitlistUpdated", handleUpdate);
      menuSocket.emit("leavePublicWaitlist", {
        organizationId: organization.id,
      });
    };
  }, [isConnected, mutate, organization.id]);

  const [specialDay] = status.specialHours;
  const isClosedDay = specialDay?.openingHours === null;
  const unavailable = getWaitlistUnavailable(status);

  return (
    <StyledStack>
      {specialDay && (
        <Alert severity={isClosedDay ? "warning" : "info"}>
          <AlertTitle>
            {tWaitlist(
              isClosedDay
                ? "board.specialDay.closed"
                : "board.specialDay.hours",
            )}
          </AlertTitle>
          {specialDay.openingHours &&
            formatOpeningHoursForDisplay(specialDay.openingHours, {
              formatDay: (day) => tCommon(`location.openingHours.${day}`),
              formatNextDayTime: (time) =>
                tCommon("location.openingHours.nextDayTime", { time }),
              allDayLabel: tCommon("location.openingHours.allDay"),
              rangeSeparator: tCommon("location.openingHours.rangeSeparator"),
              delimiter: tCommon("delimiter"),
            }).map((line) => (
              <Typography key={line} variant="body2">
                {line}
              </Typography>
            ))}
          {specialDay.note}
        </Alert>
      )}
      {unavailable && !(isClosedDay && unavailable === "closed") && (
        <Alert severity="warning">
          {tWaitlist(`unavailable.${unavailable}`)}
        </Alert>
      )}
      {status.enabled && (
        <StyledContainerGrid container spacing={2}>
          {status.groups.map((group) => {
            const [current, ...previous] = group.calledTicketNumbers;

            return (
              <Grid key={group.prefix} size={{ xs: 12, sm: 6, lg: "grow" }}>
                <StyledCard variant="outlined">
                  <StyledCardHeader
                    slotProps={{ title: { component: "h2", variant: "h5" } }}
                    subheader={
                      group.minPartySize === group.maxPartySize
                        ? tWaitlist("groups.single", {
                            count: group.minPartySize,
                          })
                        : tWaitlist("groups.range", {
                            max: group.maxPartySize,
                            min: group.minPartySize,
                          })
                    }
                    title={tWaitlist("groups.group", { prefix: group.prefix })}
                  />
                  <Divider />
                  <CalledStack>
                    <Typography color="textSecondary" variant="subtitle1">
                      {tWaitlist("board.calling")}
                    </Typography>
                    {current ? (
                      <BoldTypography color="success" variant="h1">
                        {current}
                      </BoldTypography>
                    ) : (
                      <Typography color="textSecondary" variant="h5">
                        {tWaitlist("board.empty")}
                      </Typography>
                    )}
                    {!!previous.length && (
                      <PreviousStack direction="row">
                        {previous.map((ticketNumber) => (
                          <BoldTypography
                            color="textSecondary"
                            key={ticketNumber}
                            variant="h4"
                          >
                            {ticketNumber}
                          </BoldTypography>
                        ))}
                      </PreviousStack>
                    )}
                  </CalledStack>
                  <Divider />
                  <CardContent>
                    <WaitlistStatTile
                      icon={HourglassTop}
                      label={tWaitlist("groups.waiting")}
                      value={tWaitlist("groups.waitingValue", {
                        count: group.waitingCount,
                      })}
                    />
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })}
        </StyledContainerGrid>
      )}
    </StyledStack>
  );
};

export default WaitlistBoard;
