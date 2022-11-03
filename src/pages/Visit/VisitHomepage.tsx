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
  
  const VisitHomepage: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
      console.log("Begin async operation");
  
      setTimeout(() => {
        console.log("Async operation has ended");
        event.detail.complete();
      }, 2000);
    }
    const clickEmployee = () => {
      history.push("/visit/visitlist");
    };
    const clickGuest = () => {
      history.push("/visit/requestvisit");
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
                      <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        <div className="-ml-px flex w-0 flex-1">
                          <a
                              href=""
                              className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                          >
                              DEVISI 
                          </a>
                          </div>
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
                <div className="flex items-center justify-center overflow-y-scroll  text-gray-500 cursor-pointer space-x-3 pl-5 pr-5 m-5">
                <svg className="h-20 w-20 text-black"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <p>Site Visit</p>
                </div>
                <div className="flex items-center justify-between overflow-y-scroll text-gray-500 cursor-pointer space-x-3 pl-5 pr-5 m-5">
                    <div onClick={clickEmployee}
                        className="flex flex-col items-center justify-center w-80  h-20  bg-green-200 rounded-2xl text-green-600 shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <svg className="h-16 w-16 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
</svg>
                        <p className="text-sm mt-1 text-bold">KARYAWAN</p>
                    </div>
                    <div onClick={clickGuest}
                        className="flex flex-col items-center justify-center w-80  h-20  bg-yellow-200 rounded-2xl text-yellow-600  shadow hover:shadow-md cursor-pointer mb-2 bg-white transition ease-in duration-300">
                        <svg className="h-16 w-16 text-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
</svg>

                        <p className="text-sm mt-1 text-bold">TAMU</p>
                    </div>
                </div>
            </div>
             
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default VisitHomepage;
  function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error("Function not implemented.");
  }
  