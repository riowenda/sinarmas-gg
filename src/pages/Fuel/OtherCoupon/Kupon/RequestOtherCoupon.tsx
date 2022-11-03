import {
    IonContent,
    IonFooter,
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

import './RequestOtherCoupon.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ActionSheet from "actionsheet-react";
import {
    API_URI,
    BASE_API_URL,
    FUEL_REQ_UNIT_APPROVAL_URI,
    FUEL_REQ_UNIT_CONFIRMATION_URI,
    FUEL_REQ_UNIT_FORGIVENES_URI,
    FUEL_REQ_UNIT_URI, OTHER_COUPON_APPROVAL_URI, OTHER_COUPON_CONFIRMATION_URI, OTHER_COUPON_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_unit,
} from "../../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getJsonPref, getPref } from "../../../../helper/preferences";
import QRCodeWithCountDown from "../../../../components/QRCodeWithCountDown/QRCodeWithCountDown";
import moment from "moment";
import SVGStopCloseCheckCircle from "../../../Layout/SVGStopCloseCheckCircle";
import SkeletonDetail from '../../../Layout/SkeletonDetail';
import {useTimer} from "react-timer-hook";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import TextareaExpand from "react-expanding-textarea";
import DetailHeader from "../../../../components/Header/DetailHeader";
import QRCodeWithLogo from "../../../../components/QRCodeWithLogo/QRCodeWithLogo";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const sendObj = {id:"", status:"", img:"", filename:"", alasan:""}
const obj = {id:"", pemohon: {id: "", name:"", nik:"", foto: ""}, nomor: "", tanggalPermintaan: null, liter: null, literPengisian:null, fuelman: {id:"",name:""}, penjaga:{id:"",name:""}, status: "", fuelStasiun: {id:"", nama: ""}, riwayats: []}
const RequestOtherCoupon: React.FC = () => {
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [pegId, setPegId] = useState("");
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [sendId, setSendId] = useState("");
    const [reqFuel, setReqFuel] = useState(obj);
    const [showConfirm] = useIonAlert();
    const [approvGA, setApprovGA] = useState(null);
    const [approvFinance, setApprovFinance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [realStatus, setRealStatus] = useState("");
    const [kupon, setKupon] = useState(sendObj);
    const [txt, setTxt] = useState("");


    const { t } = useTranslation();
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
        loadDetail(sendId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
    }

    const loadData = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        setSendId(dataId);
        // @ts-ignore
        loadDetail(dataId);
    }

    const loadDetail = (id: any) => {
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + OTHER_COUPON_URI + "/" + id;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);

        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === "SUCCESS") {
                        setReqFuel(result.data);
                        let riwayats = result.data.riwayats;
                        // @ts-ignore
                        let appGa = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'GA');
                        setApprovGA(appGa.length > 0 ? appGa[0] : null);
                        // @ts-ignore
                        let appFinance = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'FINANCE');
                        setApprovFinance(appFinance.length > 0 ? appFinance[0] : null);
                        // if(result.data.status === "ONHOLD" || result.data.status === "FORGIVENESS"){
                        //     setAmpunan(true);
                        // }
                        // if(result.data.status !== "FILLED"){
                        //     pause();
                        // }
                        setRealStatus(result.data.status);
                        // // @ts-ignore
                        // let forgivness = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'FORGIVENESS');
                        // setAlasanAmpunan(forgivness.length > 0 ? forgivness[0] : null);
                        // // @ts-ignore
                        // let close = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'CLOSED');
                        // setKomentarAmpunan(close.length > 0 ? close[0] : null);
                        const now = new Date();
                        // @ts-ignore
                        const time = now.setTime(now.getTime() + (5 * 60000));
                        let teks = "hrgabib_fuel-other_"+result.data.id+"_"+time;
                        setTxt(teks);
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const ref = useRef();

    const btnBack = () => {
        history.goBack();
        // history.push("/fuel/req-fuel/daftar-permintaan");
    }

    const btnSelesai = (e : any) => {
        e.preventDefault();
            presentAlert({
                subHeader: 'Anda yakin untuk menyelesaikan permintaan ini?',
                buttons: [
                    {
                        text: 'Tidak',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendConfirmation("CLOSED","selesai");
                        }
                    },
                ],
            })
    }

    const btnPerbaikan = (e : any) => {
        e.preventDefault();
        presentAlert({
                subHeader: 'Anda yakin untuk meminta perbaikan jumlah fuel?',
                buttons: [
                    {
                        text: 'Tidak',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendConfirmation("REFILL","perbaikan");
                        }
                    },
                ],
            })
    }

    const sendConfirmation = (status : any, tipe: any) => {
        const urlContents = BASE_API_URL + API_URI + OTHER_COUPON_URI + OTHER_COUPON_CONFIRMATION_URI;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);
        const data = {id:sendId, status:status, user:pegId}
        let msg = tipe === "perbaikan" ? "Pengajuan perbaikan" : "Penyelesaian permintaan";
        const loading = present({
            message: 'Memproses '+msg+" ...",
        })
        fetch(urlContents, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if (result.status === "SUCCESS") {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: ""+msg+" berhasil dikirim!",
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDetail(sendId);
                                        // history.push("/fuel/req-fuel/daftar-permintaan");
                                    }
                                },
                            ],
                        })
                    }
                },
                (error) => {
                    dismiss();
                    toast( {
                            message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                        }
                    );
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
    }

    const btnBatal = () => {
        presentAlert({
            subHeader: 'Anda yakin untuk membatalkan Permintaan Bahan Bakar Non Unit ini?',
            buttons: [
                {
                    text: 'Tidak',
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: 'Ya',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        sendRequest();
                    }
                },
            ],
        })
    }

    const sendRequest = () => {
        const loading = present({
            message: 'Memproses pembatalan ...',
        })
        const url = BASE_API_URL + API_URI + OTHER_COUPON_URI + OTHER_COUPON_APPROVAL_URI;
        const data = { otherKupon: { id: sendId }, status: "CANCELED", approveType: "USER", komentar: null, tanggal: (new Date()), pegawai: { id: pegId } } //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if (result.status === "SUCCESS") {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Pembatalan Permintaan Bahan Bakar Non Unit berhasil!",
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDetail(sendId);
                                    }
                                },
                            ],
                        })
                    } else {
                        toast({
                            message: "Terjadi kesalahan! [" + result.message + "]", duration: 1500, position: "top"
                        }
                        );
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
                        <div className="bg-white flex flex-col min-h-screen justify-between">

                            {/* === Start Form  === */}
                            <div>
                                <DetailHeader title={"Permintaan Bahan Bakar Non Unit"} link="" approval={reqFuel.status}></DetailHeader>
                                <div className="p-3">
                                    <div className="pt-2">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Permintaan
                                        </label>
                                        <div>
                                            {moment(reqFuel.tanggalPermintaan).format('DD MMM yyyy').toString()}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. Permintaan
                                        </label>
                                        <div>
                                            {reqFuel.nomor}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Permintaan Oleh
                                        </label>
                                        <div>
                                            {reqFuel.pemohon.name}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Custodian
                                        </label>
                                        <div>
                                            {reqFuel.penjaga.name}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jumlah
                                        </label>
                                        <div>
                                            {reqFuel.liter} liter
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Stasiun Pengisian
                                        </label>
                                        <div>
                                            {reqFuel.fuelStasiun.nama}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Disetujui GA
                                        </label>
                                        <div>
                                            {approvGA != null ? approvGA["pegawai"]["name"] : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Disetujui Finance
                                        </label>
                                        <div>
                                            {approvFinance != null ? approvFinance["pegawai"]["name"] : "-"}
                                        </div>
                                    </div>

                                    {(reqFuel != null && reqFuel["liter"] != null) &&
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Jumlah Permintaan
                                            </label>
                                            <div>
                                                {reqFuel != null ? reqFuel["liter"] : "N/A"} Liter
                                            </div>
                                        </div>
                                    }

                                    {(reqFuel != null && reqFuel["literPengisian"] != null) &&
                                        <div className="mt-4 w-full text-center">
                                            <label className="block text-sm text-gray-400">
                                                Jumlah Aktual
                                            </label>
                                            <div className="mt-4">
                                                <strong className="text-lg">{reqFuel != null ? reqFuel["literPengisian"] : "N/A"}</strong> Liter
                                            </div>
                                        </div>
                                    }
                                </div>

                                {reqFuel != null && reqFuel.status === "READY" ?
                                    <div className="aspect-auto bg-white-100 w-full flex item-center">
                                        {/*<img height={180} width={180} className="mx-auto object-cover object-center rounded-lg pointer-events-none" src={`data:image/png;base64,${photo}`} ></img>*/}
                                        <div className="mx-auto">
                                            {reqFuel != null && reqFuel.id !== "" ?
                                                <QRCodeWithLogo text={txt} />
                                                : ""}
                                        </div>
                                    </div>
                                    : ""}
                            </div>
                            {/* === End Form === */}

                            {(() => {
                                if(reqFuel.status === "READY") {
                                    return (<>
                                        <div className='p-6 items-end bg-white'>
                                            <button onClick={btnBatal} className="w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                                BATAL
                                            </button>
                                        </div>
                                    </>)
                                } else if(reqFuel != null && reqFuel["status"] === "FILLED") {
                                    return(<>
                                        <div className='pb-3 pt-3 pl-3 pr-3 items-end bg-white'>
                                            <button onClick={btnSelesai}
                                                    className="w-full items-center mx-auto rounded-md bg-indigo-500 px-3 py-2 text-sm font-bold text-white">
                                                SELESAI
                                            </button>
                                        </div>
                                        <div className='pb-3 pl-3 pr-3 items-end bg-white'>
                                            <button onClick={btnPerbaikan}
                                                    className="w-full items-center mx-auto rounded-md bg-orange-500 px-3 py-2 text-sm font-bold text-white">
                                                Minta Perbaikan Jumlah Fuel
                                            </button>
                                        </div>
                                    </>)
                                } else {
                                    return (
                                        <div className='pb-3 pt-3 pl-3 pr-3 items-end bg-white'>
                                            <button onClick={btnBack}
                                                    className="w-full items-center mx-auto rounded-md bg-indigo-500 px-3 py-2 text-sm font-bold text-white">
                                                OKE
                                            </button>
                                        </div>
                                    )
                                }
                            })()}

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

export default RequestOtherCoupon;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

