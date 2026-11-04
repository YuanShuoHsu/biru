import { headers } from "next/headers";

// https://vercel.com/docs/headers/request-headers#x-forwarded-for
export const clientIpHeaders = async (): Promise<Record<string, string>> => {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim();
  const secret = process.env.CLIENT_IP_FORWARD_SECRET;

  return ip && secret
    ? { "x-forwarded-client-ip": ip, "x-client-ip-forward-secret": secret }
    : {};
};
