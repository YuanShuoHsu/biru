// https://swr.vercel.app/docs/mutation
// https://swr.vercel.app/docs/error-handling
// https://github.com/vercel/swr/discussions/939
// https://github.com/vercel/swr/blob/main/examples/basic-typescript/libs/fetch.ts

interface ErrorInfo {
  message: string;
  documentation_url?: string;
}

interface FetchError extends Error {
  info: ErrorInfo;
  status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_NEST_URL;

export const fetcher = async <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const url = `${BASE_URL}${input}`;
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
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as FetchError;

    error.info = data;
    error.status = res.status;
    throw error;
  }

  return data;
};
