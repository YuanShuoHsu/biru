export const handleRedirectParams = (path: string, redirect?: string) => {
  if (!redirect) return path;

  return `${path}?redirect=${encodeURIComponent(redirect)}`;
};
