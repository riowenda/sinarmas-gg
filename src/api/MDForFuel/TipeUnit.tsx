import ApiManager from "../ApiManager"
import {API_URI, MD_TIPE_UNIT_URI,} from "../../constant/Index";

export const TipeUnitListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_TIPE_UNIT_URI, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}