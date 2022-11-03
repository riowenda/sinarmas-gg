import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useCallback, useState, useEffect } from "react";
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

  const [items, setItems] = useState<any>([]);

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
  const url = BASE_API_URL + API_URI + '/healthymenuproposals?dateStart=2022-01-01&dateEnd=2022-12-31';

  const loadDataMealReq = (user: any) => {
    const url = BASE_API_URL + API_URI + '/healthymenuproposals?dateStart=2022-01-01&dateEnd=2022-12-31';
    fetch(url).then(res => res.json()).then(
      (result) => {
        //console.log(result.data);
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
                      <h3 className="text-base font-bold text-white">Menu Sehat</h3>
                  </div>
              </div>
          </div>

          <div className="rounded-2xl bg-white drop-shadow-md mx-5 mb-5 mt-0">
            <div className="flex w-full items-center justify-between space-x-6 py-4 px-6">
              <div className="flex-1 truncate">
                <div className="flex items-center">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {/* {pegawai["name"]} <br />
                    {pegawai["nik"]} */}
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
            <h3 className="text-base font-bold text-gray-900 text-center my-2">Daftar Menu Sehat</h3>


            <div className="rounded-lg py-1 px-2 mb-3 border border-1 border-purple-500 text-center">
              <span className="text-purple-700">Ajukan menu sehat</span>
            </div>
            {/*
            <button className="block text-center rounded-lg bg-white border border-1 border-gray-500 px-2.5 py-3 text-xs font-bold mt-5">
            </button>
            */}
            {items.map((data:any, index:any) => {
              return (
                <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300" key={data['id']}>
                  <div className="px-2 py-2">
                    <div className="relative flex space-x-3">
                      <div className="flex min-w-0 flex-1 justify-between space-x-4">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {moment(data['request_date']).format('DD MMM yyyy').toString()}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs bg-blue-500 rounded-lg">
                          <span className="text-white px-2 font-bold">Active</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}

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
