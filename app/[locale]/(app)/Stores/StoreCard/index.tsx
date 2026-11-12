import dayjs from "dayjs";
import { useFormatter, useTranslations } from "next-intl";

import LocationDetails from "@/components/LocationDetails";

import { ORDER_MODE } from "@/constants/orderMode";
import { STORE_TIMEZONE } from "@/constants/timezone";

import {
  EventAvailable,
  EventBusy,
  LocalMall,
  ReceiptLong,
  Storefront,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { styled, type Theme } from "@mui/material/styles";

import type { components } from "@/types/api";
import type { OrganizationResponse } from "@/types/organizations";

import { formatOpeningHoursForDisplay } from "@/utils/openingHours";

const StyledCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const SpecialHoursStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const iconStyle = ({ theme }: { theme: Theme }) => ({
  marginTop: theme.spacing(0.25),
});

const StyledEventBusy = styled(EventBusy)(iconStyle);

const StyledEventAvailable = styled(EventAvailable)(iconStyle);

const SpecialHoursLinesStack = styled(Stack)(({ theme }) => ({
  minWidth: 0,
  gap: theme.spacing(0.5),
  overflowWrap: "anywhere",
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

interface StoreCardProps {
  isOpen: boolean | null;
  organization: OrganizationResponse;
  upcomingSpecialHours: components["schemas"]["PublicSpecialHoursDto"][];
}

const toStoreDate = (date: string) => dayjs.tz(date, STORE_TIMEZONE).toDate();

const StoreCard = ({
  isOpen,
  organization,
  upcomingSpecialHours,
}: StoreCardProps) => {
  const format = useFormatter();

  const tCommon = useTranslations("common");
  const tHomeStores = useTranslations("home.stores");

  return (
    <StyledCard variant="outlined">
      <CardHeader
        action={
          isOpen !== null && (
            <Chip
              color={isOpen ? "success" : "default"}
              label={tHomeStores(isOpen ? "open" : "closed")}
              size="small"
            />
          )
        }
        avatar={
          <Avatar alt={organization.name} src={organization.logo || undefined}>
            <Storefront />
          </Avatar>
        }
        slotProps={{ title: { component: "h3", variant: "h6" } }}
        title={organization.name}
      />
      <StyledCardContent>
        <LocationDetails organization={organization} showMap={false} />
        {upcomingSpecialHours.map(
          ({ id, note, openingHours, validFrom, validThrough }) => (
            <SpecialHoursStack direction="row" key={id}>
              {openingHours === null ? (
                <StyledEventBusy color="warning" fontSize="small" />
              ) : (
                <StyledEventAvailable color="info" fontSize="small" />
              )}
              <SpecialHoursLinesStack>
                <Typography color="textSecondary" variant="body2">
                  {[
                    format.dateTimeRange(
                      toStoreDate(validFrom),
                      toStoreDate(validThrough),
                      "monthDay",
                      { timeZone: STORE_TIMEZONE },
                    ),
                    tHomeStores(
                      openingHours === null
                        ? "specialHours.closed"
                        : "specialHours.hours",
                    ),
                    note,
                  ]
                    .filter(Boolean)
                    .join(tCommon("middleDot"))}
                </Typography>
                {openingHours &&
                  formatOpeningHoursForDisplay(openingHours, {
                    formatDay: (day) => tCommon(`location.openingHours.${day}`),
                    formatNextDayTime: (time) =>
                      tCommon("location.openingHours.nextDayTime", { time }),
                    allDayLabel: tCommon("location.openingHours.allDay"),
                    rangeSeparator: tCommon(
                      "location.openingHours.rangeSeparator",
                    ),
                    delimiter: tCommon("delimiter"),
                  }).map((line) => (
                    <Typography
                      color="textSecondary"
                      key={line}
                      variant="body2"
                    >
                      {line}
                    </Typography>
                  ))}
              </SpecialHoursLinesStack>
            </SpecialHoursStack>
          ),
        )}
      </StyledCardContent>
      <StyledCardActions>
        <Button
          href={`/order/${ORDER_MODE.Pickup}/${organization.slug}`}
          size="small"
          startIcon={<LocalMall />}
          variant="contained"
        >
          {tHomeStores("pickup")}
        </Button>
        <Button
          href={`/order-board/${organization.slug}`}
          size="small"
          startIcon={<ReceiptLong />}
          variant="outlined"
        >
          {tHomeStores("orderBoard")}
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
};

export default StoreCard;
