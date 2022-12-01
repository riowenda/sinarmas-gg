import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave,
    useIonViewDidLeave, useIonAlert,
} from '@ionic/react';

import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {
    AUTH_FUEL_MANAGER,
    pref_app_server_version,
    pref_app_version,
    pref_fuel_station,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_token,
    pref_user_id
} from "../../../constant/Index";

import {useHistory, useLocation} from "react-router-dom";
import {getFuelMenu, getJsonPref, getPref, removePref, setJsonPref} from "../../../helper/Preferences";
import {IonBackButtonInner} from "@ionic/react/dist/types/components/inner-proxies";
import ListHeader from "../../../components/Header/ListHeader";
import {CountP2H} from "../../../api/KuponAPI/CountApi";
import {PegawaiDetail} from "../../../api/MDForFuel/PegawaiApi";
import BottomNavBar from "../../../components/BottomNavBar/BottomNavBar";
import {VersionApps} from "../../../api/VersionAppsAPI";
import {getPermPref, setPermPref} from "../../../helper/PermanentPreferences";
import {logDeviceInfo} from "../../../helper/DeviceInfo";

const user = {name: "", nik: "", imageUrl: ""}
const FuelmanFuelHome: React.FC = () => {
    const history = useHistory();
    const [pegawai, setPegawai] = useState(user);
    const [stasiun, setStasiun] = useState<any>();
    const [token, setToken] = useState<any>();
    const [pegId, setPegId] = useState("");
    const [userId, setUserId] = useState("");
    const [identity, setIdentity] = useState("");
    const [notif, setNotif] = useState(0);
    const [presentAlert] = useIonAlert();
    const [menuFuel, setMenuFuel] = useState("");

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
        loadDataPref();
        checkVersion();
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
        loadDataPref();
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
        getPref(pref_user_id).then(r => {
            setUserId(r);
        });
        getPref(pref_identity).then(i => {
            setIdentity(i);
        });
        getPref(pref_pegawai_id).then(p => {
            setPegId(p);
            getDataPegawai(p);
        });
        getPref(pref_token).then(tkn => {
            setToken(tkn);
        })
        getFuelMenu().then(data => {
            setMenuFuel(data);
        });
    }

    const getDataPegawai = (id: string) => {
        PegawaiDetail(id).then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                console.log(data.data)
                let dt = data.data;
                if(dt.pegawai.fuelStasiun != null) {
                    setJsonPref(pref_fuel_station, JSON.stringify(dt.pegawai.fuelStation)).then(peg => peg);
                    setStasiun(dt.pegawai.fuelStasiun);
                }
            } else {
                dataStasiun();
            }
        });
    }

    const dataStasiun = () =>{
        getJsonPref(pref_fuel_station).then(s =>{
            setStasiun(s);
        });
    }
    const menuScan = () => {
        history.push("/fuel/scan");
    };

    const menuStok = () => {
        history.push("/fuel/ganti-stok/daftar");
    };

    const listNotifikasi = () => {
        history.push("/notifikasi");
    };

    const checkVersion = () => {
        VersionApps().then(result => {
            console.log(">>>>>>> version <<<<<< " + result);
            try {
                let version = (result['version']).replace(" ","");
                let force = result['forceUpdate'];
                getPermPref(pref_app_version).then( v => {
                    if (version !== v){
                        logDeviceInfo().then(i => {
                            console.log(i);
                            showAlertUpdate(force, i.operatingSystem);
                        })
                    }
                });
                setPermPref(pref_app_server_version, version).then(r => r);
            } catch (e) {

            }
        })
    }

    const showAlertUpdate = (force: boolean, os: string) => {
        let teks = t('versi.ada_update')
        if(force){
            presentAlert({
                subHeader: teks,
                backdropDismiss: false,
                buttons: [
                    {
                        text: t('btn.oke'),
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            if(os === 'ios'){

                            }
                            if(os ==='android'){

                            }
                            return false;
                        }
                    },
                ],
            })
        } else {
            presentAlert({
                subHeader: teks,
                backdropDismiss: false,
                buttons: [
                    {
                        text: t('btn.batal'),
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: t('btn.ya'),
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                        }
                    },
                ],
            })
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700">
                    {/* Header */}
                    {/*<ListHeader title={"Bahan Bakar"} isReplace={false} link={""} addButton={false}/>*/}
                    {/* End Header */}
                    <div className="divide-y divider-white pt-6 pl-6 pr-6">
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
                            <button onClick={listNotifikasi}
                                    className="py-4 px-1 relative border-2 border-transparent text-white rounded-full"
                                    aria-label="Cart">
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
                                {notif > 0 &&
                                    <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                        <div
                                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                            {notif}
                                        </div>
                                    </span>
                                }
                            </button>
                        </div>
                    </div>
                    <div className="px-6 pb-8">
                        <div className="overflow-hidden rounded-2xl bg-white">
                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                <div className="flex-1 truncate divide-y divide-gray-300">
                                    <div className="flex w-full justify-between items-center space-x-3 pb-2">
                                        <p className="truncate text-sm font-bold text-gray-900">
                                            {t('stasiun')}
                                        </p>
                                        <span className="font-bold mx-1">{stasiun != null ? stasiun.nama : "-"}</span>
                                    </div>
                                    <div className="inline-flex w-full justify-between pt-2 items-center space-x-3">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {t('stok_saat_ini')}
                                        </p>
                                        <span className={stasiun != null && stasiun['stock'] != null && stasiun['stock'] > 0 ? "font-bold mx-1 text-green-500":"font-bold mx-1 text-red-500"}>{stasiun != null && stasiun['stock'] != null ? stasiun['stock'] : "-"} liter</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === Start Body ===*/}
                <div className="bg-red-700">
                <div className="w-full rounded-t-3xl bg-white p-6 flex-auto">
                    <div className="my-6">
                        <button onClick={menuScan} className={menuFuel.includes(AUTH_FUEL_MANAGER) ? "overflow-hidden w-full rounded-2xl bg-indigo-800" : "overflow-hidden w-full rounded-2xl bg-slate-800"}>
                            <div className="flex w-full items-center justify-center text-white px-6 py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                </svg>
                                <p className="ml-4 font-bold ">{t('scan')}</p>
                            </div>
                        </button>
                    </div>
                    <div className="flex-grow border-t border-gray-400 mb-6"></div>

                    <div onClick={() => menuFuel.includes(AUTH_FUEL_MANAGER) ? menuStok : ""} className={menuFuel.includes(AUTH_FUEL_MANAGER) ? "overflow-hidden w-full rounded-2xl bg-white border-2 border-indigo-500" : "overflow-hidden w-full rounded-2xl bg-gray-300 border-2 border-gray-500"}>
                        <div className={menuFuel.includes(AUTH_FUEL_MANAGER) ? "flex w-full text-center font-bold text-indigo-500 px-6 py-4" : "flex w-full text-center text-gray-500 px-6 py-4"}>
                            <p className="w-full text-center">{t('ganti_stok')}</p>
                            <span className="float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden mt-6 w-full rounded-2xl bg-white border-2 border-dashed border-gray-500">
                        <div className="flex w-full text-center text-gray-500 px-6 py-4">
                            <p className="w-full text-center font-bold ">{t('riwayat_stok')} ({t('segera_hadir')})</p>
                            <span className="float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden mt-6 w-full rounded-2xl bg-white border-2 border-dashed border-gray-500">
                        <div className="flex w-full text-center text-gray-500 px-6 py-4">
                            <p className="w-full text-center font-bold ">{t('laporan')} ({t('segera_hadir')})</p>
                            <span className="float-right">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                </div>
                {/* === End Body ===*/}
            </IonContent>
            <BottomNavBar isFuelman={true}/>
        </IonPage>
    );
};

export default FuelmanFuelHome;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

