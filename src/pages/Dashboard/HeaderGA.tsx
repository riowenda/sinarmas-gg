import './HeaderGA.css';
import React, { useEffect, useState } from "react";
import { useTranslation,} from "react-i18next";
import "../../components/Translate";
import {useHistory, useLocation} from "react-router-dom";
import { getJsonPref } from "../../helper/preferences";
import {pref_json_pegawai_info_login, pref_unit} from "../../constant/Index";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import {useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react";

const userInfo = { name: "", nik: "", email: "", imageUrl: "" }
const userUnit = {id:"", noPol: "", noLambung:"", vendor:{name:""}, jenisUnit:{name:""}};

const HeaderGA: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);

    const { t } = useTranslation();

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

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
    }
    const listNotifikasi = () => {
        history.push("/notifikasi");
    };

    return (
        <>
            {/*{unit != null &&
                <div className="px-6">
                    <div className="flex w-full items-center justify-between space-x-6">
                        <div className="flex-1 truncate">
                            <div className="items-center space-x-3">
                                <h3 className="truncate text-base font-bold text-white">{user['name']}</h3>
                            </div>
                            <div className="text-white font-semibold">
                                <span className="text-yellow-300">{user['nik']}</span>
                            </div>
                            <div className="text-white text-sm">{user['email']}</div>
                        </div>
                    </div>
                </div>
            }
            <div className="px-6 py-2"></div>*/}
            <div className="divide-y divider-white p-6">
                <div className="flex w-full items-center justify-between space-x-6 mb-5">
                    <img className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                         src={user['imageUrl'] ? user['imageUrl'] : "./assets/images/anonymous male.svg"} alt="" />
                    <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                            <h3 className="truncate text-lg font-bold text-white">{user['name']}</h3>
                        </div>
                        <div className="flex items-center space-x-3">
                            <p className="truncate font-semibold text-lg text-white">{user['nik']}</p>
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

            {/*<div className="px-6 py-6">
                <div className="grid grid-cols-3 gap-4">
                    <button onClick={btnUnit} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold">
                        Unit
                    </button>
                    <button onClick={btnP2H} className="text-center items-center rounded-lg bg-white px-2.5 py-3 text-xs font-bold">
                        P2H
                    </button>
                </div>
            </div>*/}
        </>
    );
};

export default HeaderGA;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

