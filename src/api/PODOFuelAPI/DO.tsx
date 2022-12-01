import ApiManager from "../ApiManager"
import {
    API_URI, COUNT_DO_OPENED_URI,
    COUNT_PO_OPENED_URI,
    DO_REQ_DETAIL_URI,
    DO_REQ_URI,
    MD_VENDOR_URI,
    PO_DETAIL_URI,
    PO_URI,
} from "../../constant/Index";

export const DO = async (tipe: string, id: string) => {
    if(tipe === 'list') {
        try {
            const result = await ApiManager(API_URI + DO_REQ_URI + "/", {
                method: "GET"
            })
            return result.data
        } catch (error) {
            return error
        }
    }

    if(tipe === 'detail') {
        try {
            const result = await ApiManager(API_URI + DO_REQ_URI + DO_REQ_DETAIL_URI+"/"+id, {
                method: "GET"
            })
            return result.data
        } catch (error) {
            return error
        }
    }

    if(tipe === 'count_open'){
        try {
            const result = await ApiManager(API_URI + COUNT_DO_OPENED_URI, {
                method: "GET"
            })
            return result.data
        } catch (error) {
            return error
        }
    }
}