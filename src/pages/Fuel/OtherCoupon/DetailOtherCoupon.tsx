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

import './FormOtherCoupon.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ActionSheet from "actionsheet-react";
import {
    API_URI,
    BASE_API_URL,
    FUEL_REQ_UNIT_APPROVAL_URI,
    FUEL_REQ_UNIT_URI,
    OTHER_COUPON_APPROVAL_URI,
    OTHER_COUPON_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_unit,
} from "../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getJsonPref, getPref } from "../../../helper/preferences";
import moment from "moment";
import SVGStopCloseCheckCircle from "../../Layout/SVGStopCloseCheckCircle";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from "../../../components/Header/DetailHeader";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const FormRequestFuel: React.FC = () => {
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
    const [reqFuel, setReqFuel] = useState(null);
    const [showConfirm] = useIonAlert();
    const [approvGA, setApprovGA] = useState(null);
    const [approvFinance, setApprovFinance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)

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

    const handleOpen = () => {
        // @ts-ignore
        ref.current.open();
    };

    const handleClose = () => {
        // @ts-ignore
        ref.current.close();
    };

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/req-fuel/daftar-permintaan");
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
                                {/* Header */}
                                <DetailHeader title='Permintaan Bahan Bakar Non Unit' link='' approval={reqFuel != null ? reqFuel["status"] : "N/A"}></DetailHeader>
                                {/* end Header */}
                                <div className="p-3">
                                    <div className="pt-6">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Permintaan
                                        </label>
                                        <div>
                                            {reqFuel != null ? moment(reqFuel["tanggalPermintaan"]).format('DD MMM yyyy').toString() : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Permintaan Oleh
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["pemohon"]["name"] : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Custodian
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["penjaga"]["name"] : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jumlah
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["liter"] : "N/A"} liter
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Stasiun Pengisian
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["fuelStasiun"]["nama"] : "N/A"}
                                        </div>
                                    </div>

                                    <div className="mt-4 w-full justify-between rounded-lg bg-white border border-gray-300">
                                        <div className="inline-flex w-full justify-between rounded-lg bg-white border border-gray-300 text-gray-900 font-bold text-sm px-4 py-2">
                                            Disetujui GA
                                            <SVGStopCloseCheckCircle tipe={approvGA != null && approvGA['status'] === "APPROVED" ? 'check' : (approvGA != null && approvGA['status'] === "REJECTED" ? 'close' : 'stop')} clas={approvGA != null && approvGA['status'] === "APPROVED" ? "w-5 h-5 text-green-500" : (approvGA != null && approvGA['status'] === "REJECTED" ? "w-5 h-5 text-red-500" : "w-5 h-5 text-gray-300")} />
                                        </div>
                                        {(approvGA != null && approvGA["pegawai"]["name"] != null) &&
                                            <div className="pr-3 pl-3">{approvGA["pegawai"]["name"]}</div>
                                        }
                                        {(approvGA != null && approvGA["komentar"] != null) &&
                                            <div className="pr-3 pl-3 italic">{approvGA["komentar"]}</div>
                                        }
                                    </div>
                                    <div className="mt-2 w-full justify-between rounded-lg bg-white border border-gray-300">
                                        <div className="inline-flex w-full justify-between rounded-lg bg-white border border-gray-300 text-gray-900 font-bold text-sm px-4 py-2">
                                            Disetujui Keuangan
                                            <SVGStopCloseCheckCircle tipe={approvFinance != null && approvFinance['status'] === "READY" ? 'check' : (approvFinance != null && approvFinance['status'] === "REJECTED" ? 'close' : 'stop')} clas={approvFinance != null && approvFinance['status'] === "READY" ? "w-5 h-5 text-green-500" : (approvFinance != null && approvFinance['status'] === "REJECTED" ? "w-5 h-5 text-red-500" : "w-5 h-5 text-gray-300")} />
                                        </div>
                                        {(approvFinance != null && approvFinance["pegawai"]["name"] != null) &&
                                            <div className="pr-3 pl-3">{approvFinance["pegawai"]["name"]}</div>
                                        }
                                        {(approvFinance != null && approvFinance["komentar"] != null) &&
                                            <div className="pr-3 pl-3 italic">{approvFinance["komentar"]}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* === End Form === */}
                            {(reqFuel != null && (reqFuel["status"] === "PROPOSED" || reqFuel["status"] === "APPROVED" || reqFuel === "READY")) &&
                                <div className='p-3 items-end bg-white'>
                                    <button onClick={btnBatal} className="w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                        BATAL
                                    </button>
                                </div>
                            }
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

export default FormRequestFuel;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

