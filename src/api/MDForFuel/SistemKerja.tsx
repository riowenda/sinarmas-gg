import ApiManager from "../ApiManager"
import {API_URI, MD_SISTEM_KERJA_URI,} from "../../constant/Index";

export const SistemKerjaListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_SISTEM_KERJA_URI, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}