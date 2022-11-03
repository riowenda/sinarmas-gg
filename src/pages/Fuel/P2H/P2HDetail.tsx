import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonAlert,
    useIonLoading,
    useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave
} from '@ionic/react';

import './P2HDetail.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    P2H_ITEM_URI, P2H_CRUD_URI, pref_json_pegawai_info_login, pref_unit
} from "../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getJsonPref } from "../../../helper/preferences";
import UserCardWithUnit from "../../Layout/UserCardWithUnit";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from '../../../components/Header/DetailHeader';

const Identity = "f8c3ca0e-f2e4-4cbd-9a48-e5f9905f420b";
const rHeader = { 'Content-Type': 'application/json', 'Identity': Identity }
const userInfo = { name: "", nik: "", foto: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" }, listKomentar: [] };

const P2HDetail: React.FC = () => {
    const [getId, setGetId] = useState<any[]>([])
    const history = useHistory()
    const [error, setError] = useState(null)
    const [presentAlert] = useIonAlert()
    const [showSuccess] = useIonAlert()
    const [present, dismiss] = useIonLoading()
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState<any[]>([])
    const [contents_, setContents_] = useState<any[]>([])
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [status, setStatus] = useState();
    const [listKomentar, setListKomentar] = useState<any[]>([]);

    const { t } = useTranslation()
    const id = useParams<any[]>();
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
        // loadData()
        loadDataBeforeComplete();
    });

    /* Proses animasi akan dimulai saat akan meninggalkan halaman
    disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
    useIonViewWillLeave(() => {
        setIsLoaded(false);
    });

    /* Proses transisi ke halaman berikutnya
    tidak cocok untuk beberapa logic yang butuh waktu */
    useIonViewDidLeave(() => {
    });
    /* END LIFECYCLE APPS */

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        setIsLoaded(false);
        loadDataBeforeComplete();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        // getJsonPref(pref_unit).then(rest => {
        //     setUnit(rest);
        // });
    }

    const loadDataBeforeComplete = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;

        loadData(dataId);
    };

    const loadData = (dataId: any) => {
        loadDataPref();
        // @ts-ignore
        setGetId(dataId);
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + P2H_CRUD_URI + "/" + dataId;
        const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        console.log("URL: " + url);
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log("OK: " + result['data']);
                    setItems(result['data']);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("cek status: ", result);
                    //console.log("Contents: ", result['data']['data']);
                    setContents_(result['data']['data']);
                    setStatus(result['data']['status']);
                    setListKomentar(result['data']['komentar']);
                    setUnit(result['data']['unit']);
                    /*console.log("content", contents_)
                    //console.log(contents_.filter(x => x['konten_id'] === '73265440-01a2-42cd-90d8-c2c65cd7b9d2')[0]['nilai'])
                    console.log('kon', items)*/
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/p2h/p2hlist")
    }


    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>
            {isLoaded ?
                <>
                    <IonContent fullscreen>
                        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                            <IonRefresherContent></IonRefresherContent>
                        </IonRefresher>
                        <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                            {/* === Start Content  === */}
                            <div>
                                <DetailHeader title='P2H' link='/fuel/p2h/p2hlist' approval={status}></DetailHeader>

                                <UserCardWithUnit name={user.name} nik={user.nik} noLambung={unit.noLambung} noPol={unit.noPol} foto={user.foto}></UserCardWithUnit>

                                <div className="p-6 bg-white mt-4">
                                    {items.map((p2h, index) => {
                                        return (

                                            <div key={p2h['id']}>
                                                <div className="px-2 py-2 p-2 text-sm mt-2">
                                                    <h3 className="text-md font-bold text-gray-900 pb-2">{p2h['judul']}</h3>
                                                    <p className="text-justify">{p2h['keterangan']}</p>
                                                    {p2h['konten'].map((contents: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; }, index: any) => {
                                                        return (
                                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                                <div className="inline-flex items-center text-gray-900">
                                                                    {contents['konten']}
                                                                </div>
                                                                <div className="whitespace-nowrap px-3 py-1 text-sm text-indigo-600">
                                                                    <input type="checkbox" readOnly className="h-4 w-4 rounded" name={'' + contents['id']} id={'' + contents['id']} checked={contents_.filter(x => x['konten_id'] === contents['id'])[0] === undefined ? false : contents_.filter(x => x['konten_id'] === contents['id'])[0]['nilai']} />
                                                                    <label className="ml-2 text-gray-500"> Ya</label>
                                                                    <input type="checkbox" readOnly className="h-4 w-4 ml-4 rounded" name={'' + contents['id']} id={'' + contents['id']} checked={contents_.filter(x => x['konten_id'] === contents['id'])[0] === undefined ? true : !contents_.filter(x => x['konten_id'] === contents['id'])[0]['nilai']} />
                                                                    <label className="ml-2 text-gray-500"> Tidak</label>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="pb-1 text-sm border-b">&nbsp;</div>
                                            </div>

                                        )
                                    })}

                                    {status !== 'PROPOSED' &&

                                        <div className="mt-4 text-sm text-gray-900">
                                            <label htmlFor='odometer' className="block text-sm text-gray-400">
                                                Alasan disetujui/tolak
                                            </label>
                                            {listKomentar !== null ? listKomentar.map((object, i) =>
                                                <div className='flex'>
                                                    <span className='font-bold'>
                                                        {object['status']}
                                                    </span>
                                                    <span className='ml-4'>
                                                        {object['komentar']}
                                                    </span>
                                                </div>
                                            ) : <div className='flex'></div>}
                                        </div>
                                    }
                                </div>

                            </div>
                            {/* === End Content === */}

                            {/* === Footer button ===*/}
                            {/*<div className='py-6 grid grid-cols-2 bg-white'>
                        <div className="pl-6 pr-3">
                            <button onClick={handleTolak} className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                TOLAK
                            </button>
                        </div>
                        <div onClick={handleSetuju} className="pl-3 pr-6">
                            <button className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                DISETUJUI
                            </button>
                        </div>
                    </div>*/}
                        </div>
                        {/*<div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                </div>*/}
                    </IonContent>
                </>
                : <>
                    {
                        <SkeletonDetail />
                    }

                </>}
        </IonPage>
    );
};

export default P2HDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

