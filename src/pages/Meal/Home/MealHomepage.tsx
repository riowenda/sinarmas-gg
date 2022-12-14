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
import { getJsonPref, getPref } from "../../../helper/Preferences";
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
          <div className="bg-white">
            <div className="px-4 py-4">
                <h3 className="font-bold py-2">Status</h3>
                <div className="flex justify-between items-center overflow-hidden rounded-lg bg-teal-500 text-white border border-1 border-gray-200 text-sm">
                    <div className="px-4 py-5 p-6">
                      <p className="mb-0 font-sans leading-normal text-sm">Saat Ini anda Mula Tercatat mendapatkan menu sehat mulai tanggal</p>
                      <p className="mb-0 font-bold leading-normal text-sm">
                          9 September 2022
                      </p>
                    </div>
                    {/* <img className='h-20 -ml-6 object-right' src='assets/images/banners/car-mpv-on-visit.png' /> */}
                </div>
            </div>
            <div className="px-4 py-4">
              <h3 className="font-bold py-2">Menu</h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/request/form"); }}
                >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/request.png" />

                  <span className='ml-1 text-left'>Permintaan Makanan</span>
                </button>

                <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/request"); }}
                >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/list.png" />
                  
                  <span className='ml-1 text-left'>Daftar Pesanan</span>
                </button>
                <p className="text-red-500 font-bold cursor-pointer" id="buttonSubmenu">Menu Lainnya</p>
              </div>


              {/* <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white my-6">
                <div className="px-4 py-5 p-6">
                  <p className="mb-0 font-sans leading-normal text-sm text-gray-900">Saat ini anda mendapatkan menu sehat mulai tanggal</p>
                  <h5 className="mb-0 font-bold text-gray-900">
                      9 September 2022
                  </h5>
                </div>
              </div> */}

              <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white my-6">
                <div className="px-4 py-5 p-6">
                  <h3 className="text-md font-bold text-gray-900">
                    Pesanan Makanan
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-4 cursor-pointer" onClick={() => history.push("/meal/receive?shiftId=1")}>
                    <span className="inline-flex items-center text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-6 h-5 mr-3 text-green-600"
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
                  <div className="grid grid-cols-2 gap-2 mt-4 cursor-pointer" onClick={() => history.push("/meal/receive?shiftId=2")}>
                    <span className="inline-flex items-center text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-6 h-5 mr-3 text-green-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Siang
                    </span>
                    <span className="text-right text-gray-900">Kantin BIB</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 cursor-pointer" onClick={() => history.push("/meal/receive?shiftId=3")}>
                    <span className="inline-flex items-center text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-5 mr-3 text-gray-200"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sore
                    </span>
                    <span className="text-right text-gray-900">Kantin BIB</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 cursor-pointer" onClick={() => history.push("/meal/receive?shiftId=4")}>
                    <span className="inline-flex items-center text-gray-900">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-5 mr-3 text-gray-200"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3 10.5a.75.75 0 000-1.5H9a.75.75 0 000 1.5h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Supper
                    </span>
                    <span className="text-right text-gray-900">Kantin BIB</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <IonModal ref={modalSubmenu} trigger="buttonSubmenu" initialBreakpoint={0.75} breakpoints={[0, 0.25, 0.5, 0.75]}>
          <IonContent className="ion-padding">
          <div className="grid grid-cols-2 gap-2 overflow-y-scroll cursor-pointer mx-5 mt-5">
              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/request/form-division"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/division.png" />
                  <span className="ml-1 text-left">Packmeal Divisi</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/request/form-visitor"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/visitor.png" />
                  <span className="ml-1 text-left">Pesanan Tamu</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={btnMealRequestList}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/noteat.png" />
                  <span className="ml-1 text-left">Tidak Makan</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/menusehat"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/healthy.png" />
                  <span className="ml-1 text-left">Menu Sehat</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/dayoff"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/dayoff.png" />
                  <span className="ml-1 text-left">Day Off</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/menuvvip"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/vvip.png" />
                  <span className="ml-1 text-left">Menu VVIP</span>
              </button>

              <button
                  className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-3 text-xs font-bold"
                  onClick={() => { history.push("/meal/packet"); modalSubmenu.current?.dismiss() }}
              >
                  <img className="w-6 ml-2 mr-2" src="assets/icon/meal-menus/packet.png" />
                  <span className="ml-1 text-left">Menu Paket</span>
              </button>
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
