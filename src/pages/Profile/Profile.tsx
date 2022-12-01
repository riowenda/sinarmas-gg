import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonAlert, useIonLoading,
    useIonToast, useIonViewDidEnter, useIonViewWillEnter,
} from '@ionic/react';

import './Profile.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next, ReactI18NextChild } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    API_URI, AUTH_FUEL_MANAGER, AUTH_FUEL_STATION,
    AUTH_URI,
    LOGOUT_URI,
    pref_json_pegawai_info_login,
    pref_lng,
    pref_pegawai_id,
    pref_pegawai_unit_id,
    pref_token,
    pref_token_fbnotif,
} from "../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import {
    clearPref, getFuelMenu,
    getJsonPref,
    getPref, getUserMenu,
    setPref,
    setPrefLng
} from "../../helper/Preferences";
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import ActionSheet from 'actionsheet-react';
import ListHeader from "../../components/Header/ListHeader";
import axios from "axios";
import { getPermPref } from "../../helper/PermanentPreferences";
import { FuelCouponList } from "../../api/KuponAPI/FuelCouponList";
import { IconEdit } from "../../components/Icon";
import { BaseAPI } from "../../api/ApiManager";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import packageJson from "../../../package.json";

const user = { name: "", email: "", nik: "", imageUrl: "" };

const Profile: React.FC = () => {
    const history = useHistory();
    const [pegawai, setPegawai] = useState(user);
    const [presentAlert] = useIonAlert();
    const { t, i18n } = useTranslation();
    const [lng, setLng] = useState("id");
    const [present, dismiss] = useIonLoading();
    const [pegawai_id, setPegId] = useState();
    const [jwt_token, setJwt] = useState();
    const [firebase_token, setFirebase] = useState();
    const [fuelman, setIsFuelman] = useState(false);

    const ref = useRef();
    const helpsupport = useRef();
    const reportproblem = useRef();
    const about = useRef();

    const onClickLanguageChange = (e: any) => {
        const language = e;
        i18n.changeLanguage(language); //change the language
        setPref(pref_lng, language);
        setPrefLng(language);
        setLng(language);
        // @ts-ignore
        ref.current.close();
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
            setPegawai(res);
            // console.log(res);
        });
        getPref(pref_lng).then(l => {
            setLng(l);
        });
        //console.log("role: ", role);
    };

    const handleOpen = () => {
        /* Todo: disable dulu*/
        // @ts-ignore
        // ref.current.open();
    };

    const handleHelpSupport = () => {
        /* Todo: disable dulu*/
        // @ts-ignore
        helpsupport.current.open();
    };

    const handleReportProblem = () => {
        // @ts-ignore
        reportproblem.current.open();
    };

    const handleAbout = () => {
        // @ts-ignore
        about.current.open();
    };

    useIonViewWillEnter(() => {
        loadDataPref();
    });

    useIonViewDidEnter(() => {
        getPref(pref_pegawai_id).then(p => {
            setPegId(p);
        })
        getPermPref(pref_token_fbnotif).then(f => {
            setFirebase(f);
            console.log("<<<<<<<<<<<<<<<<<<<< token fb setelah login " + f);
        })
        getPref(pref_token).then(t => {
            setJwt(t);
        })
        getFuelMenu().then(data => {
            if (data.includes(AUTH_FUEL_STATION) || data.includes(AUTH_FUEL_MANAGER)) {
                console.log("isFuelman");
                setIsFuelman(true);
            }
        });
    });

    const btnOut = () => {
        let teks = t('confirm.logout');
        presentAlert({
            subHeader: teks,
            backdropDismiss: false,
            buttons: [
                {
                    text: t('btn.batal'),
                    cssClass: 'alert-button-cancel',
                },
                {
                    text: t('btn.ya'),
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        logout();
                    }
                },
            ],
        })
    }

    const logout = () => {
        const loading = present({
            message: 'Memproses permintaan ...',
            backdropDismiss: false
        })

        //*private UUID pegawai_id;
        //     private String firebase_token;
        //     private String jwt_token;*/
        const loginData = {
            "pegawai_id": pegawai_id,
            "firebase_token": firebase_token,
            "jwt_token": jwt_token
        }

        let config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const loginApi = `${LOGOUT_URI}`;
        const api = axios.create({
            baseURL: `${BaseAPI()}` + `${API_URI}` + `${AUTH_URI}`
        })
        api.post(loginApi, loginData, config)
            .then(res => {
                clearNLogout();
            })
            .catch(error => {
                clearNLogout();
            })
    }

    const clearNLogout = () => {
        dismiss();
        clearPref();
        history.replace("/login");
    }

    const btnEditProfile = () => {
        history.push("/profil/edit");
    };

    const urlBantuan = () => {
        var url = 'https://ugems.id/web/guest/user-guide';
        var win = window.open(url);
    }

    const urlReportWhatsap = () => {
        var url = 'https://wa.me/+6281388828280';
        var win = window.open(url);
    }

    const urlReportWeb = () => {
        var url = 'https://turing.ugems.id/support/login';
        var win = window.open(url);
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {/* Header */}
                <div hidden>
                    <ListHeader title={"Profile"} isReplace={false} link={""} addButton={false} />
                </div>
                {/* end Header */}
                <div className="w-full flex flex-col h-screen justify-between">
                    {/* <div className='p-4'> */}
                    <div>
                        {pegawai != null &&
                            <div className="flex w-full items-center justify-between space-x-6 mb-5 p-6">
                                {pegawai["imageUrl"] != null && pegawai["imageUrl"] !== "" ?
                                    <img
                                        className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-300"
                                        src={pegawai["imageUrl"]}
                                        alt=""
                                    /> :
                                    <img
                                        className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-300"
                                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwOCA1MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwOCA1MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzkwREZBQTsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik0yNTUuMiwzNjMuMmMtMC40LDAtMC44LDAuNC0xLjYsMC40Yy0wLjQsMC0wLjgtMC40LTEuNi0wLjRIMjU1LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik00NTguNCw0MDRjLTQ2LDYyLjgtMTIwLjgsMTA0LTIwNC44LDEwNFM5NS4yLDQ2Ny4yLDQ4LjgsNDA0YzM2LTM4LjQsODQuOC01OC44LDEyNS42LTY5LjINCgkJYy0zLjYsMjkuMiwxMS42LDY4LjQsMTIsNjcuMmMxNS4yLTM1LjIsNjYuOC0zOC40LDY2LjgtMzguNHM1MS42LDIuOCw2Ny4yLDM4LjRjMC40LDAuOCwxNS42LTM4LDEyLTY3LjINCgkJQzM3My42LDM0NS4yLDQyMi40LDM2NS42LDQ1OC40LDQwNHoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkQwNUI7IiBkPSJNMzE2LjgsMzA4TDMxNi44LDMwOGMwLDUuMi0zLjIsMzIuOC02MS42LDU1LjJIMjUyYy01OC40LTIyLjQtNjEuNi01MC02MS42LTU1LjJsMCwwDQoJYzAuNC0xMC40LDIuOC0yMC44LDcuMi0zMC40YzE2LDE4LDM1LjIsMzAsNTYsMzBjMjAuNCwwLDQwLTExLjYsNTYtMzBDMzE0LDI4Ny4yLDMxNi44LDI5Ny42LDMxNi44LDMwOHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGMTU0M0Y7IiBkPSJNMjg4LjQsMzcyLjRMMjc1LjYsMzk4aC00NGwtMTIuOC0yNS42YzE3LjYtNy42LDM0LjgtOC44LDM0LjgtOC44UzI3MS4yLDM2NC44LDI4OC40LDM3Mi40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGNzA1ODsiIGQ9Ik0yMTgsNTA1LjZjMTEuNiwxLjYsMjMuNiwyLjQsMzYsMi40YzEyLDAsMjQtMC44LDM2LTIuNGwtMTQtMTA3LjJoLTQ0TDIxOCw1MDUuNnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzE2LjgsMzA3LjJjMCwwLDIuOCwzMi02My4yLDU2LjRjMCwwLDUxLjYsMi44LDY3LjIsMzguNEMzMjEuMiw0MDMuNiwzNTEuMiwzMjYsMzE2LjgsMzA3LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOTAuNCwzMDcuMmMtMzQsMTguOC00LjQsOTYtMy42LDk0LjhjMTUuMi0zNS4yLDY3LjItMzguNCw2Ny4yLTM4LjQNCgkJQzE4Ny42LDMzOS4yLDE5MC40LDMwNy4yLDE5MC40LDMwNy4yeiIvPg0KPC9nPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Y5QjU0QzsiIGQ9Ik0zMTIuOCwyODUuNmMtMTYuOCwxOC0zNi44LDI5LjYtNTkuMiwyOS42cy00Mi40LTExLjYtNTkuMi0yOS42YzAuOC0yLjgsMi01LjYsMy4yLTgNCgljMTYsMTgsMzUuMiwzMCw1NiwzMHM0MC0xMS42LDU2LTMwQzMxMC44LDI4MCwzMTIsMjgyLjgsMzEyLjgsMjg1LjZ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZEMDVCOyIgZD0iTTM2Mi44LDIyNC40Yy04LjQsMTQtMjEuMiwyMi40LTMwLjgsMjAuOGMtMTkuMiwzNS42LTQ3LjIsNjItNzguNCw2MnMtNTkuMi0yNi44LTc4LjQtNjINCgljLTkuNiwxLjItMjIuNC02LjgtMzAuOC0yMC44Yy0xMC0xNi40LTEwLjQtMzQuNC0wLjgtNDAuNGMyLjQtMS4yLDQuOC0yLDcuNi0xLjZjNi40LDE2LjQsMTUuMiwyNi40LDE1LjIsMjYuNA0KCWMtOS4yLTUwLjgsMjguNC01Ni40LDIyLTEwNS4yYzAsMCwyMy42LDUyLjQsOTEuMiwxNS42bC01LjIsMTBjOTQuNC0yMS4yLDYyLjgsOTAsNjIsOTIuOGMxMC44LTEzLjYsMTcuNi0yNy4yLDIxLjYtMzkuNg0KCWMxLjYsMCwzLjYsMC44LDQuOCwxLjZDMzczLjIsMTg5LjYsMzcyLjgsMjA4LDM2Mi44LDIyNC40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMyNEE1RTsiIGQ9Ik0zMDgsNTAuOGM3LjYtMC44LDIwLDYsMjAsNmMtMzQtMzguOC04OS42LTE0LTg5LjYtMTRjMTguOC0xNiwzNS42LTE0LjQsMzUuNi0xNC40DQoJYy03OS42LTEyLTkzLjIsMzUuNi05My4yLDM1LjZjLTMuNi01LjYtMy42LTEzLjYtMy4yLTE3LjZDMTcyLDU2LDE3OCw3NS4yLDE3OCw3NS4yYy01LjYtMTQtMjUuMi0xMS42LTI1LjItMTEuNg0KCWMxNi44LDIuOCwxOS42LDEzLjIsMTkuNiwxMy4yYy00MiwxNS42LTM0LjgsNTkuMi0zNC44LDU5LjJsMTAtMTJjLTEyLjQsNDcuNiwxOS4yLDg0LjQsMTkuMiw4NC40Yy05LjItNTAuOCwyOC40LTU2LjQsMjItMTA1LjINCgljMCwwLDIzLjYsNTIuNCw5MS4yLDE1LjZsLTUuMiwxMGM5NS42LTIxLjYsNjIsOTMuMiw2Miw5My4yYzM0LTQzLjIsMjguOC04Ny42LDI4LjgtODcuNmw0LDE2QzM4MC40LDc4LjQsMzA4LDUwLjgsMzA4LDUwLjh6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
                                    />
                                }
                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {pegawai["name"]}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <p className="text-sm text-gray-900">
                                            {pegawai["nik"]}
                                        </p>
                                    </div>
                                    {/*<div className="flex items-center space-x-3">*/}
                                    {/*    <p className="text-sm text-gray-900">*/}
                                    {/*        Jabatan_txt*/}
                                    {/*    </p>*/}
                                    {/*</div>*/}
                                </div>
                                <div onClick={btnEditProfile} className='text-gray-500'><IconEdit /></div>
                            </div>
                        }
                        <h3 className='font-bold mt-10 px-6'>{t("profil.akun")}</h3>
                        <div className='divide-y justify-between px-6'>
                            <div className='mt-4'>
                                {/* <a href='https://ugems.id/web/guest/user-guide'> */}
                                <div onClick={urlBantuan} className='py-4 border-b border-gray-100'>
                                    {t("profil.bantuan")}
                                </div>
                                {/* </a> */}
                                <div className='py-4 border-b border-gray-100'>
                                    {t("profil.sk")}
                                </div>
                                <div onClick={handleOpen} className='flex justify-between py-4 border-b border-gray-100'>
                                    <div>
                                        <span>{t("profil.bahasa")}</span>
                                    </div>
                                    <div>
                                        <img id="langID" className="w-6 h-6 rounded-full ring-1 ring-gray-300" src={lng === "id" ? "assets/images/flag-id.png" : "assets/images/flag-us.png"} alt="id-flag" />
                                    </div>
                                </div>
                                <div onClick={handleReportProblem} className='py-4 border-b border-gray-100'>
                                    {t("profil.lapor")}
                                </div>
                                <div onClick={handleAbout} className='py-4 border-b border-gray-100'>
                                    About
                                </div>
                            </div>

                        </div>
                        <div className='p-6 w-full text-center mt-16'>
                            <div className='text-xs text-gray-500'>Provided by Digitech - GEMS</div>
                            <div className='text-xs text-gray-500'>© 2022 PT. Borneo Indobara</div>
                            <div onClick={btnOut} className='p-2 mt-4 bg-red-700 rounded-md text-white'>{t("login.keluar")}</div>
                        </div>
                    </div>

                    {/* </div> */}
                </div>



            </IonContent>
            <BottomNavBar isFuelman={fuelman} />
            <ActionSheet ref={ref} sheetTransition="transform 0.3s ease-in-out">
                <div className="overflow-hidden rounded-2xl bg-white">
                    {/*<button className="modal-handle" aria-label="Activate to adjust the size of the dialog overlaying the screen"></button>*/}
                    <div className="divide-y pb-6 divide-gray-300">
                        <p className="font-bold text-gray-900 p-6">
                            {t('login.pilih_bahasa')}
                        </p>
                        <div>
                            <div className='px-4 divide-y'>
                                <div onClick={event => { onClickLanguageChange('id') }} className="w-full py-4 px-2 inline-flex">
                                    <img id="langID" className="w-6 h-6 rounded-full ring-1 ring-gray-300" src="assets/images/flag-id.png" alt="id-flag" />
                                    <div className='flex justify-between w-full'>
                                        <div>
                                            <span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">Indonesia</span>
                                        </div>
                                        {lng === 'id' &&
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                    fill="currentColor" className='w-6 h-6 text-emerald-500'>
                                                    <path
                                                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div onClick={event => { onClickLanguageChange('en') }} className="w-full py-4 px-2 inline-flex">
                                    <img id="langUS" className="w-6 h-6 rounded-full ring-1 ring-gray-300" src="assets/images/flag-us.png" alt="id-flag" />
                                    <div className='flex justify-between w-full'>
                                        <div>
                                            <span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">English</span>
                                        </div>
                                        {lng === 'en' &&
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                    fill="currentColor" className='w-6 h-6 text-emerald-500'>
                                                    <path
                                                        d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ActionSheet>
            <ActionSheet ref={reportproblem} sheetTransition="transform 0.3s ease-in-out">
                <div className="overflow-hidden rounded-2xl bg-white">
                    {/*<button className="modal-handle" aria-label="Activate to adjust the size of the dialog overlaying the screen"></button>*/}
                    <div className="divide-y pb-6 divide-gray-300">
                        <p className="font-bold text-gray-900 p-6">
                            Pilih layanan
                        </p>
                        <div>
                            <div className='px-4 divide-y'>
                                <div className="w-full py-4 px-2 inline-flex">
                                    {/* <a className='text-gray-700' href='https://wa.me/+6281388828280'> */}
                                    <div onClick={urlReportWhatsap} className='flex justify-between w-full'>
                                        <div>
                                            <FontAwesomeIcon icon={faWhatsapp}/>
                                            <span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">DigiTech Turing</span>
                                        </div>
                                    </div>
                                    {/* </a> */}
                                </div>
                                <div className="w-full py-4 px-2 inline-flex">
                                    {/* <a href='https://turing.ugems.id/support/login'> */}
                                    <div onClick={urlReportWeb} className='flex justify-between w-full'>
                                        <div>
                                            <FontAwesomeIcon icon={faGlobe}/>
                                            <span className="text-sm text-gray-700 font-medium ml-4" id="lang-id">Buat Tiket</span>
                                        </div>
                                    </div>
                                    {/* </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ActionSheet>
            <ActionSheet ref={about} sheetTransition="transform 0.3s ease-in-out">
                <div className="overflow-hidden rounded-2xl bg-white">
                    {/*<button className="modal-handle" aria-label="Activate to adjust the size of the dialog overlaying the screen"></button>*/}
                    <div className="divide-y pb-6 divide-gray-300">
                        <p className="font-bold text-gray-900 p-6">
                            About
                        </p>
                        <div>
                            <div className='px-4 divide-y'>
                                <div className="w-full text-center py-8">
                                    <div className='text-center'>
                                        <p className="text-sm text-gray-900 font-bold">{packageJson.productName}</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className="text-sm text-gray-900 font-bold">Version {packageJson.version}</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className="text-sm text-gray-900 font-bold">Environtment : {packageJson.mode === 'prod' ? "Production" : "Development" }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ActionSheet>
        </IonPage>
    );
};

export default Profile;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

