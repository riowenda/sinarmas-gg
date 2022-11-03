interface KeteranganProps {
    title: string;
    desc?: string;
    status: boolean;
    statusText?: string | undefined;
}

const Keterangan: React.FC<KeteranganProps> = ({ title, desc, statusText, status }) => {
    return (
        <div className="flex flex-row gap-2">
            <div className="w-1/2">
                <span className="text-black font-bold">{title}</span>
            </div>
            {status === true ? (
                <div className={`flex justify-center items-center ${statusText === "Cancel" ? "bg-red-600" : statusText === "Open" ? "bg-green-500" : "bg-[#70B7E0]"} rounded py-[5px] px-[20px]`}>
                    <span className="text-white font-bold">{statusText}</span>
                </div>
            ) : (
                <div className="w-1/2">
                    <span className="text-black">{desc}</span>
                </div>
            )}
        </div>
    )
}

export default Keterangan