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

import './UnitList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    PEGAWAI_UNIT_CRUD_URI,
    PEGAWAI_UNIT_SET_UNIT_USER_URI,
    PEGAWAI_UNIT_TAKEOVER_URI, pref_identity, pref_pegawai_unit_id,
    pref_unit, pref_unit_id,
    pref_user_id, TAKEOVER_ALL_GA_URI,
    UNIT_CRUD_URI,
    UNIT_VIEWS_URI
} from "../../../constant/Index";
import { useHistory, useLocation } from "react-router-dom";
import { getPref, setPref } from "../../../helper/preferences";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import Select from 'react-select'
import ListHeader from "../../../components/Header/ListHeader";

const options = [
    { value: 'semua', label: 'Semua' },
    { value: 'tersedia', label: 'Tersedia' },
    { value: 'tidak', label: 'Tidak Tersedia' }
]

const UnitList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [presentAlert] = useIonAlert();
    const [showSuccess] = useIonAlert();
    const [showTakeOver] = useIonAlert();
    const [showConfirm] = useIonAlert();
    const [toast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [pegUnitId, setPegUnitId] = useState("");
    const [skeleton] = useState(Array(10).fill(0));
    const [urlView, setUrlView] = useState("");
    const [dataOri, setDataOri] = useState();
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
        loadData(urlView);
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
        getPref(pref_unit_id).then(res => {
            setPegUnitId(res);
            const url = BASE_API_URL + API_URI + UNIT_CRUD_URI + UNIT_VIEWS_URI;
            if (res != null && res !== "") {
                let urls = url + "/" + res;
                setUrlView(urls);
                loadData(urls);
            } else {
                setUrlView(url);
                loadData(url);
            }
        });

    }

    const loadData = (url: any) => {
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result);
                    setItems(result.data);
                    setDataOri(result.data);
                    setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                }
            )
    }


    const btnPilih = (unit: any) => {
        // console.log(unit);
        presentAlert({
            subHeader: 'Anda yakin untuk memilih unit ' + unit[4] + ' - ' + unit[2] + ' ini?',
            buttons: [
                {
                    text: 'Batal',
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: 'Ya',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        sendRequest(unit);
                    }
                },
            ],
        })
    };

    const sendRequest = (unit: any) => {
        const loading = present({
            message: 'Memproses permintaan ...',
        })
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_SET_UNIT_USER_URI;
        const data = { unit: unit[0], user: userId } //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    showResult(result, unit);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    dismiss();
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                }
            )
    };

    const showResult = (responseStatus: any, unit: any) => {
        dismiss();
        if (responseStatus.status === 'SUCCESS') {
            const dataUnit = responseStatus.data;
            showAlertSuccess(dataUnit);
        } else if (responseStatus.status === 'USED') {
            showAlertToTakeOver(responseStatus.data, unit);
        } else { //EXIST
            showAlertConfirmed(responseStatus.message, "false");
        }
    };

    const showAlertSuccess = (dataUnit: any) => {
        setPref(pref_unit, JSON.stringify(dataUnit['unit'])).then(r => r);
        setPref(pref_unit_id, dataUnit['unit']['id']).then(r => r);
        setPref(pref_pegawai_unit_id, dataUnit['id']).then(r => r);
        showSuccess({
            //simpan unit id ke pref
            subHeader: 'Berhasil memilih ' + dataUnit['unit']['jenisUnit']['name'] + ' - ' + dataUnit.unit.no_pol + ', silahkan melakukan pengisian form P2H',
            buttons: [
                {
                    text: 'Isi Nanti',
                    cssClass: 'alert-button-cancel',
                    handler: () => {
                        // loadData();
                        // history.push("/fuel/homepage");
                        history.goBack();
                    }
                },
                {
                    text: 'Isi Form P2H',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        history.replace("/fuel/p2h/p2hlist");
                    }
                },
            ],
        })
    }

    const showAlertToTakeOver = (msg: any, unit: any) => {
        showTakeOver({
            //simpan unit id ke pref
            subHeader: '' + unit[4] + ' - ' + unit[2] + ' sedang digunakan. Apakah anda ingin ambil alih?',
            buttons: [
                {
                    text: 'BATAL',
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: 'OKE',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        sendRequestTakeOver(unit);
                    }
                },
            ],
        })
    }

    const showAlertConfirmed = (response: any, wait: any) => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: '' + (wait === "true" ? 'Permintaan Take Over sedang diproses. Silahkan tunggu' : response) + '',
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        loadData(urlView);
                    }
                },
            ],
        })
    }

    const sendRequestTakeOver = (unit: any) => {
        const loading = present({
            message: 'Memproses permintaan ...',
        })
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_TAKEOVER_URI;
        const data = { unit: unit[0], user: userId };//user diambil dari pref

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    showAlertConfirmed(result, "true");
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    dismiss();
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                }
            )
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/homepage");
    }

    const handleSelectChange = async (event: any) => {
        // console.log("ganti value: ", event.value);
        if (event.value !== null && event.value !== "") {
            let data = null;
            if(event.value === "tidak"){
                // @ts-ignore
                data = dataOri.filter((x: { [x: string]: { [x: string]: null; }; }) => x[5] != null)
            } else if(event.value === "tersedia") {
                // @ts-ignore
                data = dataOri.filter((x: { [x: string]: { [x: string]: null; }; }) => x[5] == null)
            } else {
                // @ts-ignore
                data = dataOri;
            }
            setItems(data);
        }
    }

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
                        <ListHeader title={"Daftar Unit"} isReplace={false} link={""} addButton={false} />
                        {/* === End Header ===*/}


                        {/* === Start List  === */}
                        <div className="bg-white">
                            <div className="px-3 pt-4 divide-y divide-gray-300">
                                <div className='mb-3'>
                                    <Select placeholder="Filter" options={options} onChange={event => handleSelectChange(event)} />
                                </div>
                                <div className="px-3 pt-4">
                                    {isLoaded ?
                                        <>
                                            {
                                                items.map((unit, index) => {
                                                    return (
                                                        <div onClick={() => btnPilih(unit)} key={unit[0]}
                                                            className="relative my-2 rounded-lg border border-1 border-gray-300 overflow-hidden">
                                                            <div>
                                                                <div className="grid grid-cols-2 px-4 py-2">
                                                                    <div>
                                                                        <h3 className='font-bold'>{unit[1]}</h3>
                                                                        <p className='text-sm text-gray-500'>{unit[4]} - {unit[2]}</p>
                                                                    </div>
                                                                    <div className='text-right'>

                                                                        {unit[5] !== null ?
                                                                            <h3 className='font-bold text-red-600'>Tidak Tersedia</h3>
                                                                            :
                                                                            <h3 className='font-bold text-emerald-600'>Tersedia</h3>
                                                                        }
                                                                        <div className='absolute right-0 bottom-0'>
                                                                        {unit[4] === 'Triton' &&
                                                                            <img className='h-8' src='assets/images/truck-shiluete.png' />
                                                                        }
                                                                        {unit[4] === 'Pajero' &&
                                                                            <img className='h-8' src='assets/images/suv-shiluete.png' />
                                                                        }
                                                                        {unit[4] === 'Bus' &&
                                                                            <img className='h-8' src='assets/images/mpv-shiluete.png' />
                                                                        }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='px-4 py-2'>
                                                                    <p className='text-xs text-gray-500'>{unit[3]}</p>
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

export default UnitList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

