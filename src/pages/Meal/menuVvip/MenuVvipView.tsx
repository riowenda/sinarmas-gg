import React, {useState, useEffect, useRef} from "react";
import { useHistory, useParams } from "react-router-dom";
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
import './MenuVvip.css';
import ListHeader from "../../../components/Header/ListHeader";
const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const MenuVvipView: React.FC = () => {
    const [isGa, setIsGa] = useState<boolean>(false);
    const [isUser, setIsUser ] = useState<boolean>(false);
    const [isCatering, setIsCatering ] = useState<boolean>(true);
    const params = useParams<any>();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [identity, setIdentity] = useState<string>();
    const [pegUnitId, setPegUnitId] = useState();
    const [pegawai, setPegawai] = useState(user);
    const [role, setRole] = useState();
    const [unit, setUnit] = useState(userUnit);

    const [items, setItems] = useState<any>();
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

    const handleDelete = (id:any) => {
        fetch(BASE_API_URL+API_URI+'/vviprequests/'+id, { method: 'DELETE' })
        .then(response => response.json())
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
      const history = useHistory();
    const btnBack = () => {
    history.push("/meal/menuvvip/form");
    }
      const loadDataMealReq = (user: any) => {
        const url = BASE_API_URL + API_URI + '/vviprequests' +'/'+ params.id;
        fetch(url).then(res => res.json()).then(
          (result) => {
            setItems(result);
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
    const modal = useRef<HTMLIonModalElement>(null);
    function dismiss() {
        modal.current?.dismiss();
    }
    return (
        <IonPage>
        <IonContent fullscreen>
          <IonRefresher slot="fixed" onIonRefresh={doRefresh} >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            <div className="bg-red-700">
                <ListHeader title="Detail Pengajuan VVIP" />
                
            {items && (
                
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="px-4 py-4">
                        <h3 className="font-bold py-2">Status</h3>
                        <div className="flex justify-between items-center overflow-hidden rounded-lg bg-teal-500 text-white border border-1 border-gray-200 text-sm">
                            <div className='px-4'>
                                {items.status}
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="">
                                <label className="ml-3">Jenis Tamu</label>
                            </div>
                            <div>
                                {items.visitor_category}
                            </div>
                            <div>
                                <label className="ml-3">Tamu VVIP</label>
                            </div>
                            <div>
                                {items.visitor_lists.map((item:any) => {
                                return (
                                <div>
                                <IonIcon className="bullet" icon={ellipse}></IonIcon> {item} <br/>
                                </div>
                                )})}
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
                                {items.shift_name}
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
                            <textarea rows={3} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1" 
                            readOnly={isGa ? true:false} placeholder="Keterangan" value={items.description}/>
                            </div>
                            <br/>
                            <label className="ml-3">Harga Paket</label>
                            <div className="ml-3 mr-2">
                                <IonInput className=" text-area" readonly={isGa ? true:false} placeholder="Harga Paket"
                                value={items.price} />
                            </div>
                            <br/>
                            <div className="grid items-end justify-end justify-items-end mt-3">
                                <IonText id="open-modal" color="tertiary"><u>Commentar</u></IonText>
                            </div>
                            { !isGa && ( 
                                <div>
                                    <IonButton expand="block" className="mt-4" color="tertiary">Submit</IonButton>
                                </div>
                            )}
                            { isCatering && ( 
                            <div>
                                <IonButton expand="block" className="mt-4" color="danger" 
                                onClick={(e) => handleDelete(items.id)}>
                                    Hapus Pengajuan</IonButton>
                            </div>
                            )}

                            <IonModal id="example-modal" ref={modal} trigger="open-modal" className="" initialBreakpoint={0.5} breakpoints={[0, 0.25, 0.5, 0.75]}>
                                <IonContent className="mr-3 ml-3 mt-3">
                                    <div className="m-3">
                                    <textarea rows={3} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1"
                                    readOnly={isGa ? true:false} placeholder="Note" /><br/>
                                    <label>Reason</label>
                                    <textarea rows={2} className="block w-full border border-1 border-gray-300 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-1" 
                                    readOnly={isGa ? true:false} placeholder="Reason"  />
                                    {isGa && (
                                        <div>
                                            <IonButton color="tertiary" expand="block" className="mt-4">Approve</IonButton>
                                            <IonButton color="danger" expand="block" className="mt-4">Reject</IonButton>
                                        </div>
                                    )}
                                    <button onClick={() => dismiss()} className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                                        <span className="text-purple-700">Kembali</span>
                                    </button>
                                    </div>
                                </IonContent>
                            </IonModal>
                        </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipView;