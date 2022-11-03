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

import './RequestFuel.css';
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
    FUEL_REQ_UNIT_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id, pref_token,
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
import {FuelStationAvailableListAPI, FuelStationListModalAPI} from "../../../../api/MDForFuel/FuelStation";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const sendObj = {id:"", status:"", img:"", filename:"", alasan:"", odometer:0}
const RequestFuel: React.FC = () => {
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
    const [ampunan, setAmpunan] = useState(false);
    const [photo, setPhoto] = useState<any>(null);
    const [realStatus, setRealStatus] = useState("");
    const [kupon, setKupon] = useState(sendObj);
    const [alasanAmpunan, setAlasanAmpunan] = useState(null);
    const [komentarAmpunan, setKomentarAmpunan] = useState(null);
    const [fuelStation, setFuelStation] = useState([]);

    const times = new Date();
    // @ts-ignore
    times.setTime(times.getTime()+(5 * 60000));

    const [expiryTimestamp, setExpiryTimestamp] = useState<any>(times);//
    const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({ expiryTimestamp, onExpire: () => {
        setAmpunan(true); // @ts-ignore
        setReqFuel({ ...reqFuel, status:"ONHOLD" });
    } } );

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
        loadDetail(sendId, token);
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

            // @ts-ignore
            const dataId = history.location.state.detail;
            setSendId(dataId);
            // @ts-ignore
            loadDetail(dataId, res);
        });
    }

    const loadData = () => {
        loadDataPref();
    }

    const loadDetail = (id: any, token: any) => {
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + "/" + id;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);

        fetch(urlContents, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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
                        if(result.data.status === "ONHOLD" || result.data.status === "FORGIVENESS"){
                            setAmpunan(true);
                        }
                        if(result.data.status !== "FILLED"){
                            pause();
                        }
                        setRealStatus(result.data.status);
                        // @ts-ignore
                        let forgivness = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'FORGIVENESS');
                        setAlasanAmpunan(forgivness.length > 0 ? forgivness[0] : null);
                        // @ts-ignore
                        let close = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'CLOSED');
                        setKomentarAmpunan(close.length > 0 ? close[0] : null);
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

    const takePhoto = async () => {
        await Camera.getPhoto({
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
            quality: 30
        })
            .then((res) => {
                console.log(res);
                let imgs = res.base64String;
                let imgName = (new Date().getTime().toString()) + "." + res.format;
                // @ts-ignore
                setKupon({ ...kupon, img: imgs, filename: imgName });
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOpen = () => {
        // @ts-ignore
        ref.current.open();
    };

    const handleClose = () => {
        // @ts-ignore
        ref.current.close();
    };

    const btnBack = () => {
        history.goBack();
        // history.push("/fuel/req-fuel/daftar-permintaan");
    }

    const btnAjukan = (e : any) => {
        e.preventDefault();
        let valid = true;
        let msg = "";
        if(realStatus === "FILLED"){
            if(kupon.alasan == null || kupon.alasan === "" || kupon.alasan.length < 20){
                valid = false;
                msg = "Alasan wajib diisi!";
            }
            if(kupon.img == null){
                valid = false;
                msg = "Foto odometer wajib dilampirkan!";
            }
        } else {
            if(kupon.alasan == null || kupon.alasan === "" || kupon.alasan.length < 20){
                valid = false;
                msg = "Alasan wajib diisi!";
            }
        }
        if(valid) {
            presentAlert({
                subHeader: 'Anda yakin untuk mengajukan ampunan ini?',
                buttons: [
                    {
                        text: 'Tidak',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendAjukan();
                        }
                    },
                ],
            })
        } else {
            toast( {
                    message: msg, duration: 1500, position: "top"
                }
            );
        }
    }

    const sendAjukan = () => {
        const loading = present({
            message: 'Memproses pengajuan ampunan ...',
        })
        if(realStatus === "FILLED"){
            sendConfirmation("CLOSED","selesai");
            pengajuan();
        } else {
            pengajuan();
        }

    }

    const pengajuan = () => {
        const urlContents = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_FORGIVENES_URI;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);
        const data = {id:sendId, alasan:kupon.alasan}

        fetch(urlContents, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then((result) => {
                    dismiss();
                    showConfirm({
                        //simpan unit id ke pref
                        subHeader: "Pengajuan ampunan berhasil dikirim!",
                        buttons: [
                            {
                                text: 'OK',
                                cssClass: 'alert-button-confirm',
                                handler: () => {
                                    loadDetail(sendId, token);
                                    // history.push("/fuel/req-fuel/daftar-permintaan");
                                }
                            },
                        ],
                    })
                },
                (error) => {
                    dismiss();
                    toast( {
                            message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                        }
                    );
                }
            );
    }

    const btnSelesai = (e : any) => {
        e.preventDefault();
        if(photo != null ) {
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
        } else {
            toast( {
                    message: "Foto odometer wajib dilampirkan!", duration: 1500, position: "top"
                }
            );
        }
    }

    const btnPerbaikan = (e : any) => {
        e.preventDefault();
        if(photo != null) {
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
        } else {
            toast( {
                    message: "Foto odometer wajib dilampirkan!", duration: 1500, position: "top"
                }
            );
        }
    }

    const sendConfirmation = (status : any, tipe: any) => {
        const urlContents = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_CONFIRMATION_URI;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);
        const data = {id:sendId, status:status, img:kupon.img, filename:kupon.filename, alasan:""}
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
                                        loadDetail(sendId, token);
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
                                        loadDetail(sendId, token);
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
                                <DetailHeader title={ampunan ? "Permohonan Pengampunan" :"Permintaan Bahan Bakar Unit"} link="" approval={reqFuel != null ? reqFuel['status'] : ""}></DetailHeader>
                                {reqFuel != null && reqFuel["status"] === "READY" ?
                                    <>
                                        <div className="pt-6 pr-3 pl-3 pb-3 font-bold text-center">
                                            {reqFuel['nomor']}
                                        </div>
                                        {reqFuel != null && reqFuel["id"] !== "" ?
                                            <QRCodeWithCountDown texts={"hrgabib_fuel-unit_"+reqFuel["id"]} timer={5} />
                                            : ""}
                                    </>
                                    : ""}
                                <div className="p-3">
                                    <div className="pt-6">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Permintaan
                                        </label>
                                        <div>
                                            {reqFuel != null ? moment(reqFuel["tanggal"]).format('DD MMM yyyy').toString() : "-"}
                                        </div>
                                    </div>
                                    {(reqFuel != null && reqFuel["status"] !== "READY") &&
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                No. Permintaan
                                            </label>
                                            <div>
                                                {reqFuel != null ? reqFuel["nomor"] : "-"}
                                            </div>
                                        </div>
                                    }
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
                                    {(reqFuel != null && reqFuel["status"] !== "READY") &&
                                        <>
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Odometer sebelum permintaan
                                            </label>
                                            <div>
                                                {reqFuel != null ? reqFuel["odometerPengisianSebelumnya"] : "N/A"} Km
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Odometer saat permintaan
                                            </label>
                                            <div>
                                                {reqFuel != null ? reqFuel["odometerPermintaan"] : "N/A"} Km
                                            </div>
                                        </div>
                                        </>
                                    }
                                    {(reqFuel != null && reqFuel["liter"] != null) &&
                                        <div className="mt-4">
                                            <label className="block text-sm text-gray-400">
                                                Jumlah pengisian
                                            </label>
                                            <div>
                                                {reqFuel != null ? reqFuel["liter"] : "N/A"} Liter
                                            </div>
                                        </div>
                                    }

                                    {(reqFuel != null && (reqFuel["status"] === "READY")) &&
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

                                    {(reqFuel != null && (ampunan || reqFuel["status"] === "FILLED" || reqFuel["status"] === "REFILL")) &&
                                        <>
                                            {(reqFuel != null && reqFuel["status"] === "FILLED") &&
                                                <div className="pt-3" style={{textAlign: 'center'}}>
                                                    <div style={{fontSize: '16px'}}>
                                                        <span>{minutes < 10 ? "0" + minutes : minutes}</span>:<span>{seconds < 10 ? "0" + seconds : seconds}</span>
                                                    </div>
                                                </div>
                                            }
                                            <div className="mt-4">
                                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                                    Foto Odometer
                                                </label>
                                                {reqFuel["status"] !== "FILLED" && reqFuel["pengisianDataImg"] != null ?
                                                    <>
                                                        <div
                                                            className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                                            <img className="object-cover pointer-events-none"
                                                                 src={`${reqFuel["pengisianDataImg"]}`}></img>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        {photo ?
                                                            <>
                                                                <div
                                                                    className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                                                    <img className="object-cover pointer-events-none"
                                                                         src={`data:image/jpeg;base64,${photo.base64String}`}></img>
                                                                </div>
                                                            </>
                                                            :
                                                            <div
                                                                className="rounded-md border-2 border-dashed border-gray-300 py-10">
                                                                <>
                                                                    <div className="flex justify-center">
                                                                        <button onClick={() => {
                                                                            takePhoto();
                                                                        }}
                                                                                className="items-center rounded-full bg-slate-800 px-3 py-3 text-white">
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 viewBox="0 0 20 20" fill="currentColor"
                                                                                 className="w-5 h-5">
                                                                                <path fill-rule="evenodd"
                                                                                      d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
                                                                                      clip-rule="evenodd"/>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <p className="mt-1 text-xs text-center text-gray-500">Ambil
                                                                        Foto</p></>
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                                    Odometer saat ini
                                                </label>
                                                <div className="border-b border-gray-300 py-2">
                                                    <input
                                                        onChange={(event) => setKupon({...kupon, odometer: Number(event.target.value)})}
                                                        required
                                                        type="number"
                                                        name="odometer"
                                                        id="odometer"
                                                        className="block w-full"
                                                        readOnly={reqFuel != null && (reqFuel["status"] === "FORGIVENESS" || reqFuel["status"] === "REFILL") ? true : false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4" hidden={reqFuel != null && (reqFuel["status"] === "FILLED" || reqFuel["status"] === "CLOSED" || reqFuel["status"] === "FORGIVENESS") ? true : false}>
                                                <label htmlFor='alasan' className="block text-sm text-gray-400">
                                                    Alasan
                                                </label>
                                                <TextareaExpand
                                                    onChange={(event) => setKupon({ ...kupon, alasan: event.target.value })}
                                                    className="block w-full border-b border-gray-300 py-2"
                                                    id="alasan"
                                                    name="alasan"
                                                />
                                            </div>
                                        </>
                                    }
                                    <div className="mt-4 text-sm text-gray-900" hidden={alasanAmpunan == null ? true : false}>
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Riwayat Ampunan
                                        </label>
                                        <div>
                                            <div className='font-bold'> {alasanAmpunan != null ? alasanAmpunan["status"] : ""} </div>
                                            <div className='italic pl-3'> {alasanAmpunan != null ? alasanAmpunan["komentar"] : ""} </div>
                                        </div>
                                        <div hidden={komentarAmpunan == null ? true : false}>
                                            <div className='font-bold'> {komentarAmpunan != null ? "["+komentarAmpunan["pegawai"]["name"]+"] "+komentarAmpunan["status"] : ""} </div>
                                            <div className='italic pl-3'> {komentarAmpunan != null ? komentarAmpunan["komentar"] : ""} </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* === End Form === */}
                            {(reqFuel != null && reqFuel === "READY") &&
                                <div className='p-6 items-end bg-white'>
                                    <button onClick={btnBatal} className="w-full items-center mx-auto rounded-md bg-red-500 px-3 py-2 text-sm font-bold text-white">
                                        BATAL
                                    </button>
                                </div>
                            }
                            {(() => {
                                if(ampunan) {
                                    return (<>
                                        {(reqFuel != null && reqFuel["status"] === "ONHOLD") ?
                                            <div className='pb-3 pt-3 pl-3 pr-3 items-end bg-white'>
                                                <button onClick={btnAjukan}
                                                        className="w-full items-center mx-auto rounded-md bg-indigo-500 px-3 py-2 text-sm font-bold text-white">
                                                    Ajukan
                                                </button>
                                            </div>
                                            :
                                            <div className='pb-3 pt-3 pl-3 pr-3 items-end bg-white'>
                                                <button onClick={btnBack}
                                                        className="w-full items-center mx-auto rounded-md bg-indigo-500 px-3 py-2 text-sm font-bold text-white">
                                                    OKE
                                                </button>
                                            </div>
                                        }
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

export default RequestFuel;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

