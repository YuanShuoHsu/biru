"use client";

import { usePathname, useSearchParams } from "next/navigation";

export const useHref = () => {
  const currentPathname = usePathname();
  const currentSearchParams = useSearchParams();

  const searchParams = new URLSearchParams(currentSearchParams);

  const search = searchParams.toString();
  const queryString = search ? `?${search}` : "";
  const href = `${currentPathname}${queryString}`;

  return {
    href,
    queryString,
    search,
  };
};
