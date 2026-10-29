"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import useSWR from "swr";

import { menuSocket } from "@/app/socket";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import { AccessTime } from "@mui/icons-material";
import { Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { PrepEstimate } from "@/types/orders";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",

  [theme.breakpoints.up("sm")]: {
    justifyContent: "flex-end",
  },
}));

interface OrderPrepEstimateChipProps {
  initialEstimate: PrepEstimate | null;
  organizationSlug: string;
}

const OrderPrepEstimateChip = ({
  initialEstimate,
  organizationSlug,
}: OrderPrepEstimateChipProps) => {
  const tOrder = useTranslations("order");

  const { data, error, mutate } = useSWR<PrepEstimate>(
    `/api/organizations/${organizationSlug}/orders/prep-estimate`,
    {
      fallbackData: initialEstimate ?? undefined,
      onError: () => {},
      revalidateOnMount: !initialEstimate,
    },
  );

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    const handleUpdate = () => {
      mutate();
    };

    handleUpdate();

    menuSocket.on("prepEstimateUpdated", handleUpdate);

    return () => {
      menuSocket.off("prepEstimateUpdated", handleUpdate);
    };
  }, [isConnected, mutate]);

  if (error || !data?.estimatedMinutes) return null;

  return (
    <StyledBox>
      <Chip
        color="primary"
        icon={<AccessTime />}
        label={tOrder("prepEstimate.label", {
          minutes: data.estimatedMinutes,
        })}
        variant="outlined"
      />
    </StyledBox>
  );
};

export default OrderPrepEstimateChip;
