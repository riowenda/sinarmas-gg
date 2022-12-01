import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonLoading,
    useIonAlert,
    useIonToast,
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave,
    useIonViewDidLeave
} from '@ionic/react';

import './FuelHome.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
    API_URI,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI, pref_identity,
    pref_json_pegawai_info_login, pref_json_simper, pref_pegawai_unit_id, pref_token,
    pref_unit, pref_unit_id
} from "../../../constant/Index";

import { useHistory, useLocation } from "react-router-dom";
import {getFuelMenu, getJsonPref, getPref, removePref, setJsonPref, setPref} from "../../../helper/Preferences"
import ListHeader from "../../../components/Header/ListHeader";
import FuelHomeComponent from "./FuelHomeComponent";
import {BaseAPI} from "../../../api/ApiManager";
import {PegawaiSimperAPI} from "../../../api";

const user = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };
const FuelHome: React.FC = () => {
    const [unit, setUnit] = useState<any>(userUnit);
    const [pegawai, setPegawai] = useState(user);
    const [pegawaiUnitId, setPegawaiUnitId] = useState<any>("");
    const [presentAlert] = useIonAlert();
    const [showConfirm] = useIonAlert();
    const [toast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [identity, setIdentity] = useState("");
    const [token, setToken] = useState("");
    const [menu, setMenu] = useState();
    const [simper, setSimper] = useState<any>();
    const [allowOperation, setAllowOperation] = useState<boolean>(false);

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
        getPref(pref_token).then(tkn => {
            setToken(tkn);
        });
        getPref(pref_identity).then(i => {
            setIdentity(i);
        });
        console.log("MDForFuel home ")
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
            getSimper(res.nik);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_unit_id).then(res => {
            setPegawaiUnitId(res);
        });
        getFuelMenu().then(menu => {
            // @ts-ignore
            setMenu(menu);
        });
    }

    const getSimper = (nik: any) => {
        PegawaiSimperAPI(nik).then(s => {
            console.log(s);
            try{
                let msg = s["message"];
                if(msg == null){
                    console.log("xxxxx")
                    allowTransaction(s);
                } else {
                    console.log("zzzz")
                    allowTransaction(null);
                }
            }catch (error) {
                setJsonPref(pref_json_simper, null).then(r => r);
                allowTransaction(null);
            }
        }).catch(e => {
            getJsonPref(pref_json_simper).then(s => {
                allowTransaction(s);
            })
        })
    }

    const allowTransaction = (data : any) => {
        let dt = {nomor: null, tanggal: null, isExpired: true, allowFuelUnitOperation: false, adaSimper: false}
        if(data != null){
            let registerNumber = data['registerNumber'];
            let expDate = data['expDate'];
            let exp = new Date(expDate);
            let now = new Date();
            let isExpired = (exp < now);
            dt = {nomor: registerNumber, tanggal: expDate, isExpired: isExpired, allowFuelUnitOperation: !isExpired, adaSimper: true}
            setAllowOperation(!isExpired);
            setSimper(dt);
            setJsonPref(pref_json_simper,data).then(r => r);
        }else{
            setJsonPref(pref_json_simper,dt).then(r => r);
            setAllowOperation(false);
            setSimper(dt);
        }
    }

    const handleOnClick = () => {
        lepasUnit();
    }

    const lepasUnit = () => {
        let keterangan = "Anda yakin ingin melepas Unit?";
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
                        console.log("sini");
                        sendRequest();
                    }
                },
            ],
        })
    };

    const sendRequest = () => {
        const loading = present({
            message: 'Memproses permintaan ...',
            backdropDismiss: false
        })
        const url = BaseAPI() + API_URI + PEGAWAI_UNIT_CRUD_URI + PEGAWAI_UNIT_RELEASED_URI;

        // @ts-ignore
        const data = { id: pegawaiUnitId }
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Identity': identity, 'Authorization':`Bearer ${token}` },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 'SUCCESS') {
                        dismiss();
                        showAlertConfirmed();
                    } else {
                        dismiss();
                        showConfirm({
                            subHeader: 'Tidak dapat memproses pelepasan unit',
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

    const showAlertConfirmed = () => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: 'Berhasil melepas unit. Silahkan memilih unit kembali!',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        removePref(pref_unit).then(r => {
                            setUnit(null);
                        });
                        removePref(pref_unit_id).then(r => {
                            setPegawaiUnitId(null);
                        });
                        removePref(pref_pegawai_unit_id).then(r => r);
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

                <div className="bg-red-700">
                    {/* Header */}
                    <ListHeader title={t('header.menu_fuel_unit')} isReplace={false} link={""} addButton={false} />
                    {/* End Header */}

                    <div className="bg-white pb-2 px-2">
                        <FuelHomeComponent data={unit} auth={menu} hanldeOnClick={handleOnClick} simper={simper} allowOperateUnit={allowOperation} />
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default FuelHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

