import {
    API_URI,
    MD_LEAVE_URI, MD_PEGAWAI_SIMPER_URI, MD_PEGAWAI_URI,
    NOTIFIKASI_LIST_RECEIVER_URI,
    pref_token,
    USER_WORK_STATUS_URI
} from '../../constant/Index'
import { getPref } from '../../helper/Preferences'
import ApiManager from "../ApiManager"

export const PegawaiListSelectAPI = async () => {

    try {
        const result = await ApiManager('/api/pegawais/list-select2', {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}

export const PegawaiListSelec2API = async () => {
    try {
        const result = await ApiManager(`/api/md/pegawais/list-pegawai-exclude-care-ga`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const PegawaiWorkStatusAPI = async (pegId: string) => {
    try {
        const result = await ApiManager(API_URI+MD_LEAVE_URI+USER_WORK_STATUS_URI+"/"+pegId, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const PegawaiSimperAPI = async (nik: string) => {
    try {
        const result = await ApiManager(API_URI+MD_PEGAWAI_URI+MD_PEGAWAI_SIMPER_URI+"/"+nik, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}