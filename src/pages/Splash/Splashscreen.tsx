import {
    IonContent, IonFooter,
    IonPage, IonToolbar, useIonRouter, useIonViewDidEnter, useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import React from "react";
import packageJson from '../../../package.json';
import {
    getFuelMenu,
    getJsonPref,
    getPref,
    setIdentityPref,
    setPref,
    setPrefLng,
    setTokenPref
} from "../../helper/Preferences";
import {
    AUTH_FUEL_MANAGER,
    AUTH_FUEL_STATION,
    FB_NOTIF_TOPIC_PUBLIC, pref_app_version,
    pref_is_login, pref_json_token_identity,
    pref_lng,
    pref_open_notif,
    pref_token_fbnotif
} from "../../constant/Index";
import {App as CapacitorApp} from "@capacitor/app";
import {PushNotifications} from "@capacitor/push-notifications";
import {setPermPref} from "../../helper/PermanentPreferences";
import {privacyDisable} from "../../helper/PrivacyScreenConf";


const Splashscreen: React.FC = () => {
    const history = useHistory();

    const ionRouter = useIonRouter();
    document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
            if (!ionRouter.canGoBack() || history.location.pathname === "/login" || history.location.pathname === "/dashboard" || history.location.pathname === "/homepage-fuel") {
                console.log("Exit App")
                CapacitorApp.exitApp();
            }
        });
    });

    useIonViewWillEnter(() => {
        privacyDisable().then(r => r);
        // AddListenerNotifications().then(l => { });
        // GetDeliveredNotifications().then(n => { });
        getPref(pref_lng).then(l => {
            console.log("default lng "+l);
            if(l == null){
                setPref(pref_lng, "id");
                setPrefLng("id");
            } else {
                setPrefLng(l);
            }
        })
    });

    /* Proses animasi selsai dan sudah sepenuhnya masuk halaman,
    jika load data dilakukan disini sebaiknya diberikan loading screen agar lebih maksimal */
    useIonViewDidEnter(() => {
        registerFCM();
        setPermPref(pref_app_version, packageJson.version).then(data => data);
        getJsonPref(pref_json_token_identity).then(data => {
            if(data != null){
                setTokenPref(data.token);
                setIdentityPref(data.identity);
            }
        });
        getPref(pref_is_login).then(r => {
            console.log("####################### is login "+r);
            setTimeout(function() {
                if (r != null && r == true) {
                    getFuelMenu().then(data => {
                        if(data.includes(AUTH_FUEL_STATION) || data.includes(AUTH_FUEL_MANAGER)){
                            history.replace("/homepage-fuel");
                        } else {
                            //sukses arahkan ke dashboard
                            history.replace("/dashboard");
                        }
                    });
                } else {
                    history.replace("/login");
                }
            }, 3000);
        });
    });

    const registerFCM = () => {
        console.log("--->>>>>>>>>>>>>>LISTENER NOTIFICATION")
        PushNotifications.addListener('registration', token => {
            console.info('--->>>>>>>>>>>>>>Registration token: ', token.value);

            //simpan token firebase
            setPermPref(pref_token_fbnotif, token.value).then(t=>{});
        });

        PushNotifications.addListener('registrationError', err => {
            console.error('--->>>>>>>>>>>>>>Registration error: ', err.error);
        });
    }

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
  