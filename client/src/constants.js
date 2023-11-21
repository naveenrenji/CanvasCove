export const GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer Not to Say",
};

export const INTERACTION_TYPES = {
  LIKE: "like",
  VIEW: "view",
};

export const NAME_LENGTHS = {
  MIN: 3,
  MAX: 20
};

export const AGE_DATE_RANGE = {
  MIN: new Date((new Date()).getFullYear() - 75, (new Date()).getMonth(), (new Date()).getDate()),
  MAX: new Date((new Date()).getFullYear() - 15, (new Date()).getMonth(), (new Date()).getDate())
};

export const USER_ROLES = {
  ARTIST: "Artist",
  CONNOISSEUR: "Connoisseur",
};
