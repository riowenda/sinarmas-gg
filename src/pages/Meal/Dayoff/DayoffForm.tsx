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
          <ListHeader title={"Pengajuan Day Off"} isReplace={false} />
          
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white px-2 pt-2 pb-6">
            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300 px-2 text-xs">
              Saat ini anda tercatat dalam sistem akan day off dari tanggal 01-01-2022 sampai 08-01-2022 dengan durasi 8 hari
            </div>

            <h3 className="font-bold text-gray-900 text-center my-4">Permohonan mengaktikan menu saat day off</h3>

            <h4 className="text-gray-900 my-2">Tanggal Awal</h4>
            <div className="border-b border-gray-300 py-2 text-gray-900">
              <input type="date" id="dateStart" className="block w-full" defaultValue={''} onChange={e => console.log(e.target.value)} />
            </div>

            <h4 className="text-gray-900 my-2">Tanggal Akhir</h4>
            <div className="border-b border-gray-300 py-2 text-gray-900">
              <input type="date" id="dateEnd" className="block w-full" defaultValue={''} onChange={e => console.log(e.target.value)} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 py-2">Alasan</p>
              <textarea rows={3} className="block w-full max-w-lg rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border border-gray-300" defaultValue={''}/>
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
