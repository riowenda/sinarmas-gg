import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    useIonAlert, useIonLoading, useIonToast,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import './GAFuelHome.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    pref_json_pegawai_info_login,
    AUTH_FUEL_GA,
    AUTH_FUEL_FINANCE,
    pref_unit,
    PEGAWAI_UNIT_CRUD_URI,
    PEGAWAI_UNIT_RELEASED_URI,
    pref_unit_id,
    pref_pegawai_unit_id,
    AUTH_FUEL_REQUEST,
    AUTH_FUEL_LOGISTIC,
    pref_token,
    pref_identity,
    AUTH_FUEL_OTHER_REQUEST,
    pref_json_simper
} from "../../../constant/Index";
import { useHistory } from "react-router-dom";
import {getFuelMenu, getJsonPref, getPref, removePref, setJsonPref} from "../../../helper/Preferences";
import ListHeader from "../../../components/Header/ListHeader";
import FuelHomeComponent from './FuelHomeComponent';
import {
    CountChange,
    CountDO,
    CountFuel,
    CountOdo, CountOtherFuel,
    CountP2H,
    CountPO,
    CountTemporary
} from "../../../api/KuponAPI/CountApi";
import LogisticFuelHomeComponent from "./LogisticFuelHomeComponent";
import {PO} from "../../../api/PODOFuelAPI/PO";
import {DO} from "../../../api/PODOFuelAPI/DO";
import {BaseAPI} from "../../../api/ApiManager";
import {PegawaiSimperAPI} from "../../../api";

const user = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };

const GAFuelHome: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [unit, setUnit] = useState<any>(userUnit);
    const [pegawai, setPegawai] = useState(user);
    const [countP2H, setCountP2H] = useState<number>(0);
    const [countGantiUnit, setCountGantiUnit] = useState<number>(0);
    const [countTempUnit, setCountTempUnit] = useState<number>(0);
    const [countFuelUnit, setCountFuelUnit] = useState<number>(0);
    const [countFuelNonUnit, setCountFuelNonUnit] = useState<number>(0);
    const [countFinFuelUnit, setCountFinFuelUnit] = useState<number>(0);
    const [countFinFuelNonUnit, setCountFinFuelNonUnit] = useState<number>(0);
    const [countOdo, setCountOdo] = useState<number>(0);
    const [countPo, setCountPo] = useState<number>(0);
    const [countDo, setCountDo] = useState<number>(0);
    const [logCountPo, setLogCountPo] = useState<number>(0);
    const [logCountDo, setLogCountDo] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [role, setRole] = useState();
    const [selectedSegment, setSelectedSegment] = useState();
    const [pegawaiUnitId, setPegawaiUnitId] = useState<any>("");
    const [presentAlert] = useIonAlert();
    const [showConfirm] = useIonAlert();
    const [toast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [identity, setIdentity] = useState("");
    const [token, setToken] = useState("");
    const [menu, setMenu] = useState<any>();
    const [countMenu, setCountMenu] = useState(0);
    const [simper, setSimper] = useState<any>();
    const [allowOperation, setAllowOperation] = useState<boolean>(false);

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
        getPref(pref_token).then(tkn => {
            setToken(tkn);
        });
        getPref(pref_identity).then(i => {
            setIdentity(i);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
            getSimper(res.nik);
        });
        getPref(pref_pegawai_unit_id).then(res => {
            setPegawaiUnitId(res);
        });
        getFuelMenu().then(menu => {
            let restRole = "";

            if(menu.includes(AUTH_FUEL_GA)){
                restRole = 'GA';
                // @ts-ignore
                setSelectedSegment('request');
            } else if(menu.includes(AUTH_FUEL_FINANCE)){
                restRole = 'FINANCE';
                // @ts-ignore
                setSelectedSegment('finance');
            } else if(menu.includes(AUTH_FUEL_LOGISTIC)){
                restRole = 'LOGISTIC';
                // @ts-ignore
                setSelectedSegment('logistic');
            }

            countMenuUser(menu);

            // console.log(menu)
            // @ts-ignore
            setMenu(menu);

            // @ts-ignore
            setRole(restRole);

            if (restRole === 'GA') {
                loadDataP2H();
                loadDataTempUnit();
                loadDataGantiUnit();
                loadDataFuelUnit(restRole);
                loadDataFuelNonUnit(restRole);
                loadDataOdo();
                loadDataPo();
                loadDataDo();
            }
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

    const countMenuUser = (menus : any) => {
        let m = 0;
        if(menus.includes(AUTH_FUEL_GA)){
            m = m + 1;
        }
        if(menus.includes(AUTH_FUEL_FINANCE)){
            m = m + 1;
            loadDataFuelUnit("FINANCE");
            loadDataFuelNonUnit("FINANCE");
        }
        if(menus.includes(AUTH_FUEL_LOGISTIC)){
            m = m + 1;
            getCountPo();
            getCountDo();
        }
        if(menus.includes(AUTH_FUEL_REQUEST) || menus.includes(AUTH_FUEL_OTHER_REQUEST) ){
            m = m + 1;
        }
        setCountMenu(m);
    }

    const getCountPo = () => {
        let data = PO("count_open", "").then(result => {
            console.log(result);
            if(result){
                try {
                    // @ts-ignore
                    setLogCountPo(result.data);
                } catch (error) {

                }
            }
        });
    }

    const getCountDo = () => {
        let data = DO("count_open", "").then(result => {
            // console.log(result);
            if(result){
                try {
                    // @ts-ignore
                    setLogCountDo(result.data);
                } catch (error) {

                }
            }
        });
    }

    const loadDataOdo = () => {
        CountOdo().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountOdo(data.data);
            } else {
                setCountOdo(0);
            }
        });
    }

    const loadDataPo = () => {
        CountPO().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountPo(data.data);
            } else {
                setCountPo(0);
            }
        });
    }

    const loadDataDo = () => {
        CountDO().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountDo(data.data);
            } else {
                setCountDo(0);
            }
        });
    }

    const loadDataGantiUnit = () => {
        CountChange().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountGantiUnit(data.data);
            } else {
                setCountGantiUnit(0);
            }
        });
    }

    const loadDataP2H = () => {
        CountP2H().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountP2H(data.data);
            } else {
                setCountP2H(0);
            }
        });
    }

    const loadDataTempUnit = () => {
        CountTemporary().then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                setCountTempUnit(data.data);
            } else {
                setCountTempUnit(0);
            }
        });
    }

    const loadDataFuelUnit = (role: any) => {
        CountFuel(role).then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                if(role === "GA") {
                    setCountFuelUnit(data.data);
                } else {
                    setCountFinFuelUnit(data.data);
                }
            } else {
                if(role === "GA") {
                    setCountFuelUnit(0);
                } else {
                    setCountFinFuelUnit(0);
                }
            }
        });
    }

    const loadDataFuelNonUnit = (role: any) => {
        CountOtherFuel(role).then((data) => {
            if (data.status === "SUCCESS" && data.message === "") {
                if(role === "GA") {
                    setCountFuelNonUnit(data.data);
                } else {
                    setCountFinFuelNonUnit(data.data);
                }
            } else {
                if(role === "GA") {
                    setCountFuelNonUnit(0);
                } else {
                    setCountFinFuelNonUnit(0);
                }
            }
        });
    }

    const btnDaftarPermintaanUnitSementara = () => {
        history.push("/fuel/temp-unit/ga-daftar-permintaan");
    };
    const btnDaftarPermintaanP2H = () => {
        history.push("/fuel/p2h/gap2hlist");
    };
    const btnDaftarPermintaanGantiUnit = () => {
        history.push("/fuel/ga/unit/daftar-permintaan");
    };
    const btnListReqFuel = () => {
        history.push("/fuel/req-fuel/ga-daftar-permintaan");
    };
    const btnListNonFuel = () => {
        history.push("/fuel/req-other/ga-daftar-permintaan");
    };
    const btnListFinReqFuel = () => {
        history.push("/fuel/req-fuel/finance-daftar-permintaan");
    };
    const btnListFinNonFuel = () => {
        history.push("/fuel/req-other/finance-daftar-permintaan");
    };

    const btnListPO = () => {
        // history.goBack();
        history.push("/fuel/po");
    }

    const btnListOdo = () => {
        // history.goBack();
        history.push("/fuel/ga-list-perbaikan-odo");
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/dashboard");
    }

    const segmentChanged = (event: any) => {
        // history.goBack();
        setSelectedSegment(event);

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
                    {/* end Header */}
                    {countMenu > 1 &&
                        <IonSegment color="light" onIonChange={(e: any) => segmentChanged(e.target.value)} value={selectedSegment}>
                            {(menu != null && (menu.includes(AUTH_FUEL_GA))) &&
                                <IonSegmentButton class='text-white'
                                                  value='request'>{t("header.persetujuan")}</IonSegmentButton>
                            }
                            {(menu != null && (menu.includes(AUTH_FUEL_FINANCE))) &&
                                <IonSegmentButton class='text-white'
                                                  value='finance'>{t("header.persetujuan")}</IonSegmentButton>
                            }
                            {(menu != null && menu.includes(AUTH_FUEL_LOGISTIC)) &&
                                <IonSegmentButton class='text-white'
                                                  value='logistic'>{t("header.logistik")}</IonSegmentButton>
                            }
                            {(menu != null && (menu.includes(AUTH_FUEL_REQUEST) || menu.includes(AUTH_FUEL_OTHER_REQUEST))) &&
                                <IonSegmentButton class='text-white'
                                                  value='mymenu'>{t("header.manajemen")}</IonSegmentButton>
                            }
                        </IonSegment>
                    }
                    <div className="bg-white px-2">

                        {/* === Start Request === */}
                        {selectedSegment == 'mymenu' &&
                            <FuelHomeComponent data={unit} auth={menu} hanldeOnClick={handleOnClick} simper={simper} allowOperateUnit={false}/>
                        }
                        {selectedSegment == 'request' &&
                            <div className="px-2 py-2">
                                <div className="grid grid-cols-1 gap-4 pt-6">
                                    <div onClick={btnListReqFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                        <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-unit-icon.png' />
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="font-bold">{t("permintaan.bahan_bakar")}</p>
                                                {countFuelUnit > 0 ?
                                                    <p className="text-sm text-green-600">{countFuelUnit} {t('permintaan.baru')}</p>
                                                    :
                                                    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                }
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div onClick={btnListNonFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                        <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-non-unit-icon.png' />
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="font-bold">{t("permintaan.bahan_bakar_lain")}</p>
                                                {countFuelNonUnit > 0 ?
                                                    <p className="text-sm text-green-600">{countFuelNonUnit} {t('permintaan.baru')}</p>
                                                    :
                                                    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                }
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    {role == 'GA' ?
                                        <>
                                            <div onClick={btnDaftarPermintaanP2H} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                                <img className="h-6 ml-2 mr-4" src='assets/icon/p2h-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.p2h")}</p>
                                                        {countP2H > 0 ?
                                                            <p className="text-sm text-green-600">{countP2H} {t('permintaan.baru')}</p>
                                                            :
                                                            <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                        }
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div onClick={btnDaftarPermintaanUnitSementara} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                                <img className="w-6 ml-2 mr-4" src='assets/icon/temporary-unit-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.unit_sementara")}</p>
                                                        {countTempUnit > 0 ?
                                                            <p className="text-sm text-green-600">{countTempUnit} {t('permintaan.baru')}</p>
                                                            :
                                                            <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                        }
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div onClick={btnDaftarPermintaanGantiUnit} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                                <img className="w-6 ml-2 mr-4" src='assets/icon/change-unit-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.ganti_unit")}</p>
                                                        {countGantiUnit > 0 ?
                                                            <p className="text-sm text-green-600">{countGantiUnit} {t('permintaan.baru')}</p>
                                                            :
                                                            <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                        }
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div onClick={btnListOdo} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                                <img className="w-6 ml-2 mr-4" src='assets/icon/odometer-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.update_odo")}</p>
                                                        {countOdo > 0 ?
                                                            <p className="text-sm text-green-600">{countOdo} {t('permintaan.baru')}</p>
                                                            :
                                                            <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                        }
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-gray-300 px-2.5 py-3 shadow-md">
                                                <img className="w-6 ml-2 mr-4" src='assets/icon/purchase-order-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.po")}</p>
                                                        {/*{countPo > 0 ?*/}
                                                        {/*    <p className="text-sm text-green-600">{countPo} {t('permintaan.baru')}</p>*/}
                                                        {/*    :*/}
                                                        {/*    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>*/}
                                                        {/*}*/}
                                                        {t('segera_hadir')}
                                                    </div>
                                                    {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">*/}
                                                    {/*    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />*/}
                                                    {/*</svg>*/}
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-gray-300 px-2.5 py-3 shadow-md">
                                                <img className="w-6 ml-2 mr-4" src='assets/icon/deposit-icon.png' />
                                                <div className="flex justify-between w-full items-center">
                                                    <div>
                                                        <p className="font-bold">{t("permintaan.deposit")}</p>
                                                        {/*{countDo > 0 ?*/}
                                                        {/*    <p className="text-sm text-green-600">{countDo} {t('permintaan.baru')}</p>*/}
                                                        {/*    :*/}
                                                        {/*    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>*/}
                                                        {/*}*/}
                                                        {t('segera_hadir')}
                                                    </div>
                                                    {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">*/}
                                                    {/*    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />*/}
                                                    {/*</svg>*/}
                                                </div>
                                            </div>
                                        </>
                                        : null}
                                </div>
                            </div>
                        }
                        {selectedSegment == 'finance' &&
                            <div className="px-2 py-2">
                                <div className="grid grid-cols-1 gap-4 pt-6">
                                    <div onClick={btnListFinReqFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                        <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-unit-icon.png' />
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="font-bold">{t("permintaan.bahan_bakar")}</p>
                                                {countFinFuelUnit > 0 ?
                                                    <p className="text-sm text-green-600">{countFinFuelUnit} {t('permintaan.baru')}</p>
                                                    :
                                                    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                }
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div onClick={btnListFinNonFuel} className="inline-flex items-center rounded-lg border border-1 border-gray-300 bg-white px-2.5 py-3 shadow-md">
                                        <img className="w-6 ml-2 mr-4" src='assets/icon/fuel-non-unit-icon.png' />
                                        <div className="flex justify-between w-full items-center">
                                            <div>
                                                <p className="font-bold">{t("permintaan.bahan_bakar_lain")}</p>
                                                {countFinFuelNonUnit > 0 ?
                                                    <p className="text-sm text-green-600">{countFinFuelNonUnit} {t('permintaan.baru')}</p>
                                                    :
                                                    <p className="text-sm text-gray-600">{t('permintaan.kosong')}</p>
                                                }
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 items-end text-red-700">
                                                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {selectedSegment == 'logistic' &&
                            <LogisticFuelHomeComponent countDo={logCountDo} countPo={logCountPo}/>
                        }
                        {/* === End Request === */}


                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default GAFuelHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

