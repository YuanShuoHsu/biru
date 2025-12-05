// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/
// https://mui.com/x/react-date-pickers/quickstart/

"use client";

import dayjs, { Dayjs } from "dayjs";
import NextLink from "next/link";
import { enqueueSnackbar } from "notistack";
import { Fragment, useState } from "react";

import CountrySelect from "@/components/CountrySelect";
import GoogleButton from "@/components/GoogleButton";
import TextMaskCustom from "@/components/TextMaskCustom";

import { LEGAL_LINK_TYPES, LegalLinkType } from "@/constants/legal";

import { useI18n } from "@/context/i18n";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getDefaultCountryCode } from "@/utils/countries";
import { getErrorMessage } from "@/utils/errors";
import { interpolate } from "@/utils/i18n";

import FormCard from "../FormCard";

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

type PasswordField = "password" | "confirmPassword";

interface MemberAuthSignUpProps {
  lang: string;
  redirect?: string | string[];
}

const MemberAuthSignUp = ({ lang, redirect }: MemberAuthSignUpProps) => {
  const defaultCountryCode = getDefaultCountryCode(lang);

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: defaultCountryCode,
    phone: "",
    emailUpdates: true,
  });

  const [showPassword, setShowPassword] = useState<
    Record<PasswordField, boolean>
  >({
    password: false,
    confirmPassword: false,
  });

  const redirectParam =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;
  const handleRedirectParams = (path: string) =>
    redirectParam
      ? `${path}?redirect=${encodeURIComponent(redirectParam)}`
      : path;

  const dict = useI18n();

  const langNameDirection: "row" | "row-reverse" =
    lang === "en" ? "row-reverse" : "row";

  const genderOptions = [
    { label: dict.member.auth.gender.options.female, value: "FEMALE" },
    { label: dict.member.auth.gender.options.male, value: "MALE" },
    {
      label: dict.member.auth.gender.options.notDisclosed,
      value: "NOT_DISCLOSED",
    },
  ];

  const legalConsentText = interpolate(dict.member.auth.legalConsent, {
    action: dict.member.auth.signUp.label,
    terms: `{${LegalLinkType.Terms}}`,
    privacy: `{${LegalLinkType.Privacy}}`,
  });

  const legalPlaceholders = Object.fromEntries(
    LEGAL_LINK_TYPES.map((type) => [
      `{${type}}`,
      <MuiLink
        key={type}
        component={NextLink}
        href={handleRedirectParams(`/${lang}/member/${type}`)}
      >
        {dict.member.legal[type].label}
      </MuiLink>,
    ]),
  );

  const legalSegmentPattern = new RegExp(
    `(\\n|${LEGAL_LINK_TYPES.map((type) => `{${type}}`).join("|")})`,
    "g",
  );

  const legalConsent = legalConsentText
    .split(legalSegmentPattern)
    .map((segment, index) => {
      if (segment === "\n")
        return <Box component="br" key={`legal-${index}`} />;

      return (
        legalPlaceholders[segment] || (
          <Fragment key={`legal-${index}`}>{segment}</Fragment>
        )
      );
    });

  const handleClickShowPassword = (key: PasswordField) => () =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const handleChange = ({
    target: { checked, name, type, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBirthDateChange = (value: Dayjs | null) =>
    setForm((prev) => ({
      ...prev,
      birthDate: value?.isValid() ? value.format("YYYY-MM-DD") : "",
    }));

  const handleCountryCodeChange = (code: string) =>
    setForm((prev) => ({ ...prev, countryCode: code }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // const { data } = await trigger(form);
      // console.log(data);
      // router.push(`/${lang}/orders`);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  return (
    <FormCard component="form" onSubmit={handleSubmit}>
      <StyledCardHeader
        title={
          <Typography
            color="primary"
            fontWeight="bold"
            textAlign="center"
            variant="h6"
          >
            {dict.member.auth.signUp.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signUp" href="" />
        <Divider>{dict.member.auth.or}</Divider>
        <Stack direction={langNameDirection} spacing={2}>
          <TextField
            autoComplete="family-name"
            fullWidth
            label={dict.member.auth.lastName}
            name="lastName"
            onChange={handleChange}
            value={form.lastName}
          />
          <TextField
            autoComplete="given-name"
            fullWidth
            label={dict.member.auth.firstName}
            name="firstName"
            onChange={handleChange}
            required
            value={form.firstName}
          />
        </Stack>
        <DatePicker
          disableFuture
          label={dict.member.auth.birthDate}
          onChange={handleBirthDateChange}
          slotProps={{
            textField: {
              autoComplete: "bday",
              fullWidth: true,
              inputMode: "numeric",
              required: true,
            },
          }}
          value={form.birthDate ? dayjs(form.birthDate) : null}
        />
        <TextField
          autoComplete="sex"
          // error={!!state?.errors?.gender}
          fullWidth
          label={dict.member.auth.gender.label}
          // helperText={state?.errors?.gender}
          name="gender"
          onChange={handleChange}
          required
          select
          value={form.gender}
        >
          {genderOptions.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          autoComplete="email"
          fullWidth
          label={dict.member.auth.email}
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label={dict.member.auth.password}
          name="password"
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.password
                        ? dict.member.auth.hidePassword
                        : dict.member.auth.showPassword
                    }
                    onClick={handleClickShowPassword("password")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword.password ? "text" : "password"}
          value={form.password}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label={dict.member.auth.confirmPassword}
          name="confirmPassword"
          onChange={handleChange}
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.confirmPassword
                        ? dict.member.auth.hidePassword
                        : dict.member.auth.showPassword
                    }
                    onClick={handleClickShowPassword("confirmPassword")}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          type={showPassword.confirmPassword ? "text" : "password"}
          value={form.confirmPassword}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <CountrySelect lang={lang} onChange={handleCountryCodeChange} />
          </Grid>
          <Grid size={{ xs: 6, sm: 8 }}>
            <TextField
              autoComplete="tel"
              fullWidth
              inputMode="tel"
              label={dict.member.auth.phone}
              name="phone"
              onChange={handleChange}
              required
              slotProps={{
                input: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  inputComponent: TextMaskCustom as any,
                  inputProps: { countryCode: form.countryCode },
                },
              }}
              type="tel"
              value={form.phone}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.emailUpdates}
              name="emailUpdates"
              onChange={handleChange}
              size="small"
            />
          }
          label={
            <Typography variant="body2">
              {dict.member.auth.emailUpdates}
            </Typography>
          }
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button fullWidth size="large" type="submit" variant="contained">
          {dict.member.auth.signUp.label}
        </Button>
        <Typography variant="caption" color="text.secondary" align="center">
          {legalConsent}
        </Typography>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2">{dict.member.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleRedirectParams(`/${lang}/member/sign-in`)}
            variant="body2"
          >
            {dict.member.auth.signIn.label}
          </MuiLink>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default MemberAuthSignUp;
