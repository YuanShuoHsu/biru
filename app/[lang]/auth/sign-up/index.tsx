// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/
// https://mui.com/x/react-date-pickers/quickstart/
// https://mui.com/x/react-date-pickers/validation/

"use client";

import dayjs, { Dayjs } from "dayjs";
import type { CountryCode } from "libphonenumber-js";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

import { createSignupFormSchema } from "./definitions";

import type { Locale } from "@/app/[lang]/dictionaries";

import CountrySelect from "@/components/CountrySelect";
import FormCard from "@/components/FormCard";
import GoogleButton from "@/components/GoogleButton";
import TextMaskCustom from "@/components/TextMaskCustom";
import UploadAvatars, {
  type UploadAvatarsHandle,
} from "@/components/UploadAvatars";

import { GENDER_LABELS, GENDER_VALUES } from "@/constants/gender";
import { LEGAL_LINK_TYPES, LegalLinkType } from "@/constants/legal";

import { zodResolver } from "@hookform/resolvers/zod";

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
import { useI18nStore } from "@/providers/i18n-store-provider";

import { UserResponseDto } from "@/types/users/user-response.dto";

import { formatPhone, getDefaultCountry, toDigits } from "@/utils/countries";
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
  alignItems: "center",
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

interface AuthSignUpProps {
  lang: Locale;
  redirect?: string;
}

const AuthSignUp = ({ lang, redirect }: AuthSignUpProps) => {
  const defaultCountry = getDefaultCountry(lang);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isGenderFocused, setIsGenderFocused] = useState(false);

  const { setIsAuthLoading } = useAuthStore((state) => state);

  const { dict } = useI18nStore((state) => state);
  const signupFormSchema = createSignupFormSchema(dict);

  type SignupFormData = z.infer<typeof signupFormSchema>;

  type SignupPayload = Omit<SignupFormData, "confirmPassword" | "country"> & {
    countryCode: CountryCode;
    countryLabel: string;
    countryPhone: string;
    redirect?: string;
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<SignupFormData>({
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: defaultCountry,
      phoneNumber: "",
      isSubscribed: true,
    },
    resolver: zodResolver(signupFormSchema),
  });

  const uploadAvatarsRef = useRef<UploadAvatarsHandle>(null);

  const router = useRouter();

  const { isMutating, trigger } = useSWRMutation(
    "/api/users",
    sendRequest<UserResponseDto, SignupPayload>({
      credentials: "include",
    }),
  );

  const langNameDirection = lang === "en" ? "row-reverse" : "row";

  const genderOptions = GENDER_VALUES.map((value) => ({
    label: dict.auth.gender.options[GENDER_LABELS[value]],
    value,
  }));

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const country = watch("country");

  const hasPassword = password.length > 0;
  const hasConfirmPassword = confirmPassword.length > 0;
  const passwordsMatch =
    hasPassword && hasConfirmPassword && password === confirmPassword;

  const passwordRules: PasswordRule[] = [
    {
      key: "minLength",
      passed: password.length >= 8,
      label: dict.validation.password.minLength,
    },
    {
      key: "letter",
      passed: /[a-zA-Z]/.test(password),
      label: dict.validation.password.letter,
    },
    {
      key: "number",
      passed: /\d/.test(password),
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
        component={NextLink}
        href={handleQueryParam(`/${lang}/company/${type}`, {
          [QueryParamKey.Back]: `/${lang}/auth/sign-up`,
          [QueryParamKey.Redirect]: redirect,
        })}
        key={type}
        underline="hover"
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

  const handleBirthDateChange =
    (onChange: (value: string) => void) => (newValue: Dayjs | null) => {
      onChange(newValue?.isValid() ? newValue.format("YYYY-MM-DD") : "");
    };

  const handleGenderFocus = () => setIsGenderFocused(true);
  const handleGenderBlur = () => setIsGenderFocused(false);

  const handleClickShowPassword = (key: "password" | "confirmPassword") => () =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const onSubmit = handleSubmit(
    async ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      confirmPassword: _,
      country: { code, label, phone },
      phoneNumber,
      ...rest
    }) => {
      setIsAuthLoading(true);

      const { avatarSrc: image } = uploadAvatarsRef.current?.getValue() || {};

      const payload: SignupPayload = {
        ...rest,
        countryCode: code,
        countryLabel: label,
        countryPhone: formatPhone(phone),
        ...(image && { image }),
        phoneNumber: toDigits(phoneNumber),
        ...(redirect && { redirect }),
      };

      try {
        const { email, id } = await trigger(payload);

        const verifyEmailHref = handleQueryParam(`/${lang}/auth/verify-email`, {
          [QueryParamKey.Email]: email,
          [QueryParamKey.Identifier]: id,
          [QueryParamKey.Redirect]: redirect,
        });

        router.replace(verifyEmailHref);
      } catch {
      } finally {
        setIsAuthLoading(false);
      }
    },
  );

  return (
    <FormCard component="form" onSubmit={onSubmit}>
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
        <Divider flexItem>{dict.auth.or}</Divider>
        <UploadAvatars ref={uploadAvatarsRef} />
        <Stack width="100%" direction={langNameDirection} spacing={2}>
          <TextField
            autoComplete="family-name"
            error={!!errors.lastName}
            fullWidth
            helperText={errors.lastName?.message}
            label={dict.auth.lastName.label}
            placeholder={dict.auth.lastName.placeholder}
            {...register("lastName")}
          />
          <TextField
            autoComplete="given-name"
            error={!!errors.firstName}
            fullWidth
            helperText={errors.firstName?.message}
            label={dict.auth.firstName.label}
            placeholder={dict.auth.firstName.placeholder}
            required
            {...register("firstName")}
          />
        </Stack>
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <DatePicker
              disableFuture
              label={dict.auth.birthDate.label}
              maxDate={today}
              onChange={handleBirthDateChange(onChange)}
              openTo="year"
              slotProps={{
                textField: {
                  autoComplete: "bday",
                  error: !!error,
                  fullWidth: true,
                  helperText: error?.message,
                  placeholder: dict.auth.birthDate.placeholder,
                  required: true,
                },
              }}
              value={value ? dayjs(value) : null}
              views={["year", "month", "day"]}
              yearsOrder="desc"
            />
          )}
        />
        {/* Incorrect use of <label for=FORM_ELEMENT> */}
        <TextField
          autoComplete="sex"
          defaultValue=""
          error={!!errors.gender}
          fullWidth
          label={dict.auth.gender.label}
          helperText={errors.gender?.message}
          onFocus={handleGenderFocus}
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
          {...register("gender", {
            onBlur: handleGenderBlur,
          })}
        >
          {genderOptions.map(({ label, value }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          autoComplete="email"
          error={!!errors.email}
          fullWidth
          helperText={errors.email?.message}
          label={dict.auth.email.label}
          placeholder={dict.auth.email.placeholder}
          required
          type="email"
          {...register("email")}
        />
        <TextField
          autoComplete="new-password"
          error={isPasswordError}
          fullWidth
          helperText={passwordHelperContent}
          label={dict.auth.password.label}
          placeholder={dict.auth.password.placeholder}
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
          {...register("password")}
        />
        <TextField
          autoComplete="new-password"
          error={isConfirmPasswordError}
          fullWidth
          helperText={confirmPasswordHelperContent}
          label={dict.auth.confirmPassword.label}
          placeholder={dict.auth.confirmPassword.placeholder}
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
          {...register("confirmPassword")}
        />
        <Grid width="100%" container spacing={2}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <Controller
              control={control}
              name="country"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CountrySelect
                  error={!!error}
                  helperText={error?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 8 }}>
            <Controller
              control={control}
              name="phoneNumber"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  autoComplete="tel"
                  error={!!error}
                  fullWidth
                  helperText={error?.message}
                  label={dict.auth.phone}
                  onChange={onChange}
                  required
                  slotProps={{
                    input: {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      inputComponent: TextMaskCustom as any,
                      inputProps: { countryCode: country.phone },
                    },
                  }}
                  type="tel"
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack
          width="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="isSubscribed"
                render={({ field: { onChange, value } }) => (
                  <Checkbox checked={value} onChange={onChange} size="small" />
                )}
              />
            }
            label={
              <Typography variant="body2">{dict.auth.emailUpdates}</Typography>
            }
          />
        </Stack>
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
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{dict.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-in`, {
              [QueryParamKey.Redirect]: redirect,
            })}
            underline="hover"
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
