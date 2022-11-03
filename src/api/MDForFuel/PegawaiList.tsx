import ApiManager from "../ApiManager"
import {API_URI, MD_PEGAWAI_URI} from "../../constant/Index";

export const PegawaiListModalAPI = async (token: string) => {
    try {
        const result = await ApiManager(API_URI+MD_PEGAWAI_URI, {
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