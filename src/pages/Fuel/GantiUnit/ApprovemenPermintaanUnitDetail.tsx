import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import './ApprovemenPermintaanUnitDetail.css';
import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {
    API_URI,
    BASE_API_URL,
    TAKEOVER_UNIT_URI,
    PEGAWAI_UNIT_CRUD_URI, pref_user_id, pref_identity, PEGAWAI_UNIT_APPROVED_URI
} from "../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getPref} from "../../../helper/preferences";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

const ApprovemenPermintaanUnitDetail: React.FC = () => {
    const [paramId, setParamId] = useState(null)
    const history = useHistory()
    //setGetId(history['location']['state']['id'])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [present, dismiss] = useIonLoading();
    const [showConfirm] = useIonAlert();
    const [toast] = useIonToast();
    const [presentAlert] = useIonAlert();
    const [alasan, setAlasan] = useState<string>("")
    const [items, setItems] = useState<{// @ts-ignore
        [key: string]}>()
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const id = useParams<any[]>();
    const {t} = useTranslation();
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
        console.log('Begin async operation');
        setIsLoaded(false);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadData = () => {
        // @ts-ignore
        const dataId = id['id'];
        setParamId(dataId);
        loadDataPref();
        const url = BASE_API_URL + API_URI + TAKEOVER_UNIT_URI + "/" + dataId;
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setItems(result['data']);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );

    }

    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        } );
        getPref(pref_identity).then(res => {setIdentity(res)});

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const acceptReject = (status: string) => {
        let keterangan = "";
        let allowToPush = false;
        // console.log(alasan);
        if(status === "REJECTED"){
            if(alasan !== null && alasan !== "" && alasan.length >= 20) {
                keterangan = "Anda yakin untuk menolak permintaan ganti unit ini?";
                allowToPush = true;
            } else {
                toast({
                    message: "Alasan wajib diisi!",
                    duration: 1500,
                    position: "top"
                });
            }
        } else {
            keterangan = "Anda yakin ingin melepas Unit?";
            allowToPush = true;
        }
        if(allowToPush) {
            presentAlert({
                subHeader: keterangan,
                buttons: [
                    {
                        text: 'Batal',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendRequest(status);
                        }
                    },
                ],
            })
        }
    }

    const sendRequest = (status: any) => {
        const loading = present({
            message: 'Memproses permintaan ...',
        })
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_APPROVED_URI;
        const data = {id: paramId, user: userId, keterangan: alasan, status: status} //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    showAlertConfirmed(status);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    dismiss();
                    toast( {
                            message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    };

    const showAlertConfirmed = (status : any) => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: '' + ("Berhasil memproses "+ (status === "REJECTED" ? "Penolakan." : "Persetujuan.")) + '',
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        history.push('/notifikasi');
                    }
                },
            ],
        })
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-gradient-to-r from-red-700 to-red-500 pt-12">
                    {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

                    {/* === Start Header === */}


                    {/* === End Header === */}

                    {/* === Start Body ===*/}
                    <div className="w-full rounded-3xl bg-white mt-8 p-6">
                        <div className="relative pt-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-red-900"/>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <button type="button" className="relative inline-flex items-center rounded-l-md rounded-r-md border border-red-900 bg-red-900 px-4 py-2 text-white">
                                    Detail
                                  </button>
                                </span>
                            </div>
                        </div>


                        {/* === Start Card Data === */}
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Permintaan</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">Ambil Alih Unit</p>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Nomor Lambung</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{items ? items['pegawaiUnit']['unit']['noLambung'] : ""}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Tipe</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{items ? items['pegawaiUnit']['unit']['tipeUnit']['name'] : ""}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Nomor Unit</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{items ? items['pegawaiUnit']['unit']['noPol'] : ""}</dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">Peminta Unit</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{items ? items['requester']['name'] : ""}</dd>
                                    </div>
                                    { (items != null && items['status'] !== null && items['status'] !== 'PROPOSED')  &&
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{items ? items['status']:""}</dd>
                                        </div>
                                    }
                                    { (items != null && items['keterangan'] !== null && items['keterangan'] !== '')  &&
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Alasan</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{items ? items['keterangan']:""}</dd>
                                        </div>
                                    }
                                    <div className="sm:col-span-2" hidden={items != null && items['status'] === 'PROPOSED' ? false : true}>
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Alasan disetujui/tolak
                                        </label>
                                        <div className="mt-1 sm:col-span-2 sm:mt-1">
                                            <textarea onChange={(event) => setAlasan(event.target.value)} rows={3} className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={''}/>
                                        </div>
                                    </div>
                                    <div className="pt-5" hidden={items != null && items['status'] === 'PROPOSED' ? false : true}>
                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => acceptReject("REJECTED")}
                                                type="button"
                                                className="rounded-md border border-indigo-300 bg-white py-2 px-6 text-sm font-medium text-indigo-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                TOLAK
                                            </button>
                                            <button
                                                onClick={() => acceptReject("APPROVED")}
                                                type="submit"
                                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                DISETUJUI
                                            </button>
                                        </div>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        {/* === End Card Data === */}

                    </div>
                    <div className="h-10 w-full bg-white -mt-6">
                    </div>
                    {/* === End Body ===*/}
                    {/*</div>*/}
                </div>

            </IonContent>
        </IonPage>
    );
};

export default ApprovemenPermintaanUnitDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

