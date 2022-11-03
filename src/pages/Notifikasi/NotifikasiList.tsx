import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';

import './NotifikasiList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
    API_URI,
    AUTH_URI,
    BASE_API_URL,
    P2H_ITEM_URI,
    P2H_CRUD_URI,
    TAKEOVER_UNIT_URI,
    TAKEOVER_GET_ALL_REQUEST_USER_URI,
    pref_identity,
    pref_user_id,
    TAKEOVER_ALL_USER_URI
} from "../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import { getPref } from "../../helper/preferences";
import ListHeader from "../../components/Header/ListHeader";

const NotifikasiList: React.FC = () => {
    const [paramId, setParamId] = useState(null)
    const history = useHistory()
    //setGetId(history['location']['state']['id'])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState<any[]>([])
    const id = useParams<any[]>();
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const { t } = useTranslation()

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    useEffect(() => {
        // @ts-ignore
        const dataId = id['id'];
        setParamId(dataId);
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_user_id).then(res => {
            setUserId(res);
            loadDataPermintaan(res);
        });

    }, [])

    const loadDataPermintaan = (user: any) => {
        const url = BASE_API_URL + API_URI + TAKEOVER_UNIT_URI + TAKEOVER_ALL_USER_URI + "/" + user;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result.data);
                    setItems(result.data);
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

    const btnPilih = (data: any) => {
        // console.log(id);
        history.push("/fuel/unit/approvemen-detail/" + data['id']);
    };

    const btnBack = () => {
        // history.goBack();
        history.push("/dashboard");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white min-h-screen">
                    <div className='border-b border-gray-300'>
                        {/* Header */}
                        <ListHeader title={"Notifikasi"} isReplace={false} link={""} addButton={false} />
                        {/* end Header */}
                    </div>
                    {/* TODO tambah icon */}

                    {/* Start looping notifikasi */}

                    {/* Notif belum dibaca */}
                    <div className='bg-gray-100'>
                        <div className="px-6">
                            <div className='flex'>
                                <div className='py-2'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                        />
                                    </svg>
                                </div>
                                <div className='flex justify-between w-full ml-4 border-b border-gray-300 items-center'>
                                    <div className='py-2'>
                                        <p className='text-xs text-gray-500'>Fuel</p>
                                        <p className='font-bold'>Permintaan fuel dari Asep Abdul</p>
                                        <p className='text-xs text-gray-500'>1 Jan 2022</p>
                                    </div>
                                    <div className='rounded-full p-1.5 bg-red-700'/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notif sudah dibaca */}
                    <div className='bg-white'>
                        <div className="px-6">
                            <div className='flex'>
                                <div className='py-2'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                        />
                                    </svg>
                                </div>
                                <div className='w-full ml-4 border-b border-gray-300'>
                                    <div className='py-2'>
                                        <p className='text-xs text-gray-500'>Fuel</p>
                                        <p className='font-bold'>Permintaan fuel dari Asep Abdul</p>
                                        <p className='text-xs text-gray-500'>1 Jan 2022</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* End looping notif */}

                </div>

            </IonContent>
        </IonPage>
    );
};

export default NotifikasiList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

