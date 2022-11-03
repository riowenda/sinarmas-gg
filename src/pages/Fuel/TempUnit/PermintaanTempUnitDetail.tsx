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
    PEGAWAI_UNIT_CRUD_URI,
    TEMP_UNIT_APPROVAL_URI,
    PEGAWAI_UNIT_BY_USER_URI
} from "../../../constant/Index";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getPref } from "../../../helper/preferences";
import moment from 'moment';
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from "../../../components/Header/DetailHeader";

//stuktur object dari backend untuk mempermudah maping
const obj = { pegawai: { id: "", name: "", nik: "", foto: "" }, jenis: { id: "", name: "" }, vendor: { id: "", name: "" }, type: { id: "", name: "" }, spesifikasi: { id: "", name: "" }, entity: { id: "", name: "" }, no_poll: "", sistemKerja:"", odometer: "", base64: "", odoImgFileName: "", status: "", dataFile: "", keterangans: "", daftarAlasan: [] }

const PermintaanTempUnitDetail: React.FC = () => {
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
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const id = useParams<any[]>();
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
        console.log('idnya ', dataId);
        loadData(dataId);
    };

    const loadData = (dataId: any) => {
        // @ts-ignore
        setGetId(dataId);
        // @ts-ignore
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
                            daftarAlasan: result['data']['keterangans'],
                            sistemKerja: result['data']['sistemKerja']
                        }
                        setUnit(dt);
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
        history.goBack();
        // history.push('/fuel/temp-unit/daftar-permintaan');
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
                                {/* End Header */}
                                <div className="p-6 bg-white">
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
                                        {unit.sistemKerja === "SHIFT" ? "Shift" : "Non Shift"}
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
                                        <div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                            <img className="object-cover pointer-events-none" src={`${unit.dataFile}`} ></img>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label htmlFor='odometer' className="block text-sm text-gray-400">
                                            {unit['status'] !== 'PROPOSED' ? 'Alasan disetujui/tolak' : 'Keterangan'}
                                        </label>
                                        {unit['status'] !== 'PROPOSED' ?
                                            <textarea onChange={(event) => setUnit({ ...unit, keterangans: event.target.value })} rows={3} name="alasan" className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={''} readOnly={unit['status'] !== 'PROPOSED' ? false : true} /> :
                                            <div className="pl-1">
                                                {unit.daftarAlasan != null ? unit.daftarAlasan.map((object, i) =>
                                                    <div>
                                                        <div className="mt-2">
                                                            <label className="block text-sm text-gray-400">
                                                                Oleh: {object['user']}
                                                            </label>
                                                            {object['keterangan']}
                                                        </div>
                                                    </div>
                                                ) : ""}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* === End Content === */}

                            {/* === Footer button ===*/}
                            <div className='py-6 grid bg-white'>
                                <div className="pl-4 pr-4">
                                    <button onClick={() => toList()} className="items-center w-full mx-auto rounded-md bg-blue-500 px-3 py-2 text-sm font-bold text-white">
                                        OKE
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

export default PermintaanTempUnitDetail;
defineCustomElements(window);
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

