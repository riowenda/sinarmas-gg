import {
    IonBackButton,
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    useIonToast,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import './PermintaanUnitList.css';
import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {
    API_URI,
    BASE_API_URL, pref_identity, pref_user_id, TAKEOVER_GET_ALL_REQUEST_USER_URI, TAKEOVER_UNIT_URI,
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import {getPref} from "../../../helper/preferences";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import ListHeader from "../../../components/Header/ListHeader";
import moment from "moment";

const PermintaanUnitList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [toast] = useIonToast();
    const {t} = useTranslation();
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const location = useLocation();
    const [oriData, setOriData] = useState();
    const [skeleton] = useState(Array(5).fill(0));

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        console.log("Permintaan unit list");
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        console.log("Permintaan unit list");
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
        setIsLoaded(false);
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => {setIdentity(res)});
        getPref(pref_user_id).then(res => {
            setUserId(res);
            loadDataPermintaan(res);
        } );
    }

    const loadDataPermintaan = (user : any) => {
        const url = BASE_API_URL + API_URI +TAKEOVER_UNIT_URI+ TAKEOVER_GET_ALL_REQUEST_USER_URI+"/"+user;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let data = result.data;
                    if(data != null && !data.isEmpty){
                        // @ts-ignore
                        let sortByDate = data.map((obj: { requestDate: string; }) => {return {...obj, date: new Date(obj.requestDate)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
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
                    toast( {
                            message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    }

    const btnPilih = (id : any) => {
        // console.log(id);
        history.push({
            pathname: "/fuel/unit/detail/" + id,
            state: { detail: id }
        });
    };

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/homepage");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-gradient-to-r from-red-700 to-red-500">
            <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
                <IonContent fullscreen className="bg-gradient-to-r from-red-700 to-red-500 bg-danger h-auto">
                    <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <div className="bg-white flex flex-col min-h-screen justify-between">
                        {/* === start form === */}
                        <div>
                            {/* === Start Header ===*/}
                            <ListHeader title={"Daftar Permintaan Ganti Unit"} isReplace={false} link={""} addButton={false} />
                            {/* === End Header ===*/}


                            {/* === Start List  === */}
                            <div className="bg-white ">
                                <div className="px-3 pt-4">
                                    {isLoaded ?
                                        <>
                                    {items.map((req, index) => {
                                        return (
                                            <div onClick={() => btnPilih(req['id'])} key={req['id']}
                                                 className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <p className="font-bold">{req['pegawaiUnit']['unit']['noLambung']}</p>
                                                        { req['status'] === 'PROPOSED' &&
                                                            <p className="inline-flex text-sm font-semibold text-blue-600">
                                                                {req['status']}
                                                            </p>
                                                        }
                                                        { req['status'] === 'REJECTED' &&
                                                            <p className="inline-flex text-sm font-semibold text-red-600">
                                                                {req['status']}
                                                            </p>
                                                        }
                                                        { req['status'] === 'APPROVED' &&
                                                            <p className="inline-flex text-sm font-semibold text-green-600">
                                                                {req['status']}
                                                            </p>
                                                        }
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm text-gray-500">{req['pegawaiUnit']['unit']['jenisUnit']['name']} - {req['pegawaiUnit']['unit']['noPol']}</p>
                                                        {/*<span className="text-green-600 font-bold">APPROVED</span>*/}
                                                        <p className="text-sm text-gray-900">{moment(req['requestDate']).format('DD MMM yyyy').toString()}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{req['pegawaiUnit']['unit']['vendor']['name']}</p>
                                                    {(req['keterangan'] !== null && req['keterangan'] !== '') &&
                                                        <div className="mt-2 sm:flex sm:justify-between">
                                                            <div className="sm:flex">
                                                                <p className="flex items-center italic text-sm text-black-50">
                                                                    {req['keterangan']}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
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
                            {/* === End List === */}
                        </div>
                        {/* === End Body ===*/}
                    </div>
                </IonContent>
            </IonPage>
        </div>
    );
};

export default PermintaanUnitList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

