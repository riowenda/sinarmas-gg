import { useMemo } from "react";

interface CardDaftarPermintaanProps {
    status?: string;
    kategori?: string;
    tanggal?: string;
    star?: boolean;
    handleOnPress?: () => void;
}


const CardDaftarPermintaan: React.FC<CardDaftarPermintaanProps> = ({
    status,
    kategori,
    tanggal,
    star,
    handleOnPress,
}) => {

    return (
        <div
            className="p-4 rounded-md flex justify-between items-center border border-1 border-gray-200"
            onClick={handleOnPress}
        >
            <div>
                <h3 className="truncate font-medium text-black mb-2">{'AGIL MUNZIR'}</h3>
                <h4 className="truncate text-sm text-black">{'BIB 123'}</h4>
            </div>
            <div className="flex-col flex items-end justify-end">
                <span>1 Januari 2022</span>
                <p className={` ml-auto py-1 text-red-500 font-bold uppercase`}>{'TEST'}</p>
            </div>
        </div>
    );
};

export default CardDaftarPermintaan;
