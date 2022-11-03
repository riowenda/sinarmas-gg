import ApiManager from "../ApiManager";

type myenum = ' '

export const BuatLaporanApi = async (
    token: string,
    identity: string,
    // data: {
    //     laporan: string,
    //     pelapor: {
    //         id: string
    //     },
    //     kateogri: {
    //         id: string
    //     },
    //     lokasi: {
    //         id: string
    //     },
    //     medias: {}[]
    // }
    data: {
        // id: string,
        laporan: string,
        pelapor: string
        kategori: string,
        lokasi: string,
        // tanggal: Date,
        // status: string,
        // riwayats: string[],
        medias: {}[]
    }
) => {
    try {
        const result = await ApiManager("/api/gacare/laporans/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                identity: identity,
            },
            data: data,
        });

        return result.data;
    } catch (error) {
        return error;
    }
};
