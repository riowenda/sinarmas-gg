import ApiManager from "../ApiManager";

type myenum = ' '

export const BuatLaporanApi = async (
    data: {
        laporan: string,
        pelapor: string
        kategori: string,
        lokasi: string,
        tipe: string,
        medias: {}[]
    }
) => {
    try {
        const result = await ApiManager("/api/gacare/laporans/create", {
            method: "POST",
            data: data,
        });

        return result.data;
    } catch (error) {
        return error;
    }
};
