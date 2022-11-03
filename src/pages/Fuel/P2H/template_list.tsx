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
    IonToggle, IonTab, IonText, IonChip, IonNote, useIonToast, IonDatetime
} from '@ionic/react';

import './P2HList.css';
import { IonTabs, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
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
    batteryCharging, batteryChargingOutline, pinOutline, walkOutline, mapOutline, heartCircle
} from 'ionicons/icons';
import { IonReactRouter } from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
import {
    ArrowDownIcon, ArrowUpIcon, ChatBubbleBottomCenterTextIcon,
    EnvelopeIcon, PaperClipIcon, PencilIcon, PhoneIcon, PlusIcon, TrashIcon
} from '@heroicons/react/20/solid'
import {
    CursorArrowRaysIcon,
    EnvelopeOpenIcon,
    UsersIcon,
    BellIcon,
    Battery0Icon,
    CakeIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline'
import React, { useCallback, useEffect, useState } from "react";
import {
    API_URI,
    AUTH_URI,
    BASE_API_URL,
    LOGIN_ISAFE_URI,
    LOGIN_URI, P2H_LIST_GA_URI,
    P2H_LIST_USER_URI, pref_identity, pref_user_id, UNIT_CRUD_URI,
    UNIT_LIST_URI, UNIT_VIEWS_URI
} from "../../../constant/Index";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { getPref } from "../../../helper/preferences";



const P2HList: React.FC = () => {
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const history = useHistory();
    const { t } = useTranslation();
    const now = new Date;
    const until = new Date(now.getFullYear() + 10, now.getMonth());
    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
            loadData(res);
        });

    }
    const loadData = (res: any) => {
        console.log("ini: ", res)
        const url = BASE_API_URL + API_URI + P2H_LIST_USER_URI + "/" + res;
        console.log("url: ", url)
        fetch(url, {
            method: 'GET'
            //headers: rHeader
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setItems(result.filter((x: { [x: string]: { [x: string]: null; }; }) => x['unit']['jenisUnit'] !== null && x['unit']['tipeUnit'] !== null));
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }


    const menuFuel = () => {
        history.push("/fuel/homepage");
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

    useEffect(() => {
        loadDataPref();

    }, [])


    const btnPilih = (p2h: any) => {
        history.push("/fuel/p2h/p2hdetail/" + p2h['id']);
    };
    const btnInput = () => {
        history.push("/fuel/p2h/p2hinput");
    };
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700">

                    <div className="flex justify-between px-6 py-4">
                        <h3 className="text-xl font-bold text-white">P2H</h3>
                        <div>
                            <button className="rounded-lg px-3 py-1 bg-white font-bold text-sm text-red-700" onClick={btnInput}>Tambah baru</button>
                        </div>
                    </div>
                    
                    {/* === Start DUMMY List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-4">
                            <div className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">
                                <div>
                                    <div className="flex justify-between">
                                        <p className="font-bold">BIB123</p>
                                        <p className="font-bold">1 Jan 2022</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">AB 1234 CD - Triton</p>
                                        <span className="text-green-600 font-bold">APPROVED</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Kendaraan Pribadi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* === End DUMMY List === */}

                    {/* === End Body ===*/}
                </div>

            </IonContent>
        </IonPage>
    );
};

export default P2HList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

