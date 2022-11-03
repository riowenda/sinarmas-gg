import React, {useState, useEffect, useRef} from "react";
import { useHistory} from "react-router";
import { useParams } from "react-router-dom";
import moment from "moment";
import { getJsonPref, getPref } from "../../../helper/preferences";
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonImg,
    IonInput,
    IonItem,
    IonList,
    IonModal,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonRefresher,
    IonRefresherContent,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
    useIonViewDidEnter,
  } from "@ionic/react";
  import {
    // BASE_API_URL,
    // API_URI,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI,
    pref_json_pegawai_info_login, pref_pegawai_unit_id,
    pref_unit, pref_unit_id,
    pref_identity,
    pref_user_id,
    pref_user_role
  } from "../../../constant/Index";
import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import {useTranslation, initReactI18next} from "react-i18next";
import { camera, ellipse, receiptOutline, restaurantOutline } from "ionicons/icons";
//import imgVvip from './../../../assets/menuVvip/img-vvip.jpg';
import './MenuVvip.css';
const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };
const MenuVvipView: React.FC = () => {
    const [isGa, setIsGa] = useState<boolean>(true);
    const [isUser, setIsUser ] = useState<boolean>(false);
    const params = useParams<any>();
    //modal
    const modal = useRef<HTMLIonModalElement>(null);
    function dismiss() {
        modal.current?.dismiss();
    }
    const history = useHistory();
    const btnBack = () => {
    history.push("/meal/menuvvip/form");
    }

   
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [identity, setIdentity] = useState<string>();
    const [pegUnitId, setPegUnitId] = useState();
    const [pegawai, setPegawai] = useState(user);
    const [role, setRole] = useState();
    const [unit, setUnit] = useState(userUnit);

    const [items, setItems] = useState<any>([]);
    useIonViewDidEnter(() => {
        loadDataPref();
    });

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log("Begin async operation");
    
        loadDataMealReq(1);
    
        setTimeout(() => {
          console.log("Async operation has ended");
          event.detail.complete();
        }, 2000);
      }
      
    
      const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then((res) => {
          setPegawai(res);
          // console.log(res);
        });
        getJsonPref(pref_unit).then((restUnit) => {
          setUnit(restUnit);
        });
        getPref(pref_user_role).then((restRole) => {
          setRole(restRole);
        });
    
    
        // getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); loadDataMealReq(res); });
      }
    
      const loadDataMealReq = (user: any) => {
        const url = BASE_API_URL + API_URI + '/vviprequests/' + params.id;
        fetch(url).then(res => res.json()).then(
          (result) => {
            // console.log(result.data);
            setItems(result.data);
            setIsLoaded(true);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
      }
    return (
        <IonPage>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh} >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            <div className="bg-red-700">
                <div className="px-4 py-6">
                    <div className="flex">
                        <svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>
                        <div className="ml-4">
                            <h3 className="text-base font-bold text-white">Menu VVIP Detail Pengajuan</h3>
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
                {items.map((data:any, index:any) => {
                return (
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="container">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="ml-3">{data["visitor_category"]}</label>
                            </div>
                            <div>
                                Organik
                            </div>
                            <div>
                                <label className="ml-3">Tamu VVIP</label>
                            </div>
                                <div>
                                    <IonIcon className="bullet" icon={ellipse}></IonIcon> Rizky <br/>
                                    <IonIcon className="bullet" icon={ellipse}></IonIcon> Ilham
                                </div>
                            <div>
                                <label className="ml-3">Request Menu</label>
                            </div>
                            <div>
                                <IonIcon className="bullet" icon={ellipse}></IonIcon> Ikan <br/>
                                <IonIcon className="bullet" icon={ellipse}></IonIcon> Sayur
                            </div>
                            <div>
                                <label className="ml-3">Jadwal</label>
                            </div>
                            <div>
                                Pagi
                            </div>
                        </div>
                        <br/>
                        <div>
                            
                        </div>
                        <br/>
                        {!isUser && (
                        <div>
                            <label className="ml-3">Keterangan</label>
                            <div className="ml-3 mr-2">
                                <IonTextarea className="text-area" readonly={isGa ? true:false} placeholder="Keterangan" rows={3} />
                            </div>
                            <br/>
                            <label className="ml-3">Harga Paket</label>
                            <div className="ml-3 mr-2">
                                <IonInput className=" text-area" readonly={isGa ? true:false} placeholder="Harga Paket" />
                            </div>
                            <br/>
                            <div className="grid items-end justify-end justify-items-end mt-3">
                                <IonText id="open-modal" color="tertiary"><u>Commentar</u></IonText>
                            </div>
                            <IonButton expand="block" className="mt-4" color="tertiary">Submit</IonButton>
                            <IonModal id="example-modal" ref={modal} trigger="open-modal" className="">
                                <IonContent className="mr-3 ml-3 mt-3">
                                    <div className="m-3">
                                    <IonTextarea className="border-2 inherit rounded-lg" readonly={isGa ? true:false} placeholder="Note" rows={3} /><br/>
                                    <label>Reason</label>
                                    <IonTextarea className="border-2 inherit rounded-lg" readonly={isGa ? true:false} placeholder="Reason" rows={1}  />
                                    {isGa && (
                                        <div>
                                            <IonButton color="tertiary" expand="block" className="mt-4">Approve</IonButton>
                                            <IonButton color="danger" expand="block" className="mt-4">Reject</IonButton>
                                        </div>
                                    )}
                                    <IonButton className="position-bot" color="medium" onClick={() => dismiss()}>
                                        Kembali</IonButton>
                                    </div>
                                </IonContent>
                            </IonModal>
                        </div>
                        )}
                    </div>
                </div>
                )})}
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipView;