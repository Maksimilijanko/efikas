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


