import ApiManager from "../ApiManager"
import {API_URI, MD_DIVISI_URI, OTHER_COUPON_URI, OTHER_COUPON_USER_LIST_URI,} from "../../constant/Index";

export const OtherCouponList = async (token: string, pegid: string) => {
    try {
        const result = await ApiManager(API_URI+OTHER_COUPON_URI+OTHER_COUPON_USER_LIST_URI+"/"+pegid, {
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