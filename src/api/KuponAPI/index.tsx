import ApiManager, {BaseAPI} from "../ApiManager"

export const lastRedeemCoupon = async (puid: any) => {
    try {
        const result = await ApiManager(`${BaseAPI()}/api/fuel/kupon/find-last-redem/${puid}`, {
            method : "GET",
        })

        return result.data
        
    } catch (error) {
        return error
    }
}