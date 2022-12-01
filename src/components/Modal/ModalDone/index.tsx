import { IonTextarea } from "@ionic/react";
import { ButtonPrimary } from "../../Button";


interface ModalGALaporanProps {
    onSetModal: () => void,
    title: string,
    valueTextArea: string,
    setTextSelesai: any,
    onUpdateStatus?: () => void
    // onChangeText: () => void,
}

const ModalDone: React.FC<ModalGALaporanProps> = ({ title, valueTextArea, setTextSelesai, onUpdateStatus, onSetModal }) => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center  z-[999] fixed top-0 left-0 p-5">
            <div className="bg-white p-6 w-full rounded">
                <span className='font-bold text-black '>{title}</span>
                <IonTextarea
                    placeholder="Keterangan..."
                    value={valueTextArea}
                    onIonChange={(e) => setTextSelesai(e.detail.value!)}
                    className={"text-black border p-[5px] my-[1rem]"}>

                </IonTextarea>
                <div className=" flex flex-row gap-4 justify-center items-center">
                    <ButtonPrimary
                        color={"tertiary"}
                        title={"PROSES"}
                        onPress={onUpdateStatus} />
                </div>

            </div>
            <div
                className="bg-slate-600/40 w-full h-full absolute top-0 left-0 z-[-1]"
                onClick={onSetModal}
            ></div>
        </div>
    )
}

export default ModalDone