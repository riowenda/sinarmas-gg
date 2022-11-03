import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent, useIonRouter,
  useIonToast, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from "@ionic/react";
import "./Dashboard.css";
import React, { useState } from "react";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation } from "react-i18next";
import "../../components/Translate";
import { useHistory } from "react-router-dom";
import { getJsonPref, getPref } from "../../helper/preferences";
import {
  pref_json_pegawai_info_login,
  pref_unit,
  pref_user_role,
} from "../../constant/Index";

import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import { CardDashboard } from "../../components/Card";
import { DataMenu, DataMenuGA } from "./components/constants";
import ListMenu from "./components/ListMenu";
import { IconArrowRight, IconBell, IconCheck, IconStar } from "../../components/Icon";
import UserMenu from "./components/UserMenu";
import UserHeader from "./components/UserHeader";

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [pegawai, setPegawai] = useState(user);
  const [role, setRole] = useState("");
  const [unit, setUnit] = useState(userUnit);

  const { t } = useTranslation();

  /* BEGIN LIFECYCLE APPS */

  /* Proses animasi saat Mau masuk halaman
  disini bisa load data dari API,
  jika dirasa load data akan menyebabkan performa menurun
  bisa dipindah ke diEnter */
  useIonViewWillEnter(() => {
  });

  /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
  jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
  useIonViewDidEnter(() => {
    loadDataPref();
  });

  /* Proses animasi akan dimulai saat akan meninggalkan halaman
  disini cocok untuk melakukan clean up atau sebagainya yang sesuai kebutuhan */
  useIonViewWillLeave(() => {
  });

  /* Proses transisi ke halaman berikutnya
  tidak cocok untuk beberapa logic yang butuh waktu */
  useIonViewDidLeave(() => {
  });
  /* END LIFECYCLE APPS */

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    loadDataPref();
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }

  const menuGaCare = () => {
    history.push("/ga-care/list-laporan");
  };

  const menuFuel = () => {
    if (role === "GA" || role === "FINANCE") {
      history.push("/ga/fuel/homepage");
    } else {
      history.push("/fuel/homepage");
    }
  };
  const menuMeal = () => {
    // history.push("/meal/");
    if (role === "GA" || role === "FINANCE") {
      history.push("/ga/meal");
    } else {
      history.push("/meal");
    }
  };
  const menuVisit = () => {
    history.push("/fuel/");
  };
  const menuGA = () => {
    history.push("/fuel/");
  };

  const listNotifikasi = () => {
    history.push("/notifikasi");
  };

  const loadDataPref = () => {
    getJsonPref(pref_json_pegawai_info_login).then((res) => {
      console.log("PEGAWAI", res)
      setPegawai(res);
      // console.log(res);
    });
    getJsonPref(pref_unit).then((restUnit) => {
      setUnit(restUnit);
    });
    getPref(pref_user_role).then((restRole) => {
      console.log("rest", restRole)
      setRole(restRole);
    });
    //console.log("role: ", role);
  };

  var option = {
    centeredSlides: true,
    loop: true,
    spaceBetween: 10
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="bg-red-700">
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

          {/* === Start Header === */}
          <div className="divide-y divider-white p-4">
            <div className="flex w-full items-center justify-between space-x-6">
              <UserHeader pegawai={pegawai} />
              <button onClick={listNotifikasi} className="py-4 px-1 relative border-2 border-transparent text-white rounded-full" aria-label="Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                  <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                    99+
                  </div>
                </span>
              </button>
            </div>
          </div>

          <div className="absolute w-full z-10">
            <div className="px-4">
              <div className="rounded-lg bg-white drop-shadow-md">
                <div className="flex w-full items-center justify-between space-x-6 p-3">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <p className="truncate text-sm font-medium text-gray-900">
                        Sedang perjalanan dinas BIB ke Site
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid divide-gray-200 border-t border-gray-200 grid-cols-2 divide-y-0 divide-x">
                  <div className="px-6 py-1.5 text-center text-sm font-medium">
                    <span className="text-gray-600">
                      {unit != null ? unit["noLambung"] : "-"}
                    </span>
                  </div>
                  <div className="px-6 py-1.5 text-center text-sm font-medium">
                    <span className="text-gray-600">
                      {unit != null ? unit["noPol"] : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === End Header === */}

          {/* === Start Body ===*/}

          {/* === Start List Quick Menu === */}
          <div className="w-full bg-white mt-11 p-4">

            <div className="mt-8">
              <h2 className="font-bold">Quick Menu</h2>
              <UserMenu userRole={role} />
            </div>

            {/*=== card by role ===*/}
            {/*=== end card by role ===*/}

            {/* === Start Card Ongoing Visit === */}
            <div className="drop-shadow-md mt-2 divide-y divide-gray-200 border border-1 border-gray-300 rounded-lg bg-white">
              <div className="px-4 py-4 p-6">
                <h3 className="text-md font-bold text-gray-900">
                  On Going Visit
                </h3>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <span className="text-left font-bold text-red-800">
                      1 Jan 2022
                    </span>
                    <span className="items-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className="text-right font-bold text-red-800">
                      5 Jan 2022
                    </span>
                  </div>
                </div>
                <div onClick={menuMeal} className="inline-block">
                  <div className="flex flex-1 flex-col">
                    <img
                      className="mx-auto h-12 w-12"
                      src="assets/icon/meals.png"
                      alt=""
                    />
                    <h3 className="mt-2 mx-auto text-sm font-medium text-gray-900">
                      Meal
                    </h3>
                  </div>
                </div>
                <div className="inline-block">
                  <div className="flex flex-1 flex-col">
                    <img
                      className="mx-auto h-12 w-12"
                      src="assets/icon/visits.png"
                      alt=""
                    />
                    <h3 className="mt-2 mx-auto text-sm font-medium text-gray-900">
                      Visit
                    </h3>
                  </div>
                </div>
                <div className="inline-block">
                  <div className="flex flex-1 flex-col">
                    <img
                      className="mx-auto h-12 w-12"
                      src="assets/icon/masterdatas.png"
                      alt=""
                    />
                    <h3 className="mt-2 mx-auto text-sm font-medium text-gray-900">
                      Masterdata
                    </h3>
                  </div>
                </div>
                <div className="inline-block">
                  <div className="flex flex-1 flex-col">
                    <img
                      className="mx-auto h-12 w-12"
                      src="assets/icon/ga_cares.png"
                      alt=""
                    />
                    <h3 className="mt-2 mx-auto text-sm font-medium text-gray-900">
                      GA Care
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="drop-shadow-md mt-2 divide-y divide-gray-200 border border-1 border-gray-300 rounded-lg bg-white">
              <div className="px-4 py-4 p-6">
                <h3 className="text-md font-bold text-gray-900">
                  Ongoing Visit
                </h3>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <span className="text-left font-bold text-red-800">
                      1 Jan 2022
                    </span>
                    <span className="items-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span className="text-right font-bold text-red-800">
                      5 Jan 2022
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="mt-2">
                      <span>Survei Lokasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* === Start Card Permintaan MDForFuel === */}
            <div className="drop-shadow-md divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-8 mb-8">
              <div className="px-4 py-5">
                <h3 className="text-md font-bold text-gray-900">
                  Permintaan Bahan Bakar
                </h3>
                <div className="mt-4">
                  <span className="text-gray-900">BIB123 - AB 1234 CD</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500">1 Jan 2022</span>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <p className="text-green-600 font-bold">Disetujui GA</p>
              </div>
            </div>
            {/* === End Card Permintaan MDForFuel === */}
          </div>
        </div>
      </IonContent>
      <BottomNavBar />
    </IonPage>
  );
};



export default Dashboard;

function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
