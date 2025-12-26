export enum QueryParamKey {
  Back = "back",
  Email = "email",
  Redirect = "redirect",
}

export const handleQueryParam = (
  path: string,
  key: QueryParamKey,
  value?: string,
) => {
  if (!value) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
};
