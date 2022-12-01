import ApiManager from "../ApiManager";


export const GaCareTipeAPI = async () => {
    try {
        const result = await ApiManager('/api/gacare/tipe/', {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}