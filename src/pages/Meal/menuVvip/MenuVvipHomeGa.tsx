import React, {useState, useEffect} from "react";
import { useHistory } from "react-router";
import {
    IonBadge,
    IonButton,
    IonContent,
    IonGrid,
    IonIcon,
    IonItem,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonRoute,
    IonText,
    useIonViewDidEnter,
  } from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import { receiptOutline, restaurantOutline } from "ionicons/icons";

const MenuVvipHome: React.FC = () => {
    // function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    //     console.log("Begin async operation");
    
    //     loadDataMealReq(1);
    
    //     setTimeout(() => {
    //       console.log("Async operation has ended");
    //       event.detail.complete();
    //     }, 2000);
    // }
    const history = useHistory();
    const btnBack = () => {
    history.push("/meal");
    }
    // const loadDataPref = () => {
    //     getJsonPref(pref_json_pegawai_info_login).then((res) => {
    //         setPegawai(res);
    //         // console.log(res);
    //     });
    //     getJsonPref(pref_unit).then((restUnit) => {
    //         setUnit(restUnit);
    //     });
    //     getPref(pref_user_role).then((restRole) => {
    //         setRole(restRole);
    //     });


    // // getPref(pref_identity).then(res => { setIdentity(res) });
    //     getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); loadDataMealReq(res); });
    // }
    
    //   const loadDataMealReq = (user: any) => {
    //     const url = BASE_API_URL + API_URI + 'healthymenuproposals';
    //     fetch(url).then(res => res.json()).then(
    //       (result) => {
    //         // console.log(result.data);
    //         setItems(result.data);
    //         setIsLoaded(true);
    //       },
    //       // Note: it's important to handle errors here
    //       // instead of a catch() block so that we don't swallow
    //       // exceptions from actual bugs in components.
    //       (error) => {
    //         setIsLoaded(true);
    //         setError(error);
    //       }
    //     )
    //   }
    return (
        <IonPage>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            <div className="bg-red-700">
                <div className="px-4 py-6">
                    <div className="flex">
                        <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>
                        <div className="ml-4">
                            <h3 className="text-base font-bold text-white">Daftar Pesanan Menu VVIP</h3>
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
                            Irvan Nofiansyah <br/>
                            123456789
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
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="container">
                        <div className="grid items-center justify-center text-center">
                            <IonText className="text-lg">Daftar Pesanan</IonText>
                        </div>
                        <div className="mt-4">
                            <IonList>
                                <div className="p-3 m-1 border-2 border-inherit rounded-md">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-start-1 col-end-5 flex items-center justify-start justify-items-start">
                                            28-10-2022
                                        </div>
                                        <div className="col-end-13 col-span-4 flex items-center justify-end justify-items-end">
                                            <IonBadge className="rounded-full p-2 text-white" slot="start">Pengajuan</IonBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 m-1 border-2 border-inherit rounded-md">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-start-1 col-end-5 flex items-center justify-start justify-items-start">
                                            28-10-2022
                                        </div>
                                        <div className="col-end-13 col-span-4 flex items-center justify-end justify-items-end">
                                            <IonBadge className="rounded-full p-2 text-white bg-amber-500" slot="start">Diantarkan</IonBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 m-1 border-2 border-inherit rounded-md">
                                    <div className="grid grid-cols-12">
                                        <div className="col-start-1 col-end-5 flex items-center justify-start justify-items-start">
                                            22-10-2022
                                        </div>
                                        <div className="col-end-13 col-span-4 flex items-center justify-end justify-items-end">
                                            <IonBadge className="rounded-full p-2 text-white bg-emerald-600" slot="start">Selesai</IonBadge>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 m-1 border-2 border-inherit rounded-md">
                                    <div className="grid grid-cols-12">
                                        <div className="col-start-1 col-end-5 flex items-center justify-start justify-items-start">
                                            18-10-2022
                                        </div>
                                        <div className="col-end-13 col-span-4 flex items-center justify-end justify-items-end">
                                            <IonBadge className="rounded-full p-2 text-white bg-amber-500" slot="start">Diantarkan</IonBadge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center text-indigo-700 mt-4 absolute bottom">
                                    Load More ...
                                </div>
                            </IonList>
                        </div>
                    </div>
                    
                </div>
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipHome;