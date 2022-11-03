import ApiManager from "../ApiManager"


export const LokasiKerjaApi = async (token: string) => {
    try {
        const result = await ApiManager('/api/md/lokasi-kerjas/', {
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