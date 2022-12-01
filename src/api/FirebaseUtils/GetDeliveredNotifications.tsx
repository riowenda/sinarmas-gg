import {PushNotifications} from "@capacitor/push-notifications";


export const GetDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications().then(t => {
        console.log('--->>>>>>>>>>>>>>delivered notifications', JSON.stringify(notificationList));
    });
}