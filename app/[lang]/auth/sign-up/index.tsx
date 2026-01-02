// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/
// https://mui.com/x/react-date-pickers/quickstart/
// https://mui.com/x/react-date-pickers/validation/

"use client";

import dayjs, { Dayjs } from "dayjs";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

import { createSignupFormSchema, type FormState } from "./definitions";

import CountrySelect from "@/components/CountrySelect";
import FormCard from "@/components/FormCard";
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

import { useAuthStore } from "@/providers/auth-store-provider";

import { UserResponseDto } from "@/types/users/user-response.dto";

import { getDefaultCountryCode } from "@/utils/countries";
import { sendRequest } from "@/utils/fetcher";
import { interpolate } from "@/utils/i18n";
import { handleQueryParam, QueryParamKey } from "@/utils/queryParams";

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

interface PasswordRule {
  key: string;
  passed: boolean;
  label: string;
}

interface SignUpFormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phone: string;
  isSubscribed: boolean;
}

interface AuthSignUpProps {
  lang: string;
  redirect?: string;
}

const AuthSignUp = ({ lang, redirect }: AuthSignUpProps) => {
  const defaultCountryCode = getDefaultCountryCode(lang);

  const [form, setForm] = useState<SignUpFormData>({
    lastName: "",
    firstName: "",
    birthDate: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: defaultCountryCode,
    phone: "",
    isSubscribed: true,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isGenderFocused, setIsGenderFocused] = useState(false);

  const [state, setState] = useState<FormState>();

  const { setIsAuthLoading } = useAuthStore((state) => state);

  const dict = useI18n();
  const signupFormSchema = createSignupFormSchema(dict);

  const router = useRouter();

  const { isMutating, trigger } = useSWRMutation(
    "/api/users",
    sendRequest<UserResponseDto, Omit<SignUpFormData, "confirmPassword">>({
      credentials: "include",
    }),
  );

  const langNameDirection = lang === "en" ? "row-reverse" : "row";

  const genderOptions = GENDER_VALUES.map((value) => ({
    label: dict.auth.gender.options[GENDER_LABELS[value]],
    value,
  }));

  const hasPassword = form.password.length > 0;
  const hasConfirmPassword = form.confirmPassword.length > 0;
  const passwordsMatch =
    hasPassword && hasConfirmPassword && form.password === form.confirmPassword;

  const passwordRules: PasswordRule[] = [
    {
      key: "minLength",
      passed: form.password.length >= 8,
      label: dict.validation.password.minLength,
    },
    {
      key: "letter",
      passed: /[a-zA-Z]/.test(form.password),
      label: dict.validation.password.letter,
    },
    {
      key: "number",
      passed: /\d/.test(form.password),
      label: dict.validation.password.number,
    },
  ];

  const isPasswordError =
    hasPassword && passwordRules.some(({ passed }) => !passed);

  const confirmPasswordRules: PasswordRule[] = [
    {
      key: "match",
      passed: passwordsMatch,
      label: dict.validation.password.match,
    },
  ];

  const isConfirmPasswordError =
    hasConfirmPassword && !confirmPasswordRules[0].passed;

  const renderPasswordRules = (rules: PasswordRule[], hasValue: boolean) => (
    <List dense disablePadding>
      {rules.map(({ key, label, passed }) => {
        const color = hasValue
          ? passed
            ? "primary.main"
            : "error.main"
          : "text.secondary";

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

  const passwordHelperContent = renderPasswordRules(passwordRules, hasPassword);

  const confirmPasswordHelperContent = renderPasswordRules(
    confirmPasswordRules,
    hasConfirmPassword,
  );

  const legalConsentText = interpolate(dict.auth.legalConsent, {
    action: dict.auth.signUp.label,
    terms: `{${LegalLinkType.Terms}}`,
    privacy: `{${LegalLinkType.Privacy}}`,
  });

  const legalPlaceholders = Object.fromEntries(
    LEGAL_LINK_TYPES.map((type) => [
      `{${type}}`,
      <MuiLink
        key={type}
        component={NextLink}
        href={handleQueryParam(`/${lang}/company/${type}`, {
          [QueryParamKey.Back]: `/${lang}/auth/sign-up`,
          [QueryParamKey.Redirect]: redirect,
        })}
      >
        {dict.company.legal[type].label}
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

  const handleClickShowPassword = (key: "password" | "confirmPassword") => () =>
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

    const validatedFields = signupFormSchema.safeParse(form);

    if (!validatedFields.success) {
      const { fieldErrors } = z.flattenError(validatedFields.error);
      setState({ errors: fieldErrors });

      return;
    }

    setIsAuthLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...data } = form;
      const { email } = await trigger(data);

      const verifyEmailHref = handleQueryParam(`/${lang}/auth/verify-email`, {
        [QueryParamKey.Email]: email,
        [QueryParamKey.Redirect]: redirect,
      });

      router.replace(verifyEmailHref);
    } catch {
    } finally {
      setIsAuthLoading(false);
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
            {dict.auth.signUp.label}
          </Typography>
        }
      />
      <StyledCardContent>
        <GoogleButton action="signUp" lang={lang} redirect={redirect} />
        <Divider>{dict.auth.or}</Divider>
        <Stack direction={langNameDirection} spacing={2}>
          <TextField
            autoComplete="family-name"
            error={!!state?.errors?.lastName}
            fullWidth
            helperText={state?.errors?.lastName?.join("\n")}
            label={dict.auth.lastName.label}
            name="lastName"
            onChange={handleChange}
            placeholder={dict.auth.lastName.placeholder}
            value={form.lastName}
          />
          <TextField
            autoComplete="given-name"
            error={!!state?.errors?.firstName}
            fullWidth
            helperText={state?.errors?.firstName?.join("\n")}
            label={dict.auth.firstName.label}
            name="firstName"
            onChange={handleChange}
            placeholder={dict.auth.firstName.placeholder}
            required
            value={form.firstName}
          />
        </Stack>
        <DatePicker
          disableFuture
          label={dict.auth.birthDate.label}
          maxDate={today}
          name="birthDate"
          onChange={handleBirthDateChange}
          openTo="year"
          slotProps={{
            textField: {
              autoComplete: "bday",
              error: !!state?.errors?.birthDate,
              helperText: state?.errors?.birthDate?.join("\n"),
              placeholder: dict.auth.birthDate.placeholder,
              required: true,
            },
          }}
          value={form.birthDate ? dayjs(form.birthDate) : null}
          views={["year", "month", "day"]}
          yearsOrder="desc"
        />
        {/* Incorrect use of <label for=FORM_ELEMENT> */}
        <TextField
          autoComplete="sex"
          error={!!state?.errors?.gender}
          fullWidth
          label={dict.auth.gender.label}
          helperText={state?.errors?.gender?.join("\n")}
          name="gender"
          onBlur={() => setIsGenderFocused(false)}
          onChange={handleChange}
          onFocus={() => setIsGenderFocused(true)}
          required
          select
          slotProps={{
            select: {
              displayEmpty: isGenderFocused,
              renderValue: (value: unknown) => {
                if (!value)
                  return (
                    <Typography color="gray">
                      {dict.auth.gender.placeholder}
                    </Typography>
                  );

                return genderOptions.find(
                  ({ value: optionValue }) => optionValue === value,
                )?.label;
              },
            },
          }}
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
          error={!!state?.errors?.email}
          fullWidth
          helperText={state?.errors?.email?.join("\n")}
          label={dict.auth.email.label}
          name="email"
          onChange={handleChange}
          placeholder={dict.auth.email.placeholder}
          required
          type="email"
          value={form.email}
        />
        <TextField
          autoComplete="new-password"
          error={isPasswordError}
          fullWidth
          helperText={passwordHelperContent}
          label={dict.auth.password.label}
          name="password"
          onChange={handleChange}
          required
          slotProps={{
            formHelperText: { component: "div" },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.password
                        ? dict.auth.hidePassword
                        : dict.auth.showPassword
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
          placeholder={dict.auth.password.placeholder}
        />
        <TextField
          autoComplete="new-password"
          error={isConfirmPasswordError}
          fullWidth
          helperText={confirmPasswordHelperContent}
          label={dict.auth.confirmPassword.label}
          name="confirmPassword"
          onChange={handleChange}
          required
          slotProps={{
            formHelperText: { component: "div" },
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    aria-label={
                      showPassword.confirmPassword
                        ? dict.auth.hidePassword
                        : dict.auth.showPassword
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
          placeholder={dict.auth.confirmPassword.placeholder}
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <CountrySelect lang={lang} onChange={handleCountryCodeChange} />
          </Grid>
          <Grid size={{ xs: 6, sm: 8 }}>
            <TextField
              autoComplete="tel"
              error={!!state?.errors?.phone}
              fullWidth
              helperText={state?.errors?.phone?.join("\n")}
              inputMode="tel"
              label={dict.auth.phone}
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
              checked={form.isSubscribed}
              name="isSubscribed"
              onChange={handleChange}
              size="small"
            />
          }
          label={
            <Typography variant="body2">{dict.auth.emailUpdates}</Typography>
          }
        />
      </StyledCardContent>
      <StyledCardActions disableSpacing>
        <Button
          disabled={isMutating}
          fullWidth
          loading={isMutating}
          loadingPosition="start"
          size="large"
          type="submit"
          variant="contained"
        >
          {dict.auth.signUp.label}
        </Button>
        <Typography variant="caption" color="text.secondary" align="center">
          {legalConsent}
        </Typography>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2">{dict.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-in`, {
              [QueryParamKey.Redirect]: redirect,
            })}
            variant="body2"
          >
            {dict.auth.signIn.label}
          </MuiLink>
        </Stack>
      </StyledCardActions>
    </FormCard>
  );
};

export default AuthSignUp;
