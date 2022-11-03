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

//stuktur object dari backend untuk mempermudah maping
const obj = {pegawai: {id: ""}, jenis: {id:"", name:""}, vendor: {id:"", name:""}, type: {id:"", name:""}, spesifikasi: {id:"", name:""}, entity: {id: "", name:""}, no_poll: "", odometer: "", base64: "", odoImgFileName: "", sistemKerja: null, tanggal: new Date()}

const GantiStokDetail: React.FC = () => {
    const history = useHistory()
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [showConfirm] = useIonAlert();
    const [presentAlert] = useIonAlert();
    const [unit, setUnit] = useState(obj);
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
                        setUnit(dt);
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
                body: JSON.stringify(unit)
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
                setUnit({...unit, base64: imgs, odoImgFileName: imgName})
                setToSend(res.base64String);
                setPhoto(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const toBack = () => {
        // history.goBack();
        history.push("/fuel/temp-unit/daftar-permintaan")
    }

    const handleOnChange = (arg:any, tipe:any) => {
        if(tipe === "jenis"){
            setUnit({...unit, jenis:{id:arg, name: ""}})
        }
        if(tipe === "vendor"){
            setUnit({...unit, vendor:{id:arg, name: ""}})
        }
        if(tipe === "tipe"){
            setUnit({...unit, type:{id:arg, name: ""}})
        }
        if(tipe === "spesifikasi"){
            setUnit({...unit, spesifikasi:{id:arg, name: ""}})
        }
        if(tipe === "divisi"){
            setUnit({...unit, entity:{id:arg, name: ""}})
        }
    }

    const handleItemClick = (item : any) => {
        setUnit({...unit, sistemKerja: item['id']});
        // @ts-ignore
        modal.current.dismiss();
    }

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
                                    <label htmlFor='nopol' className="block text-sm text-gray-400">
                                        Nomor Polisi
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={unit.no_poll}
                                            onChange={(event) => setUnit({...unit, no_poll: event.target.value})}
                                            required
                                            type="text"
                                            name="nopol"
                                            id="nopol"
                                            placeholder={"Nomor Polisi pada Mobil"}
                                            autoComplete="given-name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='jenis' className="block text-sm text-gray-400">
                                        Jenis Kendaraan
                                    </label>
                                    <div>
                                        <SelectItem list={jenis} id={"jenis"} isName={true} nameComp={"jenis"} img={""} placeholder={"Pilih Jenis"} handleOnchange={handleOnChange} defaultValue={unit.jenis != null ? unit.jenis['name'] : ""}></SelectItem>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='vendor' className="block text-sm text-gray-400">
                                        Vendor
                                    </label>
                                    <div>
                                        <SelectItem list={vendor} id={"vendor"} isName={true} nameComp={"vendor"} img={""} placeholder={"Pilih Vendor"} handleOnchange={handleOnChange} defaultValue={unit.vendor != null ? unit.vendor['name'] : ""}></SelectItem>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='tipe' className="block text-sm text-gray-400">
                                        Tipe Unit
                                    </label>
                                    <div>
                                        <SelectItem list={tipe} id={"tipe"} isName={true} nameComp={"tipe"} img={""} placeholder={"Pilih Tipe"} handleOnchange={handleOnChange} defaultValue={unit.type != null ? unit.type['name'] : ""}></SelectItem>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='spesifikasi' className="block text-sm text-gray-400">
                                        Spesifikasi
                                    </label>
                                    <div>
                                        <SelectItem list={spesifikasi} id={"spesifikasi"} isName={true} nameComp={"spesifikasi"} img={""} placeholder={"Pilih Spesifikasi"} handleOnchange={handleOnChange} defaultValue={unit.spesifikasi != null ? unit.spesifikasi['name'] : ""}></SelectItem>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='divisi' className="block text-sm text-gray-400">
                                        Divisi
                                    </label>
                                    <div>
                                        <SelectItem list={divisi} id={"divisi"} isName={true} nameComp={"divisi"} img={""} placeholder={"Pilih Divisi"} handleOnchange={handleOnChange} defaultValue={unit.entity != null ? unit.entity['name'] : ""}></SelectItem>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='sistemkerja' className="block text-sm text-gray-400">
                                        Sistem Kerja
                                    </label>
                                    <div className="relative border-b border-gray-300 py-2">
                                        <input
                                            id="open-modal"
                                            readOnly
                                            type="text"
                                            name="sistemKerja"
                                            value={unit.sistemKerja === "SHIFT" ? "Shift" : "Non Shift"}
                                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Pilih Sistem Kerja"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                        </div>
                                    </div>
                                    <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.25} breakpoints={[0, 0.25]}>
                                        <IonContent className="ion-padding">
                                            <IonList>
                                                {sistemKerja.map((item, index) => {
                                                    return (
                                                        <IonItem key={index} id={item["id"]} onClick={(event) => handleItemClick(item)}>
                                                            <IonAvatar slot="start">
                                                                <ClockIcon className="text-red-600"/>
                                                            </IonAvatar>
                                                            <IonLabel>
                                                                <h2>{item["value"]}</h2>
                                                            </IonLabel>
                                                        </IonItem>
                                                    )
                                                })}
                                            </IonList>
                                        </IonContent>
                                    </IonModal>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='tanggal' className="block text-sm text-gray-400">
                                        Tanggal
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={moment(unit.tanggal).format('DD-MM-yyyy').toString()}
                                            readOnly
                                            type="text"
                                            name="tanggal"
                                            id="tanggal"
                                            placeholder={"Tanggal"}
                                            autoComplete="given-name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='odometer' className="block text-sm text-gray-400">
                                        Angka Odometer
                                    </label>
                                    <div className="border-b border-gray-300 py-2">
                                        <input
                                            defaultValue={unit.odometer}
                                            onChange={(event) => setUnit({...unit, odometer: event.target.value})}
                                            required
                                            type="number"
                                            name="odometer"
                                            id="odometer"
                                            placeholder={"Angka Odometer"}
                                            autoComplete="given-name"
                                            className="block w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor='foto' className="block text-sm text-gray-400">
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
                            {/* === Footer button ===*/}
                            <div className='p-6 items-end bg-white'>
                                <button value="Kirim" type="submit" className="w-full items-center mx-auto rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                                    KIRIM
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

export default GantiStokDetail;
defineCustomElements(window);
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

