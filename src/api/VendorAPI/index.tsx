import ApiManager from "../ApiManager"

export const VendorUpdateAPI = async (token: string, identity: string, data: {
    id: string,
    isActive: boolean,
    identity: string,
    name: string
}) => {
    try {
        const result = await ApiManager('/api/vendors/update', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                identity: identity
            },
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

