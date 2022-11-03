import React, { useState } from "react";
import {
    IonBadge,
    IonCard,
    IonCol,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonRow,
    IonSelect,
    IonSelectOption, IonSkeletonText, IonToggle,
    IonToolbar, useIonToast
} from "@ionic/react";
import { notifications } from "ionicons/icons";
import { ChatBubbleBottomCenterTextIcon, PaperClipIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

interface ContainerProps { }

const SkeletonDetail: React.FC<ContainerProps> = () => {
    return (
        <>
            <div className="flex h-full items-center justify-center text-center bg-white">
                <IonSkeletonText animated style={{ width: '40%', height: '10px' }} />
            </div></>
    );
};

export default SkeletonDetail;
