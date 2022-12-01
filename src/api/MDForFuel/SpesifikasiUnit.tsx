import ApiManager from "../ApiManager"
import {API_URI, MD_SPESIFIKASI_UNIT_URI,} from "../../constant/Index";

export const SpesifikasiListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_SPESIFIKASI_UNIT_URI, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}