import { z } from 'zod';
import { t } from 'i18next'

export namespace StoreValidation {
    export const schema = z.object({
        name: z.string().min(2, t('profile.store.validation.nameError')),
		address: z.string().min(5, t('profile.store.validation.addressError')),
		activity: z.string().min(2,  t('profile.store.validation.activityError')),
		activityCode: z.string().regex(/^\d+(\.\d+)*$/, t('profile.store.validation.activityCodeError')),
		jib: z.string().length(13, t('profile.store.validation.jibLengthError')).regex(/^\d+$/,  t('profile.store.validation.jibFormatError')),
    });

    export type FormValues = z.infer<typeof schema>;
}

export namespace LoginValidation {
    export const schema = z.object({
        email: z.email(t('auth.errors.emailError')).min(10, t('auth.errors.emailLengthError', { length: 10 })),
		password: z.string().min(8, t('auth.errors.passwordLengthError')),
    });

    export type FormValues = z.infer<typeof schema>;
}

export namespace RegistrationValidation {
    export const schema = z.object({
		name: z.string().min(2, t('profile.store.validation.nameError')),
		surname: z.string().min(2, t('profile.store.validation.nameError')),
		email: z.email(t('auth.errors.emailError')).min(10, t('auth.errors.emailError', { length: 10 })),
		password: z.string().min(8, t('auth.errors.passwordLengthError')),
		repeatPassword: z.string().min(8, t('auth.errors.passwordLengthError')),
		jmbg: z.string().length(13, t('auth.errors.jmbgLengthError')).regex(/^\d+$/,  t('auth.errors.jmbgFormatError')),
		address: z.string().min(5, t('auth.errors.addressLengthError', { length: 5 }))
    })
	.refine((data) => data.password === data.repeatPassword, {
		message: t('auth.errors.passwordMismatchError'),
		path: ['repeatPassword'], // show error under repeatPassword
	});

    export type FormValues = z.infer<typeof schema>;
}

