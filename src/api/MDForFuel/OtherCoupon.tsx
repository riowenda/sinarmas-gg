import ApiManager from "../ApiManager"
import {API_URI, MD_FUEL_STATION_URI, MD_OTHER_COUPON_URI} from "../../constant/Index";

export const OtherCouponListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_OTHER_COUPON_URI, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}