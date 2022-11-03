import {
    IonAvatar, IonButton,
    IonContent, IonImg, IonItem, IonLabel, IonList, IonModal,
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
import React, {useEffect, useRef, useState} from "react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
    API_URI,
    BASE_API_URL,
    PEGAWAI_UNIT_CRUD_URI,
    pref_user_id,
    pref_identity,
    TEMP_UNIT_URI,
    TEMP_UNIT_CREATE_URI, PEGAWAI_UNIT_BY_USER_URI, pref_pegawai_id, pref_token
} from "../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getPref} from "../../../helper/preferences";
import moment from 'moment';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import {SistemKerjaListModalAPI} from "../../../api/MDForFuel/SistemKerja";
import {DivisiListModalAPI} from "../../../api/MDForFuel/DivisiList";
import {JenisKendaraanListModalAPI} from "../../../api/MDForFuel/JenisKendaraan";
import {SpesifikasiListModalAPI} from "../../../api/MDForFuel/SpesifikasiUnit";
import {TipeUnitListModalAPI} from "../../../api/MDForFuel/TipeUnit";
import {VendorListModalAPI} from "../../../api/MDForFuel/VendorList";
import ListHeader from "../../../components/Header/ListHeader";
import SelectItem from "../../../components/SelectWithSearchInModal/SelectItem";
import {ChevronDownIcon, ClockIcon, MagnifyingGlassCircleIcon} from "@heroicons/react/24/solid";
import TextareaExpand from "react-expanding-textarea";
import keterangan from "../../GACare/components/Keterangan";

//stuktur object dari backend untuk mempermudah maping
const obj = {nomor:"", tanggal:"",jumlah:"", keterangan:""}

const FormGantiStok: React.FC = () => {
    const history = useHistory()
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [showConfirm] = useIonAlert();
    const [presentAlert] = useIonAlert();
    const [req, setReq] = useState(obj);
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const id = useParams<any[]>();
    const [photo, setPhoto] = useState<any>(null);
    const [toSend, setToSend] = useState<any>(null);
    const [divisi, setDivisi] = useState<any>([]);
    const [jenis, setJenis] = useState<any>([]);
    const [sistemKerja, setSistemKerja] = useState<any[]>([]);
    const [spesifikasi, setSpesifikasi] = useState<any>([]);
    const [tipe, setTipe] = useState<any>([]);
    const [vendor, setVendor] = useState<any>([]);
    const {t} = useTranslation()
    const location = useLocation();
    const modal = useRef<HTMLIonModalElement>(null);
    const [isOpen, setIsOpen] = useState(false);

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
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPegawaiUnitSebelumnya = (dataId : string) => {
        const url = BASE_API_URL + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_BY_USER_URI + "/" + dataId;
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.data != null) {
                        let dt = {
                            pegawai: {id: dataId},
                            jenis: result['data']['unit']['jenisUnit'],
                            vendor: result['data']['unit']['vendor'],
                            type: result['data']['unit']['tipeUnit'],
                            spesifikasi: result['data']['unit']['spesifikasiUnit'],
                            sistemKerja: result['data']['unit']['sistemKerja'],
                            entity: result['data']['unit']['departemen'],
                            no_poll: "",
                            odometer: "",
                            base64: "",
                            odoImgFileName: "",
                            tanggal: new Date()
                        }
                        // @ts-ignore
                        setReq(dt);
                    }
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    }

    const loadDataPref = () => {
        // getPref(pref_pegawai_id).then(res => {
        //     setUnit({...unit, pegawai: {id:res}})
        // } );
        getPref(pref_user_id).then(res => {
            setUserId(res);
            loadDataPegawaiUnitSebelumnya(res);
            // setIsLoaded(true);
        } );
        getPref(pref_identity).then(res => {setIdentity(res)});
        getPref(pref_token).then(res => {
            SistemKerjaListModalAPI(res).then((res) => {
                setSistemKerja(res);
            });
            DivisiListModalAPI(res).then((res) => {
                setDivisi(res);
            });
            JenisKendaraanListModalAPI(res).then((res) => {
                setJenis(res);
            });
            SpesifikasiListModalAPI(res).then((res) => {
                setSpesifikasi(res);
            });
            TipeUnitListModalAPI(res).then((res) => {
                setTipe(res);
            });
            VendorListModalAPI(res).then((res) => {
                setVendor(res);
            });
        });

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const sendRequest = (e : any) => {
        e.preventDefault();
        if(photo){
            const loading = present({
                message: 'Memproses permintaan ...',
            })
            // console.log(unit);
            const url = BASE_API_URL + API_URI + TEMP_UNIT_URI + TEMP_UNIT_CREATE_URI;
            // const data = {pegawai: {id: ""}, jenis: {id:""}, vendor: {id:""}, type: {id:""}, spesifikasi: {id:""}, entity: {id: ""}, no_poll: "", odometer: ""}
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
                body: JSON.stringify(req)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result.status === 'SUCCESS'){
                            showAlertConfirmed();
                        } else if(result.status === 'FAILED'){ // ditolak oleh sistem
                            dismiss();
                            showConfirm({
                                //simpan unit id ke pref
                                header: 'Ditolak oleh sistem',
                                subHeader: result.message,
                                buttons: [
                                    {
                                        text: 'OK',
                                        cssClass: 'alert-button-confirm',
                                    },
                                ],
                            })
                        } else {
                            dismiss();
                            showConfirm({
                                //simpan unit id ke pref
                                subHeader: 'Tidak dapat memproses permintaan unit sementara',
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

    const showAlertConfirmed = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Berhasil memproses permintaan unit sementara',
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        history.goBack();
                        // history.push("/fuel/temp-unit/daftar-permintaan");
                    }
                },
            ],
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
                let imgName = (new Date().getTime().toString())+"."+res.format;
                // @ts-ignore
                setReq({...unit, base64: imgs, odoImgFileName: imgName})
                setToSend(res.base64String);
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">
                    {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}
                    <div>
                        {/* === Start Header === */}
                        <ListHeader title={"Form Penggantian Stok"} isReplace={false} link={""} addButton={false} />
                        {/* === End Header ===*/}

                        {/* === Start Form ===*/}
                        <form onSubmit={sendRequest}>
                            <div className="p-6">
                                <div>
                                    <label htmlFor='noref' className="block text-sm text-gray-400">
                                        No Ref/PO
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={req.nomor}
                                            onChange={(event) => setReq({...req, nomor: event.target.value})}
                                            required
                                            type="text"
                                            name="noref"
                                            id="noref"
                                            placeholder={"Nomor Ref/PO"}
                                            autoComplete="given-name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='tanggal' className="block text-sm text-gray-400">
                                        Tanggal Pengiriman
                                    </label>
                                    <div>
                                        txt_tanggal
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='jumlah' className="block text-sm text-gray-400">
                                        Jumlah (Liter)
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={req.jumlah}
                                            onChange={(event) => setReq({...req, jumlah: event.target.value})}
                                            required
                                            type="number"
                                            name="jumlah"
                                            id="jumlah"
                                            placeholder={"Jumlah"}
                                            autoComplete="given-name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='keterangan' className="block text-sm text-gray-400">
                                        Keterangan
                                    </label>
                                    <TextareaExpand
                                        onChange={(event) => setReq({...req, keterangan: event.target.value})}
                                        className="block w-full border-b border-gray-300 py-2"
                                        id="keterangan"
                                        name="keterangan"
                                    />
                                </div>
                            </div>
                            {/* === Footer button ===*/}
                            <div className='p-6 items-end bg-white'>
                                <button value="Kirim" type="submit" className="w-full items-center mx-auto rounded-md bg-indigo-500 px-3 py-2 text-sm font-bold text-white">
                                    AJUKAN
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* === End Form ===*/}
                    {/*</div>*/}
                </div>

            </IonContent>
        </IonPage>
    );
};

export default FormGantiStok;
defineCustomElements(window);
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

