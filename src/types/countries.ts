export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export type CountryOption = CountryType & { firstLetter: string };
