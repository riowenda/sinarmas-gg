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
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI, P2H_LIST_USER_URI, pref_identity, pref_unit, pref_user_id,
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import {getJsonPref, getPref} from "../../../helper/Preferences";
import moment from "moment";
import PStatus from "../PO/components/PStatus";
import ListHeader from "../../../components/Header/ListHeader";
import {BaseAPI} from "../../../api/ApiManager";

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
        getJsonPref(pref_unit).then(res => {
            setUnit(res);
        });

    }
    const loadData = (res: any) => {
        console.log("ini: ", res)
        const url = BaseAPI() + API_URI + P2H_LIST_USER_URI + "/" + res;
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
            <ListHeader title={t('header.daftar_p2h')} isReplace={false} link={"/fuel/p2h/p2hinput"} addButton={true} />
            <div className="top-0 z-10 bg-red-700 ">
                <div className="pb-3 px-1 bg-red-700">
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
                </div>
            </div>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700 ">

                    <div className="bg-white">
                        <div className="px-3 pt-3">
                        {isLoaded ?
                            <>
                                {
                                    items.map((p2h, index) => {
                                        return (
                                            <div onClick={() => btnPilih(p2h['id'])} key={p2h['id']} className="px-4 py-4 my-2 rounded-lg border border-1 border-gray-300">
                                                <div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <p className="font-bold text-gray-900">{p2h['unit']['noPol']} - {p2h['unit']['noLambung']}</p>
                                                            <p className="text-sm text-gray-900">{moment(p2h['tanggal']).format('DD MMM yyyy').toString()}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p className="text-sm text-gray-900">{p2h['unit']['jenisUnit']['name']} - {p2h['unit']['tipeUnit']['name']}</p>
                                                            <PStatus title={p2h['status']} status={p2h['status']}/>
                                                        </div>
                                                    </div>
                                                    <div><p className="text-sm text-gray-900">{p2h['unit']['vendor']['name']}</p></div>
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

