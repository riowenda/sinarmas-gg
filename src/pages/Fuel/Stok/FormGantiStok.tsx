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
import React, {useEffect, useRef, useState} from "react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
    API_URI,
    BASE_API_URL,
    pref_user_id,
    pref_identity,
    TEMP_UNIT_URI,
    TEMP_UNIT_CREATE_URI, pref_token, pref_pegawai_id, DO_REQ_URI, DO_REQ_CREATE
} from "../../../constant/Index";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {getPref} from "../../../helper/preferences";
import moment from 'moment';
import ListHeader from "../../../components/Header/ListHeader";
import TextareaExpand from "react-expanding-textarea";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, {Calendar, utils} from 'react-modern-calendar-datepicker';
import './FormGantiStok.css';
import {CalendarIcon} from "@heroicons/react/24/solid";
import ActionSheet from "actionsheet-react";

//stuktur object dari backend untuk mempermudah maping
const obj = {nomor:"", tanggal:moment(new Date()).format("DD-MM-yyyy"), jumlah:"", keterangan:""}

const FormGantiStok: React.FC = () => {
    const history = useHistory()
    const [error, setError] = useState(null)
    const [pegId, setPegId] = useState("");
    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [present, dismiss] = useIonLoading();
    const [toast] = useIonToast();
    const [showConfirm] = useIonAlert();
    const [presentAlert] = useIonAlert();
    const [req, setReq] = useState(obj);
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [token, setToken] = useState();
    const {t} = useTranslation()
    const location = useLocation();
    const ref = useRef();

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

    const loadDataPref = () => {
        getPref(pref_pegawai_id).then(res => {
            setPegId(res);
        } );
        getPref(pref_user_id).then(res => {
            setUserId(res);
            // setIsLoaded(true);
        } );
        getPref(pref_identity).then(res => {setIdentity(res)});
        getPref(pref_token).then(res => {
            setToken(res);
        });

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const sendRequest = (e : any) => {
        e.preventDefault();

        const loading = present({
            message: 'Memproses permintaan ...',
        })
        // console.log(unit);
        const url = BASE_API_URL + API_URI + DO_REQ_URI + DO_REQ_CREATE;
        const data = {nomor: req.nomor, jumlahRencana: req.jumlah, pembuat: {id: pegId}, fuelStasiun: null, keterangan: req.keterangan}
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity :''},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 'SUCCESS'){
                        showAlertConfirmed();
                    } else {
                        dismiss();
                        showConfirm({
                            //simpan unit id ke pref
                            subHeader: 'Tidak dapat memproses permintaan penggantian stok!',
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
    };

    const showAlertConfirmed = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Berhasil memproses permintaan penggantian stok',
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

    const handleOpen = () => {
        // @ts-ignore
        ref.current.open();
    };

    const handleClose = (val : any) => {
        let a = moment(new Date(""+val.month+"-"+val.day+"-"+val.year)).format("DD-MM-yyyy");
        setReq({...req, tanggal: a})
        setSelectedDay(val);
        // @ts-ignore
        ref.current.close();
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
                                    <div className="relative border-b border-gray-300 py-2">
                                        <input
                                            id="tanggal"
                                            onClick={handleOpen}
                                            required
                                            readOnly
                                            type="text"
                                            name="tanggal"
                                            value={req.tanggal}
                                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="DD-MM-yyyy"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                                            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                        </div>
                                    </div>
                                    <ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
                                        <div className="overflow-hidden rounded-2xl bg-white">
                                            <div className="divide-y divide-gray-300">
                                                <p className="font-bold text-gray-900 p-6">
                                                    Pilih Tanggal Pengiriman
                                                </p>
                                                <div>
                                                    <Calendar
                                                        value={selectedDay}
                                                        onChange={(event) => handleClose(event)}
                                                        calendarClassName="custom-calendar" // and this
                                                        calendarTodayClassName="custom-today-day" // also this
                                                        colorPrimary={"#b91919"}
                                                        shouldHighlightWeekends
                                                        minimumDate={utils("en").getToday()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </ActionSheet>
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
                                        required
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

