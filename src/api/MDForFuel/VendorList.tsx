import ApiManager from "../ApiManager"
import {API_URI, MD_VENDOR_URI,} from "../../constant/Index";

export const VendorListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_VENDOR_URI, {
            method: "GET"
        })
        return result.data
    } catch (error) {
        return error
    }
}