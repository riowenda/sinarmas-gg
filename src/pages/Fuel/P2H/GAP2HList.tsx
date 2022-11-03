import {
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

import './GAP2HList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL, P2H_LIST_GA_URI,
} from "../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import Select from 'react-select'
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import ListHeader from "../../../components/Header/ListHeader";
const Identity = "78fda6a7-0351-4f8f-84ab-d8bebce25d67";
const rHeader = { 'Content-Type': 'application/json', 'Identity': Identity }

const options = [
    { value: '-', label: 'ALL' },
    { value: 'PROPOSED', label: 'PROPOSED' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' }
]
const GAP2HList: React.FC = () => {
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
        loadData();
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
        loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const handleSelectChange = async (event: any) => {
        const url = BASE_API_URL + API_URI + P2H_LIST_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log("cek value: ", event.value);
                    /*console.log("result: ", result['data'][0]['status']);*/

                    if (event.value !== null && event.value !== "" && event.value !== "-") {
                        let data = result.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null && x['status'] == event.value);
                        // @ts-ignore
                        let sortByDate = data.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        // console.log(sortByDate)
                        setItems(sortByDate);
                        // setItems(data);
                    } else {
                        let data = result.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null);
                        //setItems(result['data']);
                        // @ts-ignore
                        let sortByDate = data.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        setItems(sortByDate);
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    //setError(error);
                }
            )
    }

    const loadData = () => {
        const url = BASE_API_URL + API_URI + P2H_LIST_GA_URI;
        fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result);
                    let data = result;
                    if(data != null && !data.isEmpty){
                        let item = data.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null);
                        // @ts-ignore
                        let sortByDate = item.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        // console.log(sortByDate)
                        setItems(sortByDate);
                    }

                    //setItems(result);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    //setError(error);
                }
            )
    };


    /*const btnPilih = () => {
        history.push("/fuel/p2h/p2hinput");
    };*/
    const btnPilih = (id: any) => {
        // history.push("/fuel/p2h/gap2hdetail/" + id);
        history.push({
            pathname: "/fuel/p2h/gap2hdetail/" + id,
            state: { detail: id }
        });
        // console.log('dipilih ',)
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
    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">
                    {/* === start form === */}
                    <div>
                        {/* === Start Header ===*/}
                        {/* Header */}
                        <ListHeader title={"Daftar Permintaan P2H"} isReplace={false} link={""} addButton={false} />
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
                                    {items.map((p2h, index) => {
                                        return (
                                            <div onClick={() => btnPilih(p2h['id'])} key={p2h['id']} className="rounded-lg p-4 mb-3 border border-1 border-gray-200">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <p className="font-bold">{p2h['pegawai']['name']}</p>
                                                        <p>{moment(p2h['tanggal']).format('DD MMM yyyy').toString()}</p>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm text-gray-500">{p2h['unit']['noLambung']} - {p2h['unit']['noPol']}</p>
                                                        {p2h['status'] === 'PROPOSED' &&
                                                            <span className="text-blue-600 font-bold">{p2h['status']}</span>
                                                        }
                                                        {p2h['status'] === 'REJECTED' &&
                                                            <span className="text-red-600 font-bold">{p2h['status']}</span>
                                                        }
                                                        {p2h['status'] === 'APPROVED' &&
                                                            <span className="text-green-600 font-bold">{p2h['status']}</span>
                                                        }
                                                    </div>
                                                    <p className="text-sm text-gray-500">{p2h['unit']['jenisUnit']['name']}</p>
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

                        {/* === End Body ===*/}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default GAP2HList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

