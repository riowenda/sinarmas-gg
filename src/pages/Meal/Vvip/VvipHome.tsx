import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  useIonViewDidEnter
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useCallback, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
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
    const url = BASE_API_URL + API_URI + '/dayoffs';
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
          <ListHeader title={"Day Off"} isReplace={false} link={"/meal/dayoff/form"} addButton={true} />
          
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white px-2 pt-2">
            <h3 className="font-bold text-gray-900 text-center my-2">Permohonan mengaktikan menu saat day off</h3>

            <div className="rounded-lg py-1 px-2 mb-3 border border-1 border-purple-500 text-center cursor-pointer" onClick={() => { history.push('/meal/dayoff/form') }}>
              <span className="text-purple-700">Buat Permohonan</span>
            </div>
            {/*
            <button className="block text-center rounded-lg bg-white border border-1 border-gray-500 px-2.5 py-3 text-xs font-bold mt-5">
            </button>
            */}
            {items.map((data, index) => {
              return (
                <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300" key={data['id']}>
                  <div className="px-2 py-2">
                    <div className="relative flex space-x-3">
                      <div className="flex min-w-0 flex-1 justify-between space-x-4">
                        <div>
                          <p className="font-bold text-gray-900">
                            {moment(data['date_start']).format('DD MMM yyyy').toString()} sd.
                            {moment(data['date_end']).format('DD MMM yyyy').toString()}
                          </p>
                          {/*<p className="text-sm text-gray-900">PT. Semesta Transportasi Limbah Indonesia</p>*/}
                        </div>
                        <div className="whitespace-nowrap text-right text-xs bg-yellow-500 rounded-lg">
                          <span className="text-white px-2 font-bold">{data['status']}</span>
                        </div>
                      </div>

                    </div>
                    <p>
                      {data['day_count']} hari <br />
                      Alasan Pengajuan <br />
                      {data['user_reason']}
                    </p>
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
