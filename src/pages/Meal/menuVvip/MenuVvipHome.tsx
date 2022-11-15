import React, {useState, useEffect} from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
    IonBadge,
    IonButton,
    IonContent,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
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
import { receiptOutline, restaurantOutline } from "ionicons/icons";
import ListHeader from "../../../components/Header/ListHeader";
import BadgeStatus from "../../../components/Badge/BadgeStatus";
const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const user = { name: "", email: "", nik: "", imageUrl: "" };
const userUnit = { id: "", noPol: "", noLambung: "" };

const MenuVvipHome: React.FC = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [identity, setIdentity] = useState<string>();
    const [pegUnitId, setPegUnitId] = useState();
    const [pegawai, setPegawai] = useState(user);
    const [role, setRole] = useState();
    const [unit, setUnit] = useState(userUnit);
    const [isGa, setIsGa] = useState(true);
    const [isCatering, setIsCatering] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const [items, setItems] = useState([]);
    useIonViewDidEnter(() => {
        console.log("Begin async operation");
        loadDataMealReq(1);
    });

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log("Begin async operation");
    
        loadDataMealReq(1);
    
        setTimeout(() => {
          console.log("Async operation has ended");
          event.detail.complete();
        }, 2000);
      }
      const history = useHistory();
      const btnBack = () => {
        history.push("/meal");
      }
      const btnPengajuan = () => {
        history.push("/meal/menuvvip/form");
      }
    
     
    
      const loadDataMealReq = (user: any) => {
        const url = BASE_API_URL + API_URI + '/vviprequests';
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
            <div>
                <ListHeader title={"Menu VVIP"} isReplace={false} link="/meal/menuvvip/form" addButton={true}/>
                
                <div className="bg-white rounded-t-3xl px-2 pt-2 pb-6">
                    <div className="container">
                        <div className="grid items-center justify-center text-center">
                            <IonText className="text-lg">Daftar Pesanan</IonText>
                            <IonButton fill="outline" color="tertiary" onClick={btnPengajuan}>Buat Pesanan</IonButton>
                        </div>
                        <IonList>
                            {items.map((data, index) => {
                            return (
                            <div className="rounded-lg py-1 mb-3 border border-1 border-gray-300" key={data['id']}>
                                <IonItem routerLink={"/meal/menuvvip/detailpengajuan/" + data['id']} routerDirection="forward" className="border-0" lines="none">
                                <div className="p-3 m-1 rounded-md">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-start-1 col-end-6 flex items-center justify-start justify-items-start">
                                            <p className="text-base text-gray-900">
                                                {moment(data['request_date']).format('DD MMM yyyy').toString()}
                                            </p>
                                        </div>
                                        <div className="col-end-13 col-span-6 flex items-center justify-end justify-items-end">
                                            <BadgeStatus title={data['status']}></BadgeStatus>
                                        </div>
                                    </div>
                                </div>
                                </IonItem>
                            </div>
                            )
                            })}
                        </IonList>
                    </div>
                </div>
            </div>
        </IonContent>
        </IonPage>
    )
}
export default MenuVvipHome;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error("Function not implemented.");
  }