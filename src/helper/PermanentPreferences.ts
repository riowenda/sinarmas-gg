import { Storage, Drivers } from "@ionic/storage";
import {
    pref_lng,
    pref_token_fbnotif,
} from "../constant/Index";

/* Digunakan untuk menyimpan data-data yang tidak akan diclear ketika user logout */

let permanen_storage = new Storage({
    name:"_hrgabib_notif", driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

permanen_storage.create().then(r => {
    console.log("notif pref ready");
});


export async function setPermPref(key: string, value: any) {
    await permanen_storage.set(key, value);
};

export async function getPermPref(key: string): Promise<any> {
    const value = await permanen_storage.get(key);
    return value;
};

export async function setPermPrefLng(value: any) {
    await permanen_storage.set(pref_lng, value);
    window.localStorage.setItem(pref_lng, value);
};

export async function setJsonPermPref(key: string, value: any) {
    await permanen_storage.set(key, JSON.stringify(value));
    console.log(JSON.stringify(value));
};

export async function getJsonPermPref(key: string){
    const value = await permanen_storage.get(key);
    return JSON.parse(<string>value);
};

export async function removePermPref(key: string) {
    await permanen_storage.remove(key);
};

export async function getTokenPermPref(){
    const value = await permanen_storage.get(pref_token_fbnotif);
    return value;
}

export async function setTokenPermPref(value: string){
    await permanen_storage.set(pref_token_fbnotif, value);
    window.localStorage.setItem(pref_token_fbnotif, value);
}