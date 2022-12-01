import {
    IonContent,
    IonPage,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import DetailHeader from "../../../../components/Header/DetailHeader";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const send = {id:"", fuelman:"", liter:null}
const DetailScanInvalid: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const history = useHistory();

    const { t } = useTranslation();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        loadData()
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
    });
    /* END LIFECYCLE APPS */

    const loadData = () => {
        // @ts-ignore
        let id = history.location.state.detail;
        setGetId(id);
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="bg-white flex flex-col min-h-screen justify-between">
                    {/* === Start Form  === */}
                    <div>
                        {/* Header */}
                        <DetailHeader title={t('header.tidak_valid')} link='' approval={""}></DetailHeader>
                        {/* end Header */}
                    </div>
                    {/* === End Form === */}
                </div>
            </IonContent>
        </IonPage>

    );

};

export default DetailScanInvalid;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

