export enum QueryParamKey {
  Back = "back",
  Email = "email",
  Identifier = "identifier",
  Lang = "lang",
  RedirectTo = "redirectTo",
}

export const handleQueryParam = (
  path: string,
  params: Partial<Record<QueryParamKey, string | undefined>>,
) => {
  let newPath = path;

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    const separator = newPath.includes("?") ? "&" : "?";
    newPath = `${newPath}${separator}${key}=${encodeURIComponent(value)}`;
  });

  return newPath;
};
