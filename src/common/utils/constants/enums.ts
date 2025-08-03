export const Role = {
  ADMIN: "ADMIN",
  FARMER: "FARMER",
} as const;

export const CropType = {
  CURRENT: "Current",
  PREVIOUS: "Previous",
} as const;

export const FarmersUsing = {
  SOLAR_WATER: "solar-pump-for-water",
  NATURAL_FERTILIZER: "natural-fertilizer",
  OPTED_FOR_CERT: "opted-for-natural-produce-certification",
  ELIGIBLE_GREEN_CRED: "eligible-for-green-credit",
} as const;
