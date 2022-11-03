import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';

import './FuelmanNotifikasi.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    pref_identity,
    pref_user_id,
    pref_user_role, FUEL_REQ_UNIT_URI, FUEL_REQ_USER_LIST_URI, pref_pegawai_unit_id, FUEL_REQ_USER_LAST_REDEM
} from "../../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import { getPref } from "../../../../helper/preferences";
import moment from "moment";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

const FuelmanNotifikasi: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [pegUnitId, setPegUnitId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [role, setRole] = useState();
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
        loadDataPref();
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
        loadDataPermintaan(pegUnitId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); loadDataPermintaan(res); });
        getPref(pref_user_role).then(restRole => {
            setRole(restRole);
        });
    }

    const loadDataPermintaan = (user: any) => {
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_USER_LIST_URI + "/" + user;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result.data);
                    setItems(result.data);
                    setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const btnPilih = (id: any) => {

        history.push({
            pathname: "/fuel/req-fuel/ga-appoval/" + id,
            state: { detail: id }
        });
        // console.log('dipilih ',)
    };


    const btnDetailReqFuel = (id: any) => {
        history.push({
            pathname: "/fuel/req-fuel/detail/" + id,
            state: { detail: id }
        });

        // history.push("/fuel/req-fuel/detail/" + id);
    }

    const btnBack = () => {
        history.goBack();
        // history.push("/fuel/homepage2");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700 ">
                    <div className="px-4 py-6">
                        <div className="flex">
                            <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                            </svg>
                            <div className='flex justify-between w-full items-center -mt-1 text-white'>
                                <div className="ml-4">
                                    <h3 className="font-bold ">Notifikasi</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === Start List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-4">
                            {items != null ? items.map((req, index) => {
                                return (
                                    <div onClick={() => btnDetailReqFuel(req['id'])} key={req['id']}
                                         className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">
                                        <div>
                                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                                <div>
                                                    <p className="text-base font-bold text-gray-900">{req['pegawaiUnit']['unit']['noPol']} - {req['pegawaiUnit']['unit']['noLambung']}</p>
                                                    <p className="text-sm text-gray-900">{req['pegawaiUnit']['unit']['jenisUnit']['name']} - {req['pegawaiUnit']['unit']['tipeUnit']['name']}</p>
                                                    <p className="text-sm text-gray-900">{req['pegawaiUnit']['unit']['vendor']['name']}</p>
                                                </div>
                                                <div className="whitespace-nowrap text-center text-sm text-gray-500">
                                                    <p className="text-sm text-gray-900">{moment(req['tanggal']).format('DD MMM yyyy').toString()}</p>
                                                    {req['status'] === 'PROPOSED' &&
                                                        <span className="text-blue-600 font-bold">{req['status']}</span>
                                                    }
                                                    {req['status'] === 'REJECTED' &&
                                                        <span className="text-red-600 font-bold">{req['status']}</span>
                                                    }
                                                    {req['status'] === 'APPROVED' &&
                                                        <span className="text-green-600 font-bold">{req['status']}</span>
                                                    }
                                                    {req['status'] === 'READY' &&
                                                        <span className="text-green-600 font-bold">{req['status']}</span>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </div>
                    </div>
                    {/* === End List === */}

                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default FuelmanNotifikasi;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

