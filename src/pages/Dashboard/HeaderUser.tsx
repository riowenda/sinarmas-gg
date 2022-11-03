import './HeaderUser.css';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../components/Translate";
import {useHistory, useLocation} from "react-router-dom";
import { getJsonPref, getPref, removePref, setPref } from "../../helper/preferences";
import {
    API_URI,
    BASE_API_URL,
    PEGAWAI_UNIT_CRUD_URI, PEGAWAI_UNIT_RELEASED_URI, pref_identity,
    pref_json_pegawai_info_login, pref_pegawai_unit_id,
    pref_unit, pref_unit_id
} from "../../constant/Index";
import {
    IonBackButton,
    useIonAlert,
    useIonLoading,
    useIonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave
} from "@ionic/react";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";

interface HeaderUserProps {
    link?: string;
}

const userInfo = { name: "", nik: "", imageUrl: "" }
const userUnit = { id: "", noPol: "", noLambung: "", vendor: { name: "" }, jenisUnit: { name: "" } };

const HeaderUser: React.FC<HeaderUserProps> = (link) => {
    const history = useHistory();
    const [user, setUser] = useState(userInfo);
    const [unit, setUnit] = useState<any>(userUnit);
    const [pegUnitId, setPegUnitId] = useState<any>("");
    const [identity, setIdentity] = useState("");

    const { t } = useTranslation();

    const loadDataPref = () => {
        getJsonPref(pref_json_pegawai_info_login).then(res => {
            setUser(res);
        });
        getJsonPref(pref_unit).then(rest => {
            setUnit(rest);
        });
        getPref(pref_pegawai_unit_id).then(res => {
            setPegUnitId(res);
        });
        getPref(pref_identity).then(res => {
            setIdentity(res)
        });
    }

    // loadDataPref();
    useEffect(() => {
        loadDataPref();
    }, []);

    const btnBack = () => {
        if(link != null && link.link !== "") {
            // @ts-ignore
            history.push(link.link);
        } else {
            history.goBack();
        }
    }

    return (
        <>
            {unit != null &&

                <div className="py-3 px-1">
                    <div className="flex">
                        <div slot="start" className="pb-1 w-6 h-6 text-white">
                            <IonBackButton defaultHref="/" />
                        </div>
                        {/*<svg onClick={btnBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-white">*/}
                        {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />*/}
                        {/*</svg>*/}
                        <div className="ml-4 px-2">
                            <div className="flex w-full items-center justify-between space-x-6">
                                <div className="flex-1 truncate">
                                    <div className="items-center space-x-3">
                                        <h3 className="truncate text-base font-bold text-white">{unit['noLambung']}</h3>
                                    </div>
                                    <div className="text-white font-semibold">
                                        <span className="text-yellow-300">{unit['noPol']}</span>
                                        <span className="text-white ml-3">{unit['jenisUnit']['name']}</span>
                                    </div>
                                    <div className="text-white text-sm">{unit['vendor']['name']}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default HeaderUser;
function classNames(arg0: string, arg1: string): string | undefined {
    throw new Error('Function not implemented.');
}

