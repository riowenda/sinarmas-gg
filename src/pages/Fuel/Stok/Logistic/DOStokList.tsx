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
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useState } from "react";
import {
    pref_identity,
    pref_user_role,
    pref_pegawai_id, pref_token, AUTH_FUEL_GA, AUTH_FUEL_FINANCE
} from "../../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import {getFuelMenu, getPref} from "../../../../helper/Preferences";
import ListHeader from "../../../../components/Header/ListHeader";
import {DO} from "../../../../api/PODOFuelAPI/DO";
import moment from "moment";
import skeleton from "../../../../components/Skeleton/Skeleton";
import PStatus from "../../PO/components/PStatus";

const DOStokList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [pegId, setPegId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [role, setRole] = useState();
    const [po, setPo] = useState([]);
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
        setIsLoaded(false);
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_pegawai_id).then(res => { setPegId(res); });
        getFuelMenu().then(menu => {
            let restRole = "";

            if(menu.includes(AUTH_FUEL_GA)){
                restRole = 'GA';
            } else if(menu.includes(AUTH_FUEL_FINANCE)){
                restRole = 'FINANCE';
            }

            // @ts-ignore
            setRole(restRole);
        });
        loadDataPermintaan();
    }

    const loadDataPermintaan = () => {
        let data = DO("list", "").then(result => {
            // console.log(result);
            if(result){
                try {
                    // @ts-ignore
                    let proses = result.filter((x: { [x: string]: { [x: string]: null; }; }) => (x['status'] !== "PROPOSED") && (x['status'] !== "REJECTED"));
                    setPo(proses);
                } catch (error) {

                }
            }
            setIsLoaded(true);
        });
    }

    const btnDetail = (id:any) => {
        history.push({
            pathname: "/fuel/do-stok/detail/" + id,
            state: { detail: id }
        });
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {/* Header */}
            <ListHeader title={t('permintaan.deposit')} isReplace={false} link={""} addButton={false} />
            {/* end Header */}
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white ">
                    {/* === Start List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-3">
                            {isLoaded ?
                                <>
                                    {
                                        po.map((req, index) => {
                                            return (
                                                <div key={req['id']} onClick={event => btnDetail(req["id"])}
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

                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default DOStokList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

