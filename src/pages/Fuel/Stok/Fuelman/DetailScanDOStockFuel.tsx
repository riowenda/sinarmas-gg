import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, {useState} from "react";
import {
    API_URI,
    DO_REQ_CONFIRM_FUELMAN_URI, DO_REQ_DETAIL_URI, DO_REQ_URI,
    FUEL_STATION_TRANSACTION_BY_NOMOR_URI, IMAGE_FUEL_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_token,
    pref_unit
} from "../../../../constant/Index";
import {useHistory, useLocation } from "react-router-dom";
import {getJsonPref, getPref} from "../../../../helper/Preferences";
import moment from "moment";
import SkeletonDetail from '../../../Layout/SkeletonDetail';
import DetailHeader from '../../../../components/Header/DetailHeader';
import {QualityListAPI} from "../../../../api/MDForFuel/QualityList";
import keterangan from "../../../GACare/components/Keterangan";
import {BaseAPI} from "../../../../api/ApiManager";

const userInfo = {name: "", nik: "", imageUrl: ""}
const userUnit = {id: "", noPol: "", noLambung: "", vendor: {name: ""}, jenisUnit: {name: ""}};
const itemQuality = {id: "", value: false, file: "", data: "", nama: "", isEvidence: false}
const DetailScanDOStockFuel: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [pegId, setPegId] = useState("");
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [sendId, setSendId] = useState("");
    const [reqFuel, setReqFuel] = useState<any>(null);
    const [showConfirm] = useIonAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const [txt, setTxt] = useState("");
    const [token, setToken] = useState("");
    const [quality, setQuality] = useState<any>([]);
    const [stok, setStok] = useState<any>();
    const {t} = useTranslation();
    const location = useLocation();

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        // let teks = "hrgabib_po_960b02e5-7cca-4f5a-98f6-18299c0c7f6c_1233487";
        // setTxt(teks);
        // console.log(teks);
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

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        setIsLoaded(false);
        loadDetail(token, sendId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        // @ts-ignore
        const dataId = history.location.state.detail;
        // const dataId = 'de59a709-108f-4e75-8f3f-0fda67f8a3cb';
        setSendId(dataId);

        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_token).then(r => {
            setToken(r);
            getPref(pref_pegawai_id).then(res => {
                setPegId(res);
                sendConfirm(res, dataId);
                // @ts-ignore
                loadDetail(r, dataId);
            });
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
    }

    const loadData = () => {
        loadDataPref();
    }

    const loadDetail = (token: any, id: any) => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + DO_REQ_URI + DO_REQ_DETAIL_URI + "/" + id;
        //const url = BaseAPI() + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);

        fetch(urlContents, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setReqFuel(result.data);
                        const now = new Date();
                        loadDataMDQuality(result.data);
                        let nomor = result.data.nomor;
                        loadFuelTransaction(token, nomor);
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const loadFuelTransaction = (token: string, nomor : string) => {
        // @ts-ignore
        const urlContents = BaseAPI() + API_URI + FUEL_STATION_TRANSACTION_BY_NOMOR_URI + "/" + nomor;
        fetch(urlContents, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setStok(result.data);
                    }
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const loadDataMDQuality = (doss: any) => {
        let data = QualityListAPI().then(result => {
            let item = result;
            let evidence: { id: string; value: string; file: string; data: string; nama: string; isEvidence: boolean; }[] = [];
            // @ts-ignore
            let dt = item.filter((x: { [x: string]: { [x: string]: null; }; }) => (x['isActive'] == true));
            if(doss['status'] === 'PROPOSED') {
                dt.map((obj: any) => {
                    let d = {id: obj.id, value: false, file: "", data: "", nama: obj.nama, isEvidence: obj.isEvidence,};
                    // @ts-ignore
                    evidence.push(d);
                });
            } else {
                let ds = doss.data;
                ds.map((obj: any) => {
                    dt.map((q: any) => {
                        if(q.id === obj.id) {
                            let i = {id: obj.id, data: q.nama, file: obj.file, value: obj.value}
                            // @ts-ignore
                            evidence.push(i);
                        }
                    });
                })
            }
            // console.log(dt);
            setQuality(evidence);
        })
    }

    const sendConfirm = (pegId: any, doId: any) => {
        const url = BaseAPI() + API_URI + DO_REQ_URI + DO_REQ_CONFIRM_FUELMAN_URI;
        const datas = { do: doId, fuelman:pegId} //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(datas)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        showAlertConfirmed();
                    } else {
                        dismiss();
                        let keterangan = 'Tidak dapat memproses penyelesaian DO ini!';
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: keterangan,
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                },
                            ],
                        })
                    }
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

    const showAlertConfirmed = () => {

    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>
            {isLoaded ?
                <>
                    <IonContent fullscreen>
                        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                            <IonRefresherContent></IonRefresherContent>
                        </IonRefresher>
                        <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                            {/* === Start Content  === */}
                            <div>
                                <DetailHeader title='Delivery Order' link={""}
                                              approval={reqFuel['status']}></DetailHeader>

                                <div className="p-6 bg-white">

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            DO ID
                                        </label>
                                        <div>
                                            {reqFuel['nomor']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. DO
                                        </label>
                                        <div>
                                            {reqFuel['ref']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. GR
                                        </label>
                                        <div>
                                            {reqFuel['gr_nomor']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Stasiun Pengisian
                                        </label>
                                        <div>
                                            {reqFuel['fuelStasiun']['nama']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jumlah Pengiriman
                                        </label>
                                        <div>
                                            {reqFuel['jumlahRencana']}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Target Pengisian
                                        </label>
                                        <div>
                                            {moment(reqFuel['tanggalRencana']).format('DD MMM yyyy').toString()}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Keterangan
                                        </label>
                                        <div>
                                            {reqFuel['alasan']}
                                        </div>
                                    </div>

                                    {(reqFuel != null && reqFuel['komentar'] != null) &&
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Catatan GA
                                            </label>
                                            <div>
                                                {reqFuel['ga'] != null ? reqFuel['ga']['name'] : "N/A"} :<br/>
                                                {reqFuel['komentar']}
                                            </div>
                                        </div>
                                    }
                                    {/* looping data MD kualitas */}

                                    {quality.map((item: { [x: string]: string | number | boolean}, index: React.Key | null | undefined) => {
                                        return (
                                            <div className="mt-4" key={index} >
                                                <div className='flex text-center'>
                                                    <input type="checkbox" className="h-4 w-4 rounded" readOnly checked={item["value"] == true ? true : false}/>
                                                    <label className="ml-2 text-gray-500">{item['data']}</label>
                                                </div>
                                                <div className="ml-6 mt-2">
                                                    {(item['file'] != null && item['file'] !== "") &&
                                                        <><div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                                            <img className="object-cover pointer-events-none" src={`${BaseAPI()}${API_URI}${IMAGE_FUEL_URI}${item['file']}`} ></img>
                                                        </div></>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}

                                {/* end Looping */}
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan setuju/tolak
                                    </label>
                                    <div>
                                        {reqFuel['keterangan'] != null ?
                                            <>
                                            {reqFuel['pemeriksa'] != null ? reqFuel['pemeriksa']['name'] : "N/A"} :<br/>
                                            {reqFuel['keterangan']}
                                            </>
                                            :
                                            <>
                                                -
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        Jumlah Aktual
                                    </label>
                                    <div>{reqFuel['jumlah'] != null ? (reqFuel['jumlah']+ " liter") : 'N/A'}</div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        Tanggal Aktual
                                    </label>
                                    <div>
                                        {moment(reqFuel['tanggal']).format('DD MMM yyyy').toString()}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        Last Stok
                                    </label>
                                    <div>{stok != null ? stok['stokTerakhir'] : "N/A"} liter</div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm text-gray-400">
                                        Updated Stok
                                    </label>
                                    <div>
                                        {stok != null ? stok['stockTerupdate'] : "N/A"} liter
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* === End Content === */}
                    </div>

                </IonContent>
            </>
            : <>
                    {
                        <SkeletonDetail />
                    }
                </>}
        </IonPage>

    );

};

export default DetailScanDOStockFuel;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

