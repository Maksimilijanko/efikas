import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from '@assets/locales/en.json';
import sr from '@assets/locales/sr.json';

const resources = {
    en: { translation: en, },
    sr: { translation: sr, },
};

const initI18n = async() => {
    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v4",
            resources,
            //lng: getLocales()[0].languageCode, // Set initial language based on device locale
            lng: 'sr', // default language
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false
            }
        });
}
initI18n();

export default i18n;