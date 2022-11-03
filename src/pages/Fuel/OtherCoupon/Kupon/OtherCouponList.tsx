import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';

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
} from "../../../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import { getPref } from "../../../../helper/preferences";


const OtherCouponList: React.FC = () => {
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
        setIsLoaded(false);
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
        history.goBack();
        // history.push("/fuel/homepage");
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
                <div className='bg-white min-h-screen'>

                    <div className='border-b border-gray-300 bg-red-700'>
                        <div className="px-4 py-4">
                            <div className="flex items-center">
                                <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                </svg>
                                <div className="ml-4">
                                    <h3 className="font-bold text-white">Kupon</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start looping kupon */}

                    
                    <div className='w-full'>
                        <div className='p-4 divide-y space-y-4'>
                            <div className='relative h-28 overflow-hidden rounded-lg border border-1 text-center border-gray-200 bg-orange-50 py-4'>
                                <img className='absolute top-0 left-0' src='assets/images/fuel-coupon.png' />
                                <div className='absolute w-full'>
                                    <h3 className='font-black'>Fuel Coupon</h3>
                                    <h3 className='text-lg font-black mt-4'>KMZWA8AWAA</h3>
                                    <p className='text-xs text-gray-500'>lorem ipsum dolor sit amet</p>
                                </div>
                            </div>
                            <div className='relative h-28 overflow-hidden rounded-lg border border-1 text-center border-gray-200 bg-blue-50 py-4'>
                                <img className='absolute top-0 left-0' src='assets/images/other-fuel-coupon.png' />
                                <div className='absolute w-full'>
                                    <h3 className='font-black'>Other Fuel Coupon</h3>
                                    <h3 className='text-lg font-black mt-4'>KMZWA8AWAA</h3>
                                    <p className='text-xs text-gray-500'>lorem ipsum dolor sit amet</p>
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

export default OtherCouponList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

