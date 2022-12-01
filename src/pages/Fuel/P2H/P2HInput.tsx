import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonToast,
    useIonAlert,
    useIonLoading,
    useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave
} from '@ionic/react';

import './P2HInput.css';
import {RefresherEventDetail} from '@ionic/core';
import {useTranslation, initReactI18next, ReactI18NextChild} from "react-i18next";
import React, {useState} from "react";
import {
    API_URI, P2H_ITEM_URI, P2H_CRUD_URI, pref_user_id, pref_identity, pref_unit, pref_unit_id, pref_pegawai_unit_id
} from "../../../constant/Index";
import {useHistory, useLocation} from "react-router-dom";
import HeaderUser from "../../Dashboard/HeaderUser";
import {getPref} from "../../../helper/Preferences";
import {BaseAPI} from "../../../api/ApiManager";
import {P2HExistingAPI, P2HExistingNowNotRejectedAPI} from "../../../api/P2HAPI";


const P2HInput: React.FC = () => {
    const [userId, setUserId] = useState();
    const [identity, setIdentity] = useState<string>();
    const [unit, setUnit] = useState();
    const [pegUnitId, setPegUnitId] = useState("");
    const [error, setError] = useState(null);
    const [presentAlert] = useIonAlert();
    const [showSuccess] = useIonAlert();
    const [toast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [showConfirm] = useIonAlert();
    const history = useHistory();
    const [countItem, setCountItem] = useState(0);
    const {t} = useTranslation();
    const [presentToast] = useIonToast();

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
        loadData()
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

    const loadDataPref = () => {
        getPref(pref_user_id).then(res => {
            setUserId(res);
        });
        getPref(pref_unit_id).then(res => {
            setUnit(res);

        });
        getPref(pref_identity).then(res => {
            setIdentity(res);
        });
        getPref(pref_pegawai_unit_id).then(puid => {
            setPegUnitId(puid);
            checkExistingP2h(puid);
        });

    }

    function doRefresh(event: CustomEvent<RefresherEventDetail>) {
        console.log('Begin async operation');
        loadData();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const checkExistingP2h = (puId: string) => {
        P2HExistingNowNotRejectedAPI(puId).then(res => {
            let msg = res.message;
            if (msg === "" && res.status === "SUCCESS" && res.data.status !== "REJECTED") {
                showConfirm({
                    subHeader: "P2H untuk unit ini sudah ada!",
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: 'OK',
                            cssClass: 'alert-button-confirm',
                            handler: () => {
                                history.goBack();
                            }
                        },
                    ],
                })
            }
            console.log(res);
        });
    }

    const loadData = () => {
        loadDataPref();
        const url = BaseAPI() + API_URI + P2H_ITEM_URI;
        console.log("URL: " + url);
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("OK: " + result['data']);
                    setItems(result['data']);
                    let l = 0;
                    let item = result['data'];
                    item.map((p2h: { [x: string]: any; }) => {
                        // @ts-ignore
                        let i = p2h['konten'].filter((x: { [x: string]: { [x: string]: null; }; }) => x['isActive'] == true);
                        l = l + i.length;
                    })
                    setCountItem(l);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const showResult = (responseStatus: any) => {
        dismiss();
        if (responseStatus.status === 'SUCCESS') {
            const dataUnit = responseStatus.data;
            presentToast({
                message: "Berhasil membuat laporan P2H!",
                duration: 1500,
                position: "top"
            })
            //showAlert(dataUnit);
            history.goBack();
            // history.push("/fuel/p2h/p2hlist");
        } else { //EXIST
            presentToast({
                message: responseStatus.message,
                duration: 15000,
                position: "top"
            })
            //history.push("/fuel/p2h/p2hlist");
        }
    };


    if (error) {
        return <div>Error: {error}</div>;
    }
    const radioArray: { konten_id: string; nilai: string; }[] | null = [];


    const displayRadioValue = () => {
        // @ts-ignore
        //document.getElementById("result").innerHTML = "";
        const ele = document.getElementsByTagName('input');
        //const ele = document.getElementsByClassName('rdtSDT');
        //console.log("data: ", ele.item(0));
        //const radioArray = [];

        /*var x = document.getElementsByClassName('Score');
        var rate_value;
        for(var i = 0; i < x.length; i++){
            if(x[i].checked){
                rate_value = x[i].value;
            }
        }*/


        let no = 0;
        for (let i = 0; i < ele.length; i++) {
            // console.log("ele: ", ele[i]);
            if (ele[i].type == "radio" && ele[i].className == "rdtSDT") {

                if (ele[i].checked) {
                    if (ele[i].name !== null && ele[i].name !== null) {
                        const obj = {
                            konten_id: ele[i].name,
                            nilai: ele[i].value
                        }
                        // @ts-ignore
                        radioArray[no] = obj;
                        no++;
                    }

                }
            }
        }
        return no;
    }
    const showAlertConfirmed = (response: any, wait: any) => {
        dismiss();
        showConfirm({
            //simpan unit id ke pref
            subHeader: '' + (wait === "true" ? 'Tambah P2H tidak berhasil!' : response) + '',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'OK',
                    cssClass: 'alert-button-confirm',
                    handler: () => {
                        //loadData();
                        history.push("/fuel/gantiunit/unitlist");
                    }
                },
            ],
        })
    }

    const handleSubmits = (event: any) => {
        event.preventDefault();
        let item = displayRadioValue();
        let allowPush = false;

        if (Number(item) == countItem) {
            allowPush = true;
        } else {
            toast({
                    message: "Semua item pengecekan harus diisi", duration: 1500, position: "top"
                }
            );
        }

        if (allowPush) {
            submit();
        }

    }

    const submit = async () => {
        const url = BaseAPI() + API_URI + P2H_CRUD_URI;
        if (unit !== null && unit !== '') {

            const rHeader = {'Content-Type': 'application/json', 'Identity': identity != null ? identity : ''}
            const dataJson = {
                pegawai: {
                    id: userId
                },
                unit: {
                    id: unit
                },
                status: "PROPOSED",
                data: radioArray
            }
            fetch(url, {
                method: 'POST',
                headers: rHeader,
                body: JSON.stringify(dataJson)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        showResult(result);
                    },
                    (error) => {
                        dismiss();
                        presentToast({
                            message: "error " + error.message + JSON.stringify(dataJson),
                            duration: 1500,
                            position: "top"
                        })
                        // setError(error);
                    }
                )
        } else {
            // @ts-ignore
            showAlertConfirmed();

        }
    }


    return (

        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700">
                    <HeaderUser link={"/fuel/p2h/p2hlist"}/>
                    <div className="bg-white p-2 ">
                        <div className="px-4 py-4">
                            <h3 className="font-bold">Pemeriksaan dan Pemeliharaan Harian</h3>
                        </div>

                        <div className="px-4 py-2">
                            <form id="formInputP2H" onSubmit={handleSubmits}>
                                {items.map((p2h, index) => {
                                    return (
                                        <div key={p2h['id']}
                                             className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-1 border-gray-300 bg-white mt-2 mb-1">
                                            <div className="px-4 py-5 p-6 text-sm">
                                                <h3 className="text-md font-bold text-gray-900 pb-2">{p2h['judul']}</h3>
                                                <p className="text-justify">{p2h['keterangan']}</p>
                                                {p2h['konten'].map((contents: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<ReactI18NextChild> | null | undefined; }, index: any) => {
                                                    return (
                                                        <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
                                                            <span className="col-span-2 items-center text-gray-900">
                                                                {contents['konten']}
                                                            </span>
                                                            <span className="text-right text-gray-900">
                                                                <input className="rdtSDT" type="radio"
                                                                       name={'' + contents['id']}
                                                                       id={'' + contents['id']} value="true"/>
                                                                <label className="ml-2 text-gray-500"> Ya</label>
                                                            </span>
                                                            <span className="text-right text-gray-900">
                                                                <input className="rdtSDT" type="radio"
                                                                       name={'' + contents['id']}
                                                                       id={'' + contents['id']} value="false"/>
                                                                <label className="ml-2 text-gray-500"> Tidak</label>
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="py-6 bg-white">
                                    <input type="submit" value="Kirim"
                                           className="items-center w-full mx-auto rounded-md bg-blue-500 px-3 py-2 text-sm font-bold text-white"/>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default P2HInput;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

