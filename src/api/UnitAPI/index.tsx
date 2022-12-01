import ApiManager, {BaseAPI} from "../ApiManager";
import {
    API_URI,
    PEGAWAI_UNIT_BY_USER_URI,
    PEGAWAI_UNIT_CRUD_URI,
    UNIT_CRUD_URI,
    UNIT_HISTORY_BY_USER_URI
} from "../../constant/Index";

export const UnitRiwayatByUser =async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI+UNIT_CRUD_URI+UNIT_HISTORY_BY_USER_URI+"/"+pegId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}

export const UnitByUser =async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_BY_USER_URI+"/"+pegId, {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}
