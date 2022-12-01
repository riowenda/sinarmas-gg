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

import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {
    API_URI,
    FUEL_REQ_UNIT_URI, IMAGE_FUEL_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id, pref_token,
    pref_unit, UPDATE_ODO_APPROVAL_GA_URI, UPDATE_ODO_DETAIL_URI,
} from "../../../../constant/Index";
import {useHistory} from "react-router-dom";
import {getJsonPref, getPref} from "../../../../helper/Preferences";
import TextareaExpand from "react-expanding-textarea";
import DetailHeader from "../../../../components/Header/DetailHeader";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import SkeletonDetail from "../../../Layout/SkeletonDetail";
import {BaseAPI} from "../../../../api/ApiManager";
import moment from "moment";

const userInfo = {name: "", nik: "", imageUrl: ""}
const userUnit = {id: "", noPol: "", noLambung: "", vendor: {name: ""}, jenisUnit: {name: ""}};
const GADetailUpdateOdo: React.FC = () => {
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
    const [showConfirm] = useIonAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const [photo, setPhoto] = useState<any>(null);
    const [odo, setOdo] = useState<any>();
    const [komentar, setKomentar] = useState<any>("");

    const {t} = useTranslation();

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
        loadDataLastRequest(sendId, token);
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

            // @ts-ignore
            const dataId = history.location.state.detail;
            setSendId(dataId);
            loadDataLastRequest(dataId, res);
        });
    }

    const loadData = () => {
        loadDataPref();
    }

    const loadDataLastRequest = (id: any, t: string) => {
        console.log("puid", user)
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + UPDATE_ODO_DETAIL_URI +"/"+id;
        fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Identity': identity ? identity : '', 'Authorization': `Bearer ${t}`}
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log("result", result)
                    // console.log(result.data);
                    // console.log(result.data);
                    let data = result.data;
                    if(data != null && !data.isEmpty){
                        //     // @ts-ignore
                        //     let sortByDate = data.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                        //     // console.log(sortByDate)
                        //     setOriData(sortByDate);
                        setOdo(data);
                    }
                    setIsLoaded(true);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                }
            )
    }

    const acceptReject = (status: string) => {
        let alasan = komentar;
        let keterangan = "";
        let allowToPush = false;
        // console.log(alasan);
        if (status === "REJECTED") {
            if (alasan !== null && alasan !== "" && alasan.length >= 20) {
                keterangan = "Anda yakin untuk menolak permintaan ini?";
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
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + UPDATE_ODO_APPROVAL_GA_URI;
        const body = {perbaikan:sendId, status:status, keterangan: komentar, approver: pegId};
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

    const btnBack = () => {
        history.goBack();
    }

    return (
        <IonPage>
            {isLoaded?
                <>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className=" bg-white flex flex-col min-h-screen justify-between">

                    {/* === Start Form  === */}
                    <div>
                        <DetailHeader title='Update Odometer' link={""} approval={odo != null ? odo['status'] : "PROPOSED"}></DetailHeader>
                        {(odo != null && odo['requester'] != null) &&
                            <div className="rounded-lg bg-white drop-shadow-md">
                                <UserCardWithUnit name={odo['requester']['name']} nik={odo['requester']['nik']} withUnit={false} noLambung={""} noPol={""} foto={odo['requester']['foto']}></UserCardWithUnit>
                            </div>
                        }
                        <div className="p-6">
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Tanggal Permintaan
                                </label>
                                <div>
                                    {odo != null ? moment(odo['tanggal']).format('DD MMM yyyy').toString() : "-"}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Permintaan
                                </label>
                                <div>
                                    {odo != null ? odo['nomor'] : "-"}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Lambung
                                </label>
                                <div>
                                    {odo != null ? odo['kupon']['pegawaiUnit']['unit']['noLambung'] : ""}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Polisi
                                </label>
                                <div>
                                    {odo != null ? odo['kupon']['pegawaiUnit']['unit']['noPol'] : ""}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Odometer Pengisian Sebelumnya
                                </label>
                                <div>
                                    {odo != null ? odo['odometerSebelumnya'] : "0"} Km
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Odometer Saat Permintaan
                                </label>
                                <div>
                                    {odo != null ? odo['odometerPerbaikan'] : "0"} Km
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Alasan
                                </label>
                                <div>
                                    {odo != null ? odo['alasan'] : ""}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Foto Odometer
                                </label>
                                <div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                    {(odo != null && odo['odometerImg'] != null) &&
                                        <img className="object-cover pointer-events-none"
                                             src={`${BaseAPI()}${API_URI}${IMAGE_FUEL_URI}${odo['odometerImg']}`}></img>
                                    }
                                </div>
                            </div>

                            {(odo != null && odo['status'] == "PROPOSED") &&
                                <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Alasan disetujui/tolak
                                </label>
                                <TextareaExpand
                                    onChange={(event) => setKomentar(event.target.value)}
                                    className="block w-full border-b border-gray-300 py-2"
                                    id="keterangan"
                                    name="keterangan"
                                />
                            </div>
                            }
                            {(odo != null && odo['status'] !== "PROPOSED") &&
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Alasan disetujui/tolak
                                    </label>
                                    <div>
                                        {odo != null ? odo['keterangan'] : ""}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {/* === End Form === */}
                    {(odo != null && odo['status'] === "PROPOSED")?
                        <>
                            <div className='py-6 grid grid-cols-2 bg-white'>
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
                        </>
                        :
                        <></>
                    }
                </div>

            </IonContent>
                </> : <>
                    {
                        <SkeletonDetail />
                    }
                </>
            }
        </IonPage>

    );

};

export default GADetailUpdateOdo;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

