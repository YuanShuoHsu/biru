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

const BASE_URL = `${process.env.NEXT_PUBLIC_NEST_URL}/api`;

export const fetcher = async <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${input}`, init);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as FetchError;

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
