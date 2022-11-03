import React, {useState} from "react";
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonImg, IonItem, IonLabel, IonList,
    IonModal,
    IonSearchbar,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {TicketIcon} from "@heroicons/react/24/solid";

interface OfflineModeProps {
    title?:string,
    handleOnPress?: () => void,
    handleOnClick?: () => void
}

const OfflineMode: React.FC<OfflineModeProps> = ({title, handleOnClick, handleOnPress}) => {
    return (
        <>

        </>
    )
}

export default OfflineMode;