import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    useIonToast,
    useIonAlert,
    useIonLoading, useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave, IonSkeletonText,
} from '@ionic/react';

import './GAP2HDetail.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    P2H_ITEM_URI, P2H_CRUD_URI, pref_user_id, pref_unit_id, pref_identity, P2H_APPROVAL_URI
} from "../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { OverlayEventDetail } from '@ionic/core/components';
import { getPref } from "../../../helper/preferences";
import TextareaExpand from "react-expanding-textarea";
import UserCardWithUnit from "../../Layout/UserCardWithUnit";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from '../../../components/Header/DetailHeader';

const Identity = "f8c3ca0e-f2e4-4cbd-9a48-e5f9905f420b";
//const getId = '8c1ffa34-a9de-4c76-b853-22c582d86315';
const rHeader = { 'Content-Type': 'application/json', 'Identity': Identity }
const userInfo = { name: "", nik: "", foto: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" }, listKomentar: [] };
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

const GAP2HDetail: React.FC = () => {
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
    const [items, setItems] = useState<any[]>([])
    const [contents_, setContents_] = useState<any[]>([])
    const [presentToast] = useIonToast();
    const [toast] = useIonToast();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [status, setStatus] = useState();
    const [listKomentar, setListKomentar] = useState<any[]>([]);

    const { t } = useTranslation()
    let id = useParams();
    const location = useLocation();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        // console.log(history.location);
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        loadDataBeforeComplete();
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
        setIsLoaded(false);
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
    });
    /* END LIFECYCLE APPS */

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        // console.log('Begin async operation');
        setIsLoaded(false);
        loadData(getId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }


    const [showModalSetuju, setShowModalSetuju] = React.useState(false);
    const [showModalTolak, setShowModalTolak] = React.useState(false);
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonTextareaElement>(null);

    const [message, setMessage] = useState(
        'This modal example uses triggers to automatically open a modal when the button is clicked.'
    );

    function confirm() {
        modal.current?.dismiss(input.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            setMessage(`Hello, ${ev.detail.data}!`);
        }
    }
    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        // getPref(pref_identity).then(res => {
        //     setIdentity(res);
        // });

    }

    const loadDataBeforeComplete = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        console.log('idnya ', dataId);
        loadData(dataId);
    };

    const loadData = (dataId: any) => {
        // @ts-ignore
        setGetId(dataId);
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + P2H_CRUD_URI + "/" + dataId;
        const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        console.log("URL: " + url);
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log("OK: " + result['data']);
                    setItems(result['data']);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setContents_(result['data']['data']);
                    setStatus(result['data']['status']);
                    setUser(result['data']['pegawai']);
                    setUnit(result['data']['unit']);
                    setListKomentar(result['data']['komentar']);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );

    }

    const handleSetuju = async () => {
        const url = BASE_API_URL + API_URI + P2H_APPROVAL_URI;
        const rHeader = { 'Content-Type': 'application/json', 'Identity': identity != null ? identity : '' }
        // @ts-ignore
        const komentar = document.getElementById('keterangan').value;
        const dataJson = {
            "p2h_id": getId,
            "status": "APPROVED",
            "user_id": userId,
            "komentar": komentar
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
                        message: "error " + error.message + JSON.stringify(dataJson),
                        duration: 1500,
                        position: "top"
                    })
                    // setError(error);
                }
            )

    }
    const handleTolak = async () => {
        const url = BASE_API_URL + API_URI + P2H_APPROVAL_URI;
        const rHeader = { 'Content-Type': 'application/json', 'Identity': identity != null ? identity : '' }
        // @ts-ignore
        const komentar = document.getElementById('keterangan').value;
        if(komentar.length >= 20 ){
            //console.log("isi komentar: ", komentar)
            const dataJson = {
                "p2h_id": getId,
                "status": "REJECTED",
                "user_id": userId,
                "komentar": komentar
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
                            message: "error " + error.message + JSON.stringify(dataJson),
                            duration: 1500,
                            position: "top"
                        })
                        // setError(error);
                    }
                )
        } else {
            toast( {
                    message: "Alasan harus diisi!", duration: 1500, position: "top"
                }
            );
        }
    }

    const btnApprove = () => {
        present({
            cssClass: 'my-class',
        });
        //history.push("/fuel/p2h/p2hinput");
    };
    const btnRejected = () => {
        history.push("/fuel/p2h/p2hinput");
    };
    const showResult = (responseStatus: any) => {
        dismiss();
        const status = responseStatus.status;
        if (responseStatus.status === 'SUCCESS') {
            presentToast({
                message: status,
                duration: 1500,
                position: "bottom"
            })
            //setShowModalSetuju(false);
            //setShowModalTolak(false);
            history.goBack();

        } else { //EXIST
            presentToast({
                message: status,
                duration: 1500,
                position: "bottom"
            })
        }
    };

    const toList = () => {
        history.push('/fuel/p2h/gap2hlist');
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



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
                                <DetailHeader title='P2H' link='' approval={status}></DetailHeader>

                                <UserCardWithUnit name={user.name} nik={user.nik} noLambung={unit.noLambung} noPol={unit.noPol} foto={user.foto}></UserCardWithUnit>

                                <div className="p-6 bg-white mt-4 mb-4">
                                    {items.map((p2h, index) => {
                                        return (
                                            <div key={p2h['id']}>
                                                <div className="px-2 py-2 p-2 text-sm mt-2">
                                                    <h3 className="text-md font-bold text-gray-900 pb-2">{p2h['judul']}</h3>
                                                    <p className="text-justify">{p2h['keterangan']}</p>
                                                    {p2h['konten'].map((contents: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; }, index: any) => {
                                                        return (
                                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                                <div className="inline-flex items-center text-gray-900">
                                                                    {contents['konten']}
                                                                </div>
                                                                <div className="whitespace-nowrap px-3 py-1 text-sm text-indigo-600">
                                                                    <input type="checkbox" readOnly className="h-4 w-4 rounded" name={'' + contents['id']} id={'' + contents['id']} checked={contents_.filter(x => x['konten_id'] === contents['id'])[0] === undefined ? false : contents_.filter(x => x['konten_id'] === contents['id'])[0]['nilai']} />
                                                                    <label className="ml-2 text-gray-500"> Ya</label>
                                                                    <input type="checkbox" readOnly className="h-4 w-4 ml-4 rounded" name={'' + contents['id']} id={'' + contents['id']} checked={contents_.filter(x => x['konten_id'] === contents['id'])[0] === undefined ? true : !contents_.filter(x => x['konten_id'] === contents['id'])[0]['nilai']} />
                                                                    <label className="ml-2 text-gray-500"> Tidak</label>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="pb-1 text-sm border-b">&nbsp;</div>
                                            </div>

                                        )
                                    })}

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
                                            {listKomentar != null ? listKomentar.map((object, i) =>
                                                <div className='flex'>
                                                    <span className='font-bold'>
                                                        {object['status']}
                                                    </span>
                                                    <span className='ml-4'>
                                                        {object['komentar']}
                                                    </span>
                                                </div>
                                            ) : ""}
                                        </div>
                                    }
                                </div>

                            </div>
                            {/* === End Content === */}

                            {/* === Footer button ===*/}
                            {status === 'PROPOSED' &&
                                <div className='py-6 grid grid-cols-2 bg-white'>
                                    <div className="pl-6 pr-3">
                                        <button onClick={handleTolak} className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                            TOLAK
                                        </button>
                                    </div>
                                    <div className="pl-3 pr-6">
                                        <button onClick={handleSetuju} className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                            DISETUJUI
                                        </button>
                                    </div>
                                </div>
                            }
                            {/* {status !== 'PROPOSED' &&
                                <div className='py-6 bg-white'>
                                    <div className="pl-6 pr-3">
                                        <button onClick={toList} className="items-center w-full mx-auto rounded-md bg-gray-300 px-3 py-2 text-sm font-bold text-gray-900">
                                            KEMBALI
                                        </button>
                                    </div>
                                </div>
                            } */}
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

export default GAP2HDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

