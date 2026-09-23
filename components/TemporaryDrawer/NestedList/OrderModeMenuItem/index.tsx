"use client";

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";

import { StyledListItemButton } from "../SelectedListItem/ListItemLink";

import { ORDER_MODE } from "@/constants/orderMode";

import { useOrganization } from "@/hooks/organizations";
import { useRoutes } from "@/hooks/useRoutes";

import { Link } from "@/i18n/navigation";

import { Group, Person, Storefront, TableBar } from "@mui/icons-material";
import {
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { Slot } from "@/types/navItem";
import type { RouteParams } from "@/types/routeParams";

const ContentStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

const InfoRowStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(4),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: "auto",
  padding: theme.spacing(0.5),
}));

const OrderModeMenuItem: Slot = ({ level }) => {
  const { mode, organizationSlug } = useParams<Partial<RouteParams>>();

  const organization = useOrganization();
  const storeName = organization?.name || "";

  const searchParams = useSearchParams();

  const navItem = useRoutes();
  const { icon: ModeIcon, label } = navItem(`/order/${mode}`);
  const { to } = navItem(`/order/${mode}/${organizationSlug}`);

  const tOrder = useTranslations("order");

  if (!storeName || !to) return null;

  const partySize = searchParams.get("partySize");
  const tableNumber = searchParams.get("tableNumber");

  const extra =
    mode === ORDER_MODE.DineIn
      ? [
          ...(tableNumber
            ? [
                {
                  icon: <TableBar />,
                  primary: tOrder("mode.dineIn.tableNumber.value", {
                    tableNumber,
                  }),
                },
              ]
            : []),
          ...(partySize
            ? [
                {
                  icon: partySize === "1" ? <Person /> : <Group />,
                  primary: tOrder("mode.dineIn.partySize.select.value", {
                    count: partySize,
                  }),
                },
              ]
            : []),
        ]
      : [];

  return (
    <ListItem disablePadding>
      <StyledListItemButton
        {...{ component: Link, href: to }}
        level={level}
        selected
      >
        <ContentStack>
          <InfoStack>
            <InfoRowStack>
              <ListItemIcon>
                <Storefront />
              </ListItemIcon>
              <ListItemText primary={storeName} />
            </InfoRowStack>
            {extra.map(({ icon, primary }, index) => (
              <InfoRowStack key={index}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={primary} />
              </InfoRowStack>
            ))}
          </InfoStack>
          <StyledChip
            color="primary"
            icon={ModeIcon && <ModeIcon />}
            label={label}
            size="small"
            variant="outlined"
          />
        </ContentStack>
      </StyledListItemButton>
    </ListItem>
  );
};

export default OrderModeMenuItem;
