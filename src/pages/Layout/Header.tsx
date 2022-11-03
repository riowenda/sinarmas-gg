import './Header.css';
import React, { useState } from "react";
import {
    IonBadge,
    IonCard,
    IonCol,
    IonIcon,
    IonItem,
    IonLabel,
    IonToggle,
    IonToolbar, useIonToast
} from "@ionic/react";
import { home, notifications } from "ionicons/icons";

interface ContainerProps { }

const Header: React.FC<ContainerProps> = () => {
    const [checked, setChecked] = useState(false);
    const [present] = useIonToast();

    const presentToast = (position: 'top' | 'middle' | 'bottom') => {
        present({
            message: 'Hello World!',
            duration: 1500,
            position: position
        });
    };
    return (
        <>

            <div className="bg-indigo-600">
                <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex w-0 flex-1 items-center">
                            <span className="flex rounded-lg bg-indigo-800 p-2 text-white">
                                <IonIcon icon={home} />
                            </span>
                            <p className="ml-3 truncate font-medium text-white">
                                <span className="md:hidden">We announced a new product!</span>
                                <span className="hidden md:inline">Big news! We're excited to announce a brand new product.</span>
                            </p>
                        </div>
                        <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                            <a
                                href="#"
                                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                            >
                                Learn more
                            </a>
                        </div>
                        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                            <button
                                type="button"
                                className="-mr-1 flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                            >
                                <span className="sr-only">Dismiss</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <IonToolbar className="mx-auto max-w-7xl py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <IonCol size="10" className="slide-content">
                    <img src="/assets/icon/logo_sinarmas.png" className="slide-main-image" />
                </IonCol>
                <IonCol size="10" className="slide-content" slot="end">
                    <img src="/assets/icon/logo_bib.png" className="slide-main-image" />
                </IonCol>
            </IonToolbar>
            <IonCard>
                <IonItem>
                    <IonItem slot="start">
                        <IonToggle checked={checked} onIonChange={e => setChecked(e.detail.checked)} />
                        <IonLabel>English</IonLabel>
                    </IonItem>

                    <IonIcon icon={notifications} slot="end" className="imgNotif"></IonIcon>
                    <IonBadge slot="end" className="labelNotif">11</IonBadge>
                </IonItem>

            </IonCard>
        </>
    );
};

export default Header;
