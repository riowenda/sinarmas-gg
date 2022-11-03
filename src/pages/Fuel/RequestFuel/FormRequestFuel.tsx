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
import React, {useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL, FUEL_REQ_UNIT_CREATE_URI, FUEL_REQ_UNIT_URI, FUEL_REQ_USER_LAST_REDEM, pref_identity,
    pref_json_pegawai_info_login, pref_pegawai_unit_id, pref_unit, TEMP_UNIT_CREATE_URI, TEMP_UNIT_URI
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import {getJsonPref, getPref} from "../../../helper/preferences";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import ListHeader from "../../../components/Header/ListHeader";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const obj = {pegawaiUnit:{id:""}, odometerPermintaan: null, odometerPermintaanImg: null, odometerPengisianSebelumnya: 0, odometerPengisian: 0, odometerPengisianImg: null, status: null, riwayats: null, permintaanDataImg: null, pengisianDataImg: null}
const FormRequestFuel: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [photo, setPhoto] = useState<any>(null);
    const [data, setData] = useState<any>(obj);
    const [identity, setIdentity] = useState(null);
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [showConfirm] = useIonAlert();
    const [lastOdo, setLastOdo] = useState<any>("N/A");
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
        getPref(pref_identity).then(res => {setIdentity(res);});
        getPref(pref_pegawai_unit_id).then(rest => {
            if(rest == null || rest === ""){
                showConfirm({
                    //simpan unit id ke pref
                    subHeader: "Silahkan memilih unit terlebih dahulu!",
                    buttons: [
                        {
                            text: 'OK',
                            cssClass: 'alert-button-confirm',
                            handler: () => {
                                history.push("/fuel/unit/ganti");
                            }
                        },
                    ],
                })
            } else {
                loadDataLastRequest(rest);
            }
        });
    }

    const loadDataLastRequest = (user: any) => {
        const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_USER_LAST_REDEM + "/" + user;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.success === true) {
                        setData({...data, odometerPengisianSebelumnya: 0, pegawaiUnit: {id:user}});
                    }
                    if(result.status === "SUCCESS") {
                        setData({...data, odometerPengisianSebelumnya: result.data.odometerPengisian, pegawaiUnit: {id:user}});
                        setLastOdo(result.message ? 0 : result.data.odometerPengisian);
                        // perlu dipastikan apakah ambil data dari odometer permintaan atau odometer pengisian?
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    toast( {
                            message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                        }
                    );
                }
            )
    }

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
                setData({ ...data, permintaanDataImg: imgs, odometerPermintaanImg: imgName });
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const btnDetailReqFuel = () => {
        history.push("/fuel/req-fuel/detail/:id");
    };

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/req-fuel/daftar-permintaan");
    }

    const sendRequest = (e : any) => {
        e.preventDefault();
        if(photo){
            const loading = present({
                message: 'Memproses permintaan ...',
            })
            // console.log(unit);
            const url = BASE_API_URL + API_URI + FUEL_REQ_UNIT_URI + FUEL_REQ_UNIT_CREATE_URI;
            // const data = {pegawai: {id: ""}, jenis: {id:""}, vendor: {id:""}, type: {id:""}, spesifikasi: {id:""}, entity: {id: ""}, no_poll: "", odometer: ""}
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        dismiss();
                        if(result.status === 'SUCCESS'){
                            showConfirm({
                                //simpan unit id ke pref
                                subHeader: "Permintaan Bahan Bakar Unit berhasil diajukan!",
                                buttons: [
                                    {
                                        text: 'OK',
                                        cssClass: 'alert-button-confirm',
                                        handler: () => {
                                            history.goBack();
                                            // history.push("/fuel/req-fuel/daftar-permintaan");
                                        }
                                    },
                                ],
                            })
                        } else if(result.status === 'VALIDATION'){ // ditolak oleh sistem
                            dismiss();
                            if(result.message === 'Harap melakukan p2h'){
                                showAlertConfirmed();
                            } else if (result.message.includes("Max")) {
                                showAlertMaxOdo();
                            } else {
                                showOkConfirm(result.message);
                            }

                        } else if(result.status === 'FAILED'){ // ditolak oleh sistem
                            dismiss();

                        } else {
                            dismiss();
                            toast( {
                                    message: "Terjadi kesalahan!", duration: 1500, position: "top"
                                }
                            );
                        }
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        dismiss();
                        toast( {
                                message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                            }
                        );
                    }
                )
        } else {
            toast( {
                    message: "Foto harus disertakan", duration: 1500, position: "top"
                }
            );
        }

    };

    const showOkConfirm = (msg : any) => {
        showConfirm({
            //simpan unit id ke pref
            subHeader: msg,
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                },
            ],
        })
    }

    const showAlertConfirmed = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Anda belum mengisi form P2H, isi sekarang?',
            buttons: [
                {
                    text: 'Batal',
                    cssClass: 'alert-button-cancel',
                    handler: () => {
                        history.goBack();
                        // history.push("/fuel/homepage");
                    }
                },
                {
                    text: 'Ya',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        history.replace("/fuel/p2h/p2hlist");
                    }
                },
            ],
        })
    }

    const showAlertMaxOdo = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Odometer unit pada unit ini tidak wajar, harap ganti unit atau minta GA update!',
            buttons: [
                {
                    text: 'Minta GA Update',
                    cssClass: 'alert-button-cancel',
                    handler: () => {
                        // history.goBack();
                        history.replace("/fuel/perbaikan-odo");
                    }
                },
                {
                    text: 'Ganti Unit',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        history.replace("/fuel/unit/ganti");
                    }
                },
            ],
        })
    }

    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">

                    {/* === Start Form  === */}
                    <form onSubmit={sendRequest}>
                    <div>
                        {/* === Start Header === */}
                        <ListHeader title={"Form Permintaan Bahan Bakar"} isReplace={false} link={""} addButton={false} />
                        {/* === End Header ===*/}

                        <div className="p-6">
                            <div>
                                <label className="block text-sm text-gray-400">
                                    No. Lambung
                                </label>
                                <div>
                                    {unit ? unit['noLambung'] : "-"}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Polisi
                                </label>
                                <div>
                                    {unit ? unit['noPol'] : "-"}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Odometer pengisian sebelumnya
                                </label>
                                <div>
                                    {lastOdo ? lastOdo : "N/A"} Km
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Odometer Saat Permintaan
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    <input
                                        defaultValue={data.odometerPermintaan}
                                        onChange={(event) => setData({...data, odometerPermintaan: Number(event.target.value)})}
                                        required
                                        type="number"
                                        name="odometer"
                                        id="odometer"
                                        className="block w-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Foto Odometer
                                </label>
                                {photo ?
                                    <><div className="group block rounded-lg aspect-auto bg-gray-100 overflow-hidden">
                                        <img className="object-cover pointer-events-none" src={`data:image/jpeg;base64,${photo.base64String}`} ></img>
                                    </div></>
                                    :
                                    <div className="rounded-md border-2 border-dashed border-gray-300 py-10">
                                        <><div className="flex justify-center">
                                            <button onClick={() => {
                                                takePhoto();
                                            }}
                                                className="items-center rounded-full bg-slate-800 px-3 py-3 text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fill-rule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div><p className="mt-1 text-xs text-center text-gray-500">Ambil Foto</p></>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    {/*<button onClick={btnDetailReqFuel}>*/}
                    {/*    Detail*/}
                    {/*</button>*/}
                    {/* === End Form === */}

                    {/* === Footer button ===*/}
                    <div className='p-6 items-end bg-white'>
                        <button className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                            KIRIM
                        </button>
                    </div>
                    </form>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default FormRequestFuel;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

