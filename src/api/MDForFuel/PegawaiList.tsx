import ApiManager from "../ApiManager"
import {API_URI, AUTH_FUEL_REQUEST_OTHER, MD_PEGAWAI_CUSTODIAN, MD_PEGAWAI_URI} from "../../constant/Index";

export const PegawaiListModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_PEGAWAI_URI+"/", {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}

export const CustodianModalAPI = async () => {
    try {
        const result = await ApiManager(API_URI+MD_PEGAWAI_URI+MD_PEGAWAI_CUSTODIAN+"/"+AUTH_FUEL_REQUEST_OTHER+"?page=0&size=100", {
            method: "GET",
        })
        return result.data
    } catch (error) {
        return error
    }
}