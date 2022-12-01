import { Storage, Drivers } from "@ionic/storage";

let storage = new Storage({
    name:"_hrgabib", driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});
storage.create().then(r => {
    console.log("ready");
});


export async function setPref(key: string, value: any) {
    await storage.set(key, value);
};

export async function getPref(key: string): Promise<any> {
    const value = await storage.get(key);
    return value;
};

export async function setJsonPref(key: string, value: any) {
    await storage.set(key, JSON.stringify(value));
    console.log(JSON.stringify(value));
};

export async function getJsonPref(key: string): Promise<any> {
    const value = await storage.get(key);
    return JSON.parse(<string>value);
};

export async function removePref(key: string) {
    await storage.remove(key);
};

export async function clearPref() {
    await storage.clear();
}