import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {IonBackButton, useIonViewDidEnter, useIonViewWillEnter, useIonViewWillLeave} from "@ionic/react";
import {useTranslation} from "react-i18next";

interface PStatusProps {
    title: string,
    status: string
}

const PStatus: React.FC<PStatusProps> = ({title, status}) => {
    const history = useHistory();
    const {t} = useTranslation();

    return (
        <p className={
            (() => {
                if(status === "APPROVED"){ // emerald start
                    return "font-bold text-emerald-500";
                } else if(status === "DONE"){
                    return  "font-bold text-emerald-500";
                } else if(status === "CLOSED"){
                    return  "font-bold text-emerald-500";
                } else if(status === "READY"){
                    return  "font-bold text-emerald-500";
                } else if(status === "RECEIVED"){ // emerald end
                    return  "font-bold text-emerald-500";
                } else if(status === "REJECTED"){ // red start
                    return  "font-bold text-red-700";
                } else if(status === "CANCELED"){ // red end
                    return  "font-bold text-red-700";
                } else if(status === "PROPOSED"){ // blue start
                    return  "font-bold text-blue-500";
                } else if(status === "OPENED"){
                    return  "font-bold text-blue-500";
                } else if(status === "FILLED"){
                    return  "font-bold text-blue-500";
                } else if(status === "PROCESSED"){ // blue end
                    return  "font-bold text-blue-500";
                } else if(status === "ONHOLD"){ // amber start
                    return  "font-bold text-amber-500";
                } else if(status === "FORGIVENESS"){
                    return  "font-bold text-amber-500";
                } else if(status === "REFILL"){
                    return  "font-bold text-amber-500";
                } else if(status === "RELEASED"){
                    return  "font-bold text-amber-500";
                } else if(status === "REOPENED"){ // amber end
                    return  "font-bold text-amber-500";
                } else {
                    return  "font-bold text-red-700";
                }
            })()
        }>{t(title)}</p>
    );
};

export default PStatus;