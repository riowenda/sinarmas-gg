import ApiManager from "../ApiManager"
import {API_URI, MD_JENIS_UNIT_URI} from "../../constant/Index";

export const JenisKendaraanListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_JENIS_UNIT_URI, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}