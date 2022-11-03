interface ModalSubmitProps {
    handleOkButton?: () => void,
    successSubmit?: () => void
}

const ModalSubmit: React.FC<ModalSubmitProps> = ({ handleOkButton, successSubmit }) => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center  z-[999] fixed top-0 left-0 p-5">
            <div className="bg-white px-6 h-52 w-full flex flex-col items-center justify-evenly">
                <h3 className="text-center font-medium text-xl text-gray-500">
                    Terima kasih, laporan anda akan kami tindak lanjuti
                </h3>
                <div
                    className="justify-center w-[150px] flex py-1 mt-4 mx-auto items-center rounded-sm bg-blue-500"
                    onClick={handleOkButton}
                >
                    <h3 className="truncate text-lg font-medium text-white">OKE</h3>
                </div>
            </div>
            <div
                className="bg-slate-600/40 w-full h-full absolute top-0 left-0 z-[-1]"
                onClick={successSubmit}
            ></div>
        </div>
    )
}

export default ModalSubmit