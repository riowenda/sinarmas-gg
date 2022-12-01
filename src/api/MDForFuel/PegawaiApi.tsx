import ApiManager from "../ApiManager"
import {
    API_URI,
    MD_FUEL_STATION_AVAILABLE,
    MD_FUEL_STATION_URI,
    MD_PEGAWAI_DETAIL_URI,
    MD_PEGAWAI_URI
} from "../../constant/Index";

export const PegawaiDetail = async (id: string) => {
    try {
        const result = await ApiManager(API_URI+MD_PEGAWAI_URI+MD_PEGAWAI_DETAIL_URI+"/"+id, {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}