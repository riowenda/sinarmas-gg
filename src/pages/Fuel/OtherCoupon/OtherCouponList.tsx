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

import './OtherCouponList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    pref_identity,
    pref_pegawai_unit_id,
    OTHER_COUPON_URI, OTHER_COUPON_USER_LIST_URI, pref_pegawai_id
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import { getPref } from "../../../helper/Preferences";
import moment from "moment";
import ListHeader from "../../../components/Header/ListHeader";
import PStatus from "../PO/components/PStatus";
import {BaseAPI} from "../../../api/ApiManager";

const OtherCouponList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [pegUnitId, setPegUnitId] = useState();
    const [peg, setPeg] = useState();
    const [identity, setIdentity] = useState<string>();
    const [oriData, setOriData] = useState();
    const location = useLocation();
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
        loadDataPref();
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
        setIsLoaded(false)
        loadDataPermintaan(peg);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res);});
        getPref(pref_pegawai_id).then(res => { setPeg(res); loadDataPermintaan(res)});
    }

    const loadDataPermintaan = (user: any) => {
        const url = BaseAPI() + API_URI + OTHER_COUPON_URI + OTHER_COUPON_USER_LIST_URI + "/" + user;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result.data);
                    let data = result.data;
                    if(data != null && !data.isEmpty){
                        // @ts-ignore
                        let sortByDate = data.map((obj: { tanggalPermintaan: string; }) => {return {...obj, date: new Date(obj.tanggalPermintaan)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
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

    const btnAdd = () => {
        history.push("/fuel/req-other/create-form");
    }

    const btnDetailReqFuel = (id: any, status: any) => {
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

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/homepage");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {/* Header */}
            <ListHeader title={t('header.daftar_fuel_lain')} isReplace={false} link={"/fuel/req-other/create-form"} addButton={true} />
            {/* end Header */}
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700 ">
                    {/* === Start List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-3">
                            {isLoaded ?
                                <>
                            {items != null ? items.map((req, index) => {
                                return (
                                    <div onClick={() => btnDetailReqFuel(req['id'], req['status'])} key={req['id']}
                                        className="px-4 py-4 my-2 rounded-lg border border-1 border-gray-300">
                                        <div>
                                            <div className="flex justify-between">
                                                <p className="font-bold text-gray-900">{req['tujuan']['nama']}</p>
                                                <p className="text-sm text-gray-900">{moment(req['tanggalPermintaan']).format('DD MMM yyyy').toString()}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-900">{req['liter']} liter</p>
                                                <PStatus title={req['status']} status={req['status']}/>
                                            </div>
                                            <div><p className="text-sm text-gray-900">{req['penjaga']['name']}</p></div>
                                        </div>
                                    </div>
                                )
                            }) : ""}
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

                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default OtherCouponList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

