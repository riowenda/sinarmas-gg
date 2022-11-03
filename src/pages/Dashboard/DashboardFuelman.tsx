import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonToast, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave
} from '@ionic/react';
import './DashboardFuelman.css';
import React, { useEffect, useState } from "react";
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import "../../components/Translate";
import {useHistory, useLocation} from "react-router-dom";
import { getJsonPref, getPref } from "../../helper/preferences";
import { pref_json_pegawai_info_login, pref_unit, pref_user_role } from "../../constant/Index";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const DashboardFuelman: React.FC = () => {
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
    
    const menuScan = () => {
        history.push("/fuel/scan");
    };

    const listNotifikasi = () => {
        history.push("/fuel/notifikasi");
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
                <div className="bg-gradient-to-r from-red-700 to-red-500">
                    {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

                    {/* === Start Header === */}
                    <div className="divide-y divider-white p-6">
                        <div className="flex w-full items-center justify-between space-x-6 mb-5">
                            {pegawai["imageUrl"] != null && pegawai["imageUrl"] !== "" ?
                                <img
                                    className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                                    src={pegawai["imageUrl"]}
                                    alt=""
                                /> :
                                <img
                                    className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwOCA1MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwOCA1MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzkwREZBQTsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik0yNTUuMiwzNjMuMmMtMC40LDAtMC44LDAuNC0xLjYsMC40Yy0wLjQsMC0wLjgtMC40LTEuNi0wLjRIMjU1LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik00NTguNCw0MDRjLTQ2LDYyLjgtMTIwLjgsMTA0LTIwNC44LDEwNFM5NS4yLDQ2Ny4yLDQ4LjgsNDA0YzM2LTM4LjQsODQuOC01OC44LDEyNS42LTY5LjINCgkJYy0zLjYsMjkuMiwxMS42LDY4LjQsMTIsNjcuMmMxNS4yLTM1LjIsNjYuOC0zOC40LDY2LjgtMzguNHM1MS42LDIuOCw2Ny4yLDM4LjRjMC40LDAuOCwxNS42LTM4LDEyLTY3LjINCgkJQzM3My42LDM0NS4yLDQyMi40LDM2NS42LDQ1OC40LDQwNHoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkQwNUI7IiBkPSJNMzE2LjgsMzA4TDMxNi44LDMwOGMwLDUuMi0zLjIsMzIuOC02MS42LDU1LjJIMjUyYy01OC40LTIyLjQtNjEuNi01MC02MS42LTU1LjJsMCwwDQoJYzAuNC0xMC40LDIuOC0yMC44LDcuMi0zMC40YzE2LDE4LDM1LjIsMzAsNTYsMzBjMjAuNCwwLDQwLTExLjYsNTYtMzBDMzE0LDI4Ny4yLDMxNi44LDI5Ny42LDMxNi44LDMwOHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGMTU0M0Y7IiBkPSJNMjg4LjQsMzcyLjRMMjc1LjYsMzk4aC00NGwtMTIuOC0yNS42YzE3LjYtNy42LDM0LjgtOC44LDM0LjgtOC44UzI3MS4yLDM2NC44LDI4OC40LDM3Mi40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGNzA1ODsiIGQ9Ik0yMTgsNTA1LjZjMTEuNiwxLjYsMjMuNiwyLjQsMzYsMi40YzEyLDAsMjQtMC44LDM2LTIuNGwtMTQtMTA3LjJoLTQ0TDIxOCw1MDUuNnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzE2LjgsMzA3LjJjMCwwLDIuOCwzMi02My4yLDU2LjRjMCwwLDUxLjYsMi44LDY3LjIsMzguNEMzMjEuMiw0MDMuNiwzNTEuMiwzMjYsMzE2LjgsMzA3LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOTAuNCwzMDcuMmMtMzQsMTguOC00LjQsOTYtMy42LDk0LjhjMTUuMi0zNS4yLDY3LjItMzguNCw2Ny4yLTM4LjQNCgkJQzE4Ny42LDMzOS4yLDE5MC40LDMwNy4yLDE5MC40LDMwNy4yeiIvPg0KPC9nPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Y5QjU0QzsiIGQ9Ik0zMTIuOCwyODUuNmMtMTYuOCwxOC0zNi44LDI5LjYtNTkuMiwyOS42cy00Mi40LTExLjYtNTkuMi0yOS42YzAuOC0yLjgsMi01LjYsMy4yLTgNCgljMTYsMTgsMzUuMiwzMCw1NiwzMHM0MC0xMS42LDU2LTMwQzMxMC44LDI4MCwzMTIsMjgyLjgsMzEyLjgsMjg1LjZ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZEMDVCOyIgZD0iTTM2Mi44LDIyNC40Yy04LjQsMTQtMjEuMiwyMi40LTMwLjgsMjAuOGMtMTkuMiwzNS42LTQ3LjIsNjItNzguNCw2MnMtNTkuMi0yNi44LTc4LjQtNjINCgljLTkuNiwxLjItMjIuNC02LjgtMzAuOC0yMC44Yy0xMC0xNi40LTEwLjQtMzQuNC0wLjgtNDAuNGMyLjQtMS4yLDQuOC0yLDcuNi0xLjZjNi40LDE2LjQsMTUuMiwyNi40LDE1LjIsMjYuNA0KCWMtOS4yLTUwLjgsMjguNC01Ni40LDIyLTEwNS4yYzAsMCwyMy42LDUyLjQsOTEuMiwxNS42bC01LjIsMTBjOTQuNC0yMS4yLDYyLjgsOTAsNjIsOTIuOGMxMC44LTEzLjYsMTcuNi0yNy4yLDIxLjYtMzkuNg0KCWMxLjYsMCwzLjYsMC44LDQuOCwxLjZDMzczLjIsMTg5LjYsMzcyLjgsMjA4LDM2Mi44LDIyNC40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMyNEE1RTsiIGQ9Ik0zMDgsNTAuOGM3LjYtMC44LDIwLDYsMjAsNmMtMzQtMzguOC04OS42LTE0LTg5LjYtMTRjMTguOC0xNiwzNS42LTE0LjQsMzUuNi0xNC40DQoJYy03OS42LTEyLTkzLjIsMzUuNi05My4yLDM1LjZjLTMuNi01LjYtMy42LTEzLjYtMy4yLTE3LjZDMTcyLDU2LDE3OCw3NS4yLDE3OCw3NS4yYy01LjYtMTQtMjUuMi0xMS42LTI1LjItMTEuNg0KCWMxNi44LDIuOCwxOS42LDEzLjIsMTkuNiwxMy4yYy00MiwxNS42LTM0LjgsNTkuMi0zNC44LDU5LjJsMTAtMTJjLTEyLjQsNDcuNiwxOS4yLDg0LjQsMTkuMiw4NC40Yy05LjItNTAuOCwyOC40LTU2LjQsMjItMTA1LjINCgljMCwwLDIzLjYsNTIuNCw5MS4yLDE1LjZsLTUuMiwxMGM5NS42LTIxLjYsNjIsOTMuMiw2Miw5My4yYzM0LTQzLjIsMjguOC04Ny42LDI4LjgtODcuNmw0LDE2QzM4MC40LDc4LjQsMzA4LDUwLjgsMzA4LDUwLjh6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
                                />
                            }
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-lg font-bold text-white">{pegawai['name']}</h3>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="truncate font-semibold text-lg text-white">{pegawai['nik']}</p>
                                </div>
                            </div>
                            <button onClick={listNotifikasi} className="py-4 px-1 relative border-2 border-transparent text-white rounded-full" aria-label="Cart">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                    />
                                </svg>
                                <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                  <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                    99+
                                  </div>
                                </span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <span
                                className="inline-flex text-center text-white items-center rounded-2xl bg-green-500 px-2.5 py-3 text-xs font-bold mt-5">
                                <div className="mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                        className="w-4 h-4">
                                        <path fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <span>MASUK KERJA</span>
                            </span>
                            <button
                                className="inline-flex text-center items-center rounded-2xl bg-gray-900 bg-opacity-30 px-2.5 py-3 text-xs font-bold mt-5">
                                <div className="mr-3 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                </div>
                                <span className="text-white">123 POINTS</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" className="ml-2 w-4 h-4 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {role == "FUELMAN" ?
                        <div className="px-6">
                            <div className="overflow-hidden rounded-2xl bg-white">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate divide-y divide-gray-300">
                                        <div className="flex items-center space-x-3 pb-2">
                                            <p className="truncate text-sm font-bold text-gray-900">
                                                Stasiun Pengisian Angsana
                                            </p>
                                        </div>
                                        <div className="inline-flex w-full justify-between pt-2 items-center space-x-3">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                Stok saat ini
                                            </p>
                                            <span className="font-bold mx-1 text-green-500">1234 liter</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="px-6">
                            <div className="overflow-hidden rounded-2xl bg-white">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <p className="truncate text-sm font-medium text-gray-900">Sedang perjalanan
                                                dinas BIB ke Site</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="grid divide-gray-200 border-t border-gray-200 bg-gray-50 grid-cols-2 divide-y-0 divide-x">
                                    <div className="px-6 py-3 text-center text-sm font-medium">
                                        <span className="text-gray-600">{unit != null ? unit['noLambung'] : "-"}</span>
                                    </div>
                                    <div className="px-6 py-3 text-center text-sm font-medium">
                                        <span className="text-gray-600">{unit != null ? unit['noPol'] : "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    {/* === End Header === */}


                    {/* === Start Body ===*/}
                    <div className="w-full rounded-t-3xl bg-white mt-8 p-6">
                        <div className="mt-6">
                            <button onClick={menuScan} className="overflow-hidden w-full rounded-2xl bg-slate-800">
                                <div className="flex w-full items-center justify-center text-white px-6 py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                    </svg>
                                    <p className="ml-4 font-bold ">Scan QR Code</p>
                                </div>
                            </button>
                        </div>

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
                {/*<footer*/}
                {/*    className="fixed bottom-0 left-0 z-20 p-4 w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">*/}
                {/*    <IonTabs>*/}
                {/*        <IonRouterOutlet>*/}
                {/*            <Route exact path="/tab1">*/}
                {/*                /!*<Tab1 />*!/*/}
                {/*            </Route>*/}
                {/*            <Route exact path="/tab2">*/}
                {/*                /!*<Tab2 />*!/*/}
                {/*            </Route>*/}
                {/*            <Route path="/tab3">*/}
                {/*                /!*<Tab3 />*!/*/}
                {/*            </Route>*/}
                {/*            <Route exact path="/">*/}
                {/*                <Redirect to="/tab1" />*/}
                {/*            </Route>*/}
                {/*        </IonRouterOutlet>*/}
                {/*        <IonTabBar slot="bottom">*/}
                {/*            <IonTabButton tab="tab1" href="/tab1">*/}
                {/*                <IonIcon icon={triangle} />*/}
                {/*                <IonLabel>Tab 1</IonLabel>*/}
                {/*            </IonTabButton>*/}
                {/*            <IonTabButton tab="tab2" href="/tab2">*/}
                {/*                <IonIcon icon={ellipse} />*/}
                {/*                <IonLabel>Tab 2</IonLabel>*/}
                {/*            </IonTabButton>*/}
                {/*            <IonTabButton tab="tab3" href="/tab3">*/}
                {/*                <IonIcon icon={square} />*/}
                {/*                <IonLabel>Tab 3</IonLabel>*/}
                {/*            </IonTabButton>*/}
                {/*        </IonTabBar>*/}
                {/*    </IonTabs>*/}
                {/*</footer>*/}
            </IonContent>
            <BottomNavBar />
        </IonPage>
    );
};

export default DashboardFuelman;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

