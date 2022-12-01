import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    useIonToast,
    useIonAlert,
    useIonLoading, useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave,
} from '@ionic/react';

import {RefresherEventDetail} from '@ionic/core';
import {useTranslation, initReactI18next, ReactI18NextChild} from "react-i18next";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    API_URI,
    pref_user_id,
    pref_identity,
    TAKEOVER_UNIT_URI,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_APPROVED_URI
} from "../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getPref} from "../../../helper/Preferences";
import TextareaExpand from "react-expanding-textarea";
import DetailHeader from "../../../components/Header/DetailHeader";
import UserCardWithUnit from "../../Layout/UserCardWithUnit";
import SkeletonDetail from "../../Layout/SkeletonDetail";
import {BaseAPI} from "../../../api/ApiManager";

const Body: React.FC<{
    count: number;
    onDismiss: () => void;
    onIncrement: () => void;
}> = ({ count, onDismiss, onIncrement }) => (
    <div>
        count: {count}
        <IonButton expand="block" onClick={() => onIncrement()}>
            Increment Count
        </IonButton>
        <IonButton expand="block" onClick={() => onDismiss()}>
            Close
        </IonButton>
    </div>
);

const PegawaiUnitDetail: React.FC = () => {
    const [getId, setGetId] = useState<any[]>([])
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const history = useHistory()
    //setGetId(history['location']['state']['id'])
    const [error, setError] = useState(null)
    const [presentAlert] = useIonAlert()
    const [showSuccess] = useIonAlert()
    const [present, dismiss] = useIonLoading()
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState<{// @ts-ignore
        [key: string]}>()
    const [contents_, setContents_] = useState<any[]>([])
    const [presentToast] = useIonToast();
    const [status, setStatus] = useState();

    const {t} = useTranslation();
    const id = useParams<any[]>();
    const location = useLocation();

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

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setIsLoaded(false);
        // console.log('Begin async operation');
        loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }
    const [message, setMessage] = useState(
        'This modal example uses triggers to automatically open a modal when the button is clicked.'
    );

    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        } );
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });

    }
    const loadData = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        // @ts-ignore
        setGetId(dataId);
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + PEGAWAI_UNIT_CRUD_URI + "/" + dataId;
        console.log("URL: " + urlContents);
        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("OK: ", result['data']);
                    setItems(result['data']);
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );

    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {isLoaded ?
                <>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                    {/* === Start Content  === */}
                    <div>
                        <DetailHeader title={t('header.detil')} link='' approval={status}></DetailHeader>

                        <UserCardWithUnit name={items ? items['pegawai']['name'] : ""} nik={items ? items['pegawai']['nik'] : ""} noLambung={items ? items['unit']['noLambung'] : ""} noPol={items ? items['unit']['noPol'] : ""} withUnit={false} foto={items ? items['pegawai']['foto'] : ""}></UserCardWithUnit>

                        {/*<div className="flex justify-between p-6 bg-red-700">
                            <h3 className="text-xl font-bold text-white">Permintaan Ambil Alih Unit</h3>
                        </div>*/}

                        <div className="p-6 bg-white mt-4">

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Lambung
                                </label>
                                <div>
                                    {items ? items['unit']['noLambung'] : ""}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Polisi
                                </label>
                                <div>
                                    {items ? items['unit']['noPol'] : ""}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Tipe
                                </label>
                                <div>
                                    {items ? items['unit']['tipeUnit']['name'] : ""}
                                </div>
                            </div>
                        </div>
                        <div className='py-6 grid grid-cols-2 bg-white h-full'>

                        </div>
                    </div>
                    {/* === End Content === */}
                </div>
            </IonContent>
                </>
                : <>
                    {
                        <SkeletonDetail />
                    }

                </>}
        </IonPage>
    );
};

export default PegawaiUnitDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}