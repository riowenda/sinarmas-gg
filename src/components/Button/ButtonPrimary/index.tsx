import {
    IonIcon,
    IonLabel,
    IonButton
} from '@ionic/react'
import './style.css'

interface ButtonPrimaryProps {
    title?: string;
    onPress?: () => void;
    color?: string
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ title, onPress, color }) => {
    return (
        <IonButton onClick={onPress} className="w-full" color={color}>
            <span className="text-[15px]">{title}</span>
        </IonButton>
    )
}

export default ButtonPrimary
