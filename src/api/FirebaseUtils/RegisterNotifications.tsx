import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';

export const RegisterNotifications = async () => {
    console.log("REGISTER NOTIFICATION")
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }else{
        console.log("HERE permStatus %s", permStatus)
    }

    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }

    await PushNotifications.register().then(()=>{
        FCM.setAutoInit({ enabled: true }).then(()=>{
            //alert(`Auto init enabled`);
        });

        //todo : create service backend active topic

        FCM.subscribeTo({ topic: "HRGA-BIB" })
            .then((r) => {
                //alert(`subscribed to HRGA-BIB`);
            })
            .catch((err) => console.log(err));
    });
}