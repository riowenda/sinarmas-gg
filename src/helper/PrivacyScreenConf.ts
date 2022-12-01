import { PrivacyScreen } from '@capacitor-community/privacy-screen';

/* Capacitor plugin that protects your app from displaying a screenshot in Recents screen/App Switcher. */

export const privacyEnable = async () => {
    console.log(">>>>>>>>>>>>> enable privacy");
    await PrivacyScreen.enable();
};

export const privacyDisable = async () => {
    console.log(">>>>>>>>>>>>> disable privacy");
    await PrivacyScreen.disable();
};