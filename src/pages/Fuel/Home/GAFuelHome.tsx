import {
    IonBadge,
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';

import './GAFuelHome.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, withTranslation, Trans, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    P2H_LIST_GA_URI,
    TEMP_UNIT_ALL_GA_URI,
    pref_json_pegawai_info_login,
    TEMP_UNIT_URI,
    TAKEOVER_ALL_GA_URI,
    pref_user_role,
    FUEL_REQ_UNIT_URI,
    FUEL_REQ_FINANCE_LIST_URI,
    FUEL_REQ_GA_LIST_URI,
    OTHER_COUPON_URI,
    OTHER_COUPON_GA_LIST_URI,
    OTHER_COUPON_FINANCE_LIST_URI
} from "../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import { getJsonPref, getPref } from "../../../helper/preferences";
import HeaderGA from "../../Dashboard/HeaderGA";
import i18n from "i18next";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import ListHeader from "../../../components/Header/ListHeader";

const user = { name: "", nik: "", imageUrl: "" }
const GAFuelHome: React.FC = () => {
    const changeLanguage = (lng: string | undefined) => {
        i18n.changeLanguage(lng);
    };
    const { t } = useTranslation();
    const history = useHistory();
    const [pegawai, setPegawai] = useState(user);
    const [countP2H, setCountP2H] = useState<number>(0);
    const [countGantiUnit, setCountGantiUnit] = useState<number>(0);
    const [countTempUnit, setCountTempUnit] = useState<number>(0);
    const [countFuelUnit, setCountFuelUnit] = useState<number>(0);
    const [countFuelNonUnit, setCountFuelNonUnit] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
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
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
        });
        getPref(pref_user_role).then(restRole => {
            setRole(restRole);
            if (restRole === 'GA') {
                loadDataP2H();
                loadDataTempUnit();
                loadDataGantiUnit();
            }
            loadDataFuelUnit(restRole);
            loadDataFuelNonUnit(restRole);
        });
    }

    const loadDataGantiUnit = () => {
        const url = BASE_API_URL + API_URI + TAKEOVER_ALL_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log("Ganti Unit: ", result.status);
                    if (result.status === 'SUCCESS') {
                        let res = result.data;
                        // @ts-ignore
                        setCountGantiUnit((res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'PROPOSED')).length);
                        setIsLoaded(true);
                    } else {
                        // @ts-ignore
                        setCountGantiUnit(0);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                }
            )
    }
    const loadDataP2H = () => {
        const url = BASE_API_URL + API_URI + P2H_LIST_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log("P2H: ", result.status);
                    if (result != null && !result.isEmpty) {
                        let res = result;
                    //setItems(result.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null));
                        // @ts-ignore
                        setCountP2H((res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'PROPOSED')).length);
                        setIsLoaded(true);
                    }else{
                        setIsLoaded(true);
                        // @ts-ignore
                        setCountP2H(0);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                }
            )
    }

    const loadDataTempUnit = () => {
        const url = BASE_API_URL + API_URI + TEMP_UNIT_URI + TEMP_UNIT_ALL_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        let res = result.data;
                        // @ts-ignore
                        let data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'PROPOSED');
                        setCountTempUnit(data.length);
                        setIsLoaded(true);
                        // console.log(data.length)
                    } else {
                        // @ts-ignore
                        setCountTempUnit(0);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                }
            )
    }

    const loadDataFuelUnit = (role: any) => {
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + (role === "GA" ? FUEL_REQ_GA_LIST_URI : FUEL_REQ_FINANCE_LIST_URI);
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        let res = result.data;
                        let data = null;
                        if (role === "GA") {
                            // @ts-ignore
                            data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'PROPOSED');
                        } else {
                            // @ts-ignore
                            data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == "APPROVED");
                        }
                        setCountFuelUnit(data.length);
                        setIsLoaded(true);
                        // console.log(data.length)
                    } else {
                        // @ts-ignore
                        setCountFuelUnit(0);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                }
            )
    }

    const loadDataFuelNonUnit = (role: any) => {
        const url = BASE_API_URL + API_URI + OTHER_COUPON_URI + (role === "GA" ? OTHER_COUPON_GA_LIST_URI : OTHER_COUPON_FINANCE_LIST_URI);
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        let res = result.data;
                        let data = null;
                        if (role === "GA") {
                            // @ts-ignore
                            data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'PROPOSED');
                        } else {
                            // @ts-ignore
                            data = res.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == "APPROVED");
                        }
                        setCountFuelNonUnit(data.length);
                        setIsLoaded(true);
                        // console.log(data.length)
                    } else {
                        // @ts-ignore
                        setCountFuelNonUnit(0);
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setIsLoaded(true);
                }
            )
    }

    const btnDaftarPermintaanUnitSementara = () => {
        history.push("/fuel/temp-unit/ga-daftar-permintaan");
    };
    const btnDaftarPermintaanP2H = () => {
        history.push("/fuel/p2h/gap2hlist");
    };
    const btnDaftarPermintaanGantiUnit = () => {
        history.push("/fuel/ga/unit/daftar-permintaan");
    };
    const btnListReqFuel = () => {
        if (role === "GA") {
            history.push("/fuel/req-fuel/ga-daftar-permintaan");
        } else if (role === "FINANCE") {
            history.push("/fuel/req-fuel/finance-daftar-permintaan");
        }
    };
    const btnListNonFuel = () => {
        if (role === "GA") {
            history.push("/fuel/req-other/ga-daftar-permintaan");
        } else if (role === "FINANCE") {
            history.push("/fuel/req-other/finance-daftar-permintaan");
        }
    };

    const btnListPO = () => {
        // history.goBack();
        history.push("/fuel/po");
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/dashboard");
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="bg-red-700">
                    {/* Header */}
                    <ListHeader title={"Permintaan Unit dan Bahan Bakar"} isReplace={false} link={""} addButton={false} />
                    {/* end Header */}

                    <div className="bg-white px-2">
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
                            <div className="grid grid-cols-1 gap-4 pt-6">
                                <div onClick={btnListReqFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                    {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-unit-icon.png' />
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">{t("Bahan Bakar Unit")}</p>
                                            {countFuelUnit > 0 ?
                                                <p className="text-sm text-green-600">{countFuelUnit} permintaan baru</p>
                                                :
                                                <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>
                                            }
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <div onClick={btnListNonFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                    {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-non-unit-icon.png' />
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">Bahan Bakar Non-Unit</p>
                                            {countFuelNonUnit > 0 ?
                                                <p className="text-sm text-green-600">{countFuelNonUnit} permintaan baru</p>
                                                :
                                                <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>
                                            }
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {role == 'GA' ?
                                    <><div onClick={btnDaftarPermintaanUnitSementara} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                        {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg> */}
                                        <img className="w-6 ml-2 mr-4" src='assets/icon/temporary-unit-icon.png' />
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="font-bold">Unit Sementara</p>
                                                {countTempUnit > 0 ?
                                                    <p className="text-sm text-green-600">{countTempUnit} permintaan baru</p>
                                                    :
                                                    <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>
                                                }
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                        <div onClick={btnDaftarPermintaanGantiUnit} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                            {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg> */}
                                            <img className="w-6 ml-2 mr-4" src='assets/icon/change-unit-icon.png' />
                                            <div className="flex justify-between w-full items-center">
                                                <div>
                                                    <p className="font-bold">Ganti Unit</p>
                                                    {countGantiUnit > 0 ?
                                                        <p className="text-sm text-green-600">{countGantiUnit} permintaan baru</p>
                                                        :
                                                        <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>
                                                    }
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div onClick={btnDaftarPermintaanP2H} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                            {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg> */}
                                            <img className="h-6 ml-2 mr-4" src='assets/icon/p2h-icon.png' />
                                            <div className="flex justify-between w-full items-center">
                                                <div>
                                                    <p className="font-bold">P2H</p>
                                                    {countP2H > 0 ?
                                                        <p className="text-sm text-green-600">{countP2H} permintaan baru</p>
                                                        :
                                                        <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>
                                                    }
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </>
                                    : null}
                                    <div onClick={btnListPO} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                    {/* <svg className="w-12 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> */}
                                    {/* <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-unit-icon.png' /> */}
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            <p className="font-bold">{t("PO")}</p>
                                            {/*{countFuelNonUnit > 0 ?*/}
                                            {/*    <p className="text-sm text-green-600">{countFuelNonUnit} permintaan baru</p>*/}
                                            {/*    :*/}
                                            {/*    <p className="text-sm text-gray-600">Tidak ada permintaan baru</p>*/}
                                            {/*}*/}
                                            <p className="text-sm text-green-600">xx permintaan baru</p>
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

export default GAFuelHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

