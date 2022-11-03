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

import './FormRequestFuel.css';
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
    pref_pegawai_id, pref_token,
    pref_unit,
} from "../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getJsonPref, getPref } from "../../../helper/preferences";
import moment from "moment";
import SVGStopCloseCheckCircle from "../../Layout/SVGStopCloseCheckCircle";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from "../../../components/Header/DetailHeader";
import {FuelStationAvailableListAPI} from "../../../api/MDForFuel/FuelStation";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const FormRequestFuel: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [token, setToken] = useState("");
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
    const [isLoaded, setIsLoaded] = useState(false);
    const [fuelStation, setFuelStation] = useState([]);

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
        getPref(pref_token).then(res => {
            setToken(res);
            loadStation(res);
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
        const urlContents = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + "/" + id;
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

    const loadStation = (token : any) => {
        FuelStationAvailableListAPI(token).then((res) => {
            setFuelStation(res.data);
        });
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
            subHeader: 'Anda yakin untuk membatalkan Permintaan Bahan Bakar Unit ini?',
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
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_APPROVAL_URI;
        const data = { kupon: { id: sendId }, status: "CANCELED", approveType: "USER", komentar: null, tanggal: (new Date()), pegawai: { id: pegId } } //user diambil dari pref
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
                            subHeader: "Pembatalan Permintaan Bahan Bakar Unit berhasil!",
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
                                <DetailHeader title='Permintaan Bahan Bakar Unit' link='' approval={reqFuel != null ? reqFuel["status"] : "N/A"}></DetailHeader>
                                {/* end Header */}
                                <div className="p-3">
                                    <div className="pt-6">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Permintaan
                                        </label>
                                        <div>
                                            {reqFuel != null ? moment(reqFuel["tanggal"]).format('DD MMM yyyy').toString() : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. Lambung
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["pegawaiUnit"]["unit"]["noLambung"] : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. Polisi
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["pegawaiUnit"]["unit"]["noPol"] : "-"}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Odo Meter pengisian sebelumnya
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["odometerPengisianSebelumnya"] : "N/A"} Km
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Odo saat permintaan
                                        </label>
                                        <div>
                                            {reqFuel != null ? reqFuel["odometerPermintaan"] : "N/A"} Km
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
                                    {(reqFuel != null && (reqFuel["status"] !== "CANCELED" && reqFuel["status"] !== "REJECTED")) &&
                                        <div className="mt-4">
                                            <div onClick={handleOpen}
                                                className="inline-flex w-full justify-between rounded-lg bg-white border border-gray-800 text-gray-900 text-sm px-4 py-2">
                                                Daftar Fuel Station
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                                    className="w-5 h-5">
                                                    <path fill-rule="evenodd"
                                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    }
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
                            {/* === Footer button ===*/}
                            <ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
                                <div className="overflow-hidden rounded-2xl bg-white">
                                    <div className="divide-y pb-6 divide-gray-300">
                                        <p className="font-bold text-gray-900 p-6">
                                            Daftar Stasiun Bahan Bakar
                                        </p>
                                        <div className="w-full px-4 items-center">
                                            {fuelStation.map((req, index) => {
                                                return (
                                                    <p key={index} className="text-sm py-3 font-medium text-gray-900 border-b border-gray-300">{req['nama']}</p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </ActionSheet>

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

