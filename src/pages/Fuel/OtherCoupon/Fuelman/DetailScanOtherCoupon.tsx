import {
    IonContent,
    IonFooter,
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

import './DetailScanOtherCoupon.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ActionSheet from "actionsheet-react";
import {
    API_URI,
    BASE_API_URL,
    FUEL_REQ_FUELMAN_FILL_URI,
    FUEL_REQ_UNIT_APPROVAL_URI,
    FUEL_REQ_UNIT_URI, OTHER_COUPON_FUELMAN_FILL_URI,
    OTHER_COUPON_URI, pref_fuel_station_id,
    pref_identity,
    pref_json_pegawai_info_login,
    pref_pegawai_id,
    pref_unit,
} from "../../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getJsonPref, getPref} from "../../../../helper/preferences";
import moment from "moment";
import UserCardWithUnit from "../../../Layout/UserCardWithUnit";
import DetailHeader from "../../../../components/Header/DetailHeader";

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const send = {id:"", fuelman:"", liter:null}
const obj = {id:"", pemohon: {id: "", name:"", nik:"", foto: ""}, nomor: "", tanggalPermintaan: null, liter: null, literPengisian:null, fuelman: {id:"",name:""}, penjaga:{id:"",name:""}, status: "", fuelStasiun: {id:"", nama: ""}, riwayats: []}
const DetailScanOtherCoupon: React.FC = () => {
    const [getId, setGetId] = useState<string>();
    const [identity, setIdentity] = useState("");
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState(userUnit);
    const [pegId, setPegId] = useState("");
    const [stasiunId, setStasiunId] = useState("");
    const reqId = useParams<any[]>();
    const [presentAlert] = useIonAlert();
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const id = useParams<any[]>();
    const [reqFuel, setReqFuel] = useState(obj);
    const [showConfirm] = useIonAlert();
    const [filled, setFilled] = useState<any>(send);
    const [approvGA, setApprovGA] = useState(null);

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
        loadData()
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
        loadDetail(getId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = (id:any) => {
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
        loadDetail(id);
        getPref(pref_fuel_station_id).then(res => {
            setStasiunId(res);
        })
    }

    const loadData = () => {
        // @ts-ignore
        let id = history.location.state.detail;
        // let id = "31c67a44-f317-40b7-b300-551b8d4f838a";
        setGetId(id);
        // console.log("sini ",id);
        loadDataPref(id);
    }

    const loadDetail = (id:any) => {
        console.log("okj "+id);
        // @ts-ignore
        const urlContents = BASE_API_URL + API_URI + OTHER_COUPON_URI + "/" + id;
        //const url = BASE_API_URL + API_URI + P2H_ITEM_URI;
        // console.log("URL: " + urlContents);

        fetch(urlContents, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === "SUCCESS"){
                        setReqFuel(result.data);
                        setFilled(result.data.literPengisian)
                        let riwayats = result.data.riwayats;
                        // @ts-ignore
                        let appGa = riwayats.filter((x: { [x: string]: { [x: string]: null; }; }) => x['approveType'] == 'GA');
                        setApprovGA(appGa.length > 0 ? appGa[0] : null);
                    }
                },
                (error) => {
                    //setIsLoaded(true);
                    //setError(error);
                }
            );
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
        // history.go();
        history.push("/dashboard2");
    }

    const btnSelesai = (e : any) => {
        e.preventDefault();
        presentAlert({
            subHeader: 'Anda yakin untuk menyelesaikan pengisian Bahan Bakar Non Unit ini?',
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
            message: 'Memproses penyelesaian ...',
        })
        const url = BASE_API_URL + API_URI + OTHER_COUPON_URI + OTHER_COUPON_FUELMAN_FILL_URI;
        const data = {id:getId, fuelman:pegId, liter:filled.literPengisian, stasiun: stasiunId} //user diambil dari pref
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity ? identity : ''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    dismiss();
                    if(result.status === "SUCCESS") {
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: "Pengisian Bahan Bakar Non Unit berhasil!",
                            buttons: [
                                {
                                    text: 'OK',
                                    cssClass: 'alert-button-confirm',
                                    handler: () => {
                                        loadDetail(getId);
                                    }
                                },
                            ],
                        })
                    } else {
                        toast( {
                                message: "Terjadi kesalahan! ["+result.message+"]", duration: 1500, position: "top"
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

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white flex flex-col min-h-screen justify-between">
                <form onSubmit={btnSelesai}>
                    {/* === Start Form  === */}
                    <div>
                        {/* Header */}
                        <DetailHeader title='Permintaan Bahan Bakar Non Unit' link='' approval={reqFuel.status}></DetailHeader>
                        {/* end Header */}

                        {/*<UserCardWithUnit name={unit.pegawai['name']} nik={unit.pegawai['nik']} noLambung={pegawaiUnit != null ? pegawaiUnit['noLambung'] : ""} noPol={pegawaiUnit != null ? pegawaiUnit['noPol'] : ""} foto={unit.pegawai['foto']}></UserCardWithUnit>*/}
                        {/*<UserCardWithUnit name={"-"} nik={"-"} noLambung={"-"} noPol={""} foto={""}></UserCardWithUnit>*/}
                        <div className="p-3">
                            <div className="pt-6">
                                <label className="block text-sm text-gray-400">
                                    Tanggal Permintaan
                                </label>
                                <div>
                                    {moment(reqFuel.tanggalPermintaan).format('DD MMM yyyy').toString()}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    No. Permintaan
                                </label>
                                <div>
                                    {reqFuel.nomor}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Permintaan Oleh
                                </label>
                                <div>
                                    {reqFuel.pemohon.name}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Custodian
                                </label>
                                <div>
                                    {reqFuel.penjaga.name}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Jumlah
                                </label>
                                <div>
                                    {reqFuel.liter} liter
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Stasiun Pengisian
                                </label>
                                <div>
                                    {reqFuel.fuelStasiun.nama}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor='odometer' className="block text-sm text-gray-400">
                                    Disetujui GA
                                </label>
                                <div>
                                    {approvGA != null ? approvGA['pegawai']['name'] : "N/A"}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-400">
                                    Jumlah Fuel (Liter)
                                </label>
                                <div className="border-b border-gray-300 py-2">
                                    <input
                                        defaultValue={filled.literPengisian != null ? filled.literPengisian : ""}
                                        onChange={(event) => setFilled({...filled, literPengisian: event.target.value})}
                                        required
                                        type="number"
                                        name="liter"
                                        id="liter"
                                        readOnly={reqFuel != null && (reqFuel["status"] === "FILLED") ? true : false}
                                        className="block w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* === End Form === */}
                    {(reqFuel != null && ((reqFuel["status"] !== "CLOSED" && reqFuel["status"] !== "FILLED"))) &&
                        <div className='p-6 items-end bg-white'>
                            <button type="submit" className="w-full items-center mx-auto rounded-md bg-blue-500 px-3 py-2 text-sm font-bold text-white">
                                SELESAI
                            </button>
                        </div>
                    }
                </form>
                </div>

            </IonContent>
        </IonPage>

    );

};

export default DetailScanOtherCoupon;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

