import ApiManager from "../ApiManager"
import {API_URI, FUEL_REQ_FIND_EXISTING_URI, FUEL_REQ_UNIT_URI, MD_DIVISI_URI,} from "../../constant/Index";

export const FuelCouponList = async (token: string, puid: string) => {
    try {
        const result = await ApiManager(API_URI+FUEL_REQ_UNIT_URI+FUEL_REQ_FIND_EXISTING_URI+"/"+puid, {
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