import ApiManager from "../ApiManager";

export const GaCareListOpenByPelaporAPI = async (laporan: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-open-by-pelapor?pelapor=${laporan}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListKomentarByRiwayatAPI = async (riwayat: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-riwayat?riwayat=${riwayat}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListKomentarByLaporanAPI = async (laporan: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-laporan?laporan=${laporan}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListKomentarByLaporanAndRiwayatAPI = async (laporan: string, riwayat: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-laporan-and-riwayat?laporan=${laporan}&riwayat=${riwayat}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListLaporanAPI = async (identity: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-by-pelapor?pelapor=${identity}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareDetailLaporanAPI = async (id: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/detail/${id}`, {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareUpdateStatusAPI = async (data: object, identity_: string) => {


    console.log("data api", data)

    try {
        const result = await ApiManager('/api/gacare/laporans/update-status', {
            method: "POST",
            data: data,
            headers: {
                // @ts-ignore
                Identity: identity_,
                "Content-Type": "application/json"
            }
        })


        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareUpdateAPI = async (data: object, identity_: string) => {


    console.log("data api", data)

    try {
        const result = await ApiManager('/api/gacare/laporans/update', {
            method: "POST",
            data: data,
            headers: {
                // @ts-ignore
                Identity: identity_,
                "Content-Type": "application/json"
            }
        })


        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKomentarAPI = async (data: object) => {
    try {
        const result = await ApiManager('/api/gacare/laporans/komentar', {
            method: "POST",
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListLaporanGAAPI = async () => {
    try {
        const result = await ApiManager('/api/gacare/laporans/list-pelaporan-ga', {
            method: "GET",
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareRiwayatAPI = async(
    data: {
        
}) => {
    try {
        const result = await ApiManager('/api/gacare/laporans/add-riwayat', {
            method : "POST",
            data : data
        })

        return result.data
    }catch(error) {
        return error
    }
}