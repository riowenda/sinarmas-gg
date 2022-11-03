import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave, useIonViewDidLeave, IonSkeletonText
} from '@ionic/react';

import './P2HList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
    API_URI,
    AUTH_URI,
    BASE_API_URL,
    LOGIN_ISAFE_URI,
    LOGIN_URI, P2H_LIST_GA_URI,
    P2H_LIST_USER_URI, pref_identity, pref_unit, pref_user_id, UNIT_CRUD_URI,
    UNIT_LIST_URI, UNIT_VIEWS_URI
} from "../../../constant/Index";
import axios from "axios";
import {useHistory, useLocation} from "react-router-dom";
import { getPref } from "../../../helper/preferences";
import moment from "moment";
import HeaderUser from "../../Dashboard/HeaderUser";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

const P2HList: React.FC = () => {
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [unit, setUnit] = useState();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const history = useHistory();
    const { t } = useTranslation();
    const now = new Date;
    const [oriData, setOriData] = useState();
    const until = new Date(now.getFullYear() + 10, now.getMonth());
    const location = useLocation();

    const [skeleton] = useState(Array(10).fill(0));

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
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
            loadData(res);
        });
        getPref(pref_unit).then(res => {
            setUnit(res);
        });

    }
    const loadData = (res: any) => {
        console.log("ini: ", res)
        const url = BASE_API_URL + API_URI + P2H_LIST_USER_URI + "/" + res;
        console.log("url: ", url)
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
                /*"Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"*/
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // @ts-ignore
                    let sortByDate = result.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                    // console.log(sortByDate)
                    let filter = sortByDate.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null);
                    //console.log("hasil: ", result);
                    setItems(filter);
                    setOriData(sortByDate);
                    //console.log("URL hasil: ", url);
                    setIsLoaded(true);

                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        setIsLoaded(false)
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    // const btnPilih = (p2h: any) => {
    //     history.push("/fuel/p2h/p2hdetail/" + p2h['id']);
    // };

    const btnPilih = (id: any) => {
        // history.push("/fuel/p2h/gap2hdetail/" + id);
        history.push({
            pathname: "/fuel/p2h/p2hdetail/" + id,
            state: { detail: id }
          });
        // console.log('dipilih ',)
    };

    const btnInput = () => {
        history.push("/fuel/p2h/p2hinput");
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>


                <div className="bg-red-700">
                    <HeaderUser link={"/fuel/homepage"} />
                    <div className="bg-white rounded-t-3xl p-2 ">

                        <div className="px-4 py-4">

                            <div className="flex pb-4 justify-between">
                                <h3 className="font-bold py-2">Daftar P2H</h3>
                                <button onClick={btnInput} className="text-sm font-bold py-2 text-red-700">Tambah baru</button>
                            </div>
                            {isLoaded ?
                                <>
                                    {
                                        items.map((p2h, index) => {
                                            return (
                                                <div onClick={() => btnPilih(p2h['id'])} key={p2h['id']} className="rounded-lg py-1 mb-3 border border-1 border-gray-200">
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
                                                                    <p className="text-base font-bold text-gray-900">{p2h['unit']['noPol']} - {p2h['unit']['noLambung']}</p>
                                                                    <p className="text-sm text-gray-900">{p2h['unit']['jenisUnit']['name']} - {p2h['unit']['tipeUnit']['name']}</p>
                                                                    <p className="text-sm text-gray-900">{p2h['unit']['vendor']['name']}</p>
                                                                </div>
                                                                <div className="whitespace-nowrap text-center text-sm text-gray-500">

                                                                    <p className="text-sm text-gray-900">{moment(p2h['tanggal']).format('DD MMM yyyy').toString()}</p>
                                                                    {p2h['status'] === 'PROPOSED' &&
                                                                        <span className="text-blue-600 font-bold">{p2h['status']}</span>
                                                                    }
                                                                    {p2h['status'] === 'REJECTED' &&
                                                                        <span className="text-red-600 font-bold">{p2h['status']}</span>
                                                                    }
                                                                    {p2h['status'] === 'APPROVED' &&
                                                                        <span className="text-green-600 font-bold">{p2h['status']}</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </> :
                                <>
                                    {
                                        skeleton.map((index) => {
                                            return (
                                                <div
                                                    className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <IonSkeletonText animated style={{ width: '20%' }} />
                                                            <IonSkeletonText animated style={{ width: '30%' }} />
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <IonSkeletonText animated style={{ width: '40%' }} />
                                                        </div>
                                                        <IonSkeletonText animated style={{ width: '60%' }} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            }
                        </div>


                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default P2HList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

