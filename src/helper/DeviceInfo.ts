import { Device } from '@capacitor/device';

export const logDeviceInfo = async () => {
    const info = await Device.getInfo();
    console.log(info);
    return info;
};

export const logBatteryInfo = async () => {
    const info = await Device.getBatteryInfo();
    console.log(info);
    return info;
};