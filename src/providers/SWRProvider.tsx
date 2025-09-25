"use client";

import { SWRConfig, SWRConfiguration } from "swr";

interface SWRProviderProps {
  children: React.ReactNode;
  fallback: SWRConfiguration["fallback"];
}

const SWRProvider = ({ children, fallback }: SWRProviderProps) => (
  <SWRConfig value={{ fallback }}>{children}</SWRConfig>
);

export default SWRProvider;
