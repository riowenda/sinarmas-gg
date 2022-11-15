import {
  IonContent,
  IonItem,
  IonList,
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
import ListHeader from "../../../components/Header/ListHeader";
import BadgeStatus from "../../../components/Badge/BadgeStatus";
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

    loadDataMenuSehat(1);

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
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
    getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); loadDataMenuSehat(res); });
  }
  const url = BASE_API_URL + API_URI + '/healthymenuproposals?dateStart=2022-01-01&dateEnd=2022-12-31';

  const loadDataMenuSehat = (user: any) => {
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
          <ListHeader title={"Daftar Menu Sehat"} isReplace={false} link={"/meal/menuSehat/form"} addButton={true} />

          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white pt-3 px-2">
            <div className="rounded-lg py-1 px-2 mb-3 border border-1 border-purple-500 text-center cursor-pointer" onClick={() => {history.push('/meal/menuSehat/form')}}>
              <span className="text-purple-700">Ajukan menu sehat</span>
            </div>
            {/*
            <button className="block text-center rounded-lg bg-white border border-1 border-gray-500 px-2.5 py-3 text-xs font-bold mt-5">
            </button>
            */}
              <IonList>
                  {items.map((data, index) => {
                  return (
                  <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300" key={data['id']}>
                      <IonItem routerLink={"/meal/menusehat/detailpengajuan/" + data['id']} routerDirection="forward" className="border-0" lines="none">
                      <div className="p-3 m-1 rounded-md">
                          <div className="grid grid-cols-12 gap-4">
                              <div className="col-start-1 col-end-6 flex items-center justify-start justify-items-start">
                                  <p className="text-base text-gray-900">
                                      {moment(data['request_date']).format('DD MMM yyyy').toString()}
                                  </p>
                              </div>
                              <div className="col-end-13 col-span-6 flex items-center justify-end justify-items-end">
                                  <BadgeStatus title={data['status']}></BadgeStatus>
                              </div>
                          </div>
                      </div>
                      </IonItem>
                  </div>
                  )
                  })}
              </IonList>

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
