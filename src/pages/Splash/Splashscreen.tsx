import {
    IonContent, IonFooter,
    IonPage, IonToolbar, useIonRouter, useIonViewDidEnter, useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import React from "react";
import packageJson from '../../../package.json';
import {getPref} from "../../helper/preferences";
import {pref_is_login} from "../../constant/Index";
import {App as CapacitorApp} from "@capacitor/app";


const Splashscreen: React.FC = () => {
    const history = useHistory();

    const ionRouter = useIonRouter();
    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            if (!ionRouter.canGoBack() || history.location.pathname === "/login") {
                CapacitorApp.exitApp();
            }
        });
    });

    useIonViewWillEnter(() => {
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        getPref(pref_is_login).then(r => {
            console.log("rrr "+r);
            setTimeout(function() {
                if (r != null && r == true) {
                    //sukses arahkan ke dashboard
                    history.replace("/dashboard");
                } else {
                    history.replace("/login");
                }
            }, 5000);
        });
    });

    return (
        <IonPage>
            <IonContent>
                <div className="relative h-full bg-gradient-to-r from-red-700 to-red-800">
                    <div className="m-auto absolute left-0 top-0 bottom-0 right-0 ">
                        <div>
                            <div className='m-auto absolute left-0 top-0 bottom-0 right-0 h-24 w-24 flex-shrink-0 rounded-full bg-white z-50'>
                                <img className="m-auto absolute left-0 top-0 bottom-0 right-0 h-16 w-16" src="assets/images/logo-app.png" ></img>
                            </div>
                            <img className="m-auto absolute left-0 top-0 bottom-0 right-0 opacity-0" src="assets/images/bib-logo.png" ></img>
                        </div>
                    </div>
                    <div className='absolute bottom-0 w-full text-xs text-center mt-5 mb-5'>
                        <div className='text-white font-bold'>{packageJson.productName}, v{packageJson.version}</div>
                        <div className='text-white'>Provided by Digitech - GEMS</div>
                        <div className='text-white'>© 2022 PT. Borneo Indobara</div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Splashscreen;
  