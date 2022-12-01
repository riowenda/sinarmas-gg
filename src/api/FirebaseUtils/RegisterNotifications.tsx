import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';

export const RegisterNotifications = async function (topic: string[]) {
    console.log("--->>>>>>>>>>>>>>REGISTER NOTIFICATION :"+topic.length+" "+topic.toString())
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
        console.log("--->>>>>>>>>>>>>> %s", permStatus)
    }else{
        console.log("--->>>>>>>>>>>>>>HERE permStatus %s", permStatus)
    }

    if (permStatus.receive !== 'granted') {
        throw new Error('--->>>>>>>>>>>>>>User denied permissions!');
    }

    await PushNotifications.register().then(()=>{
        FCM.setAutoInit({ enabled: true }).then(()=>{
            //alert(`Auto init enabled`);
        });
        for (let i = 0; i < topic.length; i++) {
            //alert(`LOOP REGISTER:`+topic[i]);
            FCM.subscribeTo({ topic: topic[i] }).then((r) => {})
                .catch((err) => console.log(err));
        }
        // logout
        //FCM.unsubscribeFrom({topic:""});

    });
}