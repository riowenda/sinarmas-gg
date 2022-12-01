import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonThumbnail,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';

import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, {useState } from "react";
import {
    pref_identity, pref_pegawai_id, pref_token,
    pref_user_id
} from "../../../constant/Index";
import { useHistory} from "react-router-dom";
import { getPref } from "../../../helper/Preferences";
import ListHeader from "../../../components/Header/ListHeader";
import {UnitRiwayatByUser} from "../../../api/UnitAPI";

const RiwayatUnitList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [skeleton] = useState(Array(10).fill(0));
    const [token, setToken] = useState("");
    const [pegId, setPegId] = useState("");

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
        // console.log("daftar unit");
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
        loadData(pegId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res)
        });
        getPref(pref_token).then(t => {
            setToken(t);
        });

        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
            loadData(res);
        })
    }

    const loadData = (p: string) => {
        UnitRiwayatByUser(p).then((data) => {
            // console.log(data);
            if (data.status === "SUCCESS" && (data.message === "" || data.message == null)) {
                setItems(data.data);
            }
            setIsLoaded(true);
        });
    }


    const btnPilih = (unit: any) => {
        // console.log(unit);
        // presentAlert({
        //     subHeader: 'Anda yakin untuk memilih unit ' + unit[4] + ' - ' + unit[2] + ' ini?',
        //     buttons: [
        //         {
        //             text: 'Batal',
        //             cssClass: 'alert-button-cancel',
        //         },
        //         {
        //             text: 'Ya',
        //             cssClass: 'alert-button-confirm',
        //             handler: () => {
        //                 sendRequest(unit);
        //             }
        //         },
        //     ],
        // })
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {/* === Start Header ===*/}
            <ListHeader title={t('unit.riwayat')} isReplace={false} link={""} addButton={false} />
            {/* === End Header ===*/}
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col justify-between">
                    {/* === start form === */}
                    <div>
                        {/* === Start List  === */}
                        <div className="bg-white">
                            <div>
                                <div className="px-3 pt-3">
                                    {isLoaded ?
                                        <>
                                            {
                                                items.map((unit, index) => {
                                                    return (
                                                        <div onClick={() => btnPilih(unit)} key={unit['id']}
                                                            className="relative my-2 rounded-lg border border-1 border-gray-300 overflow-hidden">
                                                            <div>
                                                                <div className="grid grid-cols-2 px-4 py-2">
                                                                    <div>
                                                                        <h3 className='font-bold'>{unit['noPol']}</h3>
                                                                        <p className='text-sm text-gray-500'> {unit['noLambung']} - {unit['tipeUnitName']}</p>
                                                                    </div>
                                                                    <div className='text-right'>
                                                                        <p className='text-sm text-gray-500'>{unit['jenisUnitName']}</p>
                                                                        <div className='absolute right-0 bottom-0'>
                                                                        {unit["jenisUnitName"] === 'Triton' &&
                                                                            <img className='h-8' src='assets/images/truck-shiluete.png' />
                                                                        }
                                                                        {unit["jenisUnitName"] === 'Pajero' &&
                                                                            <img className='h-8' src='assets/images/suv-shiluete.png' />
                                                                        }
                                                                        {unit["jenisUnitName"] === 'Bus' &&
                                                                            <img className='h-8' src='assets/images/mpv-shiluete.png' />
                                                                        }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='px-4 py-2'>
                                                                    <p className='text-xs text-gray-500'>{unit["vendorName"]}</p>
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
                        {/* === End List === */}

                    </div>
                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default RiwayatUnitList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

