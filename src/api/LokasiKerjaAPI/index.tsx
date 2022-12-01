import ApiManager from "../ApiManager"


export const LokasiKerjaApi = async () => {
    try {
        const result = await ApiManager('/api/md/lokasi-kerjas/', {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}