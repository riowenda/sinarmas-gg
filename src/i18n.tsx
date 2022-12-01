import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from "./helper/locales/en/language.json";
import translationID from "./helper/locales/id/language.json";

// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
const Languages = ['id','en'];

const resources = {
    en: {
        translation: translationEN,
    },
    id: {
        translation: translationID,
    },
};

// @ts-ignore
i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng:"id",
        // lng:"en", //default language
        keySeparator: false,
        debug: true,
        detection:LanguageDetector,
        whitelist: Languages,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;