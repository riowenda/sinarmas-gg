import ApiManager from "../ApiManager";

export const GaCareListOpenByPelaporAPI = async (laporan: string, token: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-open-by-pelapor?pelapor=${laporan}`, {
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

export const GaCareListKomentarByRiwayatAPI = async (token: string, riwayat: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-riwayat?riwayat=${riwayat}`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListKomentarByLaporanAPI = async (token: string, laporan: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-laporan?laporan=${laporan}`, {
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

export const GaCareListKomentarByLaporanAndRiwayatAPI = async (token: string, laporan: string, riwayat: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-komentar-by-laporan-and-riwayat?laporan=${laporan}&riwayat=${riwayat}`, {
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

export const GaCareListLaporanAPI = async (identity: string, token: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/list-by-pelapor?pelapor=${identity}`, {
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

export const GaCareDetailLaporanAPI = async (id: string, token: string) => {
    try {
        const result = await ApiManager(`/api/gacare/laporans/detail/${id}`, {
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

export const GaCareUpdateStatusAPI = async (identity: string, data: object, token: string) => {


    console.log("data api", data)

    try {
        const result = await ApiManager('/api/gacare/laporans/update-status', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                identity: identity,
                Authorization: `Bearer ${token}`
            },
            data: data
        })


        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareKomentarAPI = async (identity: string, data: object, token: string) => {
    try {
        const result = await ApiManager('/api/gacare/laporans/komentar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                identity: identity,
                Authorization: `Bearer ${token}`
            },
            data: data
        })

        return result.data
    } catch (error) {
        return error
    }
}

export const GaCareListLaporanGAAPI = async (token: string) => {
    try {
        const result = await ApiManager('/api/gacare/laporans/list-pelaporan-ga', {
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