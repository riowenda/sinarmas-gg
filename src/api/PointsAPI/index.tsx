import ApiManager from "../ApiManager";
import {API_URI, NOTIFIKASI_LIST_RECEIVER_URI, POINTS_PEGAWAI_URI,} from "../../constant/Index";

export const PointsByPegawai =async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI+POINTS_PEGAWAI_URI+"/"+pegId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}