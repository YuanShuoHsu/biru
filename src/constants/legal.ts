export enum LegalLinkType {
  Terms = "terms",
  Privacy = "privacy",
}

export const LEGAL_LINK_TYPES = [
  LegalLinkType.Terms,
  LegalLinkType.Privacy,
] as const;
