import {
    IonIcon,
    IonLabel,
    IonButton,
} from '@ionic/react'

interface ButtonOutlineProps {
    title: string;
    onPress?: () => void;
    color: string
}

const ButtonOutline: React.FC<ButtonOutlineProps> = ({ title, onPress, color }) => {
    return (
        <IonButton onClick={onPress} className="w-full" fill={'outline'} color={color}>
            <span className="text-[15px]">{title}</span>
        </IonButton>
    )
}

export default ButtonOutline
