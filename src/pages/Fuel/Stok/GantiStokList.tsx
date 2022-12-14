import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    DO_REQ_LIST_BY_STATION_URI, DO_REQ_URI, pref_fuel_station_id,
    pref_identity,
    pref_user_id
} from "../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import { getPref } from "../../../helper/Preferences";
import ListHeader from "../../../components/Header/ListHeader";
import moment from "moment";
import PStatus from "../PO/components/PStatus";
import {BaseAPI} from "../../../api/ApiManager";

const GantiStokList: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [userId, setUserId] = useState();
    const [stasiunId, setStasiunId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [oriData, setOriData] = useState();
    const [skeleton] = useState(Array(5).fill(0));

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
        setIsLoaded(!isLoaded ? isLoaded : !isLoaded);
        loadDataPermintaan(stasiunId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_user_id).then(res => {
            setUserId(res);
            loadDataPermintaan(res);
        });
        getPref(pref_fuel_station_id).then(res => {
            setStasiunId(res);
            loadDataPermintaan(res);
        })
    }

    const loadDataPermintaan = (stasiun_id: any) => {
        const url = BaseAPI() + API_URI + DO_REQ_URI + DO_REQ_LIST_BY_STATION_URI + "/" + stasiun_id;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result.data);
                    let data = result.data;
                    if(data != null && !data.isEmpty){
                        // @ts-ignore
                        let sortByDate = data.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        // console.log(sortByDate)
                        setOriData(sortByDate);
                        setItems(sortByDate);
                    }
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

    // const btnPilih = (id: any) => {
    //     // console.log(id);
    //     history.push("/fuel/temp-unit/detail/" + id);
    // };

    const btnPilih = (id: any) => {
        history.push({
            pathname: "/fuel/ganti-stok/detail/" + id,
            state: { detail: id }
        });
        console.log('dipilih ',id)
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-gradient-to-r from-red-700 to-red-500">
            <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
                {/* === Start Header ===*/}
                <ListHeader title={t("ganti_stok")} isReplace={false} link={"/fuel/ganti-stok/create"} addButton={true} />
                {/* === End Header ===*/}
                <IonContent className="bg-gradient-to-r from-red-700 to-red-500 bg-danger h-auto">
                    <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <div className="bg-white flex flex-col justify-between">
                        {/* === start form === */}
                        <div>
                            {/* === Start List  === */}
                            <div className="bg-white">
                                <div className="px-3 pt-4">
                                    {isLoaded ?
                                        <>
                                            {
                                                items.map((req, index) => {
                                                    return (
                                                        <div key={req['id']} onClick={event => btnPilih(req["id"])}
                                                             className="px-4 py-4 my-2 rounded-lg border border-1 border-gray-300">
                                                            <div>
                                                                <div className="flex justify-between">
                                                                    <p className='font-bold'>{req['nomor']} - {req['ref']}</p>
                                                                    <p className='text-gray-500'>{moment(req['tanggalRencana']).format('DD MMM yyyy').toString()}</p>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <p className='text-gray-500'>{req['fuelStasiun']['nama']}</p>
                                                                    <PStatus status={req['status']} title={req['status']} />
                                                                </div>
                                                                <div>
                                                                    <p className='text-gray-500'>{req['jumlahRencana']} liter</p>
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
                                                                <div className="flex justify-between text-sm">
                                                                    <div className="w-32">
                                                                        <IonSkeletonText animated style={{ width: '50%' }} />
                                                                        <IonSkeletonText animated style={{ width: '70%' }} />
                                                                        <IonSkeletonText animated style={{ width: '100%' }} />
                                                                    </div>
                                                                    <div className="w-20 text-end">
                                                                        <IonSkeletonText animated style={{ width: '100%' }} />
                                                                        <IonSkeletonText animated style={{ width: '70%' }} />
                                                                        <IonSkeletonText animated style={{ width: '50%' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                            {/* === End List === */}
                        </div>
                        {/* === End Body ===*/}
                    </div>
                </IonContent>
            </IonPage>
        </div>
    );
};

export default GantiStokList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

