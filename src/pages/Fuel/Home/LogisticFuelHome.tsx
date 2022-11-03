import {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    useIonViewWillEnter,
    useIonViewDidEnter,
    useIonViewWillLeave,
    useIonViewDidLeave,
} from '@ionic/react';

import {RefresherEventDetail} from '@ionic/core';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {
    API_URI,
    BASE_API_URL,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI, pref_identity,
    pref_json_pegawai_info_login, pref_pegawai_id, pref_pegawai_unit_id, pref_token,
    pref_unit, pref_unit_id, pref_user_id
} from "../../../constant/Index";

import {useHistory, useLocation} from "react-router-dom";
import {getJsonPref, getPref, removePref} from "../../../helper/preferences";
import {IonBackButtonInner} from "@ionic/react/dist/types/components/inner-proxies";
import ListHeader from "../../../components/Header/ListHeader";
import {PO} from "../../../api/PODOFuelAPI/PO";

const user = {name: "", nik: "", imageUrl: ""}
const LogisticFuelHome: React.FC = () => {
    const history = useHistory();
    const [pegawai, setPegawai] = useState(user);
    const [pegId, setPegId] = useState("");
    const [userId, setUserId] = useState("");
    const [identity, setIdentity] = useState("");
    const [token, setToken] = useState("");
    const [countPo, setCountPo] = useState(0);
    const [countFuel, setCountFuel] = useState(0);

    const {t} = useTranslation();
    const location = useLocation();

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
        loadDataPref()
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
        loadDataPref();
        setTimeout(() => {
            console.log('Async operation has ended');
            event.detail.complete();
        }, 2000);
    }

    const loadDataPref = () => {
        console.log("MDForFuel home ")
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setPegawai(res);
        });
        getPref(pref_pegawai_id).then(r => {
            setPegId(r);
        })
        getPref(pref_user_id).then(r => {
            setUserId(r);
        })
        getPref(pref_token).then(r => {
            setToken(r);
            getCountPo(r);
        })
    }

    const getCountPo = (token:any) => {
        let data = PO(token, "list", "").then(result => {
            // console.log(result);
            if(result){
                try {
                    // @ts-ignore
                    let data = result.filter((x: { [x: string]: { [x: string]: null; }; }) => (x['fuelStasiun'] !== null && x['vendor'] !== null && x['nomor'] !== null && x['status'] === 'PROPOSED'));
                    setCountPo(data.length);
                } catch (error) {

                }
            }
        });
    }

    const menuPo = () => {
        history.push("/fuel/po");
    };

    const menuFuel = () => {
        history.push("/fuel/po");
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="bg-red-700">
                    {/* Header */}
                    <ListHeader title={"Bahan Bakar"} isReplace={false} link={""} addButton={false}/>
                    {/* End Header */}
                    <div className="divide-y divider-white px-6 pb-6">
                        <div className="flex w-full items-center justify-between space-x-6 mb-5">
                            {pegawai["imageUrl"] != null && pegawai["imageUrl"] !== "" ?
                                <img
                                    className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                                    src={pegawai["imageUrl"]}
                                    alt=""
                                /> :
                                <img
                                    className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
                                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUwOCA1MDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwOCA1MDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6IzkwREZBQTsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik0yNTUuMiwzNjMuMmMtMC40LDAtMC44LDAuNC0xLjYsMC40Yy0wLjQsMC0wLjgtMC40LTEuNi0wLjRIMjU1LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGQ9Ik00NTguNCw0MDRjLTQ2LDYyLjgtMTIwLjgsMTA0LTIwNC44LDEwNFM5NS4yLDQ2Ny4yLDQ4LjgsNDA0YzM2LTM4LjQsODQuOC01OC44LDEyNS42LTY5LjINCgkJYy0zLjYsMjkuMiwxMS42LDY4LjQsMTIsNjcuMmMxNS4yLTM1LjIsNjYuOC0zOC40LDY2LjgtMzguNHM1MS42LDIuOCw2Ny4yLDM4LjRjMC40LDAuOCwxNS42LTM4LDEyLTY3LjINCgkJQzM3My42LDM0NS4yLDQyMi40LDM2NS42LDQ1OC40LDQwNHoiLz4NCjwvZz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkQwNUI7IiBkPSJNMzE2LjgsMzA4TDMxNi44LDMwOGMwLDUuMi0zLjIsMzIuOC02MS42LDU1LjJIMjUyYy01OC40LTIyLjQtNjEuNi01MC02MS42LTU1LjJsMCwwDQoJYzAuNC0xMC40LDIuOC0yMC44LDcuMi0zMC40YzE2LDE4LDM1LjIsMzAsNTYsMzBjMjAuNCwwLDQwLTExLjYsNTYtMzBDMzE0LDI4Ny4yLDMxNi44LDI5Ny42LDMxNi44LDMwOHoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGMTU0M0Y7IiBkPSJNMjg4LjQsMzcyLjRMMjc1LjYsMzk4aC00NGwtMTIuOC0yNS42YzE3LjYtNy42LDM0LjgtOC44LDM0LjgtOC44UzI3MS4yLDM2NC44LDI4OC40LDM3Mi40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGNzA1ODsiIGQ9Ik0yMTgsNTA1LjZjMTEuNiwxLjYsMjMuNiwyLjQsMzYsMi40YzEyLDAsMjQtMC44LDM2LTIuNGwtMTQtMTA3LjJoLTQ0TDIxOCw1MDUuNnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzE2LjgsMzA3LjJjMCwwLDIuOCwzMi02My4yLDU2LjRjMCwwLDUxLjYsMi44LDY3LjIsMzguNEMzMjEuMiw0MDMuNiwzNTEuMiwzMjYsMzE2LjgsMzA3LjJ6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOTAuNCwzMDcuMmMtMzQsMTguOC00LjQsOTYtMy42LDk0LjhjMTUuMi0zNS4yLDY3LjItMzguNCw2Ny4yLTM4LjQNCgkJQzE4Ny42LDMzOS4yLDE5MC40LDMwNy4yLDE5MC40LDMwNy4yeiIvPg0KPC9nPg0KPHBhdGggc3R5bGU9ImZpbGw6I0Y5QjU0QzsiIGQ9Ik0zMTIuOCwyODUuNmMtMTYuOCwxOC0zNi44LDI5LjYtNTkuMiwyOS42cy00Mi40LTExLjYtNTkuMi0yOS42YzAuOC0yLjgsMi01LjYsMy4yLTgNCgljMTYsMTgsMzUuMiwzMCw1NiwzMHM0MC0xMS42LDU2LTMwQzMxMC44LDI4MCwzMTIsMjgyLjgsMzEyLjgsMjg1LjZ6Ii8+DQo8cGF0aCBzdHlsZT0iZmlsbDojRkZEMDVCOyIgZD0iTTM2Mi44LDIyNC40Yy04LjQsMTQtMjEuMiwyMi40LTMwLjgsMjAuOGMtMTkuMiwzNS42LTQ3LjIsNjItNzguNCw2MnMtNTkuMi0yNi44LTc4LjQtNjINCgljLTkuNiwxLjItMjIuNC02LjgtMzAuOC0yMC44Yy0xMC0xNi40LTEwLjQtMzQuNC0wLjgtNDAuNGMyLjQtMS4yLDQuOC0yLDcuNi0xLjZjNi40LDE2LjQsMTUuMiwyNi40LDE1LjIsMjYuNA0KCWMtOS4yLTUwLjgsMjguNC01Ni40LDIyLTEwNS4yYzAsMCwyMy42LDUyLjQsOTEuMiwxNS42bC01LjIsMTBjOTQuNC0yMS4yLDYyLjgsOTAsNjIsOTIuOGMxMC44LTEzLjYsMTcuNi0yNy4yLDIxLjYtMzkuNg0KCWMxLjYsMCwzLjYsMC44LDQuOCwxLjZDMzczLjIsMTg5LjYsMzcyLjgsMjA4LDM2Mi44LDIyNC40eiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6IzMyNEE1RTsiIGQ9Ik0zMDgsNTAuOGM3LjYtMC44LDIwLDYsMjAsNmMtMzQtMzguOC04OS42LTE0LTg5LjYtMTRjMTguOC0xNiwzNS42LTE0LjQsMzUuNi0xNC40DQoJYy03OS42LTEyLTkzLjIsMzUuNi05My4yLDM1LjZjLTMuNi01LjYtMy42LTEzLjYtMy4yLTE3LjZDMTcyLDU2LDE3OCw3NS4yLDE3OCw3NS4yYy01LjYtMTQtMjUuMi0xMS42LTI1LjItMTEuNg0KCWMxNi44LDIuOCwxOS42LDEzLjIsMTkuNiwxMy4yYy00MiwxNS42LTM0LjgsNTkuMi0zNC44LDU5LjJsMTAtMTJjLTEyLjQsNDcuNiwxOS4yLDg0LjQsMTkuMiw4NC40Yy05LjItNTAuOCwyOC40LTU2LjQsMjItMTA1LjINCgljMCwwLDIzLjYsNTIuNCw5MS4yLDE1LjZsLTUuMiwxMGM5NS42LTIxLjYsNjIsOTMuMiw2Miw5My4yYzM0LTQzLjIsMjguOC04Ny42LDI4LjgtODcuNmw0LDE2QzM4MC40LDc4LjQsMzA4LDUwLjgsMzA4LDUwLjh6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="
                                />
                            }
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-lg font-bold text-white">{pegawai['name']}</h3>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="truncate font-semibold text-lg text-white">{pegawai['nik']}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* === Start Body ===*/}
                <div className="bg-red-700">
                    <div className="w-full rounded-t-3xl bg-white p-6 flex-auto">
                        <div className="my-10 text-center">
                            <button onClick={menuPo} className="py-4 px-1 relative top-50 left-50 border-2 border-transparent text-white rounded-full" aria-label="Cart">
                                <img className="w-10 mr-2" src='assets/icon/fuel-unit-icon.png' />
                                <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                  <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                    {countPo}
                                  </div>
                                </span>
                            </button>
                            <p>PO Deposit</p>
                        </div>
                        <div className="flex-grow border-t border-gray-400 mb-6"></div>
                        <div className="my-10 text-center">
                            <button onClick={menuFuel} className="py-4 px-1 relative top-50 left-50 border-2 border-transparent text-white rounded-full" aria-label="Cart">
                                <img className="w-10 mr-2" src='assets/icon/fuel-non-unit-icon.png' />
                                <span className="absolute inset-0 object-right-top -mr-6 mt-1">
                                  <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-gray-900 text-white">
                                    {countFuel}
                                  </div>
                                </span>
                            </button>
                            <p>Fuel Deposit</p>
                        </div>
                    </div>
                </div>
                {/* === End Body ===*/}
            </IonContent>
        </IonPage>
    );
};

export default LogisticFuelHome;

function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

