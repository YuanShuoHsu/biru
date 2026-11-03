import { useTranslations } from "next-intl";

import LocationDetails from "@/components/LocationDetails";

import { ORDER_MODE } from "@/constants/orderMode";

import { LocalMall, ReceiptLong, Storefront } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";

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

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

interface StoreCardProps {
  isOpen: boolean | null;
  organization: OrganizationResponse;
}

const StoreCard = ({ isOpen, organization }: StoreCardProps) => {
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
