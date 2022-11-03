import {
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonReorder,
  IonRouterOutlet,
  IonSegment,
  IonSegmentButton,
  IonTabBar,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSelectOption,
  IonSelect,
  IonButtons,
  IonButton,
  IonList,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonToggle,
  IonTab,
  IonText,
  IonChip,
  IonNote,
  useIonToast,
} from "@ionic/react";
import HeaderLayout from "../Layout/Header";
import Menu from "../Layout/Menu";
import "./Dashboard.css";
import React, { useState } from "react";
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from "@ionic/react";
import {
  chevronDownCircleOutline,
  calendar,
  personCircle,
  map,
  informationCircle,
  pin,
  wifi,
  wine,
  warning,
  walk,
  notifications,
  server,
  qrCode,
  caretForwardCircle,
  caretForwardCircleOutline,
  checkboxOutline,
  checkmark,
  checkmarkCircle,
  home,
  location,
  locationSharp,
  locateOutline,
  fastFoodOutline,
  fastFood,
  heart,
  heartCircleSharp,
  batteryCharging,
  batteryChargingOutline,
  pinOutline,
  walkOutline,
  mapOutline,
  heartCircle,
} from "ionicons/icons";
import { IonReactRouter } from "@ionic/react-router";
import { RefresherEventDetail } from "@ionic/core";
import { useTranslation, initReactI18next } from "react-i18next";
import "../../components/Translate";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  PaperClipIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  BellIcon,
  Battery0Icon,
  CakeIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
/* import { B } from '@heroicons/react/24/solid' */
import {
  BeakerIcon,
  BellSnoozeIcon,
  ServerIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBiking, faHome } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const navigation = [
  { name: "Fuel", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
  { name: "Company", href: "#" },
];
const people = [
  { id: 1, name: "Annette Black" },
  { id: 2, name: "Cody Fisher" },
  { id: 3, name: "Courtney Henry" },
  { id: 4, name: "Kathryn Murphy" },
  { id: 5, name: "Theresa Webb" },
];

const user = {
  name: "Irvan Noviansyah",
  email: "chelsea.hagon@example.com",
  nik: "123456",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [checked, setChecked] = useState(false);
  const [present] = useIonToast();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Hello World!",
      duration: 1500,
      position: position,
    });
  };
  const { t } = useTranslation();
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  const menuFuel = () => {
    history.push("/fuel/p2h/p2hdashboard");
  };
  const menuMeal = () => {
    history.push("/fuel/");
  };
  const menuVisit = () => {
    history.push("/fuel/");
  };
  const menuGA = () => {
    history.push("/fuel/");
  };
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <IonPage className="bg-gradient-to-r from-red-700 to-red-500">
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <header className="bg-white">
          <nav className="mx-auto max-w-7xl sm:px-6 lg:px-8" aria-label="Top">
            <div className="flex w-full items-center justify-between border-b border-red-900 px-4 py-4 lg:border-none bg-white rounded-b-full">
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
        <div className="bg-gradient-to-r from-red-700 to-red-500 rounded-md lg:rounded-lg pt-12">
          {/*<div className="bg-white rounded-md rounded-lg lg:rounded-lg p-2 ">*/}

          <div className="p-2">
            <div className="overflow-hidden mt-4 rounded-lg bg-white shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <img
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                  src={user.imageUrl}
                  alt=""
                />
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {user.name}
                    </h3>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">TITLE</p>
                </div>
              </div>
              <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 grid-cols-2 divide-y-0 divide-x">
                <div className="px-6 py-5 text-center text-sm font-medium">
                  <span className="text-gray-600">Masuk</span>
                </div>
                <div className="px-6 py-5 text-center text-sm font-medium">
                  <span className="text-gray-600">Barcode</span>
                </div>
              </div>
            </div>

            {/*codingan engkong*/}

            <div className="col-span-1 rounded-lg bg-white shadow mt-5">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
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
                  <div className="flex w-0 flex-1 bg-gray-100">
                    <a
                      href=""
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Masuk kerja
                    </a>
                  </div>
                  <div className="-ml-px flex w-0 flex-1  bg-gray-100">
                    <a
                      href=""
                      className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <QrCodeIcon className="h-7 w-7"></QrCodeIcon>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 py-5 pt-1 pb-5">
            <div className="col-span-1 divide-y divide-red-900 rounded-lg bg-white shadow border-solid border-2 border-red-900 ">
              <div className="px-3">
                <div className="mt-1 divide-y divide-gray-200 border-b border-blue-200">
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="select-none font-medium text-gray-700 bg-green-900 pt-2 pb-2 py-3 px-3 text-white rounded rounded-md">
                        Masuk kerja
                      </span>
                    </div>
                    <div className="ml-3 flex h-5 items-center">
                      BIB 1012 BB
                    </div>
                  </div>
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Sedang melakukan perjalanan dinas BIB ke Site
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">AB 1232 CD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-red-500" />
            </div>
            <div className="relative flex justify-center">
              <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={menuFuel}
                  type="button"
                  className="relative inline-flex items-center rounded-l-md border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  Fuel
                </button>
                <div className="pr-b pl-b"></div>
                <button
                  onClick={menuMeal}
                  type="button"
                  className="relative inline-flex items-center border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  Meal
                </button>
                <div className="pr-b pl-b"></div>
                <button
                  onClick={menuVisit}
                  type="button"
                  className="relative inline-flex items-center border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  Visit
                </button>
                <div className="pr-b pl-b"></div>
                <button
                  onClick={menuGA}
                  type="button"
                  className="relative inline-flex items-center rounded-r-md border border-red-300 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  GA Care
                </button>
              </span>
            </div>
          </div>
          <div className="pt-1">&nbsp;</div>

          <div className="px-5 py-5 pt-1 pb-5">
            <div className="col-span-1 divide-y divide-green-900 rounded-lg bg-white shadow border-solid border-2 border-green-900 ">
              <div className="px-3">
                <div className="mt-1 divide-y divide-gray-200 border-b border-blue-200">
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="select-none font-medium text-gray-700 bg-green-900 pt-2 pb-2 py-3 px-3 text-white rounded rounded-md">
                        Ongoing visit
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        1 Juli 2022
                      </label>
                    </div>
                    <div className="ml-1 flex-1 h-5 items-center">
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
                    </div>
                    <div className="ml-1 flex h-5 items-center">
                      3 Juli 2022
                    </div>
                  </div>

                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Survey lokasi
                      </label>
                    </div>
                  </div>
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Fasilitas:
                      </label>
                      <ul className="px-2">
                        <li className="relative flex items-start py-2">
                          Transportasi
                        </li>
                        <li className="relative flex items-start py-2">
                          Akomodasi
                        </li>
                        <li className="relative flex items-start py-2">Meal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 py-5 pt-1 pb-5">
            <div className="col-span-1 divide-y divide-orange-900 rounded-lg bg-white shadow border-solid border-2 border-orange-900 ">
              <div className="px-3">
                <div className="mt-1 divide-y divide-gray-200 border-b border-orange-200">
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="select-none font-medium text-gray-700 bg-orange-900 pt-2 pb-2 py-3 px-3 text-white rounded rounded-md">
                        Permintaan makanan
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Pagi
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">Kantin BIB</div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Siang
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">Kantin BIB</div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Sore
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">Pos 1</div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        Supper
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">Pos 1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5 pt-1 pb-5">
            <div className="col-span-1 divide-y divide-blue-400 rounded-lg bg-white shadow border-solid border-2 border-blue-400 ">
              <div className="px-3">
                <div className="mt-1 divide-y divide-gray-200 border-b border-blue-200">
                  <div className="relative flex items-start py-4">
                    <div className="min-w-0 flex-1 text-sm">
                      <span className="select-none font-medium text-gray-700 bg-blue-400 pt-2 pb-2 py-3 px-3 text-white rounded rounded-md">
                        Permintaan bahan bakar
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        BIB 123
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">123.22 Km</div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        AB 123
                      </label>
                    </div>
                    <div className="ml-3 flex h-5 items-center">
                      Disetujui GA
                    </div>
                  </div>
                  <div className="relative flex items-start py-2">
                    <div className="min-w-0 flex-1 text-sm">
                      <label className="select-none font-medium text-gray-700">
                        1 Juli 2022
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*</div>*/}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
function classNames(arg0: string, arg1: string): string | undefined {
  throw new Error("Function not implemented.");
}
