import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from 'i18next-http-backend';
import React from "react";
/*import translationEN from "./src/en.json";
import translationDE from "./src/ID.json";*/
/*const resources = {
	en: {
		translation: translationEN
	},
	de: {
		translation: translationDE
	}
};*/

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: {
				translation: {}
			},
			id: {
				translation: {
				}
			},
			lng: "id",
			fallbackLng: "id",

			interpolation: {
				escapeValue: false
			}
		}
	});

/*
i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "id",
		debug: true,
		lng: "id",
		interpolation: {
			escapeValue: false // not needed for react as it escapes by default
		}
	});
*/

export default i18n;

