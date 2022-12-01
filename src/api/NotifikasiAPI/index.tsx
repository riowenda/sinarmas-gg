import ApiManager from "../ApiManager";
import {API_URI, NOTIFIKASI_COUNT_RECEIVER_URI, NOTIFIKASI_LIST_RECEIVER_URI,} from "../../constant/Index";

export const NotifikasiByUser = async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI+NOTIFIKASI_LIST_RECEIVER_URI+"/"+pegId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error;
    }
}

export const CountNotifByUser = async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI+NOTIFIKASI_COUNT_RECEIVER_URI+"/"+pegId, {
            method : "GET"
        })

        return result.data
    } catch (error) {
        return error;
    }
}