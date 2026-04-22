"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import { Link as LinkIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

const GoogleIcon = () => (
  <svg
    aria-label="Google"
    height={18}
    role="img"
    viewBox="0 0 48 48"
    width={18}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const LinkedAccounts = () => {
  const [loading, setLoading] = useState(false);

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const handleLinkGoogle = async () => {
    setLoading(true);
    await authClient.linkSocial({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_NEXT_URL}/${locale}/auth/settings/security`,
      fetchOptions: {
        onError: ({ error: { code } }) => {
          setLoading(false);
          enqueueSnackbar(getErrorMessage(code, locale), { variant: "error" });
        },
      },
    });
  };

  return (
    <Box>
      <Typography fontWeight={600} mb={1.5} variant="subtitle2">
        {tAuth("settings.linkedAccounts.label")}
      </Typography>
      <Card>
        <CardContent>
          <Stack alignItems="center" direction="row" gap={2}>
            <Box
              alignItems="center"
              bgcolor="action.hover"
              borderRadius={2}
              display="flex"
              flexShrink={0}
              height={40}
              justifyContent="center"
              width={40}
            >
              <GoogleIcon />
            </Box>
            <Stack flex={1} minWidth={0}>
              <Typography fontWeight={500} variant="body2">
                {tAuth("settings.linkedAccounts.google.label")}
              </Typography>
              <Typography color="text.secondary" noWrap variant="caption">
                {tAuth("settings.linkedAccounts.google.subtitle")}
              </Typography>
            </Stack>
            <Button
              aria-label={tAuth("settings.linkedAccounts.google.subtitle")}
              loading={loading}
              onClick={handleLinkGoogle}
              size="small"
              startIcon={<LinkIcon />}
              sx={{ flexShrink: 0 }}
              variant="outlined"
            >
              {tAuth("settings.linkedAccounts.link")}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LinkedAccounts;
