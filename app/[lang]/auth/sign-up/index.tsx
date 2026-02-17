// https://nextjs.org/docs/app/guides/authentication
// https://mui.com/toolpad/core/react-sign-up-page/
// https://mui.com/store/sign-up/
// https://mui.com/x/react-date-pickers/quickstart/
// https://mui.com/x/react-date-pickers/validation/

"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { type BaseSyntheticEvent, useCallback, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { createSignupFormSchema } from "./definitions";

import type { Locale } from "@/app/[lang]/dictionaries";

import FormCard from "@/components/FormCard";
import GoogleButton from "@/components/GoogleButton";
import UploadAvatars, {
  type UploadAvatarsHandle,
} from "@/components/UploadAvatars";

import { LegalLinkType } from "@/constants/legal";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useI18nStore } from "@/providers/i18n-store-provider";

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

const StyledTypography = styled(Typography)({
  whiteSpace: "pre-line",
});

// const today = dayjs();

interface PasswordRule {
  key: string;
  passed: boolean;
  label: string;
}

interface AuthSignUpProps {
  lang: Locale;
  redirectTo?: string;
}

const AuthSignUp = ({ lang, redirectTo }: AuthSignUpProps) => {
  // const defaultCountry = getDefaultCountry(lang);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // const [isGenderFocused, setIsGenderFocused] = useState(false);

  const { dict } = useI18nStore((state) => state);
  const signupFormSchema = createSignupFormSchema(dict);

  type SignupFormData = z.infer<typeof signupFormSchema>;

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignupFormData>({
    defaultValues: {
      lastName: "",
      firstName: "",
      // birthDate: "",
      // gender: "",
      email: "",
      password: "",
      confirmPassword: "",
      // country: defaultCountry,
      // phoneNumber: "",
      emailSubscribed: true,
    },
    resolver: zodResolver(signupFormSchema),
  });

  const uploadAvatarsRef = useRef<UploadAvatarsHandle>(null);

  const router = useRouter();

  const langNameDirection = lang === "en" ? "row-reverse" : "row";

  // const genderOptions = GENDER_VALUES.map((value) => ({
  //   label: dict.auth.gender.options[GENDER_LABELS[value]],
  //   value,
  // }));

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });
  // const country = watch("country");

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

  const renderLegalLink = (type: LegalLinkType) => (
    <MuiLink
      component={NextLink}
      href={handleQueryParam(`/${lang}/company/${type}`, {
        [QueryParamKey.Back]: `/${lang}/auth/sign-up`,
        [QueryParamKey.RedirectTo]: redirectTo,
      })}
      key={type}
      underline="hover"
    >
      {dict.company.legal[type].label}
    </MuiLink>
  );

  // const handleBirthDateChange =
  //   (onChange: (value: string) => void) => (newValue: Dayjs | null) => {
  //     onChange(newValue?.isValid() ? newValue.format("YYYY-MM-DD") : "");
  //   };

  // const handleGenderFocus = () => setIsGenderFocused(true);
  // const handleGenderBlur = () => setIsGenderFocused(false);

  const handleClickShowPassword = (key: "password" | "confirmPassword") => () =>
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const onSubmitHandler = useCallback(
    async ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      confirmPassword: _,
      // country: { code },
      // phoneNumber,
      ...rest
    }: SignupFormData) => {
      const { avatarSrc: image } = uploadAvatarsRef.current?.getValue() || {};

      // const parsedPhoneNumber = parsePhoneNumberWithError(phoneNumber, code);

      const { error } = await authClient.signUp.email({
        ...rest,
        // birthDate,
        callbackURL: redirectTo,
        // gender,
        image,
        lang,
        name: (lang === "en"
          ? [rest.firstName, rest.lastName]
          : [rest.lastName, rest.firstName]
        )
          .filter(Boolean)
          .join(" "),
        // phoneNumber,
        fetchOptions: {
          headers: {
            "Accept-Language": lang,
          },
        },
      });

      if (error?.code) {
        const message = getErrorMessage(error.code, lang);
        enqueueSnackbar(message, { variant: "error" });

        return;
      }

      const verifyEmailHref = handleQueryParam(`/${lang}/auth/verify-email`, {
        [QueryParamKey.Email]: rest.email,
        [QueryParamKey.RedirectTo]: redirectTo,
      });

      router.push(verifyEmailHref);
    },
    [lang, redirectTo, router],
  );

  const onSubmit = (event: BaseSyntheticEvent) =>
    handleSubmit(onSubmitHandler)(event);

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
        <GoogleButton action="signUp" lang={lang} redirectTo={redirectTo} />
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
        {/* <Controller
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
        /> */}
        {/* Incorrect use of <label for=FORM_ELEMENT> */}
        {/* <TextField
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
        </TextField> */}
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
        {/* <Grid width="100%" container spacing={2}>
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
                      inputProps: { countryCode: country.code },
                    },
                  }}
                  type="tel"
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid> */}
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
                name="emailSubscribed"
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
          disabled={isSubmitting}
          fullWidth
          loading={isSubmitting}
          loadingPosition="start"
          size="large"
          type="submit"
          variant="contained"
        >
          {dict.auth.signUp.label}
        </Button>
        <StyledTypography
          align="center"
          color="text.secondary"
          variant="caption"
        >
          {interpolate(dict.auth.legalConsent, {
            action: dict.auth.signUp.label,
            terms: renderLegalLink(LegalLinkType.Terms),
            privacy: renderLegalLink(LegalLinkType.Privacy),
          })}
        </StyledTypography>
        <Divider flexItem />
        <Stack flexDirection="row" alignItems="center" gap={0.5}>
          <Typography variant="body2">{dict.auth.hasAccount}</Typography>
          <MuiLink
            component={NextLink}
            href={handleQueryParam(`/${lang}/auth/sign-in`, {
              [QueryParamKey.RedirectTo]: redirectTo,
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
