import ApiManager from "../ApiManager"
import {
    API_URI,
    MD_DIVISI_URI, MD_QUALITY_URI,
    //  MD_QUALITY_URI
} from "../../constant/Index";

export const QualityListAPI = async () => {
    try {
        const result = await ApiManager(API_URI + MD_QUALITY_URI+"/", {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}