import {
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
  IonModal,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useCallback, useRef, useState } from "react";
import { useHistory, Route } from "react-router-dom";
// import { IonReactRouter } from "@ionic/react-router";
import { getJsonPref, getPref } from "../../../helper/preferences";
import ListHeader from "../../../components/Header/ListHeader";

import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  BellIcon,
  Battery0Icon,
  CakeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

import RequestList from "../Request/RequestList";
import RequestForm from "../Request/RequestForm";

import {
  // BASE_API_URL,
  // API_URI,
  PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI,
  pref_json_pegawai_info_login, pref_pegawai_unit_id,
  pref_unit, pref_unit_id,
  pref_identity,
  pref_user_id,
  pref_user_role,
  MEAL_REQ_SELF
} from "../../../constant/Index";

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const MealHomepage: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [identity, setIdentity] = useState<string>();
  const [pegUnitId, setPegUnitId] = useState();
  const [pegawai, setPegawai] = useState(user);
  const [role, setRole] = useState();
  const [unit, setUnit] = useState(userUnit);

  useIonViewDidEnter(() => {
      loadDataPref();
  });

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  
  const btnMealRequestList = () => {
    history.push("/meal/request");
  };

  const btnRequestForm = () => {
    history.push("/meal/request/form");
  };

  const btnMenuSehat = () => {
    history.push("/meal/menusehat");
  };

  const btnDayOff = () => {
    history.push("/meal/dayoff");
  };

  const btnBack = () => {
    history.push("/dashboard");
  }

  const loadDataPref = () => {
    getJsonPref(pref_json_pegawai_info_login).then((res) => {
      setPegawai(res);
      // console.log(res);
    });
    getJsonPref(pref_unit).then((restUnit) => {
      setUnit(restUnit);
    });
    getPref(pref_user_role).then((restRole) => {
      setRole(restRole);
    });
  }

  // const [showModalSetuju, setShowModalSetuju] = React.useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const modalSubmenu = useRef<HTMLIonModalElement>(null);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bg-red-700">

          <ListHeader title={"Meal Management"} isReplace={false} />
          {/*
          <div className="px-4 py-6">
              <div className="flex">
                  <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                  </svg>
                  <div className="ml-4">
                      <h3 className="text-base font-bold text-white">Meal Management</h3>
                  </div>
              </div>
          </div>

          <div className="rounded-2xl bg-white drop-shadow-md mx-5 mb-5 mt-0">
            <div className="flex w-full items-center justify-between space-x-6 py-4 px-6">
              <div className="flex-1 truncate">
                <div className="flex items-center">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {pegawai["name"]} <br />
                    {pegawai["nik"]}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid divide-gray-200 border-t border-gray-200  grid-cols-2 divide-y-0 divide-x">
              <div className="px-6 py-3 text-center text-sm font-medium">
                <span className="text-gray-600">
                  Masuk Kerja
                </span>
              </div>
              <div className="px-6 py-3 text-center text-sm font-medium">
                <span className="text-gray-600">
                  123 POINTS
                </span>
              </div>
            </div>
          </div>
          */}
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
            <div className="flex items-center justify-start overflow-y-scroll text-gray-500 cursor-pointer space-x-3 mx-5 mt-5">
              <div
                className="flex flex-col items-center justify-center w-40  h-20  bg-gray-200 rounded-2xl text-gray-800 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                id="buttonRequest"
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Request Meal</p>
              </div>
              <div
                className="flex flex-col items-center justify-center w-40  h-20  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Daftar Pesanan</p>
              </div>
              <div
                className="flex flex-col items-center justify-center w-40  h-20  bg-white rounded-2xl text-gray-800 mb-2 bg-white transition ease-in duration-300"
              >&nbsp;</div>
              {/*
              <div
                  className="flex flex-col items-center justify-center w-40  h-20  bg-indigo-200  rounded-2xl  text-indigo-500 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                  <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                  <p className="text-sm mt-1">Menu Sehat</p>
              </div>
              <div
                  className="flex flex-col items-center justify-center w-40  h-20  bg-pink-200   rounded-2xl text-pink-500 shadow hover:shadow-md cursor-pointer mb-2  bg-white transition ease-in duration-300">
                  <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                  <p className="text-sm mt-1">Day Off Menu</p>
              </div>
              */}
            </div>

            <p className="text-red-500 font-bold mx-5 my-0 cursor-pointer" id="buttonSubmenu">Menu Lainnya</p>

            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white my-6 mx-5">
              <div className="px-4 py-5 p-6">
                <p className="mb-0 font-sans leading-normal text-sm text-gray-900">Saat Ini anda Mula Tercatat mendapatkan menu sehat mulai tanggal</p>
                <h5 className="mb-0 font-bold text-gray-900">
                    9 September 2022
                </h5>
              </div>
            </div>

            <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white my-6 mx-5">
              <div className="px-4 py-5 p-6">
                <h3 className="text-md font-bold text-gray-900">
                  Pesanan Makanan
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <span className="inline-flex items-center text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-5 mr-6 text-green-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pagi
                  </span>
                  <span className="text-right text-gray-900">Kantin BIB</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <span className="inline-flex items-center text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-5 mr-6 text-gray-200"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Siang
                  </span>
                  <span className="text-right text-gray-900">Kantin BIB</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <IonModal ref={modal} trigger="buttonRequest" initialBreakpoint={0.5} breakpoints={[0, 0.25, 0.5, 0.75]}>
          <IonContent className="ion-padding">
            <div>
              <h3 className="text-base font-bold text-gray-900 text-center my-2">Pesanan Untuk</h3>

              <div className="text-gray-900">
                <label>
                  <input type="checkbox" checked /> Pagi <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Siang <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Sore <br />
                </label>
                <label>
                  <input type="checkbox" checked /> Supper <br />
                </label>
              </div>

              <div className="text-center">
                <button className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                  <span className="text-purple-700">Batal</span>
                </button>

                <button className="inline-flex text-center items-center rounded bg-purple-700 px-2.5 py-3 text-xs font-bold mt-5 ml-4" onClick={btnRequestForm}>
                  <span className="text-white">Buat</span>
                </button>
              </div>

            </div>
          </IonContent>
        </IonModal>

        <IonModal ref={modalSubmenu} trigger="buttonSubmenu" initialBreakpoint={0.75} breakpoints={[0, 0.25, 0.5, 0.75]}>
          <IonContent className="ion-padding">
            <div className="grid grid-cols-2 gap-2 overflow-y-scroll text-gray-500 cursor-pointer mx-5 mt-5">
              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Packmeal Divisi</p>
              </div>
              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Packmeal Tamu</p>
              </div>

              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Tidak Makan</p>
              </div>

              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMenuSehat}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Menu Sehat</p>
              </div>

              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnDayOff}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Day Off Menu</p>
              </div>

              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Menu VVIP</p>
              </div>

              <div
                className="flex flex-col items-center justify-center py-3  bg-gray-200 rounded-2xl text-gray-800  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300"
                onClick={btnMealRequestList}
              >
                <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                <p className="text-xs mt-1">Paket Harga</p>
              </div>
              
              {/*
              <div
                  className="flex flex-col items-center justify-center w-40  h-20  bg-indigo-200  rounded-2xl  text-indigo-500 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                  <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                  <p className="text-sm mt-1">Menu Sehat</p>
              </div>
              <div
                  className="flex flex-col items-center justify-center w-40  h-20  bg-pink-200   rounded-2xl text-pink-500 shadow hover:shadow-md cursor-pointer mb-2  bg-white transition ease-in duration-300">
                  <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                  <p className="text-sm mt-1">Day Off Menu</p>
              </div>
              */}
            </div>
          </IonContent>
        </IonModal>
      </IonContent>

    </IonPage>
  );
};

export default MealHomepage;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
