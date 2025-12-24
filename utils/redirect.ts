export const handleRedirectParams = (path: string, redirect?: string) => {
  if (!redirect) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}redirect=${encodeURIComponent(redirect)}`;
};
