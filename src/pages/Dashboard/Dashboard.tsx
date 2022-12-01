import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonAlert,
    useIonToast, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from "@ionic/react";
import "./Dashboard.css";
import React, {useEffect, useRef, useState} from "react";
import {RefresherEventDetail} from "@ionic/core";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {
    clearPref,
    getFuelMenu,
    getJsonPref,
    getPref, getUserMenu, simpanDataPegawaiUnit,
} from "../../helper/Preferences";
import {
    AUTH_FUEL_OTHER_REQUEST,
    AUTH_FUEL_REQUEST, AUTH_FUEL_REQUEST_OTHER, pref_app_server_version, pref_app_version,
    pref_json_pegawai_info_login, pref_pegawai_id, pref_pegawai_unit_id, pref_token,
    pref_unit,
    pref_user_role,
} from "../../constant/Index";

import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import UserMenu from "./components/UserMenu";
import UserHeader from "./components/UserHeader";
import {FuelCouponList} from "../../api/KuponAPI/FuelCouponList";
import moment from "moment";
import PStatus from "../Fuel/PO/components/PStatus";
import {OtherCouponList} from "../../api/KuponAPI/OtherCouponList";
import {Calendar, utils} from "react-modern-calendar-datepicker";
import ActionSheet from "actionsheet-react";
import QRCodeWithLogo from "../../components/QRCodeWithLogo/QRCodeWithLogo";
import {encode} from "string-encode-decode";
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from "@capacitor/push-notifications";
import {LocalNotifications} from "@capacitor/local-notifications";
import {PointsByPegawai} from "../../api/PointsAPI";
import {VersionApps} from "../../api/VersionAppsAPI";
import {getPermPref, setPermPref} from "../../helper/PermanentPreferences";
import {privacyDisable, privacyEnable} from "../../helper/PrivacyScreenConf";
import {logDeviceInfo} from "../../helper/DeviceInfo";
import {PegawaiWorkStatusAPI} from "../../api";
import {CountNotifByUser} from "../../api/NotifikasiAPI";
import {UnitByUser} from "../../api/UnitAPI";

const user = {name: "", email: "", nik: "", imageUrl: ""};
const userUnit = {id: "", noPol: "", noLambung: ""};

const Dashboard: React.FC = () => {
    const history = useHistory();
    const ref = useRef();
    const [points, setPoints] = useState();
    const [pegawai, setPegawai] = useState(user);
    const [pegId, setPegId] = useState("");
    const [unit, setUnit] = useState(userUnit);
    const [pegUnit, setPegUnit] = useState();
    const [activeFuelReq, setActiceFuelReq] = useState<any>();
    const [activeOtherFuelReq, setActiveOtherFuelReq] = useState<any[]>([]);
    const [identitas, setIdentitas] = useState("");
    const [menuFuel, setMenuFUel] = useState("");
    const [presentAlert] = useIonAlert();
    const [notif, setNotif] = useState(0);
    const [work, setWork] = useState("");
    const [osType, setOsType] = useState("");

    const {t} = useTranslation();

    const [DataMenu, setDataMenu] = useState<any[]>([]);

    /* BEGIN LIFECYCLE APPS */

    /* Proses animasi saat Mau masuk halaman
    disini bisa load data dari API,
    jika dirasa load data akan menyebabkan performa menurun
    bisa dipindah ke diEnter */
    useIonViewWillEnter(() => {
        PushNotifications.checkPermissions().then((res) => {
            if (res.receive !== 'granted') {
                PushNotifications.requestPermissions().then((res) => {
                    if (res.receive === 'denied') {
                        // showToast('Push Notification permission denied');
                    }
                    else {
                        // showToast('Push Notification permission granted');
                        register();
                    }
                });
            }
            else {
                register();
            }
        });

        getPref(pref_token).then(t => {
            if(t == null || t === ""){
                clearPref();
                history.replace("/login");
            }
        });
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        generateMenu();
        loadDataPref();
        checkVersion();
    });

    const checkVersion = () => {
        VersionApps().then(result => {
            console.log(">>>>>>> version <<<<<< " + result);
            try {
                let version = (result['version']).replace(" ","");
                let force = result['forceUpdate'];
                getPermPref(pref_app_version).then( v => {
                    if (version !== v){
                        logDeviceInfo().then(i => {
                            console.log(i);
                            showAlertUpdate(force, i.operatingSystem, version);
                        })
                    }
                });
                setPermPref(pref_app_server_version, version).then(r => r);
            } catch (e) {

            }
        })
    }

    const showAlertUpdate = (force: boolean, os: string, version: string) => {
        let headerTeks = t('versi.versi_baru')
        let teks = t('versi.silahkan_update')
        if(force){
            presentAlert({
                header: headerTeks,
                subHeader: version,
                message: teks,
                mode:"ios",
                backdropDismiss: false,
                buttons: [
                    {
                        text: t('btn.oke'),
                        // cssClass: 'alert-button-confirm',
                        handler: () => {
                            if(os === 'ios'){

                            }
                            if(os ==='android'){

                            }
                            return false;
                        }
                    },
                ],
            })
        } else {
            presentAlert({
                header: headerTeks,
                subHeader: version,
                message: teks,
                mode:"ios",
                backdropDismiss: false,
                buttons: [
                    {
                        text: t('btn.nanti'),
                        // cssClass: 'alert-button-cancel',
                    },
                    {
                        text: t('btn.perbarui'),
                        // cssClass: 'alert-button-confirm',
                        handler: () => {
                        }
                    },
                ],
            })
        }
    }

    const countNotif = (pegId: string) => {
        CountNotifByUser(pegId).then(c => {
            if(c.status === "SUCCESS" && c.message === ""){
                setNotif(c.data);
            }
        });
    }

    const workStatus = (pegId: string) => {
        PegawaiWorkStatusAPI(pegId).then(result => {
            console.log(">>>>>>> status <<<<<< " + result);
            if(result == null){
                setWork("beranda.masuk");
            } else {
                let leave = result['tipeLeave'];
                // "beranda.masuk": "Masuk",
                //     "beranda.libur": "Libur",
                //     "beranda.cuti": "Cuti",
                try {
                    let tipe = (leave['name']).toString().toLowerCase();
                    let tipes = tipe.replace(" ", "");
                    if(tipes.includes("libur") || tipes.includes("off")){
                        setWork("beranda.libur");
                    } else if(tipes.includes("cuti") || tipes.includes("leave")){
                        setWork("beranda.cuti");
                    } else if(tipes.includes("masuk") || tipes.includes("dayon")){
                        setWork("beranda.masuk");
                    } else {
                        setWork("beranda.lainnya");
                    }
                } catch (e) {
                    setWork("beranda.masuk");
                }
            }
        })
    }

    //GENERATE MENU USER
    const generateMenu = () => {
        let menu = null;
        let menus = new Array<{ navigate: string, img: string, title: string, allowed: boolean }>();

        getUserMenu().then(data => {
            if (data != null) {
                console.log("INI DATA MENU " + data);
                let m = data;

                menu = {
                    navigate: m.includes("FUEL") ? '/fuel/homepage' : '#',
                    img: 'assets/icon/fuels.png',
                    title: t("menu.fuel"),
                    allowed: m.includes("FUEL")
                }
                menus.push(menu);

                menu = {
                    navigate: m.includes("MEAL") ? '#' : '#',
                    img: 'assets/icon/meals-coming-soon.png',
                    title: t("menu.meal"),
                    allowed: m.includes("MEAL")
                }
                menus.push(menu);

                menu = {
                    navigate: m.includes("VISIT") ? '#' : '#',
                    img: 'assets/icon/visit-coming-soon.png',
                    title: t("menu.visit"),
                    allowed: m.includes("VISIT")
                }
                menus.push(menu);

                menu = {
                    navigate: m.includes("GACARE") ? '/ga-care/list-laporan' : '#',
                    img: 'assets/icon/ga_cares.png',
                    title: t("menu.ga_care"),
                    allowed: m.includes("GACARE")
                }
                menus.push(menu);

                setDataMenu(menus);
            }
        });
        getFuelMenu().then(data => {
            setMenuFUel(data);
        });
    }

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
        console.log("Begin async operation");
        loadDataPref();
        setTimeout(() => {
            console.log("Async operation has ended");
            event.detail.complete();
        }, 2000);
    }

    const listNotifikasi = () => {
        history.push("/notifikasi");
    };

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
            console.log("PEGAWAI", res)
            setPegawai(res);
            // console.log(res);
        });
        getPref(pref_pegawai_unit_id).then(res => {
            setPegUnit(res);
            if (res != null) {
                //get data fuel request yang aktif
                FuelCouponList(res).then((data) => {
                    if (data.status === "SUCCESS" && data.message === "") {
                        let fuel = data.data;
                        setActiceFuelReq(data.data);
                    } else {
                        setActiceFuelReq(null);
                    }
                });
            }
        });

        getPref(pref_pegawai_id).then(p => {
            generateQR(p);
            setPegId(p);
            workStatus(p);
            countNotif(p);
            getPegUnit(p);
            OtherCouponList(p).then((data) => {
                if (data.status === "SUCCESS" && data.message === "") {
                    let other = data.data;
                    // @ts-ignore
                    let req = other.filter((x: { [x: string]: { [x: string]: null; }; }) => (x["status"] !== "CANCELED" && x["status"] !== "CLOSED" && x["status"] !== "REJECTED"));
                    // @ts-ignore
                    let sortByDate = req.map((obj: { tanggalPermintaan: string; }) => { return {...obj, date: new Date(obj.tanggalPermintaan)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                    setActiveOtherFuelReq(sortByDate);
                } else {
                    setActiveOtherFuelReq([]);
                }
            });
            PointsByPegawai(p).then(data => {
                if(data.status === "SUCCESS" && data.message === ""){
                    setPoints(data.data.poin);
                }
            })
        });
        console.log("role: ");
    };

    const getPegUnit = (p: string) => {
        UnitByUser(p).then(u => {
            try{
                let msg = u.message;
                if(u.message === "" && u.status === 'SUCCESS'){
                    simpanDataPegawaiUnit(u.data);
                } else {
                    simpanDataPegawaiUnit(null);
                }

                getJsonPref(pref_unit).then((restUnit) => {
                    setUnit(restUnit);
                });
            }catch (error){

            }
            // simpanDataPegawaiUnit(u);
        })
    }

    const generateQR = (p: any) => {
        let data = "hrgabib_pegawai_" + p + "_" + (new Date()).getTime().toString();
        setIdentitas(data);
    }

    var option = {
        centeredSlides: true,
        loop: true,
        spaceBetween: 10
    }

    const toDetailFuel = (id: any, status: any) => {
        let path = "";
        if (status === "PROPOSED" || status === "CANCELED" || status === "REJECTED" || status === "APPROVED") {
            path = "/fuel/req-fuel/detail/";
        } else {
            path = "/fuel/kupon/detail-fuel/";
        }
        history.push({
            pathname: path + id,
            state: {detail: id}
        });
    }

    const toDetailOtherFuel = (id: any, status: any) => {
        let path = "";
        if (status === "PROPOSED" || status === "CANCELED" || status === "REJECTED" || status === "APPROVED") {
            path = "/fuel/req-other/detail/";
        } else {
            path = "/fuel/kupon/detail-other/";
        }
        history.push({
            pathname: path + id,
            state: {detail: id}
        });
    }

    const handleOpen = () => {
        privacyEnable().then(r => r);
        generateQR(pegId);
        // @ts-ignore
        ref.current.open();
    };

    const close = () => {
        privacyDisable().then(r => r);
        // @ts-ignore
        ref.current.close();
    }

    const register = () => {
        console.log('Initializing HomePage');

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token: Token) => {
                // showToast('Push registration success');
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error: any) => {
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotificationSchema) => {
            console.log("############# data notif "+JSON.stringify(notification))
                // @ts-ignore
                // @ts-ignore
                LocalNotifications.schedule({
                    notifications: [
                        {
                            title: notification != null ? ''+notification.title+'' : "",
                            body: notification != null ? ''+notification.body+'' : "",
                            id: new Date().getMilliseconds(),
                            actionTypeId: "tap",
                            extra: {data: notification.data}
                        }
                    ]
                }).catch(error => {
                    console.debug("AppComponent#initializePushNotificationListener notifications denied", error);
                });

                console.log("<><><> CA "+notification.click_action);
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
                console.log("############# data notif on tap "+JSON.stringify(notification))
                let data = notification.notification.data;
                let id = notification.notification.id;
                toDetail(data, id);
            }
        );

        // adding the listener
        LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
            // triggers when the notification is clicked.
            console.log('>>>>> notification triggered:', JSON.stringify(payload));
            // alert(JSON.stringify(payload));

            /* Todo : untuk diperbaiki */
            toDetail(payload.notification.extra.data, payload.notification.extra.data.data_id);
        });
    }

    const toDetail = (data: any, id: string) => {
        history.push({
            pathname: "/notifikasi-detail/" + id,
            state: { detail: data }
        });
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700">
                    {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

                    {/* === Start Header === */}
                    <div className="divide-y divider-white p-4">
                        <div className="flex w-full items-center justify-between space-x-6">
                            <UserHeader point={points != null && points !== "" ? points : "0"} pegawai={pegawai}
                                        handleOnClick={handleOpen} workStatus={work}/>
                            <button onClick={listNotifikasi}
                                    className="py-4 px-1 relative border-2 border-transparent text-white rounded-full"
                                    aria-label="Cart">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                    />
                                </svg>
                                {notif > 0 &&
                                    <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                        <div
                                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                            {notif}
                                        </div>
                                    </span>
                                }
                            </button>
                        </div>
                    </div>

                    <div className="absolute w-full z-10">
                        <div className="px-4">
                            <div className="rounded-lg bg-white drop-shadow-md">
                                <div className="flex w-full items-center justify-between space-x-6 p-3">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {unit != null ? t('beranda.pakai_unit') : t('beranda.tidak_pakai_unit')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="grid divide-gray-200 border-t border-gray-200 grid-cols-2 divide-y-0 divide-x">
                                    <div className="px-6 py-1.5 text-center text-sm font-medium">
                                        <span className="text-xs text-gray-500">
                                          {t('unit.nomor_lambung')}
                                        </span><br/>
                                        <span className="font-bold text-gray-900">
                                          {unit != null ? unit["noLambung"] : "-"}
                                        </span>
                                    </div>
                                    <div className="px-6 py-1.5 text-center text-sm font-medium">
                                        <span className="text-xs text-gray-500">
                                          {t('unit.nomor_polisi')}
                                        </span><br/>
                                        <span className="font-bold text-gray-900">
                                          {unit != null ? unit["noPol"] : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === End Header === */}

                    {/* === Start Body ===*/}

                    {/* === Start List Quick Menu === */}
                    <div className="w-full bg-white mt-11 p-4">

                        <div className="mt-16">
                            <h2 className="font-bold">{t('menu.cepat')}</h2>
                            <UserMenu menu={DataMenu}/>
                        </div>

                        {/*=== card by role ===*/}
                        {/*=== end card by role ===*/}
                        <div className="relative flex py-5 items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>
                        {/* === Start Card Ongoing Visit === */}
                        <div hidden
                             className="drop-shadow-md mt-2 divide-y divide-gray-200 border border-1 border-gray-300 rounded-lg bg-white">
                            <div className="px-4 py-4 p-6">
                                <h3 className="text-md font-bold text-gray-900">
                                    {t('beranda.kunjungan')}
                                </h3>
                                <div className="divide-y divide-gray-200">
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        <span className="text-left font-bold text-red-800">
                                          1 Jan 2022
                                        </span>
                                        <span className="items-center mx-auto">
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke-width="1.5"
                                              stroke="currentColor"
                                              className="w-6 h-6"
                                          >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        </span>
                                        <span className="text-right font-bold text-red-800">
                                          5 Jan 2022
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <span>Survei Lokasi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="drop-shadow-md mt-2 divide-y divide-gray-200 border border-1 border-gray-300 rounded-lg bg-white">
              <div className="px-4 py-4 p-6">
                <h3 className="text-md font-bold text-gray-900">
                  Ongoing Visit
                </h3>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <span className="text-left font-bold text-red-800">
                      1 Jan 2022
                    </span>
                    <span className="items-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className="text-right font-bold text-red-800">
                      5 Jan 2022
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="mt-2">
                      <span>Survei Lokasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

                        {/*=== Start Card Permintaan MDForFuel === */}
                        {(activeFuelReq != null && menuFuel.includes(AUTH_FUEL_REQUEST) && pegUnit === activeFuelReq['pegawaiUnit']['id']) &&
                            <div onClick={event => toDetailFuel(activeFuelReq['id'], activeFuelReq['status'])}
                                 className="drop-shadow-md divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-8 mb-8">
                                <div className="px-4 py-4 sm:px-6">
                                    <h3 className="text-md font-bold text-gray-900">
                                        {t('beranda.kupon_bahan_bakar')}
                                    </h3>
                                </div>
                                <div className="px-4 py-5">
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                        <div>
                                            <p className="text-base text-gray-900 pb-2">{activeFuelReq['pegawaiUnit']['unit']['noLambung']} - {activeFuelReq['pegawaiUnit']['unit']['noPol']}</p>
                                            <p className="text-sm text-gray-900">{activeFuelReq['tanggal'] != null && activeFuelReq['tanggal'] !== "" ? moment(activeFuelReq['tanggal']).format('DD MMM yyyy').toString() : "-"}</p>
                                        </div>
                                        <div className="whitespace-nowrap text-end text-sm text-gray-500">
                                            <p className="text-sm text-gray-900 pb-2">{activeFuelReq['odometerPermintaan']} km</p>
                                            <PStatus status={activeFuelReq['status']} title={activeFuelReq['status']}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {(menuFuel.includes(AUTH_FUEL_OTHER_REQUEST) && activeOtherFuelReq != null && activeOtherFuelReq.length > 0) &&
                            <>
                                {activeOtherFuelReq.map((req, index) => {
                                    return (
                                        <div key={index} onClick={event => toDetailOtherFuel(req['id'], req['status'])}
                                             className="drop-shadow-md divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-8 mb-8">
                                            <div className="px-4 py-4 sm:px-6">
                                                <h3 className="text-md font-bold text-gray-900">
                                                    {t('beranda.kupon_bahan_bakar_lain')}
                                                </h3>
                                            </div>
                                            <div className="px-4 py-5">
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                                    <div>
                                                        <p className="text-base text-gray-900 pb-2">{req['tujuan']['nama']}</p>
                                                        <p className="text-sm text-gray-900">{req['tanggalPermintaan'] != null && req['tanggalPermintaan'] !== "" ? moment(req['tanggalPermintaan']).format('DD MMM yyyy').toString() : ""}</p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-end text-sm text-gray-500">
                                                        <p className="text-sm text-gray-900 pb-2">{req['liter']} liter</p>
                                                        <PStatus status={req['status']} title={req['status']}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        }
                        {/*=== End Card Permintaan MDForFuel === */}
                    </div>
                </div>
            </IonContent>
            <BottomNavBar isFuelman={false}/>
            <ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out" onClose={close}>
                <div className="overflow-hidden rounded-2xl bg-white">
                    <div className="divide-y divide-gray-300">
                        <p className="font-bold text-gray-900 p-6">
                            {t('identitas')}
                        </p>
                        <div>
                            <div className="aspect-auto bg-white-100 w-full flex item-center py-6">
                                {/*<img height={180} width={180} className="mx-auto object-cover object-center rounded-lg pointer-events-none" src={`data:image/png;base64,${photo}`} ></img>*/}
                                <div className="mx-auto">
                                    <QRCodeWithLogo text={encode(identitas)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ActionSheet>
        </IonPage>
    );
};


export default Dashboard;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error("Function not implemented.");
}
