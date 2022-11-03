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
    pref_pegawai_id, pref_token
} from "../../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import { getPref } from "../../../../helper/preferences";
import ListHeader from "../../../../components/Header/ListHeader";
import {PO} from "../../../../api/PODOFuelAPI/PO";
import moment from "moment";
import skeleton from "../../../../components/Skeleton/Skeleton";
import PStatus from "../components/PStatus";

const POFuelList: React.FC = () => {
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
        getPref(pref_user_role).then(restRole => {
            setRole(restRole);
        });
        getPref(pref_token).then(res => {
            loadDataPermintaan(res);
        });
    }

    const loadDataPermintaan = (token: any) => {
        let data = PO(token, "list", "").then(result => {
            // console.log(result);
            if(result){
                try {
                    let data = result.filter((x: { [x: string]: { [x: string]: null; }; }) => (x['fuelStasiun'] !== null && x['vendor'] !== null && x['nomor'] !== null));
                    setPo(data);
                } catch (error) {

                }
            }
            setIsLoaded(true);
        });
    }

    const btnDetail = (id:any) => {
        history.push({
            pathname: "/fuel/po/detail/" + id,
            state: { detail: id }
        });
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
                <div className="bg-white ">
                    {/* Header */}
                    <ListHeader title={"Daftar PO"} isReplace={false} link={""} addButton={false} />
                    {/* end Header */}

                    {/* === Start List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-4">
                            {isLoaded ?
                                <>
                                    {
                                        po.map((req, index) => {
                                            return (
                                                <div key={req['id']} onClick={event => btnDetail(req["id"])}
                                                     className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">

                                                    <div className="flex justify-between text-sm">
                                                        <div className="w-full">
                                                            <p className='font-bold'>{req['nomor'] !== "" ? req['nomor'] : "-"}</p>
                                                            <p className='text-gray-500'>{req['fuelStasiun']['nama']}</p>
                                                            <p className='text-gray-500'>{req['vendor']['name']}</p>
                                                        </div>
                                                        <div className="w-1/4 text-end">
                                                            <PStatus status={req['status']} title={req['status']} />
                                                            <p className='text-gray-500'>{req['jumlah']} liter</p>
                                                            <p className='text-gray-500'>{moment(req['tanggal']).format('DD MMM yyyy').toString()}</p>
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

export default POFuelList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

