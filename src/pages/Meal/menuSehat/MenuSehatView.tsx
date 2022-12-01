import React, { useCallback, useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar ,
    IonRefresher,
    IonRefresherContent,
    useIonViewDidEnter,
    IonIcon,
    IonButton,
    IonButtons,
    IonModal,
} from '@ionic/react';
import { checkmarkCircleOutline, checkmarkOutline } from "ionicons/icons";
import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";

import ListHeader from "../../../components/Header/ListHeader";


const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const MenuSehatView: React.FC = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<any>();
    const [statusView, setStatusView] = useState<any>();
    const [dataDays, sedivataDays] = useState<any>();
    const params = useParams<any>();
    const modal = useRef<HTMLIonModalElement>(null);
    useEffect(() => {
       loadDataMenuSehat(1);
    }, []);
    useIonViewDidEnter(() => {
      loadDataMenuSehat(1);
    });
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log("Begin async operation");
        loadDataMenuSehat(1);
        setTimeout(() => {
          console.log("Async operation has ended");
          event.detail.complete();
        }, 2000);
    }
    const loadDataMenuSehat= (user: any) => {
        const url = BASE_API_URL + API_URI + '/healthymenuproposals' +'/'+ params.id;
        fetch(url).then(res => res.json()).then(
          (result) => {
            setItems(result);
            if(result.active){
                setStatusView("Active");
            }else{
                setStatusView("Inactive");
            }
            
            sedivataDays(result.days);
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
          <div className="">
            <ListHeader title="Detail Pengajuan Menu Sehat" />
            {items && 
              <div className="bg-white shadow-md rounded my-6">
                <h3 className="text-base text-lg text-center font-bold">Daftar Menu Sehat</h3>
                <div className="grid grid-cols-12 gap-1 m-3">
                  <div className="text-end col-span-5">
                    <p>No Ref</p>
                    <p>Tanggal Awal</p>
                    <p>Tanggal Akhir</p>
                    <p>Status</p>
                  </div>
                  <div className="text-center col-span-2">
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                    <p>:</p>
                  </div>
                  <div className="text-start col-span-5">
                    <p>{items.no_ref}</p>
                    <p>{items.date_start}</p>
                    <p>{items.date_end}</p>
                    <p>{statusView}</p>
                  </div>
                </div>
                <h3 className="text-base text-lg text-center text-bold">Jadwal Menu Sehat</h3>
                <div className=" mx-3">
                  <div className="grid grid-cols-4 gap-0">
                      <div className="border-t-2 border-r-2 border-l-2 border-grey-500 text-white p-1 bg-red-700 p-1">Hari</div>
                      <div className="border-t-2 border-r-2 border-grey-500 text-white p-1 bg-red-700">Pagi</div>
                      <div className="border-t-2 border-r-2 border-grey-500 text-white p-1 bg-red-700 p-1">Siang</div>
                      <div className="border-t-2 border-r-2 border-grey-500 text-white p-1 bg-red-700 p-1">Sore</div>
                      <div className=" border-r-2 border-b-2 border-l-2 p-1">Senin</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Senin?.Pagi && <IonIcon icon={checkmarkOutline} size="small"/>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Senin?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Senin?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Selasa</div>
                        <div className="text-center border-r-2 border-b-2 ">{dataDays?.Selasa?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Selasa?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Selasa?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Rabu</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Rabu?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Rabu?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Rabu?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Kamis</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Kamis?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Kamis?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Kamis?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Jumat</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Jumat?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Jumat?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Jumat?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Sabtu</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Sabtu?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Sabtu?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Sabtu?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                      <div className="border-r-2 border-b-2 border-l-2 p-1">Minggu</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Minggu?.Pagi && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Minggu?.Siang && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                        <div className="grid justify-center justify-items-center items-center text-center border-r-2 border-b-2 ">{dataDays?.Minggu?.Sore && <IonIcon icon={checkmarkOutline} size="small"></IonIcon>}</div>
                  </div>
                </div>
                  <div className="container m-3">
                    <div className="text-center">
                      <img className="rounded-md" src={BASE_API_URL + API_URI +'/images/'+items.image} width="90%"/>
                    </div>
                  </div>
                  <div className=" m-3">
                    <p className="font-semibold mb-1">Keterangan</p>
                    <p>{items.user_note}</p>
                  </div>
                  <div className="m-3 border-2 border-dashed p-2">
                    {items.reject_reason && <div><p className="font-semibold mb-1">Reject By rahman</p>
                      <p>{items.reject_reason}</p>
                    </div>
                    }
                  </div>
                  <div className="">
                    <IonButton className="rounded-md m-3" expand="block" color="tertiary" id="open-modal">Pengajuan Menu Regular</IonButton>
                    <IonButton color="warning" className="m-3 bg-orange-600" expand="block">Pengajuan Revisi Menu Sehat</IonButton>
                  </div>
                  <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.5} breakpoints={[0.6, 0, 0, 0.75]}>
                    <IonContent className="ion-padding">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 text-center my-2">Pesanan Untuk</h3>

                        <div className="text-gray-900">
                        </div>

                        <div className="text-center">
                          <button className="inline-flex text-center items-center rounded bg-gray-200 px-2.5 py-3 text-xs font-bold mt-5">
                            <span className="text-purple-700">Batal</span>
                          </button>

                          <button 
                            className="inline-flex text-center items-center rounded bg-purple-700 px-2.5 py-3 text-xs font-bold mt-5 ml-4" 
                            onClick={() => {window.alert('tes')}}
                          >
                            <span className="text-white">Buat</span>
                          </button>
                        </div>

                      </div>
                    </IonContent>
                  </IonModal>
                </div>
            }
          </div>
        </IonContent>
        </IonPage>
    );
}
export default MenuSehatView;

function setShowModal(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
