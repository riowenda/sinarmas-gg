import ApiManager from "../ApiManager"
import {API_URI, MD_FUEL_STATION_URI, MD_OTHER_COUPON_URI} from "../../constant/Index";

export const OtherCouponListModalAPI = async (token: string) => {
    try {
        const result = await ApiManager(API_URI+MD_OTHER_COUPON_URI, {
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