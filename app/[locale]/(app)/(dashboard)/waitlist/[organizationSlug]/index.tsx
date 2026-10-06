"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWR from "swr";

import { type WaitlistFormValues, useWaitlistFormSchema } from "./definitions";

import { menuSocket } from "@/app/socket";

import CountryAutocomplete from "@/components/CountryAutocomplete";
import FormCard, { StyledCardContent } from "@/components/FormCard";
import TextMaskCustom from "@/components/TextMaskCustom";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { useRouter } from "@/i18n/navigation";

import { useAuthStore } from "@/providers/auth-store-provider";
import { useDialogStore } from "@/providers/dialog-store-provider";

import {
  Alert,
  Button,
  Card,
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
import { getWaitlistErrorCode } from "@/utils/waitlist";

const KIOSK_RESET_MS = 20 * 1000;

const StyledStack = styled(Stack)(({ theme }) => ({
  alignSelf: "center",
  gap: theme.spacing(2),
  maxWidth: theme.breakpoints.values.sm,
  width: "100%",
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

const GroupCard = styled(Card)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(1.5),
  textAlign: "center",
}));

const KioskStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface WaitlistProps {
  organization: OrganizationResponse;
  status: WaitlistStatusResponse;
}

const Waitlist = ({ organization, status: initialStatus }: WaitlistProps) => {
  const session = useAuthStore((state) => state.session);
  const { closeDialog, setDialog } = useDialogStore((state) => state);

  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );

  const { enqueueSnackbar } = useSnackbar();

  const locale = useLocale();

  const router = useRouter();

  const searchParams = useSearchParams();
  const isKiosk = searchParams.get("kiosk") === "true";

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

  const prefill = session && !isKiosk ? session : null;
  const phoneDefaults = getPhoneDefaults(prefill?.user.phoneNumber, locale);
  const defaultValues: WaitlistFormValues = {
    countryCode: phoneDefaults.countryCode || "",
    email: prefill?.user.email || "",
    name: prefill
      ? formatFullName(
          prefill.user.lang,
          prefill.user.firstName,
          prefill.user.lastName,
        )
      : "",
    partySize: "",
    telephone: phoneDefaults.telephone,
  };

  const {
    control,
    formState: { errors, isSubmitted, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<WaitlistFormValues>({
    defaultValues,
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
        : null;

  const handleKioskTicket = (ticket: WaitlistTicketResponse) => {
    const timer = setTimeout(closeDialog, KIOSK_RESET_MS);

    setDialog({
      confirmText: tWaitlist("kiosk.done"),
      content: (
        <KioskStack>
          <Typography color="textSecondary" variant="body2">
            {tWaitlist("ticket.number")}
          </Typography>
          <BoldTypography color="primary" variant="h2">
            {ticket.ticketNumber}
          </BoldTypography>
          <QRCodeSVG
            size={180}
            value={`${window.location.origin}/${locale}/waitlist/${organization.slug}/${ticket.id}`}
          />
          <Typography align="center" variant="body2">
            {tWaitlist("kiosk.scan")}
          </Typography>
        </KioskStack>
      ),
      onExited: () => {
        clearTimeout(timer);
        reset(defaultValues);
        setIdempotencyKey(crypto.randomUUID());
      },
      open: true,
      showCancel: false,
      title: tWaitlist("kiosk.title"),
    });
  };

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

      if (isKiosk) handleKioskTicket(ticket);
      else router.push(`/waitlist/${organization.slug}/${ticket.id}`);
    } catch (error) {
      const code = getWaitlistErrorCode(error);

      enqueueSnackbar(
        code ? tWaitlist(`errors.${code}`) : getErrorMessage(error),
        { variant: "error" },
      );
    }
  };

  return (
    <StyledStack>
      <BoldTypography variant="h5">
        {tWaitlist("title", { organizationName: organization.name })}
      </BoldTypography>
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
            <Grid container spacing={1}>
              {status.groups.map((group) => (
                <Grid
                  key={group.prefix}
                  size={{ xs: 12 / Math.min(status.groups.length, 3) }}
                >
                  <GroupCard variant="outlined">
                    <BoldTypography color="primary" variant="h4">
                      {group.prefix}
                    </BoldTypography>
                    <Typography variant="body2">
                      {group.minPartySize === group.maxPartySize
                        ? tWaitlist("groups.single", {
                            count: group.minPartySize,
                          })
                        : tWaitlist("groups.range", {
                            max: group.maxPartySize,
                            min: group.minPartySize,
                          })}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {tWaitlist("groups.waitingCount", {
                        count: group.waitingCount,
                      })}
                    </Typography>
                    <Typography color="textSecondary" variant="caption">
                      {group.calledTicketNumbers.length
                        ? tWaitlist("groups.calling", {
                            numbers: group.calledTicketNumbers.join(
                              tCommon("delimiter"),
                            ),
                          })
                        : tWaitlist("groups.notCalling")}
                    </Typography>
                  </GroupCard>
                </Grid>
              ))}
            </Grid>
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
