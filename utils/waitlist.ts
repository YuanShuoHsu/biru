import { waitlistErrorCodeValues } from "@/types/api";
import type {
  WaitlistErrorCode,
  WaitlistStatusResponse,
} from "@/types/waitlist";

import type { FetchError } from "@/utils/fetcher";

export const getWaitlistErrorCode = (
  error: unknown,
): WaitlistErrorCode | undefined => {
  const code = (error as FetchError)?.info?.code;

  return waitlistErrorCodeValues.find((value) => value === code);
};

export const getWaitlistUnavailable = ({
  cutoff,
  enabled,
  open,
  paused,
}: WaitlistStatusResponse) =>
  !enabled
    ? "disabled"
    : paused
      ? "paused"
      : !open
        ? "closed"
        : cutoff
          ? "cutoff"
          : null;
