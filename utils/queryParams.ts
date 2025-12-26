export enum QueryParamKey {
  Redirect = "redirect",
  Back = "back",
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
