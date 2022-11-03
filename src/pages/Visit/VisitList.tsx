import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";

import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";

const VisitList: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <header className="bg-white">
          <nav className="mx-auto max-w-7xl sm:px-6 lg:px-8" aria-label="Top">
            <div className="flex w-full items-center justify-between border-b border-red-900 px-4 py-4 lg:border-none bg-white rounded-b-full border-white">
              <img
                className="h-17 w-auto"
                src="/assets/icon/header.png?color=white"
                alt=""
              />
              <div className="ml-10 space-x-5">
                <div className="flex-wrap lg:hidden">
                  <div className="notifBell">
                    <button
                      type="button"
                      className="inline-flex relative items-center text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      <BellIcon
                        className="h-8 w-9 text-white"
                        viewBox="2 0 23 25"
                      />
                      <div className="inline-flex absolute -top-2 -right-2 justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                        20
                      </div>
                    </button>
                  </div>
                  <div className="paddNotif">
                    <select
                      id="location"
                      name="location"
                      className="mt-1  w-full rounded-md border-red-300 py-2 pl-3 bg-white focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm ion-text-right"
                      defaultValue="Indonesia"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="bg-slate-100 rounded-md rounded-lg lg:rounded-lg p-3 pt-2">
          <div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 ">
             <h1 className="mb-0 font-bold text-2xl ">Daftar Visit</h1>
             <div className="sm:col-span-2 mt-7 mb-7 ml-3 mr-3">
                  <button type="button" className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Buat Visit
                  </button>
              </div>
            </div>
        </div>

        <div className="bg-slate-100 rounded-md rounded-lg lg:rounded-lg p-3 pt-2">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <h5 className="mb-0 font-bold">Site Visit</h5>
                    <p className="mb-0 font-sans leading-normal text-sm">
                      1 Juli 2015 -2 Juli 2015
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-green-400 to-green-800">
                    <svg
                      className="w-30 h-30"
                      fill="none"
                      stroke="white"
                      viewBox="-3 -3 30 30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mt-2">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <h5 className="mb-0 font-bold">Site Visit</h5>
                    <p className="mb-0 font-sans leading-normal text-sm">
                      1 Juli 2015 -2 Juli 2015
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-red-400 to-red-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="-3 -3 30 30"
                      strokeWidth={1.5}
                      stroke="white"
                      className="w-30 h-30"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />{" "}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VisitList;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
