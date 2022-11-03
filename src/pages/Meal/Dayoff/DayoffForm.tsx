import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter,
  IonDatetime,
  IonDatetimeButton,
  IonModal
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useCallback, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { getJsonPref, getPref } from "../../../helper/preferences";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  BellIcon,
  Battery0Icon,
  CakeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";


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

const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const DayoffHome: React.FC = () => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [identity, setIdentity] = useState<string>();
  const [pegUnitId, setPegUnitId] = useState();
  const [pegawai, setPegawai] = useState(user);
  const [role, setRole] = useState();
  const [unit, setUnit] = useState(userUnit);

  const [items, setItems] = useState([]);

  const history = useHistory();
  const { t } = useTranslation();

  /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
  jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
  useIonViewDidEnter(() => {
      loadDataPref();
  });

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    loadDataMealReq(1);

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  const btnBack = () => {
    history.push("/meal");
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


    // getPref(pref_identity).then(res => { setIdentity(res) });
    getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); loadDataMealReq(res); });
  }

  const loadDataMealReq = (user: any) => {
    const url = BASE_API_URL + API_URI + MEAL_REQ_SELF;
    fetch(url).then(res => res.json()).then(
      (result) => {
        // console.log(result.data);
        setItems(result.data);
        setIsLoaded(true);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bg-red-700">
          <div className="px-4 py-6">
              <div className="flex">
                  <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                  </svg>
                  <div className="ml-4">
                      <h3 className="text-base font-bold text-white">Day Off</h3>
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
                  {/*
                  <p className="truncate text-sm font-medium text-gray-900">
                  </p>
                  */}
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
          
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300 px-2 text-xs">
              Saat ini anda tercatat dalam sistem akan day off dari tanggal 01-01-2022 sampai 08-01-2022 dengan durasi 8 hari
            </div>

            <h3 className="text-base font-bold text-gray-900 text-center my-2">Permohonan mengaktikan menu saat day off</h3>

            <h4 className="text-base font-bold text-gray-900 my-2">Tanggal Awal</h4>
            <div className="mb-3">
              <div className="flex">
                <IonDatetimeButton datetime="datetimeStart"></IonDatetimeButton>
                <div>&nbsp;</div>
              </div>
        
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetimeStart"></IonDatetime>
              </IonModal>
            </div>

            <h4 className="text-base font-bold text-gray-900 my-2">Tanggal Akhir</h4>
            <div className="mb-3">
              <div className="flex">
                <IonDatetimeButton datetime="datetimeEnd"></IonDatetimeButton>
                <div>&nbsp;</div>
              </div>
        
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetimeEnd"></IonDatetime>
              </IonModal>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 py-2">Alasan</p>
              <textarea rows={3} className="block w-full max-w-lg rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={''}/>
            </div>

            <div className="text-right mb-5">
              <button className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                <span className="text-red-500">Batal</span>
              </button>

              <button className="inline-flex text-center items-center rounded bg-purple-700 px-2.5 py-3 text-xs font-bold mt-5 ml-4">
                <span className="text-white">Ajukan</span>
              </button>
            </div>

            {/*
            <button className="block text-center rounded-lg bg-white border border-1 border-gray-500 px-2.5 py-3 text-xs font-bold mt-5">
            </button>
            */}

            {/*<h3 className="text-base text-gray-900 text-center my-4">Load more...</h3>*/}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DayoffHome;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
