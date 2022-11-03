import { IonIcon } from "@ionic/react"
import { checkmarkCircleOutline } from "ionicons/icons"

const ModalSuccess: React.FC = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center  z-[999] fixed top-0 left-0 p-5 rounded-md">
            <div className="bg-white px-6 h-52 w-full flex flex-col items-center justify-evenly">
                <IonIcon icon={checkmarkCircleOutline} color={'#2dd36f'} size={"40px"} />
                <h3 className="text-center font-medium text-xl text-gray-500">
                    Berhasil membuat laporan, tunggu sesaat...
                </h3>

            </div>
        </div>
    )
}

export default ModalSuccess