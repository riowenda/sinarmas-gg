import {
    IonContent,
    IonFooter,
    IonIcon,
    IonLabel,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
    useIonToast, useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter, useIonViewWillLeave
} from '@ionic/react';
import './DashboardGA.css';
import React, { useEffect, useState } from "react";
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import "../../components/Translate";
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";
import { getJsonPref, getPref } from "../../helper/preferences";
import { pref_json_pegawai_info_login, pref_unit, pref_user_role } from "../../constant/Index";

import { triangle, ellipse, square } from 'ionicons/icons';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const DashboardGA: React.FC = () => {
    const history = useHistory();
    const [present] = useIonToast();
    const [pegawai, setPegawai] = useState(user);
    const [role, setRole] = useState();
    const [unit, setUnit] = useState(userUnit);

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

    const menuFuel = () => {
        if (role === 'GA') {
            history.push("/ga/fuel/homepage");
        } else {
            history.push("/fuel/homepage");
        }
    };
    const menuMeal = () => {
        history.push("/fuel/");
    };
    const menuVisit = () => {
        history.push("/fuel/");
    };
    const menuGA = () => {
        history.push("/fuel/");
    };
    const listNotifikasi = () => {
        history.push("/notifikasi");
    };

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
            // console.log(res);
        });
        getJsonPref(pref_unit).then(restUnit => {
            setUnit(restUnit);
        });
        getPref(pref_user_role).then(restRole => {
            setRole(restRole);
        });
        //console.log("role: ", role);

    }

    return (
        <IonPage>
            {/*<NavTabBar name={"Tes"}></NavTabBar>*/}
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-gradient-to-r from-red-700 to-red-500 pt-12">
                    {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

                    {/* === Start Header === */}
                    <div className="divide-y divider-white p-6">
                        <div className="flex w-full items-center justify-between space-x-6 mb-5">
                            <img className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                                src={pegawai['imageUrl'] ? pegawai['imageUrl'] : ""} alt="" />
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-lg font-bold text-white">{pegawai['name']}</h3>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="truncate font-semibold text-lg text-white">{pegawai['nik']}</p>
                                </div>
                            </div>
                            <div onClick={listNotifikasi} className="inline-block text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                                <span className="absolute block items-center h-4 w-4 rounded-full bg-indigo-600 ring-2">
                                    <span className="text-white text-xs">20</span>
                                </span>
                            </div>
                        </div>

                        <div className="grid"></div>
                    </div>


                    {/* === End Header === */}

                    {/* === Start Body ===*/}
                    <div className="w-full rounded-t-3xl bg-white mt-2 p-6">
                        {/* === Start List Quick Menu === */}

                        <h2 className="font-bold">Quick Menu</h2>
                        <ul role="list" className="grid grid-cols-4 gap-x-1 gap-y-8 mt-2">
                            <li className="text-center">
                                <div onClick={menuFuel} className="flex flex-1 flex-col p-2">
                                    <img className="mx-auto h-10 w-10 flex-shrink-0" src="assets/icon/fuel.png" alt="" />
                                    <h3 className="mt-6 text-sm font-medium text-gray-900">Fuel</h3>
                                </div>
                            </li>
                            <li className="text-center">
                                <div className="flex flex-1 flex-col p-2">
                                    <img className="mx-auto h-10 w-10 flex-shrink-0" src="assets/icon/meal.png" alt="" />
                                    <h3 className="mt-6 text-sm font-medium text-gray-900">Meal</h3>
                                </div>
                            </li>
                            <li className="text-center">
                                <div className="flex flex-1 flex-col p-2">
                                    <img className="mx-auto h-10 w-10 flex-shrink-0" src="assets/icon/visit.png"
                                        alt="" />
                                    <h3 className="mt-6 text-sm font-medium text-gray-900">Visit</h3>
                                </div>
                            </li>
                            <li className="text-center">
                                <div className="flex flex-1 flex-col p-2">
                                    <img className="mx-auto h-10 w-10 flex-shrink-0" src="assets/icon/masterdata.png"
                                        alt="" />
                                    <h3 className="mt-6 text-sm font-medium text-gray-900">Master Data</h3>
                                </div>
                            </li>
                        </ul>

                        {/* === End List Quick Menu === */}

                        {/* === Start Card Ongoing Visit === */}
                        <div
                            className="divide-y divide-gray-200 overflow-hidden border border-1 border-gray-300 rounded-lg bg-white">
                            <div className="px-4 py-4 p-6">
                                <h3 className="text-md font-bold text-gray-900">Ongoing Visit</h3>
                                <div className="divide-y divide-gray-200">
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        <span className="text-left font-bold text-red-800">1 Jan 2022</span>
                                        <span className="items-center mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        <span className="text-right font-bold text-red-800">5 Jan 2022</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="mt-2">
                                            <span>Survei Lokasi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* === End Card Ongoing Visit === */}

                        {/* === Start Card Meal === */}
                        <div
                            className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-8">
                            <div className="px-4 py-5 p-6">
                                <h3 className="text-md font-bold text-gray-900">Permintaan Makanan</h3>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <span className="inline-flex items-center text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                            className="w-6 h-5 mr-6 text-green-600">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Pagi
                                    </span>
                                    <span className="text-right text-gray-900">Kantin BIB</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <span className="inline-flex items-center text-gray-900">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            className="w-6 h-5 mr-6 text-gray-200">
                                            <path fill-rule="evenodd"
                                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Siang
                                    </span>
                                    <span className="text-right text-gray-900">Kantin BIB</span>
                                </div>
                            </div>
                        </div>
                        {/* === End Card Meal === */}

                        {/* === Start Card Permintaan MDForFuel === */}
                        <div
                            className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-8 mb-8">
                            <div className="px-4 py-5">
                                <h3 className="text-md font-bold text-gray-900">Permintaan Bahan Bakar</h3>
                                <div className="mt-4">
                                    <span className="text-gray-900">BIB123 - AB 1234 CD</span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-gray-500">1 Jan 2022</span>
                                </div>
                            </div>
                            <div className="px-4 py-4 sm:px-6">
                                <p className="text-green-600 font-bold">Disetujui GA</p>
                            </div>
                        </div>
                        {/* === End Card Permintaan MDForFuel === */}
                    </div>
                    {/* === End Body ===*/}
                    {/*</div>*/}
                </div>
            </IonContent>
            <BottomNavBar/>
        </IonPage >
    );
};

export default DashboardGA;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

