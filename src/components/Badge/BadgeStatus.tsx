import {
    IonBadge,
} from '@ionic/react'
import { useState } from 'react';

interface StatusProps {
    title: any;
}

const BadgeStatus: React.FC<StatusProps> = ({ title }) => {
    const [color, setColor] = useState<any>();
    if (title === 'Waiting Approval') {
        return <IonBadge className="rounded-full px-2 text-xs" slot="start" color="medium">{title}</IonBadge>
    }else if(title === "Edited"){
        return <div>
        <IonBadge className="rounded-full px-2 text-xs" slot="start"
            >{title}</IonBadge>
        <IonBadge className="ml-2 rounded-full px-2 text-xs" color="medium" slot="end">13:04</IonBadge>
        </div>
    }else if(title === "Approved"){
        return <IonBadge className="rounded-full px-2 text-xs" slot="start"
            color="success">{title}</IonBadge>
    }else{
        return <IonBadge className="rounded-full px-2 text-xs" slot="start"
            color="danger">{title}</IonBadge>
    }
    
}

export default BadgeStatus
