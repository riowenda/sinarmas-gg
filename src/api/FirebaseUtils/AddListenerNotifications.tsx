import {PushNotifications} from "@capacitor/push-notifications";
import {setPref} from "../../helper/preferences";
import {pref_token_fbnotif} from "../../constant/Index";

export const AddListenerNotifications = async () => {
    console.log("LISTENER NOTIFICATION")
    await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
        // todo: save to local storage then register to backend
        setPref(pref_token_fbnotif, token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.info('ON Push notification received '+ notification.data);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
}