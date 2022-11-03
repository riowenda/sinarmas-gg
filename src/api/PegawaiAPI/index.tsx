import { pref_token } from '../../constant/Index'
import { getPref } from '../../helper/preferences'
import ApiManager from "../ApiManager"

export const PegawaiListSelectAPI = async (token: string) => {

    try {

        const result = await ApiManager('/api/pegawais/list-select2', {
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

export const PegawaiListSelec2API = async (term: string, token: string) => {
    try {
        const result = await ApiManager(`/api/md/pegawais/select2/search/${term}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}