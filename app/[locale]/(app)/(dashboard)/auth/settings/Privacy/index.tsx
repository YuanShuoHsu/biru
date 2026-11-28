"use client";

import { useTranslations } from "next-intl";

import ExportUserData from "./ExportUserData";

import FormCard, {
  StyledCardContent,
  StyledCardHeader,
  StyledStackedListItem,
  StyledListItemText,
} from "@/components/FormCard";

import useListAccounts from "@/hooks/useListAccounts";

import { Download, OpenInNew, Policy } from "@mui/icons-material";
import { Button, Link as MuiLink, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useDialogStore } from "@/providers/dialog-store-provider";

const StyledTypography = styled(Typography)({
  fontWeight: "bold",
});

const SecondaryStack = styled(Stack)(({ theme }) => ({
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
}));

const StyledMuiLink = styled(MuiLink)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const Privacy = () => {
  const { setDialog } = useDialogStore((state) => state);

  const { data: accounts } = useListAccounts();

  const hasCredential = !!accounts?.some(
    ({ providerId }) => providerId === "credential",
  );

  const tAuth = useTranslations("auth");
  const tCompany = useTranslations("company");

  const handleExportDialog = () =>
    setDialog({
      confirmText: tAuth("settings.privacy.download.action"),
      content: <ExportUserData hasCredential={hasCredential} />,
      formId: "export-user-data-form",
      open: true,
      title: tAuth("settings.privacy.download.title"),
    });

  return (
    <FormCard>
      <StyledCardHeader
        avatar={<Policy color="primary" />}
        subheader={tAuth("settings.privacy.subtitle")}
        title={
          <StyledTypography color="primary" variant="h6">
            {tAuth("settings.privacy.label")}
          </StyledTypography>
        }
      />
      <StyledCardContent>
        <StyledStackedListItem
          disablePadding
          secondaryAction={
            <Button
              onClick={handleExportDialog}
              size="small"
              startIcon={<Download />}
              variant="outlined"
            >
              {tAuth("settings.privacy.download.action")}
            </Button>
          }
        >
          <StyledListItemText
            primary={tAuth("settings.privacy.download.title")}
            secondary={
              <SecondaryStack>
                {tAuth("settings.privacy.download.subtitle")}
                <StyledMuiLink
                  href="/company/privacy"
                  rel="noopener noreferrer"
                  target="_blank"
                  underline="hover"
                >
                  {tCompany("legal.privacy.label")}
                  <OpenInNew fontSize="inherit" />
                </StyledMuiLink>
              </SecondaryStack>
            }
            slotProps={{ secondary: { component: "div", variant: "caption" } }}
          />
        </StyledStackedListItem>
      </StyledCardContent>
    </FormCard>
  );
};

export default Privacy;
