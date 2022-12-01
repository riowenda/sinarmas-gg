import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText, IonThumbnail,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import './NotifikasiList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
    pref_identity,
    pref_pegawai_id, pref_token
} from "../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import { getPref } from "../../helper/Preferences";
import ListHeader from "../../components/Header/ListHeader";
import {NotifikasiByUser} from "../../api/NotifikasiAPI";
import CardNotif from "./Component/CardNotif";
import moment from "moment";

const NotifikasiList: React.FC = () => {
    const [paramId, setParamId] = useState(null)
    const history = useHistory()
    //setGetId(history['location']['state']['id'])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState<any[]>([])
    const id = useParams<any[]>();
    const [pegId, setPegId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [token, setToken] = useState();
    const [skeleton] = useState(Array(10).fill(0));
    const { t } = useTranslation()

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

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
        load();
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

    const load = () => {
        // @ts-ignore
        const dataId = id['id'];
        setParamId(dataId);
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_token).then(t => {
            setToken(t);
        })
        getPref(pref_pegawai_id).then(p => {
            setPegId(p);
            loadDataPermintaan(p);
        });

    }

    const loadDataPermintaan = (p: string) => {
        NotifikasiByUser(p).then((data) => {
            // console.log(data);
            if (data.status === "SUCCESS" && (data.message === "" || data.message == null)) {
                setItems(data.data);
            }
            setIsLoaded(true);
        });
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/dashboard");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const btnPilih = (data:any) => {
        history.push({
            pathname: "/notifikasi-detail/" + data.data.data_id,
            state: { detail: data.data, nid: data.msg_report_id }
        });
    }

    return (
        <IonPage>
            {/* Header */}
            <ListHeader title={t('header.notifikasi')} isReplace={false} link={""} addButton={false} />
            {/* end Header */}
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white">
                    <div className='border-b border-gray-300'>

                    </div>
                    {/* TODO tambah icon */}

                    {/* Start looping notifikasi */}
                    {isLoaded ?
                        <>
                            {items.map((data, index) => {
                                let tgl = data.data.data_date.toString();
                                tgl = tgl.replace("WIB", "");
                                tgl = tgl.replace("WIT", "");
                                tgl = tgl.replace("WITA", "");
                                return (
                                    <div key={index} onClick={() => btnPilih(data)}>
                                        <CardNotif read={data.readed} data={data} type={data.data.data_type} tgl={tgl}/>
                                    </div>
                                )
                            })}
                        </> :
                        <>
                            {
                                skeleton.map((index) => {
                                    return (
                                        <div className="bg-gray-100">
                                            <div className="px-6">
                                                <div className='flex'>
                                                    <IonThumbnail className="pt-2" slot="start">
                                                        <IonSkeletonText animated={true}></IonSkeletonText>
                                                    </IonThumbnail>
                                                    <div className='flex justify-between w-full ml-4 border-b border-gray-300 items-center'>
                                                        <div className='py-2 w-full'>
                                                            <IonSkeletonText animated style={{ width: '30%' }} />
                                                            <IonSkeletonText animated style={{ width: '100%' }} />
                                                            <IonSkeletonText animated style={{ width: '40%' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    }

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

