enum GenderEnum {
  Female = "FEMALE",
  Male = "MALE",
  NotDisclosed = "NOT_DISCLOSED",
}

type GenderLabel = "female" | "male" | "notDisclosed";

export const GENDER_LABELS: Record<GenderEnum, GenderLabel> = {
  [GenderEnum.Female]: "female",
  [GenderEnum.Male]: "male",
  [GenderEnum.NotDisclosed]: "notDisclosed",
};

export const GENDER_VALUES = [
  GenderEnum.Female,
  GenderEnum.Male,
  GenderEnum.NotDisclosed,
] as const;
