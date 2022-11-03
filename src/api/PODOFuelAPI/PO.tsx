import ApiManager from "../ApiManager"
import {API_URI, MD_VENDOR_URI, PO_DETAIL_URI, PO_URI,} from "../../constant/Index";

export const PO = async (token: string, tipe: string, id: string) => {
    if(tipe === 'list') {
        try {
            const result = await ApiManager(API_URI + PO_URI + "/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return result.data
        } catch (error) {
            return error
        }
    }

    if(tipe === 'detail') {
        try {
            const result = await ApiManager(API_URI + PO_URI + PO_DETAIL_URI+"/"+id, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return result.data
        } catch (error) {
            return error
        }
    }
}