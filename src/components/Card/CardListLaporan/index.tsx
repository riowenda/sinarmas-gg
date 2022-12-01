import { useMemo } from "react";

interface CardListLaporanProps {
  status?: string;
  kategori?: string;
  pelapor?: string;
  nomor?: string;
  tanggal?: string;
  star?: boolean;
  handleOnPress?: () => void;
}

const Star = (color: string, background: string) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={background}
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
};

const purple = "rgb(168 85 247 / var(--tw-border-opacity))";

const CardListLaporan: React.FC<CardListLaporanProps> = ({
  status,
  kategori, pelapor,nomor,
  tanggal,
  star,
  handleOnPress,
}) => {
  const textColor = useMemo(() => {
    if (status === "Done") {
      return "text-green-600";
    } else if (status === "Cancel") {
      return "text-red-800"
    } else if (status === "Proposed") {
      return "text-blue-600"
    } else if (status === "Open") {
      return "text-green-500"
    }
    return "text-gray-500";
  }, [status]);

  return (
    <div
      className="p-4 rounded-md flex justify-between items-center border border-1 border-gray-200"
      onClick={handleOnPress}
    >
      <div>
        <h3 className="truncate font-medium text-black mb-2">{nomor}</h3>
        <p className="truncate text-gray-600 mb-2">{pelapor}</p>
        <p className="truncate text-gray-600 mb-2">{kategori}</p>
        <p className="truncate text-gray-600">{tanggal}</p>
      </div>
      <div className="flex-col items-end justify-end">
        <p className={`pl-2 pr-2 ml-auto py-1 ${textColor} font-bold uppercase`}>{status}</p>
        {/* <div
          className={` px-5 ml-auto py-1 ${statusBackground} rounded-xl items-center justify-center mb-2`}
        >
          <h3 className="truncate font-semibold text-white text-center">
            {status}
          </h3>
        </div> */}
        {star == true && (
          <div className="flex">
            {Star(purple, purple)}
            {Star(purple, purple)}
            {Star(purple, purple)}
            {Star(purple, purple)}
            {Star("gray", "gray")}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardListLaporan;
