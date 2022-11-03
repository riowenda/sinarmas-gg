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
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  BellIcon,
  Battery0Icon,
  CakeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

const MealHomepage: React.FC = () => {
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

        <div className="bg-slate-100 rounded-md rounded-lg lg:rounded-lg p-3 pt-3">
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
                    <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="-ml-px flex w-0 flex-1">
                        <a
                            href=""
                            className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                        >
                            Masuk Kerja
                        </a>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mt-2">
                <div className="flex items-center justify-between overflow-y-scroll text-gray-500 cursor-pointer space-x-3 pl-5 pr-5 m-5">
                    <div
                        className="flex flex-col items-center justify-center w-40  h-20  bg-green-200 rounded-2xl text-green-600 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                        <p className="text-sm mt-1">Meal Devisi</p>
                    </div>
                    <div
                        className="flex flex-col items-center justify-center w-40  h-20  bg-yellow-200 rounded-2xl text-yellow-600  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                        <p className="text-sm mt-1">Daftar Pesanan</p>
                    </div>

                    <div
                        className="flex flex-col items-center justify-center w-40  h-20  bg-indigo-200  rounded-2xl  text-indigo-500 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                        <p className="text-sm mt-1">Menu Sehat</p>
                    </div>
                    <div
                        className="flex flex-col items-center justify-center w-40  h-20  bg-pink-200   rounded-2xl text-pink-500 shadow hover:shadow-md cursor-pointer mb-2  bg-white transition ease-in duration-300">
                        <svg className="h-8 w-8 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  <polyline points="14 2 14 8 20 8" />  <line x1="16" y1="13" x2="8" y2="13" />  <line x1="16" y1="17" x2="8" y2="17" />  <polyline points="10 9 9 9 8 9" /></svg>
                        <p className="text-sm mt-1">Day Off Menu</p>
                    </div>
                </div>
            </div>
          

            <div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mt-2">
                <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                    <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                        <p className="mb-0 font-sans leading-normal text-sm">Saat Ini anda Mula Tercatat mendapatkan menu sehat mulai tanggal</p>
                        <h5 className="mb-0 font-bold">
                            9 September 2022
                        </h5>
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                        <BellIcon
                            className="text-white"
                            viewBox="-3 -3 30 30"
                        />
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-white rounded-md rounded-lg lg:rounded-lg p-0.5 mt-2">
                <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-full max-w-full px-3">
                    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                        <h6>Pesanan Makan</h6>
                        <p>17 Agustues 2022</p>
                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                        <div className="p-0 overflow-x-auto">
                            <table className="items-center justify-center w-full mb-0 align-top border-gray-200 text-slate-500">
                            <thead className="align-bottom">
                                <tr>
                                <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Project</th>
                                <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Budget</th>
                                <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Status</th>
                                <th className="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Completion</th>
                                <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-gray-200 border-solid shadow-none tracking-none whitespace-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                        <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">Pecel</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$2,500</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">working</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">60%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-blue-600 to-cyan-400 -mt-0.38 -ml-px flex h-1.5 w-3/5 flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all"role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                    <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">Rujak</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$5,000</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">done</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">100%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-green-600 to-lime-400 -mt-0.38 -ml-px flex h-1.5 w-full flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all" role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                    <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">SOTO LAMONGAN</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$3,400</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">canceled</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">30%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-red-600 to-rose-400 -mt-0.38 w-3/10 -ml-px flex h-1.5 flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all"role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                    <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">Mie Ayam</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$1,000</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">canceled</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">0%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-green-600 to-lime-400 -mt-0.38 -ml-px flex h-1.5 w-0 flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all" role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                    <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">Remes</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$14,000</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">working</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">80%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-blue-600 to-cyan-400 -mt-0.38 -ml-px flex h-1.5 w-4/5 flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all" role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                                <tr>
                                <td className="p-2 align-middle bg-transparent border-b-0 whitespace-nowrap shadow-transparent">
                                    <div className="flex px-2">
                                    <div>
                                    <input type="checkbox"></input>  &nbsp; &nbsp;
                                    </div>
                                    <div className="my-auto">
                                        <h6 className="mb-0 leading-normal text-sm">Gado Gado</h6>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b-0 whitespace-nowrap shadow-transparent">
                                    <p className="mb-0 font-semibold leading-normal text-sm">$2,300</p>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b-0 whitespace-nowrap shadow-transparent">
                                    <span className="font-semibold leading-tight text-xs">done</span>
                                </td>
                                <td className="p-2 text-center align-middle bg-transparent border-b-0 whitespace-nowrap shadow-transparent">
                                    <div className="flex items-center justify-center">
                                    <span className="mr-2 font-semibold leading-tight text-xs">100%</span>
                                    <div>
                                        <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div className="duration-600 ease-soft bg-gradient-to-tl from-green-600 to-lime-400 -mt-0.38 -ml-px flex h-1.5 w-full flex-col justify-center overflow-hidden whitespace-nowrap rounded bg-fuchsia-500 text-center text-white transition-all" role="progressbar"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="p-2 align-middle bg-transparent border-b-0 whitespace-nowrap shadow-transparent">
                                    <button className="inline-block px-6 py-3 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border-0 rounded-lg shadow-none leading-pro text-xs ease-soft-in bg-150 tracking-tight-soft bg-x-25 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /> </svg>
                                    </button>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
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

export default MealHomepage;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
