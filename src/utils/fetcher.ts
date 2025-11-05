// https://swr.vercel.app/docs/mutation
// https://swr.vercel.app/docs/error-handling
// https://github.com/vercel/swr/discussions/939
// https://github.com/vercel/swr/blob/main/examples/basic-typescript/libs/fetch.ts

interface ErrorInfo {
  message: string;
  documentation_url?: string;
}

interface FetchError extends Error {
  info?: ErrorInfo;
  status?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_NEST_URL;

const resolveUrl = (input: RequestInfo) => {
  const url = String(input);
  const isAbsolute = /^https?:\/\//i.test(url);
  if (isAbsolute) return url;

  const isServer = typeof window === "undefined";
  if (isServer) return `${BASE_URL}${url}`;

  return url;
};

export const fetcher = async <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const url = resolveUrl(input);
  const res = await fetch(url, init);

  const contentType = res.headers.get("content-type") || "";

  let data;
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = { message: "Failed to parse JSON response." };
    }
  } else {
    const text = await res.text();
    data = { message: text };
  }

  if (!res.ok) {
    const error: FetchError = new Error(
      "An error occurred while fetching the data.",
    );

    error.info = data;
    error.status = res.status;
    throw error;
  }

  return data;
};

export const sendRequest =
  (init?: RequestInit) =>
  async <TReq = unknown, TRes = unknown>(
    url: string,
    { arg }: { arg: TReq },
  ): Promise<TRes> =>
    fetcher<TRes>(url, {
      body: JSON.stringify(arg),
      method: "POST",
      ...init,
    });
