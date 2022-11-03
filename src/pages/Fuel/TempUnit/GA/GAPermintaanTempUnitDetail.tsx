import {
    IonContent,
    IonImg,
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
import React, { useEffect, useState } from "react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
    API_URI,
    BASE_API_URL,
    pref_user_id,
    pref_identity,
    TEMP_UNIT_URI,
    TEMP_UNIT_CREATE_URI,
    PEGAWAI_UNIT_CRUD_URI,
    PEGAWAI_UNIT_APPROVED_URI,
    TEMP_UNIT_APPROVAL_URI,
    PEGAWAI_UNIT_BY_USER_URI
} from "../../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getPref } from "../../../../helper/preferences";
import moment from 'moment';
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import SkeletonDetail from '../../../Layout/SkeletonDetail';
import DetailHeader from "../../../../components/Header/DetailHeader";

//stuktur object dari backend untuk mempermudah maping
const obj = { pegawai: { id: "", name: "", nik: "", foto: "" }, jenis: { id: "", name: "" }, vendor: { id: "", name: "" }, type: { id: "", name: "" }, spesifikasi: { id: "", name: "" }, entity: { id: "", name: "" }, no_poll: "", odometer: "", base64: "", odoImgFileName: "", status: "", dataFile: "", keterangans: "", daftarAlasan: [] }
const pegUnit = { noPol: "", noLambung: "" }

const GAPermintaanTempUnitDetail: React.FC = () => {
    const [paramId, setParamId] = useState(null)
    const history = useHistory()
    //setGetId(history['location']['state']['id'])
    const [getId, setGetId] = useState<any[]>([])
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [present, dismiss] = useIonLoading();
    const [showConfirm] = useIonAlert();
    const [presentAlert] = useIonAlert();
    const [unit, setUnit] = useState(obj);
    const [pegawaiUnit, setPegawaiUnit] = useState<any>(pegUnit);
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [toast] = useIonToast();
    const { t } = useTranslation()
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

    const loadDataBeforeComplete = () => {
        loadDataPref();
        // @ts-ignore
        const dataId = history.location.state.detail;
        // console.log('idnya ', dataId);
        setParamId(dataId);
        loadData(dataId);
    };

    const loadData = (dataId: any) => {
        const url = BASE_API_URL + API_URI + TEMP_UNIT_URI + "/" + dataId;
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        let imgs = result['data']['dataFile'];
                        let dt = {
                            pegawai: result['data']['pegawai'],
                            jenis: result['data']['jenis'],
                            vendor: result['data']['vendor'],
                            type: result['data']['type'],
                            spesifikasi: result['data']['spesifikasi'],
                            entity: result['data']['entity'],
                            no_poll: result['data']['no_poll'],
                            odometer: result['data']['odometer'],
                            base64: result['data']['base64'],
                            status: result['data']['status'],
                            odoImgFileName: result['data']['odoImgFileName'],
                            dataFile: result['data']['dataFile'],
                            keterangans: result['data']['keterangans'],
                            daftarAlasan: result['data']['keterangans']
                        }
                        setUnit(dt);

                        loadDataPegUnit(result['data']['pegawai']['id']);
                        setIsLoaded(true);
                    } else {
                        setIsLoaded(true);
                        toast({
                            message: "Gagal memuat data!", duration: 1500, position: "top"
                        }
                        );
                    }
                },
                (error) => {
                    setIsLoaded(true);
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                },
            );
    }

    const loadDataPegUnit = async (userId: string) => {
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_BY_USER_URI + "/" + userId;
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        if (result.data.unit != null) {
                            setPegawaiUnit(result.data['unit']);
                        } else {
                            setPegawaiUnit(null);
                        }
                    } else {
                        setPegawaiUnit(null);
                    }
                },
                (error) => {
                    toast({
                        message: "Terjadi kesalahan! [" + error.message + "]", duration: 1500, position: "top"
                    }
                    );
                },
            );
    }

    const loadDataPref = () => {
        // getPref(pref_pegawai_id).then(res => {
        //     setUnit({...unit, pegawai: {id:res}})
        // } );
        getPref(pref_user_id).then(res => {
            setUserId(res);
            // setIsLoaded(true);
        });
        getPref(pref_identity).then(res => { setIdentity(res) });

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const toList = () => {
        // history.goBack();
        history.push('/fuel/temp-unit/ga-daftar-permintaan');
    }

    const acceptReject = (status: string) => {
        let alasan = unit.keterangans;
        let keterangan = "";
        let allowToPush = false;
        // console.log(alasan);
        if (status === "REJECTED") {
            if (alasan !== null && alasan !== "" && alasan.length >= 20) {
                keterangan = "Anda yakin untuk menolak permintaan ganti unit sementara ini?";
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
        const url = BASE_API_URL + API_URI + TEMP_UNIT_URI + TEMP_UNIT_APPROVAL_URI;
        const data = { id: paramId, user: userId, keterangan: unit.keterangans, status: status } //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        showAlertConfirmed(status);
                    } else {
                        dismiss();
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: 'Tidak dapat memproses ' + status === 'REJECTED' ? 'penolakan!' : 'persetujuan!',
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
                        history.goBack();
                        // history.push('/fuel/temp-unit/ga-daftar-permintaan');
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
                                {/* Header */}
                                <DetailHeader title='Permintaan Unit Sementara' link='' approval={unit.status}></DetailHeader>
                                {/* end Header */}

                                <UserCardWithUnit name={unit.pegawai['name']} nik={unit.pegawai['nik']} noLambung={pegawaiUnit != null ? pegawaiUnit['noLambung'] : ""} noPol={pegawaiUnit != null ? pegawaiUnit['noPol'] : ""} foto={unit.pegawai['foto']}></UserCardWithUnit>

                                <div className="p-6 bg-white mt-4">
                                    {unit.status !== "PROPOSED" &&
                                        <div className={unit.status === "APPROVED" ? "float-right text-green-600 font-bold" : "float-right text-red-600 font-bold"}>
                                            {unit.status}
                                        </div>
                                    }
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. Polisi
                                        </label>
                                        <div>
                                            {unit.no_poll}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jenis Kendaraan
                                        </label>
                                        <div>
                                            {unit.jenis['name']}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Vendor
                                        </label>
                                        <div>
                                            {unit.vendor['name']}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tipe Unit
                                        </label>
                                        <div>
                                            {unit.type['name']}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Spesifikasi
                                        </label>
                                        <div>
                                            {unit.spesifikasi != null ? unit.spesifikasi['name'] : ""}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Divisi
                                        </label>
                                        <div>
                                            {unit.entity != null ? unit.entity['name'] : ""}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Sistem Kerja
                                        </label>
                                        sistemkerja
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Tanggal
                                        </label>
                                        {moment(new Date()).format('DD-MM-yyyy').toString()}
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Angka Odometer
                                        </label>
                                        {unit.odometer + " km"}
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            Foto Odometer
                                        </label>
                                        <img src={`${unit.dataFile}`}></img>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            {unit['status'] === 'PROPOSED' ? 'Alasan disetujui/tolak' : 'Keterangan'}
                                        </label>
                                        {unit['status'] === 'PROPOSED' ?
                                            <textarea onChange={(event) => setUnit({ ...unit, keterangans: event.target.value })} rows={3} name="alasan" className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={''} readOnly={unit['status'] === 'PROPOSED' ? false : true} /> :
                                            <div className="pl-1">
                                                {unit.daftarAlasan.map((object, i) =>
                                                    <div>
                                                        <div className="mt-2">
                                                            <label className="block text-sm text-gray-400">
                                                                Oleh: {object['user']}
                                                            </label>
                                                            {object['keterangan']}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* === End Content === */}

                            {/* === Footer button ===*/}
                            <div className='py-6 grid grid-cols-2 bg-white' hidden={unit['status'] === 'PROPOSED' ? false : true}>
                                <div className="pl-6 pr-3">
                                    <button onClick={() => acceptReject("REJECTED")} className="items-center w-full mx-auto rounded-md bg-gray-200 px-3 py-2 text-sm font-bold text-red-700">
                                        TOLAK
                                    </button>
                                </div>
                                <div className="pl-3 pr-6">
                                    <button onClick={() => acceptReject("APPROVED")} className="items-center w-full mx-auto rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white">
                                        DISETUJUI
                                    </button>
                                </div>
                            </div>
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

export default GAPermintaanTempUnitDetail;
defineCustomElements(window);
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

