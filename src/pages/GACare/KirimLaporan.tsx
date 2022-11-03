import { IonContent, IonPage, IonTextarea } from "@ionic/react"
import { useState } from "react";
import { useHistory } from "react-router"
import { ButtonPrimary } from "../../components/Button";


const KirimLaporan: React.FC = () => {
    const purple = "#694de9";

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

    const [textLaporanSelesai, setTextLaporanSelesai] = useState('')

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="bg-white min-h-screen px-5 pt-5">
                    <div className="flex flex-row items-center">
                        <h3 className="truncate font-lg text-black">Detail Laporan</h3>
                    </div>
                    <div className="flex flex-col my-5">
                        <h3 className={"truncate font-lg text-black"}>Berikan penilaian anda terhadap layanan kami</h3>
                    </div>
                    <div className="flex flex-row gap-4 justify-center items-center my-[0.5rem  ]">
                        {Star(purple, purple)}
                        {Star(purple, purple)}
                        {Star(purple, purple)}
                        {Star(purple, purple)}
                        {Star("gray", "gray")}
                    </div>
                    <span className='text-black'>Catatan</span>
                    <IonTextarea
                        className={'border text-black p-2'}
                        placeholder={"Catatan..."}
                        value={textLaporanSelesai}
                        onIonChange={(e) => setTextLaporanSelesai(e.detail.value!)}>

                    </IonTextarea>
                    <ButtonPrimary
                        title={"KIRIM"}
                        color={'tertiary'} />
                </div>
            </IonContent>
        </IonPage>
    )
}

export default KirimLaporan