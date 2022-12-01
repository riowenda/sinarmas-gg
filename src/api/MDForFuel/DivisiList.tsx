import ApiManager from "../ApiManager"
import {API_URI, MD_DIVISI_URI,} from "../../constant/Index";

export const DivisiListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_DIVISI_URI+"/", {
            method: "GET"
        })
        return result.data
    } catch (error) {
        return error
    }
}