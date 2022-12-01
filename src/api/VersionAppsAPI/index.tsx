import ApiManager from "../ApiManager";
import {API_URI, NOTIFIKASI_LIST_RECEIVER_URI, POINTS_PEGAWAI_URI, VERSION_APPS_CHECK_URI,} from "../../constant/Index";

export const VersionApps =async () => {
    try {
        const result = await ApiManager(API_URI+VERSION_APPS_CHECK_URI+"/", {
            method : "GET"
        })

        return result.data
    }catch(error) {
        return error
    }
}