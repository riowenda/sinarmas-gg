import { Storage, Drivers } from "@ionic/storage";
import {
    API_URI,
    AUTH_CARE_GA,
    AUTH_FUEL_FINANCE,
    AUTH_FUEL_GA,
    AUTH_FUEL_LOGISTIC,
    AUTH_FUEL_MANAGER,
    AUTH_FUEL_OTHER_REQUEST,
    AUTH_FUEL_REQUEST,
    AUTH_FUEL_REQUEST_OTHER,
    AUTH_FUEL_STATION,
    IMAGE_MD_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_json_token_identity,
    pref_lng,
    pref_pegawai_id, pref_pegawai_unit_id,
    pref_token, pref_unit, pref_unit_id,
    pref_user_auth,
    pref_user_email,
    pref_user_id,
    pref_user_name,
    pref_user_nik,
    pref_user_photo,
    pref_user_role
} from "../constant/Index";
import {BaseAPI} from "../api/ApiManager";

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

export async function setPrefLng(value: any) {
    await storage.set(pref_lng, value);
    window.localStorage.setItem(pref_lng, value);
};

export async function setJsonPref(key: string, value: any) {
    if(value != null) {
        await storage.set(key, JSON.stringify(value));
    } else {
        await storage.set(key, null);
    }
    console.log(JSON.stringify(value));
};

export async function getJsonPref(key: string){
    const value = await storage.get(key);
    return value != null ? JSON.parse(<string>value) : null;
};

export async function setJsonTokenIdentityPref(value: any) {
    await storage.set(pref_json_token_identity, JSON.stringify(value));
};

export function setTokenPref(value: any){
    window.localStorage.setItem(pref_token, value);
}

export function setIdentityPref(value: any){
    window.localStorage.setItem(pref_identity, value);
}

export async function removePref(key: string) {
    await storage.remove(key);
};

export async function clearPref() {
    await storage.clear();
}

export async function getFuelMenu(){
    const value = await storage.get(pref_user_auth);
    let menus = [];
    if(value != null){
        if(value.toString().includes(AUTH_FUEL_REQUEST+",")){
            menus.push(AUTH_FUEL_REQUEST);
        }
        if(value.toString().includes(AUTH_FUEL_FINANCE)){
            menus.push(AUTH_FUEL_FINANCE);
        }
        if(value.toString().includes(AUTH_FUEL_GA)){
            menus.push(AUTH_FUEL_GA);
        }
        if(value.toString().includes(AUTH_FUEL_STATION)){
            menus.push(AUTH_FUEL_STATION);
        }
        if(value.toString().includes(AUTH_FUEL_MANAGER)){
            menus.push(AUTH_FUEL_MANAGER);
        }
        if(value.toString().includes(AUTH_FUEL_LOGISTIC)){
            menus.push(AUTH_FUEL_LOGISTIC);
        }
        if(value.toString().includes(AUTH_FUEL_REQUEST_OTHER)){
            menus.push(AUTH_FUEL_OTHER_REQUEST);
        }
    }
    // console.log(">>>>>>>>>>> "+value);
    // console.log("role "+menus);
    return menus.toString();
}

export async function getGACareMenu(){
    const value = await storage.get(pref_user_auth);
    let menus = [];
    if(value.toString().includes(AUTH_CARE_GA)){
        menus.push(AUTH_CARE_GA);
    }
    return menus;
}

export async function getUserMenu(){
    const value = await storage.get(pref_user_auth);
    let menus = [];
    let fuel = value.toString().includes("FUEL");
    let gacare = value.toString().includes("CARE");
    let visit = value.toString().includes("VISIT");
    let meal = value.toString().includes("MEAL");
    if(fuel){
        menus.push("FUEL");
    }
    if(gacare){
        menus.push("GACARE");
    }
    if(visit){
        menus.push("VISIT");
    }
    if(meal){
        menus.push("MEAL");
    }
    return menus.toString();
}

export function simpanDataPegawai(data:any, pegawai:any){
    let img = pegawai.foto;
    if(img != null && img != "" && (!img.toString().includes("https://") && !img.toString().includes("http://"))){
        img = BaseAPI()+API_URI+IMAGE_MD_URI+pegawai.foto;
    }
    setPref(pref_user_id, data.id).then(r => r);
    setPref(pref_user_role, data.roles.toString()).then(r => r);
    setPref(pref_user_name, pegawai.name).then(r => r);
    setPref(pref_user_nik, pegawai.nik).then(r => r);
    setPref(pref_user_photo, img).then(r => r);
    setPref(pref_user_email, data.email).then(r => r);

    setPref(pref_pegawai_id, pegawai.id).then(r => r);
    let peg = {
        name: pegawai.name,
        email: data.email,
        nik: pegawai.nik,
        imageUrl: img,
        identity: data.id,
        userId: data.id,
        role: data.roles,
        isafe: pegawai.isafeNo,
        telepon: pegawai.nomorTelepon
    }

    //pegawai
    setPref(pref_json_pegawai_info_login, JSON.stringify(peg)).then(r => r);
}

export function simpanDataPegawaiUnit(pegawaiUnit:any){
    //pegawai unit
    if (pegawaiUnit != null) {
        setPref(pref_unit, JSON.stringify(pegawaiUnit.unit)).then(r => r);
        setPref(pref_unit_id, pegawaiUnit.unit.id).then(r => r);
        setPref(pref_pegawai_unit_id, pegawaiUnit.id).then(r => r);
    } else {
        setPref(pref_unit, null).then(r => r);
        setPref(pref_unit_id, null).then(r => r);
        setPref(pref_pegawai_unit_id, null).then(r => r);
    }
}