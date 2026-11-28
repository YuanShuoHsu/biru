"use client";

import { useTranslations } from "next-intl";

import ChangeEmail from "./ChangeEmail";
import EditProfile from "./EditProfile";

import FormCard, {
  StyledCardContent,
  StyledCardHeader,
  StyledListItem,
  StyledListItemText,
} from "@/components/FormCard";

import { useSession } from "@/hooks/useSession";

import { Edit, Mail, Person } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  ListItemAvatar,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/providers/dialog-store-provider";

import { getDisplayName } from "@/utils/auth";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const StyledAvatar = styled(Avatar)({
  width: 56,
  height: 56,
});

const EmailStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const ActionStack = styled(Stack)(({ theme }) => ({
  alignItems: "flex-end",
  gap: theme.spacing(1),

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));

const Profile = () => {
  const session = useSession();
  const { setDialog } = useDialogStore((state) => state);

  const displayName = getDisplayName(session?.user);

  const tAuth = useTranslations("auth");

  const handleChangeEmailDialog = () =>
    setDialog({
      confirmText: tAuth("settings.email.update"),
      content: <ChangeEmail />,
      formId: "change-email-form",
      open: true,
      title: tAuth("settings.email.changeLabel"),
    });

  const handleEditProfileDialog = () =>
    setDialog({
      confirmText: tAuth("settings.saveChanges"),
      content: <EditProfile />,
      formId: "edit-profile-form",
      open: true,
      title: tAuth("settings.profile.edit"),
    });

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Person color="primary" />}
        subheader={tAuth("settings.profile.subtitle")}
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.profile.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        <StyledListItem
          disablePadding
          secondaryAction={
            <ActionStack>
              <Button
                onClick={handleChangeEmailDialog}
                size="small"
                startIcon={<Mail />}
                variant="outlined"
              >
                {tAuth("settings.email.changeLabel")}
              </Button>
              <Button
                onClick={handleEditProfileDialog}
                size="small"
                startIcon={<Edit />}
                variant="outlined"
              >
                {tAuth("settings.profile.edit")}
              </Button>
            </ActionStack>
          }
        >
          <ListItemAvatar>
            <StyledAvatar
              alt={displayName}
              src={session?.user.image || undefined}
            >
              {displayName[0]}
            </StyledAvatar>
          </ListItemAvatar>
          <StyledListItemText
            primary={displayName}
            secondary={
              <EmailStack>
                {session?.user.email}
                {session?.user.emailVerified && (
                  <Chip
                    color="success"
                    label={tAuth("settings.email.verified")}
                    size="small"
                    variant="outlined"
                  />
                )}
              </EmailStack>
            }
            slotProps={{ secondary: { component: "div" } }}
          />
        </StyledListItem>
      </StyledCardContent>
    </FormCard>
  );
};

export default Profile;
