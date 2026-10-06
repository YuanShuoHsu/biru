"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWR from "swr";

import { type WaitlistFormValues, useWaitlistFormSchema } from "./definitions";

import { menuSocket } from "@/app/socket";

import CountryAutocomplete from "@/components/CountryAutocomplete";
import FormCard, { StyledCardContent } from "@/components/FormCard";
import TextMaskCustom from "@/components/TextMaskCustom";
import WaitlistStatTile from "@/components/WaitlistStatTile";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useRouter } from "@/i18n/navigation";

import { useAuthStore } from "@/providers/auth-store-provider";

import { Campaign, HourglassTop, People } from "@mui/icons-material";
import {
  Alert,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type { OrganizationResponse } from "@/types/organizations";
import type {
  CreateWaitlistTicketDto,
  WaitlistStatusResponse,
  WaitlistTicketResponse,
} from "@/types/waitlist";

import { formatFullName } from "@/utils/auth";
import { getPhoneDefaults, getPhoneFormatting } from "@/utils/countries";
import { getErrorMessage } from "@/utils/errors";
import { fetcher } from "@/utils/fetcher";
import { enableCallAlerts, getWaitlistErrorCode } from "@/utils/waitlist";

const StyledStack = styled(Stack)(({ theme }) => ({
  alignSelf: "center",
  gap: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
  width: "100%",
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

const GroupRowStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

const GroupLabelStack = styled(Stack)(({ theme }) => ({
  flexShrink: 0,
  width: theme.spacing(9),

  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
    columnGap: theme.spacing(1),
    flexDirection: "row",
    width: "100%",
  },
}));

const PartySizeStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  color: theme.vars.palette.text.secondary,
  gap: theme.spacing(0.5),
}));

interface WaitlistProps {
  organization: OrganizationResponse;
  status: WaitlistStatusResponse;
}

const Waitlist = ({ organization, status: initialStatus }: WaitlistProps) => {
  const session = useAuthStore((state) => state.session);

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const { enqueueSnackbar } = useSnackbar();

  const locale = useLocale();

  const router = useRouter();

  const tCommon = useTranslations("common");
  const tOrder = useTranslations("order");
  const tWaitlist = useTranslations("waitlist");

  const waitlistFormSchema = useWaitlistFormSchema();

  const { data: status = initialStatus, mutate } =
    useSWR<WaitlistStatusResponse>(
      `/api/organizations/${organization.slug}/waitlist`,
      { fallbackData: initialStatus },
    );

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    menuSocket
      .timeout(5000)
      .emitWithAck("joinPublicWaitlist", { organizationId: organization.id })
      .then((joined: WaitlistStatusResponse) => mutate(joined, false))
      .catch(() => {});

    const handleUpdate = () => {
      mutate();
    };

    menuSocket.on("publicWaitlistUpdated", handleUpdate);

    return () => {
      menuSocket.off("publicWaitlistUpdated", handleUpdate);
    };
  }, [isConnected, mutate, organization.id]);

  const phoneDefaults = getPhoneDefaults(session?.user.phoneNumber, locale);

  const {
    control,
    formState: { errors, isSubmitted, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<WaitlistFormValues>({
    defaultValues: {
      countryCode: phoneDefaults.countryCode || "",
      email: session?.user.email || "",
      name: session
        ? formatFullName(
            session.user.lang,
            session.user.firstName,
            session.user.lastName,
          )
        : "",
      partySize: "",
      telephone: phoneDefaults.telephone,
    },
    resolver: zodResolver(waitlistFormSchema),
  });

  const [countryCode, partySize, telephone] = useWatch({
    control,
    name: ["countryCode", "partySize", "telephone"],
  });

  const { mask, placeholder } = getPhoneFormatting(countryCode);

  const maxPartySize = Math.max(
    ...status.groups.map(({ maxPartySize }) => maxPartySize),
  );

  const unavailable = !status.enabled
    ? "disabled"
    : status.paused
      ? "paused"
      : !status.open
        ? "closed"
        : status.cutoff
          ? "cutoff"
          : null;

  const handleFormSubmit = async ({
    countryCode,
    email,
    name,
    partySize,
    telephone,
  }: WaitlistFormValues) => {
    try {
      const ticket = await fetcher<WaitlistTicketResponse>(
        `/api/organizations/${organization.slug}/waitlist/tickets`,
        {
          body: JSON.stringify({
            email: email || undefined,
            name,
            partySize: Number(partySize),
            phoneNumber: parsePhoneNumberWithError(
              telephone,
              countryCode as CountryCode,
            ).number,
          } satisfies CreateWaitlistTicketDto),
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          method: "POST",
        },
      );

      router.push(`/waitlist/${organization.slug}/${ticket.id}`);
    } catch (error) {
      const code = getWaitlistErrorCode(error);

      if (code) mutate();

      enqueueSnackbar(
        code ? tWaitlist(`errors.${code}`) : getErrorMessage(error),
        { variant: "error" },
      );
    }
  };

  return (
    <StyledStack>
      {unavailable && (
        <Alert severity="warning">
          {tWaitlist(`unavailable.${unavailable}`)}
        </Alert>
      )}
      {status.enabled && (
        <Card variant="outlined">
          <StyledCardContent>
            <BoldTypography color="textSecondary" variant="subtitle2">
              {tWaitlist("groups.title")}
            </BoldTypography>
            <Stack divider={<Divider flexItem />} spacing={1.5}>
              {status.groups.map((group) => (
                <GroupRowStack direction="row" key={group.prefix}>
                  <GroupLabelStack>
                    <BoldTypography variant="h6">
                      {tWaitlist("groups.group", { prefix: group.prefix })}
                    </BoldTypography>
                    <PartySizeStack direction="row">
                      <People fontSize="inherit" />
                      <Typography variant="caption">
                        {group.minPartySize === group.maxPartySize
                          ? tWaitlist("groups.single", {
                              count: group.minPartySize,
                            })
                          : tWaitlist("groups.range", {
                              max: group.maxPartySize,
                              min: group.minPartySize,
                            })}
                      </Typography>
                    </PartySizeStack>
                  </GroupLabelStack>
                  <WaitlistStatTile
                    color="primary"
                    icon={Campaign}
                    label={tWaitlist("groups.current")}
                    value={group.currentTicketNumber || "—"}
                  />
                  <WaitlistStatTile
                    icon={HourglassTop}
                    label={tWaitlist("groups.waiting")}
                    value={tWaitlist("groups.waitingValue", {
                      count: group.waitingCount,
                    })}
                  />
                </GroupRowStack>
              ))}
            </Stack>
          </StyledCardContent>
        </Card>
      )}
      {!unavailable && (
        <FormCard noValidate onSubmit={handleSubmit(handleFormSubmit)}>
          <StyledCardContent>
            <BoldTypography color="textSecondary" variant="subtitle2">
              {tWaitlist("form.title")}
            </BoldTypography>
            <TextField
              {...register("partySize")}
              error={!!errors.partySize}
              fullWidth
              helperText={errors.partySize?.message}
              label={tWaitlist("form.partySize.label")}
              required
              select
              slotProps={{
                inputLabel: { shrink: true },
                select: {
                  displayEmpty: true,
                  renderValue: (selected) =>
                    selected ? (
                      tWaitlist("form.partySize.value", {
                        count: Number(selected),
                      })
                    ) : (
                      <em>{tWaitlist("form.partySize.placeholder")}</em>
                    ),
                },
              }}
              value={partySize}
            >
              {Array.from(
                { length: maxPartySize },
                (_, index) => index + 1,
              ).map((count) => (
                <MenuItem key={count} value={String(count)}>
                  {tWaitlist("form.partySize.value", { count })}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              autoComplete="name"
              error={!!errors.name}
              fullWidth
              helperText={errors.name?.message}
              label={tOrder("checkout.customer.name.label")}
              placeholder={tOrder("checkout.customer.name.placeholder")}
              required
              {...register("name")}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CountryAutocomplete
                  error={!!errors.countryCode}
                  helperText={errors.countryCode?.message}
                  label={tOrder("checkout.customer.countryCode.label")}
                  mode="country"
                  placeholder={tOrder(
                    "checkout.customer.countryCode.placeholder",
                  )}
                  required
                  value={countryCode}
                  {...register("countryCode")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register("telephone")}
                  autoComplete="tel"
                  error={!!errors.telephone}
                  fullWidth
                  helperText={errors.telephone?.message}
                  label={tOrder("checkout.customer.telephone.label")}
                  onChange={(e) =>
                    setValue("telephone", e.target.value, {
                      shouldValidate: isSubmitted,
                    })
                  }
                  required
                  slotProps={{
                    input: {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      inputComponent: TextMaskCustom as any,
                      inputProps: { mask, placeholder },
                    },
                  }}
                  type="tel"
                  value={telephone}
                />
              </Grid>
            </Grid>
            <TextField
              autoComplete="email"
              error={!!errors.email}
              fullWidth
              helperText={errors.email?.message}
              label={`${tOrder("checkout.customer.email.label")} ${tCommon("optional")}`}
              placeholder={tOrder("checkout.customer.email.placeholder")}
              type="email"
              {...register("email")}
            />
            <Typography color="textSecondary" variant="body2">
              {tWaitlist("form.notice")}
            </Typography>
            <Button
              fullWidth
              loading={isSubmitting}
              onClick={enableCallAlerts}
              size="large"
              type="submit"
              variant="contained"
            >
              {tWaitlist("form.submit")}
            </Button>
          </StyledCardContent>
        </FormCard>
      )}
    </StyledStack>
  );
};

export default Waitlist;
