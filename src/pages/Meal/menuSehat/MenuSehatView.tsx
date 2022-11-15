import React, { useCallback, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar ,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import {IonReactRouter} from "@ionic/react-router";
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation, initReactI18next } from "react-i18next";
const BASE_API_URL = 'http://182.253.66.235:8000';
const API_URI = '';

const MenuSehatView: React.FC = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const params = useParams<any>();
    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log("Begin async operation");
        loadDataMealReq(1);
        setTimeout(() => {
          console.log("Async operation has ended");
          event.detail.complete();
        }, 2000);
    }
    const loadDataMealReq = (user: any) => {
        const url = BASE_API_URL + API_URI + '/vviprequests' +'/'+ params.id;
        fetch(url).then(res => res.json()).then(
          (result) => {
            setItems(result);
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
        </IonContent>
        </IonPage>
    );
}
export default MenuSehatView;