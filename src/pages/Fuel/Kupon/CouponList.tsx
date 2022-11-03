import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
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
    TAKEOVER_ALL_USER_URI, pref_pegawai_unit_id, pref_token, pref_pegawai_id
} from "../../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import { getPref } from "../../../helper/preferences";
import ListHeader from "../../../components/Header/ListHeader";
import {DivisiListModalAPI} from "../../../api/MDForFuel/DivisiList";
import {FuelCouponList} from "../../../api/KuponAPI/FuelCouponList";
import {OtherCouponList} from "../../../api/KuponAPI/OtherCouponList";
import moment from "moment";
import SkeletonDetail from "../../Layout/SkeletonDetail";


const CouponList: React.FC = () => {
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
    const [fuel, setFuel] = useState(null);
    const [otherFuel, setOtherFuel] = useState<any[]>([]);

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        setIsLoaded(false)
        loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

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
        loadData()
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

    const loadData = () => {
        getPref(pref_token).then(r => {
            getPref(pref_pegawai_unit_id).then(res => {
                FuelCouponList(r, res).then((data) => {
                    if(data.status === "SUCCESS" && data.message === ""){
                        let fuel = data.data;
                        if(fuel['status'] !== 'PROPOSED' && fuel['status'] !== 'APPROVED') {
                            setFuel(data.data);
                        }
                    }
                });
            } );
            getPref(pref_pegawai_id).then(res => {
                OtherCouponList(r, res).then((data) => {
                    if(data.status === "SUCCESS" && data.message === "") {
                        let other = data.data;
                        // @ts-ignore
                        let req = other.filter((x: { [x: string]: { [x: string]: null; }; }) => (x["status"] !== "PROPOSED" && x["status"] !== "APPROVED"));
                        // @ts-ignore
                        let sortByDate = req.map((obj: { tanggalPermintaan: string; }) => {return {...obj, date: new Date(obj.tanggalPermintaan)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);

                        setOtherFuel(sortByDate);
                        setIsLoaded(true);
                    }
                });
            });
        });

        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
    }

    const btnDetailReqFuel = (id: any, status: any) => {
        let path = "";
        if(status === "PROPOSED" || status === "CANCELED" || status === "REJECTED" || status === "APPROVED"){
            path = "/fuel/req-fuel/detail/";
        } else {
            path = "/fuel/kupon/detail-fuel/";
        }
        history.push({
            pathname: path + id,
            state: { detail: id }
        });
    }

    const btnDetailReqOther = (id: any, status: any) => {
        let path = "";
        if(status === "PROPOSED" || status === "CANCELED" || status === "REJECTED" || status === "APPROVED"){
            path = "/fuel/req-other/detail/";
        } else {
            path = "/fuel/kupon/detail-other/";
        }
        history.push({
            pathname: path + id,
            state: { detail: id }
        });
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {isLoaded ?
                <>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className='bg-white min-h-screen'>

                    {/* Header */}
                    <ListHeader title={"KuponAPI"} isReplace={false} link={""} addButton={false} />
                    {/* end Header */}

                    {/* Start looping kupon */}

                    <div className='w-full'>
                        <div className='p-4 divide-y space-y-4'>
                            {(fuel != null || otherFuel.length > 0) ?
                                <>
                                    {fuel != null &&
                                        <div onClick={event => btnDetailReqFuel(fuel['id'],fuel['status'])} className='relative h-28 overflow-hidden rounded-lg border border-1 text-center border-gray-200 bg-orange-50 py-4'>
                                            <img className='absolute top-0 left-0' src='assets/images/fuel-coupon.png'/>
                                            <div className='absolute w-full'>
                                                <h3 className='font-black'>Fuel Coupon</h3>
                                                <h3 className='text-lg font-black mt-4'>{fuel['nomor']}</h3>
                                                <p className='text-xs text-gray-500'>{fuel["pegawaiUnit"]["unit"]["noPol"]} - {moment(fuel["tanggal"]).format('DD MMM yyyy').toString()}</p>
                                            </div>
                                        </div>
                                    }
                                    {otherFuel.map((req, index) => {
                                        return (
                                            <div key={req['id']} onClick={event => btnDetailReqOther(req['id'],req['status'])} className='relative h-28 overflow-hidden rounded-lg border border-1 text-center border-gray-200 bg-blue-50 py-4'>
                                                <img className='absolute top-0 left-0'
                                                     src='assets/images/other-fuel-coupon.png'/>
                                                <div className='absolute w-full'>
                                                    <h3 className='font-black'>Other Fuel Coupon</h3>
                                                    <h3 className='text-lg font-black mt-4'>{req['nomor']}</h3>
                                                    <p className='text-xs text-gray-500'>{req['tujuan']['nama']} - {moment(req['tanggalPermintaan']).format('DD MMM yyyy').toString()}</p>
                                                </div>
                                            </div>
                                        )})
                                    }
                                </>
                                :
                                <>
                                </>
                            }
                        </div>
                    </div>
                    {/* End looping notif */}
                </div>
            </IonContent>
                </> : <>
                    {
                        <SkeletonDetail />
                    }
                </>}
        </IonPage>
    );
};

export default CouponList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

