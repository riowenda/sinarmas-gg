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

const RequestVisitEmployee: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  const btnP2H = () => {
    history.push("/fuel/p2h/p2hlist");
  };
  const btnLepasUnit = () => {
    history.push("/fuel/p2h/p2hlepas");
  };
  const btnGantiUnit = () => {
    history.push("/fuel/p2h/p2hganti");
  };

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
            <div className="px-5 pt-5 pb-2">
              <div className="col-span-1 divide-y divide-red-900 rounded-lg bg-white shadow border-solid border-2 border-red-900 ">
                <div className="flex w-full items-center justify-between space-x-6 p-6 border border-gray-300">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        Irvan Noviansyah
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      123141212
                    </p>
                  </div>
                  <div className="text-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                      />
                    </svg>
                    <div className="marginToLeft">5.938</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mt-2">
            <div className="flex items-center text-left overflow-y-scroll text-gray-500 cursor-pointer space-x-3 pl-5 pr-5 m-5">
              <svg
                className="h-7 w-7 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-bold text-xl" >Site Visit</p>
                <div className="flex justify-items-end overflow-y-scroll  text-gray-500 cursor-pointer space-x-3 pl-5 pr-5">
                    <div className="flex flex-col items-center justify-center w-40  h-8  bg-green-200 rounded-2xl text-green-600 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <p className="text-sm mt-1 text-bold justify-items-end">REQESTED</p>
                    </div>
                </div>
            </div>


            <div className="col-span-1 divide-y divide-red-900 rounded-lg bg-white shadow pl-10 pr-10 mb-5">                
                <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
                    <hr className="h-px my-6 bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
                    <table className="table-auto border-white mb-3">
                    <tbody className="border-white">
                        <tr>
                        <td className="border px-4 py-2">Nama</td>
                        <td className="border px-4 py-2">Joe Sung Park</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Nik</td>
                        <td className="border px-4 py-2">112</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Cost</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Devisi</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Tanggal Mulai</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Tanggal Akhir</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Durasi</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Tanggal Kedatangan</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Alasan</td>
                        <td className="border px-4 py-2">1,280</td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Fasilitas</td>
                        <td className="border px-4 py-2">
                            <ul>
                                <li><input type="checkbox"/>Motor</li>
                                <li><input type="checkbox"/>Mobil</li>
                            </ul>
                        </td>
                        </tr>
                        <tr>
                        <td className="border px-4 py-2">Catatan</td>
                        <td className="border px-4 py-2">
                        <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                    <div className="items-center text-center pb-2">
                        <button type="button" className="rounded-md w-18 inline-block px-4 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight  hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-0 active:bg-red-800 transition duration-150 ease-in-out">
                            TOLAK
                        </button>
                        &nbsp;
                        <button type="button" className="rounded-md w-18 inline-block px-4 py-2.5 bg-blue-900 text-white font-medium text-xs leading-tight  hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">
                            SETUJU
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RequestVisitEmployee;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
