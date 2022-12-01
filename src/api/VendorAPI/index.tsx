import ApiManager from "../ApiManager"

export const VendorUpdateAPI = async (data: {
    id: string,
    isActive: boolean,
    identity: string,
    name: string
}) => {
    try {
        const result = await ApiManager('/api/vendors/update', {
            method: "PUT",
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

