"use client";

import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import BrandMark from "@/components/BrandMark";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useI18n } from "@/context/i18n";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";

const isLikelyEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const dict = useI18n();

  const { enqueueSnackbar } = useSnackbar();

  const { isMutating, trigger } = useSWRMutation<
    unknown,
    Error,
    string,
    { email: string }
  >("/api/newsletter", sendRequest());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isMutating) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isLikelyEmail(trimmedEmail)) {
      enqueueSnackbar(dict.home.footer.newsletter.invalidEmail, {
        variant: "warning",
      });
      return;
    }

    try {
      await trigger({ email: trimmedEmail });

      setEmail("");
      enqueueSnackbar(dict.home.footer.newsletter.success, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  return (
    <StyledGrid size={{ xs: 12, md: 6 }}>
      <BrandMark color="text.primary" />
      <Typography color="text.primary" variant="subtitle2">
        {dict.home.footer.newsletter.title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {dict.home.footer.newsletter.subtitle}
      </Typography>
      <Box
        component="form"
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={1}
        onSubmit={handleSubmit}
        width="100%"
      >
        <TextField
          autoComplete="email"
          label={dict.home.footer.newsletter.emailLabel}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          required
          size="small"
          type="email"
          value={email}
        />
        <Button
          disabled={isMutating}
          loading={isMutating}
          loadingPosition="start"
          size="small"
          type="submit"
          variant="outlined"
        >
          {dict.home.footer.newsletter.action}
        </Button>
      </Box>
    </StyledGrid>
  );
};

export default Newsletter;
