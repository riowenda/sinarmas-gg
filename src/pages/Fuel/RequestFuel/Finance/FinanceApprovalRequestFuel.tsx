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

import './FinanceApprovalRequestFuel.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL, FUEL_REQ_UNIT_APPROVAL_URI, FUEL_REQ_UNIT_URI,
    pref_identity, pref_pegawai_id,
    pref_user_id, TEMP_UNIT_APPROVAL_URI, TEMP_UNIT_URI,
} from "../../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import { getPref } from "../../../../helper/preferences";
import TextareaExpand from 'react-expanding-textarea';
import moment from "moment";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import DetailHeader from "../../../../components/Header/DetailHeader";
import SkeletonDetail from "../../../Layout/SkeletonDetail";

const obj = {id:"", pegawaiUnit: {id: "", unit: {id: "", noLambung: "", noPol: ""}}, nomor: "", tanggal: null, liter: null, odometerPermintaan: null, odometerPermintaanImg: null, odometerPengisianSebelumnya: null, odometerPengisian: null, odometerPengisianImg: null, status: null, fuelStasiun: null, fuelMan: null, riwayats: [], permintaanDataImg: null, pengisianDataImg: null}
const peg = {id:"", name:"", nik:"", foto:""};
const data = {kupon:{id:""}, status:"", approveType: "", komentar:"", tanggal: (new Date()), pegawai: {id:""}}

const FinanceApprovalRequestFuel: React.FC = () => {
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
    const [approvGA, setApprovGA] = useState(null);
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
        setIsLoaded(false);
        loadDataPref();
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
        // @ts-ignore
        const dataId = history.location.state.detail;
        setGetId(dataId);
        loadDataPermintaan(dataId);
    }

    const loadDataPermintaan = (id: any) => {
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + "/" + id;
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
                    setPegReq(pegawai);
                    setIsLoaded(true);
                    let riwayats = result.data.riwayats;
                    // @ts-ignore
                    let appGa = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'GA');
                    setApprovGA(appGa.length > 0 ? appGa[0] : null);
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
        // history.push("/fuel/req-fuel/finance-daftar-permintaan");
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
        })
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_APPROVAL_URI;
        const body = {kupon:{id:getId}, status:status, approveType: "FINANCE", komentar:approv.komentar, tanggal: (new Date()), pegawai: {id:pegId}};
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
                        <DetailHeader title={"Permintaan Bahan Bakar"} link='' approval={items.status}></DetailHeader>

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

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Disetujui GA
                                </label>
                                <div>
                                    {approvGA != null ? approvGA['pegawai']['name'] : "-"}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Foto Odometer
                                </label>
                                <img src={`${items.permintaanDataImg}`}></img>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Alasan disetujui/tolak
                                </label>
                                <TextareaExpand
                                    onChange={(event) => setApprov({ ...approv, komentar: event.target.value })}
                                    className="block w-full border-b border-gray-300 py-2"
                                    id="keterangan"
                                    name="keterangan"
                                />
                            </div>
                        </div>
                    </div>
                    {/* === End Content === */}

                    {/* === Footer button ===*/}
                    <div className='py-6 grid grid-cols-2 bg-white'>
                        <div className="pl-6 pr-3">
                            <button onClick={() => acceptReject("REJECTED")} className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                TOLAK
                            </button>
                        </div>
                        <div className="pl-3 pr-6">
                            <button onClick={() => acceptReject("READY")} className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                DISETUJUI
                            </button>
                        </div>
                    </div>
                </div>
            </IonContent></>
                : <>
                    {
                        <SkeletonDetail />
                    }

                </>}
        </IonPage>

    );
};

export default FinanceApprovalRequestFuel;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

