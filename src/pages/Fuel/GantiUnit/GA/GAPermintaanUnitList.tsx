import {
    IonBackButton,
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, IonSkeletonText,
    useIonActionSheet,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave
} from '@ionic/react';

import './GAPermintaanUnitList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL, TAKEOVER_ALL_GA_URI,
} from "../../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import Select from 'react-select'
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import ListHeader from "../../../../components/Header/ListHeader";

const Identity = "78fda6a7-0351-4f8f-84ab-d8bebce25d67";
const rHeader = { 'Content-Type': 'application/json', 'Identity': Identity }

const options = [
    { value: '', label: 'ALL' },
    { value: 'PROPOSED', label: 'PROPOSED' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' }
]

const GAPermintaanUnitList: React.FC = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const history = useHistory();
    const { t } = useTranslation();
    const [present] = useIonActionSheet();
    const [cari, setCari] = useState<string[]>([]);
    const [skeleton] = useState(Array(5).fill(0));
    const pushLog = (msg: string) => {
        setCari([msg, ...cari]);
        console.log("Hasil cari: ", cari);
    };
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
        loadData()
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
        loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadData = () => {
        const url = BASE_API_URL + API_URI + TAKEOVER_ALL_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log("ganti: ", result);
                    let data = result['data'];
                    if(data != null && !data.isEmpty){
                        // @ts-ignore
                        let sortByDate = data.map((obj: { requestDate: string; }) => {return {...obj, date: new Date(obj.requestDate)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        setItems(sortByDate);
                    }

                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }


    const handleSelectChange = async (event: any) => {
        console.log("ganti value: ", event.value);
        const url = BASE_API_URL + API_URI + TAKEOVER_ALL_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    /*console.log("cek value: ", event.value);
                    console.log("result: ", result['data'][0]['status']);*/

                    if (event.value !== null && event.value !== "") {
                        let data = result['data'].filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == event.value);
                        // @ts-ignore
                        let sortByDate = data.map((obj: { requestDate: string; }) => {return {...obj, date: new Date(obj.requestDate)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        setItems(sortByDate);
                        // setItems(data);
                    } else {
                        // @ts-ignore
                        let sortByDate = result['data'].map((obj: { requestDate: string; }) => {return {...obj, date: new Date(obj.requestDate)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        setItems(sortByDate);
                        // setItems();
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }


    const btnPilih = (unit: any) => {
        history.push({
            pathname: "/fuel/ga/unit/detail/" + unit['id'],
            state: { detail: unit['id'] }
        });
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const toList = () => {
        // history.goBack();
        history.push('/ga/fuel/homepage');
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">
                    {/* === start form === */}
                    <div>
                        {/* Header */}
                        <ListHeader title={"Daftar Permintaan Ganti Unit"} isReplace={false} link={""} addButton={false} />
                        {/* end Header */}


                        {/* === Start DUMMY List  === */}

                        <div className="bg-white">

                            <div className="px-3 pt-4 divide-y divide-gray-300">
                                <div className='mb-3'>
                                    <Select placeholder="Filter" options={options} onChange={event => handleSelectChange(event)} />
                                </div>

                                <div className='pt-4'>
                                    {isLoaded ?
                                        <>
                                        {items.map((unit, index) => {
                                        return (
                                            <div onClick={() => btnPilih(unit)} className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300" key={unit['id']}>
                                                <div>
                                                    <div className="flex justify-between">
                                                        <p className="font-bold">{unit['requester']['name']}</p>
                                                        <p className="text-sm font-medium">{moment(unit['requestDate']).format('DD MMM yyyy').toString()}</p>

                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm text-gray-500">{unit['pegawaiUnit']['unit']['noLambung']} - {unit['pegawaiUnit']['unit']['noPol']}</p>
                                                        {unit['status'] === 'PROPOSED' &&
                                                            <span className="text-blue-600 font-bold">{unit['status']}</span>
                                                        }
                                                        {unit['status'] === 'REJECTED' &&
                                                            <span className="text-red-600 font-bold">{unit['status']}</span>
                                                        }
                                                        {unit['status'] === 'APPROVED' &&
                                                            <span className="text-green-600 font-bold">{unit['status']}</span>
                                                        }
                                                    </div>
                                                    <p className="text-sm text-gray-500">{unit['pegawaiUnit']['unit']['jenisUnit']['name']}</p>
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
                        </div>

                        {/* === End DUMMY List === */}
                    </div>
                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default GAPermintaanUnitList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

