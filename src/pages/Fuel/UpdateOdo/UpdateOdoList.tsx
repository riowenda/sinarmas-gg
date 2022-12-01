import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave,
} from '@ionic/react';

import { RefresherEventDetail } from '@ionic/core';
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
    API_URI,
    pref_identity,
    FUEL_REQ_UNIT_URI,
    pref_pegawai_unit_id,
    AUTH_FUEL_GA, AUTH_FUEL_FINANCE, UPDATE_ODO_DATASOURCE_URI, pref_token, pref_pegawai_id
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import {getFuelMenu, getPref} from "../../../helper/Preferences";
import moment from "moment";
import ListHeader from "../../../components/Header/ListHeader";
import PStatus from "../PO/components/PStatus";
import {BaseAPI} from "../../../api/ApiManager";

const UpdateOdoList: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const { t } = useTranslation();
    const [pegUnitId, setPegUnitId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [role, setRole] = useState();
    const location = useLocation();
    const [oriData, setOriData] = useState();
    const [pegId, setPegId] = useState();
    const [token, setToken] = useState();
    const [skeleton] = useState(Array(5).fill(0));

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
        console.log('Begin async operation');
        setIsLoaded(false);
        // @ts-ignore
        loadDataPermintaan(token, pegId);
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        getPref(pref_identity).then(res => { setIdentity(res) });
        getPref(pref_token).then(t => {
            setToken(t);
            getPref(pref_pegawai_id).then(p => {
                setPegId(p);
                loadDataPermintaan(t, p);
            })
        })
        getPref(pref_pegawai_unit_id).then(res => { setPegUnitId(res); });
        getFuelMenu().then(menu => {
            let restRole = "";

            if(menu.includes(AUTH_FUEL_GA)){
                restRole = 'GA';
            } else if(menu.includes(AUTH_FUEL_FINANCE)){
                restRole = 'FINANCE';
            }

            // @ts-ignore
            setRole(restRole);
        });
    }

    const loadDataPermintaan = (token: string, user: any) => {
        const url = BaseAPI() + API_URI + FUEL_REQ_UNIT_URI + UPDATE_ODO_DATASOURCE_URI;
        const data = {
            "draw": 0,
            "start": 0,
            "length":-1,
            "search": {
                "value": "",
                "regexp": ""
            },
            "order": [
                {
                    "column": 0,
                    "dir": "asc"
                }
            ],
            "columns": [
                {
                    "data": "id",
                    "name": "id",
                    "searchable": true,
                    "orderable": true
                },
                {
                    "data": "requester.id",
                    "name": "requester.id",
                    "searchable": true,
                    "orderable": true,
                    "search": {
                        "value": user,
                        "regexp": ""
                    }
                }
            ]
        };
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Identity': identity ? identity : '', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log("result", result)
                    // console.log(result.data);
                    // console.log(result.data);
                    let data = result.data;
                    if(data != null && !data.isEmpty){
                    //     // @ts-ignore
                    //     let sortByDate = data.map((obj: { tanggal: string; }) => {return {...obj, date: new Date(obj.tanggal)}}).sort((a: { date: Date; }, b: { date: Date; }) => b.date - a.date);
                    //     // console.log(sortByDate)
                    //     setOriData(sortByDate);
                        setItems(data);
                    }
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

    const btnDetailReqFuel = (id: any) => {
        let path = "/fuel/detail-perbaikan-odo/";
        history.push({
            pathname: path + id,
            state: { detail: id }
          });
    }

    const btnBack = () => {
        // history.goBack();
        history.push("/fuel/homepage");
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <IonPage>
            {/* Header */}
            <ListHeader title={t('header.daftar_odo')} isReplace={false} link={""} addButton={false} />
            {/* end Header */}
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700 ">
                    {/* === Start List  === */}
                    <div className="bg-white">
                        <div className="px-3 pt-3">
                            {isLoaded ?
                                <>
                            {items != null ? items.map((req, index) => {
                                return (
                                    <div onClick={() => btnDetailReqFuel(req['id'])} key={req['id']}
                                        className="px-4 py-4 my-2 rounded-lg border border-1 border-gray-300">
                                        <div>
                                            <div className="flex justify-between">
                                                <p className="font-bold text-gray-900">{req['nomor'] != null ? req['nomor'] : "N/A"}</p>
                                                <p className="text-sm text-gray-900">{moment(req['tanggal']).format('DD MMM yyyy').toString()}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-900">{req['kupon']['pegawaiUnit']['unit']['noPol']} - {req['kupon']['pegawaiUnit']['unit']['noLambung']}</p>
                                                <PStatus title={req['status']} status={req['status']}/>
                                            </div>
                                            <p className="text-sm text-gray-900">{req['kupon']['pegawaiUnit']['unit']['jenisUnit']['name']} - {req['kupon']['pegawaiUnit']['unit']['tipeUnit']['name']}</p>
                                        </div>
                                    </div>
                                )
                            }) : ""}
                                </> :
                                <>
                                    {
                                        skeleton.map((index) => {
                                            return (
                                                <div
                                                    className="px-4 py-2 my-2 rounded-lg border border-1 border-gray-300">
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <IonSkeletonText animated style={{ width: '20%' }} />
                                                            <IonSkeletonText animated style={{ width: '30%' }} />
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <IonSkeletonText animated style={{ width: '40%' }} />
                                                        </div>
                                                        <IonSkeletonText animated style={{ width: '60%' }} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            }
                        </div>
                    </div>
                    {/* === End List === */}

                    {/* === End Body ===*/}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UpdateOdoList;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

