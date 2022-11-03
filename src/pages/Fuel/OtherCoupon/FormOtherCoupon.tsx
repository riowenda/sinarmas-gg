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

import './FormOtherCoupon.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, {useEffect, useState } from "react";
import {
    API_URI,
    BASE_API_URL,
    FUEL_REQ_UNIT_CREATE_URI,
    FUEL_REQ_UNIT_URI,
    FUEL_REQ_USER_LAST_REDEM, OTHER_COUPON_URI,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_pegawai_unit_id,
    pref_token,
    pref_unit,
    TEMP_UNIT_CREATE_URI,
    TEMP_UNIT_URI
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import {getJsonPref, getPref} from "../../../helper/preferences";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import SelectItem from "../../../components/SelectWithSearchInModal/SelectItem";
import {PegawaiListSelectAPI} from "../../../api";
import {PegawaiListModalAPI} from "../../../api/MDForFuel/PegawaiList";
import {OtherCouponListModalAPI} from "../../../api/MDForFuel/OtherCoupon";
import {FuelStationListModalAPI} from "../../../api/MDForFuel/FuelStation";
import ListHeader from "../../../components/Header/ListHeader";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const obj = {pemohon:{id:""}, liter: null, tujuan:{id:""}, penjaga:{id:""}, fuelStasiun: {id:""}}
const objPeg = {id:"", nama:""}
const FormOtherCoupon: React.FC = () => {
    const history = useHistory();
    const [unit, setUnit] = useState(userUnit);
    const [photo, setPhoto] = useState<any>(null);
    const [data, setData] = useState<any>(obj);
    const [identity, setIdentity] = useState(null);
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [showConfirm] = useIonAlert();
    const [token, setToken] = useState("");
    const [penjaga, setPenjaga] = useState<any>([]);
    const [stasiun, setStasiun] = useState<any>([]);
    const [other, setOther] = useState<any>([]);
    const [pegId, setPegId] = useState("");
    const [pegawai, setPegawai] = useState<any>({});
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
        getPref(pref_token).then(res => {
            setToken(res);
            loadDataFuelStasiun(res);
            loadDataPenjaga(res);
            loadDataTujuan(res);
        });
        getJsonPref(pref_json_pegawai_info_login).then(res => {setPegawai(res);});
        getPref(pref_identity).then(res => {setIdentity(res);});
        getPref(pref_pegawai_id).then(res => {setPegId(res); setData({...data, pemohon:{id:res}})});
    }

    const loadDataTujuan = (t : string) => {
        OtherCouponListModalAPI(t).then((res) => {
            setOther(res);
        });
    }

    const loadDataPenjaga = (t : string) => {
        PegawaiListModalAPI(t).then((res) => {
            getPref(pref_pegawai_id).then(r => {
                let data: { id: any; nama: any; }[] = [];
                res.map((req: { [x: string]: any; }) => {
                    if(req["name"] != null && req["name"] !== "" && req["id"] !== r) {
                        data.push({id: req["id"], nama: req["name"]});
                    }
                })
                setPenjaga(data);
            });
        });
    }

    const loadDataFuelStasiun = (t : string) => {
        FuelStationListModalAPI(t).then((res) => {
            setStasiun(res);
        });
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

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/req-other/daftar-permintaan");
    }

    const sendRequest = (e : any) => {
        e.preventDefault();

        const loading = present({
            message: 'Memproses permintaan ...',
        })
        // console.log(unit);
        const url = BASE_API_URL + API_URI + OTHER_COUPON_URI + FUEL_REQ_UNIT_CREATE_URI;
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
                            subHeader: "Permintaan Bahan Bakar Non Unit berhasil diajukan!",
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        history.goBack();
                                        // history.push("/fuel/req-other/daftar-permintaan");
                                    }
                                },
                            ],
                        })
                    } else if(result.status === 'VALIDATION'){ // ditolak oleh sistem
                        dismiss();
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: result.message,
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                },
                            ],
                        })
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

    const handleOnChange = (arg:any, tipe:any) => {
        if(tipe === "tujuan"){
            setData({...data, tujuan:{id:arg}})
        }
        if(tipe === "penjaga"){
            setData({...data, penjaga:{id:arg}})
        }
        if(tipe === "stasiun"){
            setData({...data, fuelStasiun:{id:arg}})
        }
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
                        {/* Header */}
                        <ListHeader title={"Form Permintaan Bahan Bakar Non Unit"} isReplace={false} link={""} addButton={false} />
                        {/* end Header */}

                        <div className="p-6">
                            <div>
                                <label className="block text-sm text-gray-400">
                                    Permintaan Untuk
                                </label>
                                <div>
                                    <SelectItem list={other} id={"tujuan"} isName={false} nameComp={"tujuan"} img={"assets/icon/fuel-non-unit-icon.png"} placeholder={"Pilih Tujuan"} handleOnchange={handleOnChange}></SelectItem>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Permintaan Oleh
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    <input
                                        defaultValue={pegawai["name"]}
                                        readOnly
                                        type="text"
                                        name="pegawai"
                                        id="pegawai"
                                        className="block w-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Custodian
                                </label>
                                <div>
                                    <SelectItem list={penjaga} id={"penjaga"} isName={false} nameComp={"penjaga"} img={"assets/icon/operator.png"} placeholder={"Pilih Custodian"} handleOnchange={handleOnChange}></SelectItem>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='liter' className="block text-sm text-gray-400">
                                    Jumlah (Liter)
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    <input
                                        defaultValue={data.liter}
                                        onChange={(event) => setData({...data, liter: Number(event.target.value)})}
                                        required
                                        type="number"
                                        name="liter"
                                        id="liter"
                                        className="block w-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Stasiun Pengisian
                                </label>
                                <div>
                                    <SelectItem list={stasiun} id={"stasiun"} isName={false} nameComp={"stasiun"} img={"assets/icon/fuel-unit-icon.png"} placeholder={"Pilih Stasiun"} handleOnchange={handleOnChange}></SelectItem>
                                </div>
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

export default FormOtherCoupon;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

