import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react';

import './P2HDashboard.css';
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import React, {useCallback} from "react";
import {useHistory} from "react-router-dom";

const people = [
    { id: 1, name: 'Annette Black' },
    { id: 2, name: 'Cody Fisher' },
    { id: 3, name: 'Courtney Henry' },
    { id: 4, name: 'Kathryn Murphy' },
    { id: 5, name: 'Theresa Webb' },
]

const P2HDashboard: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }
    const btnP2H = () => {
        history.push("/fuel/p2h/p2hlist");
    };
    const btnLepasUnit = () => {
        history.push("/fuel/unit/lepas");
    };
    const btnGantiUnit = () => {
        history.push("/fuel/unit/ganti");
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <div className="bg-gradient-to-r from-red-700 to-red-500 p-5 pt-12">


                    <div className="bg-white ounded-lg lg:rounded-lg p-2 ">
                        <div className="relative relativeTop text-center">
                            <div className="relative flex justify-center">
                                <span className="inline-block h-17 w-17 overflow-hidden rounded-full bg-red-400">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="px-5 pt-5 pb-2">
                            <div className="col-span-1 divide-y divide-red-900 rounded-lg bg-white shadow border-solid border-2 border-red-900 ">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">Irvan Noviansyah</h3>

                                        </div>
                                        <p className="mt-1 truncate text-sm text-gray-500">123141212</p>
                                    </div>
                                    <div className="text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                        </svg>
                                        <div className="marginToLeft">
                                            5.938
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <div className="-mt-px flex divide-x divide-gray-200">
                                        <div className="flex w-0 flex-1 text-wrap p-2 text-sm">
                                            Sedang perjalanan dinas ke BIB site
                                        </div>
                                        <div className="flex text-center p-2 text-sm">
                                            Masuk Kerja
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-red-500" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <button type="button" className="relative inline-flex items-center rounded-l-md rounded-r-md border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500">
                                    Fuel
                                  </button>
                                </span>
                            </div>
                        </div>


                        <div className="p-5">
                            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow border-solid border-2 border-gray-300">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">BIB101</h3>
                                        </div>
                                        <div className="text-sm sm:text-sm">PT. Semesta Transportasi Limbah Indonesia</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="marginToLeft">
                                            Triton
                                        </div>
                                        <div className="marginToLeft">
                                            H8349AC
                                        </div>
                                    </div>

                                </div>
                                <div className="items-center text-center pb-2">

                                    <button onClick={btnLepasUnit} type="button" className="rounded-md inline-block px-4 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight  hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">
                                        Lepas Unit
                                    </button>
                                    &nbsp;
                                    <button onClick={btnP2H}  type="button" className="rounded-md inline-block px-4 py-2.5 bg-red-900 text-white font-medium text-xs leading-tight  hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">
                                        P2H
                                    </button>
                                    &nbsp;
                                    <button onClick={btnGantiUnit} type="button" className="rounded-md inline-block px-4 py-2.5 bg-orange-600 text-white font-medium text-xs leading-tight  hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out">
                                        Ganti Unit
                                    </button>
                                </div>
                            </div>


                        </div>

                        <div className="sm:col-span-2">
                            <button type="button" className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Permintaan bahan bakar unit
                            </button>
                        </div>
                        <div className="pt-1"></div>
                        <div className="sm:col-span-2">
                            <button type="button" className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Daftar kupon
                            </button>
                        </div>
                        <div className="pt-1"></div>
                        <div className="sm:col-span-2">
                            <button type="button" className="inline-flex w-full items-center justify-center rounded-md border border-solid border-red-900 bg-gray-300 px-6 py-3 text-base font-medium text-red-900 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Menu lainnya
                            </button>
                        </div>
                        <div className="pt-5"></div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-blue-500" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                  <button type="button" className="relative inline-flex items-center rounded-l-md rounded-r-md border border-blue-300 bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-50 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    Status Kupon
                                  </button>
                                </span>
                            </div>

                        </div>
                        <div className="px-2">

                            <div className="mt-4 divide-y divide-gray-200 border-b border-blue-200">
                                <div className="relative flex items-start py-4">
                                    <div className="min-w-0 flex-1 text-sm">
                                        <label className="select-none font-medium text-gray-700">
                                            Kupon bahan bakar
                                        </label>
                                    </div>
                                    <div className="ml-3 flex h-5 items-center">
                                        BIB 1012 BB
                                    </div>
                                </div>
                                <div className="relative flex items-start py-4">
                                    <div className="min-w-0 flex-1 text-sm">
                                        <label className="select-none font-medium text-gray-700">
                                            123123
                                        </label>
                                    </div>
                                    <div className="ml-3 flex h-5 items-center">
                                        Disetujui oleh
                                    </div>
                                </div>
                                <div className="relative flex items-start py-4">
                                    <div className="min-w-0 flex-1 text-sm">
                                        <label className="select-none font-medium text-gray-700">
                                            H 8349 AQ
                                        </label>
                                    </div>
                                    <div className="ml-3 flex h-5 items-center">
                                        Financial
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pb-2"></div>


                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default P2HDashboard;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

