import {
    IonBadge,
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';

import './FinanceHome.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL, P2H_LIST_GA_URI, TEMP_UNIT_ALL_GA_URI,
    pref_json_pegawai_info_login, TEMP_UNIT_URI, TAKEOVER_ALL_GA_URI,
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import { getJsonPref } from "../../../helper/preferences";
import HeaderGA from "../../Dashboard/HeaderGA";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

const user = { name: "", nik: "", imageUrl: "" }
const FinanceHome: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const [pegawai, setPegawai] = useState(user);
    const [countP2H, setCountP2H] = useState();
    const [countGantiUnit, setCountGantiUnit] = useState();
    const [countTempUnit, setCountTempUnit] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [tempUnits, setTempUnits] = useState([]);
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
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
        });
    }

    const btnListReqFuel = () => {
        history.push("/fuel/req-fuel/daftar-permintaan");
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="bg-gradient-to-r from-red-700 to-red-500 pt-4">
                    {/* === Start Header === */}
                    <HeaderGA />
                    {/* === End Header === */}

                    <div className="bg-white rounded-t-3xl p-2 ">
                        {/* === Start Current Status === */}
                        {/*<div className="px-4 py-4">
                            <h3 className="font-bold py-2">Status</h3>
                            <div className="rounded-lg bg-teal-500 text-white text-sm px-4 py-6">
                                Sedang perjalanan dinas ke BIB site
                            </div>
                        </div>*/}
                        {/* === End Current Status === */}

                        {/* === Start Request === */}
                        <div className="px-2 py-2">
                            <h3 className="font-bold py-2">Permintaan</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div onClick={btnListReqFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3">
                                    <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">Bahan Bakar Unit</p>
                                            <p className="text-sm text-green-600">20 permintaan baru</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <div onClick={btnListReqFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3">
                                    <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">Bahan Bakar Non-Unit</p>
                                            <p className="text-sm text-green-600">20 permintaan baru</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* === End Request === */}


                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default FinanceHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

