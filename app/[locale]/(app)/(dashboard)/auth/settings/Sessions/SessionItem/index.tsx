import { useFormatter, useTranslations } from "next-intl";

import {
  StyledListItemText,
  StyledOutlinedListItem,
} from "@/components/FormCard";

import { Computer } from "@mui/icons-material";
import { Avatar, Chip, ListItemIcon, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { Session } from "@/types/auth";

import { formatUserAgent } from "@/utils/auth";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.vars.palette.action.hover,
  color: theme.vars.palette.text.secondary,
}));

const PrimaryStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(1),
}));

interface SessionItemProps {
  isCurrent?: boolean;
  secondaryAction: React.ReactNode;
  session: Session["session"];
}

const SessionItem = ({
  isCurrent,
  secondaryAction,
  session: { updatedAt, userAgent },
}: SessionItemProps) => {
  const format = useFormatter();

  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");

  return (
    <StyledOutlinedListItem secondaryAction={secondaryAction}>
      <ListItemIcon>
        <StyledAvatar variant="rounded">
          <Computer fontSize="small" />
        </StyledAvatar>
      </ListItemIcon>
      <StyledListItemText
        primary={
          <PrimaryStack>
            {formatUserAgent(userAgent, tCommon("delimiter"))}
            {isCurrent && (
              <Chip
                color="primary"
                label={tAuth("settings.sessions.currentSession")}
                size="small"
                variant="outlined"
              />
            )}
          </PrimaryStack>
        }
        secondary={tAuth("settings.sessions.lastActive", {
          date: format.dateTime(new Date(updatedAt), "date"),
        })}
        slotProps={{
          primary: { component: "div" },
          secondary: { variant: "caption" },
        }}
      />
    </StyledOutlinedListItem>
  );
};

export default SessionItem;
