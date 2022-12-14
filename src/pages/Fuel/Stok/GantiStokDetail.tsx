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
import React, { useRef, useState } from "react";
import {
    API_URI, AUTH_FUEL_FINANCE, AUTH_FUEL_GA,
    FUEL_REQ_UNIT_APPROVAL_URI, FUEL_REQ_UNIT_URI, pref_identity,
    pref_pegawai_id
} from "../../../constant/Index";
import { useHistory } from "react-router-dom";
import {getFuelMenu, getPref} from "../../../helper/Preferences";
import moment from "moment";
import SkeletonDetail from '../../Layout/SkeletonDetail';
import DetailHeader from '../../../components/Header/DetailHeader';
import {DO} from "../../../api/PODOFuelAPI/DO";
import {BaseAPI} from "../../../api/ApiManager";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const GantiStokDetail: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [token, setToken] = useState("");
    const [pegId, setPegId] = useState("");
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [sendId, setSendId] = useState("");
    const [showConfirm] = useIonAlert();
    const [isLoaded, setIsLoaded] = useState(false)
    const [po, setPo] = useState<any>();
    const [dos, setDos] = useState([]);
    const { t } = useTranslation();
    const [role, setRole] = useState("");

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
        loadDataPermintaan(sendId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        // @ts-ignore
        const dataId = history.location.state.detail;
        setSendId(dataId);

        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_pegawai_id).then(res => { setPegId(res); });
        loadDataPermintaan(dataId);
        getFuelMenu().then(menu => {
            let restRole = "";

            if(menu.includes(AUTH_FUEL_GA)){
                restRole = 'GA';
            } else if(menu.includes(AUTH_FUEL_FINANCE)){
                restRole = 'FINANCE';
            }

            // @ts-ignore
            setRole(restRole);


        });
    }

    const loadDataPermintaan = (id: string) => {
        let data = DO("detail", id).then(result => {
            try {
                if(result.status === "SUCCESS") {
                    let data = result.data;
                    setPo(data);
                }
            } catch (error) {

            }
            setIsLoaded(true);
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

    const btnDetailDO = (id:string) => {
        // history.goBack();
        history.push({
            pathname: "/fuel/do/detail/" + id,
            state: { detail: id }
        });
    }

    const btnBatal = () => {
        presentAlert({
            subHeader: 'Anda yakin untuk membatalkan Permintaan Bahan Bakar Unit ini?',
            backdropDismiss: false,
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
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_APPROVAL_URI;
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
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDataPermintaan(sendId);
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
                        <div className="bg-gray-100 flex flex-col min-h-screen justify-between">

                            {/* === Start Content  === */}
                            <div>
                                <DetailHeader title={"Penggantian Stok"} link='/fuel/po' approval={po['status']}></DetailHeader>


                                <div className="p-6 bg-white">
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            DO ID
                                        </label>
                                        <div>
                                            {po['nomor'] !== '' ? po['nomor'] : "-"}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            No. DO
                                        </label>
                                        <div>
                                            {po['ref'] !== '' ? po['ref'] : "-"}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Tanggal Pengiriman
                                        </label>
                                        <div>
                                            {po['tanggalRencana'] !== '' ? moment(po['tanggalRencana']).format('DD MMM yyyy').toString() : "-"}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Jumlah
                                        </label>
                                        <div>
                                            {po['jumlahRencana'] !== '' ? po['jumlahRencana'] : "-"} liter
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm text-gray-400">
                                            Keterangan
                                        </label>
                                        <div>
                                            {po['alasan'] !== '' ? po['alasan'] : "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* === End Content === */}

                            {/* === Footer button ===*/}
                            {role === "GA" &&
                                <div className='py-6 bg-white'>
                                    <div className="pl-3 pr-6">
                                        <button
                                            className="items-center w-full mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                                            SELESAI
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>

                    </IonContent>
                </>
                :
                <>
                    <SkeletonDetail />
                </>
            }
        </IonPage>

    );

};

export default GantiStokDetail;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

