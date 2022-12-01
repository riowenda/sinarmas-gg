import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent, useIonViewDidEnter, useIonViewWillEnter,
} from '@ionic/react';

import './NotifikasiList.css';
import { RefresherEventDetail } from '@ionic/core';
import { useTranslation} from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    NOTIFIKASI_SET_READ_URI, PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_SET_UNIT_USER_URI,
    pref_json_pegawai_info_login,
    pref_token
} from "../../constant/Index";
import { useHistory, useParams } from "react-router-dom";
import {clearPref, getFuelMenu, getJsonPref, getPref} from "../../helper/Preferences";
import ListHeader from "../../components/Header/ListHeader";
import {BaseAPI} from "../../api/ApiManager";

const NotifikasiDetail: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [identity, setIdentity] = useState<string>();
    const [data, setData] = useState(null);
    const [notifId, setNotifId] = useState("");
    const { t } = useTranslation();

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');

        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    useIonViewWillEnter(() => {
        // @ts-ignore
        const data = history.location.state.detail;
        // @ts-ignore
        const nid = history.location.state.nid;
        setNotifId(nid);
        console.log(">>> <<<"+ data);
        let tipe = data["data_type"];

        if(tipe != null && tipe !== "") {
            let info = data.data_info;
            let id = data.data_id;
            let tgl = data.data_date;
            let dtFor = data.data_for;

            getPref(pref_token).then(t => {
                if (t !== null && t !== "") {
                    toDetail(id, tipe, dtFor, nid);
                }
            });
            setData(data);
        }
    });

    const toDetail = (id: string, tipe: string, dtFor: string, nid: string) => {
        setRead(nid);
        /* Todo: link ke detail belum */
        let path = "";
        if(tipe === "p2h"){
            if(dtFor === "GA") {
                path = "/fuel/p2h/gap2hdetail/";
            } else {
                path = "/fuel/p2h/p2hdetail/";
            }
        } else if(tipe === "unit"){
            path = "/fuel/unit/detail-pu/";
        } else if(tipe === "unit_lepas"){
            path = "/fuel/unit/detail-pu/";
        } else if(tipe === "takeover"){
            if(dtFor === "GA") {
                path = "/fuel/ga/unit/detail/";
            } else {
                path = "/fuel/unit/detail/";
            }
        } else if(tipe === "temporary"){
            if(dtFor === "GA") {
                path = "/fuel/temp-unit/ga-detail/";
            } else {
                path = "/fuel/temp-unit/detail/";
            }
        } else if(tipe === "fuel"){
            if(dtFor === "GA") {
                path = "/fuel/req-fuel/ga-approval/";
            } else if (dtFor === "FINANCE") {
                path = "/fuel/req-fuel/finance-approval/";
            } else if (dtFor === "FUELMAN") {
                path = "/fuel/detail/";
            } else {
                path = "/fuel/kupon/detail-fuel/";
            }
        } else if(tipe === "other"){
            if(dtFor === "GA") {
                path = "/fuel/req-other/ga-approval/";
            } else if (dtFor === "FINANCE") {
                path = "/fuel/req-other/finance-approval/";
            } else if (dtFor === "FUELMAN") {
                path = "/fuel/detail-other/";
            } else {
                path = "/fuel/req-other/detail/";
            }
        } else if(tipe === "odometer"){
            if(dtFor === "GA") {
                path = "/fuel/ga-detail-perbaikan-odo/";
            } else {
                path = "/fuel/detail-perbaikan-odo/";
            }
        } else if(tipe === "po_do"){
            if(dtFor === "GA") {
                path = "/#";
            } else { //logistic
                path = "/fuel/do/detail/";
            }
        } else if(tipe === "fuelstation_do"){
            if(dtFor === "LOGISTIC") {
                path = "/fuel/do-stok/detail/";
            } else {
                path = "/#";
            }
        }  else if(tipe === "ga_care"){
            if(dtFor === "GA") {
                path = "/ga-care/detail-laporan/";
            } else {
                path = "/ga-care/detail-laporan/";
            }
        } else {
            path = "/#";
        }

        if(path.includes("#")){

        } else {
            if(tipe === 'ga_care') {
                getJsonPref(pref_json_pegawai_info_login).then((res) => {
                    history.replace({
                        pathname: "/ga-care/detail-laporan",
                        state: {
                            person: res.role[0],
                            id: id
                        }
                    });
                });
            } else {
                history.replace({
                    pathname: path + id,
                    state: {detail: id}
                });
            }
        }
    }

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {

    });

    const setRead = (id : string) => {

        const url = BaseAPI() + API_URI + NOTIFIKASI_SET_READ_URI+"/"+id;
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Identity': identity ? identity : '' },
        })
            .then(res => res.json())
            .then((result) => {},
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
            (error) => {})
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-white min-h-screen">
                    <div className='border-b border-gray-300'>
                        {/* Header */}
                        <ListHeader hide={true} title={""} isReplace={false} link={""} addButton={false} />
                        {/* end Header */}
                    </div>
                    {/* TODO tambah icon */}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NotifikasiDetail;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

