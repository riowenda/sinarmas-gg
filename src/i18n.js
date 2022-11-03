import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from 'i18next-http-backend';
import React from "react";
import translationEN from "./EN.json";
import translationID from "./ID.json";
const resources = {
	en: {
		translation: translationEN
	},
	id: {
		translation: translationID
	}
};

/*i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: translationEN
			},
			id: {
				translation: translationID
			},
			lng: "en",
			fallbackLng: "en",

			interpolation: {
				escapeValue: false
			}
		}
	});*/

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		debug: true,
		lng: "en",
		interpolation: {
			escapeValue: false // not needed for react as it escapes by default
		}
	});

export default i18n;

