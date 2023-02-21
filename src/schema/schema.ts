import { z } from "zod";

export const userFields = z.object({
  //userId: z.string().cuid().optional(),
  //   petOwner: petOwnerFields.optional(),
  //   petSitter: petSitterFields.optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  imageUri: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  // accounts: Account
});

export const petSitterFields = z.object({
  // user: userFields,
  petTypes: z.array(z.string()),
  verifyStatus: z.boolean(),
  certificationUri: z.string().optional(),
  startPrice: z.number().optional(),
  endPrice: z.number().optional(),
});

export const petOwnerFields = z.object({
  // user: userFields,
  petTypes: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
});

export const petFields = z.object({
  petType: z.string(),
  name: z.string().optional(),
  sex: z.enum(["Male", "Female"]).optional(),
  breed: z.string().optional(),
});

export const petHotelFields = z.object({
  // petSitter: petSitterFields,
  businessLicenseUri: z.string().optional(),
  hotelName: z.string(),
});

export const freelancePetSitterFields = z.object({
  //petSitter: petSitterFields,
  firstName: z.string(),
  lastName: z.string(),
});

export const bookingFields = z.object({
  petSitterId: z.string(),
  startDate: z.date().default(new Date("1-1-1")),
  endDate: z.date().default(new Date("1-1-1")),
  petIdList: z.array(z.string()).default([]),
  note: z.string().nullable().default(null),
});

export const searchField = z.object({
  searchName: z.string().default(""),
  searchRating: z.number().nullable().default(null),
  searchPriceMin: z.number().nullable().default(null),
  searchPriceMax: z.number().nullable().default(null),
  searchLocation: z.string().default(""),
  searchPetType: z.string().default(""),
  searchStartSchedule: z.string().default(""),
  searchEndSchedule: z.string().default(""),
  searchIncludePetSitterType: z.string().default(""),
  searchSortBy: z.string().default(""),
});

export const returnStatus = z.enum(["ERROR", "SUCCESS"]);
export const returnField = z.object({
  status: returnStatus,
  code: z.string().nullable().default(null),
  reason: z.string().nullable().default(null),
  result: z.string().nullable().default(null),
});

export const reviewFields = z.object({
  rating: z.number().gte(1).lte(5),
  text: z.string().optional(),
});

export const postFields = z.object({
  text: z.string(),
  pictureUri: z.string().optional(),
  videoUri: z.string().optional(),
});

export const sessionRequestFields = z.object({
  text: z.string().optional(),
});

export const returnReadPetOwnerFields = {
  userId: true,
  petTypes: true,
  firstName: true,
  lastName: true,
  review: true,
};
export const returnReadPetSitterFields = {
  userId: true,
  // freelancePetSitter :true,
  // petHotel           :true,
  petTypes: true,
  verifyStatus: true,
  certificationUri: true,
  startPrice: true,
  endPrice: true,
  avgRating: true,
};
export const returnReadPetFields = {
  petId: true,
  petOwnerId: true,
  petType: true,
  name: true,
  sex: true,
  breed: true,
};
export const returnReadBookingFields = {
  bookingId: true,
  petOwnerId: true,
  petSitterId: true,
  startDate: true,
  endDate: true,
  numberOfPets: true,
  status: true,
  note: true,
  pet: { select: returnReadPetFields },
  // petOwner: { select: returnReadPetOwnerFields },
  // petSitter: { select: returnReadPetSitterFields },
};
