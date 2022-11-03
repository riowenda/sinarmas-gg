import {PushNotifications} from "@capacitor/push-notifications";


export const GetDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
}