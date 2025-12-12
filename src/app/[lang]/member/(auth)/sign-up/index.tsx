// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/
// https://mui.com/x/react-date-pickers/quickstart/
// https://mui.com/x/react-date-pickers/validation/

"use client";

import dayjs, { Dayjs } from "dayjs";
import NextLink from "next/link";
import { Fragment, useActionState, useState } from "react";

import { signup } from "@/app/actions/auth";

import CountrySelect from "@/components/CountrySelect";
import GoogleButton from "@/components/GoogleButton";
import TextMaskCustom from "@/components/TextMaskCustom";

import { GENDER_LABELS, GENDER_VALUES } from "@/constants/gender";
import { LEGAL_LINK_TYPES, LegalLinkType } from "@/constants/legal";

import { useI18n } from "@/context/i18n";

import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getDefaultCountryCode } from "@/utils/countries";
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

const today = dayjs();

type PasswordField = "password" | "confirmPassword";

interface MemberAuthSignUpProps {
  lang: string;
  redirect?: string;
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

  const [state, formAction, pending] = useActionState(signup, undefined);

  const dict = useI18n();

  const langNameDirection = lang === "en" ? "row-reverse" : "row";

  const genderOptions = GENDER_VALUES.map((value) => ({
    label: dict.member.auth.gender.options[GENDER_LABELS[value]],
    value,
  }));

  const hasPassword = form.password.length > 0;
  const hasConfirmPassword = form.confirmPassword.length > 0;
  const passwordsMatch =
    hasPassword && hasConfirmPassword && form.password === form.confirmPassword;

  const passwordRules = [
    {
      key: "minLength",
      passed: form.password.length >= 8,
      label: dict.member.auth.passwordRules.minLength,
    },
    {
      key: "letter",
      passed: /[a-zA-Z]/.test(form.password),
      label: dict.member.auth.passwordRules.letter,
    },
    {
      key: "number",
      passed: /\d/.test(form.password),
      label: dict.member.auth.passwordRules.number,
    },
  ];

  const isPasswordError =
    hasPassword && passwordRules.some(({ passed }) => !passed);

  const confirmPasswordRule = {
    key: "match",
    passed: passwordsMatch,
    label: dict.member.auth.passwordRules.match,
  };

  const isConfirmPasswordError =
    hasConfirmPassword && !confirmPasswordRule.passed;

  const getPasswordRuleColor = (passed: boolean) =>
    hasPassword ? (passed ? "success.main" : "error.main") : "text.secondary";

  const passwordHelperContent = (
    <List dense disablePadding>
      {passwordRules.map(({ key, label, passed }) => {
        const color = getPasswordRuleColor(passed);

        return (
          <ListItem disablePadding key={key}>
            <ListItemIcon
              sx={{
                color,
                minWidth: 28,
              }}
            >
              {passed ? (
                <CheckCircleOutline fontSize="small" />
              ) : (
                <RadioButtonUnchecked fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{
                primary: {
                  color,
                  variant: "caption",
                },
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );

  const getConfirmPasswordRuleColor = (passed: boolean) =>
    hasConfirmPassword
      ? passed
        ? "success.main"
        : "error.main"
      : "text.secondary";

  const confirmPasswordRuleColor = getConfirmPasswordRuleColor(
    confirmPasswordRule.passed,
  );

  const confirmPasswordHelperContent = (
    <List dense disablePadding>
      <ListItem disablePadding key={confirmPasswordRule.key}>
        <ListItemIcon
          sx={{
            color: confirmPasswordRuleColor,
            minWidth: 28,
          }}
        >
          {confirmPasswordRule.passed ? (
            <CheckCircleOutline fontSize="small" />
          ) : (
            <RadioButtonUnchecked fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={confirmPasswordRule.label}
          slotProps={{
            primary: {
              color: confirmPasswordRuleColor,
              variant: "caption",
            },
          }}
        />
      </ListItem>
    </List>
  );

  const legalConsentText = interpolate(dict.member.auth.legalConsent, {
    action: dict.member.auth.signUp.label,
    terms: `{${LegalLinkType.Terms}}`,
    privacy: `{${LegalLinkType.Privacy}}`,
  });

  const handleRedirectParams = (path: string) =>
    redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;

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

  return (
    <FormCard action={formAction} component="form">
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
            error={!!state?.errors.lastName}
            fullWidth
            helperText={state?.errors.lastName?.join("\n")}
            label={dict.member.auth.lastName}
            name="lastName"
            onChange={handleChange}
            value={form.lastName}
          />
          <TextField
            autoComplete="given-name"
            error={!!state?.errors.firstName}
            fullWidth
            helperText={state?.errors.firstName?.join("\n")}
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
          maxDate={today}
          name="birthDate"
          onChange={handleBirthDateChange}
          slotProps={{
            textField: {
              autoComplete: "bday",
              error: !!state?.errors.birthDate,
              helperText: state?.errors.birthDate?.join("\n"),
              required: true,
            },
          }}
          value={form.birthDate ? dayjs(form.birthDate) : null}
        />
        <TextField
          autoComplete="sex"
          error={!!state?.errors.gender}
          fullWidth
          label={dict.member.auth.gender.label}
          helperText={state?.errors.gender?.join("\n")}
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
          error={!!state?.errors.email}
          fullWidth
          helperText={state?.errors.email?.join("\n")}
          label={dict.member.auth.email}
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="new-password"
          error={isPasswordError}
          fullWidth
          helperText={passwordHelperContent}
          label={dict.member.auth.password}
          name="password"
          onChange={handleChange}
          required
          slotProps={{
            // 這個要測測
            formHelperText: { component: "div" },
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
          error={isConfirmPasswordError}
          fullWidth
          helperText={confirmPasswordHelperContent}
          label={dict.member.auth.confirmPassword}
          name="confirmPassword"
          onChange={handleChange}
          required
          slotProps={{
            // 這個要測測
            formHelperText: { component: "div" },
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
              error={!!state?.errors.phone}
              fullWidth
              helperText={state?.errors.phone?.join("\n")}
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
        <Button
          disabled={pending}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
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
