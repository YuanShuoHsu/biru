"use client";

import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import BrandMark from "@/components/BrandMark";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { sendRequest } from "@/utils/fetcher";

const isLikelyEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  alignItems: "flex-start",
}));

const Newsletter = () => {
  const [form, setForm] = useState({ email: "" });

  const tAuth = useTranslations("auth");
  const tHome = useTranslations("home");

  const { enqueueSnackbar } = useSnackbar();

  const { isMutating, trigger } = useSWRMutation<
    void,
    Error,
    string,
    { email: string }
  >("/api/newsletter", sendRequest());

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isMutating) return;

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail || !isLikelyEmail(trimmedEmail)) {
      enqueueSnackbar(tHome("footer.newsletter.invalidEmail"), {
        variant: "warning",
      });
      return;
    }

    try {
      await trigger({ email: trimmedEmail });

      setForm({ email: "" });
      enqueueSnackbar(tHome("footer.newsletter.success"), {
        variant: "success",
      });
    } catch {
      return;
    }
  };

  return (
    <StyledGrid size={{ xs: 12, md: 6 }}>
      <BrandMark color="text.primary" />
      <Typography color="text.primary" variant="subtitle2">
        {tHome("footer.newsletter.title")}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {tHome("footer.newsletter.subtitle")}
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
          label={tAuth("email.label")}
          name="email"
          onChange={handleChange}
          placeholder={tAuth("email.placeholder")}
          required
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent",
            },
          }}
          type="email"
          value={form.email}
        />
        <Button
          disabled={isMutating}
          loading={isMutating}
          loadingPosition="start"
          size="small"
          type="submit"
          variant="outlined"
        >
          {tHome("footer.newsletter.action")}
        </Button>
      </Box>
    </StyledGrid>
  );
};

export default Newsletter;
