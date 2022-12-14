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

import './GaApprovalRequestFuel.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
    API_URI,
    FUEL_REQ_UNIT_APPROVAL_URI, FUEL_REQ_UNIT_GA_FORGIVEN_URL, FUEL_REQ_UNIT_URI, IMAGE_FUEL_URI,
    pref_identity, pref_pegawai_id,
    pref_user_id, TEMP_UNIT_APPROVAL_URI, TEMP_UNIT_URI,
} from "../../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import { getPref } from "../../../../helper/Preferences";
import TextareaExpand from 'react-expanding-textarea';
import moment from "moment";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import SkeletonDetail from '../../../Layout/SkeletonDetail';
import DetailHeader from "../../../../components/Header/DetailHeader";
import {BaseAPI} from "../../../../api/ApiManager";

const obj = {id:"", pegawaiUnit: {id: "", unit: {id: "", noLambung: "", noPol: ""}}, nomor: "", tanggal: null, liter: null, odometerPermintaan: null, odometerPermintaanImg: null, odometerPengisianSebelumnya: null, odometerPengisian: null, odometerPengisianImg: null, status: null, fuelStasiun: null, fuelMan: null, riwayats: [], permintaanDataImg: null, pengisianDataImg: null}
const peg = {id:"", name:"", nik:"", foto:""};
const data = {kupon:{id:""}, status:"", approveType: "", komentar:"", tanggal: (new Date()), pegawai: {id:""}}
const objForgiven = {id:"", ga:"", komentar:""}

const GaApprovalRequestFuel: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [pegId, setPegId] = useState("")
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState(obj);
    const [pegReq, setPegReq] = useState(peg);
    const [present, dismiss] = useIonLoading();
    const [showConfirm] = useIonAlert();
    const [presentAlert] = useIonAlert();
    const [toast] = useIonToast();
    const { t } = useTranslation();
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const id = useParams<any[]>();
    const [approv, setApprov] = useState(data);
    const location = useLocation();
    const [forgiven, setForgiven] = useState(objForgiven);
    const [alasanAmpunan, setAlasanAmpunan] = useState(null);
    const [komentarAmpunan, setKomentarAmpunan] = useState(null);

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
        loadDataBeforeComplete()
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
        loadDataBeforeComplete();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
    }

    const loadDataBeforeComplete = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        setGetId(dataId);
        loadDataPermintaan(dataId);
    };

    const loadDataPermintaan = (id: any) => {
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + "/" + id;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result.data);
                    setItems(result.data);
                    let pu = result.data.pegawaiUnit;
                    let puList = pu.unit.pegawaiUnit;
                    let puReq = puList.filter((x: { [x: string]: { [x: string]: null; }; }) => x['id'] == pu.id);
                    let pegawai = puReq[0].pegawai;
                    let riwayats = result.data.riwayats;
                    setPegReq(pegawai);
                    setIsLoaded(true);
                    // @ts-ignore
                    let forgivness = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'FORGIVENESS');
                    setAlasanAmpunan(forgivness.length > 0 ? forgivness[0] : null);
                    // @ts-ignore
                    let close = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['status'] == 'CLOSED');
                    setKomentarAmpunan(close.length > 0 ? close[0] : null);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const btnBack = () => {
        history.goBack();
        // history.push("/fuel/req-fuel/ga-daftar-permintaan");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const acceptReject = (status: string) => {
        let alasan = approv.komentar;
        let keterangan = "";
        let allowToPush = false;
        // console.log(alasan);
        if (status === "REJECTED") {
            if (alasan !== null && alasan !== "" && alasan.length >= 20) {
                keterangan = "Anda yakin untuk menolak permintaan bahan bakar unit ini?";
                allowToPush = true;
            } else {
                toast({
                    message: "Alasan wajib diisi!",
                    duration: 1500,
                    position: "top"
                });
            }
        } else {
            keterangan = "Anda yakin untuk menyetujui permintaan ini?";
            allowToPush = true;
        }
        if (allowToPush) {
            presentAlert({
                subHeader: keterangan,
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Batal',
                        cssClass: 'alert-button-cancel',
                    },
                    {
                        text: 'Ya',
                        cssClass: 'alert-button-confirm',
                        handler: () => {
                            sendRequestApprovement(status);
                        }
                    },
                ],
            })
        }
    }

    const sendRequestApprovement = (status: any) => {
        const loading = present({
            message: 'Memproses ' + status === 'REJECTED' ? 'penolakan' : 'persetujuan' + ' ...',
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_APPROVAL_URI;
        const body = {kupon:{id:getId}, status:status, approveType: "GA", komentar:approv.komentar, tanggal: (new Date()), pegawai: {id:pegId}};
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        showAlertConfirmed(status);
                    } else {
                        let keterangan = status === 'REJECTED' ?'penolakan!' : 'persetujuan!';
                        dismiss();
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: ('Tidak dapat memproses ' + keterangan),
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

    const showAlertConfirmed = (status: any) => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: '' + ("Berhasil memproses " + (status === "REJECTED" ? "Penolakan." : "Persetujuan.")) + '',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        btnBack();
                    }
                },
            ],
        })
    }

    const acceptAmpunan = () => {
        presentAlert({
            subHeader: "Anda yakin untuk menyelesaikan ampunan ini?",
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Batal',
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: 'Ya',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        kirimAmpunan();
                    }
                },
            ],
        })
    }

    const kirimAmpunan = () => {
        const loading = present({
            message: 'Memproses persetujuan ampunan ...',
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_GA_FORGIVEN_URL;
        const body = {id:getId, ga:pegId, komentar:forgiven.komentar};
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if (result.status === 'SUCCESS') {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Persetujuan ampunan berhasil!",
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDataPermintaan(getId);
                                    }
                                },
                            ],
                        })
                    } else {
                        dismiss();
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Tidak dapat memproses persetujuan!",
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
    }

    return (

        <IonPage>
            {isLoaded?
            <>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                    {/* === Start Content  === */}
                    <div>
                        <DetailHeader title={items.status === "FORGIVENES" ? "Permohonan Ampunan" : "Permintaan Bahan Bakar"} link='' approval={items.status}></DetailHeader>

                        <UserCardWithUnit name={pegReq.name} nik={pegReq.nik} noLambung={items.pegawaiUnit.unit.noLambung} noPol={items.pegawaiUnit.unit.noPol} foto={pegReq.foto}></UserCardWithUnit>

                        <div className="p-6 bg-white mt-4">
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Tanggal Permintaan
                                </label>
                                <div>
                                    {moment(items["tanggal"]).format('DD MMM yyyy').toString()}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Permintaan
                                </label>
                                <div>
                                    {items.nomor}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Lambung
                                </label>
                                <div>
                                    {items.pegawaiUnit.unit.noLambung}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Polisi
                                </label>
                                <div>
                                    {items.pegawaiUnit.unit.noPol}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Odometer pengisian sebelumnya
                                </label>
                                <div>
                                    {items.odometerPengisianSebelumnya} Km
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Odometer saat permintaan
                                </label>
                                <div>
                                    {items.odometerPermintaan} Km
                                </div>
                            </div>

                            {(items.status !== "PROPOSED" && items.odometerPengisian != null) &&
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Odometer saat pengisian
                                </label>
                                <div>
                                    {items.odometerPengisian} Km
                                </div>
                            </div>
                            }

                            <div hidden={items.status !== "PROPOSED" ? false : false} className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Foto Odometer
                                </label>
                                <div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                    <img className="object-cover pointer-events-none" src={`${BaseAPI()}${API_URI}${IMAGE_FUEL_URI}${items.odometerPengisianImg != null ? items.odometerPengisianImg : items.odometerPermintaanImg}`} ></img>
                                </div>
                            </div>

                            {items.status === "FORGIVENESS" &&
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan
                                    </label>
                                    <div>
                                        {alasanAmpunan != null ? alasanAmpunan["komentar"] : ""}
                                    </div>
                                </div>
                            }

                            {items.status === "CLOSED" &&
                                <div className="mt-4 text-sm text-gray-900" hidden={alasanAmpunan == null ? true : false}>
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Riwayat Ampunan
                                    </label>
                                    <div>
                                        <div className='font-bold'> {alasanAmpunan != null ? alasanAmpunan["status"] : ""} </div>
                                        <div className='italic pl-3'> {alasanAmpunan != null ? alasanAmpunan["komentar"] : ""} </div>
                                    </div>
                                    {komentarAmpunan != null &&
                                        <div hidden={komentarAmpunan == null ? true : false}>
                                            {komentarAmpunan['pegawai'] != null &&
                                                <div
                                                    className='font-bold'>{ "["+komentarAmpunan["pegawai"]["name"]+ "] " + komentarAmpunan["status"] } </div>
                                            }
                                            <div
                                                className='italic pl-3'> {komentarAmpunan != null ? komentarAmpunan["komentar"] : ""} </div>
                                        </div>
                                    }
                                </div>
                            }

                            {items.status === "PROPOSED" &&
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan disetujui/tolak
                                    </label>
                                    <TextareaExpand
                                        onChange={(event) => setApprov({...approv, komentar: event.target.value})}
                                        className="block w-full border-b border-gray-300 py-2"
                                        id="keterangan"
                                        name="keterangan"
                                    />
                                </div>
                            }

                            {items.status === "FORGIVENESS" &&
                                <div className="mt-4">
                                    <label htmlFor='komentar' className="block text-sm text-gray-400">
                                        Komentar
                                    </label>
                                    <TextareaExpand
                                        onChange={(event) => setForgiven({...forgiven, komentar: event.target.value})}
                                        className="block w-full border-b border-gray-300 py-2"
                                        id="komentar"
                                        name="komentar"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    {/* === End Content === */}

                    {/* === Footer button ===*/}
                    {(items.status === "PROPOSED" || items.status === "FORGIVENESS")?
                        <>
                            <div className='py-6 grid grid-cols-2 bg-white' hidden={items.status !== "PROPOSED" ? true : false}>
                                <div className="pl-6 pr-3">
                                    <button onClick={() => acceptReject("REJECTED")}
                                            className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                        TOLAK
                                    </button>
                                </div>
                                <div className="pl-3 pr-6">
                                    <button onClick={() => acceptReject("APPROVED")}
                                            className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                        DISETUJUI
                                    </button>
                                </div>
                            </div>
                            <div className='py-6 bg-white' hidden={items.status !== "PROPOSED" ? false : true}>
                                <div className="pl-3 pr-3">
                                    <button onClick={() => acceptAmpunan()}
                                            className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                        DISETUJUI
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        <></>
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

export default GaApprovalRequestFuel;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

