import { useEffect } from "react";
import useSWR from "swr";

import { emitMenuWithAck, menuSocket } from "@/app/socket";

import { useSocketConnection } from "@/hooks/useSocketConnection";

import type { OrganizationResponse } from "@/types/organizations";
import type { WaitlistStatusResponse } from "@/types/waitlist";

export const usePublicWaitlistStatus = (
  organization: OrganizationResponse,
  initialStatus: WaitlistStatusResponse,
) => {
  const { data: status = initialStatus, mutate } =
    useSWR<WaitlistStatusResponse>(
      `/api/organizations/${organization.slug}/waitlist`,
      {
        fallbackData: initialStatus,
        refreshInterval: 60_000,
        revalidateOnMount: false,
      },
    );

  const { isConnected } = useSocketConnection(menuSocket);

  useEffect(() => {
    if (!isConnected) return;

    emitMenuWithAck<WaitlistStatusResponse>("joinPublicWaitlist", {
      organizationId: organization.id,
    })
      .then((joined) => mutate(joined, false))
      .catch(() => mutate());

    const handleUpdate = () => {
      mutate();
    };

    menuSocket.on("publicWaitlistUpdated", handleUpdate);

    return () => {
      menuSocket.off("publicWaitlistUpdated", handleUpdate);
      menuSocket.emit("leavePublicWaitlist", {
        organizationId: organization.id,
      });
    };
  }, [isConnected, mutate, organization.id]);

  return { mutate, status };
};
