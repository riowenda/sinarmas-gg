import {PushNotifications} from "@capacitor/push-notifications";
import {pref_open_notif, pref_token_fbnotif, pref_user_auth} from "../../constant/Index";
import {useHistory} from "react-router-dom";
import {setPermPref} from "../../helper/PermanentPreferences";
import {setPref} from "../../helper/Preferences";

export const AddListenerNotifications = async () => {
    const history = useHistory();

    console.log("--->>>>>>>>>>>>>>LISTENER NOTIFICATION")
    await PushNotifications.addListener('registration', token => {
        console.info('--->>>>>>>>>>>>>>Registration token: ', token.value);

        //simpan token firebase
        setPermPref(pref_token_fbnotif, token.value).then(t=>{});
    });

    await PushNotifications.addListener('registrationError', err => {
        console.error('--->>>>>>>>>>>>>>Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.info('ON Push notification received '+ notification.data);
        console.log("################# foreground notif "+JSON.stringify(notification));

        alert(JSON.stringify(notification));
        // let data = notification.data;
        // let id = notification.id;
        // toDetail(data, id);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        console.log("$$$$$$$$$$$$$$$$ on tap notif "+JSON.stringify(notification))
        setPref(pref_open_notif, true);
        // window.localStorage.setItem(pref_open_notif, "true");
        // alert(notification);
        console.log("############# sini "+true);
        let data = notification.notification.data;
        let id = notification.notification.id;
        toDetail(data, id);
    });

    const toDetail = (data: any, id: string) => {
        history.push({
            pathname: "/notifikasi-detail/" + id,
            state: { detail: data }
        });
    }
}