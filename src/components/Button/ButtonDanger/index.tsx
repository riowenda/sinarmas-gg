import {
    IonIcon,
    IonLabel,
    IonButton
} from '@ionic/react'

interface ButtonDangerProps {
    title: string;
    onPress?: () => void;
}

const ButtonDanger: React.FC<ButtonDangerProps> = ({ title, onPress }) => {
    return (
        <IonButton onClick={onPress} className="w-full" color={'danger'}>
            <span className="text-[15px]">{title}</span>
        </IonButton>
    )
}

export default ButtonDanger
