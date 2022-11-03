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

import './GAPermintaanUnitDetail.css';
import {RefresherEventDetail} from '@ionic/core';
import {useTranslation, initReactI18next, ReactI18NextChild} from "react-i18next";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    API_URI,
    BASE_API_URL,
    pref_user_id,
    pref_identity,
    TAKEOVER_UNIT_URI,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_APPROVED_URI
} from "../../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getPref} from "../../../../helper/preferences";
import TextareaExpand from "react-expanding-textarea";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import DetailHeader from '../../../../components/Header/DetailHeader';
import SkeletonDetail from "../../../Layout/SkeletonDetail";

const Identity = "f8c3ca0e-f2e4-4cbd-9a48-e5f9905f420b";
//const getId = '8c1ffa34-a9de-4c76-b853-22c582d86315';
const rHeader = {'Content-Type': 'application/json', 'Identity': Identity}

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

const GAPermintaanUnitDetail: React.FC = () => {
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

    const {t} = useTranslation()
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
        loadDataPref()
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
        // console.log('Begin async operation');
        setIsLoaded(false);
        loadDataPref();
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

        // @ts-ignore
        const dataId = history.location.state.detail;
        // @ts-ignore
        setGetId(dataId);
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + TAKEOVER_UNIT_URI + "/" + dataId;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        console.log("URL: " + urlContents);
        /*fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("OK: " + result['data']);
                    setIsLoaded(true);
                    setItems(result['data']);
                },
                (error) => {
                    setIsLoaded(true);
                    //setError(error);
                }
            );*/
        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("OK: ", result['data']);
                    setItems(result['data']);
                    setStatus(result['data']['status']);
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const showResult = (responseStatus : any) => {
        dismiss();
        const status = responseStatus.status;
        if(responseStatus.status === 'SUCCESS'){
            presentToast({
                message: status,
                duration: 1500,
                position: "bottom"
            })
            //setShowModalSetuju(false);
            //setShowModalTolak(false);
            history.goBack();
            // history.push("/fuel/ga/unit/daftar-permintaan");

        } else { //EXIST
            presentToast({
                message: status,
                duration: 1500,
                position: "bottom"
            })
        }
    };

    const handleSetuju = async () => {
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_APPROVED_URI;
        const rHeader = {'Content-Type': 'application/json', 'Identity': identity != null ? identity : ''}
        // @ts-ignore
        const komentar = document.getElementById('keterangan').value;
        //console.log("isi komentar: ", komentar)
        const dataJson = {
            "id": getId,
            "status": "APPROVED",
            "user": userId,
            "keterangan": komentar
        }
        fetch(url, {
            method: 'POST',
            headers: rHeader,
            body: JSON.stringify(dataJson)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    showResult(result);
                },
                (error) => {
                    dismiss();
                    presentToast({
                        message: "error "+error.message + JSON.stringify(dataJson),
                        duration: 1500,
                        position: "top"
                    })
                    // setError(error);
                }
            )

    }
    const handleTolak = async () => {
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_APPROVED_URI;
        const rHeader = {'Content-Type': 'application/json', 'Identity': identity != null ? identity : ''}
        // @ts-ignore
        const komentar = document.getElementById('keterangan').value;
        //console.log("isi komentar: ", komentar)
        const dataJson = {
            "id": getId,
            "status": "REJECTED",
            "user": userId,
            "keterangan": komentar
        }
        fetch(url, {
            method: 'POST',
            headers: rHeader,
            body: JSON.stringify(dataJson)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    showResult(result);
                },
                (error) => {
                    dismiss();
                    presentToast({
                        message: "error "+error.message + JSON.stringify(dataJson),
                        duration: 1500,
                        position: "top"
                    })
                    // setError(error);
                }
            )

    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
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
                        <DetailHeader title='Ambil Alih Unit' link='' approval={status}></DetailHeader>
                        
                        <UserCardWithUnit name={items ? items['requester']['name'] : ""} nik={items ? items['requester']['nik'] : ""} noLambung={items ? items['pegawaiUnit']['unit']['noLambung'] : ""} noPol={items ? items['pegawaiUnit']['unit']['noPol'] : ""} foto={items ? items['requester']['foto'] : ""}></UserCardWithUnit>

                        <div className="p-6 bg-white mt-4">

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Lambung
                                </label>
                                <div>
                                    {items ? items['pegawaiUnit']['unit']['noLambung'] : ""}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Polisi
                                </label>
                                <div>
                                    {items ? items['pegawaiUnit']['unit']['noPol'] : ""}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Tipe
                                </label>
                                <div>
                                    {items ? items['pegawaiUnit']['unit']['tipeUnit']['name'] : ""}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Pemegang unit saat ini
                                </label>
                                <div>
                                    {items ? items['pegawaiUnit']['pegawai']['name'] : ""}
                                </div>
                            </div>

                            {status === 'PROPOSED' &&
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan disetujui/tolak
                                    </label>
                                    <TextareaExpand
                                        className="block w-full border-b border-gray-300 py-2 px-2"
                                        id="keterangan"
                                        name="keterangan"
                                    />
                                </div>
                            }
                            {status !== 'PROPOSED' &&
                                <div className="mt-4 text-sm text-gray-900">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan disetujui/tolak
                                    </label>
                                    <div>
                                        <span className='font-bold'>{items != null && items['approveBy'] != null ? items['approveBy']["name"] : "N/A"}</span>
                                        <br/>
                                        <span className='ml-2 italic'>{items != null ? items['keterangan'] : "N/A"}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {/* === End Content === */}

                    {/* === Footer button ===*/}
                    {status === 'PROPOSED' &&
                        <div className='py-6 grid grid-cols-2 bg-white'>
                            <div className="pl-6 pr-3">
                                <button onClick={handleTolak}
                                        className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                    TOLAK
                                </button>
                            </div>
                            <div onClick={handleSetuju} className="pl-3 pr-6">
                                <button
                                    className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                    DISETUJUI
                                </button>
                            </div>
                        </div>
                    }
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

export default GAPermintaanUnitDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

