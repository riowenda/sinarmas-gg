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
    FUEL_REQ_UNIT_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id, pref_pegawai_unit_id, pref_token,
    pref_unit, UPDATE_ODO_CREATE_URI,
} from "../../../constant/Index";
import {useHistory} from "react-router-dom";
import {getJsonPref, getPref} from "../../../helper/Preferences";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import TextareaExpand from "react-expanding-textarea";
import ListHeader from "../../../components/Header/ListHeader";
import {lastRedeemCoupon} from "../../../api";
import {BaseAPI} from "../../../api/ApiManager";

const userInfo = {name: "", nik: "", imageUrl: ""}
const userUnit = {id: "", noPol: "", noLambung: "", vendor: {name: ""}, jenisUnit: {name: ""}};
const sendObj = {kupon: {id:""}, odometerPerbaikan:"", alasan: "", base64:"", requester:{id:""}, odometerImg: 0}
const FormUpdateOdo: React.FC = () => {
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
    const [odo, setOdo] = useState(sendObj);
    const [lastRedeem, setLastRedeem] = useState<any>();

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
        loadDataLastRequest(sendId);
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
            getPref(pref_pegawai_unit_id).then(rest => {
                loadDataLastRequest(rest);
            });
        });
    }

    const loadData = () => {
        loadDataPref();
    }

    const loadDataLastRequest = (user: any) => {
        console.log("puid", user)
        lastRedeemCoupon(user).then((res) => {
            setLastRedeem(res.data);
            setOdo({...odo, kupon: {id:res.data.id}});
        }).catch((error) => {
            console.log('error', error)
            toast( {
                    message: "Terjadi kesalahan! ["+error.message+"]", duration: 1500, position: "top"
                }
            );
        })
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
                setOdo({...odo, base64: imgs, odometerImg: imgName});
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const kirimData = () => {
        const loading = present({
            message: 'Memproses permintaan ...',
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + UPDATE_ODO_CREATE_URI;
        const data = {
            kupon: {id: odo.kupon.id},
            odometerPerbaikan: odo.odometerPerbaikan,
            alasan: odo.alasan,
            requester: {id: pegId},
            base64: odo.base64,
            odometerImg: odo.odometerImg
        } //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity ? identity : ''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if (result.status === "SUCCESS") {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Permintaan Update Odometer berhasil!",
                            backdropDismiss: false,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        // loadDetail(sendId, token);
                                        history.goBack();
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
    }

    const sendRequest = (e : any) => {
        e.preventDefault();
        if(odo.alasan != null && odo.alasan.length > 20){
            presentAlert({
                subHeader: 'Anda yakin untuk mengirim permintaan ini?',
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
                            kirimData();
                        }
                    },
                ],
            })
        } else {
            toast({
                    message: "Alasan minimal 20 karakter!", duration: 1500, position: "top"
                }
            );
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className=" bg-white flex flex-col min-h-screen justify-between">

                    {/* === Start Form  === */}
                    <form onSubmit={sendRequest}>
                    <div>
                        <ListHeader title={"Form Update Odometer"} isReplace={false} link={""} addButton={false} />
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
                                    Kilometer Terakhir
                                </label>
                                <div>
                                    {lastRedeem != null ? lastRedeem['odometerPengisian'] : "0"} Km
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Kilometer Aktual
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    <input
                                        defaultValue={"0123 tes"}
                                        onChange={(event) => setOdo({...odo, odometerPerbaikan: event.target.value})}
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
                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Alasan
                                </label>
                                <TextareaExpand
                                    onChange={(event) => setOdo({...odo, alasan: event.target.value})}
                                    className="block w-full border-b border-gray-300 py-2"
                                    id="keterangan"
                                    name="keterangan"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    {/* === End Form === */}
                    <div className='p-6 items-end bg-white'>
                        <button
                                className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                            KIRIM
                        </button>
                    </div>
                    </form>
                </div>

            </IonContent>
            {/* {isLoaded ?
                <>
                    
                </>
                : <>
                    {
                        <SkeletonDetail />
                    }
                </>} */}
        </IonPage>

    );

};

export default FormUpdateOdo;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

