import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonDatetime,
  IonDatetimeButton,
  IonModal
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";
import Select from 'react-select'

import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  BellIcon,
  Battery0Icon,
  CakeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import ListHeader from "../../../components/Header/ListHeader";

const options = [
  { value: 'kantin', label: 'Kantin' },
  { value: 'pos1', label: 'Pos 1' },
]

const MealRequestForm: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  const btnBack = () => {
    history.push("/dashboard");
  }

  const handleSelectChange = async (event: any) => {
    console.log(event)
  }
  const setAlasan = async (event: any) => {
    console.log(event)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bg-red-700">

          <ListHeader title={"Buat Pesanan"} isReplace={false} />

          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mb-5">*/}
          <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
            <h4 className="text-base font-bold text-gray-900 my-2 text-center">Tanggal</h4>

            <div className="mb-3">
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
        
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetime"></IonDatetime>
              </IonModal>
            </div>

            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300 bg-gray-100">
              <div className="px-2 py-2">
                <div className="relative space-x-3">
                  <div className="flex min-w-0 flex-1 justify-between">
                    <p className="text-sm font-bold text-gray-900 py-2">Pagi</p>
                    <label className="m-2">
                      <input type="checkbox" checked className="py-2" /> Tidak Pesan <br />
                    </label>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 py-2">Diantar ke</p>
                    <Select placeholder="Diantar ke" options={options} onChange={event => handleSelectChange(event)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300 bg-gray-100">
              <div className="px-2 py-2">
                <div className="relative space-x-3">
                  <div className="flex min-w-0 flex-1 justify-between">
                    <p className="text-sm font-bold text-gray-900 py-2">Siang</p>
                    <label className="m-2">
                      <input type="checkbox" checked className="py-2" /> Tidak Pesan <br />
                    </label>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 py-2">Alasan tidak pilih menu</p>
                    <textarea onChange={(event) => setAlasan(event.target.value)} rows={3} className="block w-full max-w-lg rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue={''}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right mb-5">
              <button className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                <span className="text-red-500">Batal</span>
              </button>

              <button className="inline-flex text-center items-center rounded bg-purple-700 px-2.5 py-3 text-xs font-bold mt-5 ml-4">
                <span className="text-white">Buat Pesanan</span>
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MealRequestForm;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
