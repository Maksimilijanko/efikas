import { t } from "i18next";
import { z } from "zod";

const REQUIRED_FIELD_ERROR = t("auth.errors.requiredFieldError");
const INVALID_NUMBER_ERROR = t("common.errors.invalidNumberError");

export namespace StoreValidation {
  export const schema = z.object({
    name: z
      .string(REQUIRED_FIELD_ERROR)
      .min(2, t("profile.store.validation.nameError")),
    address: z
      .string(REQUIRED_FIELD_ERROR)
      .min(5, t("profile.store.validation.addressError")),
    activity: z
      .string(REQUIRED_FIELD_ERROR)
      .min(2, t("profile.store.validation.activityError")),
    activityCode: z
      .string(REQUIRED_FIELD_ERROR)
      .regex(/^\d+(\.\d+)*$/, t("profile.store.validation.activityCodeError")),
    jib: z
      .string(REQUIRED_FIELD_ERROR)
      .length(13, t("profile.store.validation.jibLengthError"))
      .regex(/^\d+$/, t("profile.store.validation.jibFormatError")),
  });

  export type FormValues = z.infer<typeof schema>;
}

export namespace LoginValidation {
  export const schema = z.object({
    email: z
      .string(REQUIRED_FIELD_ERROR)
      .email(t("auth.errors.emailError"))
      .min(10, t("auth.errors.emailLengthError", { length: 10 })),
    password: z
      .string(REQUIRED_FIELD_ERROR)
      .min(8, t("auth.errors.passwordLengthError")),
  });

  export type FormValues = z.infer<typeof schema>;
}

export namespace RegistrationValidation {
  export const schema = z
    .object({
      name: z
        .string(REQUIRED_FIELD_ERROR)
        .min(2, t("profile.store.validation.nameError")),
      surname: z
        .string(REQUIRED_FIELD_ERROR)
        .min(2, t("profile.store.validation.nameError")),
      email: z
        .string(REQUIRED_FIELD_ERROR)
        .email(t("auth.errors.emailError"))
        .min(10, t("auth.errors.emailError", { length: 10 })),
      password: z
        .string(REQUIRED_FIELD_ERROR)
        .min(8, t("auth.errors.passwordLengthError")),
      repeatPassword: z
        .string(REQUIRED_FIELD_ERROR)
        .min(8, t("auth.errors.passwordLengthError")),
      jmbg: z
        .string(REQUIRED_FIELD_ERROR)
        .length(13, t("auth.errors.jmbgLengthError"))
        .regex(/^\d+$/, t("auth.errors.jmbgFormatError")),
      address: z
        .string(REQUIRED_FIELD_ERROR)
        .min(5, t("auth.errors.addressLengthError", { length: 5 })),
      phoneNumber: z
        .string(REQUIRED_FIELD_ERROR)
        .min(11, t("auth.errors.phoneNumberLengthError", { length: 11 }))
        .regex(
          /^06[0-9]\/\d{3}-\d{3}$/,
          t("auth.errors.phoneNumberFormatError"), //t('auth.errors.phoneNumberFormatError') // "Invalid format. Expected: 06X/123-456"
        ),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: t("auth.errors.passwordMismatchError"),
      path: ["repeatPassword"], // show error under repeatPassword
    });

  export type FormValues = z.infer<typeof schema>;
}

export namespace ResetPasswordValidation {
  export const schema = z
    .object({
      email: z
        .string(REQUIRED_FIELD_ERROR)
        .email(t("auth.errors.emailError"))
        .min(10, t("auth.errors.emailError", { length: 10 })),
      password: z
        .string(REQUIRED_FIELD_ERROR)
        .min(8, t("auth.errors.passwordLengthError")),
      repeatPassword: z
        .string(REQUIRED_FIELD_ERROR)
        .min(8, t("auth.errors.passwordLengthError")),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: t("auth.errors.passwordMismatchError"),
      path: ["repeatPassword"], // show error under repeatPassword
    });

  export type FormValues = z.infer<typeof schema>;
}

const genderEnum = z.enum(
  ["Male", "Female"],
  t("auth.errors.requiredFieldError"),
);

const dateValidator = z.date().nullable();

export namespace GuestValidation {
  const commonFields = {
    isLocal: z.boolean(),

    name: z.string(REQUIRED_FIELD_ERROR).min(2),
    surname: z.string(REQUIRED_FIELD_ERROR).min(2),
    gender: genderEnum,

    phoneNumber: z.string(REQUIRED_FIELD_ERROR).regex(/^06[0-9]\/\d{3}-\d{3}$/),

    birthDate: dateValidator,
    birthPlace: z.string(REQUIRED_FIELD_ERROR).min(2),
    birthCountry: z.string().min(2).optional(),

    address: z.string(REQUIRED_FIELD_ERROR).min(5),

    accommodationUnitNumber: z.number().int().positive(),
    accommodationUnitFloor: z.number().int().min(0),

    dateTimeOfArrival: dateValidator.and(
      z.date("reservations.validation.selectArrival"),
    ),
    dateTimeOfDeparture: dateValidator.and(
      z.date("reservations.validation.selectDeparture"),
    ),

    price: z.number().min(0),

    issuedInvoiceNumber: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
  };

  const domesticGuestSchema = z.object({
    ...commonFields,
    isLocal: z.literal(true),

    jmbg: z.string().length(13, t("reservations.validation.id")).regex(/^\d+$/),

    birthMunicipality: z.string(REQUIRED_FIELD_ERROR).min(5),
  });

  const foreignGuestSchema = z.object({
    ...commonFields,
    isLocal: z.literal(false),

    citizenship: z.string().min(1),
    passportNumber: z.string().min(1),
    passportIssuedDate: dateValidator,

    visaType: z.string().nullable().optional(),
    visaNumber: z.string().nullable().optional(),
    permittedResidenceDate: dateValidator,
    entryDate: dateValidator,
    entryPlace: z.string().nullable().optional(),
  });

  export const schema = z
    .discriminatedUnion("isLocal", [domesticGuestSchema, foreignGuestSchema])
    .refine(
      (data) => {
        if (!data.dateTimeOfArrival || !data.dateTimeOfDeparture) return true; // skip if null
        return data.dateTimeOfDeparture > data.dateTimeOfArrival;
      },
      {
        message: t("reservations.validation.departureAfterArrival"),
        path: ["dateTimeOfDeparture"], // error shown under this field
      },
    );

  export type FormValues = z.infer<typeof schema>;
}
