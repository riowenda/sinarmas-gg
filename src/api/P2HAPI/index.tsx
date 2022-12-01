import ApiManager from "../ApiManager";
import {API_URI, NOTIFIKASI_LIST_RECEIVER_URI, P2H_EXISTING_BY_PU_URI, P2H_EXISTING_URI,} from "../../constant/Index";

export const P2HExistingAPI =async (puId: string) => {
    try {
        const result = await ApiManager(API_URI+P2H_EXISTING_URI+"/"+puId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const P2HExistingNowNotRejectedAPI =async (puId: string) => {
    try {
        const result = await ApiManager(API_URI+P2H_EXISTING_BY_PU_URI+"/"+puId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}