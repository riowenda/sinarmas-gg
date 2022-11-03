import { IonTextarea } from "@ionic/react"
import { ButtonOutline, ButtonPrimary } from "../../Button"
import { IconPhoto } from "../../Icon"

interface ModalGALaporanProps {
    onSetModal: () => void,
    title: string,
    valueTextArea: string,
    setTextProgress: any,
    colorButton?: string,
    titleButton?: string,
    onUpload?: () => void,
    onDangerOutline?: () => void,
    statusUpload: boolean;
    onUpdateStatus?: () => void
    // onChangeText: () => void,
}

const ModalGALaporan: React.FC<ModalGALaporanProps> = ({ onSetModal, title, valueTextArea, setTextProgress, colorButton, titleButton, onUpload, onDangerOutline, statusUpload, onUpdateStatus }) => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center  z-[999] fixed top-0 left-0 p-5">
            <div className="bg-white p-6 w-full rounded">
                <span className='font-bold text-black '>{title}</span>
                <IonTextarea
                    placeholder="Keterangan..."
                    value={valueTextArea}
                    onIonChange={(e) => setTextProgress(e.detail.value!)}
                    className={"text-black border p-[5px] my-[1rem]"}>

                </IonTextarea>
                {statusUpload == true ? (
                    <>
                        <div className=" flex flex-row gap-4 justify-center items-center">
                            <IconPhoto />
                            <IconPhoto />
                        </div>
                        <div className={'my-[0.5rem]'}>
                            <ButtonOutline
                                color={'tertiary'}
                                title={'UPLOAD'} onPress={onUpload} />
                            <ButtonOutline
                                color={'danger'}
                                title={'KEMMBALIKAN'} onPress={onDangerOutline} />
                        </div>
                    </>
                ) : (
                    <div className=" flex flex-row gap-4 justify-center items-center">
                        <ButtonOutline
                            color={'tertiary'}
                            title={'CANCEL'} onPress={onSetModal} />
                        <ButtonPrimary
                            color={colorButton}
                            title={titleButton}
                            onPress={onUpdateStatus} />
                    </div>
                )}

            </div>
            <div
                className="bg-slate-600/40 w-full h-full absolute top-0 left-0 z-[-1]"
                onClick={onSetModal}
            ></div>
        </div>
    )
}

export default ModalGALaporan