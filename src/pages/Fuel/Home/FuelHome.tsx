import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonBackButton,
    useIonLoading,
    useIonAlert,
    useIonToast,
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave,
    useIonViewDidLeave,
    IonToolbar,
    IonButtons, IonHeader
} from '@ionic/react';

import './FuelHome.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI, pref_identity,
    pref_json_pegawai_info_login, pref_pegawai_unit_id,
    pref_unit, pref_unit_id
} from "../../../constant/Index";

import { useHistory, useLocation } from "react-router-dom";
import { getJsonPref, getPref, removePref } from "../../../helper/preferences";
import {IonBackButtonInner} from "@ionic/react/dist/types/components/inner-proxies";
import ListHeader from "../../../components/Header/ListHeader";

const user = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const FuelHome: React.FC = () => {
    const history = useHistory();
    const [unit, setUnit] = useState<any>(userUnit);
    const [pegawai, setPegawai] = useState(user);
    const [pegawaiUnitId, setPegawaiUnitId] = useState<any>("");
    const [presentAlert] = useIonAlert();
    const [showConfirm] = useIonAlert();
    const [toast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [identity, setIdentity] = useState("");

    const { t } = useTranslation();
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
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        console.log("MDForFuel home ")
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_unit_id).then(res => {
            setPegawaiUnitId(res);
        })
    }

    const btnP2H = () => {
        history.push("/fuel/p2h/p2hlist");
    };
    const lepasUnit = () => {
        let keterangan = "Anda yakin ingin melepas Unit?";
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
                        console.log("sini");
                        sendRequest();
                    }
                },
            ],
        })
    };
    const btnGantiUnit = () => {
        history.push("/fuel/unit/ganti");
    };
    const btnDaftarPermintaanUnit = () => {
        history.push("/fuel/unit/daftar-permintaan");
    };
    const btnDaftarPermintaanUnitSementara = () => {
        history.push("/fuel/temp-unit/daftar-permintaan");
    };
    const btnDaftarPermintaanOtherCoupon = () => {
        history.push("/fuel/req-other/daftar-permintaan")
    }

    const sendRequest = () => {
        const loading = present({
            message: 'Memproses permintaan ...',
        })
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_RELEASED_URI;

        // @ts-ignore
        const data = { id: pegawaiUnitId }
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        dismiss();
                        showAlertConfirmed();
                    } else {
                        dismiss();
                        showConfirm({
                            subHeader: 'Tidak dapat memproses pelepasan unit',
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                },
                            ],
                        })
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    dismiss();
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                }
            )
    };

    const showAlertConfirmed = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Berhasil melepas unit. Silahkan memilih unit kembali!',
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        removePref(pref_unit).then(r => {
                            setUnit(null);
                        });
                        removePref(pref_unit_id).then(r => {
                            setPegawaiUnitId(null);
                        });
                        removePref(pref_pegawai_unit_id).then(r => r);
                    }
                },
            ],
        })
    }

    const btnTolist = () => {
        history.push("/fuel/req-fuel/daftar-permintaan");
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/dashboard");
    }

    const btnCoupon = () => {
        // history.goBack();
        history.push("/all-coupon");
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="bg-red-700">
                    {/* Header */}
                    <ListHeader title={"Unit dan Bahan Bakar"} isReplace={false} link={""} addButton={false} />
                    {/* End Header */}

                    <div className='px-4'>
                        <div className='rounded-lg bg-white p-2'>
                            <div className='grid divide-gray-200 grid-cols-3 divide-x py-2'>
                                <div className='px-2'>
                                    <div className='text-xs text-gray-400'>
                                        No. Lambung
                                    </div>
                                    <div className='text-sm font-bold'>
                                        {unit != null && unit['noLambung'] != null ? unit['noLambung'] : "N/A"}
                                    </div>
                                </div>
                                <div className='px-2'>
                                    <div className='text-xs text-gray-400'>
                                        No. Polisi
                                    </div>
                                    <div className='text-sm font-bold'>
                                        {unit != null && unit['noPol'] != null ? unit['noPol'] : "N/A"}
                                    </div>
                                </div>
                                <div className='px-2'>
                                    <div className='text-xs text-gray-400'>
                                        Tipe
                                    </div>
                                    <div className='text-sm font-bold'>
                                        {unit != null && unit['jenisUnit'] != null ? unit['jenisUnit']['name'] : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div className='px-2 text-xs'>
                                {unit != null && unit['vendor'] != null ? unit['vendor']['name'] : "N/A"}
                            </div>
                        </div>

                    </div>


                    {/* === Start Header === */}
                    {/* {unit != null &&
                        <div className="ml-6">
                            <div className="flex w-full items-center justify-between space-x-6">
                                <div className="flex-1 truncate">
                                    <div className="items-center space-x-3">
                                        <h3 className="truncate text-base font-bold text-white">{unit['noLambung']}</h3>
                                    </div>
                                    <div className="text-white font-semibold">
                                        <span className="text-yellow-300">{unit['noPol']}</span>
                                        <span className="text-white ml-3">{unit['jenisUnit']['name']}</span>
                                    </div>
                                    <div className="text-white text-sm">{unit['vendor']['name']}</div>
                                </div>
                            </div>
                        </div>
                    } */}
                    {/* === End Header === */}


                    <div className="bg-white p-2 mt-4">
                        {/* === Start Current Status === */}
                        <div className={unit != null ? "px-4 py-2" : "px-4 pb-2"}>
                            {unit != null ?
                                <div className="grid grid-cols-3 gap-4">
                                    <span onClick={lepasUnit} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold border border-gray-300">
                                        Lepas Unit
                                    </span>
                                    <span onClick={btnGantiUnit} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold border border-gray-300">
                                        Ganti Unit
                                    </span>
                                    <span onClick={btnP2H} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold border border-gray-300">
                                        P2H
                                    </span>
                                </div> :
                                <div className="grid grid-cols-3 gap-4">
                                    <span onClick={btnGantiUnit} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold border border-gray-300">
                                        Pilih Unit
                                    </span>
                                </div>
                            }
                        </div>

                        <div className="px-4 py-4">
                            <h3 className="font-bold py-2">Status</h3>
                            <div className="flex justify-between items-center overflow-hidden rounded-lg bg-teal-500 text-white border border-1 border-gray-200 text-sm">
                                <div className='px-4'>
                                    Sedang perjalanan dinas ke BIB site
                                </div>
                                <img className='h-20 -ml-6 object-right' src='assets/images/banners/car-mpv-on-visit.png' />
                            </div>
                        </div>
                        {/* === End Current Status === */}

                        {/* === Start Request === */}
                        <div className="px-4 py-4">
                            <h3 className="font-bold py-2">Permintaan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={btnTolist} className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold">
                                    {/* <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 mr-2" src='assets/icon/fuel-unit-icon.png' />
                                    <span className='ml-1 text-left'>
                                        Bahan Bakar Unit
                                    </span>
                                </button>
                                <button onClick={btnDaftarPermintaanOtherCoupon} className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold">
                                    {/* <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 mr-2" src='assets/icon/fuel-non-unit-icon.png' />
                                    <span className='ml-1 text-left'>
                                        Bahan Bakar Non-Unit
                                    </span>
                                </button>
                                <button onClick={btnCoupon} className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold">
                                    {/* <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 mr-2" src='assets/icon/coupon-icon.png' />
                                    <span className='ml-1 text-left'>
                                        Kupon
                                    </span>
                                </button>
                                <button onClick={btnDaftarPermintaanUnitSementara} className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold">
                                    {/* <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 mr-2" src='assets/icon/temporary-unit-icon.png' />
                                    <span className='ml-1 text-left'>
                                        Unit Sementara
                                    </span>

                                </button>
                                <button onClick={btnDaftarPermintaanUnit} className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold">
                                    {/* <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 mr-2" src='assets/icon/change-unit-icon.png' />
                                    <span className='ml-1 text-left'>
                                        Ganti Unit
                                    </span>

                                </button>
                            </div>
                        </div>
                        {/* === End Request === */}

                        {/* === Start Last Request === */}
                        <div className="px-4 py-4">
                            <div className="flex justify-between">
                                <h3 className="font-bold py-2">Request Terakhir</h3>
                                <button className="text-sm font-bold py-2 text-red-700">Lihat Semua</button>
                            </div>
                            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-200">
                                <div className="px-2 py-2">
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ">
                                                <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                            <div>
                                                <p className="text-base font-bold text-gray-900">BIB 123 - H8347AQ</p>
                                                <p className="text-sm text-gray-900">Triton</p>
                                                <p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <span className="text-base font-bold text-green-600">APPROVED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-200">
                                <div className="px-2 py-2">
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ">
                                                <svg className="h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                            <div>
                                                <p className="text-base font-bold text-gray-900">BIB 123 - H8347AQ</p>
                                                <p className="text-sm text-gray-900">Triton</p>
                                                <p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                <span className="text-base font-bold text-red-600">REJECTED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* === END Last Request === */}
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default FuelHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

