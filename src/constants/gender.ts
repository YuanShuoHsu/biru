enum GenderOption {
  Female = "FEMALE",
  Male = "MALE",
  NotDisclosed = "NOT_DISCLOSED",
}

type GenderLabel = "female" | "male" | "notDisclosed";

export const GENDER_LABELS: Record<GenderOption, GenderLabel> = {
  [GenderOption.Female]: "female",
  [GenderOption.Male]: "male",
  [GenderOption.NotDisclosed]: "notDisclosed",
};

export const GENDER_VALUES = [
  GenderOption.Female,
  GenderOption.Male,
  GenderOption.NotDisclosed,
] as const;
